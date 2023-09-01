import React, { useContext } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiOrders } from '../../../api/apiOrders';
import dayjs from 'dayjs';

const OrderContext = React.createContext();

export const OrderProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const now = dayjs().format('YYYY-MM-DD');
  const mutation = useMutation({
    mutationFn: async (data) => {
      return apiOrders.putOrder(data);
    },
    onSuccess: (data1, variables) => {
      const { id } = variables[0];
      const data = queryClient.getQueryData(['orders']);
      queryClient.setQueryData(['orders'], (old) => {
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
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return apiOrders.getStoreOrders(now);
    },
  });

  const handleSave = async (order, newVal) => {
    const [key, value] = Object.entries(newVal)[0];
    if (key === 'departureTime') {
      const time = dayjs(value).valueOf();
      try {
        mutation.mutate([
          { ...order, departureTime: time },
          { departureTime: time },
        ]);
      } catch (error) {
        console.log(error);
      }
    }
    if (key === 'arriveTime') {
      const time = dayjs(value).valueOf();
      try {
        mutation.mutate([{ ...order, arriveTime: time }, { arriveTime: time }]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const context = {
    data,
    isLoading,
    date: now,
    handleSave,
  };
  return (
    <OrderContext.Provider value={context}>{children}</OrderContext.Provider>
  );
};
export const useOrderContext = () => {
  return useContext(OrderContext);
};
