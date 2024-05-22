import { useEffect, useState } from 'react';
import './AccountForm.css';
import UserForm from '../UserForm/UserForm';
import { MdAccountCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { CiCirclePlus } from 'react-icons/ci';
import ShopForm from '../ShopForm/ShopForm';
import axios from 'axios';

export interface Card {
  imgUrl: string;
  name: string;
  id: number;
  rating: number;
}

interface ShortShop{
  id: number,
  name: string,
  image: string,
  latitude: number,
  longitude: number,
}

interface Props {
  userId: string;
  clickedMapShopId?: number | undefined;
  markerClicked: boolean;
  resetShopId: (n: number | undefined)=>void;
  handleShopClick: (shopId: number)=>void;
  isEditModalOpen: (b: boolean)=>void;
}

const AccountForm = ({ userId, clickedMapShopId, markerClicked, resetShopId, handleShopClick, isEditModalOpen }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>();
  const [firstStart, setFirstStart] = useState(true);
  const [userShops, setUserShops] = useState<ShortShop[]>();

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

  const isOwnedByUser = (shopIds: number[] | undefined, id: number) => {
    return shopIds?.includes(id);
  };


  const handleAddNewCard = () => {};

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <MdAccountCircle
        className='buttonStyle'
        style={{ right: showForm ? 'calc(40%)' : '20px', }}
        onClick={showForm ? toggleAccount : toggleShopForm}
      />
      {showForm && (
        <div className="formContainerStyle">
          <div className="cardsContainerStyle">
            {userShops && userShops.map((shop: ShortShop) => (
              <div key={shop.id} className='cardStyle' onClick={() => handleCardClick(shop.id)}>
                <img src={shop.image} alt={shop.name} style={{ width: '80px', height: '80px', borderRadius: '50px'}} className={shop.id === selectedShopId ? 'selectedCardBorder' : 'nonSelectedCardBorder'} />
                <div>{shop.name.length > 14 ? shop.name.substring(0, 12) + '...' : shop.name}</div>
              </div>
            ))}
            <div className='cardStyle'>
              <CiCirclePlus className="plusIcon" onClick={handleAddNewCard} />
            </div>
          </div>
          <IoMdCloseCircle className="closeButtonStyle" onClick={closeForm} />
          <div className="scrollableContent">
            {selectedShopId !== undefined ? <ShopForm shopId={selectedShopId} isShopOwned={isOwnedByUser(userShops?.map(s=>s.id), selectedShopId)} isEditModalOpen={(b)=>isEditModalOpen(b)} /> : <UserForm/>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountForm;
