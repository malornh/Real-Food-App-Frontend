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
  const [accountType, setAccountTypeState] = useState(1);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('jwtToken', newToken);
  };

  const clearToken = () => {
    setTokenState(null);
    localStorage.removeItem('jwtToken');
  };

  const setUserId = (newUserId: string) => {
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  const clearUserId = () => {
    setUserIdState(null);
    localStorage.removeItem('userId')
  }

  const setAccountType = (newAccountType: number) => {
    setAccountTypeState(newAccountType);
    localStorage.setItem('accountType', String(newAccountType));
  }

  return (
    <Context.Provider value={{ token, setToken, clearToken, userId, setUserId, clearUserId, accountType, setAccountType }}>
      {children}
    </Context.Provider>
  );
};