import React from 'react';
import styled from 'styled-components';
import { TimePicker, Switch, Select } from 'antd';
import { useGetOrdersData, useUpdateOrder } from '../../../hooks/useOrders';
import dayjs from 'dayjs';
import TimePickers from './TimePicker';

const OrderDetail = ({ orderDetail }) => {
  const data = useGetOrdersData();
  const mutation = useUpdateOrder();
  const order = orderDetail ? orderDetail : data[0];
  const startText = order.isPickup ? 'Items Ready' : 'Start Delivery';
  const endText = order.isPickup ? 'Items Picked Up' : 'End Delivery';
  const onChangeStart = (time) => {
    try {
      const data = { departureTime: dayjs(time).valueOf() };
      mutation.mutate({ record: order, data });
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeEnd = (time) => {
    try {
      const data = { arriveTime: dayjs(time).valueOf() };
      mutation.mutate({ record: order, data });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Wrapper>
      <section>
        Order Details
        <div className='container-order'>
          <div>
            Order ID: {order.orderId} <br />
            Date: {dayjs(order.createdAt).format('MM/DD/YYYY h:mm A')} <br />
            Order Type: {order.orderContent.orderType.label} <br />
            Status: {order.orderContent.paymentState} <br />
          </div>
          <div>
            Customer: {`${order.user.firstName} ${order.user.lastName}`} <br />
            Email: {order.user.email} <br />
            Phone: {order.user.phoneNumber} <br />
          </div>
          <div>
            <p>Total Items: {order.orderContent.lineItems.elements.length}</p>
            <p>
              {startText}:{' '}
              <TimePickers
                type='departureTime'
                time={order.departureTime}
                onChange={onChangeStart}
              />
            </p>
            <p>
              {endText}:{' '}
              <TimePickers
                type='arriveTime'
                time={order.arriveTime}
                onChange={onChangeEnd}
              />
            </p>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 50%;
  section {
    border-top: 8px solid var(--clr-primary-5);
    background: var(--clr-white);
    width: 100%;
    max-width: 100%;
    padding: 1rem;
    border-radius: var(--borderRadius);
    box-shadow: var(--shadow-2);
    transition: var(--transition);
  }
  .container-order {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.4rem;
    padding: 1rem 0;
    font-size: 13px;
  }
  p {
    margin-bottom: 0.5rem;
  }
`;
export default OrderDetail;
