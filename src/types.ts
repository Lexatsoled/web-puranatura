export * from './types/product';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: number;
  quality?: number;
  loading?: 'lazy' | 'eager';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  tags: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  benefits: string[];
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}
