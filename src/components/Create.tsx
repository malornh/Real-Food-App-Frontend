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
import { Farm } from './FarmForm/EditFarm'
import theme from './ShopForm/EditShop/theme';
import defaultStore from '../assets/defaultStore.png'
import initialFarm from '../assets/defaultFarm.png'
import EditFarm from './FarmForm/EditFarm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  handleNewShop: (shop: Shop)=>void;
  handleNewFarm: (farm: Farm)=>void;
}

const Create = ({ isOpen, onClose, userId, handleNewShop, handleNewFarm }: Props) => {
  const [showEditShop, setShowEditShop] = useState(false);
  const [showEditFarm, setShowEditFarm] = useState(false);

  const handleCreateShopClick = () => {
    setShowEditShop(true);
  };

  const handleCreateFarmClick = () => {
    setShowEditFarm(true);
  };

    function mapToShop(): Shop {
        return {
          id: undefined,
          userId: userId,
          name: "",
          description: "",
          photoFile: null,
          photoId: undefined,
          latitude: 42.693,
          longitude: 23.319,
          rating: undefined,
        };
    }

    function mapToFarm(): Farm {
      return {
        id: undefined,
        userId: userId,
        name: "",
        description: "",
        photoFile: null,
        photoId: undefined,
        latitude: 42.693,
        longitude: 23.319,
        defaultDeliveryRadius: undefined, // Set a default delivery radius
        rating: undefined // Set a default rating
      };
    }
    

    function handleSaveShop(shop: Shop): void {
        handleNewShop(shop);
        onClose();
    }

    function handleSaveFarm(farm: Farm): void {
      handleNewFarm(farm);
      onClose();
  }

  return (
    <ChakraProvider theme={theme}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
          }}
        />
        {!showEditShop && (
          <ModalContent padding={16} top={220} width={300}>
            <ModalBody>
              <VStack spacing={5}>
                <Button
                  as="label"
                  colorScheme="blue"
                  onClick={handleCreateShopClick}>
                  Create Store
                </Button>
                <Button
                  as="label"
                  colorScheme="green"
                  onClick={handleCreateFarmClick}>
                  Create Farm
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
      {showEditShop && (
        <EditShop
          onShopUpdate={(shop) => handleSaveShop(shop)}
          isOpen={showEditShop}
          onClose={() => setShowEditShop(false)}
          shop={mapToShop()}
          onDelete={() => null}
        />
      )}
      {showEditFarm && (
        <EditFarm
          onFarmUpdate={(farm) => handleSaveFarm(farm)}
          isOpen={showEditFarm}
          onClose={() => setShowEditFarm(false)}
          farm={mapToFarm()}
          onDelete={() => null}
        />
      )}
    </ChakraProvider>
  );
};

export default Create;
