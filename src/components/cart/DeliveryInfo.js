import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormRow from '../FormRow';
import { API } from '../../utils/constants';
import { getStoreAddress } from '../../utils/merchantInfo';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
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

  const storeAddress = getStoreAddress();

  const onSubmit = async (e) => {
    e.preventDefault();
    const { address, city, state, zipcode } = values;
    if (!address || !city || !state || !zipcode) {
      toast.error('Please fill out all fields');
      return;
    }
    setIsLoading(true);
    const addresses = {
      origins: `${storeAddress.address}, ${storeAddress.city}, ${storeAddress.state}, ${storeAddress.zip}`,
      destinations: `${address}, ${city}, ${state}, ${zipcode}`,
    };
    const data = addresses;
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    };
    try {
      const response = await axios.post(`${API}/clover/map`, addresses, {
        headers: headers,
      });
      const res = response.data.data;
      setMapGoogle({
        origin: res.origin_addresses[0],
        destination: res.destination_addresses[0],
        distance: res.rows[0].elements[0].distance.text,
        duration: res.rows[0].elements[0].duration.text,
      });
      console.log(
        'response',
        res.origin_addresses[0],
        res.destination_addresses[0]
      );
      console.log('mapGoogle', res.rows[0].elements[0].distance.text);
    } catch (error) {}
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
        />
        <FormRow
          type='text'
          name='city'
          value={values.city}
          handleChange={handleChange}
        />
        <FormRow
          type='text'
          name='state'
          value={values.state}
          handleChange={handleChange}
          max='2'
        />
        <FormRow
          type='text'
          name='zipcode'
          value={values.zipcode}
          handleChange={handleChange}
        />
      </form>
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
`;
export default DeliveryInfo;
