/**
 * Calcula el total y el conteo de productos en el carrito.
 * @param items Array de CartItem
 * @returns { total: number, count: number }
 */
function calcularTotales(items: CartItem[]): { total: number; count: number } {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { total, count };
}
/**
 * Store de Zustand para gestión del carrito de compras.
 * Propósito: Centralizar el estado del carrito con persistencia y notificaciones.
 * Lógica: Usa Zustand con middlewares de persistencia e immer para manejo inmutable del estado.
 * Entradas: Acciones del usuario (agregar, remover, actualizar productos).
 * Salidas: Estado del carrito y métodos para manipularlo.
 * Dependencias: Zustand, ProductService para validaciones, stores de notificaciones.
 * Efectos secundarios: Persistencia en localStorage, notificaciones al usuario.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Product } from '../types/product';
import {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
} from './notificationStore';
import { useCartNotificationStore } from './cartNotificationStore';
import { validateProductForCart } from '../services/productHelpers';

/**
 * Representa un elemento individual en el carrito.
 * Propósito: Estructurar la información de un producto con su cantidad en el carrito.
 * Lógica: Combina producto y cantidad para representar una línea de pedido.
 * Entradas: Ninguna (es una interfaz de tipos).
 * Salidas: Ninguna (es una interfaz de tipos).
 * Dependencias: Product type.
 * Efectos secundarios: Ninguno.
 */
interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Representa el estado completo del carrito.
 * Propósito: Mantener todos los datos del carrito incluyendo items, total y conteo.
 * Lógica: Agrega cálculos de total y conteo al array de items.
 * Entradas: Ninguna (es una interfaz de tipos).
 * Salidas: Ninguna (es una interfaz de tipos).
 * Dependencias: CartItem interface.
 * Efectos secundarios: Ninguno.
 */
interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

/**
 * Interfaz del store del carrito con todas las acciones disponibles.
 * Propósito: Definir el contrato completo del store de carrito.
 * Lógica: Especifica estado y métodos para manipular el carrito.
 * Entradas: Ninguna (es una interfaz de tipos).
 * Salidas: Ninguna (es una interfaz de tipos).
 * Dependencias: Cart interface.
 * Efectos secundarios: Ninguno.
 */
interface CartStore {
  cart: Cart;
  isOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getItemQuantity: (productId: string) => number;
  hasItems: () => boolean;
}

/**
 * Store principal del carrito creado con Zustand.
 * Propósito: Proporcionar estado global y acciones para el carrito de compras.
 * Lógica: Usa middlewares de persistencia e immer para manejo eficiente del estado.
 * Entradas: Configuración inicial del store.
 * Salidas: Hook useCartStore para acceder al estado y acciones.
 * Dependencias: Zustand, middlewares, ProductService, stores de notificaciones.
 * Efectos secundarios: Persistencia automática en localStorage.
 */
export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      cart: {
        items: [],
        total: 0,
        count: 0,
      },
      isOpen: false,

      /**
       * Agrega un producto al carrito con validaciones.
       * Propósito: Añadir productos al carrito verificando stock y reglas de negocio.
       * Lógica: Valida con ProductService, actualiza cantidades, recalcula totales, muestra notificaciones.
       * Entradas: product (Product) - Producto a agregar, quantity (number) - Cantidad (default 1).
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: ProductService, stores de notificaciones.
       * Efectos secundarios: Notificaciones al usuario, actualización del estado global.
       */
  /**
   * Añade un producto al carrito con validaciones de negocio y actualiza el estado.
   * @param product Producto a agregar
   * @param quantity Cantidad (por defecto 1)
   */
  addToCart: (product, quantity = 1) => {
        const validation = validateProductForCart(product, quantity);

        if (!validation.isValid) {
          showErrorNotification(`❌ ${validation.message}`);
          return;
        }

        set((state) => {
          // Buscar si el producto ya existe en el carrito
          const idx = state.cart.items.findIndex((item) => item.product.id === product.id);
          let newItems: CartItem[];
          if (idx !== -1) {
            // Actualizar cantidad de forma inmutable
            newItems = state.cart.items.map((item, i) =>
              i === idx ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            newItems = [...state.cart.items, { product, quantity }];
          }
          const { total, count } = calcularTotales(newItems);
          state.cart.items = newItems;
          state.cart.count = count;
          state.cart.total = total;

          // Notificación del carrito
          useCartNotificationStore.getState().showNotification(product.name, count, total);
        });
      },

      /**
       * Remueve un producto del carrito completamente.
       * Propósito: Eliminar un producto específico del carrito y actualizar totales.
       * Lógica: Filtra el item, recalcula totales, muestra notificación con información actualizada.
       * Entradas: productId (string) - ID del producto a remover.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: Stores de notificaciones.
       * Efectos secundarios: Notificaciones al usuario, actualización del estado global.
       */
  /**
   * Elimina un producto del carrito y actualiza el estado y notificaciones.
   * @param productId ID del producto a eliminar
   */
  removeFromCart: (productId) => {
        const item = get().cart.items.find(
          (item) => item.product.id === productId
        );

        set((state) => {
          const newItems = state.cart.items.filter((item) => item.product.id !== productId);
          const { total, count } = calcularTotales(newItems);
          state.cart.items = newItems;
          state.cart.count = count;
          state.cart.total = total;

          // Notificación mejorada
          if (item) {
            let message = `🗑️ ${item.product.name} eliminado del carrito`;
            if (count > 0) {
              message += `\n📦 Quedan: ${count} producto${count > 1 ? 's' : ''} • $${total.toFixed(2)}`;
              showSuccessNotification(message, 5000, {
                label: 'Ver carrito',
                onClick: () => get().setCartOpen(true),
              });
            } else {
              message += `\n🛒 Carrito vacío`;
              showSuccessNotification(message, 4000);
            }
          }
        });
      },

      /**
       * Actualiza la cantidad de un producto en el carrito.
       * Propósito: Cambiar la cantidad de un item específico con validaciones.
       * Lógica: Si cantidad <= 0 remueve el item, valida stock disponible, actualiza totales.
       * Entradas: productId (string) - ID del producto, quantity (number) - Nueva cantidad.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: removeFromCart interno, stores de notificaciones.
       * Efectos secundarios: Notificaciones de warning, actualización del estado global.
       */
  /**
   * Actualiza la cantidad de un producto en el carrito, con validaciones de stock.
   * @param productId ID del producto
   * @param quantity Nueva cantidad
   */
  updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const item = get().cart.items.find(
          (item) => item.product.id === productId
        );
        if (item && quantity > item.product.stock) {
          showWarningNotification(
            `⚠️ Solo hay ${item.product.stock} unidades disponibles`
          );
          return;
        }

        set((state) => {
          const newItems = state.cart.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ).filter((item) => item.quantity > 0);
          const { total, count } = calcularTotales(newItems);
          state.cart.items = newItems;
          state.cart.count = count;
          state.cart.total = total;
        });
      },

      /**
       * Vacía completamente el carrito.
       * Propósito: Remover todos los productos del carrito de una vez.
       * Lógica: Resetea el estado del carrito a valores iniciales, muestra notificación.
       * Entradas: Ninguna.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: Stores de notificaciones.
       * Efectos secundarios: Notificación al usuario, reseteo completo del estado del carrito.
       */
  /**
   * Vacía completamente el carrito y muestra notificación.
   */
  clearCart: () => {
        const itemCount = get().cart.items.length;
        if (itemCount > 0) {
          showSuccessNotification(
            `🧹 Carrito vaciado (${itemCount} producto${itemCount > 1 ? 's' : ''} eliminado${itemCount > 1 ? 's' : ''})`
          );
        }

        set((state) => {
          state.cart = {
            items: [],
            total: 0,
            count: 0,
          };
        });
      },

      /**
       * Alterna el estado de visibilidad del carrito (abierto/cerrado).
       * Propósito: Controlar la visualización del modal/sidebar del carrito.
       * Lógica: Invierte el valor booleano de isOpen.
       * Entradas: Ninguna.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: Ninguna.
       * Efectos secundarios: Cambia la UI del carrito.
       */
  /**
   * Alterna el estado de visibilidad del carrito (modal/sidebar).
   */
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      /**
       * Establece explícitamente el estado de visibilidad del carrito.
       * Propósito: Control preciso sobre la apertura/cierre del carrito.
       * Lógica: Asigna el valor booleano proporcionado a isOpen.
       * Entradas: isOpen (boolean) - Estado deseado para la visibilidad.
       * Salidas: Ninguna directa (actualiza estado).
       * Dependencias: Ninguna.
       * Efectos secundarios: Cambia la UI del carrito.
       */
  /**
   * Establece explícitamente el estado de visibilidad del carrito.
   * @param isOpen Estado deseado
   */
  setCartOpen: (isOpen) => set({ isOpen }),

      /**
       * Obtiene la cantidad actual de un producto específico en el carrito.
       * Propósito: Consultar la cantidad de un producto sin modificar el estado.
       * Lógica: Busca el item por ID y retorna su cantidad, o 0 si no existe.
       * Entradas: productId (string) - ID del producto a consultar.
       * Salidas: number - Cantidad del producto en el carrito.
       * Dependencias: Estado actual del carrito.
       * Efectos secundarios: Ninguno.
       */
  /**
   * Obtiene la cantidad actual de un producto específico en el carrito.
   * @param productId ID del producto
   * @returns cantidad actual
   */
  getItemQuantity: (productId) => {
        const item = get().cart.items.find(
          (item) => item.product.id === productId
        );
        return item ? item.quantity : 0;
      },

      /**
       * Verifica si el carrito contiene algún producto.
       * Propósito: Determinar si el carrito tiene items para mostrar indicadores.
       * Lógica: Verifica si el array de items tiene longitud > 0.
       * Entradas: Ninguna.
       * Salidas: boolean - True si hay productos, false si está vacío.
       * Dependencias: Estado actual del carrito.
       * Efectos secundarios: Ninguno.
       */
  /**
   * Verifica si el carrito contiene algún producto.
   * @returns true si hay productos, false si está vacío
   */
  hasItems: () => get().cart.items.length > 0,
    })),
    {
      name: 'pureza-naturalis-cart-storage',
      version: 2,
    }
  )
);
