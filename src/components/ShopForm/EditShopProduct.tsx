import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  FormControl,
  Input,
  Checkbox,
  ChakraProvider,
} from "@chakra-ui/react";
import theme from "../ShopForm/EditShop/theme";
import { Text } from "@chakra-ui/react";

interface ProductDetails {
  id: number;
  name: string;
}

interface Farm {
  id: number;
  name: string;
}

interface Order {
  id: number;
  quantity: number;
  shopPrice: number;
  soldOut: boolean;
  product: ProductDetails;
  shortFarm: Farm;
  dateOrdered: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onOrderUpdate: (order: Order) => void;
}

const EditOrder: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  onOrderUpdate,
}) => {
  const [newOrder, setNewOrder] = useState<Order>({ ...order });

  const updateOrder = async (order: Order) => {
    try {
      const response = await fetch(
        `https://localhost:7218/api/Orders/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error: ${response.status} - ${error}`);
      }

      const updatedOrder = await response.json();
      onOrderUpdate(updatedOrder);
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleSave = async () => {
    await updateOrder(newOrder);
  };

  return (
    <ChakraProvider theme={theme}>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent className="modalContent" maxW="20vw" maxH="70vh">
          <ModalBody>
            <FormControl mb={4}>
              <Text color={"black"} mb={1} mt={3} fontWeight={"bold"}>
                Цена в лв.
              </Text>
              <Input
                type="number"
                placeholder="Shop Price"
                value={newOrder.shopPrice}
                onChange={(e) =>
                  setNewOrder((prevState) => ({
                    ...prevState,
                    shopPrice: parseFloat(e.target.value),
                  }))
                }
                fontSize="20px"
                height="50px"
                borderRadius="10px"
                color="black"
                background="rgb(240, 240, 240, 0.7)"
              />
            </FormControl>
            <FormControl mb={4}>
              <Checkbox
                color="black"
                fontWeight={"bold"}
                borderColor="black" // Sets border color to black
                size="lg" // Makes the checkbox larger
                colorScheme="black" // Sets text and border color to black when checked
                isChecked={newOrder.soldOut} // Controls the checked state
                onChange={(e) =>
                  setNewOrder((prevState) => ({
                    ...prevState,
                    soldOut: e.target.checked,
                  }))
                }>
                Sold Out
              </Checkbox>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={onClose} color={'black'}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default EditOrder;
