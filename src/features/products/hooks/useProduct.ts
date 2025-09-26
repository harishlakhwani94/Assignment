import { useState } from 'react';
import {
  ProductsRequestParams,
  ProductsResponse,
  Category,
  Product,
} from '../types/apiTypes';
import { fetchCategories, fetchProducts } from '../services/productService';

export const useProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [limit, setLimit] = useState<number>(30);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);

  const getCategories = async () => {
    const data = await fetchCategories();
    if (Array.isArray(data) && data.length > 0) {
      setCategories(data);
    } else {
      setCategories([]);
    }
  };

  const getProducts = async (reset: boolean = false) => {
    const requestParams: ProductsRequestParams = {
      search,
      category,
      limit,
      skip: reset ? 0 : skip,
    };
    const data = await fetchProducts(requestParams);
    if (data && Array.isArray(data.products)) {
      let updatedProducts: Product[];
      if (reset || requestParams.skip === 0) {
        updatedProducts = data.products;
      } else {
        updatedProducts = products
          ? [...products, ...data.products]
          : data.products;
      }
      setSkip(updatedProducts?.length ?? 0);
      setProducts(updatedProducts);
      if (data.total === (updatedProducts?.length ?? 0)) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      return {
        products: data.products,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
    } else {
      setProducts([]);
      setHasMore(false);
      return {
        products: [],
        total: 0,
        skip: requestParams.skip,
        limit: requestParams.limit ?? 0,
      };
    }
  };

  return {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    products,
    getCategories,
    getProducts,
    hasMore,
  };
};
