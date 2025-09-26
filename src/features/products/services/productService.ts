import {
  Category,
  ProductsRequestParams,
  ProductsResponse,
} from './../types/apiTypes';
import { apiClient } from '../../../app/network/apiClient';

export const fetchCategories = async (): Promise<Category[]> => {
  return apiClient.get('https://dummyjson.com/products/categories');
};

export const fetchProducts = async (
  params: ProductsRequestParams,
): Promise<ProductsResponse> => {
  let url = 'https://dummyjson.com/products';
  const queryParams: Record<string, string | number> = {
    limit: params.limit ?? 30,
    skip: params.skip ?? 0,
  };
  if (params.search) {
    url = 'https://dummyjson.com/products/search';
    queryParams.q = params.search;
  } else if (params.category) {
    url = `https://dummyjson.com/products/category/${params.category}`;
  }
  const searchParams = new URLSearchParams(
    queryParams as Record<string, string>,
  );
  url += `?${searchParams.toString()}`;
  return apiClient.get(url);
};

// Custom hook for products service
export const useProductsService = () => {
  return {
    fetchCategories,
    fetchProducts,
  };
};
