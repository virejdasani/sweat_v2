import {
  Modal,
  ModalContent,
  ModalHeader as ChakraModalHeader,
  ModalBody as ChakraModalBody,
  ModalFooter as ChakraModalFooter,
  Box,
} from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBackdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); // Darker background color
  backdrop-filter: blur(5px); // Apply a blur effect
  z-index: -1; // Ensure the backdrop is behind the modal
  opacity: ${({ isOpen }) =>
    isOpen ? 1 : 0}; // Show/hide the backdrop based on modal state
  transition: opacity 0.3s ease-in-out; // Add a transition for smooth animation
`;

export const StyledModalContent = styled(ModalContent)`
  max-width: 1000px;
  width: 70%;
  max-height: 80vh;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled(ChakraModalHeader)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const ModalBody = styled(ChakraModalBody)`
  max-height: 60vh;
  overflow-y: auto;
`;

export const ModalFooter = styled(ChakraModalFooter)`
  justify-content: flex-end;
  margin-top: 1rem;
`;

export const StepperContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;
