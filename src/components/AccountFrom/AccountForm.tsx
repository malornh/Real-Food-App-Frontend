import React, { useEffect, useState } from 'react';
import './AccountForm.css';
import UserForm from '../UserForm/UserForm';
import { RiAccountCircleFill } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";
import { HiMiniPlusCircle } from "react-icons/hi2";
import ShopForm from '../ShopForm/ShopForm';
import axios from 'axios';
import { Shop } from '../ShopForm/EditShop/EditShop';
import { Box, Flex, useDisclosure } from '@chakra-ui/react'; // Ensure you import Box from Chakra UI
import Create from '../Create'
import { Farm } from '../FarmForm/EditFarm';
import { IoMdArrowDropdownCircle  } from "react-icons/io";
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
}: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>();
  const [selectedFarmId, setSelectedFarmId] = useState<number | undefined>();
  const [firstStart, setFirstStart] = useState(true);
  const [userShops, setUserShops] = useState<Shop[]>();
  const [userFarms, setUserFarms] = useState<Farm[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showShops, setShowShops] = useState(true);
  
  useEffect(() => {
    console.log(updatedFarm);
    if (updatedFarm) {
      setUserFarms(prevFarms => {
        // Ensure prevFarms is always an array
        const farms = prevFarms || [];
        const existingFarmIndex = farms.findIndex(farm => farm.id === updatedFarm.id);

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
    if(clickedMapShopId === undefined)
      {
        setShowForm(false);
      }
  }, [clickedMapShopId]);



  const toggleShopForm = () => {
    setShowForm((prevState) => !prevState);
  };

  const closeForm = () => {
    resetShopId(undefined);
    setShowForm((prevState) => !prevState);
  };

  const toggleAccount = () => {
    setSelectedShopId(undefined);
    resetShopId(undefined);
  };

  const handleCardClick = (id: number) => {
    showShops ? (setSelectedShopId(id), handleShopClick(id)) : (setSelectedFarmId(id), handleFarmClick(id));
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
      <RiAccountCircleFill
        className="buttonStyle"
        style={{ right: showForm ? "calc(40%)" : "25px" }}
        onClick={showForm ? toggleAccount : toggleShopForm}
      />
      {showForm && (
        <div className="formContainerStyle">
          <Flex>
            {userShops && (
              <Flex flexDirection="column" mt={10} ml={80}>
                <TbCircleLetterS
                  className={`miniCircleIcon ${showShops ? 'tealBorder' : ''}`}
                  onClick={() => setShowShops(true)}
                />
                <TbCircleLetterF
                  className={`miniCircleIcon ${!showShops ? 'tealBorder' : ''}`}
                  onClick={() => setShowShops(false)}
                />
              </Flex>
            )}
            <div className="cardsContainerStyle">
              {userShops &&
                showShops &&
                userShops.map((shop: Shop) => (
                  <div
                    key={shop.id}
                    className="cardStyle"
                    onClick={() =>
                      shop.id !== undefined && handleCardClick(shop.id)
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
                !showShops &&
                userFarms.map((farm: Farm) => (
                  <div
                    key={farm.id}
                    className="cardStyle"
                    onClick={() =>
                      farm.id !== undefined && handleCardClick(farm.id)
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
            <Flex flexDirection='column' ml={-45} mt={10}>
              <HiMiniPlusCircle onClick={handleAddNewCard} className="plusIcon" />
              <IoMdArrowDropdownCircle className='miniCircleIcon'/>
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
