import OrgSettingsModalContent from './OrgSettingsModalContent';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
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
  useToast
} from '@chakra-ui/core';
import {FaArrowLeft, FaCaretDown, FaCog, FaSignOutAlt} from 'react-icons/fa';
import {Link as GatsbyLink} from 'gatsby';
import {LogOutContext} from '../utils';

export default function UserMenu(props) {
  const toast = useToast();
  const logOut = useContext(LogOutContext);
  const [modalOpen, setModalOpen] = useState(false);

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <>
      <Menu>
        <MenuButton as={Button} variant="ghost" size="sm" px="none">
          <Avatar mr="2" size="sm" fontSize="md" name={props.user.name} />
          <FaCaretDown />
        </MenuButton>
        <MenuList shadow="lg" pt="none" placement="bottom-end">
          <Stack p="4" spacing="2" bg="gray.50" align="center">
            <Avatar name={props.user.name} />
            <Box textAlign="center">
              <Text>{props.user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {props.user.email}
              </Text>
            </Box>
          </Stack>
          <MenuDivider mt="none" />
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
                <MenuItem onClick={() => setModalOpen(true)}>
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
      {/* TODO: only show org settings for admins */}
      {props.organization?.isAdmin && (
        <Modal
          closeOnOverlayClick={false}
          size={['lg', 'xl', '2xl', '3xl']}
          isOpen={modalOpen}
          onClose={closeModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Organization settings</ModalHeader>
            <ModalCloseButton />
            <OrgSettingsModalContent
              onCompleted={() => {
                closeModal();
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
        </Modal>
      )}
    </>
  );
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object
};
