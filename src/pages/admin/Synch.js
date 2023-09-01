import React, { useState } from 'react';
import styled from 'styled-components';
import { Spin, Alert, DatePicker, Space } from 'antd';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';
import { FormRow } from '../../components';
import { apiUser } from '../../api/apiUser';
import { apiOrders } from '../../api/apiOrders';
const { RangePicker } = DatePicker;

const initialState = { from: '', to: '' };
const Synch = () => {
  const [clover, setClover] = useState(null);
  const [orders, setOrders] = useState(initialState);
  const [isLoading, setIsLoading] = useState('');
  const [error, setError] = useState({});
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 24, color: '#eaded7' }} spin />
  );

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'clover') {
      setClover(value);
    }
  };
  const handleClover = async () => {
    setIsLoading('customer');
    try {
      const res = await apiUser.getUser(clover);
      if (res) {
        toast.success(`Clover Id ${res.data.cloverId} is already synched`);
        setIsLoading(false);
        setClover('');
      }
    } catch (error) {
      const { response } = error;
      if (response) {
        setError({ customer: true, message: response.data.error.message });
        setIsLoading(false);
        return;
      }
    }
  };
  const onCalendarChange = (dates, dateStrings) => {
    setOrders({ ...orders, from: dateStrings[0], to: dateStrings[1] });
  };
  const onOpenChange = (open) => {
    setError(null);
  };
  const handleOrders = async () => {
    const { from, to } = orders;
    if (!from || !to) {
      setError({ orders: true, message: 'Please select date range' });
      return;
    }
    //setIsLoading('orders');
    try {
      const res = await apiOrders.getOrders(orders);
      console.log(res);
    } catch (error) {}
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (clover) {
      handleClover();
    } else {
      handleOrders();
    }
  };
  return (
    <Wrapper>
      <div className='section-center container'>
        <div>
          <form className='form'>
            <h3>Customers</h3>
            {error?.customer && (
              <Alert variant='danger' type='error' message={error.message} />
            )}
            <FormRow
              type='text'
              name='clover'
              labelText={'Clover Customer Id'}
              value={clover ? clover : null}
              handleChange={handleChange}
            />
            <button
              type='submit'
              className='btn btn-block'
              disabled={isLoading === 'customer'}
              onClick={onSubmit}
            >
              <span>Synch Customer </span>
              {isLoading === 'customer' ? <Spin indicator={antIcon} /> : ''}
            </button>
          </form>
        </div>
        <div>
          <form className='form'>
            <h3>Orders</h3>
            {error?.orders && (
              <Alert variant='danger' type='error' message={error.message} />
            )}
            <div className='ordersLabel'>Select Date Range</div>
            <Space direction='vertical' size={12}>
              <RangePicker
                //onCalendarChange={onCalendarChange}
                onOpenChange={onOpenChange}
                onChange={onCalendarChange}
              />
            </Space>

            <button
              type='submit'
              className='btn btn-block marginTop'
              disabled={isLoading === 'oders'}
              onClick={onSubmit}
            >
              <span>Synch Orders </span>
              {isLoading === 'orders' ? <Spin indicator={antIcon} /> : ''}
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
    grid-template-columns: 2fr 1fr;
    padding: 1.5rem;
  }
  .ordersLabel {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
  .form {
    border-top: 8px solid var(--clr-primary-5);
    background: var(--clr-white);
    min-height: 28vh;
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

export default Synch;
