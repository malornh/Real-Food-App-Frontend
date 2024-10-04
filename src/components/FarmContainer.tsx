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
  resetFarmId: ()=>void;
  forwardFarmUpdate: (farm: Farm)=>void;
  forwardFarmDelete: (farmId: number)=>void;
  handleIsShopClicked: (b: boolean)=>void;
  loginId: number | undefined;
  inLoginSelection: boolean;
}

const FarmContainer = ({
  resetFarmId,
  forwardFarmUpdate,
  forwardFarmDelete,
  handleIsShopClicked,
  loginId,
  inLoginSelection,
}: Props) => {
  const [showForm, setShowForm] = useState(false);
  const { setIsFarmFormOpen, 
          isDeliveryListOpen, 
          clickedFarmId, 
          setClickedFarmId,
          isCartFormOpen,
          isOrderFormOpen,
          setShowDelivery,
          setShowOrder,
          setIsOrderFormOpen,
        } = useContextProvider();

  useEffect(() => {
    if (clickedFarmId !== undefined) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [clickedFarmId]);

  const toggleForm = () => {
    if (showForm) {
      resetFarmId();
    }
    setShowForm((prevState) => !prevState);
  };

  const closeForm = () => {
    setIsFarmFormOpen(false);

    setShowDelivery(true);
    setShowForm(false);
    setShowOrder(true);

    handleIsShopClicked(true);
    setIsFarmFormOpen(false);
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
      {!isDeliveryListOpen &&
       !isCartFormOpen &&
       !isOrderFormOpen &&
      <HiSearchCircle
        className="button"
        style={{ left: showForm ? "calc(40%)" : "25px" }}
        onClick={()=>(setShowForm(true), setIsFarmFormOpen(true), setShowDelivery(false), setShowOrder(false), setIsOrderFormOpen(false))} //TO-DO: Implement search menu
      />}
      {showForm && (
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
                  forwardFarmDelete(farmId), setShowForm(false)
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
