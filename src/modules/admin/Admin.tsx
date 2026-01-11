import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { Layout } from '@/modules/layout/Layout';
import { ProductForm, ProductFormData } from '@/modules/admin/_components/ProductForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useProducts, Product } from '@/hooks/useProducts';
import { useProductStore } from '@/stores/productStore';
import { toast } from 'sonner';

const Admin = () => {
  const { data: apiProducts } = useProducts();
  const { localProducts, addProduct, updateProduct, deleteProduct } = useProductStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine API products with local products
  const allProducts = [...(localProducts || []), ...(apiProducts?.products || [])];

  const filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: ProductFormData, imagePreview: string | null) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        discountPercentage: data.discountPercentage,
        rating: data.rating,
        stock: data.stock,
        brand: data.brand,
        category: data.category,
        thumbnail: imagePreview || 'https://via.placeholder.com/400',
        images: imagePreview ? [imagePreview] : ['https://via.placeholder.com/400'],
      };

      if (editingProduct) {
        const isLocal = localProducts.some((p) => p.id === editingProduct.id);

        if (isLocal) {
          updateProduct(editingProduct.id, productData);
        } else {
          addProduct(productData);
        }
        toast.success('Product updated successfully');
      } else {
        addProduct(productData);
        toast.success('Product created successfully');
      }

      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    const isLocal = localProducts.some((p) => p.id === id);

    if (isLocal) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    } else {
      toast.error('Cannot delete API products. You can only delete locally created products.');
    }

    setDeleteConfirm(null);
  };

  return (
    <Layout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold">Product Management</h1>
            <p className="mt-1 text-muted-foreground">
              Add, edit, and manage your product catalog
            </p>
          </div>
          <Button onClick={handleCreate} className="btn-primary-shadow">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold">{allProducts.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-success/10 p-2.5">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Local Products</p>
                <p className="text-xl font-bold">{localProducts.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">API Products</p>
                <p className="text-xl font-bold">{apiProducts?.products?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.slice(0, 20).map((product) => {
                        const isLocal = localProducts.some((p) => p.id === product.id);

                        return (
                          <motion.tr
                            key={product.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b"
                          >
                            <TableCell>
                              <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate font-medium">
                              {product.title}
                            </TableCell>
                            <TableCell>{product.brand || '-'}</TableCell>
                            <TableCell>
                              <span className="capitalize">
                                {product.category?.replace('-', ' ')}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${product.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">{product.stock}</TableCell>
                            <TableCell>
                              <Badge variant={isLocal ? 'default' : 'secondary'}>
                                {isLocal ? 'Local' : 'API'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeleteConfirm(product.id)}
                                  disabled={!isLocal}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {filteredProducts.length > 20 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Showing 20 of {filteredProducts.length} products
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? 'Update the product details below'
                  : 'Fill in the details to create a new product'}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
        <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Admin;
