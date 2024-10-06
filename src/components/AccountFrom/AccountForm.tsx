import { useEffect, useState } from "react";
import "./AccountForm.css";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";
import { HiMiniPlusCircle } from "react-icons/hi2";
import ShopForm from "../ShopForm/ShopForm";
import axios from "axios";
import { Shop } from "../ShopForm/EditShop/EditShop";
import { Button, Flex, useDisclosure } from "@chakra-ui/react"; // Ensure you import Box from Chakra UI
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

interface Props {
  updatedFarm: Farm | undefined;
  deletedFarmId: number | undefined;
  forwardShopUpdate: (shop: Shop) => void;
  forwardShopDelete: (shopId: number) => void;
  forwardFarmUpdate: (farm: Farm) => void;
}

const AccountForm = ({
  updatedFarm,
  deletedFarmId,
  forwardShopUpdate,
  forwardShopDelete,
  forwardFarmUpdate,
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
          setIsShopFormOpen,
          isAccountFormOpen,
          setIsAccountFormOpen,
          inLoginSelection,
          setInLoginSelection,
          loginId,
          setLoginId,
          setIsCartFormOpen,
          setIsDeliveryListOpen,
          setIsOrderFormOpen,
          setShowCart,
          setShowOrder,
          setShowDelivery,
         } = useContextProvider();

  useEffect(() => {
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
  }, [clickedShopId]);

  useEffect(() => {
    if (clickedShopId === undefined) {
      setIsShopFormOpen(false);
    }
  }, [clickedShopId]);

  const toggleShopForm = () => {
    setIsAccountFormOpen(!isAccountFormOpen);

    if (loginId && accountType === 2) {
      handleShopClick(loginId);
    }
    if (loginId && accountType === 3) {
      handleFarmClick(loginId);
      setIsFarmFormOpen(true);
    }
  };

  const handleShopClick = (id: number | undefined) => {
    setClickedFarmId(undefined);
    setClickedShopId(id);
    setIsShopClicked(true);
    setIsFarmFormOpen(false);
  }

  const handleFarmClick = (id: number | undefined) => {
    setClickedFarmId(id);
    setClickedShopId(undefined);
    setIsShopClicked(false);
    setIsFarmFormOpen(true);
  }

  const closeForm = () => {
    setIsAccountFormOpen(false);
    setIsShopClicked(false);
    setInLoginSelection(false);
  };

  const toggleAccount = () => {
    if (inLoginSelection) {
      setSelectedShopId(undefined);
      setIsShopClicked(false);
      setAccountType(1);
      setInLoginSelection(false);
      setLoginImage("");
      setShowCart(true);
      setIsFarmFormOpen(false);
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
        setIsFarmFormOpen(true);
      setShowOrder(true);
      }
    }
  };

  const handleCardClick = (id: number, image: string) => {
    setLoginId(id);
    setLoginImage(image);
    setIsDeliveryListOpen(false);

    if (accountType === 2) {
      setSelectedShopId(id);
      handleShopClick(id);
      setIsShopClicked(true);
      setInLoginSelection(false);
      setLoginId(id);
      setShowOrder(true);
    }
    if (accountType === 3) {
      setSelectedFarmId(id);
      handleFarmClick(id);
      setIsShopClicked(false);
      setInLoginSelection(false);
      setShowDelivery(false);
      setLoginId(id);
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
                    setInLoginSelection(true), 
                    setAccountType(2), 
                    setIsDeliveryListOpen(false),
                    setIsOrderFormOpen(false),
                    setIsCartFormOpen(false)
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
                loginId={loginId}
                inLoginSelection={inLoginSelection}
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
