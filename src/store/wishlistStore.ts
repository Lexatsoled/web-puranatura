/**
 * Store de Zustand para gestión de la lista de deseos (wishlist).
 * Propósito: Centralizar el estado de productos favoritos del usuario con persistencia.
 * Lógica: Usa Zustand con middleware de persistencia para mantener la wishlist entre sesiones.
 * Entradas: Acciones del usuario para agregar/remover productos favoritos.
 * Salidas: Estado de la wishlist y métodos para manipularla.
 * Dependencias: Zustand, ProductService para validaciones, store de notificaciones.
 * Efectos secundarios: Persistencia en localStorage, notificaciones al usuario.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import {
  showSuccessNotification,
  showErrorNotification,
} from './notificationStore';
import { validateProduct } from '../services/productHelpers';

/**
 * Interfaz que define el contrato del store de wishlist.
 * Propósito: Especificar el estado y métodos disponibles para la gestión de favoritos.
 * Lógica: Define estructura de estado y acciones para manipular la lista de deseos.
 * Entradas: Ninguna (es una interfaz de tipos).
 * Salidas: Ninguna (es una interfaz de tipos).
 * Dependencias: Product type.
 * Efectos secundarios: Ninguno.
 */
interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  toggleItem: (product: Product) => void;
  getItemCount: () => number;
  hasItems: () => boolean;
  loadWishlist: () => void;
}

/**
 * Store principal de wishlist creado con Zustand.
 * Propósito: Proporcionar estado global y acciones para la gestión de productos favoritos.
 * Lógica: Usa middleware de persistencia para mantener la wishlist entre sesiones del navegador.
 * Entradas: Configuración inicial del store.
 * Salidas: Hook useWishlistStore para acceder al estado y acciones.
 * Dependencias: Zustand, middleware de persistencia, ProductService, store de notificaciones.
 * Efectos secundarios: Persistencia automática en localStorage.
 */

/**
 * Hook del store de wishlist con todas las acciones disponibles.
 * Propósito: Centralizar la lógica de gestión de productos favoritos del usuario.
 * Lógica: Implementa todas las operaciones CRUD para la wishlist con validaciones.
 * Entradas: Configuración del store con estado inicial y acciones.
 * Salidas: Hook de Zustand con estado y métodos de wishlist.
 * Dependencias: Zustand persist middleware, ProductService, notification stores.
 * Efectos secundarios: Persistencia en localStorage, notificaciones al usuario.
 */
export const useWishlistStore = create<WishlistStore>()(
  persist(
  (set, get) => ({
      /**
       * Stub para cargar la wishlist (usado en tests)
       */
      loadWishlist: () => {
        // No-op, solo para compatibilidad con tests
      },
      items: [],

      /**
       * Agrega un producto a la wishlist con validaciones.
       * Propósito: Añadir productos favoritos verificando integridad de datos.
       * Lógica: Valida el producto con ProductService, verifica duplicados, actualiza estado.
       * Entradas: product (Product) - Producto a agregar a favoritos.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: ProductService, stores de notificaciones.
       * Efectos secundarios: Notificaciones de éxito/error, actualización del estado global.
       */
      addItem: (product) => {
        const validation = validateProduct(product);
        if (!validation.isValid) {
          showErrorNotification(
            `Error al añadir producto: ${validation.message}`
          );
          return;
        }

        set((state) => {
          if (!state.items.find((item) => item.id === product.id)) {
            showSuccessNotification(
              `${product.name} añadido a la lista de deseos`
            );
            return { items: [...state.items, product] };
          }
          showErrorNotification(
            `${product.name} ya está en tu lista de deseos`
          );
          return state;
        });
      },

      /**
       * Remueve un producto específico de la wishlist.
       * Propósito: Eliminar un producto de los favoritos del usuario.
       * Lógica: Filtra el producto por ID, muestra notificación de confirmación.
       * Entradas: productId (string) - ID del producto a remover.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: Stores de notificaciones.
       * Efectos secundarios: Notificación al usuario, actualización del estado global.
       */
      removeItem: (productId) => {
        const item = get().items.find((item) => item.id === productId);
        if (item) {
          showSuccessNotification(
            `${item.name} eliminado de la lista de deseos`
          );
        }

        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      /**
       * Verifica si un producto está en la wishlist.
       * Propósito: Consultar el estado de favorito de un producto sin modificaciones.
       * Lógica: Busca el producto por ID en la lista de items.
       * Entradas: productId (string) - ID del producto a verificar.
       * Salidas: boolean - True si está en wishlist, false si no.
       * Dependencias: Estado actual de items.
       * Efectos secundarios: Ninguno.
       */
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      /**
       * Alterna el estado de favorito de un producto (agregar/remover).
       * Propósito: Proporcionar una interfaz unificada para toggle de favoritos.
       * Lógica: Verifica si está en lista y ejecuta la acción opuesta.
       * Entradas: product (Product) - Producto a togglear.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: isInWishlist, addItem, removeItem internos.
       * Efectos secundarios: Notificaciones y actualización del estado global.
       */
      toggleItem: (product) => {
        const isInList = get().isInWishlist(product.id);
        if (isInList) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      /**
       * Vacía completamente la wishlist.
       * Propósito: Remover todos los productos favoritos de una vez.
       * Lógica: Resetea la lista de items a array vacío, muestra notificación.
       * Entradas: Ninguna.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: Stores de notificaciones.
       * Efectos secundarios: Notificación al usuario, reseteo completo de la wishlist.
       */
      clearWishlist: () => {
        const itemCount = get().items.length;
        if (itemCount > 0) {
          showSuccessNotification(
            `Lista de deseos vaciada (${itemCount} productos eliminados)`
          );
        }
        set({ items: [] });
      },

      /**
       * Obtiene el conteo total de productos en la wishlist.
       * Propósito: Proporcionar información para indicadores de UI.
       * Lógica: Retorna la longitud del array de items.
       * Entradas: Ninguna.
       * Salidas: number - Cantidad de productos en wishlist.
       * Dependencias: Estado actual de items.
       * Efectos secundarios: Ninguno.
       */
      getItemCount: () => get().items.length,

      /**
       * Verifica si la wishlist contiene algún producto.
       * Propósito: Determinar si mostrar indicadores de wishlist llena/vacía.
       * Lógica: Verifica si el array de items tiene longitud > 0.
       * Entradas: Ninguna.
       * Salidas: boolean - True si hay productos, false si está vacía.
       * Dependencias: Estado actual de items.
       * Efectos secundarios: Ninguno.
       */
      hasItems: () => get().items.length > 0,
    }),
    {
      name: 'pureza-naturalis-wishlist-storage',
      version: 1,
    }
  )
);
