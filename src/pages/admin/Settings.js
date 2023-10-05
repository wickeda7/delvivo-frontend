import React, { useState } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import { toast } from 'react-toastify';
import { merchantInfo } from '../../utils/merchantInfo';
import { FormRow } from '../../components';
import { LoadingOutlined } from '@ant-design/icons';
import { apiMerchant } from '../../api/apiMerchant';
import { setStorage } from '../../utils/helpers';
import { CLOVER } from '../../utils/constants';

export const Settings = () => {
  const info = merchantInfo();

  const delivery = info?.orderTypes ? info.orderTypes.delivery : {};
  const addr = info?.address ? info.address : {};
  const notify_email = info?.notify_email ? info.notify_email : '';
  delivery.minOrderAmount = delivery.minOrderAmount
    ? parseFloat(delivery.minOrderAmount / 100).toFixed(2)
    : '';
  delivery.fee = delivery.fee ? parseFloat(delivery.fee / 100).toFixed(2) : '';
  const [values, setValues] = useState(delivery);
  const [email, setEmail] = useState(notify_email);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [address, setAddress] = useState(addr);
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 24, color: '#eaded7' }} spin />
  );
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'email') {
      setEmail(value);
    } else {
      setValues({ ...values, [name]: value });
    }
  };
  const onGetAddress = async (e) => {
    e.preventDefault();
    setIsLoadingAd(true);
    const res = await apiMerchant.getAddress1(info);
    setIsLoadingAd(false);
    setAddress(res);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiMerchant.putMerchant({ info, values, email });
      if (res.data) {
        toast.success('Settings updated');
        setIsLoading(false);
        setStorage(CLOVER, JSON.stringify(res.data));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <div className='section-center container'>
        <div>
          <form className='form'>
            <h3>Settings</h3>
            <FormRow
              type='text'
              name='email'
              labelText={'Notification Email'}
              value={email}
              handleChange={handleChange}
            />
            <FormRow
              type='text'
              name='maxRadius'
              labelText={'Delivery Radius'}
              value={values.maxRadius}
              handleChange={handleChange}
              optClass='inputWidth'
              max={3}
            />
            <FormRow
              type='text'
              name='minOrderAmount'
              labelText={'Minimum Order Amount'}
              value={values.minOrderAmount}
              handleChange={handleChange}
              optClass='inputWidth'
            />
            <FormRow
              type='text'
              name='fee'
              labelText={'Fee'}
              value={values.fee}
              handleChange={handleChange}
              optClass='inputWidth'
            />
            <button
              type='submit'
              className='btn btn-block marginTop'
              disabled={isLoading}
              onClick={onSubmit}
            >
              <span>Submit </span>
              {isLoading ? <Spin indicator={antIcon} /> : ''}
            </button>
          </form>
        </div>
        <div>
          <form className='form'>
            <h3>Address</h3>
            <FormRow
              type='text'
              name='address'
              value={address.address1}
              // handleChange={handleChange}
              disabled={true}
            />
            <FormRow
              type='text'
              name='city'
              value={address.city}
              // handleChange={handleChange}
              disabled={true}
            />
            <div className='container2'>
              <FormRow
                type='text'
                name='state'
                value={address.state}
                //handleChange={handleChange}
                optClass='inputWidth'
                disabled={true}
              />
              <FormRow
                type='text'
                name='zip'
                value={address.zip}
                // handleChange={handleChange}
                optClass='inputWidth'
                disabled={true}
              />
            </div>
            <div className='container2'>
              <FormRow
                type='text'
                name='latitute'
                value={address.lat}
                // handleChange={handleChange}
                optClass='inputWidth'
                disabled={true}
              />
              <FormRow
                type='text'
                name='longitude'
                value={address.lng}
                // handleChange={handleChange}
                optClass='inputWidth'
                disabled={true}
              />
            </div>
            <button
              type='submit'
              className='btn btn-block marginTop'
              disabled={isLoadingAd}
              onClick={onGetAddress}
            >
              <span>Synch </span>
              {isLoadingAd ? <Spin indicator={antIcon} /> : ''}
            </button>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: block;

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 1.5rem;
  }
  .container2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .ordersLabel {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
  .form {
    border-top: 8px solid var(--clr-primary-5);
    background: var(--clr-white);
    min-height: 58vh;
  }
  .inputWidth {
    width: 170px;
  }
  .marginTop {
    margin-top: 1rem;
  }
  h3 {
    font-size: 1rem;
  }
  .form-label {
    font-size: 0.8rem;
  }
  span {
    margin-right: 1rem;
  }
`;
