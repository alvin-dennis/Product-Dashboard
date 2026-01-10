import { Header } from './Header';
import { CartDrawer } from '@/pages/_components/cart/CartDrawer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <CartDrawer />
    </div>
  );
};
