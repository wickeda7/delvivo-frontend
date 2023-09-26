import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiOrders } from '../api/apiOrders';
import dayjs from 'dayjs';

export const useGetOrders = () => {
  // const now = dayjs().format('YYYY-MM-DD');
  // console.log('now', now); //now 2023-09-21
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return apiOrders.getStoreOrders();
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
      updateOrderRow(newData, queryClient);
    },
  });
};

const updateOrderRow = (data, queryClient) => {
  console.log('data', data);
  let orders = {};
  let attributes = data.attributes ? data.attributes : data;
  const id = data.id ? data.id : attributes.id;
  console.log(id);
  if (typeof attributes.order_content === 'string') {
    orders = JSON.parse(attributes.order_content);
  } else {
    orders = attributes.order_content;
  }
  attributes.order_content = orders;
  const driver = attributes.driver;

  if (driver && driver?.data !== undefined) {
    console.log('driver1', driver);
    const temp = attributes.driver.data.attributes;
    temp['id'] = id;
    attributes.driver = temp;
  } else if (driver && driver?.data === undefined && driver === null) {
    console.log('driver2', driver);
    attributes.driver = null;
  }
  const user = attributes.user;
  console.log('user', user?.data);
  if (user && user?.data !== undefined) {
    const temp = user.data.attributes;
    temp['id'] = id;
    attributes.user = temp;
  }
  queryClient.setQueryData(['orders'], (old) => {
    return old.map((item) => {
      console.log('item', item);
      if (item.id === id) {
        return {
          ...item,
          ...attributes,
        };
      }
      return item;
    });
  });
};
export default updateOrderRow;
