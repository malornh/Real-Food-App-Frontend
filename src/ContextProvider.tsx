import React, { createContext, useState, ReactNode, useContext } from 'react';
import { CartDto } from './components/CartForm.tsx/CartForm';
import { OrderItem } from './components/OrderList/OrderList';
import { ShopData } from './components/ShopForm/ShopForm';

interface ContextProps {
  token: string | null;
  setToken: (token: string) => void;
  resetToken: string | null;
  setResetToken: (resetToken: string | null) => void;
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
  isAccountFormOpen: boolean;
  setIsAccountFormOpen: (b: boolean) => void;

  showCart: boolean;
  setShowCart: (b: boolean) => void;

  showOrder: boolean;
  setShowOrder: (b: boolean) => void;

  showDelivery: boolean;
  setShowDelivery: (b: boolean) => void;

  productFarmClick: (farmId: number) => void;
  accountButtonClick: (newLoginId: number | undefined) => void;

  handleFarmClick: (id : number | undefined) => void;
  handleShopClick: (id : number | undefined) => void;
  handleCartShopClick: (productId: number, shopId: number | undefined) => void;
  handleDeliveryShopClick: (id : number | undefined) => void;

  inLoginSelection: boolean;
  setInLoginSelection: (b: boolean) => void;
  loginId: number | undefined;
  setLoginId: (id: number | undefined) => void;

  cartItems: CartDto[];
  setCartItems: (cartItems: CartDto[]) => void;

  orderList: OrderItem[];
  setOrderList: (orderItems: OrderItem[]) => void;

  shopData: ShopData;
  setShopData: (data: ShopData) => void;

  isForgotPasswordOpen: boolean;
  setIsForgotPasswordOpen: (b: boolean) => void;
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
  const [resetToken, setResetTokenState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [accountType, setAccountTypeState] = useState(1); // 1 
  const [clickedFarmId, setClickedFarmIdState] = useState<number | undefined>(undefined);
  const [clickedShopId, setClickedShopIdState] = useState<number | undefined>(undefined);
  const [isShopClicked, setIsShopClickedState] = useState<boolean>(true); // False if a farm is clicked
  const [inLoginSelection, setInLoginSelectionState] = useState<boolean>(false);
  const [loginId, setLoginIdState] = useState<number | undefined>(undefined);
  const [isForgotPasswordOpen, setIsForgotPasswordOpenState] = useState<boolean>(false);

  // New state variables
  const [isDeliveryListOpen, setIsDeliveryListOpenState] = useState<boolean>(false);
  const [isFarmFormOpen, setIsFarmFormOpenState] = useState<boolean>(false);
  const [isShopFormOpen, setIsShopFormOpenState] = useState<boolean>(false);
  const [isCartFormOpen, setIsCartFormOpenState] = useState<boolean>(false);
  const [isOrderFormOpen, setIsOrderFormOpenState] = useState<boolean>(false);
  const [isAccountFormOpen, setIsAccountFormOpenState] = useState<boolean>(false);

  const [cartItems, setCartItemsState] = useState<CartDto[]>([]);
  const [orderList, setOrderListState] = useState<OrderItem[]>([]);
  const defaultShopData: ShopData = {
    id: 0,                        
    userId: '',                 
    name: '',                    
    photoFile: null,             
    photoId: undefined,             
    description: '',              
    latitude: 0,                  
    longitude: 0,            
    rating: 0,                   
    orders: []                      
  };
  const [shopData, setShopDataState] = useState<ShopData>(defaultShopData);

  const [showCart, setShowCartState] = useState<boolean>(true);
  const [showDelivery, setShowDeliveryState] = useState<boolean>(true);
  const [showOrder, setShowOrderState] = useState<boolean>(true);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('jwtToken', newToken);
  };

  const clearToken = () => {
    setTokenState(null);
    localStorage.removeItem('jwtToken');
  };

  const setResetToken = (newResetToken: string | null) => {
    setResetTokenState(newResetToken);
    if(newResetToken !== null)
    {
      localStorage.setItem('resetToken', newResetToken);
    }else
    {
      localStorage.setItem('resetToken', '');
    }
  }

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

  const setInLoginSelection = (b: boolean) => {
    setInLoginSelectionState(b);
    localStorage.setItem('inLoginSelection', String(b));
  };

  const setLoginId = (id: number | undefined) => {
    setLoginIdState(id);
    localStorage.setItem('loginId', String(id));
  };

  const setIsAccountFormOpen = (b: boolean) => {
    setIsAccountFormOpenState(b);
    localStorage.setItem('isAccountFormOpen', String(b));
  }


  const setShowCart = (b: boolean) => {
    setShowCartState(b);
    localStorage.setItem('showCart', String(b));
  }
  const setShowOrder = (b: boolean) => {
    setShowOrderState(b);
    localStorage.setItem('showOrder', String(b));
  }
  const setShowDelivery = (b: boolean) => {
    setShowDeliveryState(b);
    localStorage.setItem('showDelivery', String(b));
  }


  const productFarmClick = (farmId: number) => {
    setIsDeliveryListOpen(false);
    setIsCartFormOpen(false);
    setIsOrderFormOpen(false);

    setIsFarmFormOpen(true);
    setClickedFarmId(farmId);
  }

  const accountButtonClick = (newLoginId: number | undefined) => {
    setLoginId(newLoginId);
    if(inLoginSelection)
    {
      setClickedShopId(undefined);
    }
  }

  const handleDeliveryShopClick = (id : number | undefined) => {
    setClickedFarmId(undefined);
    setClickedShopId(id);
    setIsShopClicked(true);
    setIsShopFormOpen(true);
    setIsAccountFormOpen(true);
  }

  const handleShopClick = (id : number | undefined) => {
    setClickedFarmId(undefined);
    setClickedShopId(id);
    setIsShopClicked(true);
    setIsShopFormOpen(true);
    setIsDeliveryListOpen(false);
    setIsAccountFormOpen(true);
    setIsOrderFormOpen(false);
  }

  const handleFarmClick = (id : number | undefined) => {
    setIsAccountFormOpen(false);
    setClickedFarmId(id);
    setClickedShopId(undefined);
    setIsShopClicked(false);
    setIsFarmFormOpen(true);
    setIsShopFormOpen(false);
    setIsDeliveryListOpen(false);
    setIsOrderFormOpen(false);
    setShowOrder(true)
  }

  const handleCartShopClick = (productId: number, shopId: number | undefined) => {
    handleShopClick(shopId);
  }

  const setCartItems = (cartItems: CartDto[]) => {
    setCartItemsState(cartItems);
    localStorage.setItem('cartItems', String(...cartItems));
  }

  const setOrderList = (orderItems: OrderItem[]) => {
    setOrderListState(orderItems);
    localStorage.setItem('orderList', String(...orderItems));
  }

  const setShopData = (data: ShopData) => {
    setShopDataState(data);
    localStorage.setItem('orderList', String(data));
  }

  const setIsForgotPasswordOpen = (b: boolean) => {
    setIsForgotPasswordOpenState(b);
    localStorage.setItem('isForgotPasswordOpen', String(b));
  }

  return (
    <Context.Provider value={{ 
      token, 
      setToken, 
      clearToken, 
      resetToken,
      setResetToken,
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
      productFarmClick,
      inLoginSelection,
      setInLoginSelection,
      loginId,
      setLoginId,
      accountButtonClick,
      isAccountFormOpen,
      setIsAccountFormOpen,
      handleFarmClick,
      handleShopClick,
      handleCartShopClick,
      cartItems,
      setCartItems,
      showCart,
      setShowCart,
      showOrder,
      setShowOrder,
      showDelivery,
      setShowDelivery,
      handleDeliveryShopClick,
      orderList,
      setOrderList,
      shopData,
      setShopData,
      isForgotPasswordOpen,
      setIsForgotPasswordOpen,
    }}>
      {children}
    </Context.Provider>
  );
};
