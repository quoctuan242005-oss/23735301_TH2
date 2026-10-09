import { useQuery } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { STALE_TIME_MS, PRICE_MULTIPLIER } from '@constants/student';
import type { Product } from '@stores/cartStore';

export interface RawProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<RawProduct[]>('/products?limit=12');
  return response.data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    image: item.image,
    price: Math.round(item.price * PRICE_MULTIPLIER),
  }));
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get<RawProduct>(`/products/${id}`);
  const item = response.data;
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    image: item.image,
    price: Math.round(item.price * PRICE_MULTIPLIER),
  };
};

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: STALE_TIME_MS,
  });
};