import React, { useEffect, useState } from 'react';
import './AccountForm.css';
import UserForm from '../UserForm/UserForm';
import { MdAccountCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { CiCirclePlus } from 'react-icons/ci';
import ShopForm from '../ShopForm/ShopForm';
import axios from 'axios';
import { Shop } from '../ShopForm/EditShop/EditShop';
import { Box, useDisclosure } from '@chakra-ui/react'; // Ensure you import Box from Chakra UI
import Create from '../Create';

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
  resetShopId: (n: number | undefined) => void;
  handleShopClick: (shopId: number) => void;
  forwardShopUpdate: (shop: Shop) => void;
}

const AccountForm = ({ userId, clickedMapShopId, markerClicked, resetShopId, handleShopClick, forwardShopUpdate }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>();
  const [firstStart, setFirstStart] = useState(true);
  const [userShops, setUserShops] = useState<Shop[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`https://localhost:7218/api/Shop/ByUser/${userId}`);
        setUserShops(response.data);
      } catch (error: any) {
        console.error('Error fetching shops:', error.message);
      }
    };

    fetchShops();
  }, [userId]);

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

  const toggleShopForm = () => {
    setShowForm((prevState) => !prevState);
  };

  const closeForm = () => {
    setShowForm((prevState) => !prevState);
  };

  const toggleAccount = () => {
    setSelectedShopId(undefined);
    resetShopId(undefined);
  };

  const handleCardClick = (shopId: number) => {
    setSelectedShopId(shopId);
    handleShopClick(shopId);
  };

  const isOwnedByUser = (shopIds: (number | undefined)[] | undefined, id: number) => {
    return shopIds?.includes(id);
  };

  const handleAddNewCard = () => {
    onOpen();
  };

  function handleShopUpdate(shop: Shop): void {
    forwardShopUpdate(shop);
    setUserShops(currentShops => {
      // Map through existing shops and replace the one with the same ID
      return currentShops?.map(currentShop => {
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

  const userShopIds = userShops?.map(s => s.id).filter((id): id is number => id !== undefined);

  function handleCreateShop(shop: Shop): void {
    forwardShopUpdate(shop);

    setUserShops(prevUserShops => [...(prevUserShops ?? []), shop]);
}

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <MdAccountCircle
        className='buttonStyle'
        style={{ right: showForm ? 'calc(40%)' : '20px' }}
        onClick={showForm ? toggleAccount : toggleShopForm}
      />
      {showForm && (
        <div className="formContainerStyle">
          <div className="cardsContainerStyle">
            {userShops && userShops.map((shop: Shop) => (
              <div key={shop.id} className='cardStyle' onClick={() => shop.id !== undefined && handleCardClick(shop.id)}>
                <img src={shop.image} alt={shop.name} style={{ width: '80px', height: '80px', borderRadius: '50px' }} className={shop.id === selectedShopId ? 'selectedCardBorder' : 'nonSelectedCardBorder'} />
                <div>{shop.name.length > 14 ? shop.name.substring(0, 10) + '...' : shop.name}</div>
              </div>
            ))}
            <Box className='cardStyle' onClick={handleAddNewCard}>
              <CiCirclePlus className="plusIcon" />
            </Box>
          </div>
          <IoMdCloseCircle className="closeButtonStyle" onClick={closeForm} />
          <div className="scrollableContent">
            {selectedShopId !== undefined ? <ShopForm forwardShopUpdate={(shop) => handleShopUpdate(shop)} shopId={selectedShopId} isShopOwned={isOwnedByUser(userShopIds, selectedShopId)} /> : <UserForm />}
          </div>
        </div>
      )}
      {isOpen && <Create isOpen={isOpen} onClose={onClose} userId={userId} handleNewShop={(shop)=>handleCreateShop(shop)} />}
    </div>
  );
};

export default AccountForm;
