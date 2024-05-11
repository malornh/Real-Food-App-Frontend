import { useEffect, useState } from 'react';
import './AccountForm.css';
import UserForm from '../UserForm/UserForm';
import { MdAccountCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { CiCirclePlus } from 'react-icons/ci';
import ShopForm from '../ShopForm/ShopForm';

export interface Card {
  imgUrl: string;
  name: string;
  id: number;
  rating: number;
}

interface Props {
  cards: Card[];
  clickedMapShopId?: number | undefined; // Make clickedMapShopId optional
  resetShopId: (n: number | undefined)=>void;
}

const AccountForm = ({ cards, clickedMapShopId, resetShopId }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>();
  const [firstStart, setFirstStart] = useState(true);

  useEffect(() => {
    if(clickedMapShopId!=undefined)
    {
      setSelectedShopId(clickedMapShopId);
    }

    if (firstStart) {
      setShowForm(false);
      setFirstStart(false);
    } else {
      setShowForm(true);
    }
  }, [clickedMapShopId]);


  const toggleShopForm = () => {
    setShowForm((prevState) => !prevState);
  };

  const closeForm = () => {
    setShowForm((prevState) => !prevState);
    resetShopId(undefined);
  };

  const toggleAccount = () => {
    setSelectedShopId(undefined);
    resetShopId(undefined);
  };

  const handleCardClick = (shopId: number) => {
    setSelectedShopId(shopId);
  };

  const handleAddNewCard = () => {
  };

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
            {cards.map((card) => (
              <div key={card.id} className='cardStyle' onClick={() => handleCardClick(card.id)}>
                <img src={card.imgUrl} alt={card.name} style={{ width: '80px', height: '80px', borderRadius: '50px'}} className={card.id === selectedCardId ? 'selectedCardBorder' : 'nonSelectedCardBorder'} />
                <div style={{marginTop: '-10px'}}>{card.name}</div>
              </div>
            ))}
            <div className='cardStyle'>
              <CiCirclePlus className="plusIcon" onClick={handleAddNewCard} />
            </div>
          </div>
          <IoMdCloseCircle className="closeButtonStyle" onClick={closeForm} />
          <div className="scrollableContent">
            {selectedShopId !=undefined ? <ShopForm shopId={selectedShopId} /> : <UserForm/>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountForm;