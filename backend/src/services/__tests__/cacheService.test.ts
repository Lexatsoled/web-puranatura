import { describe, expect, it, beforeEach } from 'vitest';
import { CacheService } from '../cacheService';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(async () => {
    cache = new CacheService();
    await cache.clear();
  });

  it('guarda y recupera valores', async () => {
    await cache.set('test-key', { foo: 'bar' }, 60);
    const value = await cache.get<{ foo: string }>('test-key');
    expect(value).toEqual({ foo: 'bar' });
  });

  it('retorna null para claves expiradas', async () => {
    await cache.set('expires-key', 'value', 1);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const value = await cache.get('expires-key');
    expect(value).toBeNull();
  });

  it('elimina claves correctamente', async () => {
    await cache.set('delete-me', 'value', 60);
    await cache.delete('delete-me');
    const value = await cache.get('delete-me');
    expect(value).toBeNull();
  });

  it('wrap evita ejecuciones repetidas', async () => {
    let callCount = 0;
    const fn = async () => {
      callCount += 1;
      return { result: 'data' };
    };

    const result1 = await cache.wrap('wrap-key', fn, 60);
    const result2 = await cache.wrap('wrap-key', fn, 60);

    expect(callCount).toBe(1);
    expect(result1).toEqual(result2);
  });
});
