//import Farms from './components/Farms';
//import SofiaVectorMap from './components/SofiaVectorMap';
import { useState } from 'react';
import AccountForm from './components/AccountFrom/AccountForm';
import SofiaVectorMap from './components/SofiaVectorMap';

const App = () => {

  

  const [clickedMapShopId, setClickedMapShopId] = useState<number | undefined>(undefined);
  const [markerClicked, setMarkerClicked] = useState(false);

  const userId = '0f17881d-b0cd-45b1-afdc-b15f93eeabcc';

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
      />
      <SofiaVectorMap
        handleShopClick={handleShopClick}
        markerClicked={markerClicked} 
      />
    </div>
  );
};

export default App;