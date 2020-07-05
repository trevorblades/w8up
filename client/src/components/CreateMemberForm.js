import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalFooter,
  Stack,
  Text
} from '@chakra-ui/core';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {LIST_MEMBERS, MEMBER_FRAGMENT} from '../utils';
import {generate} from 'generate-password';
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
  const [passwordShown, setPasswordShown] = useState(true);
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
          name: name.value,
          username: username.value.trim(),
          password: password.value,
          organizationId,
          isAdmin: admin.checked
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody as={Stack} spacing="4">
        {error && <Text color="red.500">{error.message}</Text>}
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input required placeholder="John Appleseed" name="name" />
        </FormControl>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input required placeholder="Must be unique" name="username" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              required
              defaultValue={generate({
                length: 10,
                numbers: true
              })}
              name="password"
              type={passwordShown ? 'text' : 'password'}
            />
            <InputRightElement>
              <IconButton
                size="sm"
                variant="ghost"
                fontSize="lg"
                onClick={() =>
                  setPasswordShown(prevPasswordShown => !prevPasswordShown)
                }
                icon={passwordShown ? <FaEyeSlash /> : <FaEye />}
              />
            </InputRightElement>
          </InputGroup>
          <FormHelperText>Copy this down somewhere</FormHelperText>
        </FormControl>
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
