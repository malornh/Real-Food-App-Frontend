import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import './FarmContainer.css';
import { HiSearchCircle } from "react-icons/hi";
import { Box } from '@chakra-ui/react';
import FarmForm from './FarmForm/FarmForm';
import SearchForm from './SearchForm';

interface Props {
  farmId: number | undefined;
  resetFarmId: ()=>void;
}

const FarmContainer = ({farmId, resetFarmId}: Props) => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
        if (farmId !== undefined) {
          setShowForm(true);
        }else
        {
          setShowForm(false);
        }
  }, [farmId]);

  const toggleForm = () => {
    if(showForm)
      {
        resetFarmId();
      }
    setShowForm((prevState) => !prevState);
  };

  const closeForm = () => {
    resetFarmId();
    setShowForm(false);
  };

  const isOwnedByUser = (shopIds: (number | undefined)[] | undefined, id: number) => {
    return shopIds?.includes(id);
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh"}}>
      <HiSearchCircle 
        className="button"
        style={{ left: showForm ? "calc(40%)" : "25px" }}
        onClick={toggleForm}
      />
      {showForm && (
        <div className="container">
          <IoMdCloseCircle className="closeButton" onClick={closeForm} />
          <Box className='categories'>
          <div
                  className="cardStyle"
                  >
                  <img
                    src="https://st3.depositphotos.com/3997585/12893/v/950/depositphotos_128935154-stock-illustration-bread-isolated-illustration.jpg"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50px",
                    }}
                    className={
                      1 === 1
                        ? "selectedCardBorder"
                        : "nonSelectedCardBorder"
                    }
                  />
                  <div>
                    {'Meat'.length > 14
                      ? 'Meat'.substring(0, 10) + "..."
                      : 'Meat'}
                  </div>
                </div>
          </Box>
          <div className="scrollable">
            {farmId !== undefined ? (
              <FarmForm
                farmId={farmId}
              />
            ) : (
              <SearchForm />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmContainer;
