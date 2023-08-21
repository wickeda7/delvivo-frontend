import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormRow from '../FormRow';
import { API } from '../../utils/constants';
import { getStoreAddress, merchantInfo } from '../../utils/merchantInfo';
import { formatPrice } from '../../utils/helpers';
import { useCartContext } from '../../context/cart_context';

const initialState = {
  address: '',
  city: '',
  state: 'CA',
  zipcode: '',
};
const mapRes = {
  destination: '',
  origin: '',
  distance: '',
  duration: '',
};
const DeliveryInfo = () => {
  const [values, setValues] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [mapGoogle, setMapGoogle] = useState(mapRes);
  const [error, setError] = useState('');

  const { orderTypes } = merchantInfo();
  const storeAddress = getStoreAddress();
  const { total_amount, updateShippingInfo, paidInfo } = useCartContext();
  let errorText =
    total_amount < orderTypes.delivery.minOrderAmount ? 'amount' : '';

  if (paidInfo) {
    errorText = '';
  }
  useEffect(() => {
    setError(errorText);
  }, [errorText]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { address, city, state, zipcode } = values;
    if (!address || !city || !state || !zipcode) {
      toast.error('Please fill out all fields');
      return;
    }

    const addresses = {
      origins: `${storeAddress.address}, ${storeAddress.city}, ${storeAddress.state}, ${storeAddress.zip}`,
      destinations: `${address}, ${city}, ${state}, ${zipcode}`,
    };
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/clover/map`, addresses, {
        headers: headers,
      });
      const res = response.data.data;
      const tempRange = res.rows[0].elements[0].distance.text.split(' ');
      const range = tempRange[1] === 'ft' ? 1 : tempRange[0];

      if (orderTypes.delivery.maxRadius < range) {
        setError('radius');
      } else {
        setError('');
      }
      updateShippingInfo('delivery', {
        origin: res.origin_addresses[0],
        destination: res.destination_addresses[0],
        distance: res.rows[0].elements[0].distance.text,
        duration: res.rows[0].elements[0].duration.text,
        range: range,
      });
      setMapGoogle({
        origin: res.origin_addresses[0],
        destination: res.destination_addresses[0],
        distance: res.rows[0].elements[0].distance.text,
        duration: res.rows[0].elements[0].duration.text,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };
  return (
    <Wrapper>
      <p>Please enter address for delivery:</p>
      <form onSubmit={onSubmit}>
        <FormRow
          type='text'
          name='address'
          value={values.address}
          handleChange={handleChange}
          disabled={error === 'amount'}
        />
        <FormRow
          type='text'
          name='city'
          value={values.city}
          handleChange={handleChange}
          disabled={error === 'amount'}
        />
        <FormRow
          type='text'
          name='state'
          value={values.state}
          handleChange={handleChange}
          max='2'
          disabled={error === 'amount'}
        />
        <FormRow
          type='text'
          name='zipcode'
          value={values.zipcode}
          handleChange={handleChange}
          disabled={error === 'amount'}
        />
      </form>
      <em className={error == 'amount' ? 'error' : ''}>
        Minimum order {formatPrice(orderTypes.delivery.minOrderAmount)}
      </em>
      <em className={error == 'radius' ? 'error' : ''}>
        Delivery radius: {orderTypes.delivery.maxRadius} miles
      </em>
      <button
        type='submit'
        className='btn btn-block'
        onClick={onSubmit}
        disabled={isLoading}
      >
        Submit
      </button>
      {mapGoogle.distance && (
        <section>
          <p>Delivery Info:</p>
          <b>From: </b> {mapGoogle.origin} <b> To: </b> {mapGoogle.destination}
          <br />
          <b>Distance: </b> {mapGoogle.distance} <br></br>
          <b> Duration: </b> {mapGoogle.duration}
        </section>
      )}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin-top: 2rem;
  p {
    font-weight: bold;
  }
  form {
    display: grid;
    grid-template-columns: 2fr 1fr 50px 100px;
    grid-gap: 1rem;
  }
  .btn-block {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    margin-right: 0;
  }
  em {
    font-size: 0.7rem;
    margin-right: 1rem;
  }
  .error {
    color: var(--clr-red-dark);
  }
`;
export default DeliveryInfo;
