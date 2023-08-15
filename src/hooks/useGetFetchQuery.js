import { useQueryClient } from '@tanstack/react-query';

export const useGetFetchQuery = (name) => {
  const queryClient = useQueryClient();
  console.log('queryClient', queryClient);
  return queryClient.getQueryData(name);
};
