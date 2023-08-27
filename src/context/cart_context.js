import React, { useEffect, useContext, useReducer, useState } from 'react';
import reducer from '../reducers/cart_reducer';
import { merchantInfo } from '../utils/merchantInfo';
//import dayjs from 'dayjs';
import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  SHIPPING_INFO,
} from '../actions';

const getLocalStorage = () => {
  let cart = localStorage.getItem('cart');
  if (cart) {
    return JSON.parse(localStorage.getItem('cart'));
  } else {
    return [];
  }
};

const initialState = {
  cart: getLocalStorage(),
  total_items: 0,
  total_amount: 0,
  shipping_fee: 0,
  shipping_info: {},
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [paidInfo, setPaidInfo] = useState();
  const [tempCart, setTempCart] = useState([]);
  const merchInfo = merchantInfo();

  const updateShippingInfo = (type, info = undefined) => {
    let shipping_info = {};
    if (type) {
      if (info) {
        shipping_info = info;
        dispatch({
          type: SHIPPING_INFO,
          payload: { info: shipping_info },
        });
      } else {
        if (merchInfo.orderTypes[type]) {
          shipping_info[type] = merchInfo.orderTypes[type];
        }
        dispatch({
          type: SHIPPING_INFO,
          payload: { orderType: shipping_info },
        });
      }
    }
  };
  // add to cart
  const addToCart = (amount, product) => {
    dispatch({ type: ADD_TO_CART, payload: { amount, product } });
  };
  // remove item
  const removeItem = (id) => {
    dispatch({ type: REMOVE_CART_ITEM, payload: id });
  };
  // toggle amount
  const toggleAmount = (id, value) => {
    dispatch({
      type: TOGGLE_CART_ITEM_AMOUNT,
      payload: {
        id,
        value,
      },
    });
  };
  // clear cart
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const updatePaidInfo = (res) => {
    setPaidInfo(res);
    setTempCart(state.cart);
    clearCart();
  };
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    dispatch({ type: COUNT_CART_TOTALS });
  }, [state.cart]);
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeItem,
        toggleAmount,
        clearCart,
        updateShippingInfo,
        updatePaidInfo,
        paidInfo,
        setPaidInfo,
        tempCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
// make sure use
export const useCartContext = () => {
  return useContext(CartContext);
};
