import { useEffect, useState } from "react";
import AccountForm from "./components/AccountFrom/AccountForm";
import SofiaVectorMap from "./components/SofiaVectorMap";
import { Shop } from "./components/ShopForm/EditShop/EditShop";
import FarmContainer from "./components/FarmContainer";
import { Farm } from "./components/FarmForm/EditFarm";
import OrderList from "./components/OrderList/OrderList";
import ShopOrderList from "./components/ShopForm/ShopOrderList";
import CartForm from "./components/CartForm.tsx/CartForm";
import { useContextProvider } from "./ContextProvider";
import ResetPassword from "./components/LoginRegisterForm/ResetPassword";

const App = () => {

  const [updatedShop, setUpdatedShop] = useState<Shop>();
  const [deletedShopId, setDeletedShopId] = useState<number | undefined>();
  const [clickedMapFarmId, setClickedMapFarmId] = useState<
    number | undefined
  >();
  const [updatedFarm, setUpdatedFarm] = useState<Farm>();
  const [deletedFarmId, setDeletedFarmId] = useState<number | undefined>();

  const [inLoginSelection, setInLoginSelection] = useState(false);
  const [loginId, setLoginId] = useState<number | undefined>();

  const [isFarmFormOpen, setIsFarmFormOpen] = useState(false);

  const { accountType, resetToken, setResetToken } = useContextProvider(); 

  useEffect(() => {
    setClickedMapFarmId(updatedFarm?.id);
  }, [updatedFarm]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    setResetToken(tokenFromUrl);
  });

  return (
    <div>
      <AccountForm
        forwardShopUpdate={(shop) => setUpdatedShop(shop)}
        forwardShopDelete={(shopId) => setDeletedShopId(shopId)}
        forwardFarmUpdate={(farm) => setUpdatedFarm(farm)}
        updatedFarm={updatedFarm}
        deletedFarmId={deletedFarmId}
      />
      <FarmContainer
        forwardFarmUpdate={(farm) => setUpdatedFarm(farm)}
        forwardFarmDelete={(farmId) => setDeletedFarmId(farmId)}
      />
      {accountType == 3 && !isFarmFormOpen && !inLoginSelection && (
        <OrderList />
      )}
      <ShopOrderList />
      <SofiaVectorMap
        updatedShop={updatedShop}
        deletedShopId={deletedShopId}
        deletedFarmId={deletedFarmId}
      />
      <CartForm
      />
      {resetToken !== null && <ResetPassword />}
    </div>
  );
};

export default App;