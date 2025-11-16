import { Product as ProductType } from './src/types/product';

export type Product = ProductType;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  content: string;
}
