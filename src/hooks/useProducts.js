import { useQuery } from '@tanstack/react-query';
import { merchantInfo } from '../utils/merchantInfo';
import { toast } from 'react-toastify';
import { apiProducts } from '../api/apiProducts';

export function useProducts(categoryId) {
  let enableFetch = true;

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
      const data = await apiProducts.getProducts(
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
      const data = await apiProducts.getSingleProduct(
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
