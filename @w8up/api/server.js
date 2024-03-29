import basicAuth from 'basic-auth';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import twilio from 'twilio';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import {
  CUSTOMER_ADDED,
  CUSTOMER_REMOVED,
  CUSTOMER_UPDATED,
  pubsub,
  resolvers,
  typeDefs
} from './schema';
import {createWelcomeMessage} from '@w8up/common';

const db = knex(process.env.DATABASE_URL);
const app = express();

const origin =
  process.env.NODE_ENV === 'production'
    ? 'https://w8up.trevorblades.com'
    : /http:\/\/localhost:\d{4}/;

app.use(cors({origin}));
app.use(express.urlencoded({extended: false}));

app.get('/auth', async (req, res) => {
  const credentials = basicAuth(req);

  try {
    const user = await db('users')
      .where('email', credentials.name)
      .first();

    if (!user || !bcrypt.compareSync(credentials.pass, user.password)) {
      throw new Error('Unauthorized');
    }

    const token = jwt.sign({name: user.name}, process.env.JWT_SECRET, {
      subject: user.id.toString()
    });

    res.send(token);
  } catch (error) {
    res.sendStatus(401);
  }
});

app.post('/sms', async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();

  const organization = await db('organizations')
    .where('phone', req.body.To)
    .first();

  switch (req.body.Body.trim().toLowerCase()) {
    case organization.keyword.trim().toLowerCase(): {
      const condition = {
        servedAt: null,
        phone: req.body.From,
        organizationId: organization.id
      };

      const matches = await db('customers').where(condition);

      if (matches.length) {
        const [customerRemoved] = await db('customers')
          .where(condition)
          .del()
          .returning('*');

        twiml.message(organization.removedMessage);
        pubsub.publish(CUSTOMER_REMOVED, {customerRemoved});
      } else {
        twiml.message(organization.notRemovedMessage);
      }
      break;
    }
    default: {
      if (organization.accepting) {
        const customer = await db('customers')
          .where({
            servedAt: null,
            phone: req.body.From,
            organizationId: organization.id
          })
          .first();

        if (customer) {
          await db('messages').insert({
            text: req.body.Body,
            customerId: customer.id
          });

          pubsub.publish(CUSTOMER_UPDATED, {customerUpdated: customer});
          return;
        }

        const {count: peopleAhead} = await db('customers')
          .count('id')
          .whereNull('servedAt')
          .andWhere('organizationId', organization.id)
          .first();

        if (peopleAhead < organization.queueLimit) {
          const message = createWelcomeMessage(organization, peopleAhead);
          twiml.message(message);

          const [customerAdded] = await db('customers')
            .insert({
              name: req.body.Body,
              phone: req.body.From,
              organizationId: organization.id
            })
            .returning('*');

          pubsub.publish(CUSTOMER_ADDED, {customerAdded});
        } else {
          twiml.message(organization.limitExceededMessage);
        }
      } else {
        twiml.message(organization.notAcceptingMessage);
      }
    }
  }

  // send SMS reply
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    async onConnect({authToken}) {
      if (!authToken) {
        throw new Error('Missing auth token');
      }

      const {sub} = jwt.verify(authToken, process.env.JWT_SECRET);
      const organizations = await db('members')
        .where('userId', sub)
        .pluck('organizationId');

      return {
        db,
        organizations
      };
    }
  },
  async context({req, connection}) {
    if (connection) {
      return connection.context;
    }

    const matches = req.headers.authorization.match(/^bearer (\S+)$/i);
    const {sub} = jwt.verify(matches[1], process.env.JWT_SECRET);
    const user = await db('users')
      .where('id', sub)
      .first();

    if (!user) {
      throw new AuthenticationError('Unauthorized');
    }

    return {
      db,
      user
    };
  }
});

server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(process.env.PORT, () =>
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  )
);
