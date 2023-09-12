import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMapPin } from 'react-icons/fi';
import {
  useGetOrdersData,
  useUpdateOrder,
  useSendEmail,
} from '../../../hooks/useOrders';
import { Button } from 'antd';
import dayjs from 'dayjs';
import TimePickers from './TimePicker';
import Selects from './Selects';
import LineItems from './LineItems';
import { toast } from 'react-toastify';

const OrderDetail = ({ orderDetail }) => {
  const data = useGetOrdersData();
  const mutation = useUpdateOrder();
  const { mutate: sendEmail } = useSendEmail();
  const [loadings, setLoadings] = useState(false);
  const [disable, setDisable] = useState(true);
  const [text, setText] = useState('Notify Customer');
  const order = orderDetail ? orderDetail : data[0];
  useEffect(() => {
    console.log(order);
    if (
      order.notifiedDate == null &&
      order.driver &&
      order.departureTime &&
      !order.isPickup
    ) {
      setDisable(false);
      setText('Notify Customer');
    } else if (
      order.notifiedDate == null &&
      order.isPickup &&
      order.departureTime
    ) {
      setDisable(false);
      setText('Notify Customer');
    } else if (order.notifiedDate) {
      setDisable(true);
      setText(
        'Notified Customer on ' +
          dayjs(order.notifiedDate).format('MM/DD/YYYY h:mm A')
      );
    } else {
      setDisable(true);
      setText('Notify Customer');
    }
  }, [order]);
  if (!order) return <h4>No Order Selected</h4>;
  const startText = order.isPickup ? 'Items Ready' : 'Start Delivery';
  const endText = order.isPickup ? 'Items Picked Up' : 'End Delivery';

  const note = order.orderContent.createdOrders.note.split(':');
  const handleMap = () => {
    console.log('map');
  };
  const emailCustomer = () => {
    setLoadings(true);
    setText('Sending...');
    sendEmail(order, {
      onSuccess: (data) => {
        setLoadings(false);
        setDisable(true);
        console.log(dayjs(data.notifiedDate).format('MM/DD/YYYY h:mm A'));
        setText(
          'Notified Customer on ' +
            dayjs(data.notifiedDate).format('MM/DD/YYYY h:mm A')
        );
      },
    });
  };
  const onChangeDriver = (val) => {
    const data = { driverId: val.toString() };
    const connect = { id: val };
    data.driver = connect;
    mutation.mutate(
      { record: order, data },
      {
        onSuccess: (data) => {
          setDisable(false);
          toast.success(
            `Please notify the customer that the driver is on the way.`
          );
        },
      }
    );
  };
  const onChangeStart = (time) => {
    try {
      const data = { departureTime: dayjs(time).valueOf() };
      mutation.mutate(
        { record: order, data },
        {
          onSuccess: (data) => {
            if (order.isPickup) {
              setDisable(false);
              toast.success(
                `Please notify the customer that the order is ready.`
              );
            }
          },
        }
      );
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
            Date:{' '}
            {dayjs(order.orderContent.createdOrders.createdTime).format(
              'MM/DD/YYYY h:mm A'
            )}{' '}
            <br />
            Order Type: {order.orderContent.createdOrders.orderType.label}{' '}
            <br />
          </div>
          <div>
            Customer: {`${order.user.firstName} ${order.user.lastName}`} <br />
            Email: {order.user.email} <br />
            Phone: {order.user.phoneNumber} <br />
          </div>
          <div>
            <p>
              Total Items:{' '}
              {order.orderContent.createdOrders.lineItems.elements.length}
            </p>
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
        <div className='container-order2'>
          {!order.isPickup ? (
            <>
              <div>
                <address>
                  {' '}
                  {order.orderContent.createdOrders.note}
                  <a onClick={handleMap}>
                    {' '}
                    <FiMapPin />{' '}
                  </a>
                </address>
              </div>
              <div>
                Driver:{' '}
                <Selects driver={order.driver} onChange={onChangeDriver} />
              </div>
            </>
          ) : (
            <div>
              <b>{order.orderContent.createdOrders.note}</b>
            </div>
          )}
        </div>
        <div className='container-tableheader'>
          <div>Line Items</div>
          <div style={{ textAlign: 'right' }}>
            <Button
              type='primary'
              loading={loadings}
              onClick={() => emailCustomer()}
              disabled={disable}
            >
              {text}
            </Button>
          </div>
        </div>
        <div className='container-order1'>
          <LineItems
            lineItems={order.orderContent.createdOrders.lineItems.elements}
            itemContent={order.itemContent}
          />
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
  .container-tableheader {
    display: grid;
    grid-template-columns: 1fr 1fr;
  },
  .container-order {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.4rem;
    padding: 1rem 0;
    font-size: 13px;
  }
  .container-order2 {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 0.4rem;
    font-size: 13px;
    margin-bottom: 0.8rem;
  }
  .container-order1{
    padding: 1rem 0;
    font-size: 13px;
  }
  a {
    pointer: cursor;
  }
  p {
    margin-bottom: 0.5rem;
  }
  .
`;
export default OrderDetail;
