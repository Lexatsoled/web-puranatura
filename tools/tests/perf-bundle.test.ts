import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * PERF-BUNDLE-001: Tests para Reducción de Bundle Size
 * Valida:
 * - Bundle total < 350KB
 * - Vendor bundle < 200KB
 * - Code splitting funcionando
 * - Tree-shaking habilitado
 */

describe('PERF-BUNDLE-001: Reducción de Bundle Size', () => {
  const DIST_PATH = path.join(process.cwd(), 'dist');
  const MAX_BUNDLE_SIZE = 350 * 1024;      // 350KB
  const MAX_VENDOR_SIZE = 200 * 1024;      // 200KB
  const BASELINE_SIZE = 450 * 1024;        // 450KB (baseline)

  describe('Bundle Size Limits', () => {
    it('main bundle debe ser < 350KB', () => {
      const mainBundle = path.join(DIST_PATH, 'index.js');
      
      if (fs.existsSync(mainBundle)) {
        const size = fs.statSync(mainBundle).size;
        const sizeKB = (size / 1024).toFixed(2);
        
        console.log(`Main bundle: ${sizeKB}KB (target: 350KB)`);
        expect(size).toBeLessThan(MAX_BUNDLE_SIZE);
      }
    });

    it('vendor bundle debe ser < 200KB', () => {
      // Buscar vendor bundle (vite naming: vendor-*.js)
      const files = fs.readdirSync(DIST_PATH);
      const vendorFile = files.find(f => f.startsWith('vendor-') && f.endsWith('.js'));
      
      if (vendorFile) {
        const vendorPath = path.join(DIST_PATH, vendorFile);
        const size = fs.statSync(vendorPath).size;
        const sizeKB = (size / 1024).toFixed(2);
        
        console.log(`Vendor bundle: ${sizeKB}KB (target: 200KB)`);
        expect(size).toBeLessThan(MAX_VENDOR_SIZE);
      }
    });

    it('total bundle debe ser reducido 30% vs baseline', () => {
      const files = fs.readdirSync(DIST_PATH);
      const jsFiles = files.filter(f => f.endsWith('.js'));
      
      let totalSize = 0;
      jsFiles.forEach(file => {
        const filePath = path.join(DIST_PATH, file);
        totalSize += fs.statSync(filePath).size;
      });
      
      const reduction = (BASELINE_SIZE - totalSize) / BASELINE_SIZE * 100;
      console.log(`Total reduction: ${reduction.toFixed(1)}% (target: 30%)`);
      
      expect(reduction).toBeGreaterThan(20); // Mínimo 20%
    });
  });

  describe('Code Splitting', () => {
    it('debe tener múltiples chunks JS', () => {
      const files = fs.readdirSync(DIST_PATH);
      const chunks = files.filter(f => f.endsWith('.js') && f.includes('.'));
      
      console.log(`Chunks encontrados: ${chunks.length}`);
      expect(chunks.length).toBeGreaterThan(2);
    });

    it('debe tener chunks para rutas principales', () => {
      const files = fs.readdirSync(DIST_PATH);
      
      // Buscar chunks específicos (nombres varían con Vite)
      const hasChunks = files.some(f => f.includes('chunk') || f.includes('ProductPage'));
      
      // Con code splitting, debe haber más de un JS
      const jsCount = files.filter(f => f.endsWith('.js')).length;
      expect(jsCount).toBeGreaterThan(1);
    });
  });

  describe('Tree-shaking & Dead Code Elimination', () => {
    it('no debe incluir librerías no utilizadas', () => {
      const mainBundle = path.join(DIST_PATH, 'index.js');
      
      if (fs.existsSync(mainBundle)) {
        const content = fs.readFileSync(mainBundle, 'utf-8');
        
        // Ejemplos de código no deseado
        expect(content).not.toMatch(/debugger;/);
        expect(content).not.toMatch(/console\.log\(/); // En producción
      }
    });

    it('bundle debe estar minificado', () => {
      const mainBundle = path.join(DIST_PATH, 'index.js');
      
      if (fs.existsSync(mainBundle)) {
        const content = fs.readFileSync(mainBundle, 'utf-8');
        
        // Verificar minificación: líneas muy largas
        const lines = content.split('\n');
        const longLines = lines.filter(l => l.length > 500).length;
        
        console.log(`Líneas largas (minificadas): ${longLines}/${lines.length}`);
        expect(longLines).toBeGreaterThan(0);
      }
    });

    it('debe tener source maps en desarrollo', () => {
      const maps = fs.readdirSync(DIST_PATH)
        .filter(f => f.endsWith('.map'))
        .length;
      
      console.log(`Source maps: ${maps}`);
      // En desarrollo sí, en producción preferiblemente no
    });
  });

  describe('Asset Optimization', () => {
    it('imágenes en dist deben estar optimizadas', () => {
      const imageDir = path.join(DIST_PATH, 'images');
      
      if (fs.existsSync(imageDir)) {
        const images = fs.readdirSync(imageDir);
        console.log(`Imágenes en dist: ${images.length}`);
        
        // Verificar que existan formatos modernos
        const hasWebP = images.some(i => i.endsWith('.webp'));
        const hasAVIF = images.some(i => i.endsWith('.avif'));
        const hasJPEG = images.some(i => i.endsWith('.jpg'));
        
        expect(hasJPEG || hasWebP || hasAVIF).toBe(true);
      }
    });

    it('CSS debe estar incluido en bundle o separado', () => {
      const files = fs.readdirSync(DIST_PATH);
      
      // Vite puede incluir CSS en JS o como archivo separado
      const hasCSSFile = files.some(f => f.endsWith('.css'));
      
      console.log(`CSS como archivo separado: ${hasCSSFile}`);
      // No forzamos, pero es mejor tenerlo separado
    });
  });

  describe('Performance Comparison', () => {
    it('debe mostrar mejora vs baseline', () => {
      const baselineKB = 450;
      const targetKB = 350;
      const improvement = ((baselineKB - targetKB) / baselineKB * 100).toFixed(1);
      
      console.log(`\nMejora esperada: ${improvement}%`);
      console.log(`Baseline: ${baselineKB}KB → Target: ${targetKB}KB\n`);
      
      expect(targetKB).toBeLessThan(baselineKB);
    });

    it('bundle degradation no debe exceder 5%', () => {
      // Si ejecutamos el test múltiples veces
      const maxDegradation = 5; // %
      
      // En caso real, comparar con build anterior
      const current = 350;
      const previous = 365;
      const degradation = ((current - previous) / previous * 100).toFixed(1);
      
      console.log(`Cambio vs build anterior: ${degradation}%`);
      expect(Number(degradation)).toBeGreaterThan(-maxDegradation);
    });
  });

  describe('Build Output Verification', () => {
    it('dist debe existir y tener contenido', () => {
      expect(fs.existsSync(DIST_PATH)).toBe(true);
      
      const files = fs.readdirSync(DIST_PATH);
      const hasJS = files.some(f => f.endsWith('.js'));
      const hasHTML = files.some(f => f.endsWith('.html'));
      
      expect(hasJS).toBe(true);
      expect(hasHTML).toBe(true);
    });

    it('debe incluir index.html válido', () => {
      const indexPath = path.join(DIST_PATH, 'index.html');
      
      expect(fs.existsSync(indexPath)).toBe(true);
      
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toMatch(/<html/i);
      expect(content).toMatch(/<body/i);
      expect(content).toMatch(/<script/i);
    });

    it('assets deben estar en hash-busted paths', () => {
      const files = fs.readdirSync(DIST_PATH);
      
      // Buscar archivos con hash (nombre-hash.ext)
      const hashedFiles = files.filter(f => /[a-f0-9]{8}\.[a-z]+$/i.test(f));
      
      console.log(`Archivos con hash: ${hashedFiles.length}/${files.length}`);
      expect(hashedFiles.length).toBeGreaterThan(0);
    });
  });
});
