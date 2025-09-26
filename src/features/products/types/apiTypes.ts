export interface Category {
  slug: string;
  name: string;
  url: string;
}
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsRequestParams {
  search?: string;
  category?: string;
  limit?: number;
  skip?: number;
}
