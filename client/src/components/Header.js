import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, Heading, Text} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function Header(props) {
  return (
    <Flex
      h="16"
      align="center"
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="white"
      borderBottomWidth="1px"
      px={[5, 6]}
    >
      <GatsbyLink to="/app">
        <Box h="8" fill="currentColor" as={Logo} />
      </GatsbyLink>
      <Box ml="3" mr="auto">
        <Heading fontSize="lg">Waitlist</Heading>
        <Text color="gray.500" fontSize="sm" lineHeight="normal">
          Sorrento Barbers
        </Text>
      </Box>
      {props.children}
    </Flex>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired
};
