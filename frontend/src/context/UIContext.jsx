import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 4000);
  };

  const closeToast = () => setToast(null);

  return (
    <UIContext.Provider
      value={{
        isAiOpen,
        setIsAiOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCartOpen,
        setIsCartOpen,
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
