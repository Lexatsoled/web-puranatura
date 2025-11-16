export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  detailedContent?: string;
  imageUrl: string;
  duration: number;
  price: number;
  category: string;
  benefits: string[];
  contraindications?: string[];
  whatToExpect?: string;
  preparation?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  imageUrl?: string;
  serviceId?: string;
}
