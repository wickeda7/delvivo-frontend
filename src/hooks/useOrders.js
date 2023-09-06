import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiOrders } from '../api/apiOrders';
import dayjs from 'dayjs';

export const useGetOrders = () => {
  const now = dayjs().format('YYYY-MM-DD');
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return apiOrders.getStoreOrders(now);
    },
  });
};

export const useGetOrdersData = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(['orders']);
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(apiOrders.putOrder, {
    onSuccess: (newData) => {
      const { id, attributes } = newData;
      const orders = JSON.parse(attributes.orderContent);
      attributes.orderContent = orders;
      if (attributes.driver) {
        const temp = attributes.driver.data.attributes;
        temp['id'] = id;
        attributes.driver = temp;
      }
      queryClient.setQueryData(['orders'], (old) => {
        return old.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...attributes,
            };
          }
          return item;
        });
      });
    },
  });
};
