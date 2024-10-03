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

const App = () => {
  const [clickedMapShopId, setClickedMapShopId] = useState<number | undefined>(
    undefined
  );
  const [markerClicked, setMarkerClicked] = useState(false);
  const [updatedShop, setUpdatedShop] = useState<Shop>();
  const [deletedShopId, setDeletedShopId] = useState<number | undefined>();
  const [clickedMapFarmId, setClickedMapFarmId] = useState<
    number | undefined
  >();
  const [updatedFarm, setUpdatedFarm] = useState<Farm>();
  const [deletedFarmId, setDeletedFarmId] = useState<number | undefined>();
  const [isShopClicked, setIsShopClicked] = useState<boolean>(true);

  const [inLoginSelection, setInLoginSelection] = useState(false);
  const [loginId, setLoginId] = useState<number | undefined>();

  const [isDeliveryListOpen, setIsDeliveryListOpen] = useState(false);
  const [isFarmFormOpen, setIsFarmFormOpen] = useState(false);
  const [isCartFormOpen, setIsCartFormOpen] = useState(false);

  const [newProductId, setNewProductId] = useState<number>();
  const [newShopId, setNewShopId] = useState<number>();
  const { accountType, setAccountType } = useContextProvider(); 

  useEffect(() => {
    setClickedMapFarmId(updatedFarm?.id);
  }, [updatedFarm]);

  function handleShopClick(shopId: number | undefined): void {
    setClickedMapFarmId(undefined);
    setClickedMapShopId(shopId);
    setMarkerClicked((prevState) => !prevState);
    setIsShopClicked(true);
  }

  function handleFarmClick(farmId: number): void {
    setClickedMapShopId(undefined);
    setClickedMapFarmId(farmId);
    setIsShopClicked(false);
  }

  return (
    <div>
      <AccountForm
        markerClicked={markerClicked}
        forwardShopUpdate={(shop) => setUpdatedShop(shop)}
        forwardShopDelete={(shopId) => setDeletedShopId(shopId)}
        forwardClickedFarmId={(farmId) => setClickedMapFarmId(farmId)}
        forwardFarmUpdate={(farm) => setUpdatedFarm(farm)}
        updatedFarm={updatedFarm}
        deletedFarmId={deletedFarmId}
        handleIsShopClicked={(b) => setIsShopClicked(b)}
        handleLoggedAs={(id, inLoginSelection) => (
          setLoginId(id),
          setAccountType(accountType),
          setInLoginSelection(inLoginSelection)
        )}
      />
      <FarmContainer
        resetFarmId={() => setClickedMapFarmId(undefined)}
        forwardFarmUpdate={(farm) => setUpdatedFarm(farm)}
        forwardFarmDelete={(farmId) => setDeletedFarmId(farmId)}
        handleIsShopClicked={(b) => setIsShopClicked(b)}
        loginId={loginId}
        inLoginSelection={inLoginSelection}
      />
      {accountType == 3 && !isFarmFormOpen && !inLoginSelection && (
        <OrderList />
      )}
      <ShopOrderList
        shopId={loginId}
        isInLoginSelection={inLoginSelection}
        isDeliveryListOpen={(b) => setIsDeliveryListOpen(b)}
        isFarmFormOpen={isFarmFormOpen}
        handleClickedFarm={(farmId) => (
          setClickedMapFarmId(farmId),
          setIsDeliveryListOpen(false),
          setIsFarmFormOpen(true),
          setIsShopClicked(false)
        )}
      />
      <SofiaVectorMap
        updatedShop={updatedShop}
        deletedShopId={deletedShopId}
        deletedFarmId={deletedFarmId}
      />
      <CartForm
        productId={newProductId}
      />
    </div>
  );
};

export default App;