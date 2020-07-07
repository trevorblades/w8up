import CreateMemberForm from './CreateMemberForm';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/core';
import {FaPlus} from 'react-icons/fa';

export default function CreateMemberButton({organizationId}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button colorScheme="green" leftIcon={<FaPlus />} onClick={onOpen}>
        Add member
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>New member</ModalHeader>
            <ModalCloseButton />
            <CreateMemberForm
              onCompleted={onClose}
              organizationId={organizationId}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

CreateMemberButton.propTypes = {
  organizationId: PropTypes.string.isRequired
};
