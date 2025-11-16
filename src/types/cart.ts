import { Product } from './product';

/**
 * Representa un elemento en el carrito de compras.
 * Propósito: Almacenar información de un producto específico en el carrito junto con su cantidad.
 * Lógica: Combina un producto con una cantidad numérica para representar una línea de pedido.
 * Entradas: Ninguna (es una estructura de datos).
 * Salidas: Ninguna (es una estructura de datos).
 * Dependencias: Depende del tipo Product importado desde './product'.
 * Efectos secundarios: Ninguno.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Representa el estado completo del carrito de compras.
 * Propósito: Mantener el estado del carrito incluyendo todos los elementos, el total y el conteo.
 * Lógica: Agrega un array de CartItem con cálculos de total y conteo para facilitar el manejo del carrito.
 * Entradas: Ninguna (es una estructura de datos).
 * Salidas: Ninguna (es una estructura de datos).
 * Dependencias: Depende de la interfaz CartItem.
 * Efectos secundarios: Ninguno.
 */
export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

/**
 * Define el tipo de contexto para las operaciones del carrito.
 * Propósito: Proporcionar una interfaz tipada para el contexto de React que maneja el carrito.
 * Lógica: Define métodos para manipular el carrito y acceder a su estado.
 * Entradas: Los métodos aceptan parámetros como Product, string, number según corresponda.
 * Salidas: Los métodos no retornan valores (void), excepto cart que retorna el estado.
 * Dependencias: Depende de las interfaces Cart y Product.
 * Efectos secundarios: Los métodos modifican el estado del carrito globalmente.
 */
export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
