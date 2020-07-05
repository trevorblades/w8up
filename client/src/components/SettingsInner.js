import Header from './Header';
import OrgSettingsForm, {DETAILS_FRAGMENT} from './OrgSettingsForm';
import PropTypes from 'prop-types';
import React from 'react';
import TabMenu from './TabMenu';
import UserMenu from './UserMenu';
import {Box, Heading, Spinner, Text} from '@chakra-ui/core';
import {Helmet} from 'react-helmet';
import {USER_FRAGMENT} from '../utils';
import {gql, useQuery} from '@apollo/client';

const GET_DETAILS = gql`
  query GetDetails($organizationId: ID!) {
    me {
      ...UserFragment
    }
    organization(id: $organizationId) {
      phone
      isAdmin
      ...DetailsFragment
    }
  }
  ${USER_FRAGMENT}
  ${DETAILS_FRAGMENT}
`;

export default function SettingsInner({organizationId}) {
  const {data, loading, error} = useQuery(GET_DETAILS, {
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

  if (!data.organization.isAdmin) {
    return <Text>You do not have access to this page</Text>;
  }

  return (
    <>
      <Helmet>
        <title>{data.organization.name}</title>
      </Helmet>
      <Header>
        <Box mr="auto">
          <Heading fontSize="xl">Organization settings</Heading>
          <Text color="gray.500" fontSize="sm" lineHeight="normal">
            {data.organization.name}
          </Text>
        </Box>
        <UserMenu user={data.me} isViewingOrg />
      </Header>
      <TabMenu index={1} organization={data.organization} />
      <OrgSettingsForm organization={data.organization} />
    </>
  );
}

SettingsInner.propTypes = {
  organizationId: PropTypes.string.isRequired
};
