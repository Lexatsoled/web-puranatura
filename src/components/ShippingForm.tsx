import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCheckoutStore, ShippingAddress } from '../store/checkoutStore';

const ShippingForm: React.FC = () => {
  const { shippingAddress, setShippingAddress, nextStep } = useCheckoutStore();
  
  const [formData, setFormData] = useState<Partial<ShippingAddress>>(
    shippingAddress || {
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'República Dominicana',
      phone: '',
      isDefault: false,
    }
  );

  const dominianStates = [
    'Distrito Nacional',
    'Azua',
    'Baoruco',
    'Barahona',
    'Dajabón',
    'Duarte',
    'Elías Piña',
    'El Seibo',
    'Espaillat',
    'Hato Mayor',
    'Hermanas Mirabal',
    'Independencia',
    'La Altagracia',
    'La Romana',
    'La Vega',
    'María Trinidad Sánchez',
    'Monseñor Nouel',
    'Monte Cristi',
    'Monte Plata',
    'Pedernales',
    'Peravia',
    'Puerto Plata',
    'Samaná',
    'San Cristóbal',
    'San José de Ocoa',
    'San Juan',
    'San Pedro de Macorís',
    'Sánchez Ramírez',
    'Santiago',
    'Santiago Rodríguez',
    'Santo Domingo',
    'Valverde',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const required = ['firstName', 'lastName', 'street', 'city', 'state', 'postalCode', 'phone'];
    const isValid = required.every(field => formData[field as keyof ShippingAddress]);
    
    if (!isValid) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const addressData: ShippingAddress = {
      id: shippingAddress?.id || `addr_${Date.now()}`,
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      company: formData.company || '',
      street: formData.street!,
      apartment: formData.apartment || '',
      city: formData.city!,
      state: formData.state!,
      postalCode: formData.postalCode!,
      country: formData.country!,
      phone: formData.phone!,
      isDefault: formData.isDefault || false,
    };

    setShippingAddress(addressData);
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Envío</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Empresa (opcional)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección *
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            required
            placeholder="Calle, número"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
            Apartamento, suite, etc. (opcional)
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              Provincia *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Seleccionar provincia</option>
              {dominianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="+1 (809) 000-0000"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="isDefault" className="ml-2 text-sm text-gray-600">
            Guardar como dirección predeterminada
          </label>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            onClick={() => window.history.back()}
          >
            ← Volver al carrito
          </button>
          
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            Continuar al pago →
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ShippingForm;
