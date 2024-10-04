import { useEffect, useState } from "react";
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import { TbTruckDelivery } from "react-icons/tb";
import { IoCashOutline } from "react-icons/io5";
import { PiPackageDuotone } from "react-icons/pi";
import "./FarmForm.css";
import axios from "axios";
import EditFarm, { Farm } from "./EditFarm";
import { FcSettings } from "react-icons/fc";
import { HiMiniPlusCircle } from "react-icons/hi2";
import EditProduct from "./EditProduct";
import defaultProduct from "../../assets/defaultProduct.png";
import CreateOrder, { Order } from "./CreateOrder";
import { completePhotoUrl } from "../Images/CompletePhotoUrl.ts";
import { useContextProvider } from "../../ContextProvider.tsx";
import { OrderItem } from "../OrderList/OrderList.tsx";

interface FarmData {
  id: number;
  userId: string | null;
  name: string;
  photoFile?: File | null;  // Changed this to be File type
  photoId: string | undefined;
  description?: string;
  latitude: number;
  longitude: number;
  defaultDeliveryRadius: number;
  rating: number | undefined;
  products: Product[];
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
  photoFile?: File | null;
  photoId: string | undefined;
  type: string;
  rating: number | null;
}

interface Props {
  forwardFarmUpdate: (farm: Farm) => void;
  handleFarmDelete: (farmId: number) => void;
  loginId: number | undefined;
  inLoginSelection: boolean;
}

const FarmForm = ({
  forwardFarmUpdate,
  handleFarmDelete,
  loginId,
  inLoginSelection,
}: Props) => {
  const [farmData, setFarmData] = useState<FarmData>();
  const [_, setSelectedType] = useState<string>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [productTypes, setProductTypes] = useState(
    Array.from(new Set(farmData?.products.map((p) => p.type))).sort()
  );
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrderProduct, setSelectedOrderProduct] =
    useState<Product | null>(null);
  const { userId, accountType, clickedFarmId } = useContextProvider();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<FarmData>(
          `https://localhost:7218/api/Farms/${clickedFarmId}/FarmWithProducts`
        );
        setFarmData(response.data);
        setProductTypes(
          Array.from(new Set(farmData?.products.map((p) => p.type))).sort()
        );
      } catch (error) {
        console.error("Error fetching farm data:", error);
      }
    };

    fetchData();
  }, [clickedFarmId]);

  const handleOpenOrderModal = (product: Product) => {
    setSelectedOrderProduct(product);
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedOrderProduct(null);
  };

  const handleOrderCreate = (order: OrderItem) => {
    console.log("Order created:", order);
    // Handle order creation logic, e.g., updating state or sending data to the server
  };

  function mapToFarm(farmData: FarmData): Farm {
    const {
      id,
      userId,
      photoFile,
      photoId,
      name,
      description,
      latitude,
      longitude,
      defaultDeliveryRadius,
      rating,
    } = farmData;
    return {
      id: id,
      userId: userId,
      photoFile: photoFile,
      photoId: photoId,
      name: name,
      description: description || "", // Using empty string as default for optional field
      latitude: latitude,
      longitude: longitude,
      defaultDeliveryRadius:
        defaultDeliveryRadius !== undefined ? defaultDeliveryRadius : undefined, // Handling undefined value
      rating: rating !== undefined ? rating : undefined, // Handling undefined value
    };
  }

  function newProduct(farmId: number): Product {
    const currentDate = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

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
      dateUpdated: currentDate,
      photoId: undefined,
      type: "",
      rating: null,
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
    if (!productTypes.includes(updatedProduct.type)) {
      const updatedProductTypes = [...productTypes, updatedProduct.type];
      updatedProductTypes.sort();
      setProductTypes(updatedProductTypes);
    }

    if (farmData !== undefined) {
      const updatedFarmData = {
        ...farmData,
        products: [...farmData.products, updatedProduct],
      };

      setFarmData(updatedFarmData);
    }
  };

  const handleProductDelete = (productId: number) => {
    const productIndex = farmData?.products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex !== undefined && productIndex !== -1 && farmData) {
      const updatedProducts = [
        ...farmData.products.slice(0, productIndex),
        ...farmData.products.slice(productIndex + 1),
      ];

      const updatedFarmData = {
        ...farmData,
        products: updatedProducts,
      };

      setFarmData(updatedFarmData);

      const deletedProductType = farmData.products[productIndex].type;
      if (productTypes.includes(deletedProductType)) {
        const updatedProductTypes = productTypes.filter(
          (type) => type !== deletedProductType
        );
        setProductTypes(updatedProductTypes);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      {farmData && (
        <div className="farmCategoriesContainer">
          <img src={completePhotoUrl(farmData.photoId)} className="farmImage" />
          <div className="farmInfoContainer">
            <div style={{ display: "flex", width: "330px", marginLeft: "5px" }}>
              <h1 className="farmTitle">{farmData.name}</h1>
              { farmData.id === loginId &&
                accountType === 3 &&
                !inLoginSelection && (
                  <FcSettings
                    className="farmFormSettingsBtn"
                    onClick={() => setIsEditModalOpen(true)}
                  />
                )}
            </div>
            <p className="farmDescription">{farmData.description}</p>
            <div className="farmRatingContainer">
              {farmData.rating === 0 || farmData.rating === null
                ? "new"
                : farmData.rating}{" "}
              / 5.0
            </div>
          </div>
        </div>
      )}

      <Tabs>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TabList className="farmProductTabMenu">
            {Array.from(new Set(farmData?.products.map((p) => p.type)))
              .sort()
              .map((type) => (
                <Tab
                  className="farmTab"
                  key={type as string}
                  onClick={() => setSelectedType(type as string)}>
                  {type as string}
                </Tab>
              ))}
          </TabList>
          {farmData !== undefined &&
           farmData.id === loginId && (
            <HiMiniPlusCircle
              onClick={() => handleOpenEditProduct(newProduct(farmData.id))}
              className="farmProductPlusButton"
            />
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
          {Array.from(new Set(farmData?.products.map((p) => p.type)))
            .sort()
            .map((type) => (
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
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}>
                        <Box boxSize={130}>
                          <img
                            className="original-image"
                            src={completePhotoUrl(p.photoId)}
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
                            gap: "6px",
                            background: "teal",
                            borderRadius: "5px",
                            padding: "5px",
                            width: "100px",
                          }}>
                          <Text
                            className="tooltip"
                            fontSize={12}
                            fontWeight={"bold"}
                            ml={25}
                            mb={-25}
                            mt={0}>
                            {formatDate(p.dateUpdated)}
                            <span className="tooltiptext">
                              Дата на производство
                            </span>
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              marginBottom: "-10px",
                              marginTop: "30px",
                              marginLeft: "3px",
                            }}>
                            <div className="tooltip">
                              <TbTruckDelivery
                                style={{
                                  fontSize: "27px",
                                  color: "white",
                                  marginRight: "10px",
                                  marginBottom: "-10px",
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
                              marginBottom: "-25px",
                            }}></div>
                          <div
                            style={{
                              display: "flex",
                              marginTop: "30px",
                              marginBottom: "-20px",
                            }}>
                            <div className="tooltip">
                              <PiPackageDuotone
                                style={{
                                  fontSize: "30px",
                                  color: "white",
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
                              marginTop: "15px",
                              marginBottom: "-25px",
                            }}>
                            <div className="tooltip">
                              <IoCashOutline
                                style={{
                                  fontSize: "30px",
                                  color: "white",
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
                          {accountType === 2 && !inLoginSelection && (
                            <img
                              width="65"
                              height="65"
                              className=""
                              src="https://img.icons8.com/plasticine/70/truck--v1.png"
                              alt="truck button"
                              onClick={() => handleOpenOrderModal(p)}
                            />
                          )}
                          {farmData.id === loginId &&
                            accountType === 3 &&
                            !inLoginSelection && (
                              <FcSettings
                                className="shopProductsettingsButton"
                                onClick={() => handleOpenEditProduct(p)}
                              />
                            )}
                        </div>
                        <div className="productRatingContainer">
                          {p.rating === null ? "new" : p.rating} / 5.0
                        </div>
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
                return undefined;
              }
              return {
                ...prevData,
                id: farm.id ?? prevData.id,
                name: farm.name,
                photoFile: farm.photoFile,
                photoId: farm.photoId,
                latitude: farm.latitude,
                longitude: farm.longitude,
              };
            });
            forwardFarmUpdate(farm);
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          farm={mapToFarm(farmData)}
          onDelete={(farmId) => handleFarmDelete(farmId)}
        />
      )}

      {selectedProduct && (
        <EditProduct
          isOpen={isEditProductOpen}
          onClose={handleCloseEditProduct}
          product={selectedProduct}
          onProductUpdate={(p) => handleProductUpdate(p)}
          onDelete={handleProductDelete}
        />
      )}

      {loginId && selectedOrderProduct && (
        <CreateOrder
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrderModal}
          product={selectedOrderProduct}
          shopId={loginId}
          onOrderCreate={(order) => handleOrderCreate(order)}
        />
      )}
    </div>
  );
};

export default FarmForm;
