import { useEffect, useState } from 'react';
import { Card } from '../AccountFrom/AccountForm';
import './FarmForm.css'
import { Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import { TbTruckDelivery } from "react-icons/tb";
import { IoCashOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { PiPackageDuotone } from "react-icons/pi";
import { BsArrowRepeat } from "react-icons/bs";
import axios from 'axios';

interface Product {
  Id: number;
  Name: string;
  Description: string;
  FarmId: number;
  UnitOfMeasurement: string;
  Quantity: number;
  PricePerUnit: number;
  DeliveryRadius: number;
  MinUnitOrder: number;
  DateUpdated: Date;
  Image: string;
  Type: string;
}

interface Farm {
  id: number;
  userId: string;
  name: string;
  image: string;
  description?: string;
  latitude: number;
  longitude: number;
  defaultDeliveryRadius: number;
}

interface Props {
  data: Card,
  products: Product[]
}

const FarmForm = ({ data, products }: Props) => {

  const unique = (arr: any) => [...new Set(arr)];

  const typeList = unique(products.map(p => p.Type));

  const [selectedType, setSelectedType] = useState('');

  const [selectedFarmId, setSelectedFarmId] = useState<number | undefined>(undefined);

  const [farms, setFarms] = useState<Farm[]>([]);

  const [hoveredProductId, setHoveredProductId] = useState<number>();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = `?farmIds=${products.map(p => p.FarmId).join(',')}`;
        const response = await axios.get(`https://localhost:7218/api/Farms/ByIds${queryString}`);
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };
    fetchData();
    return () => {
      // Cleanup function if necessary
    };
  }, [products]); // Add products to dependency array if needed


  function flipImage(farmId: number | undefined, productId: number) {
    var cardInner = document.querySelector(".flip-card-inner") as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = "rotateY(180deg)";
    }
    setSelectedFarmId(farmId);
    setHoveredProductId(productId);
  }
  
  function unflipImage() {
    var cardInner = document.querySelector(".flip-card-inner") as HTMLElement;  
    if (cardInner) {
      cardInner.style.transform = "rotateY(0deg)";
    }
    setSelectedFarmId(undefined);
    setHoveredProductId(undefined);
  }
  
  return (
    <div>
      {data && (
        <div className="farmCardContainer">
          <img src={data.imgUrl} className="farmImage" />
          <div className="farmInfoContainer">
            <h1 className="farmTitle">{data.name}</h1>
            <p className="farmDescription">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              nisi atque velit minus ipsum ratione, enim magnam, sed voluptas
              similique voluptates laboriosam est cupiditate, commodi accusamus
              ducimus distinctio dolorum consequuntur!
            </p>
            <div className="farmRatingContainer">{data.rating} / 5.0</div>
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
              {products
                .filter((p) => p.Type === type)
                .map((p) => (
                  <div
                    key={p.Id}
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
                        onMouseOver={() => flipImage(farms.find(f=> f.id == p.FarmId)?.id, p.Id)}
                        onMouseOut={unflipImage}>
                        <div className="flip-card">
                          <div className="flip-card-inner">
                            <div className="flip-card-front">
                              <img
                                className="original-image"
                                src={p.Image}
                                alt="Original Image"
                              />
                            </div>
                            <div className="flip-card-back">
                              <img
                              className='hover-image'
                                src={`data:image/webp;base64,${farms.find(f=> f.id == p.FarmId)?.image}`}
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
                        <h2>{selectedFarmId == p.FarmId && hoveredProductId == p.Id ? farms.find(f=> f.id == selectedFarmId)?.name : p.Name}</h2>
                        <div className="descriptionContainer">
                          <p>{p.Description}</p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "30px",
                          marginLeft: "10px",
                        }}>
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "10px",
                            marginBottom: "-25px",
                          }}>
                          <TbTruckDelivery
                            style={{
                              fontSize: "27px",
                              color: "black",
                              marginRight: "10px",
                              marginLeft: "3px",
                            }}
                          />
                          <input
                            className="labelContent"
                            defaultValue={p.DeliveryRadius}
                            readOnly></input>
                          <p
                            style={{
                              marginTop: "-0px",
                              marginLeft: "5px",
                              color: "black",
                              fontWeight: "bold",
                            }}>
                            км.
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "10px",
                            marginTop: "15px",
                            marginBottom: "-25px",
                          }}></div>
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "10px",
                            marginTop: "30px",
                            marginBottom: "-20px",
                          }}>
                          <PiPackageDuotone
                            style={{
                              fontSize: "30px",
                              color: "black",
                              marginRight: "10px",
                            }}
                          />
                          <input
                            className="labelContent"
                            defaultValue={p.MinUnitOrder}
                            readOnly></input>
                          <p
                            style={{
                              marginTop: "-0px",
                              marginLeft: "5px",
                              color: "black",
                              fontWeight: "bold",
                            }}>
                            бр.
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "10px",
                            marginTop: "15px",
                            marginBottom: "-25px",
                          }}>
                          <IoCashOutline
                            style={{
                              fontSize: "30px",
                              color: "black",
                              marginRight: "10px",
                            }}
                          />
                          <input
                            className="labelContent"
                            defaultValue={p.PricePerUnit}
                            readOnly></input>
                          <p
                            style={{
                              marginTop: "-0px",
                              marginLeft: "5px",
                              color: "black",
                              fontWeight: "bold",
                            }}>
                            лв/бр.
                          </p>
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

export default FarmForm;
