import CreateOrgButton, {BUTTON_PROPS} from './CreateOrgButton';
import CreateOrgForm from './CreateOrgForm';
import React from 'react';
import UserStatus from './UserStatus';
import {
  Badge,
  Box,
  Button,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/core';
import {Elements} from '@stripe/react-stripe-js';
import {Link as GatsbyLink} from 'gatsby';
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
    <Box w="full" maxW="containers.md" m="auto">
      <Elements stripe={stripePromise}>
        {data.organizations.length ? (
          <Grid gap="4" templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
            {data.organizations.map(organization => (
              <Button
                {...BUTTON_PROPS}
                p="5"
                as={GatsbyLink}
                to={`/app/o/${organization.id}`}
                key={organization.id}
              >
                <Stack spacing="1" align="center">
                  <Text>{organization.name}</Text>
                  <Text fontSize="md" fontWeight="normal" color="gray.500">
                    {organization.phone}
                  </Text>
                  <Badge
                    variantColor={organization.accepting ? 'green' : 'red'}
                  >
                    {organization.accepting ? 'On' : 'Off'}
                  </Badge>
                </Stack>
              </Button>
            ))}
            <CreateOrgButton defaultSource={data.me.defaultSource} />
          </Grid>
        ) : (
          <>
            <Heading fontSize="3xl">Create an organization</Heading>
            <CreateOrgForm defaultSource={data.me.defaultSource} />
          </>
        )}
      </Elements>
      <UserStatus user={data.me} />
    </Box>
  );
}
