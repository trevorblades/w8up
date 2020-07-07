import CreateOrgForm from './CreateOrgForm';
import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
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
            <CreateOrgForm
              {...props}
              BodyWrapper={ModalBody}
              ButtonWrapper={ModalFooter}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
