import ChatBubble from './ChatBubble';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Box,
  Checkbox,
  Grid,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text
} from '@chakra-ui/core';
import {createWelcomeMessage} from '@w8up/common';

export default function ChatPreview({organization}) {
  const [removing, setRemoving] = useState(false);
  const [peopleAhead, setPeopleAhead] = useState(0);
  const [personOnList, setPersonOnList] = useState(true);
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
      display={{
        base: 'none',
        md: 'block'
      }}
      position="sticky"
      top="20"
    >
      <Box py="3" px="4" bg="gray.900">
        <RadioGroup
          value={removing.toString()}
          onChange={value => setRemoving(value === 'true')}
        >
          <Stack direction="row" color="white" mb="2">
            <Radio value="false">Name</Radio>
            <Radio value="true">Remove keyword</Radio>
          </Stack>
        </RadioGroup>
        {removing ? (
          <Checkbox
            isChecked={personOnList}
            onChange={event => setPersonOnList(event.target.checked)}
            color="white"
          >
            Person is on the list
          </Checkbox>
        ) : (
          <Grid alignItems="center" templateColumns="repeat(2, 1fr)">
            <Text color="white">People in line</Text>
            <NumberInput
              min={0}
              size="sm"
              onChange={(string, num) => setPeopleAhead(num)}
              value={peopleAhead}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Grid>
        )}
      </Box>
      <Stack spacing="3" p="6">
        <ChatBubble>{removing ? organization.keyword : 'Bonnie'}</ChatBubble>
        {removing ? (
          <ChatBubble fromThem>
            {personOnList
              ? organization.removedMessage
              : organization.notRemovedMessage}
          </ChatBubble>
        ) : peopleAhead >= organization.queueLimit ? (
          <ChatBubble fromThem>{organization.limitExceededMessage}</ChatBubble>
        ) : (
          [
            <ChatBubble key="welcome" fromThem>
              {createWelcomeMessage(organization, peopleAhead)}
            </ChatBubble>,
            <ChatBubble key="ready" fromThem>
              {organization.readyMessage}
            </ChatBubble>
          ]
        )}
      </Stack>
    </Box>
  );
}

ChatPreview.propTypes = {
  organization: PropTypes.object.isRequired
};
