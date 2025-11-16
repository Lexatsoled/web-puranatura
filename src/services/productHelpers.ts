import type { Product } from '@/types/product';

export interface PriceInfo {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  hasDiscount: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const calculateDiscountedPrice = (product: Product): PriceInfo => {
  const originalPrice = product.compareAtPrice || product.price;
  const finalPrice = product.price;
  const discount =
    originalPrice > finalPrice ? ((originalPrice - finalPrice) / originalPrice) * 100 : 0;

  return {
    originalPrice,
    finalPrice,
    discount: Math.round(discount),
    hasDiscount: discount > 0,
  };
};

export const calculateUnitPrice = (product: Product): string | null => {
  if (!product.priceNote || Array.isArray(product.priceNote)) return null;

  const match = product.priceNote.match(/(\d+)\s*(unidades|ml|g|capsulas)/i);
  if (!match) return null;

  const quantity = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const unitPrice = product.price / quantity;

  return `${formatPrice(unitPrice)}/${unit}`;
};

export const validateProduct = (product: Product): ValidationResult => {
  if (!product) {
    return { isValid: false, message: 'Producto no encontrado' };
  }

  if (product.stock <= 0) {
    return { isValid: false, message: 'Producto sin stock' };
  }

  return { isValid: true };
};

export const validateProductForCart = (
  product: Product,
  quantity: number
): ValidationResult => {
  const basicValidation = validateProduct(product);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  if (quantity <= 0) {
    return { isValid: false, message: 'La cantidad debe ser mayor a 0' };
  }

  if (quantity > product.stock) {
    return {
      isValid: false,
      message: `Stock insuficiente. Disponible: ${product.stock}`,
    };
  }

  return { isValid: true };
};
