import axios from 'axios';
import React, { useContext, useReducer } from 'react';

import reducer from '../reducers/products_reducer';
import { image_url } from '../utils/constants';

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

  const fetchSingleProduct = async (url) => {
    try {
      let img = [];
      const response = await axios.get(url);
      let output = response.data.data.attributes;
      output.id = response.data.data.id;
      img.push({ url: `${image_url}${output.picture.data.attributes.url}` });
      output.images = img;
      output.stock = 200;
      output.colors = ['#000', '#00f', '#f00'];
      output.price = output.price * 100;
      delete output.picture;
      const singleProduct = output;
    } catch (error) {}
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
