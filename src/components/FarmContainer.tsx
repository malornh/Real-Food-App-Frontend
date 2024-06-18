import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import './FarmContainer.css';
import { HiSearchCircle } from "react-icons/hi";
import { Box } from '@chakra-ui/react';
import FarmForm from './FarmForm/FarmForm';
import SearchForm from './SearchForm';
import { Farm } from './FarmForm/EditFarm';

interface Props {
  farmId: number | undefined;
  resetFarmId: ()=>void;
  userId: string;
  forwardFarmUpdate: (farm: Farm)=>void;
  forwardFarmDelete: (farmId: number)=>void;
  handleIsShopClicked: (b: boolean)=>void;
  accountType: number | undefined;
  loginId: number | undefined;
  inLoginSelection: boolean;
}

const FarmContainer = ({
  farmId,
  resetFarmId,
  userId,
  forwardFarmUpdate,
  forwardFarmDelete,
  handleIsShopClicked,
  accountType,
  loginId,
  inLoginSelection
}: Props) => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (farmId !== undefined) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [farmId]);

  const toggleForm = () => {
    if (showForm) {
      resetFarmId();
    }
    setShowForm((prevState) => !prevState);
  };

  const closeForm = () => {
    resetFarmId();
    setShowForm(false);
    handleIsShopClicked(true);
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
      <HiSearchCircle
        className="button"
        style={{ left: showForm ? "calc(40%)" : "25px" }}
        onClick={()=>setShowForm(true)} //TO-DO: Implement search menu
      />
      {showForm && (
        <div className="container">
          <IoMdCloseCircle className="closeButton" onClick={closeForm} />
          <Box className="categories">
            <div className="cardStyle">
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
              </div>
            </div>
          </Box>
          <div className="scrollable">
            {farmId !== undefined ? (
              <FarmForm
                userId={userId}
                farmId={farmId}
                forwardFarmUpdate={(farm) => {
                  forwardFarmUpdate(farm);
                }}
                handleFarmDelete={(farmId) => (
                  forwardFarmDelete(farmId), setShowForm(false)
                )}
                accountType={accountType}
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
