import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const AddressesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Casa',
      street: 'Calle de la Naturaleza, 123',
      city: 'Madrid',
      postalCode: '28001',
      country: 'España',
      isDefault: true,
    },
    {
      id: '2',
      type: 'work',
      name: 'Oficina',
      street: 'Avenida de los Remedios, 45, 2º',
      city: 'Madrid',
      postalCode: '28003',
      country: 'España',
      isDefault: false,
    },
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'España',
  });

  // Referencia para hacer scroll al formulario
  const formRef = React.useRef<HTMLDivElement>(null);

  // Función para hacer scroll al formulario cuando se abre
  const scrollToForm = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100); // Pequeño delay para que el componente se renderice
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesión para gestionar tus direcciones.
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddress) {
      // Editar dirección existente
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...formData } : addr
        )
      );
      setEditingAddress(null);
    } else {
      // Agregar nueva dirección
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0, // Primera dirección es predeterminada
      };
      setAddresses((prev) => [...prev, newAddress]);
      setIsAddingAddress(false);
    }

    // Limpiar formulario
    setFormData({
      type: 'home',
      name: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'España',
    });
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    });
    setIsAddingAddress(true);
    scrollToForm(); // Hacer scroll al formulario cuando se edita
  };

  const handleDelete = (addressId: string) => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')
    ) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    }
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const cancelForm = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
    setFormData({
      type: 'home',
      name: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'España',
    });
  };

  const getAddressTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case 'work':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case 'other':
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
    }
  };

  const getAddressTypeName = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return 'Casa';
      case 'work':
        return 'Trabajo';
      case 'other':
        return 'Otra';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mis Direcciones
            </h1>
            <p className="text-gray-600">
              Gestiona tus direcciones de envío y facturación
            </p>
          </div>
          <button
            onClick={() => {
              setIsAddingAddress(true);
              scrollToForm(); // Hacer scroll al formulario cuando se agrega nueva dirección
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Agregar Dirección
          </button>
        </div>

        {/* Lista de direcciones */}
        <div className="space-y-4 mb-8">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                address.isDefault
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      address.isDefault
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {getAddressTypeIcon(address.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {address.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          address.isDefault
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {getAddressTypeName(address.type)}
                      </span>
                      {address.isDefault && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600 space-y-1">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Usar como predeterminada
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-green-600 hover:text-green-700 p-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Formulario de agregar/editar dirección */}
        {isAddingAddress && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de dirección
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="home">Casa</option>
                    <option value="work">Trabajo</option>
                    <option value="other">Otra</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de la dirección
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Casa principal"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dirección
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Calle, número, piso, puerta..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Madrid"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Código Postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="28001"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    País
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="España">España</option>
                    <option value="Francia">Francia</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Italia">Italia</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  {editingAddress ? 'Actualizar' : 'Agregar'} Dirección
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;
