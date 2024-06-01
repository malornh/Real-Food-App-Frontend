import React, { useState } from 'react';
import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  VStack,
  ChakraProvider
} from '@chakra-ui/react';
import EditShop, { Shop } from './ShopForm/EditShop/EditShop'; // Adjust the import path as needed
import theme from './ShopForm/EditShop/theme';
import defaultStore from '../assets/defaultStore.png'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  handleNewShop: (shop: Shop)=>void;
}

const Create = ({ isOpen, onClose, userId, handleNewShop }: Props) => {
  const [showEditShop, setShowEditShop] = useState(false);

  const handleCreateStoreClick = () => {
    setShowEditShop(true);
  };

    function mapToShop(): Shop {
        return {
          id: undefined,
          userId: userId,
          name: "",
          description: "",
          image: defaultStore,
          latitude: 42.693,
          longitude: 23.319,
          rating: undefined,
        };
    }

    function handleSave(shop: Shop): void {
        handleNewShop(shop);
        onClose();
    }

  return (
    <ChakraProvider theme={theme}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
          style={{
            background: 'rgba(0, 0, 0, 0.5)'
          }}
        />
        {!showEditShop && <ModalContent padding={16} top={220} width={300}>
          <ModalBody>
            <VStack spacing={5}>
              <Button
                as='label'
                colorScheme="blue"
                onClick={handleCreateStoreClick}>
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
        </ModalContent>}
      </Modal>
      {showEditShop && <EditShop
          onUpdate={(shop) => handleSave(shop)}
          isOpen={showEditShop}
          onClose={() => setShowEditShop(false)}
          shop={mapToShop()}
        />}
    </ChakraProvider>
  );
};

export default Create;
