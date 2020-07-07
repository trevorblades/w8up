import CreateOrganizationForm from './CreateOrganizationForm';
import React from 'react';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/core';

export default function CreateOrgButton(props) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button isFullWidth size="lg" colorScheme="green" onClick={onOpen}>
        New organization
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>New organization</ModalHeader>
            <ModalCloseButton />
            <CreateOrganizationForm
              {...props}
              wrapBody
              renderButton={buttonProps => (
                <ModalFooter>
                  <Button {...buttonProps} />
                </ModalFooter>
              )}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
