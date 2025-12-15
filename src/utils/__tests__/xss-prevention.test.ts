import { describe, it, expect } from 'vitest';
import { safeJSONLDSerialization } from '../security';

// Simulación de la función vulnerable para contraste
const vulnerableSerialization = (data: any) => JSON.stringify(data);

describe('XSS Prevention in JSON Serialization', () => {
  it('should escape malicious script tags in JSON', () => {
    const maliciousData = {
      name: "Product </script><script>alert('XSS')</script>",
      description: 'A safe product',
    };

    const vulnerableOutput = vulnerableSerialization(maliciousData);
    // Este output es peligroso
    expect(vulnerableOutput).toContain(
      "</script><script>alert('XSS')</script>"
    );

    const safeOutput = safeJSONLDSerialization(maliciousData);
    // Este output es seguro
    expect(safeOutput).not.toContain('</script>');
    expect(safeOutput).toContain('\\u003c/script\\u003e');
  });

  it('should produce valid JSON parsable by browsers', () => {
    const data = { key: '<b>bold</b>' };
    const safeOutput = safeJSONLDSerialization(data);
    const parsed = JSON.parse(safeOutput);
    expect(parsed.key).toBe('<b>bold</b>');
  });
});
