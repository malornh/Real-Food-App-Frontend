import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Image,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Flex,
} from "@chakra-ui/react";
import { BsArrowRepeat } from "react-icons/bs";
import { PiShoppingCartSimpleDuotone } from "react-icons/pi";
import { FcSettings } from "react-icons/fc";
import { HiMiniPlusCircle } from "react-icons/hi2";
import "./ShopForm.css";
import EditShop, { Shop } from "./EditShop/EditShop";
import soldOut from "../../assets/soldOut.png";
import EditShopProduct from "./EditShopProduct";

interface ShopData {
  id: number;
  userId: string;
  name: string;
  photoFile?: File | null;
  photoId: string | undefined;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  orders: OrderWithProduct[];
}

export interface OrderWithProduct {
  id: number;
  quantity: number;
  shopPrice: number;
  soldOut: boolean;
  product: ProductDetails;
  shortFarm: Farm;
  dateOrdered: string;
  shopId: number;
  productId: number;
  status: string;
}

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  type: string;
  pricePerUnit: number;
  unitOfMeasurement: number;
  image: string;
  rating: number | null;
  dateUpdated: string;
}

interface Farm {
  id: number;
  name: string;
  image: string;
}

interface Props {
  shopId: number | undefined;
  isShopOwned: boolean | undefined;
  forwardShopUpdate: (shop: Shop) => void;
  forwardShopDelete: (shopId: number) => void;
  handleClickedFarmId: (farmId: number) => void;
  handleIsShopClicked: (b: boolean) => void;
  accountType: number; //1 - user, 2 - shop, 3 - farm
  loginId: number | undefined;
  inLoginSelection: boolean;
  handleClickedCart: (productId: number, shopId: number)=>void;
}

const sortOrders = (orders: OrderWithProduct[]) => {
  return orders.sort((a, b) => {
    if (!a.soldOut && b.soldOut) {
      return -1;
    }
    if (a.soldOut && !b.soldOut) {
      return 1;
    }
    if (a.shopPrice === null && b.shopPrice !== null) {
      return -1;
    }
    if (a.shopPrice !== null && b.shopPrice === null) {
      return 1;
    }

    return (
      new Date(b.dateOrdered).getTime() - new Date(a.dateOrdered).getTime()
    );
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const ShopForm: React.FC<Props> = ({
  shopId,
  isShopOwned,
  forwardShopUpdate,
  forwardShopDelete,
  handleClickedFarmId,
  handleIsShopClicked,
  accountType,
  loginId,
  inLoginSelection,
  handleClickedCart
}) => {
  const [shopData, setShopData] = useState<ShopData | undefined>(undefined);
  const [hoveredOrderId, setHoveredOrderId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithProduct | null>(null);

  const typeList = Array.from(
    new Set(shopData?.orders.map((o) => o.product.type))
  ).sort();

  useEffect(() => {
    const fetchShopData = async () => {
      console.log(shopId);
      try {
        if (shopId !== undefined) {
          const response = await axios.get<ShopData>(
            `https://localhost:7218/api/Shops/${shopId}/OrdersWithFarms`
          );
          const sortedOrders = sortOrders(response.data.orders);
          setShopData({ ...response.data, orders: sortedOrders });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchShopData();
  }, [shopId]); // Ensure shopId is correctly updated on product updates

  const flipImage = (orderId: number) => {
    setHoveredOrderId(orderId);
    const cardInner = document.querySelector(
      `#flip-card-inner-${orderId}`
    ) as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = "rotateY(180deg)";
    }
  };

  const unflipImage = (orderId: number) => {
    setHoveredOrderId(null);
    const cardInner = document.querySelector(
      `#flip-card-inner-${orderId}`
    ) as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = "rotateY(0deg)";
    }
  };

  const mapToShop = (shop: ShopData): Shop => ({
    id: shop.id,
    userId: shop.userId,
    photoFile: shop.photoFile,
    photoId: shop.photoId,
    name: shop.name,
    description: shop.description,
    latitude: shop.latitude,
    longitude: shop.longitude,
    rating: shop.rating,
  });

  function handleShopUpdate(shop: Shop): void {
    setShopData((currentShopData) => {
      if (!currentShopData) return currentShopData; 
      return {
        ...currentShopData, 
        name: shop.name,
        description: shop.description,
        photoId: shop.photoId,   
        latitude: shop.latitude,
        longitude: shop.longitude,
      };
    });
    forwardShopUpdate(shop); 
  }

  const handleProductEditClick = (order: OrderWithProduct) => {
    setSelectedOrder(order);
    setIsEditProductModalOpen(true);
  };

  const handleProductUpdate = (updatedOrder: OrderWithProduct) => {
    if (!shopData) return;

    const updatedOrders = shopData.orders.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    );

    setShopData({
      ...shopData,
      orders: updatedOrders,
    });
  };

  function completePhotoUrl(photoId: string | undefined){
    return 'https://realfoodapp.b-cdn.net/' + photoId;
  }

  return (
    <div>
      {shopData && (
        <div className="shopCardContainer">
          <img src={completePhotoUrl(shopData.photoId)} className="shopImage" />
          <div className="shopInfoContainer">
            <div style={{ display: "flex", width: "330px", marginLeft: "5px" }}>
              <h1 className="shopTitle">{shopData.name}</h1>
              {isShopOwned &&
                accountType === 2 &&
                !inLoginSelection &&
                loginId === shopData.id && (
                  <FcSettings
                    className="shopFormSettingsBtn"
                    onClick={() => setIsEditModalOpen(true)}
                  />
                )}
            </div>
            <p className="shopDescription">{shopData.description}</p>
            <div className="shopRatingContainer">{shopData.rating} / 5.0</div>
          </div>
        </div>
      )}

      <Tabs>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TabList className="shopProductTabMenu">
            {typeList.map((type) => (
              <Tab className="shopTab" key={type as string}>
                {type as string}
              </Tab>
            ))}
          </TabList>
          {isShopOwned && (
            <HiMiniPlusCircle className="shopProductPlusButton" />
          )}
        </div>

        {shopData?.orders.length === 0 && (
          <Box
            mt={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              background: "rgba(254, 216, 65, 0.8)",
              borderRadius: "5px",
              color: "grey",
              height: 145,
            }}>
            <Text fontSize={25} alignContent={"center"} ml={230}>
              Not available products!
            </Text>
          </Box>
        )}

        <TabPanels>
          {typeList.map((type) => (
            <TabPanel className="shopTabPanel" key={type as string}>
              {shopData?.orders
                .filter((o) => o.product.type === type)
                .filter(
                  (order) =>
                    (accountType === 2 && loginId === shopData.id) ||
                    order.shopPrice !== null
                )
                .map((order) => (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      background: "rgba(254, 216, 65, 0.8)",
                      borderRadius: "5px",
                      border:
                        order.shopPrice === null &&
                        !order.soldOut &&
                        isShopOwned
                          ? "3px solid red"
                          : "none",
                    }}>
                    <div
                      style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div
                        onMouseOver={() => flipImage(order.id)}
                        onMouseOut={() => unflipImage(order.id)}>
                        <div className="flip-card">
                          <div className="flip-card-inner">
                            <div className="flip-card-front">
                              <img
                                className="original-image"
                                src={order.product.image}
                                alt="Original Image"
                              />
                            </div>
                            <div className="flip-card-back">
                              <img
                                className="hover-image"
                                onClick={() => (
                                  handleClickedFarmId(order.shortFarm.id),
                                  handleIsShopClicked(false)
                                )}
                                src={order.shortFarm.image}
                                alt="Hover Image"
                              />
                            </div>
                          </div>
                          <BsArrowRepeat
                            style={{
                              fontSize: "25px",
                              position: "absolute",
                              top: "15px",
                              right: "90px",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "-20px",
                          marginLeft: "20px",
                          color: "black",
                        }}>
                        <h2>
                          {hoveredOrderId === order.id
                            ? order.shortFarm.name
                            : order.product.name}
                        </h2>
                        <div className="shopProductDescriptionContainer">
                          <p>{order.product.description}</p>
                        </div>
                      </div>
                    </div>

                    <Flex
                      direction="column"
                      ml={-100}
                      bg="teal"
                      width={110}
                      borderRadius={5}>
                      {!order.soldOut ? (
                        <>
                          <Text
                            className="tooltip"
                            fontSize={12}
                            fontWeight={"bold"}
                            ml={25}
                            mb={-25}
                            mt={5}>
                            {formatDate(order.product.dateUpdated)}
                            <span className="tooltiptext">
                              Дата на производство
                            </span>
                          </Text>
                          <Text fontWeight="bold" color="white" mt={80} ml={6}>
                            Цена за{" "}
                            {order.product.unitOfMeasurement === 3
                              ? "бр."
                              : order.product.unitOfMeasurement === 2
                              ? "кг."
                              : "лт."}
                          </Text>
                          <label
                            className="productPrice"
                            style={{
                              border:
                                order.shopPrice === null &&
                                !order.soldOut &&
                                isShopOwned
                                  ? "3px solid red"
                                  : "none",
                            }}>
                            {order.shopPrice} лв.
                          </label>
                        </>
                      ) : (
                        <Image padding={5} mt={20} src={soldOut} />
                      )}
                    </Flex>

                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                      }}>
                      <div>
                        {accountType === 1 && !inLoginSelection && (
                          <PiShoppingCartSimpleDuotone
                            className="shopCartButton"
                            onClick={() => handleClickedCart(order.productId, order.shopId)}
                          />
                        )}
                        {accountType === 2 &&
                          !inLoginSelection &&
                          loginId === shopData.id &&
                          isShopOwned && (
                            <FcSettings
                              className="shopProductsettingsButton"
                              onClick={() => handleProductEditClick(order)}
                            />
                          )}
                      </div>
                      <div className="shopProductRatingContainer">
                        {order.product.rating === null
                          ? "new"
                          : order.product.rating}{" "}
                        / 5.0
                      </div>
                    </div>
                  </div>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {isEditProductModalOpen && selectedOrder && (
        <EditShopProduct
          order={selectedOrder}
          isOpen={isEditProductModalOpen}
          onClose={() => setIsEditProductModalOpen(false)}
          onOrderUpdate={(order) => handleProductUpdate(order)}
        />
      )}

      {isEditModalOpen && shopData && (
        <EditShop
          onShopUpdate={(shop) => handleShopUpdate(shop)}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          shop={mapToShop(shopData)}
          onDelete={(shopId) => forwardShopDelete(shopId)}
        />
      )}
    </div>
  );
};

export default ShopForm;
