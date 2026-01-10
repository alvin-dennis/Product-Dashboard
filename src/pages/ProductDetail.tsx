import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Minus,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { Layout } from '@/pages/_components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addItem, openCart } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      });
    }
    toast.success('Added to cart', {
      description: `${quantity} × ${product.title}`,
    });
    openCart();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-xl" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container flex flex-col items-center justify-center py-20">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl font-semibold">
            Product not found
          </h2>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Layout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                className="aspect-square w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index
                      ? 'border-primary'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
                {product.stock < 10 && (
                  <Badge variant="destructive">Low Stock</Badge>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold">{product.title}</h1>
              <p className="mt-1 text-muted-foreground">{product.brand}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating)
                      ? 'fill-warning text-warning'
                      : 'fill-muted text-muted'
                      }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">• {product.stock} in stock</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-primary">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 10 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge className="bg-destructive text-destructive-foreground">
                    Save {Math.round(product.discountPercentage)}%
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            <p className="text-muted-foreground">{product.description}</p>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full btn-primary-shadow"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart • ${(discountedPrice * quantity).toFixed(2)}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center">
                <Package className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
