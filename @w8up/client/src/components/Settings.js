import PropTypes from 'prop-types';
import React from 'react';
import SettingsForm, {SETTINGS_FRAGMENT} from './SettingsForm';
import {Box, Spinner, Text} from '@chakra-ui/core';
import {gql, useQuery} from '@apollo/client';

const GET_SETTINGS = gql`
  query GetSettings($organizationId: ID!) {
    organization(id: $organizationId) {
      ...SettingsFragment
    }
  }
  ${SETTINGS_FRAGMENT}
`;

export default function Settings({organizationId}) {
  const {data, loading, error} = useQuery(GET_SETTINGS, {
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

  if (!data.organization.isOwn) {
    return <Text>You do not have access to this page</Text>;
  }

  return <SettingsForm organization={data.organization} />;
}

Settings.propTypes = {
  organizationId: PropTypes.string
};
