import React, { createContext, useState, ReactNode, useContext } from 'react';

interface ContextProps {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  userId: string | null;
  setUserId: (userId: string) => void;
  clearUserId: () => void;
  accountType: number;
  setAccountType: (accountType: number) => void;
  clickedFarmId: number | undefined;
  setClickedFarmId: (id: number | undefined) => void;
  clickedShopId: number | undefined;
  setClickedShopId: (id: number | undefined) => void;
  isShopClicked: boolean;
  setIsShopClicked: (b: boolean) => void;
  isDeliveryListOpen: boolean;
  setIsDeliveryListOpen: (open: boolean) => void;
  isFarmFormOpen: boolean;
  setIsFarmFormOpen: (open: boolean) => void;
  isShopFormOpen: boolean;
  setIsShopFormOpen: (open: boolean) => void;
  isCartFormOpen: boolean;
  setIsCartFormOpen: (open: boolean) => void;
  isOrderFormOpen: boolean;
  setIsOrderFormOpen: (open: boolean) => void;
  productFarmClick: (farmId: number) => void;
}

const Context = createContext<ContextProps | undefined>(undefined);

export const useContextProvider = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContextProvider must be used within a ContextProvider');
  }
  return context;
};

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [accountType, setAccountTypeState] = useState(1); // 1 
  const [clickedFarmId, setClickedFarmIdState] = useState<number | undefined>(undefined);
  const [clickedShopId, setClickedShopIdState] = useState<number | undefined>(undefined);
  const [isShopClicked, setIsShopClickedState] = useState<boolean>(true); // False if a farm is clicked

  // New state variables
  const [isDeliveryListOpen, setIsDeliveryListOpenState] = useState<boolean>(false);
  const [isFarmFormOpen, setIsFarmFormOpenState] = useState<boolean>(false);
  const [isShopFormOpen, setIsShopFormOpenState] = useState<boolean>(false);
  const [isCartFormOpen, setIsCartFormOpenState] = useState<boolean>(false);
  const [isOrderFormOpen, setIsOrderFormOpenState] = useState<boolean>(false);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('jwtToken', newToken);
  };

  const clearToken = () => {
    setTokenState(null);
    localStorage.removeItem('jwtToken');
  };

  const setUserId = (newUserId: string) => {
    setUserIdState(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  const clearUserId = () => {
    setUserIdState(null);
    localStorage.removeItem('userId');
  };

  const setAccountType = (newAccountType: number) => {
    setAccountTypeState(newAccountType);
    localStorage.setItem('accountType', String(newAccountType));
  };

  const setClickedFarmId = (id: number | undefined) => {
    setClickedFarmIdState(id);
    localStorage.setItem('clickedFarmId', String(id));
  };

  const setClickedShopId = (id: number | undefined) => {
    setClickedShopIdState(id);
    localStorage.setItem('clickedShopId', String(id));
  };

  const setIsShopClicked = (b: boolean) => {
    setIsShopClickedState(b);
    localStorage.setItem('isShopClicked', String(b));
  };

  const setIsDeliveryListOpen = (open: boolean) => {
    setIsDeliveryListOpenState(open);
    localStorage.setItem('isDeliveryListOpen', String(open));
  };
  
  const setIsFarmFormOpen = (open: boolean) => {
    setIsFarmFormOpenState(open);
    localStorage.setItem('isFarmFormOpen', String(open));
  };

  const setIsShopFormOpen = (open: boolean) => {
    setIsShopFormOpenState(open);
    localStorage.setItem('isShopFormOpen', String(open));
  };
  
  
  const setIsCartFormOpen = (open: boolean) => {
    setIsCartFormOpenState(open);
    localStorage.setItem('isCartFormOpen', String(open));
  };

  const setIsOrderFormOpen = (open: boolean) => {
    setIsOrderFormOpenState(open);
    localStorage.setItem('isOrderFormOpen', String(open));
  };

  const productFarmClick = (farmId: number) => {
    setIsDeliveryListOpen(false);
    setIsCartFormOpen(false);
    setIsOrderFormOpen(false);

    setIsFarmFormOpen(true);
    setClickedFarmId(farmId);
  }

  return (
    <Context.Provider value={{ 
      token, 
      setToken, 
      clearToken, 
      userId, 
      setUserId, 
      clearUserId, 
      accountType, 
      setAccountType, 
      clickedFarmId, 
      setClickedFarmId,
      clickedShopId,
      setClickedShopId,
      isShopClicked,
      setIsShopClicked,
      isDeliveryListOpen, 
      setIsDeliveryListOpen,
      isFarmFormOpen, 
      setIsFarmFormOpen,
      isShopFormOpen,
      setIsShopFormOpen,
      isCartFormOpen, 
      setIsCartFormOpen,
      isOrderFormOpen,
      setIsOrderFormOpen,
      productFarmClick
    }}>
      {children}
    </Context.Provider>
  );
};
