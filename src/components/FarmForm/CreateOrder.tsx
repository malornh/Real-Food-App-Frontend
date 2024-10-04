import React, { useState } from "react";
import {
  Text,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Input,
  Box,
  Image,
  ChakraProvider,
  Flex,
} from "@chakra-ui/react";
import theme from "../ShopForm/EditShop/theme";
import { Product } from "./FarmForm";
import { useContextProvider } from "../../ContextProvider";
import { OrderItem } from "../OrderList/OrderList";

export interface Order {
  id?: number;
  shopId: number;
  productId: number;
  quantity: number;
  status: string;
  dateOrdered: string;
  shopPrice?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  shopId: number;
  onOrderCreate: (order: Order) => void;
}

const CreateOrder: React.FC<Props> = ({
  isOpen,
  onClose,
  product,
  shopId,
  onOrderCreate,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const { token, orderList, setOrderList } = useContextProvider();

  const createOrder = async (order: Order) => {
    try {
      const response = await fetch(`https://localhost:7218/api/Orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }

      const responseOrder: OrderItem = await response.json();
      setOrderList([...orderList, responseOrder]);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleSave = async () => {
    if (product) {
      const newOrder: Order = {
        shopId: shopId,
        productId: product.id!,
        quantity: quantity,
        status: "Pending",
        dateOrdered: new Date().toISOString().split("T")[0],
      };
      await createOrder(newOrder);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value) || 0; // Parse input value to integer or default to 0 if NaN

    if (inputValue <= product.quantity) {
      setQuantity(inputValue);
      setTotalPrice(inputValue * product.pricePerUnit);
    } else {
      setQuantity(product.quantity);
      setTotalPrice(product.quantity * product.pricePerUnit);
    }
  };
  
  function completePhotoUrl(photoId: string | undefined){
    return 'https://realfoodapp.b-cdn.net/' + photoId;
  }

  return (
    <ChakraProvider theme={theme}>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent maxW="68vw" maxH="95%">
          <ModalBody style={{ overflowY: "auto" }} mt={0}>
            <Flex>
              <Image
                mt={5}
                mr={5}
                mb={5}
                borderRadius={10}
                boxSize={280}
                src={completePhotoUrl(product.photoId)}
              />
              <Box mt={2}>
                <Text mb={2} fontSize={40} color={"black"}>
                  {product.name}
                </Text>
                <Text color={"black"} width={435}>
                  {product.description}
                </Text>
                <Text
                  background={"rgba(7, 175, 0)"}
                  color={"white"}
                  padding={1}
                  borderRadius={5}
                  fontSize={14}
                  position={"absolute"}
                  bottom={5}
                  right={285}>
                  {product.rating === null ? "new" : product.rating} / 5.0
                </Text>
              </Box>
              <Box
                w="1px" // Width of the vertical line
                h="260px" // Height of the vertical line
                bg="gray" // Color of the vertical line
                borderRadius={5}
                mt={8}
                ml={8}
                mr={35}
              />
              <Box mt={6}>
                <Text fontSize={25} mb={5} color={"teal"}>
                  {product.pricePerUnit} лв.
                  {product.unitOfMeasurement === 3
                    ? " за 1 бр. "
                    : product.unitOfMeasurement === 2
                    ? " за кг. "
                    : " за лт. "}
                </Text>
                <Input
                  color={"black"}
                  type="number"
                  mb={7}
                  onChange={handleInputChange}
                  placeholder="Kоличество"
                  borderColor={"black"}
                  maxW={140}
                  max={product.quantity}
                  sx={{
                    "::placeholder": {
                      color: "gray",
                    },
                  }}
                />
                <Text fontSize={20} mt={5} color={"teal"}>
                  Обща цена:
                </Text>
                <Text color={"white"} fontSize={35} fontWeight="bold">
                  {totalPrice.toFixed(2)} лв.
                </Text>
                <Flex mt={4} direction={"row"}>
                  <Button
                    colorScheme="teal"
                    mr={5}
                    width={100}
                    onClick={handleSave}>
                    Order
                  </Button>
                  <Button
                    color="black"
                    background="rgba(145, 150, 150, 0.2)"
                    onClick={onClose}>
                    Close
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default CreateOrder;
