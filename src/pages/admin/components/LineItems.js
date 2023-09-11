import React from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import { formatPrice } from '../../../utils/helpers';

const LineItems = ({ lineItems, itemContent }) => {
  //console.log(typeof itemContent); if (typeof itemContent === 'string') JSON.parse(itemContent);
  const itemParse = JSON.parse(itemContent);
  const itemContents = itemParse.elements;
  const data = lineItems.reduce((acc, item) => {
    const {
      item: { id },
      name,
      price,
      unitQty,
    } = item;
    const itemContent = itemContents.find((item) => item.id === id);
    acc.push({
      key: id,
      name,
      price,
      unitQty,
      image: itemContent.menuItem.imageFilename,
    });
    return acc;
  }, []);
  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      render: (_, { name, image }) => (
        <>
          <img src={image} alt={name} style={{ width: '50px' }} />
          <label className='item-name'>{name}</label>
        </>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: 80,
      render: (_, { price }) => <>{formatPrice(price)}</>,
    },
    {
      title: 'Qty',
      dataIndex: 'unitQty',
      width: 60,
      render: (_, { unitQty }) => <>{unitQty / 1000}</>,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      width: 100,
      render: (_, { unitQty, price }) => {
        const subtotal = (unitQty * price) / 1000;
        {
          return <>{formatPrice(subtotal)}</>;
        }
      },
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log('console', record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log('onSelectAll', selected, selectedRows, changeRows);
    },
  };
  return (
    <Wrapper>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        rowSelection={{
          ...rowSelection,
        }}
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
  img {
    width: 100%;
    height: 100%;
    display: inline-block;
    border-radius: var(--radius);
    object-fit: cover;
    margin-right: 0.5rem;
  }
`;
export default LineItems;
