import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { useWishlistStore as useWishlistZustand } from '../store/wishlistStore';
import { useCartStore } from '../store';
import { Product } from '../types/product';

const WishlistPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const zustandWishlist = useWishlistZustand();
  const { addToCart } = useCartStore();

  const { wishlist, removeFromWishlist, clearWishlist } = useMemo(() => {
    const list = Array.isArray(zustandWishlist?.items)
      ? zustandWishlist.items
      : ([] as Product[]);
    return {
      wishlist: list,
      removeFromWishlist: zustandWishlist.removeItem,
      clearWishlist: zustandWishlist.clearWishlist,
    };
  }, [zustandWishlist]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // No hay método loadWishlist en el store, se elimina el efecto

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId);
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const handleAddToCart = (item: Product) => {
    addToCart(item);
  }

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map((item: Product) => item.id));
    }
  };

  const handleRemoveSelected = () => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar ${selectedItems.length} productos de tu lista de deseos?`
      )
    ) {
      selectedItems.forEach((itemId) => {
        if (typeof removeFromWishlist === 'function') {
          removeFromWishlist(itemId);
        }
      });
      setSelectedItems([]);
    }
  };

  const handleAddSelectedToCart = () => {
    const selectedInStockItems = wishlist.filter(
      (item: Product) => selectedItems.includes(item.id) && item.stock > 0
    );

    selectedInStockItems.forEach((item: Product) => {
      addToCart(item);
    });

    if (selectedInStockItems.length > 0) {
      alert(`Se agregaron ${selectedInStockItems.length} productos al carrito.`);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Mi Lista de Deseos</h1>
              <p className="text-gray-600 mt-1">
                Productos que te interesan para comprar más tarde
              </p>
            </div>

            {wishlist.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {selectedItems.length === wishlist.length
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
                      Eliminar ({selectedItems.length}) seleccionados
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {wishlist.length === 0 ? (
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
              <h3
                className="text-lg font-medium text-gray-900 mb-2"
                data-testid="empty-wishlist-message"
              >
                Tu lista de deseos está vacía.
              </h3>
              <p className="text-gray-600 mb-4">
                Agrega productos que te interesen para guardarlos aquí
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
              {wishlist.map((item: Product, index: number) => (
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
                  data-testid={`wishlist-item-${item.id}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    title={`Seleccionar producto ${item.name}`}
                  />

                  <div className="flex-shrink-0">
                    <img
                      src={item.images[0]?.thumbnail || item.images[0]?.full}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.categories.join(', ')}</p>
                    <p className="text-xs text-gray-500 mt-1">En lista de deseos</p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-green-700">
                        DOP ${item.price.toFixed(2)}
                      </span>

                      {item.stock === 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Agotado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.stock > 0
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.stock > 0 ? 'Agregar al carrito' : 'No disponible'}
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar de la lista de deseos"
                      data-testid={`remove-button-${item.id}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la Lista</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de productos:</span>
                <span className="font-medium">
                  {wishlist.length} productos {wishlist.filter((item: Product) => item.stock > 0).length} disponibles
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Valor total:</span>
                <span className="font-medium text-green-700">
                  DOP ${wishlist.reduce((total: number, item: Product) => total + item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (
                    window.confirm('¿Estás seguro de que quieres vaciar toda tu lista de deseos?')
                  ) {
                    if (clearWishlist) {
                      clearWishlist();
                    }
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
