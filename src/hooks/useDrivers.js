import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiDrivers } from '../api/apiDrivers';

export const useGetDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      return apiDrivers.getDrivers();
    },
  });
};
export const useGetDriver = () => {};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation(apiDrivers.putDriver, {
    onSuccess: (newData) => {
      const { id, attributes } = newData;
      queryClient.setQueryData(['drivers'], (old) => {
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
export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation(apiDrivers.postDriver, {
    onSuccess: (newData) => {
      const newRow = {
        key: newData.id,
        id: newData.id,
        ...newData.attributes,
      };
      queryClient.setQueryData(['drivers'], (old) => {
        const newData = [newRow, ...old];
        newData.sort((a, b) => b.id - a.id);
        return newData;
      });
    },
    onError: (err, newData, context) => {
      console.log(err);
      console.log(newData);
      console.log(context);
    },
  });
};
export const useGetData = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(['drivers']);
};
