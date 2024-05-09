//import Farms from './components/Farms';
//import SofiaVectorMap from './components/SofiaVectorMap';
import { useState } from 'react';
import AccountForm from './components/AccountFrom/AccountForm';
import SofiaVectorMap from './components/SofiaVectorMap';

const App = () => {
  const initialCoordinates = [
    { id: 1, lat: 42.70141810451674, lng: 23.28586578369141 },
    { id: 2, lat: 42.7113834366729, lng: 23.309383392333988 },
    { id: 3, lat: 42.701544257958545, lng: 23.34028244018555 },
    { id: 4, lat: 42.67769670366036, lng: 23.32929611206055 },
    { id: 5, lat: 42.68842292714096, lng: 23.29633712768555 },
    { id: 6, lat: 42.69851650460869, lng: 23.31830978393555 }
  ];
  
  const exampleCards = [
    {
      imgUrl: 'https://images.pexels.com/photos/235725/pexels-photo-235725.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      name: 'Barn',
      id: 1,
      rating: 4.1
    },
    {
      imgUrl: 'https://images.pexels.com/photos/5209866/pexels-photo-5209866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      name: 'Tonev Shop',
      id: 2,
      rating: 3.8
    },
    {
      imgUrl: 'https://images.pexels.com/photos/10615228/pexels-photo-10615228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      name: 'Tonev Farm ',
      id: 3,
      rating: 4.6
    },
    {
      imgUrl: 'https://images.pexels.com/photos/4533849/pexels-photo-4533849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      name: 'Corn Farm',
      id: 4,
      rating: 4.4
    }
  ];

  const [clickedShopId, setClickedShopId] = useState<number>();

  return (
    <div>
        <AccountForm cards={exampleCards} />
        <SofiaVectorMap initialCoordinates={initialCoordinates} handleShopClick={(id)=> setClickedShopId(id)} />
        <div>
        </div>
    </div>
  );
};

export default App;