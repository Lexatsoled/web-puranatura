/**
 * System Loader - Dynamic loading functions for systems
 * Loads system data on-demand to reduce initial bundle size
 */

import { System } from '@/types/system';
import { Product } from '@/types/product';

// Cache for loaded systems
let systemsCache: System[] | null = null;

/**
 * Load all systems dynamically
 */
export async function loadSystems(): Promise<System[]> {
  if (systemsCache) {
    return systemsCache;
  }

  const module = await import('./all-products');
  systemsCache = module.systems;
  return systemsCache;
}

/**
 * Load a specific system by ID
 */
export async function loadSystemById(id: string): Promise<System | undefined> {
  const systems = await loadSystems();
  return systems.find(system => system.id === id);
}

/**
 * Load products that belong to a specific system
 */
export async function loadProductsBySystem(systemId: string): Promise<Product[]> {
  const [{ systems }, { products }] = await Promise.all([
    import('./all-products'),
    import('./all-products')
  ]);

  const system = systems.find(s => s.id === systemId);
  if (!system) return [];

  return products.filter(p => system.products.includes(p.id));
}

/**
 * Load featured systems
 */
export async function loadFeaturedSystems(): Promise<System[]> {
  const systems = await loadSystems();
  return systems.filter(system => system.featured);
}

/**
 * Load related systems for a given system ID
 */
export async function loadRelatedSystems(systemId: string): Promise<System[]> {
  const systems = await loadSystems();
  const system = systems.find(s => s.id === systemId);
  
  if (!system || !system.relatedSystems) return [];

  return systems.filter(s => system.relatedSystems!.includes(s.id));
}

/**
 * Clear the systems cache
 */
export function clearSystemsCache(): void {
  systemsCache = null;
}

/**
 * Get cache statistics
 */
export function getSystemsCacheStats() {
  return {
    cached: systemsCache !== null,
    count: systemsCache?.length ?? 0
  };
}
