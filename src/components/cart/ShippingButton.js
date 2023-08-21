import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineCar } from 'react-icons/ai';
import { RiShoppingBasket2Line } from 'react-icons/ri';
import { useCartContext } from '../../context/cart_context';
const ShippingButton = () => {
  const [type, setType] = useState(false);
  const { updateShippingInfo } = useCartContext();

  const onClickDelivery = () => {
    setType('delivery');
  };
  const onClickPickup = () => {
    setType('pickup');
  };
  useEffect(() => {
    updateShippingInfo(type);
  }, [type]);
  return (
    <Wrapper>
      <button
        className={type == 'delivery' ? 'active btn' : 'btn'}
        onClick={onClickDelivery}
      >
        <AiOutlineCar className='font' /> Delivery
      </button>
      <button
        className={type == 'pickup' ? 'active btn' : 'btn'}
        onClick={onClickPickup}
      >
        <RiShoppingBasket2Line className='font' /> Pickup
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: inline-block;
  button {
    margin-right: 1rem;
    padding: 0.5rem 2.5rem 0.5rem 3rem;
    position: relative;
  }
  button.active {
    color: var(--clr-primary-1);
    background: var(--clr-primary-7);
  }
  .font {
    font-size: 1.5rem;
    position: absolute;
    left: 1rem;
    bottom: 0.3rem;
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

export default ShippingButton;
