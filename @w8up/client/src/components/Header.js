import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, useTheme} from '@chakra-ui/core';
import {Link as GatsbyLink} from 'gatsby';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function Header(props) {
  const {colors} = useTheme();
  return (
    <Box
      pb="2px"
      as="header"
      position="sticky"
      top="0"
      zIndex="docked"
      bgImage={`linear-gradient(${[
        'to right',
        colors.blue[300],
        colors.green[300],
        colors.yellow[300]
      ]})`}
    >
      <Flex h="16" align="center" bg="white" px={[4, 5]}>
        <Box display={['none', 'block']} mr="3" as={GatsbyLink} to="/app">
          <Box w="10" fill="current" as={Logo} />
        </Box>
        {props.children}
      </Flex>
    </Box>
  );
}

Header.propTypes = {
  children: PropTypes.node
};
