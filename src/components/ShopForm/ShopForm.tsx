import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { TiShoppingCart } from 'react-icons/ti';
import { BsArrowRepeat } from 'react-icons/bs';
import { IoSettingsSharp } from 'react-icons/io5';
import './ShopForm.css'

// Define interfaces
interface Shop {
  id: number;
  image: string;
  userId: string;
  name: string;
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

interface Props{
    shopId: number | undefined
}

function ShopForm({ shopId }: Props) {
  const [shopData, setShopData] = useState<Shop | undefined>(undefined);
  const [selectedType, setSelectedType] = useState('');
  const [hoveredOrderId, setHoveredOrderId] = useState<number | null>(null);

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

  function flipImage(orderId: number) {
    setHoveredOrderId(orderId);
    const cardInner = document.querySelector(`#flip-card-inner-${orderId}`) as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = "rotateY(180deg)";
    }
  }
  
  function unflipImage(orderId: number) {
    setHoveredOrderId(null);
    const cardInner = document.querySelector(`#flip-card-inner-${orderId}`) as HTMLElement;  
    if (cardInner) {
      cardInner.style.transform = "rotateY(0deg)";
    }
  }
  
  return (
    <div>
      {shopData && (
        <div className="farmCardContainer">
          <img src={shopData.image} className="farmImage" />
          <div className="farmInfoContainer">
            <h1 className="farmTitle">{shopData.name}</h1>
            <p className="farmDescription">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              nisi atque velit minus ipsum ratione, enim magnam, sed voluptas
              similique voluptates laboriosam est cupiditate, commodi accusamus
              ducimus distinctio dolorum consequuntur!
            </p>
            <div className="farmRatingContainer">{shopData.rating} / 5.0</div>
          </div>
        </div>
      )}
      <Tabs>
        <TabList className="foodTabMenu">
          {typeList.map((type) => (
            <Tab
              className="tab"
              key={type as string}
              onClick={() => setSelectedType(type as string)}>
              {type as string}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {typeList.map((type) => (
            <TabPanel className="tabPanel" key={type as string}>
              {shopData?.orders
                .filter((o) => o.product.type === type)
                .map(order => (
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
                          {hoveredOrderId == order.id ? order.shortFarm.name : order.product.name}
                        </h2>
                        <div className="descriptionContainer">
                          <p>{order.product.description}</p>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                      }}>
                      <div
                        style={{
                          borderRadius: "5px",
                          border: "2px solid black",
                          height: "40px",
                          width: "60px",
                          marginBottom: "5px",
                        }}>
                        <IoSettingsSharp
                          style={{
                            fontSize: "35px",
                            color: "gray",
                            marginTop: "1px",
                            marginRight: "11px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          background: "rgba(126, 222, 252)",
                          borderRadius: "5px",
                          border: "2px solid black",
                          marginBottom: "5px",
                        }}>
                        <TiShoppingCart
                          style={{
                            fontSize: "35px",
                            color: "black",
                            borderRadius: "5px",
                            marginRight: "12px",
                            marginBottom: "-5px",
                          }}
                        />
                      </div>
                      <div className="productRatingContainer">{4.5} / 5.0</div>
                    </div>
                  </div>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default ShopForm;
