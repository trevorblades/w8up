import CreateMemberButton from './CreateMemberButton';
import Header from './Header';
import PropTypes from 'prop-types';
import React from 'react';
import TabMenu from './TabMenu';
import UserMenu from './UserMenu';
import {Box, Heading, List, ListItem, Spinner, Text} from '@chakra-ui/core';
import {Helmet} from 'react-helmet';
import {LIST_MEMBERS} from '../utils';
import {useQuery} from '@apollo/client';

export default function MembersInner({organizationId}) {
  const {data, loading, error} = useQuery(LIST_MEMBERS, {
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
          <Heading fontSize="xl" fontWeight="medium">
            Configure members
          </Heading>
          <Text color="gray.500" fontSize="sm" lineHeight="normal">
            {data.organization.name}
          </Text>
        </Box>
        <UserMenu user={data.me} isViewingOrg />
      </Header>
      <TabMenu index={2} organization={data.organization} />
      <Box p={[4, 5]} w="full" maxW="container.lg" mx="auto">
        <CreateMemberButton organizationId={organizationId} />
        <List>
          {data.organization.members.map(member => (
            <ListItem key={member.id}>{member.name}</ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

MembersInner.propTypes = {
  organizationId: PropTypes.string.isRequired
};
