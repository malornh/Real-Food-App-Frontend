import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, FormControl, Input, Textarea, Box, Flex } from '@chakra-ui/react';
import L from 'leaflet';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import 'leaflet/dist/leaflet.css';
import './EditShop.css';
import ImageCropper from '../ImageCropper/ImageCropper';

// Define interface for ShortShop
export interface ShortShop {
    id: number;
    image: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
}

// Define Props interface
interface Props {
    isOpen: boolean;
    onClose: () => void;
    shortShop: ShortShop;
}

// EditShop component
const EditShop: React.FC<Props> = ({ isOpen, onClose, shortShop }) => {
    // State variables
    const [newShop, setNewShop] = useState<ShortShop>({ ...shortShop });
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (isOpen && mapContainer.current) {
            // Remove previous map instance if exists
            if (mapRef.current) {
                mapRef.current.remove();
            }

            // Initialize map
            mapRef.current = L.map(mapContainer.current).setView([shortShop.latitude, shortShop.longitude], 13);

            const mapTilerLayer = new MaptilerLayer({
                apiKey: 'dJS38j47jXwMgeCxB2ha',
                styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
            }).addTo(mapRef.current);

            // Create marker with initial coordinates
            markerRef.current = L.marker([shortShop.latitude, shortShop.longitude]).addTo(mapRef.current);

            // Handle click event on the map to update marker position and newShop coordinates
            mapRef.current.on('click', (event: L.LeafletMouseEvent) => {
                const { lat, lng } = event.latlng;
                markerRef.current?.setLatLng([lat, lng]);
                setNewShop(prevState => ({
                    ...prevState,
                    latitude: lat,
                    longitude: lng
                }));
            });
        }
    }, [isOpen, shortShop]);

    // Save handler
    const handleSave = () => {
        // Save newShop
        console.log('New Shop:', newShop);
        onClose();
    };

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" className="modal-overlay" />
            <ModalContent className="modalContent" maxW="67vw" maxH="95%">
                <ModalBody style={{ overflowY: "auto" }} mt={-2}>
                    <Flex>
                        <Box mt={-5}>
                            <ImageCropper initialImage={shortShop.image} />
                            <Box
                                mt={0}
                                ref={mapContainer}
                                style={{
                                    borderRadius: "10px",
                                    height: "260px",
                                    width: "355px",
                                    position: "relative",
                                    marginLeft: "16px",
                                    border: "2px solid black",
                                }}
                            />
                        </Box>
                        <Box ml={5} mt={-1}>
                            <FormControl mb={4}>
                                <Input
                                    value={newShop.name}
                                    onChange={(e) => setNewShop(prevState => ({ ...prevState, name: e.target.value }))}
                                    placeholder="Enter name"
                                    fontSize="40px"
                                    height="70px" // Adjust the height as needed
                                    width="540px"
                                    borderRadius="5px"
                                />
                            </FormControl>
                            <FormControl mr={0}>
                                <Textarea
                                    value={newShop.description}
                                    onChange={(e) => setNewShop(prevState => ({ ...prevState, description: e.target.value }))}
                                    placeholder="Enter description"
                                    fontSize="20px"
                                    height="520px" // Adjust the height as needed
                                    width="560px"
                                    borderRadius="5px"
                                />
                            </FormControl>
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter mb={-6}>
                    <Button colorScheme="blue" background="teal" mr={10} width={100} onClick={handleSave}>Save</Button>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditShop;
