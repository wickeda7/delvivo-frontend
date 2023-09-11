import React from 'react';
import styled from 'styled-components';
import { Table, Tag } from 'antd';
import { useGetOrdersData, useUpdateOrder } from '../../../hooks/useOrders';
import { EditableCell, EditableRow } from '../context/editable_context';
import dayjs from 'dayjs';
import { formatPrice } from '../../../utils/helpers';

const OrderTable = ({ setOrder }) => {
  const data = useGetOrdersData();
  const mutation = useUpdateOrder();
  const defaultColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      width: 100,
      key: 'orderId',
      // render: (text) => < dangerouslySetInnerHTML={{ __html: text }} />,
      render: (_, { orderId, orderContent }) => (
        <>
          {orderId}
          <br /> <b>{formatPrice(orderContent.total)}</b>
        </>
      ),
    },
    {
      title: 'Purchase Time',
      dataIndex: 'created',
      width: 100,
      key: 'created',
      //render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
      render: (_, { isPickup, created, orderContent }) => {
        const time = dayjs(created).format('h:mm A');
        if (isPickup) {
          return (
            <>
              {time}
              <br /> <b>{orderContent.note}</b>
            </>
          );
        } else {
          return (
            <>
              {time}
              <br /> <b>Delivery</b>
            </>
          );
        }
      },
    },

    {
      title: 'Driver',
      dataIndex: 'driverId',
      width: 100,
      key: 'driverId',
      editable: true,
      render: (_, { driver }) =>
        driver?.id && (
          <>
            <Tag color={'blue'} key={driver.id}>
              {driver.firstName} {driver.lastName}
            </Tag>
          </>
        ),
    },
    {
      title: 'Start Delivery / \n Ready for Pickup',
      dataIndex: 'departureTime',
      width: 100,
      editable: true,
      key: 'departureTime',
      render: (_, { departureTime }) =>
        departureTime && (
          <>
            <Tag color={'yellow'} key={departureTime}>
              {dayjs(departureTime).format('h:mm A')}
            </Tag>
          </>
        ),
    },
    {
      title: 'Delivered / \n Arrived for Pickup',
      dataIndex: 'arriveTime',
      width: 100,
      editable: true,
      key: 'arriveTime',
      render: (_, { arriveTime }) =>
        arriveTime && (
          <>
            <Tag color={'green'} key={arriveTime}>
              {dayjs(arriveTime).format('h:mm A')}
            </Tag>
          </>
        ),
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        mutation,
      }),
    };
  });
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  return (
    <Wrapper>
      <Table
        onRow={(record, index) => ({
          onClick: () => {
            setOrder(record.id);
          },
        })}
        columns={columns}
        dataSource={data}
        components={components}
        bordered
        rowClassName={() => 'editable-row'}
        pagination={false}
        scroll={{
          x: 400,
          y: 1500,
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 50%;
  padding-right: 2rem;
  .right-padding {
    padding-right: 2rem;
  }
  .container {
    padding: 1.5rem;
    display: flex;
  }
  .editable-cell-value-wrap {
    width: 100px;
    height: 30px;
  }
  tbody {
    font-size: 12px;
  }
  thead {
    font-size: 12px;
  }

  .ant-table-cell {
    padding: 0.5rem;
  }
  .arrived {
    color: green;
  }
  .start {
    color: yellow;
  }
`;
export default OrderTable;
