import React, { useState, useRef } from 'react';
import { Text, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, FormControl, Input, Textarea, Box, Flex, ChakraProvider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, FormLabel } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './EditProduct.css';
import ImageCropper from '../ShopForm/ImageCropper/ImageCropper';
import theme from '../ShopForm/EditShop/theme';
import { Product } from './FarmForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onProductUpdate: (product: Product) => void;
  onDelete: (productId: number) => void;
}

const EditProduct: React.FC<Props> = ({ isOpen, onClose, product, onProductUpdate, onDelete }) => {
  const [newProduct, setNewProduct] = useState<Product>({ ...product });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const updateProduct = async (product: Product) => {
    try {
      const response = await fetch(`https://localhost:7218/api/Products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const createProduct = async (product: Product) => {
    try {
      const response = await fetch(`https://localhost:7218/api/Products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }

      const responseProduct = await response.json();
      onProductUpdate(responseProduct);
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleSave = async () => {
    if (newProduct.id === undefined) {
      await createProduct(newProduct);
    } else {
      await updateProduct(newProduct);
      onProductUpdate(newProduct);
      onClose();
    }
  };

  const handleImageChange = (newImage: File) => {
    setNewProduct(prevState => ({
      ...prevState,
      photoFile: newImage
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://localhost:7218/api/Products/${product.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }
      if (product.id !== undefined) onDelete(product.id);
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
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
                  initialImage={product.image}
                  onImageChange={handleImageChange}
                />
                <Box ml={5}>
                  <FormControl mb={4}>
                    <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                      Product Type
                    </FormLabel>
                    <Input
                      value={newProduct.type}
                      onChange={(e) =>
                        setNewProduct((prevState) => ({
                          ...prevState,
                          type: e.target.value,
                        }))
                      }
                      fontSize="20px"
                      height="70px"
                      width="370px"
                      borderRadius="10px"
                      color="black"
                      background="rgba(254, 190, 65, 0.9)"
                    />
                  </FormControl>
                  <FormControl mb={4} mt={4}>
                    <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                      Quantity
                    </FormLabel>
                    <Input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct((prevState) => ({
                          ...prevState,
                          quantity: parseInt(e.target.value),
                        }))
                      }
                      fontSize="20px"
                      height="70px"
                      width="370px"
                      borderRadius="10px"
                      color="black"
                      background="rgba(254, 190, 65, 0.9)"
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                      Unit of Measurement
                    </FormLabel>
                    <Input
                      value={newProduct.unitOfMeasurement}
                      onChange={(e) =>
                        setNewProduct((prevState) => ({
                          ...prevState,
                          unitOfMeasurement: parseInt(e.target.value),
                        }))
                      }
                      fontSize="20px"
                      height="70px"
                      width="370px"
                      borderRadius="10px"
                      color="black"
                      background="rgba(254, 190, 65, 0.9)"
                    />
                  </FormControl>
                </Box>
              </Box>
              <Box ml={5} mt={-1}>
                <FormControl mb={4}>
                  <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                    Product Name
                  </FormLabel>
                  <Input
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }))
                    }
                    fontSize="40px"
                    height="70px"
                    width="575px"
                    borderRadius="10px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                    Product Description
                  </FormLabel>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }))
                    }
                    fontSize="20px"
                    height="306px"
                    width="575px"
                    borderRadius="10px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>

                <FormControl mb={4} mt={4}>
                  <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                    Minimum Unit Order
                  </FormLabel>
                  <Input
                    type="number"
                    value={newProduct.minUnitOrder}
                    onChange={(e) =>
                      setNewProduct((prevState) => ({
                        ...prevState,
                        minUnitOrder: parseInt(e.target.value),
                      }))
                    }
                    fontSize="20px"
                    height="70px"
                    width="575px"
                    borderRadius="10px"
                    color="black"
                    background="rgba(254, 190, 65, 0.9)"
                  />
                </FormControl>

                <FormControl mb={4} mr={-50}>
                  <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                    Delivery Radius
                  </FormLabel>
                  <Input
                    type="number"
                    value={newProduct.deliveryRadius}
                    onChange={(e) =>
                      setNewProduct((prevState) => ({
                        ...prevState,
                        deliveryRadius: parseFloat(e.target.value),
                      }))
                    }
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
              width={130}
              onClick={openDeleteConfirm}>
              Delete Product
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
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody color="black">
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="bold">
                {product.name}
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

export default EditProduct;
