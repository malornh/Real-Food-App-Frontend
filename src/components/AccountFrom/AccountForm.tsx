import React, { useEffect, useState } from "react";
import "./AccountForm.css";
import UserForm from "../LoginRegisterForm/LoginRegisterForm";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";
import { HiMiniPlusCircle } from "react-icons/hi2";
import ShopForm from "../ShopForm/ShopForm";
import axios from "axios";
import { Shop } from "../ShopForm/EditShop/EditShop";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react"; // Ensure you import Box from Chakra UI
import Create from "../Create";
import { Farm } from "../FarmForm/EditFarm";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { TbCircleLetterS } from "react-icons/tb";
import { TbCircleLetterF } from "react-icons/tb";
import LoginRegisterForm from "../LoginRegisterForm/LoginRegisterForm";
import { useContextProvider } from "../../ContextProvider.tsx";
import { completePhotoUrl } from "../Images/CompletePhotoUrl.ts";

export interface Card {
  imgUrl: string;
  name: string;
  id: number;
  rating: number;
}

interface ShortShops {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface Props {
  markerClicked: boolean;
  updatedFarm: Farm | undefined;
  deletedFarmId: number | undefined;
  resetShopId: (n: number | undefined) => void;
  forwardShopUpdate: (shop: Shop) => void;
  forwardShopDelete: (shopId: number) => void;
  forwardClickedFarmId: (farmId: number) => void;
  forwardFarmUpdate: (farm: Farm) => void;
  handleIsShopClicked: (b: boolean) => void; //False means a farm is clicked.
  handleLoggedAs: (
    id: number | undefined,
    inLoginSelection: boolean
  ) => void;
  isFarmFormOpen: (b: boolean) => void;
  DeliveryFormClosed: () => void;
  handleClickedCart: (productId: number, shopId: number)=>void;
}

const AccountForm = ({
  markerClicked,
  updatedFarm,
  deletedFarmId,
  resetShopId,
  forwardShopUpdate,
  forwardShopDelete,
  forwardClickedFarmId,
  forwardFarmUpdate,
  handleIsShopClicked,
  handleLoggedAs,
  isFarmFormOpen,
  DeliveryFormClosed,
  handleClickedCart,
}: Props) => {
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>();
  const [selectedFarmId, setSelectedFarmId] = useState<number | undefined>();
  const [firstStart, setFirstStart] = useState(true);
  const [userShops, setUserShops] = useState<Shop[]>();
  const [userFarms, setUserFarms] = useState<Farm[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loginImage, setLoginImage] = useState("");
  const { 
          token, 
          userId, 
          accountType, 
          setAccountType, 
          setClickedFarmId, 
          clickedShopId, 
          setClickedShopId, 
          setIsShopClicked, 
          setIsFarmFormOpen,
          isShopFormOpen,
          setIsShopFormOpen,
          isAccountFormOpen,
          setIsAccountFormOpen,
          inLoginSelection,
          setInLoginSelection,
          loginId,
          setLoginId,
         } = useContextProvider();

  useEffect(() => {
    handleLoggedAs(loginId, inLoginSelection);
  }, [loginId, inLoginSelection]);

  useEffect(() => {
    if (updatedFarm) {
      setUserFarms((prevFarms) => {
        // Ensure prevFarms is always an array
        const farms = prevFarms || [];
        const existingFarmIndex = farms.findIndex(
          (farm) => farm.id === updatedFarm.id
        );

        if (existingFarmIndex !== -1) {
          // Update existing farm
          const updatedFarms = [...farms];
          updatedFarms[existingFarmIndex] = updatedFarm;
          return updatedFarms;
        } else {
          return [...farms, updatedFarm];
        }
      });
    }
  }, [updatedFarm]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7218/api/Shops/UserShops/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log(response.data);
        setUserShops(response.data);
      } catch (error: any) {
        console.error("Error fetching shops:", error.message);
      }
    };
    fetchShops();
  }, [token]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7218/api/Farms/UserFarms/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUserFarms(response.data);
      } catch (error: any) {
        console.error("Error fetching shops:", error.message);
      }
    };

    fetchFarms();
  }, [token, deletedFarmId]);

  useEffect(() => {
    if (clickedShopId !== undefined) {
      setSelectedShopId(clickedShopId);
    }

    if (firstStart) {
      setIsShopFormOpen(false);
      setFirstStart(false);
    } else {
      setIsShopFormOpen(true);
    }
  }, [clickedShopId, markerClicked]);

  useEffect(() => {
    if (clickedShopId === undefined) {
      setIsShopFormOpen(false);
    }
  }, [clickedShopId]);

  const toggleShopForm = () => {
    setIsAccountFormOpen(!isAccountFormOpen);

    if (loginId && accountType === 2) {
      handleShopClick(loginId);
      isFarmFormOpen(true);
    }
    if (loginId && accountType === 3) {
      handleFarmClick(loginId);
      isFarmFormOpen(true);
    }
  };

  const handleShopClick = (id: number | undefined) => {
    setClickedFarmId(undefined);
    setClickedShopId(id);
    setIsShopClicked(true);
  }

  const handleFarmClick = (id: number | undefined) => {
    setClickedFarmId(id);
    setClickedShopId(undefined);
    setIsShopClicked(false);
    setIsFarmFormOpen(true);
  }

  const closeForm = () => {
    setIsAccountFormOpen(false);
    handleIsShopClicked(false);
    setInLoginSelection(false);
  };

  const toggleAccount = () => {
    if (inLoginSelection) {
      setSelectedShopId(undefined);
      handleIsShopClicked(false);
      setAccountType(1);
      setInLoginSelection(false);
      setLoginImage("");
    } else {
      if (accountType === 1) {
        setIsAccountFormOpen(true);
        setClickedShopId(undefined);
      }
      if (accountType === 2 && loginId !== undefined) {
        setSelectedShopId(loginId);
        handleShopClick(loginId);
      }
      if (accountType === 3 && loginId !== undefined) {
        setSelectedFarmId(loginId);
        handleFarmClick(loginId);
        isFarmFormOpen(true);
      }
    }
  };

  const handleCardClick = (id: number, image: string) => {
    setLoginId(id);
    setLoginImage(image);
    DeliveryFormClosed();

    if (accountType === 2) {
      setSelectedShopId(id);
      handleShopClick(id);
      handleIsShopClicked(true);
      setInLoginSelection(false);
    }
    if (accountType === 3) {
      setSelectedFarmId(id);
      handleFarmClick(id);
      handleIsShopClicked(false);
      setInLoginSelection(false);
      isFarmFormOpen(true);
    }
  };

  const isOwnedByUser = (
    shopIds: (number | undefined)[] | undefined,
    id: number
  ) => {
    return shopIds?.includes(id);
  };

  const handleAddNewCard = () => {
    onOpen();
  };

  function handleShopUpdate(shop: Shop): void {
    forwardShopUpdate(shop);
    setUserShops((currentShops) => {
      // Map through existing shops and replace the one with the same ID
      return currentShops?.map((currentShop) => {
        if (currentShop.id === shop.id) {
          // If the IDs match, replace the existing shop with the new one
          return shop;
        } else {
          // Otherwise, return the shop as it was
          return currentShop;
        }
      });
    });
  }

  const userShopIds = userShops
    ?.map((s) => s.id)
    .filter((id): id is number => id !== undefined);

  function handleCreateShop(shop: Shop): void {
    forwardShopUpdate(shop);

    setUserShops((prevUserShops) => [...(prevUserShops ?? []), shop]);
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {loginImage === "" || inLoginSelection ? (
        <RiAccountCircleFill
          className="buttonStyle"
          style={{ right: isAccountFormOpen ? "calc(40%)" : "25px" }}
          onClick={isAccountFormOpen ? toggleAccount : toggleShopForm}
        />
      ) : (
        <img
          src={loginImage}
          className="buttonStyle"
          style={{
            right: isAccountFormOpen ? "calc(40%)" : "25px",
            borderRadius: "50%",
          }}
          onClick={isAccountFormOpen ? toggleAccount : toggleShopForm}
        />
      )}

      {isAccountFormOpen && (
        <div className="formContainerStyle">
          <Flex>
            {(
              <Flex flexDirection="column" mt={10} ml={80}>
                <TbCircleLetterS
                  className={`miniCircleIcon ${
                    accountType === 2 && inLoginSelection ? "tealBorder" : ""
                  }`}
                  onClick={() => inLoginSelection && setAccountType(2)}
                />
                <TbCircleLetterF
                  className={`miniCircleIcon ${
                    accountType === 3 && inLoginSelection ? "tealBorder" : ""
                  }`}
                  onClick={() => inLoginSelection && setAccountType(3)}
                />
              </Flex>
            )}
            <div className="cardsContainerStyle">
              {(userShops || userFarms) && !inLoginSelection && token != null &&(
                <Button
                  background={"rgba(254, 216, 65, 0.8)"}
                  color={"black"}
                  width={260}
                  height={60}
                  mt={20}
                  ml={80}
                  mb={49}
                  onClick={() => (
                    setInLoginSelection(true), setAccountType(2)
                  )}>
                  Login as:
                </Button>
              )}
              {userShops &&
                accountType === 2 &&
                inLoginSelection &&
                userShops.map((shop: Shop) => (
                  <div
                    key={shop.id}
                    className="cardStyle"
                    onClick={() =>
                      shop.id !== undefined &&
                      handleCardClick(shop.id, completePhotoUrl(shop.photoId))
                    }>
                    <img
                      src={completePhotoUrl(shop.photoId)}
                      alt={shop.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50px",
                      }}
                      className={
                        shop.id === selectedShopId
                          ? "selectedCardBorder"
                          : "nonSelectedCardBorder"
                      }
                    />
                    <div>
                      {shop.name.length > 14
                        ? shop.name.substring(0, 10) + "..."
                        : shop.name}
                    </div>
                  </div>
                ))}

              {userFarms &&
                accountType === 3 &&
                inLoginSelection &&
                userFarms.map((farm: Farm) => (
                  <div
                    key={farm.id}
                    className="cardStyle"
                    onClick={() =>
                      farm.id !== undefined &&
                      handleCardClick(farm.id, completePhotoUrl(farm.photoId))
                    }>
                    <img
                      src={completePhotoUrl(farm.photoId)}
                      alt={farm.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50px",
                      }}
                      className={
                        farm.id === selectedFarmId
                          ? "selectedCardBorder"
                          : "nonSelectedCardBorder"
                      }
                    />
                    <div>
                      {farm.name.length > 14
                        ? farm.name.substring(0, 10) + "..."
                        : farm.name}
                    </div>
                  </div>
                ))}
            </div>
            <Flex flexDirection="column" ml={-45} mt={10}>
              <HiMiniPlusCircle
                onClick={handleAddNewCard}
                className="plusIcon"
              />
              <IoMdArrowDropdownCircle className="miniCircleIcon" onClick={()=>console.log(token)} />
            </Flex>
          </Flex>
          <IoMdCloseCircle className="closeButtonStyle" onClick={closeForm} />
          <div className="scrollableContent">
            {clickedShopId !== undefined ? (
              <ShopForm
                forwardShopUpdate={(shop) => handleShopUpdate(shop)}
                isShopOwned={isOwnedByUser(userShopIds, clickedShopId)}
                forwardShopDelete={(shopId) => {
                  setUserShops((prevUserShops) =>
                    (prevUserShops ?? []).filter((shop) => shop.id !== shopId)
                  );
                  forwardShopDelete(shopId);
                }}
                handleClickedFarmId={(farmId) => forwardClickedFarmId(farmId)}
                handleIsShopClicked={(b) => handleIsShopClicked(b)}
                loginId={loginId}
                inLoginSelection={inLoginSelection}
                handleClickedCart={(productId, shopId)=>handleClickedCart(productId, shopId)}
              />
            ) : (
                <LoginRegisterForm />
            )}
          </div>
        </div>
      )}
      {isOpen && (
        <Create
          isOpen={isOpen}
          onClose={onClose}
          userId={userId}
          handleNewShop={(shop) => handleCreateShop(shop)}
          handleNewFarm={(farm) => forwardFarmUpdate(farm)}
        />
      )}
    </div>
  );
};

export default AccountForm;
