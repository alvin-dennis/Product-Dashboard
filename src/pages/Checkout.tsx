import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, CreditCard, Truck, Package, ArrowLeft } from 'lucide-react';
import { Layout } from '@/pages/_components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { toast } from 'sonner';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(4, 'Valid zip code required'),
  country: z.string().min(2, 'Country is required'),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
  cardName: z.string().min(2, 'Name on card is required'),
});

type ShippingData = z.infer<typeof shippingSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

const steps = [
  { id: 'shipping', title: 'Shipping', icon: Truck },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'confirmation', title: 'Confirmation', icon: Check },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shippingForm = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
    },
  });

  const paymentForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
    },
  });

  const totalPrice = getTotalPrice();

  if (items.length === 0 && !orderId) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center py-8">
          <Package className="h-20 w-20 text-muted-foreground" />
          <h2 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Add some products to checkout</p>
          <Button onClick={() => navigate('/')} className="mt-6">
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setCurrentStep(1);
  };

  const handlePaymentSubmit = async (_data: PaymentData) => {
    if (!shippingData) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const id = addOrder({
        items: [...items],
        total: totalPrice,
        shippingAddress: {
          fullName: shippingData.fullName,
          address: shippingData.address,
          city: shippingData.city,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        },
      });

      setOrderId(id);
      clearCart();
      setCurrentStep(2);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${index <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-16 transition-colors ${index < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Shipping Step */}
              {currentStep === 0 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...shippingForm}>
                        <form
                          onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={shippingForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={shippingForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={shippingForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="New York" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={shippingForm.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Zip Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="10001" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={shippingForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="United States" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full btn-primary-shadow">
                            Continue to Payment
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Payment Step */}
              {currentStep === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...paymentForm}>
                        <form
                          onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={paymentForm.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={paymentForm.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={16}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={paymentForm.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" maxLength={5} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={paymentForm.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="123"
                                      maxLength={4}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCurrentStep(0)}
                              className="flex-1"
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={isProcessing}
                              className="flex-1 btn-primary-shadow"
                            >
                              {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === 2 && orderId && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="text-center">
                    <CardContent className="py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
                      >
                        <Check className="h-10 w-10 text-success" />
                      </motion.div>

                      <h2 className="mt-6 font-display text-2xl font-bold">
                        Order Confirmed!
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        Thank you for your purchase
                      </p>

                      <div className="mt-6 rounded-lg bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-mono text-lg font-semibold">{orderId}</p>
                      </div>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button onClick={() => navigate('/orders')}>
                          View Orders
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/')}>
                          Continue Shopping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentStep < 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-success">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
