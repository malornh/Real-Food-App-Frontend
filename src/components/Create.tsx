import React from 'react';
import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  ChakraProvider
} from '@chakra-ui/react';
import theme from './ShopForm/EditShop/theme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Create = ({ isOpen, onClose }: Props) => {
  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent padding={16} top={220} width={300}>
          <ModalBody>
            <VStack spacing={5}>
              <Button
                as='label'
                colorScheme="blue"
                onClick={() => alert("Create Store Clicked")}>
                Create Store
              </Button>
              <Button
                as='label'
                colorScheme="green"
                onClick={() => alert("Create Farm Clicked")}>
                Create Farm
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default Create;
