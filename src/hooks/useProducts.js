import { useQuery } from '@tanstack/react-query';
import { getProducts, getSingleProduct } from '../services/apiProducts';
import { merchantInfo } from '../utils/merchantInfo';
import { toast } from 'react-toastify';
import { useGetFetchQuery } from '../hooks/useGetFetchQuery';

export function useProducts(categoryId) {
  let enableFetch = true;
  //if (!categoryId) enableFetch = false;
  const data = useGetFetchQuery(['categories']);
  if (!categoryId) {
    categoryId = data?.elements[0].id;
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
