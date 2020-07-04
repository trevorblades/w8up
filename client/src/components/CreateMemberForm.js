import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Button,
  FormControl,
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
import {LIST_MEMBERS, USER_FRAGMENT} from '../utils';
import {generate} from 'generate-password';
import {gql, useMutation} from '@apollo/client';

const CREATE_MEMBER = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export default function CreateMemberForm({onCompleted, organizationId}) {
  const [passwordShown, setPasswordShown] = useState(false);
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

    const {name, username, password} = event.target;
    createMember({
      variables: {
        input: {
          name: name.value,
          username: username.value,
          password: password.value,
          organizationId
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody as={Stack} spacing="4">
        {error && <Text color="red.500">{error.message}</Text>}
        <Input required placeholder="Name" name="name" />
        <Input required placeholder="Username" name="username" />
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              required
              defaultValue={generate({numbers: true})}
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
