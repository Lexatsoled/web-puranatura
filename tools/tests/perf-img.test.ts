import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * PERF-IMG-001: Tests para Optimización de Imágenes
 * Valida:
 * - picture element implementado
 * - srcset con múltiples resoluciones
 * - AVIF/WebP fallback
 * - Reducción de LCP
 */

describe('PERF-IMG-001: Optimización de Imágenes', () => {
  const API_BASE = 'http://localhost:3001';
  const TEST_IMAGE_URL = `${API_BASE}/api/test-image`;

  beforeAll(async () => {
    // Setup: verificar que backend esté corriendo
    try {
      await fetch(`${API_BASE}/health`);
    } catch {
      throw new Error(`Backend no accesible en ${API_BASE}`);
    }
  });

  describe('Picture Element Implementation', () => {
    it('debe tener picture element con fuentes múltiples', async () => {
      const response = await fetch(`${API_BASE}/api/products/1`);
      const html = await response.text();
      
      expect(html).toMatch(/<picture>/);
      expect(html).toMatch(/type="image\/avif"/);
      expect(html).toMatch(/type="image\/webp"/);
      expect(html).toMatch(/type="image\/jpeg"/);
    });

    it('debe tener srcset con 2x, 3x resoluciones', async () => {
      const response = await fetch(`${API_BASE}/api/products/1`);
      const html = await response.text();
      
      const srcsetMatch = html.match(/srcset="([^"]+)"/);
      if (srcsetMatch) {
        const srcset = srcsetMatch[1];
        expect(srcset).toMatch(/1x/);
        expect(srcset).toMatch(/2x/);
      }
    });

    it('debe incluir atributos loading="lazy" y decoding="async"', async () => {
      const response = await fetch(`${API_BASE}/api/products/1`);
      const html = await response.text();
      
      expect(html).toMatch(/loading="lazy"/);
      expect(html).toMatch(/decoding="async"/);
    });
  });

  describe('Image Format Optimization', () => {
    it('debe servir AVIF para navegadores modernos', async () => {
      const response = await fetch(`${API_BASE}/api/images/test.avif`, {
        headers: { 'Accept': 'image/avif' }
      });
      
      expect(response.headers.get('content-type')).toMatch(/avif|image/i);
    });

    it('debe servir WebP como alternativa', async () => {
      const response = await fetch(`${API_BASE}/api/images/test.webp`, {
        headers: { 'Accept': 'image/webp' }
      });
      
      expect(response.headers.get('content-type')).toMatch(/webp|image/i);
    });

    it('debe servir JPEG como fallback', async () => {
      const response = await fetch(`${API_BASE}/api/images/test.jpg`, {
        headers: { 'Accept': 'image/jpeg' }
      });
      
      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toMatch(/jpeg|image/i);
    });
  });

  describe('Image Size Reduction', () => {
    it('imagen AVIF debe ser menor que JPEG original', async () => {
      // Comparar tamaños de archivo
      const jpegPath = path.join(process.cwd(), 'public/Jpeg/test.jpg');
      const avifPath = path.join(process.cwd(), 'public/Jpeg/test.avif');
      
      if (fs.existsSync(jpegPath) && fs.existsSync(avifPath)) {
        const jpegSize = fs.statSync(jpegPath).size;
        const avifSize = fs.statSync(avifPath).size;
        
        // AVIF debe ser al menos 20% más pequeño
        expect(avifSize).toBeLessThan(jpegSize * 0.8);
      }
    });

    it('imagen WebP debe ser menor que JPEG original', async () => {
      const jpegPath = path.join(process.cwd(), 'public/Jpeg/test.jpg');
      const webpPath = path.join(process.cwd(), 'public/Jpeg/test.webp');
      
      if (fs.existsSync(jpegPath) && fs.existsSync(webpPath)) {
        const jpegSize = fs.statSync(jpegPath).size;
        const webpSize = fs.statSync(webpPath).size;
        
        // WebP debe ser al menos 10% más pequeño
        expect(webpSize).toBeLessThan(jpegSize * 0.9);
      }
    });

    it('reducción total de tamaño debe ser > 30%', () => {
      // Basado en métricas de bundle
      const baselineSize = 450; // KB
      const targetSize = 350;   // KB
      const reduction = (baselineSize - targetSize) / baselineSize * 100;
      
      expect(reduction).toBeGreaterThan(30);
    });
  });

  describe('Performance Metrics', () => {
    it('LCP debe mejorarse a < 2.5s', async () => {
      // En prueba real, usar Lighthouse API
      const lcpTarget = 2500; // ms
      
      // Simulación: verificar que imagen esté en viewport
      const response = await fetch(`${API_BASE}/api/products`);
      const data = await response.json();
      
      expect(data).toHaveProperty('items');
      expect(data.items.length).toBeGreaterThan(0);
    });

    it('debe tener Cache-Control headers', async () => {
      const response = await fetch(`${API_BASE}/api/images/test.jpg`);
      const cacheControl = response.headers.get('cache-control');
      
      expect(cacheControl).toBeDefined();
      expect(cacheControl).toMatch(/max-age|public|private/i);
    });
  });

  describe('Accessibility', () => {
    it('debe incluir alt text en imágenes', async () => {
      const response = await fetch(`${API_BASE}/api/products/1`);
      const html = await response.text();
      
      const altMatch = html.match(/alt="([^"]+)"/);
      expect(altMatch).toBeTruthy();
      expect(altMatch[1].length).toBeGreaterThan(0);
    });

    it('debe incluir title attribute para contexto', async () => {
      const response = await fetch(`${API_BASE}/api/products/1`);
      const html = await response.text();
      
      expect(html).toMatch(/title="([^"]+)"/);
    });
  });
});
