import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import { Text, Box, Image, Flex } from "@chakra-ui/react";
import { FaWindowClose, FaDirections } from "react-icons/fa";
import storeIcon from "../../assets/storeIcon.png";
import './CartForm.css';
import cart from '../../assets/cartButton.png';
import { Shop } from "../ShopForm/EditShop/EditShop";
import { completePhotoUrl } from "../Images/CompletePhotoUrl";
import { useContextProvider } from "../../ContextProvider";

interface Product {
  id: number;
  name: string;
  photoUrl: string | undefined;
  pricePerUnit: number;
  quantity: number;
}

export interface CartDto {
  id: number;
  userId: string;
  product: Product;
  shop: Shop;
}

interface Props {
}

const CartOrders: React.FC<Props> = ({  }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { token, 
          accountType, 
          isCartFormOpen,
          setIsCartFormOpen,
          isFarmFormOpen,
          handleCartShopClick,
          cartItems,
          setCartItems,
          inLoginSelection,
          showCart,
          setShowCart,
        } = useContextProvider();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get<CartDto[]>(`https://localhost:7218/api/Carts/UserCarts`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCartItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };

    fetchCartItems(); 
  }, [token]);

  const handleRemoveFromCart = async (cartId: number | undefined) => {
    if (cartId === undefined) return;

    try {
      await axios.delete(`https://localhost:7218/api/Carts/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(cartItems.filter((cart) => cart.id !== cartId));
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleImplementLater = (cartId: number | undefined) => {
    console.log(`Button O clicked for cart ID: ${cartId}`);
    // Implement your functionality here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {accountType===1 &&
      showCart &&
      !isFarmFormOpen && 
      !inLoginSelection &&
      (
        <Image
          fontSize={10}
          src={cart}
          className="cart-button"
          onClick={() => {
            setShowCart(false);
            setIsCartFormOpen(true);
          }}
        />
      )}
      {isCartFormOpen &&
      !inLoginSelection &&
      (
        <Box className="cart-form-container">
          <IoMdCloseCircle
            className="cart-close-button"
            onClick={() => {
              setShowCart(true);
              setIsCartFormOpen(false);
            }}
          />
          <Box mt={140} className="cart-scrollable" height="calc(100% + 19px)" overflowY="auto">
            <Box mb={150}>
              {cartItems.map((cart) => (
                <Box className="cart-order" key={cart.id}>
                  <Flex direction={"row"}>
                    <Image
                      padding={10}
                      boxSize={130}
                      borderRadius={15}
                      src={completePhotoUrl(cart.product.photoUrl)}
                      alt={`Cart ${cart.id}`}
                    />
                    <Flex direction={"column"}>
                      <div className="custom-tooltip">
                        <Text className="cart-order-title">
                          {cart.product.name.length > 9
                            ? `${cart.product.name.substring(0, 9)}...`
                            : cart.product.name}
                        </Text>
                        <span className="custom-tooltiptext">{cart.product.name}</span>
                      </div>
                    </Flex>
                    <Box position="relative" cursor="pointer" padding={10}>
                      <Image
                        boxSize={130}
                        borderRadius={15}
                        src={completePhotoUrl(cart.shop.photoUrl)}
                        alt={`Shop ${cart.product.id}`}
                        onClick={() => handleCartShopClick(cart.product.id, cart.shop.id)}
                      />
                      <Box position="absolute" top={15} left={15} padding={2}>
                        <Image src={storeIcon} boxSize={35} alt="Shop Icon" opacity={0.8} onClick={() => handleCartShopClick(cart.product.id, cart.shop.id)} />
                      </Box>
                    </Box>
                    <Box>
                      <Flex direction={"column"} ml={120} mt={15} gap={15}>
                        <FaDirections
                          className="cart-implement-button"
                          style={{ cursor: "pointer" }}
                          fontSize={30}
                          color="teal"
                          onClick={() => handleImplementLater(cart.id)}
                        />
                        <FaWindowClose
                          className="cart-remove-button"
                          style={{ marginLeft: "5px", cursor: "pointer", width: '50px', height: '50px' }}
                          fontSize={30}
                          color="red"
                          onClick={() => handleRemoveFromCart(cart.id)}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default CartOrders;
