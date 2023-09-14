import React, { createContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  useEffect(() => {}, []);
  const [cartItemDetails, setCartItemDetails] = useState({});

  return (
    <GlobalContext.Provider
      value={{ cartItem: [cartItemDetails, setCartItemDetails] }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
