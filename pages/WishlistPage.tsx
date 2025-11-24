import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { motion } from 'framer-motion';
import { formatCurrency } from '../src/utils/intl';

const WishlistPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesion para ver tu lista de deseos.
          </p>
        </div>
      </div>
    );
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId);
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const handleAddToCart = (item: any) => {
    addToCart(item.product);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id));
    }
  };

  const handleRemoveSelected = () => {
    if (
      window.confirm(
        `Estas seguro de que quieres eliminar ${selectedItems.length} productos de tu lista de deseos?`
      )
    ) {
      selectedItems.forEach((itemId) => removeFromWishlist(itemId));
      setSelectedItems([]);
    }
  };

  const handleAddSelectedToCart = () => {
    const selectedInStockItems = wishlistItems.filter(
      (item) => selectedItems.includes(item.id) && item.inStock
    );

    selectedInStockItems.forEach((item) => {
      addToCart(item.product);
    });

    if (selectedInStockItems.length > 0) {
      alert(
        `Se agregaron ${selectedInStockItems.length} productos al carrito.`
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mi Lista de Deseos
              </h1>
              <p className="text-gray-600 mt-1">
                Productos que te interesan para comprar mas tarde
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {selectedItems.length === wishlistItems.length
                    ? 'Deseleccionar todo'
                    : 'Seleccionar todo'}
                </button>

                {selectedItems.length > 0 && (
                  <>
                    <button
                      onClick={handleAddSelectedToCart}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Agregar al carrito ({selectedItems.length})
                    </button>

                    <button
                      onClick={handleRemoveSelected}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Eliminar ({selectedItems.length})
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tu lista de deseos esta vacia
              </h3>
              <p className="text-gray-600 mb-4">
                Agrega productos que te interesen para guardarlos aqui
              </p>
              <a
                href="/tienda"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Explorar productos
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow ${
                    selectedItems.includes(item.id)
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Agregado el {formatDate(item.addedDate)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-green-700">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}

                      {!item.inStock && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Agotado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.inStock
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.inStock ? 'Agregar al carrito' : 'No disponible'}
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar de la lista de deseos"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Resumen de la lista de deseos */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen de la Lista
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de productos:</span>
                <span className="font-medium">
                  {wishlistItems.length} productos {' '}
                  {wishlistItems.filter((item) => item.inStock).length}{' '}
                  disponibles
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Valor total:</span>
                <span className="font-medium text-green-700">
                  DOP $
                  {wishlistItems
                    .reduce((total, item) => total + item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Estas seguro de que quieres vaciar toda tu lista de deseos?'
                    )
                  ) {
                    clearWishlist();
                    setSelectedItems([]);
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Vaciar lista de deseos
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
