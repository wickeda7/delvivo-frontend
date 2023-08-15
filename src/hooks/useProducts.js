import { useQuery } from '@tanstack/react-query';
import { getProducts, getSingleProduct } from '../services/apiProducts';
import { merchantInfo } from '../utils/merchantInfo';
import { toast } from 'react-toastify';
import { useGetFetchQuery } from '../hooks/useGetFetchQuery';
import { QueryCache } from '@tanstack/react-query';
import { getCategories } from '../services/apiProducts';
import { useLoaderData } from 'react-router-dom';

const queryCache = new QueryCache();

export function useProducts(categoryId) {
  let enableFetch = true;
  const loaderData = useLoaderData();
  const elements = loaderData?.data;
  if (!categoryId) {
    categoryId = elements[0].id;
  }
  const info = merchantInfo();
  if (!info || !categoryId) {
    toast.error('Please Connect to Clover');
    enableFetch = false;
  }
  const {
    isLoading,
    data: products,
    error,
  } = useQuery({
    queryKey: ['productsTest', categoryId], /// update this by category later
    queryFn: async () => {
      const data = await getProducts(
        info.access_token,
        info.merchant_id,
        categoryId
      );
      return data.elements;
    },
    enabled: enableFetch,
    keepPreviousData: true,
  });

  return { isLoading, error, products };
}

export function useGetProduct(productId) {
  let enableFetch = true;
  if (!productId) enableFetch = false;
  const info = merchantInfo();
  if (!info || !productId) {
    toast.error('Please Connect to Clover');
    enableFetch = false;
  }
  const {
    isLoading,
    data: product,
    error,
  } = useQuery({
    queryKey: ['productItem', productId], /// update this by category later
    queryFn: async () => {
      const data = await getSingleProduct(
        info.access_token,
        info.merchant_id,
        productId
      );
      return data;
    },
    enabled: enableFetch,
    keepPreviousData: true,
  });

  return { isLoading, error, product };
}

export const categoriesListQuery = (info) => ({
  queryKey: ['categories'],
  queryFn: () => getCategories(info),
  cache: queryCache,
  refetchOnMount: false,
});
