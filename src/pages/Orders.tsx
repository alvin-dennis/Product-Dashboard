import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/pages/_components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/orderStore';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-secondary text-secondary-foreground',
  delivered: 'bg-success/10 text-success',
};

const Orders = () => {
  const navigate = useNavigate();
  const { orders } = useOrderStore();

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start shopping to see your orders here
          </p>
          <Button onClick={() => navigate('/')} className="mt-6">
            Start Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold">Order History</h1>
          <p className="mt-1 text-muted-foreground">
            View and track your past orders
          </p>
        </motion.div>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                        <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                      </div>
                      <Badge className={statusColors[order.status]}>
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 flex -space-x-2">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div
                        key={item.id}
                        className="h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-muted"
                        style={{ zIndex: order.items.length - idx }}
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-lg bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">Shipping to</p>
                    <p className="text-sm font-medium">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
