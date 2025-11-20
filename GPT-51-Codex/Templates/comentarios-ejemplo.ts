/**
 * Gestor del carrito global.
 * - Persiste el estado en localStorage para evitar perderlo al recargar.
 * - Expone helpers desacoplados (add/remove) usados por modales y pages.
 */
export function useCartStore() {
  // TODO(T1.4): sincronizar con backend cuando exista la API real.
  const cart = getCartFromStorage();

  /**
   * Agrega un producto al carrito fusionando cantidades.
   * Se usa en ProductCard y en el modal de detalle.
   */
  function add(productId: string, qty = 1) {
    // Si ya existe, sumamos cantidades para evitar duplicados.
    cart.items[productId] = (cart.items[productId] ?? 0) + qty;
    save(cart);
  }

  return { add };
}
