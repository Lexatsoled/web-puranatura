export * from './product';
export * from './cart';
export * from './auth';
export * from './blog';
export * from './services';
export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
}
// Add other global types if needed
