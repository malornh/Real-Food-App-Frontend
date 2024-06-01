import React, { useState, useRef } from 'react';
import { Text, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, FormControl, Input, Textarea, Box, Flex, ChakraProvider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './EditShop.css';
import ImageCropper from '../ImageCropper/ImageCropper';
import theme from './theme'; // Import the custom theme
import MapComponent from './MapComponent';

export interface Shop {
  id: number | undefined;
  userId: string;
  image: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number | undefined;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  onUpdate: (shop: Shop) => void;
  onDelete: (shopId: number) => void;
}

const EditShop: React.FC<Props> = ({ isOpen, onClose, shop, onUpdate, onDelete }) => {
  const [newShop, setNewShop] = useState<Shop>({ ...shop });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const updateShop = async (shop: Shop) => {
    try {
      const response = await fetch(`https://localhost:7218/api/Shop/${shop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shop)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error('Error updating shop:', error);
    }
  };

  const createShop = async (shop: Shop) => {
    try {
        const response = await fetch(`https://localhost:7218/api/Shop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shop)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error: ${response.status} - ${error}`);
        }

        // If response is okay, parse the JSON response
        const responseShop = await response.json();

        // Call onUpdate with the newShop data
        onUpdate(responseShop);
        onClose();
    } catch (error) {
        console.error('Error updating shop:', error);
    }
};


  const handleSave = async () => {
    if(newShop.id === undefined)
      {
        await createShop(newShop);
      }else
      {
        await updateShop(newShop);
        onUpdate(newShop);
        onClose();
      }
    
    
  };

  const handleImageChange = (newImage: string) => {
    setNewShop(prevState => ({
      ...prevState,
      image: newImage
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://localhost:7218/api/Shop/${shop.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }
      {shop.id !== undefined && onDelete(shop.id);}
      onClose();
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  return (
    <ChakraProvider theme={theme}>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
          className="modal-overlay"
        />
        <ModalContent className="modalContent" maxW="68vw" maxH="95%">
          <ModalBody style={{ overflowY: "auto" }} mt={-2}>
            <Flex>
              <Box mt={-5} ml={-6}>
                <ImageCropper
                  initialImage={shop.image}
                  onImageChange={handleImageChange}
                />
                <MapComponent
                  lat={shop.latitude}
                  long={shop.longitude}
                  outLat={(lat) =>
                    setNewShop((prevState) => ({
                      ...prevState,
                      latitude: lat,
                    }))
                  }
                  outLong={(long) => {
                    setNewShop((prevState) => ({
                      ...prevState,
                      longitude: long,
                    }));
                  }}
                />
              </Box>
              <Box ml={5} mt={-1}>
                <FormControl mb={4}>
                  <Input
                    value={newShop.name}
                    onChange={(e) =>
                      setNewShop((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter name"
                    fontSize="40px"
                    height="70px"
                    width="575px"
                    borderRadius="10px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>
                <FormControl>
                  <Textarea
                    value={newShop.description}
                    onChange={(e) =>
                      setNewShop((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter description"
                    fontSize="20px"
                    height="520px"
                    width="575px"
                    borderRadius="10px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter
            mb={-6}
            flexDirection="row"
            justifyContent="space-between">
            <Button
              as="label"
              colorScheme="red"
              ml={383}
              width={100}
              onClick={openDeleteConfirm}>
              Delete Shop
            </Button>
            <Box>
              <Button
                as="label"
                colorScheme="teal"
                mr={5}
                width={100}
                onClick={handleSave}>
                Save
              </Button>
              <Button
                style={{
                  color: "black",
                  background: "rgba(145, 150, 150, 0.2)",
                }}
                onClick={onClose}>
                Close
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteConfirm}>
        <AlertDialogOverlay>
          <AlertDialogContent
            mt={250}
            color="black"
            background="rgba(255, 255, 255, 0.95)">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Shop
            </AlertDialogHeader>

            <AlertDialogBody color="black">
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="bold">
                {shop.name}
              </Text>
              ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                color="black"
                ref={cancelRef}
                onClick={closeDeleteConfirm}>
                No
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete();
                  closeDeleteConfirm();
                }}
                ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
};

export default EditShop;
