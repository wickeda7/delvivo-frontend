import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiOrders } from '../api/apiOrders';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

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
  let orders = {};
  // let attributes = data.attributes ? data.attributes : data;
  // const id = data.id ? data.id : attributes.id;
  if (typeof data.order_content === 'string') {
    orders = JSON.parse(data.order_content);
  } else {
    orders = data.order_content;
  }
  data.order_content = orders;
  let driver = data.driver;
  let path = data.path;
  if (path && path?.data !== undefined) {
    if (path.data?.attributes !== undefined) {
      const tempP = path.data.attributes;
      tempP['id'] = data.id;
      data.path = tempP;
    } else {
      data.path = null;
    }
  }

  if (driver && driver?.data !== undefined) {
    if (driver.data?.attributes !== undefined) {
      const temp = driver.data.attributes;
      temp['id'] = data.id;
      data.driver = temp;
    } else {
      data.driver = null;
    }
  }
  const user = data.user;

  if (user && user?.data !== undefined) {
    if (user.data?.attributes !== undefined) {
      const temp = user.data.attributes;
      temp['id'] = data.id;
      data.user = temp;
    } else {
      data.user = null;
    }
  }
  queryClient.setQueryData(['orders'], (old) => {
    return old.map((item) => {
      if (item.id === data.id) {
        return {
          ...item,
          ...data,
        };
      }
      return item;
    });
  });
};

const updateNewRow = (data, oldOrders, queryClient) => {
  const { order, entry } = data;
  let orders = {};
  if (typeof order.order_content === 'string') {
    orders = JSON.parse(order.order_content);
  } else {
    orders = order.order_content;
  }
  order.order_content = orders;
  order.itemContent = entry.itemContent;
  order.user = entry.user;
  order.created = order.order_content.createdOrders.createdTime;
  // Add optimistic todo to todos list
  queryClient.setQueryData(['orders'], [order, ...oldOrders]);
  toast.success(
    `New Order: ${order.orderId} at ${dayjs(order.created).format(
      'MM/DD/YYYY h:mm A'
    )} `,
    { autoClose: false }
  );
};

export { updateOrderRow, updateNewRow };
