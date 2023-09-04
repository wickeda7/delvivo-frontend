import React from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Table, Button, Switch } from 'antd';
import { apiDrivers } from '../../../api/apiDrivers';
const DriversTable = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['drivers']);
  const mutation = useMutation({
    mutationFn: async (data) => {
      return apiDrivers.putDriver(data);
    },
    onSuccess: (data1, variables) => {
      const { id } = variables[0];
      const data = queryClient.getQueryData(['drivers']);
      queryClient.setQueryData(['drivers'], (old) => {
        return data.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...variables[1],
            };
          }
          return item;
        });
      });
    },
  });
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
      render: (_, { available, id }) => {
        return (
          <Switch
            defaultChecked={available}
            onChange={() => onChange(available, id)}
            size='small'
          />
        );
      },
    },
  ];
  const handleAdd = async () => {};
  const onChange = async (available, id) => {
    available = !available;
    try {
      const res = await apiDrivers.putDriver(id, { available });
    } catch (error) {
      console.log(error);
    }
    queryClient.setQueryData(['drivers'], (old) => {
      return old.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            available,
          };
        }
        return item;
      });
    });
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
        onRow={(r, i) => ({
          onClick: (e) => console.log('sdfsf', r, i, e),
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
