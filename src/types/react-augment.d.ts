import 'react';

declare module 'react' {
  interface ImgHTMLAttributes<T> {
    // Estándar HTML: <img fetchpriority="high|low|auto">
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
