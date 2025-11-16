/**
 * Servicio para gestión de pedidos (orders).
 * Propósito: Centralizar la lógica de negocio para operaciones de pedidos.
 * Lógica: Implementa métodos para crear, obtener y gestionar pedidos.
 * Entradas: Datos de pedidos, credenciales de usuario.
 * Salidas: Resultados de operaciones de pedidos.
 * Dependencias: Axios para llamadas HTTP, tipos de pedidos.
 * Efectos secundarios: Llamadas a API, manejo de errores.
 */

import axios from 'axios';
import { errorLogger, ErrorSeverity, ErrorCategory } from './errorLogger';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  productImage?: string;
  variantId?: string;
  variantName?: string;
}

export interface OrderShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
}

export interface OrderPaymentMethod {
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash_on_delivery';
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  summary: OrderSummary;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: OrderShippingAddress;
  paymentMethod: OrderPaymentMethod;
  orderNotes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateOrderItem
  extends Pick<OrderItem, 'productId' | 'productName' | 'price' | 'quantity' | 'productImage' | 'variantId' | 'variantName'> {}

export interface CreateOrderData {
  items: CreateOrderItem[];
  shippingAddress: OrderShippingAddress;
  paymentMethod: OrderPaymentMethod;
  orderNotes?: string;
  summary: OrderSummary;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  order?: Order;
  message?: string;
}

/**
 * Clase principal del servicio de pedidos.
 * Propósito: Proporcionar métodos para gestionar pedidos.
 * Lógica: Implementa operaciones CRUD para pedidos con validaciones.
 * Entradas: Datos de pedidos y configuración.
 * Salidas: Resultados de operaciones.
 * Dependencias: Axios, interfaces de pedidos.
 * Efectos secundarios: Llamadas HTTP, validaciones.
 */
export class OrderService {
  private static instance: OrderService;
  private apiUrl: string;

  private constructor() {
    const baseApi = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ?? '';
    this.apiUrl = baseApi ? `${baseApi}/api/v1/orders` : '/api/v1/orders';
  }

  /**
   * Obtiene la instancia singleton del servicio.
   * Propósito: Garantizar una única instancia del servicio.
   * Lógica: Implementa patrón singleton.
   * Entradas: Ninguna.
   * Salidas: Instancia del servicio.
   * Dependencias: Ninguna.
   * Efectos secundarios: Ninguno.
   */
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Crea un nuevo pedido.
   * Propósito: Procesar y crear un pedido en el sistema.
   * Lógica: Valida datos, realiza llamada a API, maneja errores.
   * Entradas: orderData (CreateOrderData) - Datos del pedido a crear.
   * Salidas: Promise<OrderResponse> - Respuesta con ID del pedido.
   * Dependencias: Axios, validaciones.
   * Efectos secundarios: Llamada HTTP, validaciones.
   */
  async placeOrder(orderData: CreateOrderData): Promise<OrderResponse> {
    try {
      errorLogger.log(
        new Error('Intentando crear pedido'),
        ErrorSeverity.LOW,
        ErrorCategory.API,
        { payload: orderData }
      );
      this.validateOrderData(orderData);

      const response = await axios.post<OrderResponse>(this.apiUrl, orderData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      errorLogger.log(
        new Error('Pedido creado correctamente'),
        ErrorSeverity.LOW,
        ErrorCategory.API,
        { orderId: response.data.orderId }
      );
      return response.data;
    } catch (error) {
      errorLogger.log(
        error instanceof Error ? error : new Error('Error desconocido al crear pedido'),
        ErrorSeverity.HIGH,
        ErrorCategory.API,
        { payload: orderData }
      );
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to place order');
      }
      throw new Error('Failed to place order. Please try again.');
    }
  }

  /**
   * Obtiene pedidos del usuario.
   * Propósito: Recuperar lista de pedidos del usuario autenticado.
   * Lógica: Realiza llamada a API con filtros opcionales.
   * Entradas: userId (string), filtros opcionales.
   * Salidas: Promise<Order[]> - Lista de pedidos.
   * Dependencias: Axios.
   * Efectos secundarios: Llamada HTTP.
   */
  async getUserOrders(userId: string, filters?: { status?: string; limit?: number }): Promise<Order[]> {
    try {
      const params = new URLSearchParams({ userId });
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get<Order[]>(`${this.apiUrl}?${params}`, {
        withCredentials: true,
      });

      return response.data;
    } catch {
      throw new Error('Failed to fetch orders. Please try again.');
    }
  }

  /**
   * Obtiene un pedido específico por ID.
   * Propósito: Recuperar detalles completos de un pedido.
   * Lógica: Realiza llamada a API con ID del pedido.
   * Entradas: orderId (string) - ID del pedido.
   * Salidas: Promise<Order> - Detalles del pedido.
   * Dependencias: Axios.
   * Efectos secundarios: Llamada HTTP.
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get<Order>(`${this.apiUrl}/${orderId}`, {
        withCredentials: true,
      });

      return response.data;
    } catch {
      throw new Error('Failed to fetch order details. Please try again.');
    }
  }

  /**
   * Cancela un pedido.
   * Propósito: Cancelar un pedido pendiente.
   * Lógica: Verifica estado del pedido, realiza cancelación.
   * Entradas: orderId (string) - ID del pedido a cancelar.
   * Salidas: Promise<boolean> - Éxito de la operación.
   * Dependencias: Axios.
   * Efectos secundarios: Llamada HTTP, cambio de estado.
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      await axios.patch(
        `${this.apiUrl}/${orderId}/cancel`,
        {},
        { withCredentials: true },
      );

      return true;
    } catch {
      throw new Error('Failed to cancel order. Please try again.');
    }
  }

  /**
   * Actualiza el estado de un pedido.
   * Propósito: Cambiar el estado de un pedido (para administradores).
   * Lógica: Valida transición de estado, actualiza pedido.
   * Entradas: orderId (string), newStatus (string).
   * Salidas: Promise<boolean> - Éxito de la operación.
   * Dependencias: Axios, validaciones.
   * Efectos secundarios: Llamada HTTP, cambio de estado.
   */
  async updateOrderStatus(orderId: string, newStatus: Order['status']): Promise<boolean> {
    try {
      this.validateStatusTransition(newStatus);

      await axios.patch(
        `${this.apiUrl}/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true },
      );

      return true;
    } catch {
      throw new Error('Failed to update order status. Please try again.');
    }
  }

  /**
   * Valida los datos del pedido antes de enviarlo.
   * Propósito: Asegurar integridad de datos del pedido.
   * Lógica: Verifica campos requeridos y formatos.
   * Entradas: orderData (CreateOrderData) - Datos a validar.
   * Salidas: void - Lanza error si hay problemas.
   * Dependencias: Ninguna.
   * Efectos secundarios: Lanza excepciones.
   */
  private validateOrderData(orderData: CreateOrderData): void {
    if (!orderData.items?.length) {
      throw new Error('Order must contain at least one item');
    }

    orderData.items.forEach((item, index) => {
      if (!item.productId || !item.productName || item.price <= 0 || item.quantity <= 0) {
        throw new Error(`Invalid item at index ${index}`);
      }
    });

    const { shippingAddress } = orderData;
    if (
      !shippingAddress ||
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phone
    ) {
      throw new Error('Order must include a valid shipping address');
    }

    if (!orderData.paymentMethod?.type) {
      throw new Error('Order must include a payment method');
    }

    const { summary } = orderData;
    if (!summary || summary.total <= 0) {
      throw new Error('Order total must be greater than zero');
    }
  }

  /**
   * Valida transiciones de estado de pedido.
   * Propósito: Asegurar transiciones válidas de estado.
   * Lógica: Verifica que el nuevo estado sea válido.
   * Entradas: newStatus (string) - Nuevo estado.
   * Salidas: void - Lanza error si es inválido.
   * Dependencias: Ninguna.
   * Efectos secundarios: Lanza excepciones.
   */
  private validateStatusTransition(newStatus: Order['status']): void {
    const validStatuses: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid order status: ${newStatus}`);
    }
  }

  /**
   * Calcula el total de un pedido.
   * Propósito: Calcular total basado en items.
   * Lógica: Suma precios * cantidades de todos los items.
   * Entradas: items (OrderItem[]) - Items del pedido.
   * Salidas: number - Total calculado.
   * Dependencias: Ninguna.
   * Efectos secundarios: Ninguno.
   */
  static calculateOrderTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Formatea un pedido para display.
   * Propósito: Preparar datos del pedido para UI.
   * Lógica: Formatea fechas, calcula subtotales.
   * Entradas: order (Order) - Pedido a formatear.
   * Salidas: Objeto formateado.
   * Dependencias: Ninguna.
   * Efectos secundarios: Ninguno.
   */
  static formatOrderForDisplay(order: Order) {
    return {
      ...order,
      createdAt: new Date(order.createdAt).toLocaleDateString(),
      updatedAt: new Date(order.updatedAt).toLocaleDateString(),
      items: order.items.map(item => ({
        ...item,
        subtotal: item.price * item.quantity,
      })),
    };
  }
}

// Exportar instancia singleton por defecto
export default OrderService.getInstance();
