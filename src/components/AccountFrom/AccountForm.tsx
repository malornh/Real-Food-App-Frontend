// AccountForm.js
import { useState } from 'react';
import './AccountForm.css';
import FarmForm from '../FarmForm/FarmForm'
import UserForm from '../UserForm/UserForm';
import { MdAccountCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { CiCirclePlus } from 'react-icons/ci';

export interface Card {
  imgUrl: string,
  name: string,
  id: number,
  rating: number
}

interface Props {
  cards: Card[]
}

const AccountForm = ({ cards }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(false);

  const products= [
    {
      Id: 1,
      Name: "Eggs",
      Description: "Farm-fresh eggs from free-range chickens",
      FarmId: 1,
      UnitOfMeasurement: "Piece",
      Quantity: 90,
      PricePerUnit: 0.55,
      DeliveryRadius: 10.0,
      MinUnitOrder: 1,
      DateUpdated: new Date("2024-05-01"),
      Image: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg",
      Type: "Eggs&Dairy"
    },
    {
      Id: 2,
      Name: "Strawberries",
      Description: "Organic ripe strawberries, picked daily",
      FarmId: 2,
      UnitOfMeasurement: "Kilogram",
      Quantity: 30,
      PricePerUnit: 3.5,
      DeliveryRadius: 8.0,
      MinUnitOrder: 1,
      DateUpdated: new Date("2024-05-02"),
      Image: "https://images.immediate.co.uk/production/volatile/sites/10/2018/03/2048x1365-Best-strawberries-to-grow-LI1834878-9b05a14.jpg?quality=90&webp=true&crop=9px,11px,2031px,1354px&resize=1200,800",
      Type: "Fruit"
    },
    {
      Id: 3,
      Name: "Tomatoes",
      Description: "Fresh vine-ripened tomatoes",
      FarmId: 3,
      UnitOfMeasurement: "Kilogram",
      Quantity: 40,
      PricePerUnit: 1.8,
      DeliveryRadius: 7.0,
      MinUnitOrder: 1,
      DateUpdated: new Date("2024-05-03"),
      Image: "https://www.vincenzosonline.com/userContent/images/Blog/Tomatoes/tomatoes-5.jpg",
      Type: "Fruit"
    }
  ];
  

  const toggleForm = () => {
    setShowForm(prevState => !prevState);
    setSelectedAccount(false);
  };

  const toggleAccount = () => {
    setSelectedCard(null);
    setSelectedCardId(0);
    setSelectedAccount(true);
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setSelectedCardId(card.id);
  };

  const handleAddNewCard = () =>{

  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {selectedAccount ? 'selectedCardBorder' : 'nonSelectedCardBorder'}
      <MdAccountCircle  
        className='buttonStyle' 
        style={{ right: showForm ? 'calc(40%)' : '20px',  }} 
        onClick={showForm != true ? toggleForm : ()=> toggleAccount()} 
      />
      {showForm && (
        <div className="formContainerStyle">
          <div className="cardsContainerStyle">
            {cards.map((card) => (
              <div key={card.id} className='cardStyle' onClick={() => handleCardClick(card)}>
                <img src={card.imgUrl} alt={card.name} style={{ width: '80px', height: '80px', borderRadius: '50px'}} className={card.id === selectedCardId ? 'selectedCardBorder' : 'nonSelectedCardBorder'} />
                <div style={{marginTop: '-10px'}}>{card.name}</div>
              </div>
            ))}
            <div className='cardStyle'>
              <CiCirclePlus className="plusIcon" onClick={handleAddNewCard} />
            </div>
          </div>
          <IoMdCloseCircle className="closeButtonStyle" onClick={toggleForm} />
          <div className="scrollableContent">
            {selectedCard ? <FarmForm products={products} data={selectedCard} /> : <UserForm/>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountForm;
