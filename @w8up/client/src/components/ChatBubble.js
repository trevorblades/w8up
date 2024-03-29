import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/core';

function ChatBubbleTail(props) {
  return <Box position="absolute" bottom="-2px" h="20px" {...props} />;
}

export default function ChatBubble({fromThem, children, darkMode}) {
  const color = !fromThem ? 'blue.400' : darkMode ? 'gray.600' : 'gray.200';
  const backTailProps = {
    [fromThem ? 'left' : 'right']: '-7px',
    [`border${fromThem ? 'Left' : 'Right'}Color`]: color,
    [`border${fromThem ? 'Left' : 'Right'}Width`]: '20px',
    [`borderBottom${fromThem ? 'Right' : 'Left'}Radius`]: '16px 14px'
  };

  const frontTailProps = {
    [fromThem ? 'left' : 'right']: fromThem ? '4px' : '-56px',
    [`borderBottom${fromThem ? 'Right' : 'Left'}Radius`]: '10px'
  };

  return (
    <Box
      bg={color}
      borderRadius="25px"
      py="10px"
      maxW="255px"
      px="20px"
      fontSize="20px"
      lineHeight="24px"
      position="relative"
      color={fromThem && !darkMode ? undefined : 'white'}
      alignSelf={fromThem ? 'flex-start' : 'flex-end'}
      wordBreak="break-word"
    >
      {children}
      <ChatBubbleTail transform="translate(0, -2px)" {...backTailProps} />
      <ChatBubbleTail
        w="26px"
        bg={darkMode ? 'gray.900' : 'white'}
        transform="translate(-30px, -2px)"
        {...frontTailProps}
      />
    </Box>
  );
}

ChatBubble.propTypes = {
  fromThem: PropTypes.bool,
  darkMode: PropTypes.bool,
  children: PropTypes.node.isRequired
};
