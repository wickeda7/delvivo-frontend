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
export const useCreateDriver = () => {};
export const useGetData = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(['drivers']);
};
