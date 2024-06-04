import { useEffect, useState } from 'react';
import { Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box} from '@chakra-ui/react'
import { TbTruckDelivery } from "react-icons/tb";
import { IoCashOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { PiPackageDuotone } from "react-icons/pi";
import { BsArrowRepeat } from "react-icons/bs";
import './FarmForm.css';
import axios from 'axios';

interface FarmData {
  id: number;
  userId: string;
  name: string;
  image: string;
  description?: string;
  latitude: number;
  longitude: number;
  defaultDeliveryRadius: number;
  rating: number;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  farmId: number;
  unitOfMeasurement: string;
  quantity: number;
  pricePerUnit: number;
  deliveryRadius: number;
  minUnitOrder: number;
  dateUpdated: Date;
  image: string;
  type: string;
}

interface Props {
  farmId: number
}

const FarmForm = ({ farmId }: Props) => {
  const [farmData, setFarmData] = useState<FarmData>();
  const [selectedType, setSelectedType] = useState<string>();

  const productTypes = Array.from(new Set(farmData?.products.map(p => p.type))).sort();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<FarmData>(
          `https://localhost:7218/api/Farms/${farmId}/FarmWithProducts`
        );
        setFarmData(response.data);
      } catch (error) {
        console.error('Error fetching farm data:', error);
      }
    };
  
    fetchData();
  }, [farmId]);
  
  return (
    <div>
      {farmData && (
        <div className="farmCategoriesContainer">
          <img src={farmData.image} className="farmImage" />
          <div className="farmInfoContainer">
            <h1 className="farmTitle">{farmData.name}</h1>
            <p className="farmDescription">{farmData.description}</p>
            <div className="farmRatingContainer">{farmData.rating} / 5.0</div>
          </div>
        </div>
      )}
      <Tabs>
        <TabList className="farmProductTabMenu">
          {productTypes.map((type) => (
            <Tab
              className="farmTab"
              key={type as string}
              onClick={() => setSelectedType(type as string)}>
              {type as string}
            </Tab>
          ))}
        </TabList>

        {farmData?.products.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              background: "rgba(254, 216, 65, 0.8)",
              borderRadius: "5px",
              color: 'grey',
              height: 150
            }}>
            <Text fontSize={25} alignContent={'center'} ml={230}>Not available products!</Text>
          </div>
        )}

        <TabPanels>
          {productTypes.map((type) => (
            <TabPanel className="farmTabPanel" key={type as string}>
              {farmData?.products
                .filter((p) => p.type === type)
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      background: "rgba(254, 216, 65, 0.8)",
                      borderRadius: "5px",
                    }}>
                    <div
                      style={{ display: "flex", justifyContent: "flex-start" }}>
                      <Box boxSize={130}>
                        <img
                          className="original-image"
                          src={p.image}
                          alt="Original Image"
                        />
                      </Box>
                      <div
                        style={{
                          marginTop: "-20px",
                          marginLeft: "20px",
                          color: "black",
                        }}>
                        <h2>{p.name}</h2>
                        <div className="farmProductDescriptionContainer">
                          <p>{p.description}</p>
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
                            defaultValue={p.deliveryRadius}
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
                            defaultValue={p.minUnitOrder}
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
                            defaultValue={p.pricePerUnit}
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