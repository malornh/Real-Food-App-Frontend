import React, { useState, useRef, useEffect } from 'react';
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
    FormLabel,
    Select,
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './EditProduct.css';
import ImageCropper from '../ShopForm/ImageCropper/ImageCropper';
import theme from '../ShopForm/EditShop/theme';
import { Product } from './FarmForm';
import axios from 'axios';
import { completePhotoUrl } from '../Images/CompletePhotoUrl.ts';
import { useContextProvider } from '../../ContextProvider';

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
    const [productTypes, setProductTypes] = useState<string[]>([]);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const { token } = useContextProvider();

    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const response = await axios.get('https://localhost:7218/api/Products/GetTypes');
                setProductTypes(response.data);
            } catch (error: any) {
                console.error('Error fetching product types:', error.message);
            }
        };

        fetchProductTypes();
    }, []);

    const updateProduct = async (product: Product) => {
        try {
            const formData = new FormData();
            formData.append('Id', String(product.id)); // Add product ID
            formData.append('Name', product.name); // Add product name
            formData.append('Type', product.type || ''); // Add product type
            formData.append('FarmId', String(product.farmId)); // Add farm ID
            formData.append('Description', product.description || ''); // Add product description
            formData.append('Quantity', String(product.quantity)); // Add product quantity
            formData.append('PricePerUnit', String(product.pricePerUnit)); // Add product price
            formData.append('DeliveryRadius', String(product.deliveryRadius)); // Add delivery radius
            formData.append('MinUnitOrder', String(product.minUnitOrder)); // Add minimum order unit
            formData.append('Rating', product.rating ? String(product.rating) : ''); // Add rating

            // If a new photo file is provided, append it to the FormData
            if (product.photoFile) {
                formData.append('PhotoFile', product.photoFile); // Append the image file
            }

            const response = await axios.put(`https://localhost:7218/api/Products/${product.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            });

            onProductUpdate(response.data); // Call the function to update the state with the response data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error updating product:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error updating product:', error);
            }
        }
    };

    // Function to create a new product
    const createProduct = async (product: Product) => {
        try {
            const formData = new FormData();
            formData.append('Name', product.name); // Add product name
            formData.append('Type', product.type || ''); // Add product type
            formData.append('FarmId', String(product.farmId)); // Add farm ID
            formData.append('Description', product.description || ''); // Add product description
            formData.append('Quantity', String(product.quantity)); // Add product quantity
            formData.append('PricePerUnit', String(product.pricePerUnit)); // Add product price
            formData.append('DeliveryRadius', String(product.deliveryRadius)); // Add delivery radius
            formData.append('MinUnitOrder', String(product.minUnitOrder)); // Add minimum order unit
            formData.append('Rating', product.rating ? String(product.rating) : ''); // Add rating

            // If a photo file is provided, append it to the FormData
            if (product.photoFile) {
                formData.append('PhotoFile', product.photoFile); // Append the image file
            }

            const response = await axios.post('https://localhost:7218/api/Products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            });

            onProductUpdate(response.data); // Update state with the newly created product
            onClose(); // Close any dialogs or forms as needed
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating product:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error creating product:', error);
            }
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
            const response = await axios.delete(`https://localhost:7218/api/Products/${product.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Check if the response status is within the successful range
            if (response.status === 200) {
                if (product.id !== undefined) {
                    onDelete(product.id); // Call the onDelete callback if product ID is defined
                }
                onClose(); // Close any dialogs or forms as needed
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error deleting product:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error deleting product:', error);
            }
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
                            <Box mt={-4} ml={-6} width="40%">
                                <ImageCropper
                                    initialImage={product.photoUrl === undefined ? completePhotoUrl("https://iili.io/2ZDQHhl.png") : completePhotoUrl(product.photoUrl)}
                                    onImageChange={handleImageChange}
                                />
                            </Box>
                            <Box ml={5} mt={-1} width="60%">
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
                                        className="custom-input"
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
                                        className="custom-textarea"
                                    />
                                </FormControl>

                                <Flex>
                                    <FormControl mb={4} width="50%" mr={2}>
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
                                            className="custom-input"
                                        />
                                    </FormControl>

                                    <FormControl mb={4} width="50%">
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
                                            className="custom-input"
                                        />
                                    </FormControl>
                                </Flex>
                                <Flex>
                                        <FormControl mb={4} width="33%" mr={2}>
                                            <FormLabel fontSize="14px" mb={1} ml={1} color="gray.500">
                                                Product Type
                                            </FormLabel>
                                            <>
                                                <input
                                                    list="productTypesList"
                                                    value={newProduct.type}
                                                    onChange={(e) =>
                                                        setNewProduct((prevState) => ({
                                                            ...prevState,
                                                            type: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Add New or select from the list"
                                                    className="custom-input"
                                                />
                                                <datalist id="productTypesList">
                                                    {productTypes.map((type, index) => (
                                                        <option key={index} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </datalist>
                                            </>
                                        </FormControl>

                                        <FormControl mb={4} width="33%" mr={2}>
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
                                                className="custom-input"
                                            />
                                        </FormControl>

                                        <FormControl mb={4} width="33%">
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
                                                className="custom-input"
                                            />
                                        </FormControl>
                                    </Flex>
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
                                className="custom-close-button"
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
