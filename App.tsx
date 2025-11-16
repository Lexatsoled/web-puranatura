import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import NotificationContainer from '@/components/NotificationContainer';
import CartNotification from '@/components/CartNotification';
import ScrollManager from '@/components/ScrollManager';
import { useCartNotificationStore } from '@/store/cartNotificationStore';
import SkipLink from '@/components/A11y/SkipLink';
import SimpleLayout from './SimpleLayout';
import AppRoutes from '@/routes/AppRoutes';

const App: React.FC = () => {
  const { isVisible, productName, totalItems, totalPrice, hideNotification } =
    useCartNotificationStore();

  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollManager />
            <SkipLink />
            <SimpleLayout>
              <AppRoutes />
            </SimpleLayout>
            <NotificationContainer />
            <CartNotification
              isVisible={isVisible}
              productName={productName}
              totalItems={totalItems}
              totalPrice={totalPrice}
              onClose={hideNotification}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
