import { useQuery } from '@tanstack/react-query';
import { isvApi } from '@/services/isv.api';

export function useProductDetail(productId: string) {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await isvApi.getProduct(productId);
      return response.data;
    },
    enabled: !!productId,
  });

  return {
    product: data,
    isLoading,
    error,
    refetch
  };
}
