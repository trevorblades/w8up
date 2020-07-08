import CreateOrganizationForm from './CreateOrganizationForm';
import Header from './Header';
import OrganizationList from './OrganizationList';
import React from 'react';
import UserMenu from './UserMenu';
import {Box, Button, Heading, Spinner, Text} from '@chakra-ui/core';
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
      <Header>
        <Heading mr="auto" fontSize="2xl">
          Organizations
        </Heading>
        <UserMenu user={data.me} />
      </Header>
      <Box w="full" maxW="container.sm" m="auto" p={[4, 5]}>
        <Elements stripe={stripePromise}>
          {data.organizations.length ? (
            <>
              <Helmet>
                <title>Organizations</title>
              </Helmet>
              <OrganizationList data={data} subscribeToMore={subscribeToMore} />
            </>
          ) : (
            <>
              <Helmet>
                <title>New organization</title>
              </Helmet>
              <Heading mb="4" fontSize="3xl">
                New organization
              </Heading>
              <CreateOrganizationForm
                defaultSource={data.me.defaultSource}
                renderButton={buttonProps => (
                  <Button
                    {...buttonProps}
                    colorScheme="green"
                    size="lg"
                    mt="6"
                    isFullWidth
                  />
                )}
              />
            </>
          )}
        </Elements>
      </Box>
    </>
  );
}
