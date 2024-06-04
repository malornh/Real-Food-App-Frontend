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

  const handleShopClick = (id: number) => {
    setClickedMapShopId(id);
    setMarkerClicked(prevState => !prevState);
  };

  const [imgSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    console.log(imgSrc);
  }, [imgSrc]);

  return (
    <div>
      <AccountForm
        userId={userId}
        resetShopId={(n) => setClickedMapShopId(n)}
        clickedMapShopId={clickedMapShopId}
        markerClicked={markerClicked}
        handleShopClick={(shopId) => setClickedMapShopId(shopId)}
        forwardShopUpdate={(shop)=>setUpdatedShop(shop)}
        forwardShopDelete={(shopId)=>setDeletedShopId(shopId)}
        forwardClickedFarmId={(farmId)=>setClickedFarmId(farmId)}
      />
      <FarmContainer farmId={clickedFarmId} resetFarmId={()=>setClickedFarmId(undefined)} />
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
