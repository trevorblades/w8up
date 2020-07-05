import CreateOrgButton from './CreateOrgButton';
import CreateOrgForm from './CreateOrgForm';
import Header from './Header';
import React from 'react';
import UserMenu from './UserMenu';
import {Badge, Box, Flex, Heading, Spinner, Stack, Text} from '@chakra-ui/core';
import {Elements} from '@stripe/react-stripe-js';
import {FiArrowRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {LIST_ORGANIZATIONS} from '../utils';
import {loadStripe} from '@stripe/stripe-js';
import {useQuery} from '@apollo/client';

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);

export default function AppInner() {
  const {data, loading, error} = useQuery(LIST_ORGANIZATIONS);

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
    <>
      <Helmet>
        <title>Organizations</title>
      </Helmet>
      <Header>
        <Heading mr="auto" fontSize="2xl">
          Organizations
        </Heading>
        <UserMenu user={data.me} />
      </Header>
      <Box w="full" maxW="container.md" m="auto" p="8">
        <Elements stripe={stripePromise}>
          {data.organizations.length ? (
            <>
              <Stack mb="4">
                {data.organizations.map(organization => (
                  <Flex
                    align="center"
                    justify="space-between"
                    borderRadius="lg"
                    p="3"
                    borderWidth="1px"
                    as={GatsbyLink}
                    to={`/app/list/${organization.id}`}
                    key={organization.id}
                    _hover={{bg: 'gray.50'}}
                    _active={{bg: 'gray.100'}}
                  >
                    <div>
                      <Flex align="center">
                        <Text fontWeight="medium">{organization.name}</Text>
                        <Badge
                          ml="2"
                          colorScheme={organization.accepting ? 'green' : 'red'}
                        >
                          {organization.accepting ? 'On' : 'Off'}
                        </Badge>
                      </Flex>
                      <Text lineHeight="normal" fontSize="sm" color="gray.500">
                        {organization.phone}
                      </Text>
                    </div>
                    <Box as={FiArrowRight} fontSize="xl" mx="1" />
                  </Flex>
                ))}
              </Stack>
              <CreateOrgButton defaultSource={data.me.defaultSource} />
            </>
          ) : (
            <>
              <Heading fontSize="3xl">Create an organization</Heading>
              <CreateOrgForm defaultSource={data.me.defaultSource} />
            </>
          )}
        </Elements>
      </Box>
    </>
  );
}
