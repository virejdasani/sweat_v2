import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { DeleteModalProps } from '../../../../types/admin/ProgrammeDesigner';

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onRemoveFromProgramme,
  onRemoveFromDatabase,
}) => {
  return (
    <>
      <Modal isOpen={open} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.500" color="white" py={4}>
            Delete Module
          </ModalHeader>
          <ModalBody py={6}>
            <Text mb={4}>
              Do you want to remove the module from the programme or remove it
              from the database?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onRemoveFromProgramme}>
              Remove from Programme
            </Button>
            <Button colorScheme="red" mr={3} onClick={onRemoveFromDatabase}>
              Remove from Database
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
