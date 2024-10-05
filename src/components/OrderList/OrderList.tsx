import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Text, Box, Image, Flex } from "@chakra-ui/react";
import "./OrderList.css";
import truck from "../../assets/deliveryButton.png";
import axios from "axios";
import { Product } from "../FarmForm/FarmForm";
import { Farm } from "../FarmForm/EditFarm";
import { LuArrowRightSquare } from "react-icons/lu";
import { Shop } from "../ShopForm/EditShop/EditShop";
import { FaWindowClose } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import storeIcon from '../../assets/storeIcon.png';
import { useContextProvider } from "../../ContextProvider";
import { completePhotoUrl } from "../Images/CompletePhotoUrl";

interface OrderDto {
  id: number;
  shopId: number;
  productId: number | undefined;
  quantity: number;
  shopPrice: number | null;
  status: string;
  dateOrdered: string;
}

export interface OrderItem {
  id: number;
  status: string;
  quantity: number;
  shopPrice: number | null;
  dateOrdered: string;
  product: Product;
  farm: Farm;
  shop: Shop;
}

interface Props {
}

const mapOrderToOrderDto = (order: OrderItem): OrderDto => {
  return {
    id: order.id,
    shopId: order.shop.id ?? 0, // Assuming a default value of 0 if shop id is undefined
    productId: order.product.id, // Assuming the Product interface has an id property
    quantity: order.quantity,
    shopPrice: order.shopPrice,
    status: order.status,
    dateOrdered: order.dateOrdered, // Assuming dateOrdered is already a string
  };
};

const haversineDistance = (
  coords1: [number, number],
  coords2: [number, number]
): number => {
  function toRad(x: number) {
    return (x * Math.PI) / 180;
  }

  const lat1 = coords1[0];
  const lon1 = coords1[1];
  const lat2 = coords2[0];
  const lon2 = coords2[1];

  console.log("Latitude and Longitude:", { lat1, lon1, lat2, lon2 });

  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  console.log("Delta Latitude:", dLat);
  console.log("Delta Longitude:", dLon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  console.log("a:", a);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  console.log("c:", c);

  const d = R * c;
  console.log("Distance:", d);

  return d;
};

const FarmContainer: React.FC<Props> = ({
}: Props) => {
  const { token, 
          setIsOrderFormOpen, 
          isDeliveryListOpen,
          setIsDeliveryListOpen,
          loginId,
          handleShopClick,
          showDelivery,
          setShowDelivery,
          handleDeliveryShopClick,
          orderList,
          setOrderList,
          accountType,
          isFarmFormOpen,
        } = useContextProvider();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7218/api/Orders/AllFarmOrders/${loginId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
  
        // Define the order statuses as a Record
        const statusOrder: Record<string, number> = {
          Pending: 1,
          Completed: 2,
          Canceled: 3
        };
  
        // Sort the orders: Pending first, then Completed, then Canceled
        const sortedOrders = response.data.sort((a: OrderItem, b: OrderItem) => {
          return statusOrder[a.status] - statusOrder[b.status];
        });
  
        setOrderList(sortedOrders);
  
        // Manual test
        const testDistance = haversineDistance([42.705, 23.3097], [42.7, 23.3]);
        console.log(`Test Distance: ${testDistance.toFixed(2)} km`);
      } catch (error) {
        console.error("Error fetching farm data:", error);
      }
    };
  
    fetchData();
  }, [loginId]);
  

  function handleAcceptOrder(orderId: number | undefined) {
    if (orderId === undefined) return;

    const orderToUpdate = orderList.find((order) => order.id === orderId);
    if (!orderToUpdate) return;

    const updatedOrder = { ...orderToUpdate, status: "Completed" };

    const updateOrder = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
        const response = await axios.put(
          `https://localhost:7218/api/Orders/${orderId}`,
          mapOrderToOrderDto(updatedOrder),
          { headers }
        );
    
        console.log("Order updated successfully:", response.data);
        setOrderList(orderList.map((order) =>
            order.id === orderId ? { ...order, status: "Completed" } : order
          )
        );
      } catch (error) {
        console.error("Error updating order:", error);
      }
    };
    
    updateOrder();
  }

  function handleCancelOrder(orderId: number | undefined) {
    if (orderId === undefined) return;

    // Find the order to update
    const orderToUpdate = orderList.find((order) => order.id === orderId);
    if (!orderToUpdate) return;

    const updatedOrder = { ...orderToUpdate, status: "Canceled" };

    axios
      .put(
        `https://localhost:7218/api/Orders/${orderId}`,
        mapOrderToOrderDto(updatedOrder)
      )
      .then((response) => {
        console.log("Order updated successfully:", response.data);
        setOrderList(orderList.map((order) =>
            order.id === orderId ? { ...order, status: "Canceled" } : order
          )
        );
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}>
      {!isDeliveryListOpen && !isFarmFormOpen && accountType == 3 && showDelivery && (
        <Image
          src={truck}
          className="truck-button"
          style={{ left: showDelivery ? "calc(40%)" : "35px" }}
          onClick={() => (setIsDeliveryListOpen(true), setShowDelivery(false))}
        />
      )}
      {isDeliveryListOpen &&
       !showDelivery && (
        <Box className="form-container" >
          <IoMdCloseCircle
            className="closeButton"
            onClick={() => (setIsDeliveryListOpen(false), setShowDelivery(true), console.log(orderList))}
          />
          <Box mt={140} className="scrollable"
            height="calc(100% + 19px)"
            overflowY="auto">
          <Box mb={150}>
            {orderList.map((o) => {
              const shopCoords: [number, number] = [
                o.shop.latitude,
                o.shop.longitude,
              ];
              const farmCoords: [number, number] = [
                o.farm.latitude,
                o.farm.longitude,
              ];
              const distance = haversineDistance(
                shopCoords,
                farmCoords
              ).toFixed(2);
              console.log(`Calculated Distance: ${distance} km`);

              return (
                <Box className="order" key={o.id}>
                  <Flex direction={"row"}>
                    <Image
                      padding={10}
                      boxSize={130}
                      borderRadius={15}
                      src={completePhotoUrl(o.product.photoId)}
                      alt={`Order ${o.id}`}
                    />
                    <Flex direction={"column"}>
                      {/* Displaying distance */}
                      <div className="custom-tooltip">
    <Text className="orderTitle">
        {o.product.name.length > 9 ? `${o.product.name.substring(0, 9)}...` : o.product.name}
    </Text>
    <span className="custom-tooltiptext">{o.product.name}</span>
</div>

                      <Text color={"teal"}>На: {distance} км</Text>
                      <Text
                        className="orderTitle"
                        style={{ fontSize: "17px", width: "130px" }}>
                        Количество: {o.quantity}
                      </Text>
                      <Text
                        className="orderTitle"
                        style={{ fontSize: "17px", width: "130px" }}>
                        Цена: {(o.quantity * o.product.pricePerUnit).toFixed(2)}{" "}
                        лв.
                      </Text>
                    </Flex>
                    <LuArrowRightSquare
                      style={{
                        marginTop: "60px",
                        marginLeft: "-20px",
                        marginRight: "15px",
                      }}
                      fontSize={40}
                      color="teal"
                    />
                    <Box position="relative" cursor="pointer" padding={10}>
                    <Image
                      boxSize={130}
                      borderRadius={15}
                      src={completePhotoUrl(o.shop.photoId)}
                      alt={`Order ${o.id}`}
                      onClick={() => handleDeliveryShopClick(o.shop.id)} // Implement that in context api same as handleShopClick, but not to close FarmContainer.
                    />
                    <Box position="absolute" top={15} left={15} padding={2}>
                      <Image src={storeIcon} boxSize={35} alt="Shop Icon" opacity={0.8} onClick={()=>handleDeliveryShopClick(o.shop.id)} />
                    </Box>
                  </Box>
                    <Box>
                      <Box
                        width={160}
                        height={50}
                        mt={10}
                        mb={20}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        <Text fontSize={30} color={"black"}>
                          {o.status}
                        </Text>
                      </Box>
                      {o.status === "Pending" && (
                        <Flex direction={"row"} ml={5} mt={-10}>
                          <FaCheckSquare
                            className="pendingButtons"
                            style={{ marginRight: "15px", cursor: "pointer" }}
                            fontSize={70}
                            color="#32CD32"
                            onClick={() => handleAcceptOrder(o.id)}
                          />
                          <FaWindowClose
                            className="pendingButtons"
                            style={{ cursor: "pointer" }}
                            fontSize={70}
                            color="red"
                            onClick={() => handleCancelOrder(o.id)}
                          />
                        </Flex>
                      )}

                      {o.status === "Completed" && (
                        <FaCheck
                          style={{ marginLeft: "50px" }}
                          fontSize={50}
                          color="green"
                        />
                      )}

                      {o.status === "Canceled" && (
                        <CgClose
                          style={{ marginLeft: "50px", marginTop: '-10px' }}
                          fontSize={70}
                          color="red"
                        />
                      )}
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default FarmContainer;
