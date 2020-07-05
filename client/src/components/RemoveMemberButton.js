import PropTypes from 'prop-types';
import React from 'react';
import {FaTimes} from 'react-icons/fa';
import {IconButton} from '@chakra-ui/core';
import {LIST_MEMBERS} from '../utils';
import {gql, useMutation} from '@apollo/client';

const REMOVE_MEMBER = gql`
  mutation RemoveMember($input: RemoveMemberInput!) {
    removeMember(input: $input) {
      id
    }
  }
`;

export default function RemoveMemberButton({organizationId, member}) {
  const [removeMember, {loading}] = useMutation(REMOVE_MEMBER, {
    variables: {
      input: {
        organizationId,
        userId: member.id
      }
    },
    update(cache, {data}) {
      const queryOptions = {
        query: LIST_MEMBERS,
        variables: {
          organizationId
        }
      };

      const {me, organization} = cache.readQuery(queryOptions);
      cache.writeQuery({
        ...queryOptions,
        data: {
          me,
          organization: {
            ...organization,
            members: organization.members.filter(
              user => user.id !== data.removeMember.id
            )
          }
        }
      });
    }
  });

  function handleClick() {
    if (
      confirm(
        `Are you sure you want to remove "${member.name}" from your organization?`
      )
    ) {
      removeMember();
    }
  }

  return (
    <IconButton
      isLoading={loading}
      onClick={handleClick}
      variant="ghost"
      ml="auto"
      size="sm"
      icon={<FaTimes />}
    />
  );
}

RemoveMemberButton.propTypes = {
  organizationId: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired
};
