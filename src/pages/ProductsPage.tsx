import React from 'react';
import { SEOHead } from '@/components/SEOHead';

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead
        title="Productos Naturales"
        description="Descubre nuestra selección de vitaminas, suplementos y productos naturales de la más alta calidad para tu bienestar."
        canonical="https://purezanaturalis.com/products"
        type="website"
      />
      
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Productos</h1>
        <div className="text-center py-20">
          <p className="text-lg text-gray-600">Página de productos en desarrollo.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;