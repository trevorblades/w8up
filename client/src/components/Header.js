import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex} from '@chakra-ui/core';
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
      bg="white"
      zIndex="docked"
      borderBottomWidth="1px"
      px={[4, 5]}
    >
      <Box mr="3" as={GatsbyLink} to="/app">
        <Box w="10" fill="currentColor" as={Logo} />
      </Box>
      {props.children}
    </Flex>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired
};
