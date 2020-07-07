import CreateOrgForm from './CreateOrgForm';
import Header from './Header';
import OrganizationList from './OrganizationList';
import React from 'react';
import UserMenu from './UserMenu';
import {Box, Heading, Spinner, Text} from '@chakra-ui/core';
import {Elements} from '@stripe/react-stripe-js';
import {Helmet} from 'react-helmet';
import {LIST_ORGANIZATIONS} from '../utils';
import {loadStripe} from '@stripe/stripe-js';
import {useQuery} from '@apollo/client';

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);

export default function Organizations() {
  const {data, loading, error, subscribeToMore} = useQuery(LIST_ORGANIZATIONS);

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
            <OrganizationList data={data} subscribeToMore={subscribeToMore} />
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
