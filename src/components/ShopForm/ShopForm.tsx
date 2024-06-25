import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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
import { IoCashOutline } from "react-icons/io5";

interface ShopData {
  id: number;
  image: string;
  userId: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  orders: Order[];
}

interface Order {
  id: number;
  quantity: number;
  shopPrice: number;
  product: ProductDetails;
  shortFarm: Farm;
  dateOrdered: string;
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
}

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
}) => {
  const [shopData, setShopData] = useState<ShopData | undefined>(undefined);
  const [hoveredOrderId, setHoveredOrderId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const typeList = Array.from(
    new Set(shopData?.orders.map((o) => o.product.type))
  ).sort();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        if (shopId !== undefined) {
          const response = await axios.get<ShopData>(
            `https://localhost:7218/api/Shops/${shopId}/OrdersWithFarms`
          );
          setShopData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchShopData();
  }, [shopId]);

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
    image: shop.image,
    name: shop.name,
    description: shop.description,
    latitude: shop.latitude,
    longitude: shop.longitude,
    rating: shop.rating,
  });

  function handleShopUpdate(shop: Shop): void {
    forwardShopUpdate(shop); // Forwarding the updated shop data
    setShopData((currentShopData) => {
      if (!currentShopData) return currentShopData; // Check for null or undefined
      return {
        ...currentShopData, // Spread all existing properties
        // Only overwrite properties that are present in the updated shop data
        name: shop.name,
        description: shop.description,
        image: shop.image,
        latitude: shop.latitude,
        longitude: shop.longitude,
      };
    });
  }

  return (
    <div>
      {shopData && (
        <div className="shopCardContainer">
          <img src={shopData.image} className="shopImage" />
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
                .map((order) => (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      background: "rgba(254, 216, 65, 0.8)",
                      borderRadius: "5px",
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

                    <Flex direction={"column"} marginLeft={-100} background={'teal'} width={110} borderRadius={5}>
                      <Text fontWeight={'bold'} color={'white'} marginTop={80} marginLeft={6}>Цена за{' '}
                        {order.product.unitOfMeasurement === 3
                            ? "бр."
                            : order.product.unitOfMeasurement === 2
                            ? "кг."
                            : "лт."}</Text>
                      <label className="productPrice">
                      {order.product.pricePerUnit} {'лв.'}
                      </label>
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
                            onClick={() => null}
                          />
                        )}
                        {accountType === 2 &&
                          !inLoginSelection &&
                          loginId === shopData.id &&
                          isShopOwned && (
                            <FcSettings
                              className="shopProductsettingsButton"
                              onClick={() => null}
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
