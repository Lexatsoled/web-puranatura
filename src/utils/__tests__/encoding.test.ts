/**
 * Tests para utilidades de encoding y protección contra mojibake
 * Propósito: Validar detección, prevención y corrección de problemas de encoding
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeText,
  hasMojibake,
  sanitizeForStorage,
  sanitizeObject,
  useEncodingSanitizer,
  detectEncoding,
  analyzeEncodingIssues,
  isValidUTF8,
} from '../encoding';

describe('encoding utilities', () => {
  describe('normalizeText', () => {
    it('debe corregir vocales con tilde minúsculas', () => {
      expect(normalizeText('\u00C3\u00A1')).toBe('á');
      expect(normalizeText('\u00C3\u00A9')).toBe('é');
      expect(normalizeText('\u00C3\u00AD')).toBe('í');
      expect(normalizeText('\u00C3\u00B3')).toBe('ó');
      expect(normalizeText('\u00C3\u00BA')).toBe('ú');
    });

    it('debe corregir vocales con tilde mayúsculas', () => {
      expect(normalizeText('\u00C3\u0081')).toBe('Á');
      expect(normalizeText('\u00C3\u0089')).toBe('É');
      expect(normalizeText('\u00C3\u008D')).toBe('Í');
      expect(normalizeText('\u00C3\u0093')).toBe('Ó');
      expect(normalizeText('\u00C3\u009A')).toBe('Ú');
    });

    it('debe corregir la ñ', () => {
      expect(normalizeText('\u00C3\u00B1')).toBe('ñ');
      expect(normalizeText('\u00C3\u0091')).toBe('Ñ');
    });

    it('debe corregir signos de puntuación español', () => {
      expect(normalizeText('\u00C2\u00BF')).toBe('¿');
      expect(normalizeText('\u00C2\u00A1')).toBe('¡');
    });

    it('debe corregir texto completo con mojibake', () => {
      const corrupted = '\u00C2\u00BFC\u00C3\u00B3mo est\u00C3\u00A1s?';
      const expected = '¿Cómo estás?';
      expect(normalizeText(corrupted)).toBe(expected);
    });

    it('debe manejar texto sin mojibake sin cambios', () => {
      const clean = 'Hola mundo';
      expect(normalizeText(clean)).toBe(clean);
    });

    it('debe manejar texto con caracteres especiales limpios', () => {
      const clean = '¿Cómo estás? ¡Bien!';
      expect(normalizeText(clean)).toBe(clean);
    });

    it('debe manejar strings vacíos', () => {
      expect(normalizeText('')).toBe('');
    });

    it('debe manejar valores no-string', () => {
      // @ts-expect-error - testing invalid input
      expect(normalizeText(null)).toBe(null);
      // @ts-expect-error - testing invalid input
      expect(normalizeText(undefined)).toBe(undefined);
    });
  });

  describe('hasMojibake', () => {
    it('debe detectar mojibake en vocales', () => {
      expect(hasMojibake('\u00C3\u00A1')).toBe(true);
      expect(hasMojibake('\u00C3\u00A9')).toBe(true);
      expect(hasMojibake('\u00C3\u00AD')).toBe(true);
    });

    it('debe detectar mojibake en signos de puntuación', () => {
      expect(hasMojibake('\u00C2\u00BF')).toBe(true);
      expect(hasMojibake('\u00C2\u00A1')).toBe(true);
    });

    it('debe detectar mojibake en comillas corruptas', () => {
      expect(hasMojibake('\u00E2\u0080\u009C')).toBe(true);
      expect(hasMojibake('\u00E2\u0080\u009D')).toBe(true);
    });

    it('no debe detectar mojibake en texto limpio', () => {
      expect(hasMojibake('Hola mundo')).toBe(false);
      expect(hasMojibake('¿Cómo estás?')).toBe(false);
      expect(hasMojibake('España, México, Perú')).toBe(false);
    });

    it('debe manejar strings vacíos', () => {
      expect(hasMojibake('')).toBe(false);
    });

    it('debe manejar valores no-string', () => {
      // @ts-expect-error - testing invalid input
      expect(hasMojibake(null)).toBe(false);
      // @ts-expect-error - testing invalid input
      expect(hasMojibake(undefined)).toBe(false);
    });
  });

  describe('sanitizeForStorage', () => {
    it('debe corregir automáticamente mojibake detectado', () => {
      const corrupted = '\u00C3\u00A1';
      const result = sanitizeForStorage(corrupted);
      expect(result).toBe('á');
    });

    it('debe normalizar texto limpio sin cambios', () => {
      const clean = 'Hola mundo';
      expect(sanitizeForStorage(clean)).toBe(clean);
    });

    it('debe aplicar normalización NFC a texto limpio', () => {
      // Caracteres compuestos vs descompuestos
      const decomposed = 'café'; // e + combining acute
      const composed = 'café'; // precomposed é
      expect(sanitizeForStorage(decomposed)).toBe(composed);
    });

    it('debe manejar valores no-string', () => {
      // @ts-expect-error - testing invalid input
      expect(sanitizeForStorage(null)).toBe(null);
      // @ts-expect-error - testing invalid input
      expect(sanitizeForStorage(undefined)).toBe(undefined);
    });
  });

  describe('sanitizeObject', () => {
    it('debe sanitizar todos los strings de un objeto plano', () => {
      const input = {
        name: '\u00C3\u00A1ngel',
        description: '\u00C2\u00BFC\u00C3\u00B3mo?',
        age: 25,
      };
      
      const result = sanitizeObject(input);
      
      expect(result.name).toBe('ángel');
      expect(result.description).toBe('¿Cómo?');
      expect(result.age).toBe(25);
    });

    it('debe sanitizar strings en arrays', () => {
      const input = {
        tags: ['\u00C3\u00A1rbol', '\u00C3\u00B1andú', 'normal'],
        count: 3,
      };
      
      const result = sanitizeObject(input);
      
      expect(result.tags).toEqual(['árbol', 'ñandú', 'normal']);
      expect(result.count).toBe(3);
    });

    it('debe sanitizar objetos anidados', () => {
      const input = {
        user: {
          name: '\u00C3\u00A1ngel',
          address: {
            city: 'M\u00C3\u00A9xico',
          },
        },
      };
      
      const result = sanitizeObject(input);
      
      expect(result.user).toEqual({
        name: 'ángel',
        address: {
          city: 'México',
        },
      });
    });

    it('debe sanitizar arrays de objetos', () => {
      const input = {
        users: [
          { name: '\u00C3\u00A1ngel' },
          { name: 'Mar\u00C3\u00ADa' },
        ],
      };
      
      const result = sanitizeObject(input);
      
      expect(result.users).toEqual([
        { name: 'ángel' },
        { name: 'María' },
      ]);
    });

    it('debe manejar objetos vacíos', () => {
      expect(sanitizeObject({})).toEqual({});
    });

    it('debe manejar null/undefined', () => {
      // @ts-expect-error - testing invalid input
      expect(sanitizeObject(null)).toBe(null);
      // @ts-expect-error - testing invalid input
      expect(sanitizeObject(undefined)).toBe(undefined);
    });
  });

  describe('useEncodingSanitizer', () => {
    it('debe proporcionar función sanitizeFormData', () => {
      const sanitizer = useEncodingSanitizer();
      const input = {
        name: '\u00C3\u00A1ngel',
        email: 'test@example.com',
      };
      
      const result = sanitizer.sanitizeFormData(input);
      
      expect(result.name).toBe('ángel');
      expect(result.email).toBe('test@example.com');
    });

    it('debe proporcionar función sanitizeField', () => {
      const sanitizer = useEncodingSanitizer();
      const result = sanitizer.sanitizeField('\u00C3\u00A1ngel');
      
      expect(result).toBe('ángel');
    });

    it('debe proporcionar función validateField', () => {
      const sanitizer = useEncodingSanitizer();
      
      // Campo con mojibake
      const invalid = sanitizer.validateField('\u00C3\u00A1');
      expect(invalid.valid).toBe(false);
      expect(invalid.message).toBeDefined();
      
      // Campo limpio
      const valid = sanitizer.validateField('angel');
      expect(valid.valid).toBe(true);
      expect(valid.message).toBeUndefined();
    });
  });

  describe('detectEncoding', () => {
    it('debe detectar UTF-8 con BOM', () => {
      const withBOM = '\uFEFF' + 'content';
      const result = detectEncoding(withBOM);
      
      expect(result.hasBOM).toBe(true);
      expect(result.encoding).toBe('UTF-8');
      expect(result.needsFix).toBe(true);
    });

    it('debe detectar contenido sin BOM pero con mojibake', () => {
      const withMojibake = '\u00C3\u00A1ngel';
      const result = detectEncoding(withMojibake);
      
      expect(result.needsFix).toBe(true);
    });

    it('debe aprobar contenido limpio sin BOM', () => {
      const clean = 'content';
      const result = detectEncoding(clean);
      
      expect(result.hasBOM).toBe(false);
      expect(result.needsFix).toBe(false);
    });
  });

  describe('analyzeEncodingIssues', () => {
    it('debe retornar array vacío para texto limpio', () => {
      const result = analyzeEncodingIssues('Hola mundo');
      expect(result).toEqual([]);
    });

    it('debe identificar posición y sugerencia de corrección', () => {
      const text = 'Hola \u00C3\u00A1ngel';
      const result = analyzeEncodingIssues(text);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('position');
      expect(result[0]).toHaveProperty('char');
      expect(result[0]).toHaveProperty('suggestion');
      expect(result[0].suggestion).toBe('á');
    });

    it('debe ordenar problemas por posición', () => {
      const text = '\u00C3\u00A1 y \u00C3\u00A9';
      const result = analyzeEncodingIssues(text);
      
      expect(result.length).toBe(2);
      expect(result[0].position).toBeLessThan(result[1].position);
    });
  });

  describe('isValidUTF8', () => {
    it('debe validar texto UTF-8 correcto', () => {
      expect(isValidUTF8('Hola mundo')).toBe(true);
      expect(isValidUTF8('¿Cómo estás?')).toBe(true);
      expect(isValidUTF8('España 🇪🇸')).toBe(true);
    });

    it('debe validar strings vacíos', () => {
      expect(isValidUTF8('')).toBe(true);
    });

    it('debe validar caracteres especiales', () => {
      expect(isValidUTF8('😀')).toBe(true);
      expect(isValidUTF8('中文')).toBe(true);
      expect(isValidUTF8('العربية')).toBe(true);
    });
  });

  describe('integración completa', () => {
    it('debe manejar un flujo completo de detección y corrección', () => {
      const corrupted = '\u00C2\u00BFC\u00C3\u00B3mo est\u00C3\u00A1s?';
      
      // Detectar mojibake
      expect(hasMojibake(corrupted)).toBe(true);
      
      // Analizar problemas
      const issues = analyzeEncodingIssues(corrupted);
      expect(issues.length).toBeGreaterThan(0);
      
      // Corregir
      const corrected = normalizeText(corrupted);
      expect(corrected).toBe('¿Cómo estás?');
      
      // Verificar que ya no tiene mojibake
      expect(hasMojibake(corrected)).toBe(false);
    });

    it('debe sanitizar un objeto complejo de formulario', () => {
      const formData = {
        title: '\u00C2\u00BFC\u00C3\u00B3mo funciona?',
        description: 'Descripci\u00C3\u00B3n del producto',
        metadata: {
          tags: ['espa\u00C3\u00B1ol', 'ingl\u00C3\u00A9s'],
          author: {
            name: '\u00C3\u00A1ngel',
            bio: 'Experto en tecnolog\u00C3\u00ADa',
          },
        },
        price: 99.99,
        active: true,
      };
      
      const sanitized = sanitizeObject(formData);
      
      expect(sanitized).toEqual({
        title: '¿Cómo funciona?',
        description: 'Descripción del producto',
        metadata: {
          tags: ['español', 'inglés'],
          author: {
            name: 'ángel',
            bio: 'Experto en tecnología',
          },
        },
        price: 99.99,
        active: true,
      });
    });
  });
});
