export interface Service {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  duration?: number;
  price?: number;
  category?: string;
  benefits?: string[];
}

export interface Testimonial {
  id?: string;
  name: string;
  text: string;
  rating?: number;
  date?: string;
  imageUrl?: string;
  serviceId?: string;
}
