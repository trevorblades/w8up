import AcceptingSwitch from './AcceptingSwitch';
import Header from './Header';
import PropTypes from 'prop-types';
import React from 'react';
import TabMenu from './TabMenu';
import UserMenu from './UserMenu';
import Waitlist from './Waitlist';
import {Box, Flex, Heading, Spinner, Text} from '@chakra-ui/core';
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
    return <Text color="red.500">{error.message}</Text>;
  }

  return (
    <>
      <Helmet>
        <title>{data.organization.name}</title>
      </Helmet>
      <Header>
        <Box mr="auto">
          <Heading fontSize="xl">{data.organization.name}</Heading>
          <Text color="gray.500" fontSize="sm" lineHeight="normal">
            {data.organization.phone}
          </Text>
        </Box>
        <Flex mr="6" align="center">
          <Text mr="2">{data.organization.accepting ? 'On' : 'Off'}</Text>
          <AcceptingSwitch
            organization={data.organization}
            subscribeToMore={subscribeToMore}
          />
        </Flex>
        <UserMenu user={data.me} isViewingOrg />
      </Header>
      {data.organization.isAdmin && (
        <TabMenu index={0} organization={data.organization} />
      )}
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
