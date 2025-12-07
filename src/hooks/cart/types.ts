export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity?: number;
  discount?: number;
  weight?: number;
  variants?: {
    id: string;
    name: string;
    price?: number;
  }[];
  selectedVariantId?: string;
};

export type UseShoppingCartOptions = {
  items: CartItem[];
  taxRate?: number;
  shippingCost?: number;
  maxQuantityPerItem?: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateVariant?: (itemId: string, variantId: string) => void;
};
