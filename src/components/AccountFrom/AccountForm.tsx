import React, { useEffect, useState } from "react";
import "./AccountForm.css";
import UserForm from "../UserForm/UserForm";
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
  userId: string;
  clickedMapShopId?: number | undefined;
  markerClicked: boolean;
  updatedFarm: Farm | undefined;
  deletedFarmId: number | undefined;
  resetShopId: (n: number | undefined) => void;
  handleShopClick: (shopId: number) => void;
  handleFarmClick: (farmId: number) => void;
  forwardShopUpdate: (shop: Shop) => void;
  forwardShopDelete: (shopId: number) => void;
  forwardClickedFarmId: (farmId: number) => void;
  forwardFarmUpdate: (farm: Farm) => void;
  handleIsShopClicked: (b: boolean) => void; //False means a farm is clicked.
  handleLoggedAs: (
    id: number | undefined,
    accountType: number,
    inLoginSelection: boolean
  ) => void;
  isFarmFormOpen: (b: boolean) => void;
  DeliveryFormClosed: () => void;
  handleClickedCart: (productId: number, shopId: number)=>void;
}

const AccountForm = ({
  userId,
  clickedMapShopId,
  markerClicked,
  updatedFarm,
  deletedFarmId,
  resetShopId,
  handleShopClick,
  handleFarmClick,
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
  const [showForm, setShowForm] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>();
  const [selectedFarmId, setSelectedFarmId] = useState<number | undefined>();
  const [firstStart, setFirstStart] = useState(true);
  const [userShops, setUserShops] = useState<Shop[]>();
  const [userFarms, setUserFarms] = useState<Farm[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accountType, setAccountType] = useState(1); //1 - account, 2 - shops, 3 - farms
  const [inLoginSelection, setInLoginSelection] = useState(false);
  const [loginId, setLoginId] = useState<number>();
  const [loginImage, setLoginImage] = useState("");

  useEffect(() => {
    handleLoggedAs(loginId, accountType, inLoginSelection);
  }, [loginId, accountType, inLoginSelection]);

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
          `https://localhost:7218/api/Shops/ByUser/${userId}`
        );
        setUserShops(response.data);
      } catch (error: any) {
        console.error("Error fetching shops:", error.message);
      }
    };

    fetchShops();
  }, [userId]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7218/api/Farms/ByUser/${userId}`
        );
        setUserFarms(response.data);
      } catch (error: any) {
        console.error("Error fetching shops:", error.message);
      }
    };

    fetchFarms();
  }, [userId, deletedFarmId]);

  useEffect(() => {
    if (clickedMapShopId !== undefined) {
      setSelectedShopId(clickedMapShopId);
    }

    if (firstStart) {
      setShowForm(false);
      setFirstStart(false);
    } else {
      setShowForm(true);
    }
  }, [clickedMapShopId, markerClicked]);

  useEffect(() => {
    if (clickedMapShopId === undefined) {
      setShowForm(false);
    }
  }, [clickedMapShopId]);

  const toggleShopForm = () => {
    setShowForm((prevState) => !prevState);
    if (loginId && accountType === 2) {
      handleShopClick(loginId);
      isFarmFormOpen(true);
    }
    if (loginId && accountType === 3) {
      handleFarmClick(loginId);
      isFarmFormOpen(true);
    }
  };

  const closeForm = () => {
    resetShopId(undefined);
    setShowForm((prevState) => !prevState);
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
        setSelectedShopId(undefined);
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
          style={{ right: showForm ? "calc(40%)" : "25px" }}
          onClick={showForm ? toggleAccount : toggleShopForm}
        />
      ) : (
        <img
          src={loginImage}
          className="buttonStyle"
          style={{
            right: showForm ? "calc(40%)" : "25px",
            borderRadius: "50%",
          }}
          onClick={showForm ? toggleAccount : toggleShopForm}
        />
      )}

      {showForm && (
        <div className="formContainerStyle">
          <Flex>
            {(userShops || userFarms) && (
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
              {!inLoginSelection && (
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
                      handleCardClick(shop.id, shop.image)
                    }>
                    <img
                      src={shop.image}
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
                      handleCardClick(farm.id, farm.image)
                    }>
                    <img
                      src={farm.image}
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
              <IoMdArrowDropdownCircle className="miniCircleIcon" />
            </Flex>
          </Flex>
          <IoMdCloseCircle className="closeButtonStyle" onClick={closeForm} />
          <div className="scrollableContent">
            {selectedShopId !== undefined ? (
              <ShopForm
                forwardShopUpdate={(shop) => handleShopUpdate(shop)}
                shopId={selectedShopId}
                isShopOwned={isOwnedByUser(userShopIds, selectedShopId)}
                forwardShopDelete={(shopId) => {
                  setUserShops((prevUserShops) =>
                    (prevUserShops ?? []).filter((shop) => shop.id !== shopId)
                  );
                  forwardShopDelete(shopId);
                }}
                handleClickedFarmId={(farmId) => forwardClickedFarmId(farmId)}
                handleIsShopClicked={(b) => handleIsShopClicked(b)}
                accountType={accountType}
                loginId={loginId}
                inLoginSelection={inLoginSelection}
                handleClickedCart={(productId, shopId)=>handleClickedCart(productId, shopId)}
              />
            ) : (
              <UserForm />
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
