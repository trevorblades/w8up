import Stripe from 'stripe';
import twilio from 'twilio';
import {
  ForbiddenError,
  PubSub,
  UserInputError,
  gql,
  withFilter
} from 'apollo-server-express';
import {GraphQLDateTime} from 'graphql-iso-date';

export const typeDefs = gql`
  scalar DateTime

  type Query {
    organization(id: ID!): Organization!
    organizations: [Organization!]!
    phoneNumbers(limit: Int!): [PhoneNumber!]!
    me: User!
  }

  type Mutation {
    serveCustomer(id: ID!): Customer!
    removeCustomer(id: ID!): Customer
    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(input: UpdateOrganizationInput!): Organization!
  }

  type Subscription {
    customerAdded: Customer
    customerUpdated: Customer
    customerRemoved: Customer
    organizationUpdated: Organization
  }

  input CreateOrganizationInput {
    name: String!
    phone: String!
    source: String!
    plan: String!
  }

  input UpdateOrganizationInput {
    id: ID!
    name: String
    accepting: Boolean
    queueLimit: Int
    averageHandleTime: Int
    activeAgents: Int
    keyword: String
    person: String
    welcomeMessage: String
    queueMessage: String
    queueEmptyMessage: String
    notAcceptingMessage: String
    readyMessage: String
    removedMessage: String
    notRemovedMessage: String
    limitExceededMessage: String
  }

  type Customer {
    id: ID!
    name: String!
    phone: String!
    waitingSince: DateTime!
    servedAt: DateTime
    servedBy: User
    messages: [Message!]!
  }

  type Message {
    id: ID!
    text: String!
    sentAt: DateTime!
  }

  type Organization {
    id: ID!
    name: String!
    phone: String!
    accepting: Boolean!
    queueLimit: Int!
    averageHandleTime: Int!
    activeAgents: Int!
    keyword: String!
    person: String!
    welcomeMessage: String!
    queueMessage: String!
    queueEmptyMessage: String!
    notAcceptingMessage: String!
    readyMessage: String!
    removedMessage: String!
    notRemovedMessage: String!
    limitExceededMessage: String!
    customers(served: Boolean!): [Customer!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    nowServing: Customer
  }

  type PhoneNumber {
    friendlyName: String!
    phoneNumber: String!
  }
`;

export const CUSTOMER_ADDED = 'CUSTOMER_ADDED';
export const CUSTOMER_UPDATED = 'CUSTOMER_UPDATED';
export const CUSTOMER_REMOVED = 'CUSTOMER_REMOVED';
const ORGANIZATION_UPDATED = 'ORGANIZATION_UPDATED';

export const pubsub = new PubSub();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    organizations: (parent, args, {db, user}) =>
      db('organizations')
        .join('members', 'organizations.id', '=', 'members.organizationId')
        .where('members.userId', user.id),
    async organization(parent, {id}, {db, user}) {
      const organizations = await db('members')
        .where('userId', user.id)
        .pluck('organizationId');

      if (!organizations.includes(id)) {
        throw new ForbiddenError('You do not have access to this organization');
      }

      return db('organizations')
        .where({id})
        .first();
    },
    phoneNumbers: (parent, {limit}) =>
      client.availablePhoneNumbers('US').tollFree.list({limit}),
    me: (parent, args, {user}) => user
  },
  Subscription: {
    customerAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CUSTOMER_ADDED),
        (payload, args, {organizations}) =>
          organizations.includes(payload.customerAdded.organizationId)
      )
    },
    customerUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CUSTOMER_UPDATED),
        (payload, args, {organizations}) =>
          organizations.includes(payload.customerUpdated.organizationId)
      )
    },
    customerRemoved: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CUSTOMER_REMOVED),
        (payload, args, {organizations}) =>
          organizations.includes(payload.customerRemoved.organizationId)
      )
    },
    organizationUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ORGANIZATION_UPDATED),
        (payload, args, {organizations}) =>
          organizations.includes(payload.organizationUpdated.id)
      )
    }
  },
  Mutation: {
    async serveCustomer(parent, args, {db, user}) {
      const query = db('customers').where(args);
      const customer = await query.first();

      if (!customer) {
        throw new UserInputError('Invalid customer');
      }

      const organization = await db('organizations')
        .join('members', 'organizations.id', '=', 'members.organizationId')
        .where({
          id: customer.organizationId,
          'members.userId': user.id
        })
        .first();

      if (!organization) {
        throw new ForbiddenError('You do not have access to this customer');
      }

      const message = await client.messages.create({
        body: organization.readyMessage,
        from: organization.phone,
        to: customer.phone
      });

      const [customerRemoved] = await query
        .update({
          receipt: message.sid,
          servedAt: new Date(),
          servedBy: user.id
        })
        .returning('*');

      pubsub.publish(CUSTOMER_REMOVED, {customerRemoved});

      return customerRemoved;
    },
    async removeCustomer(parent, args, {db, user}) {
      const query = db('customers').where(args);
      const [id] = await query.pluck('organizationId');

      const organizations = await db('members')
        .where('userId', user.id)
        .pluck('organizationId');

      if (!organizations.includes(id)) {
        throw new ForbiddenError('You do not have access to this customer');
      }

      const [customerRemoved] = await query.del().returning('*');

      pubsub.publish(CUSTOMER_REMOVED, {customerRemoved});

      return customerRemoved;
    },
    async createOrganization(parent, {input}, {db, user}) {
      let {customerId} = user;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          source: input.source
        });

        await db('users')
          .update('customerId', customer.id)
          .where('id', user.id);

        customerId = customer.id;
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{plan: input.plan}]
      });

      const {phoneNumber} = await client.incomingPhoneNumbers.create({
        phoneNumber: input.phone
      });

      const [organization] = await db('organizations')
        .insert({
          name: input.name,
          phone: phoneNumber,
          queueLimit: 20,
          activeAgents: 3,
          averageHandleTime: 20,
          keyword: 'REMOVE',
          person: 'person',
          welcomeMessage:
            'Hello! You are on the list. {QUEUE_MESSAGE} We will text you when you\'re up next. Reply "{KEYWORD}" at any time to remove yourself from the list.',
          queueMessage:
            'There {IS} {PERSON} ahead of you. The approximate wait time is {ESTIMATED_WAIT_TIME} minutes.',
          queueEmptyMessage: 'There is nobody ahead of you.',
          notAcceptingMessage:
            'We have stopped accepting customers for today. Please visit our website for our store hours.',
          readyMessage:
            "We're ready to serve you now. Please head over within the next 5 minutes.",
          removedMessage: 'You have been removed from the list.',
          notRemovedMessage: 'You are not on the list.',
          limitExceededMessage:
            'The list is currently full. Please try again later.',
          subscriptionId: subscription.id,
          accepting: false
        })
        .returning('*');

      await db('members').insert({
        userId: user.id,
        organizationId: organization.id,
        admin: true
      });

      return organization;
    },
    async updateOrganization(parent, args, {db, user}) {
      const {id, ...input} = args.input;
      const isToggling =
        'accepting' in input && Object.keys(input).length === 1;

      const where = {userId: user.id};
      if (!isToggling) {
        where.admin = true;
      }

      const organizations = await db('members')
        .where(where)
        .pluck('organizationId');

      if (!organizations.includes(id)) {
        throw new ForbiddenError('You do not have access to this organization');
      }

      const [organizationUpdated] = await db('organizations')
        .where({id})
        .update(input)
        .returning('*');

      if (isToggling) {
        pubsub.publish(ORGANIZATION_UPDATED, {organizationUpdated});
      }

      return organizationUpdated;
    }
  },
  Customer: {
    servedBy: (customer, args, {db}) =>
      customer.servedBy &&
      db('users')
        .where('id', customer.servedBy)
        .first(),
    messages: (customer, args, {db}) =>
      db('messages').where('customerId', customer.id)
  },
  Organization: {
    async customers(organization, {served}, {db, user}) {
      const organizations = await db('members')
        .where('userId', user.id)
        .pluck('organizationId');

      if (!organizations.includes(organization.id)) {
        throw new ForbiddenError('You do not have access to these customers');
      }

      const query = db('customers')
        .where('organizationId', organization.id)
        [served ? 'whereNotNull' : 'whereNull']('servedAt')
        .orderBy(served ? 'servedAt' : 'waitingSince', served ? 'desc' : 'asc');
      return served
        ? query.whereRaw('"servedAt" > now() - interval \'7 days\'')
        : query;
    }
  },
  User: {
    nowServing: (user, args, {db}) =>
      db('customers')
        .where('servedBy', user.id)
        .orderBy('servedAt', 'desc')
        .first()
  }
};
