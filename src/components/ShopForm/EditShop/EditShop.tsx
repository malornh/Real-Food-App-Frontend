import React, { useState, useRef } from 'react';
import {
  Text,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  FormControl,
  Input,
  Textarea,
  Box,
  Flex,
  ChakraProvider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './EditShop.css';
import ImageCropper from '../ImageCropper/ImageCropper';
import theme from './theme'; // Import the custom theme
import MapComponent from './MapComponent';
import axios from 'axios';
import { completePhotoUrl } from '../../Images/CompletePhotoUrl.ts';
import { useContextProvider } from "../../../ContextProvider.tsx";

export interface Shop {
  id: number | undefined;
  userId: string | null;
  name: string;
  photoFile?: File | null;
  photoId: string | undefined;
  description: string;
  latitude: number;
  longitude: number;
  rating: number | undefined;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  onShopUpdate: (shop: Shop) => void;
  onDelete: (shopId: number) => void;
}

const EditShop: React.FC<Props> = ({ isOpen, onClose, shop, onShopUpdate, onDelete }) => {
  const [newShop, setNewShop] = useState<Shop>({ ...shop });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { token } = useContextProvider();

  const updateShop = async (shop: Shop) => {
    try {
      const formData = new FormData();
      formData.append('Id', String(shop.id));
      formData.append('UserId', String(shop.userId));
      formData.append('Name', shop.name);
  
      if (shop.photoFile) {
        formData.append('PhotoFile', shop.photoFile);
      }
      formData.append('Description', shop.description);
      formData.append('Latitude', String(shop.latitude));
      formData.append('Longitude', String(shop.longitude));
      formData.append('Rating', String(shop.rating));
  
      const response = await axios.put(
        `https://localhost:7218/api/Shops/${shop.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
             Authorization: `Bearer ${token}`
          },
        }
      );
  
      const updatedShop = response.data;
  
      onShopUpdate(updatedShop);

    } catch (error : any) {
      console.error('Error updating shop:', error.response?.data || error.message);
    }
  };
  

  const createShop = async (shop: Shop) => {
    try {
      const formData = new FormData();
      formData.append('UserId', String(shop.userId));
      formData.append('Name', shop.name);
      
      if (shop.photoFile) {
        formData.append('PhotoFile', shop.photoFile);
      }
      formData.append('Description', shop.description);
      formData.append('Latitude', String(shop.latitude));
      formData.append('Longitude', String(shop.longitude));
  
      const response = await axios.post(
        `https://localhost:7218/api/Shops`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        }
      );
  
      const responseShop = response.data;
  
      onShopUpdate(responseShop);
  
      onClose();
    } catch (error: any) {
      console.error('Error creating shop:', error.response?.data || error.message);
    }
  };
  

  const handleSave = async () => {
    if (newShop.id === undefined) {
      await createShop(newShop);
    } else {
      await updateShop(newShop);
      onShopUpdate(newShop);
      onClose();
    }
  };

  const handleImageChange = (newFile: File) => {
    setNewShop((prevState) => ({
      ...prevState,
      photoFile: newFile, // Store the selected file
    }));
  };

const handleDelete = async () => {
    try {
        const response = await axios.delete(`https://localhost:7218/api/Shops/${shop.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });

        if (response.status === 200) {
            if (shop.id !== undefined) {
                onDelete(shop.id); 
            }
            onClose(); 
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting shop:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error deleting shop:', error);
        }
    }
};

  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  return (
    <ChakraProvider theme={theme}>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent maxW="68vw" maxH="95%">
          <ModalBody style={{ overflowY: 'auto' }} mt={2}>
            <Flex>
              <Box mt={-5} ml={-6}>
                <ImageCropper
                  initialImage={newShop.photoId === undefined ? completePhotoUrl("defaultStore.png") : completePhotoUrl(newShop.photoId)} // Use the image URL or placeholder
                  onImageChange={(photo)=>handleImageChange(photo)} // Pass the new image file
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
                  outLong={(long) =>
                    setNewShop((prevState) => ({
                      ...prevState,
                      longitude: long,
                    }))
                  }
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
                    height="455px"
                    width="575px"
                    borderRadius="10px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter mb={-2} flexDirection="row" justifyContent="space-between">
            <Button colorScheme="red" ml={383} width={100} onClick={openDeleteConfirm}>
              Delete Shop
            </Button>
            <Box>
              <Button colorScheme="teal" mr={5} width={100} onClick={handleSave}>
                Save
              </Button>
              <Button
                style={{
                  color: 'black',
                  background: 'rgba(145, 150, 150, 0.2)',
                }}
                onClick={onClose}
              >
                Close
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isDeleteConfirmOpen} leastDestructiveRef={cancelRef} onClose={closeDeleteConfirm}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Shop
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this shop? This action cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteConfirm}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
};

export default EditShop;
