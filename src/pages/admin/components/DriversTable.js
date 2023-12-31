import React from 'react';
import styled from 'styled-components';
import { useUpdateDriver, useGetDriversData } from '../../../hooks/useDrivers';
import { Table, Button, Switch } from 'antd';
const DriversTable = ({ setNewDriver }) => {
  const mutation = useUpdateDriver();
  const data = useGetDriversData();
  const defaultColumns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      width: 70,
      key: 'firstName',
      // render: (text) => < dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 70,
    },

    {
      title: 'phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 70,
      render: (_, { phone }) => phone && <>{phone}</>,
    },
    {
      title: 'Availability',
      dataIndex: 'available',
      width: 30,
      key: 'available',
      render: (_, record) => {
        return (
          <Switch
            checked={record.available}
            onChange={() => onChange(record)}
            size='small'
          />
        );
      },
    },
  ];
  const handleAdd = async () => {
    setNewDriver(true);
  };
  const onChange = async (row) => {
    const { id, available } = row;
    row.available = !available;
    mutation.mutate({ id, data: row });
    return;
  };
  return (
    <Wrapper>
      <Button
        onClick={handleAdd}
        type='primary'
        style={{
          marginBottom: 16,
          float: 'right',
        }}
      >
        Add Driver
      </Button>
      <Table
        columns={defaultColumns}
        dataSource={data}
        bordered
        scroll={{
          x: 400,
          y: 1500,
        }}
        pagination={false}
        onRow={(r, i) => ({
          onClick: (e) => {
            setNewDriver(r);
          },
        })}
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
`;
export default DriversTable;
