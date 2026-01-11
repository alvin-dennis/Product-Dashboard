import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    openCart();
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.discountPercentage > 10 && (
              <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground">
                -{Math.round(product.discountPercentage)}%
              </Badge>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-foreground/5 backdrop-blur-[2px] opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Button
                onClick={handleAddToCart}
                className="btn-primary-shadow"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </motion.div>
          </div>

          <div className="p-4">
            <div className="mb-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-medium text-muted-foreground">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs capitalize text-muted-foreground">
                {product.category}
              </span>
            </div>

            <h3 className="line-clamp-1 font-medium transition-colors group-hover:text-primary">
              {product.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 10 && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
