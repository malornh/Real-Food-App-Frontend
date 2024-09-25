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
  AlertDialogOverlay
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './EditFarm.css';
import ImageCropper from '../ShopForm/ImageCropper/ImageCropper';
import theme from '../ShopForm/EditShop/theme';
import MapComponent from '../ShopForm/EditShop/MapComponent';
import initialFarmImage from '../../assets/defaultFarm.png';

export interface Farm {
  id: number | undefined;
  userId: string;
  name: string;
  photoFile?: File | null;  // Changed this to be File type
  photoId: string | undefined;
  description: string;
  latitude: number;
  longitude: number;
  defaultDeliveryRadius: number | undefined;
  rating: number | undefined;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm;
  onFarmUpdate: (farm: Farm) => void;
  onDelete: (farmId: number) => void;
}

const EditFarm: React.FC<Props> = ({ isOpen, onClose, farm, onFarmUpdate, onDelete }) => {
  const [newFarm, setNewFarm] = useState<Farm>({ ...farm });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const updateFarm = async (farm: Farm) => {
    try {
        const formData = new FormData();
        formData.append('Id', String(farm.id));
        formData.append('UserId', farm.userId);
        formData.append('Name', farm.name);

        // Only include PhotoFile if it is provided
        if (farm.photoFile) {
            formData.append('PhotoFile', farm.photoFile);
        }

        formData.append('Description', farm.description);
        formData.append('Latitude', String(farm.latitude));
        formData.append('Longitude', String(farm.longitude));
        formData.append('DefaultDeliveryRadius', String(farm.defaultDeliveryRadius));

        const response = await fetch(`https://localhost:7218/api/Farms`, { // Ensure the correct URL
            method: 'PUT',
            body: formData,
        });

        console.log('Updating farm:', {
          id: farm.id,
          userId: farm.userId,
          name: farm.name,
          photoId: farm.photoId,
          description: farm.description,
          latitude: farm.latitude,
          longitude: farm.longitude,
          defaultDeliveryRadius: farm.defaultDeliveryRadius,
          photoFile: farm.photoFile ? farm.photoFile.name : 'No photo file'
      });
      

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error: ${response.status} - ${error}`);
        }

        onFarmUpdate(farm); // Update the local state after successful response
    } catch (error) {
        console.error('Error updating farm:', error);
    }
};


  const createFarm = async (farm: Farm) => {
    try {
      const formData = new FormData();
      formData.append('UserId', farm.userId);
      formData.append('Name', farm.name);
      if (farm.photoFile) {
        formData.append('PhotoFile', farm.photoFile); // Append the image file
      }
      formData.append('Description', farm.description);
      formData.append('Latitude', String(farm.latitude));
      formData.append('Longitude', String(farm.longitude));
      formData.append('DefaultDeliveryRadius', String(farm.defaultDeliveryRadius));

      const response = await fetch(`https://localhost:7218/api/Farms`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }

      const responseFarm = await response.json();
      onFarmUpdate(responseFarm); // Update the state with the newly created farm
      onClose();
    } catch (error) {
      console.error('Error creating farm:', error);
    }
  };

  const handleSave = async () => {
    if (newFarm.id === undefined) {
      await createFarm(newFarm);
    } else {
      await updateFarm(newFarm);
      onFarmUpdate(newFarm);
      onClose();
    }
  };

  const handleImageChange = (newFile: File) => {
    setNewFarm(prevState => ({
      ...prevState,
      photoFile: newFile, // Store the selected file
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://localhost:7218/api/Farms/${farm.id}`, {
        method: 'DELETE'
      });

      

      if (farm.id !== undefined) onDelete(farm.id);
      onClose();
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

  function completePhotoUrl(photoId: string | undefined){
    return 'https://realfoodapp.b-cdn.net/' + photoId;
  }

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
                  initialImage={completePhotoUrl(newFarm.photoId)} // This could be the URL or placeholder
                  onImageChange={handleImageChange} // Pass the new image file
                />
                <MapComponent
                  lat={farm.latitude}
                  long={farm.longitude}
                  outLat={(lat) =>
                    setNewFarm((prevState) => ({
                      ...prevState,
                      latitude: lat,
                    }))
                  }
                  outLong={(long) => {
                    setNewFarm((prevState) => ({
                      ...prevState,
                      longitude: long,
                    }));
                  }}
                />
              </Box>
              <Box ml={5} mt={-1}>
                <FormControl mb={4}>
                  <Input
                    value={newFarm.name}
                    onChange={(e) =>
                      setNewFarm((prevState) => ({
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
                    value={newFarm.description}
                    onChange={(e) =>
                      setNewFarm((prevState) => ({
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
                <FormControl mb={4}>
                  <Input
                    type="number"
                    value={newFarm.defaultDeliveryRadius}
                    onChange={(e) =>
                      setNewFarm((prevState) => ({
                        ...prevState,
                        defaultDeliveryRadius: parseFloat(e.target.value),
                      }))
                    }
                    placeholder="Enter default delivery radius"
                    fontSize="20px"
                    height="70px"
                    width="575px"
                    borderRadius="10px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter mb={-6} flexDirection="row" justifyContent="space-between">
            <Button
              as="label"
              colorScheme="red"
              ml={383}
              width={100}
              onClick={openDeleteConfirm}>
              Delete Farm
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
        onClose={closeDeleteConfirm}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Farm
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this farm? This action cannot be undone.
            </AlertDialogBody>
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

export default EditFarm;
