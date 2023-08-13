import React, { useContext, useReducer } from 'react';
import reducer from '../reducers/products_reducer';
import { SIDEBAR_OPEN, SIDEBAR_CLOSE } from '../actions';

const initialState = {
  isSidebarOpen: false,
  featured_products: [],
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => {
    //// update this to different reducer
    dispatch({ type: SIDEBAR_OPEN });
  };
  const closeSidebar = () => {
    //// update this to different reducer
    dispatch({ type: SIDEBAR_CLOSE });
  };

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext);
};
