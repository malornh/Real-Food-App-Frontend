import { MouseEvent, useEffect, useState } from 'react';
import { Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Tooltip} from '@chakra-ui/react'
import { TbTruckDelivery } from "react-icons/tb";
import { IoCashOutline } from "react-icons/io5";
import { PiPackageDuotone, PiShoppingCartSimpleDuotone } from "react-icons/pi";
import './FarmForm.css';
import axios from 'axios';
import EditFarm, { Farm } from './EditFarm';
import { FcSettings } from 'react-icons/fc';
import { HiMiniPlusCircle } from 'react-icons/hi2';
import EditProduct from './EditProduct';
import  defaultProduct from '../../assets/defaultProduct.png'

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

interface DateOnly {
  year: number;
  month: number;
  day: number;
}

export interface Product {
  id: number | undefined;
  name: string;
  description: string;
  farmId: number;
  unitOfMeasurement: number;
  quantity: number;
  pricePerUnit: number;
  deliveryRadius: number;
  minUnitOrder: number;
  dateUpdated: string;
  image: string;
  type: string;
}

interface Props {
  farmId: number;
  userId: string;
  forwardFarmUpdate: (farm: Farm)=>void;
}

const FarmForm = ({ farmId, userId, forwardFarmUpdate }: Props) => {
  const [farmData, setFarmData] = useState<FarmData>();
  const [selectedType, setSelectedType] = useState<string>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const productTypes = Array.from(new Set(farmData?.products.map(p => p.type))).sort();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<FarmData>(
          `https://localhost:7218/api/Farms/${farmId}/FarmWithProducts`
        );
        setFarmData(response.data);
        console.log('Fresh:');
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching farm data:', error);
      }
    };
  
    fetchData();
  }, [farmId]);

  function mapToFarm(farmData: FarmData): Farm {
    const { id, userId, image, name, description, latitude, longitude, defaultDeliveryRadius, rating } = farmData;
    return {
      id: id,
      userId: userId,
      image: image,
      name: name,
      description: description || '', // Using empty string as default for optional field
      latitude: latitude,
      longitude: longitude,
      defaultDeliveryRadius: defaultDeliveryRadius !== undefined ? defaultDeliveryRadius : undefined, // Handling undefined value
      rating: rating !== undefined ? rating : undefined // Handling undefined value
    };
  }

  function newProduct(farmId: number): Product {
    const defaultProductImage = "defaultProductImage.jpg"; // Example default image
    const currentDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  
    return {
      id: undefined,
      name: "",
      description: "",
      farmId: farmId,
      unitOfMeasurement: 1,
      quantity: 0,
      pricePerUnit: 0,
      deliveryRadius: 0,
      minUnitOrder: 0,
      dateUpdated: currentDate, // Assigning today's date
      image: defaultProduct,
      type: "Type"
    };
  }
  
  const handleOpenEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleCloseEditProduct = () => {
    setIsEditProductOpen(false);
    setSelectedProduct(undefined);
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    console.log('Product updated:', updatedProduct);
  };

  const handleProductDelete = (productId: number) => {
    console.log('Product deleted with ID:', productId);
    // Delete the product from your state or database as needed
  };

  return (
    <div>
      {farmData && (
        <div className="farmCategoriesContainer">
          <img src={farmData.image} className="farmImage" />
          <div className="farmInfoContainer">
            <div style={{ display: "flex", width: "330px", marginLeft: "5px" }}>
              <h1 className="farmTitle">{farmData.name}</h1>
              {farmData.userId === userId && (
                <FcSettings
                  className="farmFormSettingsBtn"
                  onClick={() => setIsEditModalOpen(true)}
                />
              )}
            </div>
            <p className="farmDescription">{farmData.description}</p>
            <div className="farmRatingContainer">
              {farmData.rating === 0 ? "new" : farmData.rating} / 5.0
            </div>
          </div>
        </div>
      )}

      <Tabs>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          {farmData?.userId === userId && (
            <HiMiniPlusCircle onClick={()=>handleOpenEditProduct(newProduct(farmData.id))} className="farmProductPlusButton" />
          )}
        </div>

        {farmData?.products.length === 0 && (
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
                          marginTop: "15px",
                          marginLeft: "80px",
                          gap: "15px",
                        }}>
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "10px",
                            marginBottom: "-40px",
                          }}>
                          <div className="tooltip">
                            <TbTruckDelivery
                              style={{
                                fontSize: "27px",
                                color: "black",
                                marginRight: "10px",
                                marginLeft: "3px",
                              }}
                            />
                            <span className="tooltiptext">
                              Максимален радиус за доставка
                            </span>
                          </div>
                          <label className="labelContent">
                            {p.deliveryRadius}
                          </label>
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
                          <div className="tooltip">
                            <PiPackageDuotone
                              style={{
                                fontSize: "30px",
                                color: "black",
                                marginRight: "10px",
                              }}
                            />
                            <span className="tooltiptext">
                              Минимално количество за поръчка
                            </span>
                          </div>
                          <label className="labelContent">
                            {p.minUnitOrder}
                          </label>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "10px",
                            marginTop: "15px",
                            marginBottom: "-25px",
                          }}>
                          <div className="tooltip">
                            <IoCashOutline
                              style={{
                                fontSize: "30px",
                                color: "black",
                                marginRight: "10px",
                              }}
                            />
                            <span className="tooltiptext">Цена за брой</span>
                          </div>
                          <label className="labelContent">
                            {p.pricePerUnit}
                          </label>
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
                      <div>
                        {farmData.userId !== userId ? (
                          <PiShoppingCartSimpleDuotone className="shopCartButton" />
                        ) : (
                          <FcSettings
                            className="shopProductsettingsButton"
                            onClick={() => handleOpenEditProduct(p)}
                          />
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
      {isEditModalOpen && farmData && (
        <EditFarm
          onFarmUpdate={(farm) => {
            setFarmData((prevData) => {
              if (!prevData) {
                // Handle the case where prevData might be undefined
                // You might want to initialize it with default values or return null/undefined based on your app logic
                return undefined; // Or return a full new FarmData object with required and default fields
              }
              return {
                ...prevData, // Carry over all existing data
                name: farm.name, // Update the name
                image: farm.image, // Update the image
                // Make sure all required fields exist here or are carried over from prevData
              };
            });
            forwardFarmUpdate(farm);
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          farm={mapToFarm(farmData)}
          onDelete={() => null}
        />
      )}
      
      {selectedProduct && (
        <EditProduct
          isOpen={isEditProductOpen}
          onClose={handleCloseEditProduct}
          product={selectedProduct}
          onProductUpdate={(p)=>handleProductUpdate(p)}
          onDelete={handleProductDelete}
        />
      )}
    </div>
  );
}

export default FarmForm;