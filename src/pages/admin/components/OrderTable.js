import React from 'react';
import styled from 'styled-components';
import { Table } from 'antd';
import { useGetData, useUpdateOrder } from '../../../hooks/useOrders';
import {
  defaultColumns,
  EditableCell,
  EditableRow,
} from '../context/editable_context';

const OrderTable = ({ setOrder }) => {
  const data = useGetData();
  const mutation = useUpdateOrder();
  console.log(data);
  //   if (data[0]) {
  //     setOrder(data[0]);
  //   }
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
            setOrder(record);
          },
        })}
        columns={columns}
        dataSource={data}
        components={components}
        bordered
        rowClassName={() => 'editable-row'}
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
