import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { BsArrowRepeat } from 'react-icons/bs';
import { PiShoppingCartSimpleDuotone } from "react-icons/pi";
import { FcSettings } from "react-icons/fc";
import { HiMiniPlusCircle } from "react-icons/hi2";
import './ShopForm.css';
import EditShop, { ShortShop } from './EditShop/EditShop';

interface Shop {
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
}

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  type: string;
  pricePerUnit: number;
  unitOfMeasurement: number;
  image: string;
}

interface Farm {
  id: number;
  name: string;
  image: string;
}

interface Props {
  shopId: number | undefined;
  isShopOwned: boolean | undefined;
}

const ShopForm: React.FC<Props> = ({ shopId, isShopOwned }) => {
  const [shopData, setShopData] = useState<Shop | undefined>(undefined);
  const [hoveredOrderId, setHoveredOrderId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const typeList = Array.from(new Set(shopData?.orders.map(o => o.product.type)));

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        if (shopId !== undefined) {
          const response = await axios.get<Shop>(`https://localhost:7218/api/Shop/${shopId}/OrdersWithFarms`);
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
    const cardInner = document.querySelector(`#flip-card-inner-${orderId}`) as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = "rotateY(180deg)";
    }
  };

  const unflipImage = (orderId: number) => {
    setHoveredOrderId(null);
    const cardInner = document.querySelector(`#flip-card-inner-${orderId}`) as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = "rotateY(0deg)";
    }
  };

  const mapToShortShop = (shop: Shop): ShortShop => ({
    id: shop.id,
    image: shop.image,
    name: shop.name,
    description: shop.description,
    latitude: shop.latitude,
    longitude: shop.longitude,
  });

  return (
    <div>
      {shopData && (
        <div className="farmCardContainer">
          <img src={shopData.image} className="farmImage" />
          <div className="farmInfoContainer">
            <div style={{ display: "flex", width: "330px", marginLeft: "5px" }}>
              <h1 className="farmTitle">{shopData.name}</h1>
              {isShopOwned && <FcSettings className="FormSettingsBtn" onClick={() => setIsEditModalOpen(true)} />}
            </div>
            <p className="farmDescription">
              {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."}
            </p>
            <div className="farmRatingContainer">{shopData.rating} / 5.0</div>
          </div>
        </div>
      )}

      <Tabs>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TabList className="foodTabMenu">
            {typeList.map((type) => (
              <Tab className="tab" key={type as string}>
                {type as string}
              </Tab>
            ))}
          </TabList>
          {isShopOwned && <HiMiniPlusCircle className="productPlusButton" />}
        </div>

        <TabPanels>
          {typeList.map((type) => (
            <TabPanel className="tabPanel" key={type as string}>
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
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div onMouseOver={() => flipImage(order.id)} onMouseOut={() => unflipImage(order.id)}>
                        <div className="flip-card">
                          <div className="flip-card-inner">
                            <div className="flip-card-front">
                              <img className="original-image" src={order.product.image} alt="Original Image" />
                            </div>
                            <div className="flip-card-back">
                              <img className="hover-image" src={order.shortFarm.image} alt="Hover Image" />
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
                      <div style={{ marginTop: "-20px", marginLeft: "20px", color: "black" }}>
                        <h2>{hoveredOrderId === order.id ? order.shortFarm.name : order.product.name}</h2>
                        <div className="descriptionContainer">
                          <p>{order.product.description}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", padding: "10px" }}>
                      <div>
                        {!isShopOwned ? (
                          <PiShoppingCartSimpleDuotone className="cartButton" />
                        ) : (
                          <FcSettings className="ProductsettingsButton" onClick={() => console.log()} />
                        )}
                      </div>
                      <div className="productRatingContainer">{4.5} / 5.0</div>
                    </div>
                  </div>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      {isEditModalOpen && shopData && (
        <EditShop isOpen={isEditModalOpen} onClose={()=>setIsEditModalOpen(false)} shortShop={mapToShortShop(shopData)} />
      )}
    </div>
  );
};

export default ShopForm;
