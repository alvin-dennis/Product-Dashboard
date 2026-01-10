import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/useProducts';
import { useFilterStore } from '@/stores/filterStore';

export const ProductGrid = () => {
  const { data, isLoading, error } = useProducts();
  const { searchQuery, selectedCategory, sortBy, priceRange } = useFilterStore();

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    let products = [...data.products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    return products;
  }, [data, searchQuery, selectedCategory, sortBy, priceRange]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <Skeleton className="aspect-square" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-destructive">Error loading products. Please try again.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold">No products found</h3>
        <p className="mt-1 text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};
