import React from 'react';
import styled from 'styled-components';
import ShippingButton from './ShippingButton';
import { useCartContext } from '../../context/cart_context';
const ShippingMethods = () => {
  const { shipping_method } = useCartContext();

  return (
    <Wrapper>
      <article>
        <h4>Shipping Methods</h4>
        <ShippingButton />
        {shipping_method === 'delivery' && <p>Delivery!!!</p>}
        {shipping_method === 'pickup' && <p>Pickup!!!!</p>}
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
  .link-container {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }
  .link-btn {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    padding: 0.25rem 0.5rem;
    background: var(--clr-primary-5);
    color: var(--clr-white);
    border-radius: var(--radius);
    letter-spacing: var(--spacing);
    font-weight: 400;
    cursor: pointer;
  }
  .clear-btn {
    background: var(--clr-black);
  }
`;
export default ShippingMethods;
