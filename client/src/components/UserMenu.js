import OrgSettingsModalContent from './OrgSettingsModalContent';
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
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/core';
import {FaArrowLeft, FaCaretDown, FaCog, FaSignOutAlt} from 'react-icons/fa';
import {Link as GatsbyLink} from 'gatsby';
import {LogOutContext} from '../utils';

export default function UserMenu(props) {
  const toast = useToast();
  const logOut = useContext(LogOutContext);
  const {isOpen, onOpen, onClose} = useDisclosure();

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
                <MenuItem onClick={onOpen}>
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
      {props.organization?.isAdmin && (
        <Modal
          closeOnOverlayClick={false}
          size="3xl"
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>Organization settings</ModalHeader>
              <ModalCloseButton />
              <OrgSettingsModalContent
                onCompleted={() => {
                  onClose();
                  toast({
                    duration: 3000,
                    status: 'success',
                    position: 'top',
                    title: 'Organization updated',
                    description: 'Your changes have been saved'
                  });
                }}
                queryOptions={{
                  variables: {
                    id: props.organization.id
                  }
                }}
              />
            </ModalContent>
          </ModalOverlay>
        </Modal>
      )}
    </>
  );
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object
};
