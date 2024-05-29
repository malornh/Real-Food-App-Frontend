import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, FormControl, Input, Textarea, Box, Flex, ChakraProvider } from '@chakra-ui/react';
import L from 'leaflet';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import 'leaflet/dist/leaflet.css';
import './EditShop.css';
import ImageCropper from '../ImageCropper/ImageCropper';
import theme from './theme'; // Import the custom theme
import MapComponent from './MapComponent';

export interface Shop {
  id: number;
  userId: string;
  image: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  onUpdate: (shop: Shop) => void;
}

const EditShop: React.FC<Props> = ({ isOpen, onClose, shop, onUpdate }) => {
  const [newShop, setNewShop] = useState<Shop>({ ...shop });
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    console.log(mapContainer.current);
    if (isOpen && mapContainer.current) { // Check if the modal is open and the container is available
      console.log("Inside if");
      // Perform map initialization
      if (mapRef.current) {
        mapRef.current.remove();
        console.log('Map removed');
      }

      mapRef.current = L.map(mapContainer.current).setView([shop.latitude, shop.longitude], 13);
      console.log('New map created');

      const mapTilerLayer = new MaptilerLayer({
        apiKey: 'dJS38j47jXwMgeCxB2ha',
        styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
      }).addTo(mapRef.current);
      console.log("MapTiler layer added");

      markerRef.current = L.marker([shop.latitude, shop.longitude]).addTo(mapRef.current);
      console.log('Marker added');

      mapRef.current.on('click', (event: L.LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        markerRef.current?.setLatLng([lat, lng]);
        setNewShop(prevState => ({
          ...prevState,
          latitude: lat,
          longitude: lng
        }));
        console.log('Marker position updated', { lat, lng });
      });
      console.log('Map initialization done');
    }
  }, [isOpen, shop]);

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

  const handleSave = async () => {
    await updateShop(newShop);
    onUpdate(newShop);
    onClose();
  };

  const handleImageChange = (newImage: string) => {
    setNewShop(prevState => ({
      ...prevState,
      image: newImage
    }));
  };

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
                    borderRadius="5px"
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
                    borderRadius="5px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter mb={-6}>
            <Button
              as="label"
              colorScheme="teal"
              mr={5}
              width={100}
              onClick={handleSave}>
              Save
            </Button>
            <Button
              style={{ color: "black", background: "rgba(145, 150, 150, 0.2)" }}
              onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default EditShop;
