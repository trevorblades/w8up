import CreateOrgForm from './CreateOrgForm';
import React, {useState} from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/core';

export const BUTTON_PROPS = {
  h: 'auto',
  size: 'lg',
  variant: 'outline',
  borderRadius: 'lg',
  borderWidth: '2px',
  borderColor: 'currentColor',
  fontWeight: 'medium',
  _hover: {bg: 'gray.50'},
  _active: {bg: 'gray.100'}
};

export default function CreateOrgButton(props) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        {...BUTTON_PROPS}
        color="gray.400"
        borderStyle="dashed"
        onClick={() => setModalOpen(true)}
      >
        New organization
      </Button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
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
