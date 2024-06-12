import { useEffect, useState } from 'react';
import AccountForm from './components/AccountFrom/AccountForm';
import SofiaVectorMap from './components/SofiaVectorMap';
import { Shop } from './components/ShopForm/EditShop/EditShop';
import FarmContainer from './components/FarmContainer';
import { Farm } from './components/FarmForm/EditFarm';

const App = () => {
  const [clickedMapShopId, setClickedMapShopId] = useState<number | undefined>(undefined);
  const [markerClicked, setMarkerClicked] = useState(false);
  const userId = '0f17881d-b0cd-45b1-afdc-b15f93eeabcc';
  const [updatedShop, setUpdatedShop] = useState<Shop>();
  const [deletedShopId, setDeletedShopId] = useState<number | undefined>();
  const [clickedMapFarmId, setClickedMapFarmId] = useState<number | undefined>();
  const [updatedFarm, setUpdatedFarm] = useState<Farm>();
  const [deletedFarmId, setDeletedFarmId] = useState<number | undefined>();

  useEffect(()=>{
    setClickedMapFarmId(updatedFarm?.id);
  }, [updatedFarm])

  const handleShopClick = (id: number) => {
    setClickedMapFarmId(undefined);
    setClickedMapShopId(id);
    setMarkerClicked(prevState => !prevState);
  };

  function handleFarmClick(farmId: number): void {
    setClickedMapShopId(undefined);
    setClickedMapFarmId(farmId);
  }

  return (
    <div>
      <AccountForm
        userId={userId}
        resetShopId={(n) => setClickedMapShopId(n)}
        clickedMapShopId={clickedMapShopId}
        markerClicked={markerClicked}
        handleShopClick={(shopId) => setClickedMapShopId(shopId)}
        handleFarmClick={(farmId) => setClickedMapFarmId(farmId)}
        forwardShopUpdate={(shop) => setUpdatedShop(shop)}
        forwardShopDelete={(shopId) => setDeletedShopId(shopId)}
        forwardClickedFarmId={(farmId) => setClickedMapFarmId(farmId)}
        forwardFarmUpdate={(farm) => setUpdatedFarm(farm)}
        updatedFarm={updatedFarm}
        deletedFarmId={deletedFarmId}
      />
      <FarmContainer
        farmId={clickedMapFarmId}
        resetFarmId={() => setClickedMapFarmId(undefined)}
        userId={userId}
        forwardFarmUpdate={(farm) => setUpdatedFarm(farm)}
        forwardFarmDelete={(farmId)=>setDeletedFarmId(farmId)}
      />
      <SofiaVectorMap
        handleShopClick={handleShopClick}
        clickedMapShopId={clickedMapShopId}
        updatedShop={updatedShop}
        deletedShopId={deletedShopId}
        deletedFarmId={deletedFarmId}
        handleFarmClick={(farmId)=>handleFarmClick(farmId)}
        clickedMapFarmId={clickedMapFarmId}
      />
    </div>
  );
};

export default App;
