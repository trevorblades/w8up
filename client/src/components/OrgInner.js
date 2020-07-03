import AcceptingSwitch from './AcceptingSwitch';
import Header from './Header';
import PropTypes from 'prop-types';
import React from 'react';
import UserMenu from './UserMenu';
import Waitlist from './Waitlist';
import {Box, Button, Flex, Heading, Spinner, Text} from '@chakra-ui/core';
import {FaArrowLeft} from 'react-icons/fa';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {WAITLIST_QUERY} from '../utils';
import {useQuery} from '@apollo/client';

export default function OrgInner({organizationId}) {
  const {data, loading, error, subscribeToMore} = useQuery(WAITLIST_QUERY, {
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
    return (
      <Box m="auto" textAlign="center">
        <Text color="red.500">{error.message}</Text>
        <Button size="sm" leftIcon={<FaArrowLeft />} as={GatsbyLink} to="/app">
          Go back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>{data.organization.name}</title>
      </Helmet>
      <Header>
        <Box mr="auto">
          <Heading fontSize="xl" fontWeight="medium">
            Waitlist
          </Heading>
          <Text color="gray.500" fontSize="sm" lineHeight="normal">
            {data.organization.name}
          </Text>
        </Box>
        <Flex mr="6" align="center">
          <Text mr="2">{data.organization.accepting ? 'On' : 'Off'}</Text>
          <AcceptingSwitch
            organization={data.organization}
            subscribeToMore={subscribeToMore}
          />
        </Flex>
        <UserMenu user={data.me} organization={data.organization} />
      </Header>
      <Waitlist
        organizationId={organizationId}
        customers={data.organization.customers}
        nowServing={data.me.nowServing}
        subscribeToMore={subscribeToMore}
      />
    </>
  );
}

OrgInner.propTypes = {
  organizationId: PropTypes.string.isRequired
};
