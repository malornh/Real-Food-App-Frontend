import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AccountForm from './components/AccountFrom/AccountForm';
import SofiaVectorMap from './components/SofiaVectorMap';
import EditShop, { Shop } from './components/ShopForm/EditShop/EditShop';
import MapComponent from './components/ShopForm/EditShop/MapComponent';

const App = () => {
  const [clickedMapShopId, setClickedMapShopId] = useState<number | undefined>(undefined);
  const [markerClicked, setMarkerClicked] = useState(false);
  const userId = '0f17881d-b0cd-45b1-afdc-b15f93eeabcc';
  const [updatedShop, setUpdatedShop] = useState<Shop>();
  const [deletedShopId, setDeletedShopId] = useState<number | undefined>();

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
      />
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
