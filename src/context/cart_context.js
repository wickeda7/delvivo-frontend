import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/cart_reducer';
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

  // needs to get business address from Clover API
  const storeAddress = {
    address: '8227 Bleeker Ave',
    city: 'Rosemead',
    state: 'CA',
    zip: '91770',
  };
  const updateShippingInfo = (isDelivery, isPickup, shipping_info) => {
    console.log('context', isDelivery, isPickup, shipping_info);
    let shipping_method = undefined;
    if (isDelivery) {
      shipping_method = 'delivery';
    }
    if (isPickup) {
      shipping_method = 'pickup';
    }
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
