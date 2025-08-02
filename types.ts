export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: {
    thumbnail: string;
    full: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Service {
  title: string;
  description: string;
  imageUrl: string;
}

export interface Testimonial {
  name: string;
  text: string;
  imageUrl?: string;
}

export interface BlogPost {
  title: string;
  summary: string;
  imageUrl: string;
  content: string;
}
