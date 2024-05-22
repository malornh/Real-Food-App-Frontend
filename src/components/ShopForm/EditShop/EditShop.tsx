import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, useDisclosure, FormControl, Input, Textarea, Box, Flex } from '@chakra-ui/react';
import L from 'leaflet';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import 'leaflet/dist/leaflet.css';
import './EditShop.css';
import ImageCropper from '../ImageCropper/ImageCropper';

interface EditShopProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditShop: React.FC<EditShopProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const [imgSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        console.log(isOpen);
    }, [imgSrc]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        if (isOpen) {
            timeoutId = setTimeout(() => {
                if (mapContainer.current && !mapRef.current) {
                    mapRef.current = L.map(mapContainer.current).setView([42.69, 23.35], 13);

                    const mapTilerLayer = new MaptilerLayer({
                        apiKey: 'dJS38j47jXwMgeCxB2ha',
                        styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
                    }).addTo(mapRef.current);

                    // Handle click event on the map to log latitude and longitude of the marker
                    mapRef.current.on('click', (event: L.LeafletMouseEvent) => {
                        const { lat, lng } = event.latlng;
                        console.log(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`);
                    });
                }
            }, 1);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [isOpen]);

    const handleSave = () => {
        onClose();
    };

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='xl'>
          <ModalOverlay
                bg="blackAlpha.300"
                backdropFilter="blur(10px) hue-rotate(90deg)"
                className="modal-overlay"
            />
            <ModalContent className="modalContent" maxW="67vw" maxH='95%'>
                <ModalBody style={{ overflowY: "auto" }} mt={-2}>
                    <Flex>
                        <Box mt={-5}>
                            <ImageCropper handlePhotoChange={(imgSrc) => setImageSrc(imgSrc)} />
                            <Box
                                mt={0}
                                ref={mapContainer}
                                style={{
                                    borderRadius: '10px',
                                    height: "260px",
                                    width: "355px",
                                    position: "relative",
                                    marginLeft: '16px',
                                    border: '2px solid black',
                                }}
                            />
                        </Box>

                        <Box ml={5} mt={-1}>
                            <FormControl mb={4}>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter name"
                                    fontSize='40px'
                                    height="70px" // Adjust the height as needed
                                    width='540px'
                                    borderRadius='5px'
                                />
                            </FormControl>
                            <FormControl mr={0}>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description"
                                    fontSize='20px'
                                    height="520px" // Adjust the height as needed
                                    width='560px'
                                    borderRadius='5px'
                                />
                            </FormControl>
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter mb={-6}>
                    <Button colorScheme="blue" background='teal' mr={10} width={100} onClick={handleSave}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditShop;