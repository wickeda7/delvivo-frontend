import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useCartContext } from '../context/cart_context';
import { Link } from 'react-router-dom';
import { ShippingMethods, CartContent, PageHero } from '../components';
import { CartTotals, CloverCheckout, PaidInfo } from '../components/cart';
import { useModalContext } from '../context/modal_context';
import { useUserContext } from '../context/user_context';
import { setStoreAddress } from '../utils/merchantInfo';

const CartPage = () => {
  const { cart, paidInfo, tempCart, setPaidInfo } = useCartContext();
  const { user } = useUserContext();
  const { loginWithRedirect } = useModalContext();
  let cartItems = cart;
  if (cartItems.length === 0) {
    cartItems = tempCart;
  }
  console.log(user);
  useEffect(() => {
    setStoreAddress();
    setPaidInfo('');
  }, []);
  return (
    <main>
      <PageHero title='cart' />
      <Wrapper className='page-100'>
        {cartItems.length < 1 ? (
          <div className='empty'>
            <h2>Your cart is empty</h2>
            <Link to='/products' className='btn'>
              fill it
            </Link>
          </div>
        ) : (
          <>
            <section className='right-padding'>
              <ShippingMethods
                user={user}
                loginWithRedirect={loginWithRedirect}
              />
              <CartContent />
            </section>
            <section>
              {paidInfo && <PaidInfo info={paidInfo} />}
              {user && !paidInfo && <CloverCheckout />}
              <CartTotals user={user} loginWithRedirect={loginWithRedirect} />
            </section>
          </>
        )}
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.main`
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 1.5rem;
  .right-padding {
    padding-right: 2rem;
  }
  .empty {
    text-align: center;
    h2 {
      margin-bottom: 1rem;
      text-transform: none;
    }
  }
`;

export default CartPage;
