import PropTypes from 'prop-types';
import React from 'react';
import WaitlistLoaded from './WaitlistLoaded';
import {Box, Spinner, Text} from '@chakra-ui/core';
import {CUSTOMER_FRAGMENT} from '../utils';
import {gql, useQuery} from '@apollo/client';

const LIST_CUSTOMERS = gql`
  query ListCustomers($organizationId: ID!) {
    me {
      id
      nowServing {
        name
      }
    }
    organization(id: $organizationId) {
      id
      customers(served: false) {
        ...CustomerFragment
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

export default function Waitlist({organizationId}) {
  const {data, loading, error, subscribeToMore} = useQuery(LIST_CUSTOMERS, {
    fetchPolicy: 'network-only',
    variables: {
      organizationId
    }
  });

  if (loading) {
    return (
      <Box m="auto">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">{error.message}</Text>;
  }

  return (
    <WaitlistLoaded
      customers={data.organization.customers}
      nowServing={data.me.nowServing}
      subscribeToMore={subscribeToMore}
      update={(cache, {data}) => {
        const queryOptions = {
          query: LIST_CUSTOMERS,
          variables: {
            organizationId
          }
        };

        const {me, organization} = cache.readQuery(queryOptions);
        cache.writeQuery({
          ...queryOptions,
          data: {
            organization,
            me: {
              ...me,
              nowServing: data.serveCustomer
            }
          }
        });
      }}
    />
  );
}

Waitlist.propTypes = {
  organizationId: PropTypes.string
};
