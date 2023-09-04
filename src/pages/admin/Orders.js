import React from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiOrders } from '../../api/apiOrders';
import { useOrderContext } from './context/oders_context';
import dayjs from 'dayjs';
import { Table } from 'antd';
import {
  defaultColumns,
  EditableCell,
  EditableRow,
} from './context/editable_context';

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};
const Orders = () => {
  const { handleSave } = useOrderContext();
  const queryClient = useQueryClient();
  const now = dayjs().format('YYYY-MM-DD');
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return apiOrders.getStoreOrders(now);
    },
  });
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
        handleSave,
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
      <div className='container'>
        <div className='half'>
          <Table
            rowSelection={rowSelection}
            onRow={(record, index) => ({
              // style: {
              //   background: record ? 'red' : '',
              // },
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
        </div>
        <div className='half'>detail</div>
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
  .half {
    width: 50%;
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
export default Orders;
