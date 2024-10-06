import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import './FarmContainer.css';
import { HiSearchCircle } from "react-icons/hi";
import { Box } from '@chakra-ui/react';
import FarmForm from './FarmForm/FarmForm';
import SearchForm from './SearchForm';
import { Farm } from './FarmForm/EditFarm';
import { useContextProvider } from '../ContextProvider';

interface Props {
  forwardFarmUpdate: (farm: Farm)=>void;
  forwardFarmDelete: (farmId: number)=>void;
}

const FarmContainer = ({
  forwardFarmUpdate,
  forwardFarmDelete,
}: Props) => {
  const { 
          isFarmFormOpen,
          setIsFarmFormOpen, 
          isDeliveryListOpen, 
          clickedFarmId, 
          isCartFormOpen,
          isOrderFormOpen,
          setShowDelivery,
          setIsOrderFormOpen,
          showOrder,
          setShowOrder,
          loginId,
          inLoginSelection,
        } = useContextProvider();

  useEffect(() => {
    if (clickedFarmId !== undefined) {
      setShowOrder(true);
    } else {
    }
  }, [clickedFarmId]);

  const closeForm = () => {
    setIsFarmFormOpen(false);
    setShowDelivery(true);
    setShowOrder(true);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}>
      {
       !isDeliveryListOpen &&
       !isCartFormOpen &&
       !isOrderFormOpen &&
      <HiSearchCircle
        className="button"
        style={{ left: isFarmFormOpen ? "calc(40%)" : "25px" }}
        onClick={()=>(setShowOrder(true), setIsFarmFormOpen(true), setShowDelivery(false), setIsOrderFormOpen(false))} //TO-DO: Implement search menu
      />}
      {isFarmFormOpen &&
       showOrder && (
        <div className="container">
          <IoMdCloseCircle className="closeButton" onClick={closeForm} />
          <Box className="categories">
            <div className="cardStyle" style={{marginBottom: '130px'}}>
              {/* Search and Filtering place
              <img
                src="https://st3.depositphotos.com/3997585/12893/v/950/depositphotos_128935154-stock-illustration-bread-isolated-illustration.jpg"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50px",
                }}
                className={
                  1 === 1 ? "selectedCardBorder" : "nonSelectedCardBorder"
                }
              />
              <div>
                {"Meat".length > 14 ? "Meat".substring(0, 10) + "..." : "Meat"}
              </div>*/}
            </div>
          </Box>
          <div className="scrollable">
            {clickedFarmId !== undefined ? (
              <FarmForm
                forwardFarmUpdate={(farm) => {
                  forwardFarmUpdate(farm);
                }}
                handleFarmDelete={(farmId) => (
                  forwardFarmDelete(farmId), setShowOrder(false)
                )}
                loginId={loginId}
                inLoginSelection={inLoginSelection}
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
