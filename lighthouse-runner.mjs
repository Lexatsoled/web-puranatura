#!/usr/bin/env node

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runLighthouse(url) {
  let chrome;
  try {
    console.log(`\n🚀 Iniciando análisis Lighthouse para: ${url}\n`);
    console.log('⏳ Por favor espera... esto toma 2-3 minutos\n');

    // Lanzar Chrome con flags seguros
    chrome = await chromeLauncher.launch({ 
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });

    // Opciones de Lighthouse
    const options = {
      logLevel: 'error',
      output: ['json', 'html'],
      port: chrome.port,
      emulatedFormFactor: 'mobile',
      throttlingMethod: 'simulate',
    };

    // Ejecutar auditoría
    const runnerResult = await lighthouse(url, options);

    // Crear directorio de reportes
    const reportDir = path.join(__dirname, 'lighthouse-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Timestamp para nombres únicos
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    // Guardar JSON
    const jsonFile = path.join(reportDir, `lighthouse-${timestamp}.json`);
    fs.writeFileSync(jsonFile, runnerResult.report[0]);

    // Guardar HTML
    const htmlFile = path.join(reportDir, `lighthouse-${timestamp}.html`);
    fs.writeFileSync(htmlFile, runnerResult.report[1]);

    // Mostrar scores
    const scores = runnerResult.lhr.categories;
    console.log('✅ ANÁLISIS COMPLETADO\n');
    console.log('📊 SCORES:\n');
    console.log(`  Performance:    ${String(Math.round(scores.performance.score * 100)).padStart(2)} ${getEmoji(scores.performance.score)}`);
    console.log(`  Accessibility:  ${String(Math.round(scores.accessibility.score * 100)).padStart(2)} ${getEmoji(scores.accessibility.score)}`);
    console.log(`  Best Practices: ${String(Math.round(scores['best-practices'].score * 100)).padStart(2)} ${getEmoji(scores['best-practices'].score)}`);
    console.log(`  SEO:            ${String(Math.round(scores.seo.score * 100)).padStart(2)} ${getEmoji(scores.seo.score)}`);
    console.log(`  PWA:            ${String(Math.round(scores.pwa.score * 100)).padStart(2)} ${getEmoji(scores.pwa.score)}\n`);

    // Mostrar Core Web Vitals
    const audit = runnerResult.lhr.audits;
    console.log('⚡ CORE WEB VITALS:\n');
    if (audit['largest-contentful-paint']) {
      console.log(`  LCP: ${audit['largest-contentful-paint'].displayValue}`);
    }
    if (audit['interaction-to-next-paint']) {
      console.log(`  INP: ${audit['interaction-to-next-paint'].displayValue}`);
    }
    if (audit['cumulative-layout-shift']) {
      console.log(`  CLS: ${audit['cumulative-layout-shift'].displayValue}`);
    }
    console.log();

    console.log('📁 Reportes guardados:\n');
    console.log(`  JSON: ${jsonFile}`);
    console.log(`  HTML: ${htmlFile}\n`);

  } catch (error) {
    console.error('\n❌ Error ejecutando Lighthouse:', error.message);
    process.exit(1);
  } finally {
    // Cerrar Chrome
    if (chrome) {
      try {
        await chrome.kill();
      } catch (e) {
        // Chrome ya cerrado
      }
    }
  }
}

function getEmoji(score) {
  if (score >= 0.9) return '🟢';
  if (score >= 0.7) return '🟡';
  return '🔴';
}

// URL por defecto
const url = process.argv[2] || 'http://localhost:3000';
runLighthouse(url);
