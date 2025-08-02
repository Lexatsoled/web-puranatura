import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  addedDate: Date;
  product: Product; // Referencia al producto completo
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Cargar lista de deseos desde localStorage al inicializar
  useEffect(() => {
    const savedWishlist = localStorage.getItem('puranatura-wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        // Convertir fechas de string a Date
        const wishlistWithDates = parsedWishlist.map((item: any) => ({
          ...item,
          addedDate: new Date(item.addedDate)
        }));
        setWishlistItems(wishlistWithDates);
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Guardar lista de deseos en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('puranatura-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: Product) => {
    const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (!isAlreadyInWishlist) {
      const wishlistItem: WishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0].full,
        category: product.category,
        inStock: true, // Por defecto asumimos que está en stock
        addedDate: new Date(),
        product: product
      };

      setWishlistItems(prev => [...prev, wishlistItem]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
