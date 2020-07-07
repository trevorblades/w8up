import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text
} from '@chakra-ui/core';
import {FaCaretDown, FaSignOutAlt} from 'react-icons/fa';
import {LogOutContext} from '../utils';

export default function UserMenu(props) {
  const logOut = useContext(LogOutContext);

  return (
    <>
      <Menu>
        <MenuButton variant="ghost" size="sm" h="auto" p="1">
          <Avatar mr="2" size="sm" fontSize="md" name={props.user.name} />
          <FaCaretDown />
        </MenuButton>
        <MenuList boxShadow="lg" pt="0">
          <Stack p="4" spacing="2" bg="gray.50" align="center">
            <Avatar name={props.user.name} />
            <Box textAlign="center">
              <Text>{props.user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {props.user.email}
              </Text>
            </Box>
          </Stack>
          <MenuDivider mt="0" />
          {props.children}
          <MenuItem onClick={logOut}>
            <Box as={FaSignOutAlt} mr="2" />
            Log out
          </MenuItem>
          <Text mt="4" color="gray.500" textAlign="center" fontSize="sm">
            &copy; {new Date().getFullYear()} W8UP
          </Text>
        </MenuList>
      </Menu>
    </>
  );
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  children: PropTypes.node
};
