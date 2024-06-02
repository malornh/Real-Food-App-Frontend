import React, { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import './FarmContainer.css';
import { HiSearchCircle } from "react-icons/hi";
import { Box } from '@chakra-ui/react';
import FarmForm from './FarmForm/FarmForm';
import SearchForm from './SearchForm';



const FarmContainer = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<number | undefined>(1);

  const toggleForm = () => {
    setShowForm((prevState) => !prevState);
  };

  const closeForm = () => {
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
          <Box className='categories'></Box>
          <div className="scrollable">
            {selectedFarmId !== undefined ? (
              <FarmForm
                farmId={selectedFarmId}
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
