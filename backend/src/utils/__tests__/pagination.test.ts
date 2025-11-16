import { describe, expect, it } from 'vitest';
import { PaginationBuilder } from '../pagination';

describe('PaginationBuilder', () => {
  it('paginates data respetando el límite', () => {
    const builder = new PaginationBuilder<{ id: number; name: string }>();
    const data = Array.from({ length: 25 }, (_, index) => ({ id: index + 1, name: `Item ${index + 1}` }));

    const result = builder.build({ limit: 10 }, data);

    expect(result.data).toHaveLength(10);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe(10);
    expect(result.prevCursor).toBeNull();
  });

  it('detecta última página y no genera nextCursor', () => {
    const builder = new PaginationBuilder<{ id: number }>();
    const data = Array.from({ length: 4 }, (_, index) => ({ id: index + 1 }));

    const result = builder.build({ limit: 10 }, data);

    expect(result.data).toHaveLength(4);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });
});
