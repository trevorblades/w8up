import ChatPreview from './ChatPreview';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/core';
import {gql, useMutation} from '@apollo/client';

export const DETAILS_FRAGMENT = gql`
  fragment DetailsFragment on Organization {
    id
    name
    queueLimit
    averageHandleTime
    activeAgents
    keyword
    person
    welcomeMessage
    queueMessage
    queueEmptyMessage
    notAcceptingMessage
    readyMessage
    removedMessage
    notRemovedMessage
    limitExceededMessage
  }
`;

const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      ...DetailsFragment
    }
  }
  ${DETAILS_FRAGMENT}
`;

export default function OrgSettingsForm(props) {
  const toast = useToast();
  const [organization, setOrganization] = useState(props.organization);
  const [updateOrganization, {loading, error}] = useMutation(
    UPDATE_ORGANIZATION,
    {
      onCompleted() {
        toast({
          status: 'success',
          title: 'Organization updated',
          description: 'Your changes have been saved'
        });
      }
    }
  );

  function handleInputChange(event) {
    const {name, value} = event.target;
    setOrganization(prevOrganization => ({
      ...prevOrganization,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    updateOrganization({
      variables: {
        input: omit(organization, ['phone', '__typename'])
      }
    });
  }

  return (
    <Box as="form" autoComplete="off" onSubmit={handleSubmit}>
      <Stack
        spacing="6"
        divider={<StackDivider />}
        maxW="container.lg"
        p={[4, 5]}
        mx="auto"
      >
        {error && <Text color="red.500">{error.message}</Text>}
        <Stack w={7 / 8} spacing="4">
          <FormControl>
            <FormLabel>Organization name</FormLabel>
            <Input
              required
              name="name"
              value={organization.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>SMS number</FormLabel>
            <Input value={organization.phone} isDisabled />
          </FormControl>
          <Grid gap="4" templateColumns="repeat(3, 1fr)">
            <FormControl>
              <FormLabel>Queue limit</FormLabel>
              <NumberInput
                min={1}
                max={100}
                value={organization.queueLimit}
                onChange={(string, queueLimit) =>
                  setOrganization(prevOrganization => ({
                    ...prevOrganization,
                    queueLimit
                  }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                Maximum number of people allowed on the waitlist at a time
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Active agents</FormLabel>
              <NumberInput
                min={1}
                value={organization.activeAgents}
                onChange={(string, activeAgents) =>
                  setOrganization(prevOrganization => ({
                    ...prevOrganization,
                    activeAgents
                  }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The number of people serving customers
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Average handle time</FormLabel>
              <NumberInput
                min={1}
                value={organization.averageHandleTime}
                onChange={(string, averageHandleTime) =>
                  setOrganization(prevOrganization => ({
                    ...prevOrganization,
                    averageHandleTime
                  }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The average amount of time (in minutes) to finish serving a
                customer
              </FormHelperText>
            </FormControl>
          </Grid>
        </Stack>
        <Grid alignItems="flex-start" gap="4" templateColumns="2fr 1fr">
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Welcome message template</FormLabel>
              <Textarea
                required
                resize="none"
                name="welcomeMessage"
                value={organization.welcomeMessage}
                onChange={handleInputChange}
              />
              <FormHelperText>
                You may use the QUEUE_MESSAGE and KEYWORD variables
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>
                QUEUE_MESSAGE when the <mark>queue is empty</mark>
              </FormLabel>
              <Input
                required
                name="queueEmptyMessage"
                value={organization.queueEmptyMessage}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                QUEUE_MESSAGE when there are <mark>people in the queue</mark>
              </FormLabel>
              <Textarea
                required
                resize="none"
                name="queueMessage"
                value={organization.queueMessage}
                onChange={handleInputChange}
              />
              <FormHelperText>
                You may use the IS, PERSON, and ESTIMATED_WAIT_TIME variables
              </FormHelperText>
            </FormControl>
            <Grid templateColumns="repeat(2, 1fr)" gap="4">
              <FormControl>
                <FormLabel>KEYWORD variable</FormLabel>
                <Input
                  required
                  name="keyword"
                  value={organization.keyword}
                  onChange={handleInputChange}
                />
                <FormHelperText>
                  The keyword that your customers can text to remove themselves
                  from your waitlist (case-insensitive)
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>PERSON variable</FormLabel>
                <Input
                  required
                  name="person"
                  value={organization.person}
                  onChange={handleInputChange}
                />
                <FormHelperText>
                  The <mark>singular</mark> word you want to use to address
                  people in your waitlist
                </FormHelperText>
              </FormControl>
            </Grid>
            <Divider />
            <FormControl>
              <FormLabel>Not accepting message</FormLabel>
              <Textarea
                required
                resize="none"
                name="notAcceptingMessage"
                value={organization.notAcceptingMessage}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Ready to serve message</FormLabel>
              <Textarea
                required
                resize="none"
                name="readyMessage"
                value={organization.readyMessage}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Limit exceeded message</FormLabel>
              <Input
                required
                name="limitExceededMessage"
                value={organization.limitExceededMessage}
                onChange={handleInputChange}
              />
            </FormControl>
            <Divider />
            <FormControl>
              <FormLabel>Removed message</FormLabel>
              <Input
                required
                name="removedMessage"
                value={organization.removedMessage}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Not removed message</FormLabel>
              <Input
                required
                name="notRemovedMessage"
                value={organization.notRemovedMessage}
                onChange={handleInputChange}
              />
            </FormControl>
          </Stack>
          <ChatPreview organization={organization} />
        </Grid>
      </Stack>
      <Box
        mt="auto"
        position="sticky"
        bottom="0"
        zIndex="docked"
        bg="whiteAlpha.800"
        borderTopWidth="1px"
      >
        <Box textAlign="right" maxW="container.lg" py="3" px={[4, 5]} mx="auto">
          <Button
            size="lg"
            colorScheme="green"
            isDisabled={isEqual(props.organization, organization)}
            type="submit"
            isLoading={loading}
          >
            Save changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

OrgSettingsForm.propTypes = {
  organization: PropTypes.object.isRequired
};
