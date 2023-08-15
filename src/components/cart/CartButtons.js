import React from 'react';
import { FaShoppingCart, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useProductsContext } from '../../context/products_context';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';
import { useModalContext } from '../../context/modal_context';
import { getStorage } from '../../utils/helpers';
import { CLOVER } from '../../utils/constants';

const CartButton = () => {
  const { closeSidebar } = useProductsContext();
  const { total_items, clearCart } = useCartContext();
  const { user, logout, loginClover, clover } = useUserContext();
  const { loginWithRedirect, closeModal } = useModalContext();
  console.log('cart button');
  const { access_token, isCloverLoading } = clover;
  let clover_access_token = access_token;
  if (!clover_access_token) {
    let info = getStorage(CLOVER);
    info = JSON.parse(info);
    clover_access_token = info.access_token;
  }
  if (user) {
    closeModal();
  }
  return (
    <Wrapper className='cart-btn-wrapper'>
      <Link to='/cart' className='cart-btn' onClick={closeSidebar}>
        Cart
        <span className='cart-container'>
          <FaShoppingCart />
          <span className='cart-value'>{total_items}</span>
        </span>
      </Link>

      {user ? (
        <button
          type='button'
          className='auth-btn'
          onClick={() => {
            clearCart();
            logout();
          }}
        >
          Logout <FaUserMinus />
        </button>
      ) : (
        <button type='button' className='auth-btn' onClick={loginWithRedirect}>
          Login <FaUserPlus />
        </button>
      )}
      <button
        type='button'
        className='auth-btn last'
        onClick={loginClover}
        disabled={isCloverLoading}
      >
        {!clover_access_token && <span>Connect to </span>}
        <img src='/clover2.png' alt='' height={24} />
        {clover_access_token && <span>Connected</span>}
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;

    align-items: center;
  }
  .last {
    margin-left: 15px;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
`;
export default CartButton;
