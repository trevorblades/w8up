import Header from './Header';
import OrgSettingsForm, {ORG_DETAILS_FRAGMENT} from './OrgSettingsForm';
import PropTypes from 'prop-types';
import React from 'react';
import UserMenu from './UserMenu';
import {Box, Heading, Link, Spinner, Text} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {USER_FRAGMENT} from '../utils';
import {gql, useQuery} from '@apollo/client';

const GET_ORG_DETAILS = gql`
  query GetOrgDetails($organizationId: ID!) {
    me {
      ...UserFragment
    }
    organization(id: $organizationId) {
      phone
      ...OrgDetailsFragment
    }
  }
  ${USER_FRAGMENT}
  ${ORG_DETAILS_FRAGMENT}
`;

export default function SettingsInner({organizationId}) {
  const {data, loading, error} = useQuery(GET_ORG_DETAILS, {
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
          <Heading fontSize="xl" fontWeight="medium">
            Organization settings
          </Heading>
          <Text color="gray.500" fontSize="sm" lineHeight="normal">
            <Link as={GatsbyLink} to={`/app/list/${data.organization.id}`}>
              {data.organization.name}
            </Link>
          </Text>
        </Box>
        <UserMenu user={data.me} />
      </Header>
      <OrgSettingsForm organization={data.organization} />
    </>
  );
}

SettingsInner.propTypes = {
  organizationId: PropTypes.string.isRequired
};
