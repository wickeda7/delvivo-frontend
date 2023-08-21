import React from 'react';
import styled from 'styled-components';
import ShippingButton from './ShippingButton';
import { useCartContext } from '../../context/cart_context';
import PickupInfo from './PickupInfo';
import DeliveryInfo from './DeliveryInfo';

const ShippingMethods = ({ user, loginWithRedirect }) => {
  let method = [];
  const { shipping_info } = useCartContext();
  console.log('shipping_info', shipping_info);
  if (shipping_info.orderType) {
    method = Object.keys(shipping_info.orderType);
  }
  return (
    <Wrapper>
      <article>
        <h4>Shipping Methods</h4>
        {user ? (
          <>
            <ShippingButton />
            {method[0] === 'delivery' && <DeliveryInfo />}
            {method[0] === 'pickup' && <PickupInfo />}
          </>
        ) : (
          <p>
            Please{' '}
            <button
              type='button'
              className='member-btn'
              onClick={loginWithRedirect}
            >
              Log In
            </button>{' '}
            for delivery or pickuo.
          </p>
        )}
      </article>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  article {
    border: 1px solid var(--clr-grey-8);
    border-radius: var(--radius);
    padding: 1.5rem 3rem;
  }

  h4 {
    display: inline-block;
    margin-right: 1.5rem;
  }

  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--clr-primary-5);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
`;
export default ShippingMethods;
