import { describe, expect, it } from 'vitest';
import { signupSchema, productSearchQuerySchema } from '../validation';

describe('validation schemas', () => {
  it('sanitizes signup payload', () => {
    const result = signupSchema.parse({
      email: ' USER@Example.COM ',
      password: 'StrongPass1',
      name: '<b>Jane</b> Doe ',
    });

    expect(result.email).toBe('user@example.com');
    expect(result.name).toBe('Jane Doe');
  });

  it('sanitizes product search query', () => {
    const parsed = productSearchQuerySchema.parse({
      q: '  <h1>Hola</h1>  ',
      limit: '200',
    });

    expect(parsed.q).toBe('Hola');
    expect(parsed.limit).toBe(50); // clamp
  });
});
