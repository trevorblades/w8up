import NextButton from './NextButton';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import RemoveButton from './RemoveButton';
import ServeButton from './ServeButton';
import Timer from './Timer';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import {Box, Flex, List, ListItem, Stack, Text} from '@chakra-ui/core';
import {CUSTOMER_FRAGMENT, MESSAGE_FRAGMENT, WAITLIST_QUERY} from '../utils';
import {FaArrowRight} from 'react-icons/fa';
import {gql} from '@apollo/client';

const ON_CUSTOMER_ADDED = gql`
  subscription OnCustomerAdded {
    customerAdded {
      ...CustomerFragment
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

const ON_CUSTOMER_UPDATED = gql`
  subscription OnCustomerUpdated {
    customerUpdated {
      id
      messages {
        ...MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

const ON_CUSTOMER_REMOVED = gql`
  subscription OnCustomerRemoved {
    customerRemoved {
      id
    }
  }
`;

export default function Waitlist({
  customers,
  nowServing,
  subscribeToMore,
  organizationId
}) {
  useEffectOnce(() =>
    subscribeToMore({
      document: ON_CUSTOMER_ADDED,
      updateQuery: (prev, {subscriptionData}) => ({
        ...prev,
        organization: {
          ...prev.organization,
          customers: [
            subscriptionData.data.customerAdded,
            ...prev.organization.customers
          ]
        }
      })
    })
  );

  useEffectOnce(() => subscribeToMore({document: ON_CUSTOMER_UPDATED}));

  useEffectOnce(() =>
    subscribeToMore({
      document: ON_CUSTOMER_REMOVED,
      updateQuery: (prev, {subscriptionData}) => ({
        ...prev,
        organization: {
          ...prev.organization,
          customers: prev.organization.customers.filter(
            customer => customer.id !== subscriptionData.data.customerRemoved.id
          )
        }
      })
    })
  );

  const update = useCallback(
    (cache, result) => {
      const queryOptions = {
        query: WAITLIST_QUERY,
        variables: {
          organizationId
        }
      };

      const data = cache.readQuery(queryOptions);
      cache.writeQuery({
        ...queryOptions,
        data: {
          ...data,
          me: {
            ...data.me,
            nowServing: result.data.serveCustomer
          }
        }
      });
    },
    [organizationId]
  );

  return (
    <>
      <List px={{lg: 6}}>
        {customers.map((customer, index) => (
          <ListItem mx="auto" maxW="container.lg" key={customer.id}>
            {/* TODO: consider using a stack with divider */}
            <Box
              py={[3, 4]}
              px={{
                base: 5,
                sm: 6,
                lg: 0
              }}
              borderTopWidth={index && '1px'}
            >
              <Text fontSize="xl" fontWeight="medium">
                {index + 1}. {customer.phone}
              </Text>
              <Text>{customer.name}</Text>
              {customer.messages.map(message => (
                <Text key={message.id}>{message.text}</Text>
              ))}
              <Stack align="center" direction="row" spacing="2" mt="3">
                <ServeButton
                  mutationOptions={{
                    update,
                    variables: {
                      id: customer.id
                    }
                  }}
                />
                <RemoveButton customer={customer} />
                <Text fontSize="sm" color="gray.500">
                  <Timer date={new Date(customer.waitingSince)} />
                </Text>
              </Stack>
            </Box>
          </ListItem>
        ))}
      </List>
      <Box
        px={[5, 6]}
        py="3"
        bg="gray.900"
        color="white"
        mt="auto"
        position="sticky"
        bottom="0"
      >
        <Flex maxW="container.lg" mx="auto" align="center">
          {nowServing && (
            <Box mr="4" overflow="hidden">
              <Text color="gray.500" fontWeight="medium" fontSize="sm">
                Now serving
              </Text>
              <Text fontWeight="medium" isTruncated>
                {nowServing.name}
              </Text>
            </Box>
          )}
          <NextButton
            size="lg"
            borderRadius="full"
            colorScheme="green"
            ml="auto"
            rightIcon={<FaArrowRight />}
            flexShrink="0"
            isDisabled={!customers.length}
            mutationOptions={{
              update,
              variables: {
                id: customers[0]?.id
              }
            }}
          />
        </Flex>
      </Box>
    </>
  );
}

Waitlist.propTypes = {
  subscribeToMore: PropTypes.func.isRequired,
  nowServing: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
  customers: PropTypes.array.isRequired
};
