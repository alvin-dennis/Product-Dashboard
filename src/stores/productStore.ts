import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/hooks/useProducts';

interface ProductState {
  localProducts: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      localProducts: [],

      addProduct: (productData) => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const product: Product = {
          ...productData,
          id,
        };
        
        set((state) => ({
          localProducts: [...state.localProducts, product],
        }));
        
        return product;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          localProducts: state.localProducts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          localProducts: state.localProducts.filter((p) => p.id !== id),
        }));
      },

      getProductById: (id) => {
        return get().localProducts.find((p) => p.id === id);
      },
    }),
    {
      name: 'product-storage',
    }
  )
);
