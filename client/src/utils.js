import {createContext} from 'react';
import {gql} from '@apollo/client';

export const LogOutContext = createContext();

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    text
    sentAt
  }
`;

export const CUSTOMER_FRAGMENT = gql`
  fragment CustomerFragment on Customer {
    id
    name
    phone
    waitingSince
    messages {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const ORGANIZATION_FRAGMENT = gql`
  fragment OrganizationFragment on Organization {
    id
    name
    phone
    accepting
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
    email
  }
`;

export const LIST_ORGANIZATIONS = gql`
  query ListOrganizations {
    me {
      ...UserFragment
      defaultSource {
        last4
        brand
      }
    }
    organizations {
      ...OrganizationFragment
    }
  }
  ${USER_FRAGMENT}
  ${ORGANIZATION_FRAGMENT}
`;

export const WAITLIST_QUERY = gql`
  query WaitlistQuery($organizationId: ID!) {
    me {
      ...UserFragment
      nowServing {
        name
      }
    }
    organization(id: $organizationId) {
      ...OrganizationFragment
      isAdmin
      customers(served: false) {
        ...CustomerFragment
      }
    }
  }
  ${USER_FRAGMENT}
  ${ORGANIZATION_FRAGMENT}
  ${CUSTOMER_FRAGMENT}
`;

export const SERVE_CUSTOMER = gql`
  mutation ServeCustomer($id: ID!) {
    serveCustomer(id: $id) {
      ...CustomerFragment
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

export const MEMBER_FRAGMENT = gql`
  fragment MemberFragment on User {
    ...UserFragment
    isAdmin
  }
  ${USER_FRAGMENT}
`;

export const LIST_MEMBERS = gql`
  query ListMembers($organizationId: ID!) {
    me {
      ...UserFragment
    }
    organization(id: $organizationId) {
      id
      name
      isAdmin
      members {
        ...MemberFragment
      }
    }
  }
  ${MEMBER_FRAGMENT}
`;
