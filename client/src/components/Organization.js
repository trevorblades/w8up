import AcceptingSwitch from './AcceptingSwitch';
import Header from './Header';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TabMenu from './TabMenu';
import UserMenu from './UserMenu';
import {Box, Flex, Heading, MenuItem, Spinner, Text} from '@chakra-ui/core';
import {FaArrowLeft} from 'react-icons/fa';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {gql, useQuery} from '@apollo/client';

const GET_ORGANIZATION = gql`
  query GetOrganization($organizationId: ID!) {
    me {
      id
      name
      email
    }
    organization(id: $organizationId) {
      id
      name
      phone
      accepting
      isOwn
    }
  }
`;

export default function Organization({
  uri,
  location,
  children,
  organizationId
}) {
  const {data, loading, error, subscribeToMore} = useQuery(GET_ORGANIZATION, {
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
        <Flex mr={[4, 5]} align="center">
          <Text mr="2">{data.organization.accepting ? 'On' : 'Off'}</Text>
          <AcceptingSwitch
            organization={data.organization}
            subscribeToMore={subscribeToMore}
          />
        </Flex>
        <UserMenu user={data.me}>
          <MenuItem as={GatsbyLink} to="/app">
            <Box as={FaArrowLeft} mr="2" />
            Change organization
          </MenuItem>
        </UserMenu>
      </Header>
      {data.organization.isOwn && (
        <TabMenu
          pathname={location.pathname}
          tabs={{
            Waitlist: uri,
            Settings: `${uri}/settings`,
            Members: `${uri}/members`
          }}
        />
      )}
      {/* FIXME: hack to get around https://github.com/reach/router/issues/145 */}
      {React.cloneElement(children, {component: Fragment})}
    </>
  );
}

Organization.propTypes = {
  organizationId: PropTypes.string,
  uri: PropTypes.string,
  location: PropTypes.object,
  children: PropTypes.node.isRequired
};
