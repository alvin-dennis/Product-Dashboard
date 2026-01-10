import { motion } from 'framer-motion';
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { Layout } from '@/pages/_components/layout/Layout';
import { ProductFilters } from '@/pages/_components/products/ProductFilters';
import { ProductGrid } from '@/pages/_components/products/ProductGrid';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';

const Dashboard = () => {
  const { data: productsData } = useProducts();
  const { getTotalItems, getTotalPrice } = useCartStore();

  const stats = [
    {
      label: 'Total Products',
      value: productsData?.total || 0,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Items in Cart',
      value: getTotalItems(),
      icon: ShoppingCart,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Cart Value',
      value: `$${getTotalPrice().toFixed(2)}`,
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Avg. Rating',
      value: '4.5',
      icon: TrendingUp,
      color: 'text-secondary-foreground',
      bgColor: 'bg-secondary',
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold">Product Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Browse and manage your product catalog
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="card-hover">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <ProductFilters />
        <ProductGrid />
      </div>
    </Layout>
  );
};

export default Dashboard;
