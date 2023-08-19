import React, { useEffect, useContext, useReducer, useState } from 'react';
import reducer from '../reducers/cart_reducer';
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
  shipping_fee: 534,
  shipping_method: undefined,
  shipping_info: {},
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [paidInfo, setPaidInfo] = useState();
  const [tempCart, setTempCart] = useState([]);

  const updateShippingInfo = (isDelivery, isPickup, info) => {
    // console.log('context', isDelivery, isPickup, shipping_info);
    let shipping_info = {};
    let shipping_method = undefined;
    if (isDelivery) {
      shipping_method = 'delivery';
    }
    if (isPickup) {
      shipping_method = 'pickup';
    }
    if (shipping_info) {
      shipping_info[shipping_method] = info;
    }
    // console.log('context', info);
    // console.log(
    //   'context2',
    //   shipping_method,
    //   dayjs.unix(shipping_info).format('h:mm A')
    // );
    // @todo: need to save this info to the database
    dispatch({
      type: SHIPPING_INFO,
      payload: { shipping_method, shipping_info },
    });
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
