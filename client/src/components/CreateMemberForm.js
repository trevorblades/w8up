import PasswordInput from './PasswordInput';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Stack,
  Switch,
  Text
} from '@chakra-ui/core';
import {LIST_MEMBERS, MEMBER_FRAGMENT} from '../utils';
import {gql, useMutation} from '@apollo/client';

const CREATE_MEMBER = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      ...MemberFragment
    }
  }
  ${MEMBER_FRAGMENT}
`;

export default function CreateMemberForm({onCompleted, organizationId}) {
  const [createNew, setCreateNew] = useState(false);
  const [createMember, {loading, error}] = useMutation(CREATE_MEMBER, {
    onCompleted,
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
            members: [...organization.members, data.createMember]
          }
        }
      });
    }
  });

  function handleSubmit(event) {
    event.preventDefault();

    const {name, username, password, admin} = event.target;
    createMember({
      variables: {
        input: {
          name: name?.value,
          username: username.value.trim(),
          password: password?.value,
          organizationId,
          isAdmin: admin.checked
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <ModalBody as={Stack} spacing="4">
        {error && <Text color="red.500">{error.message}</Text>}
        <Flex align="center">
          <Text mr="3">Create new user?</Text>
          <Switch
            display="flex"
            isChecked={createNew}
            onChange={event => setCreateNew(event.target.checked)}
          />
        </Flex>
        {createNew ? (
          <>
            <FormControl>
              <FormLabel>Full name</FormLabel>
              <Input required placeholder="John Appleseed" name="name" />
            </FormControl>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input required placeholder="Make it unique" name="username" />
            </FormControl>
            <PasswordInput />
          </>
        ) : (
          <Input required size="lg" placeholder="Username" name="username" />
        )}
        <FormControl>
          <Checkbox name="admin">Give admin privileges</Checkbox>
          <FormHelperText>
            Admins can edit organization settings and add/remove members
          </FormHelperText>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button isLoading={loading} type="submit">
          Add member
        </Button>
      </ModalFooter>
    </form>
  );
}

CreateMemberForm.propTypes = {
  onCompleted: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired
};
