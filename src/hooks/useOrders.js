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
export const useSendEmail = () => {
  const queryClient = useQueryClient();
  return useMutation(apiOrders.sendEmail, {
    onSuccess: (newData) => {
      const { id, notifiedDate } = newData;
      queryClient.setQueryData(['orders'], (old) => {
        return old.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              notifiedDate,
            };
          }
          return item;
        });
      });
    },
  });
};
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(apiOrders.putOrder, {
    onSuccess: (newData) => {
      const { id, attributes } = newData;
      const orders = JSON.parse(attributes.order_content);
      attributes.order_content = orders;
      if (attributes.driver.data !== null) {
        const temp = attributes.driver.data.attributes;
        temp['id'] = id;
        attributes.driver = temp;
      } else {
        attributes.driver = null;
      }
      if (attributes.user.data !== null) {
        const temp = attributes.user.data.attributes;
        temp['id'] = id;
        attributes.user = temp;
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
