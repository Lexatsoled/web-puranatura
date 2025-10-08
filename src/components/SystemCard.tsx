import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';

interface SystemCardProps {
  title: string;
  icon: string;
  description: string;
  products: Product[];
  benefits: string[];
  systemId: string;
  color: string;
  timeline: string;
}

const SystemCard: React.FC<SystemCardProps> = ({
  title,
  icon,
  description,
  products,
  benefits,
  systemId,
  color,
  timeline
}) => {
  const navigate = useNavigate();

  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const systemPrice = totalPrice * 0.85; // 15% descuento por sistema completo
  const savings = totalPrice - systemPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${color} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{icon}</span>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Precio Individual</div>
            <div className="text-lg line-through">${totalPrice.toFixed(2)}</div>
            <div className="text-2xl font-bold">${systemPrice.toFixed(2)}</div>
            <div className="text-sm bg-white/20 px-2 py-1 rounded">
              Ahorras ${savings.toFixed(2)}
            </div>
          </div>
        </div>
        <p className="text-white/90 text-sm">{description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Products Grid */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Componentes del Sistema:</h4>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <img 
                  src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].full} 
                  alt={product.name}
                  className="w-8 h-8 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Beneficios Sinérgicos:</h4>
          <div className="space-y-2">
            {benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Cronología de Resultados:</h4>
          <p className="text-xs text-gray-600">{timeline}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/tienda?sistema=${systemId}`)}
            className={`w-full bg-gradient-to-r ${color} text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
          >
            Ver Sistema Completo
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                // TODO: Agregar todos los productos al carrito
                console.log('Agregar sistema completo al carrito:', systemId);
              }}
              className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Agregar Sistema
            </button>
            <button
              onClick={() => navigate(`/sistemas-sinergicos#${systemId}`)}
              className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Más Info
            </button>
          </div>
        </div>
      </div>

      {/* Scientific Badge */}
      <div className="bg-gray-50 px-6 py-3 border-t">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <span>🧬</span>
          <span className="font-medium">Respaldado por investigación científica</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemCard;