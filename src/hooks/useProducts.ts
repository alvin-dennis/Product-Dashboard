import { useQuery } from '@tanstack/react-query';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}



const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const api = (path: string) => `${API_URL}${path}`;

const fetchProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch(api("/products?limit=100"));
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const fetchProductById = async (id: number): Promise<Product> => {
  const response = await fetch(api(`/products/${id}`));
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
};

const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(api("/products/category-list"));
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await fetch(
    api(`/products/search?q=${encodeURIComponent(query)}`)
  );
  if (!response.ok) {
    throw new Error("Failed to search products");
  }
  return response.json();
};

const fetchProductsByCategory = async (
  category: string
): Promise<ProductsResponse> => {
  const response = await fetch(api(`/products/category/${category}`));
  if (!response.ok) {
    throw new Error("Failed to fetch products by category");
  }
  return response.json();
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: category !== 'all' && category.length > 0,
  });
};
