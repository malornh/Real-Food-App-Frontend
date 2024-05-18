import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, FormControl, FormLabel, Input, Textarea, Box, Image, Flex } from '@chakra-ui/react';
import L from 'leaflet';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import 'leaflet/dist/leaflet.css';
import './EditShop.css'
import ImageCropper from '../ImageCropper/ImageCropper';


const EditShop = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>('https://www.indiafilings.com/learn/wp-content/uploads/2023/03/How-can-I-register-my-shop-and-establishment-online.jpg');
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const [imgSrc, setImageSrc] = useState<string | null>(null);

    useEffect(()=>{
      console.log(imgSrc);
    }, [imgSrc]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        let marker: L.Marker | null = null;
    
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
        // Implement your save logic here
        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const imageUrl = URL.createObjectURL(file);
            setImageUrl(imageUrl);
        }
    };

    const handleClickImage = () => {
        // Trigger file upload
        const inputElement = document.getElementById('file-input');
        if (inputElement) {
            inputElement.click();
        }
    };

    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px) hue-rotate(90deg)"
          />
          <ModalContent className="modalContent">
            <ModalBody style={{ overflowY: "auto" }}>
              <Flex>
                <Box mt={4}>
                <ImageCropper handlePhotoChange={(imgSrc)=>setImageSrc(imgSrc)}/>
                  <Box
                    mt={-7}
                    ref={mapContainer}
                    style={{
                      borderRadius: '10px',
                      height: "260px",
                      width: "355px",
                      position: "relative",
                      marginLeft: '15px',
                      border: '2px solid black',
                    }}>
                  </Box>
                </Box>

                <Box ml={15} mt={5}>
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
                  <FormControl mr={15} mt={10}>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                      fontSize='20px'
                      height="540px" // Adjust the height as needed
                      width='540px'
                      borderRadius='5px'

                    />
                  </FormControl>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSave}>
                Save
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};

export default EditShop;
