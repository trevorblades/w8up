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
import {FaArrowLeft, FaCaretDown, FaCog, FaSignOutAlt} from 'react-icons/fa';
import {Link as GatsbyLink} from 'gatsby';
import {LogOutContext} from '../utils';

export default function UserMenu(props) {
  const logOut = useContext(LogOutContext);

  return (
    <>
      <Menu>
        <MenuButton variant="ghost" size="sm" px="0">
          <Avatar mr="2" size="sm" fontSize="md" name={props.user.name} />
          <FaCaretDown />
        </MenuButton>
        <MenuList boxShadow="lg" pt="0" placement="bottom-end">
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
          {props.organization && (
            <>
              <Box px="4" py="2">
                <Text fontWeight="medium">{props.organization.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {props.organization.phone}
                </Text>
              </Box>
              <MenuDivider />
              {props.organization.isAdmin && (
                <MenuItem
                  as={GatsbyLink}
                  to={`/app/settings/${props.organization.id}`}
                >
                  <Box as={FaCog} mr="2" />
                  Organization settings
                </MenuItem>
              )}
              <MenuItem as={GatsbyLink} to="/app">
                <Box as={FaArrowLeft} mr="2" />
                Change organization
              </MenuItem>
            </>
          )}
          <MenuItem onClick={logOut}>
            <Box as={FaSignOutAlt} mr="2" />
            Log out
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object
};
