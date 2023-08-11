import React from 'react';
import styled from 'styled-components';
import { useCartContext } from '../context/cart_context';
import { Link } from 'react-router-dom';
import { CartContent, PageHero } from '../components';
import CartTotals from '../components/CartTotals';
import CloverCheckout from '../components/CloverCheckout';

const CartPage = () => {
  const { cart } = useCartContext();
  if (cart.length < 1) {
    return (
      <Wrapper className='page-100'>
        <div className='empty'>
          <h2>Your cart is empty</h2>
          <Link to='/products' className='btn'>
            fill it
          </Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <main>
      <PageHero title='cart' />
      <Wrapper className='page'>
        <CartContent></CartContent>
        <section>
          <CloverCheckout />
          <CartTotals />
        </section>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.main`
  display: grid;
  grid-template-columns: 2fr 1fr;
  .cart-page {
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
