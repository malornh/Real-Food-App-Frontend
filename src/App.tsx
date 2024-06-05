import { useEffect, useState } from 'react';
import AccountForm from './components/AccountFrom/AccountForm';
import SofiaVectorMap from './components/SofiaVectorMap';
import { Shop } from './components/ShopForm/EditShop/EditShop';
import FarmContainer from './components/FarmContainer';

const App = () => {
  const [clickedMapShopId, setClickedMapShopId] = useState<number | undefined>(undefined);
  const [markerClicked, setMarkerClicked] = useState(false);
  const userId = '0f17881d-b0cd-45b1-afdc-b15f93eeabcc';
  const [updatedShop, setUpdatedShop] = useState<Shop>();
  const [deletedShopId, setDeletedShopId] = useState<number | undefined>();
  const [clickedFarmId, setClickedFarmId] = useState<number | undefined>();
  const [updatedFarm, setUpdatedFarm] = useState<Shop>();

  useEffect(()=>{
    setClickedFarmId(updatedFarm?.id);
  }, [updatedFarm])

  const handleShopClick = (id: number) => {
    setClickedMapShopId(id);
    setMarkerClicked(prevState => !prevState);
  };

  return (
    <div>
      <AccountForm
        userId={userId}
        resetShopId={(n) => setClickedMapShopId(n)}
        clickedMapShopId={clickedMapShopId}
        markerClicked={markerClicked}
        handleShopClick={(shopId) => setClickedMapShopId(shopId)}
        handleFarmClick={(farmId)=>setClickedFarmId(farmId)}
        forwardShopUpdate={(shop)=>setUpdatedShop(shop)}
        forwardShopDelete={(shopId)=>setDeletedShopId(shopId)}
        forwardClickedFarmId={(farmId)=>setClickedFarmId(farmId)}
        forwardFarmUpdate={(farm)=>setUpdatedFarm(farm)}
      />
      <FarmContainer farmId={clickedFarmId} resetFarmId={()=>setClickedFarmId(undefined)} userId={userId} />
      <SofiaVectorMap
        handleShopClick={handleShopClick}
        clickedMapShopId={clickedMapShopId}
        updatedShop={updatedShop}
        deletedShopId={deletedShopId}
      />
    </div>
  );
};

export default App;
