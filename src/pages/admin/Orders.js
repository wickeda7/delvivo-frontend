import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import OrderDetail from './components/OrderDetail';
import OrderTable from './components/OrderTable';
import { Loading } from '../../components';
import updateOrderRow, { useGetOrders } from '../../hooks/useOrders';
import { useGetDrivers } from '../../hooks/useDrivers';
import socket from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { apiOrders } from '../../api/apiOrders';

const REACT_APP_STRAPI_URL = process.env.REACT_APP_STRAPI_URL;
const REACT_APP_STRAPI_URL_PROD = process.env.REACT_APP_STRAPI_URL_PROD;

const Orders = () => {
  const { data: Orders } = useGetOrders();
  const [order, setOrder] = useState(null);
  const [orderNum, setOrderNum] = useState(0);
  const { data } = useGetDrivers();
  const queryClient = useQueryClient();
  const io = socket(REACT_APP_STRAPI_URL); //Connecting to Socket.io backend
  useEffect(() => {
    const handler = (data) => {
      updateOrderRow(data, queryClient);
      console.log('updateOrder', data);
      if (data.arrivedTime !== null) {
        apiOrders.sendEmail(data);
      }
    };

    io.on('updateOrder', handler);
    return () => {
      io.off('updateOrder', handler);
    };
  }, []);

  useEffect(() => {
    if (!Orders || Orders.length === 0) return;
    const orderId = orderNum === 0 ? Orders[0].id : orderNum;
    const order = Orders.find((order) => order.id === orderId);
    setOrder(order);
  }, [Orders, orderNum]);
  if (!Orders) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div className='container'>
        <OrderTable setOrder={setOrderNum} />
        <OrderDetail orderDetail={order} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: block;
  .right-padding {
    padding-right: 2rem;
  }
  .container {
    padding: 1.5rem;
    display: flex;
    margin: 0 auto;
  }
`;
export default Orders;
