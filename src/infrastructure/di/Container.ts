/**
 * Container - Contenedor de inyección de dependencias.
 * NOTA: Arquitectura DDD/Clean eliminada - ahora se usa productStore (Zustand) + productApi
 * Este archivo permanece solo para legacy CartStorage.
 */

export type CartItem = { 
  product: { id: string }; 
  variantId?: string; 
  quantity: number; 
  unitPrice: number; 
  totalPrice?: number; 
  addedAt?: Date 
};

export interface CartStorage {
  addItem(item: CartItem): Promise<void>;
  removeItem(productId: string, variantId?: string): Promise<void>;
  updateQuantity(productId: string, quantity: number, variantId?: string): Promise<void>;
  getCartState(): Promise<{ items: CartItem[]; total: number; itemCount: number }>;
  clearCart(): Promise<void>;
}

/**
 * Clase Container - Implementa inyección de dependencias.
 * Propósito: Centralizar la gestión de dependencias del sistema.
 * Lógica: Registra y resuelve servicios usando patrón singleton.
 * Entradas: Solicitudes de resolución de servicios.
 * Salidas: Instancias de servicios.
 * Dependencias: Todas las clases del sistema.
 * Efectos secundarios: Cache de instancias.
 */
export class Container {
  private static instance: Container;
  private services = new Map<string, unknown>();

  /**
   * Obtiene la instancia singleton del contenedor.
   * Propósito: Garantizar una única instancia del contenedor.
   * Lógica: Implementa patrón singleton.
   * Entradas: Ninguna.
   * Salidas: Instancia del contenedor.
   * Dependencias: Ninguna.
   * Efectos secundarios: Ninguno.
   */
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Registra un servicio en el contenedor.
   * Propósito: Registrar implementaciones de servicios.
   * Lógica: Almacena la implementación en el mapa de servicios.
   * Entradas: Nombre del servicio e implementación.
   * Salidas: Ninguna.
   * Dependencias: Ninguna.
   * Efectos secundarios: Modificación del mapa de servicios.
   */
  register<T>(name: string, implementation: T): void {
    this.services.set(name, implementation);
  }

  /**
   * Resuelve un servicio del contenedor.
   * Propósito: Obtener instancia de servicio con dependencias resueltas.
   * Lógica: Busca en cache, si no existe crea nueva instancia.
   * Entradas: Nombre del servicio.
   * Salidas: Instancia del servicio.
   * Dependencias: Implementaciones registradas.
   * Efectos secundarios: Cache de instancias.
   */
  resolve<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }

    // Crear instancia si no existe
    const instance = this.createInstance(name);
    this.services.set(name, instance);
    return instance as T;
  }

  private createInstance(name: string): unknown {
    switch (name) {
      case 'CartStorage':
        return this.createCartStorage();
      default:
        throw new Error(`Servicio no registrado: ${name}`);
    }
  }

  /**
   * Crea el servicio de almacenamiento del carrito.
   * Propósito: Proporcionar implementación concreta del CartStorage.
   * Lógica: Implementa interfaz CartStorage usando localStorage.
   * Entradas: Ninguna.
   * Salidas: Implementación de CartStorage.
   * Dependencias: localStorage API.
   * Efectos secundarios: Persistencia en localStorage.
   */
  private createCartStorage(): CartStorage {
    type CartItem = { product: { id: string }; variantId?: string; quantity: number; unitPrice: number; totalPrice?: number; addedAt?: Date };
    const getStoredCart = (): {
      items: CartItem[];
      total: number;
      itemCount: number;
    } => {
      try {
        const stored = localStorage.getItem('pureza_cart');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Error reading cart - return empty
      }
      return { items: [], total: 0, itemCount: 0 };
    };

    const saveCart = (cart: {
      items: CartItem[];
      total: number;
      itemCount: number;
    }): void => {
      try {
        cart.total = cart.items.reduce((sum: number, item: CartItem) => sum + (item.totalPrice ?? item.unitPrice * item.quantity), 0);
        cart.itemCount = cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        localStorage.setItem('pureza_cart', JSON.stringify(cart));
      } catch {
        // Error saving cart - silently fail
      }
    };

    return {
      async addItem(item: CartItem): Promise<void> {
        const cart = getStoredCart();
        const existingIndex = cart.items.findIndex(
          (i: CartItem) =>
            i.product.id === item.product.id && i.variantId === item.variantId
        );

        if (existingIndex >= 0) {
          cart.items[existingIndex].quantity += item.quantity;
        } else {
          cart.items.push(item);
        }

        saveCart(cart);
      },

      async removeItem(productId: string, variantId?: string): Promise<void> {
        const cart = getStoredCart();
        cart.items = cart.items.filter((item: CartItem) => !(item.product.id === productId && item.variantId === variantId));
        saveCart(cart);
      },

      async updateQuantity(
        productId: string,
        quantity: number,
        variantId?: string
      ): Promise<void> {
        const cart = getStoredCart();
        const item = cart.items.find((i: CartItem) => i.product.id === productId && i.variantId === variantId);

        if (item) {
          item.quantity = quantity;
          item.totalPrice = item.unitPrice * quantity;
          saveCart(cart);
        }
      },

      async getCartState(): Promise<{
        items: CartItem[];
        total: number;
        itemCount: number;
      }> {
        const cart = getStoredCart();
        return {
          items: cart.items,
          total: cart.total,
          itemCount: cart.itemCount,
        };
      },

      async clearCart(): Promise<void> {
        localStorage.removeItem('pureza_cart');
      },
    };
  }

  /**
   * Limpia todas las instancias cacheadas.
   * Propósito: Resetear el contenedor para testing o reinicio.
   * Lógica: Vacía el mapa de servicios.
   * Entradas: Ninguna.
   * Salidas: Ninguna.
   * Dependencias: Ninguna.
   * Efectos secundarios: Pérdida de instancias cacheadas.
   */
  clear(): void {
    this.services.clear();
  }
}

/**
 * Función helper para obtener servicios del contenedor.
 * Propósito: Simplificar el acceso a servicios.
 * Lógica: Resuelve servicio usando el contenedor singleton.
 * Entradas: Nombre del servicio.
 * Salidas: Instancia del servicio.
 * Dependencias: Container singleton.
 * Efectos secundarios: Ninguno.
 */
export function getService<T>(name: string): T {
  return Container.getInstance().resolve<T>(name);
}

/**
 * Función helper para registrar servicios.
 * Propósito: Simplificar el registro de servicios.
 * Lógica: Registra servicio en el contenedor singleton.
 * Entradas: Nombre e implementación del servicio.
 * Salidas: Ninguna.
 * Dependencias: Container singleton.
 * Efectos secundarios: Registro en contenedor.
 */
export function registerService<T>(name: string, implementation: T): void {
  Container.getInstance().register(name, implementation);
}
