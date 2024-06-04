import React, { useState, useRef } from 'react';
import { Text, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, FormControl, Input, Textarea, Box, Flex, ChakraProvider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './EditFarm.css';
import ImageCropper from '../ShopForm/ImageCropper/ImageCropper'
import theme from '../ShopForm/EditShop/theme'
import MapComponent from '../ShopForm/EditShop/MapComponent'

export interface Farm {
  id: number | undefined;
  userId: string;
  image: string;
  name: string;
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
      const response = await fetch(`https://localhost:7218/api/Farm/${farm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(farm)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error('Error updating farm:', error);
    }
  };

  const createFarm = async (farm: Farm) => {
    try {
      const response = await fetch(`https://localhost:7218/api/Farms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(farm)
      });
      console.log(farm);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }

      const responseFarm = await response.json();
      onFarmUpdate(responseFarm);
      onClose();
    } catch (error) {
      console.error('Error creating farm:', error);
    }
  };

  const handleSave = async () => {
    if(newFarm.id === undefined) {
      await createFarm(newFarm);
    } else {
      await updateFarm(newFarm);
      onFarmUpdate(newFarm);
      onClose();
    }
  };

  const handleImageChange = (newImage: string) => {
    setNewFarm(prevState => ({
      ...prevState,
      image: newImage
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://localhost:7218/api/Farm/${farm.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }
      if(farm.id !== undefined) onDelete(farm.id);
      onClose();
    } catch (error) {
      console.error('Error deleting farm:', error);
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
                  initialImage={farm.image}
                  onImageChange={handleImageChange}
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
                    height="520px"
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
        onClose={closeDeleteConfirm}>
        <AlertDialogOverlay>
          <AlertDialogContent
            mt={250}
            color="black"
            background="rgba(255, 255, 255, 0.95)">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Farm
            </AlertDialogHeader>

            <AlertDialogBody color="black">
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="bold">
                {farm.name}
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

export default EditFarm;
