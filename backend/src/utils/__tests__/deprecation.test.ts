import { describe, expect, it } from 'vitest';
import { calculateSunset } from '../deprecation.js';

describe('calculateSunset', () => {
  it('genera la fecha esperada en formato RFC 7234 sumando meses', () => {
    const months = 6;
    const baseline = new Date();
    const expected = new Date(baseline);
    expected.setUTCMonth(expected.getUTCMonth() + months);

    const headerValue = calculateSunset(months);
    const parsed = new Date(headerValue);

    expect(parsed.getUTCFullYear()).toBe(expected.getUTCFullYear());
    expect(parsed.getUTCMonth()).toBe(expected.getUTCMonth());
  });
});
