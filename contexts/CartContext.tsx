import React, { createContext, useContext, ReactNode } from 'react';
import { Product } from '../src/types/product';
import { CartItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'pura-natura-cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, []);
  
  // Calcular el total de items y precio
  const cartCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find(
        (item: CartItem) => item.product.id === product.id,
      );
      if (existingItem) {
        return prevItems.map((item: CartItem) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems: CartItem[]) =>
      prevItems.filter((item: CartItem) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems: CartItem[]) =>
      prevItems.map((item: CartItem) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
