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

export const LIST_ORGANIZATIONS = gql`
  query ListOrganizations {
    me {
      id
      name
      defaultSource {
        last4
        brand
      }
    }
    organizations {
      ...OrganizationFragment
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export const WAITLIST_QUERY = gql`
  query WaitlistQuery($organizationId: ID!) {
    me {
      id
      name
      email
      nowServing {
        name
      }
    }
    organization(id: $organizationId) {
      ...OrganizationFragment
      customers(served: false) {
        ...CustomerFragment
      }
    }
  }
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
