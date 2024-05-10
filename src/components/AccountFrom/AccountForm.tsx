import { useEffect, useState } from 'react';
import './AccountForm.css';
import FarmForm from '../FarmForm/FarmForm';
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
  clickedShopId: number | undefined;
  resetShopId: (n: number | undefined)=>void;
}

const AccountForm = ({ cards, clickedShopId, resetShopId }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>(); //-1 for selected account
  const [accountSelected, setAccountSelected] = useState(false);

  useEffect(() => {
    setAccountSelected(true);
    setSelectedShopId(clickedShopId);
    setShowForm(true);
  }, [clickedShopId]);

  const toggleShopForm = () => {
    setShowForm(prevState => !prevState);
  };

  const toggleAccount = () => {
    setAccountSelected(false);
  };

  const handleCardClick = (shopId: number) => {
    setAccountSelected(true);
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
          <IoMdCloseCircle className="closeButtonStyle" onClick={toggleShopForm} />
          <div className="scrollableContent">
            {accountSelected ? <ShopForm key={selectedShopId} shopId={selectedShopId} /> : <UserForm/>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountForm;

