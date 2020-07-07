import CreateMemberButton from './CreateMemberButton';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveMemberButton from './RemoveMemberButton';
import {
  Avatar,
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/core';
import {LIST_MEMBERS} from '../utils';
import {useQuery} from '@apollo/client';

export default function Members({organizationId}) {
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

  if (!data.organization.isOwn) {
    return <Text>You do not have access to this page</Text>;
  }

  return (
    <Box p={[4, 5]} w="full" maxW="container.lg" mx="auto">
      <Flex mb="4" align="center" justify="space-between  ">
        <Heading fontSize="2xl">
          Members ({data.organization.members.length})
        </Heading>
        <CreateMemberButton organizationId={organizationId} />
      </Flex>
      <Stack as={List} spacing="3">
        {data.organization.members.map(member => (
          <ListItem display="flex" alignItems="center" key={member.id}>
            <Avatar mr="3" fontSize="md" name={member.name} size="sm" />
            {member.name} &lt;{member.email}&gt;
            {!member.isAdmin && (
              <RemoveMemberButton
                member={member}
                organizationId={organizationId}
              />
            )}
          </ListItem>
        ))}
      </Stack>
    </Box>
  );
}

Members.propTypes = {
  organizationId: PropTypes.string
};
