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
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}
    >
      {selectedAccount ? 'selectedCardBorder' : 'nonSelectedCardBorder'}
     

      <MdAccountCircle  
      className='buttonStyle' 
      style={{ right: showForm ? 'calc(40%)' : '20px',  }} 
      onClick={showForm != true ? toggleForm : ()=> toggleAccount()} 
      />
      
      {showForm && (
        <div className="formContainerStyle">
          <div className="cardsContainerStyle">
            {cards.map((card, index) => (
              <div key={card.id} className='cardStyle' onClick={() => handleCardClick(card)}>
              <img src={card.imgUrl} alt={card.name} style={{ width: '80px', height: '80px', borderRadius: '50px'}} className={card.id === selectedCardId ? 'selectedCardBorder' : 'nonSelectedCardBorder'} />
                <div style={{ color: 'black' }}>{card.name}</div>
              </div>
            ))}
            <div className='cardStyle' >
              <CiCirclePlus className="plusIcon" onClick={handleAddNewCard} />
            </div>
          </div>
          <IoMdCloseCircle className="closeButtonStyle" onClick={toggleForm} />
          {selectedCard ? <FarmForm data={selectedCard} /> : <UserForm/>}
        </div>
      )}
    </div>
  );
};

export default AccountForm;
