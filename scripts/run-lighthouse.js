#!/usr/bin/env node

/**
 * Script para ejecutar Lighthouse en modo headless
 * Genera reportes JSON y HTML
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouse(url) {
  let chrome;
  try {
    console.log(`🚀 Iniciando análisis Lighthouse para: ${url}\n`);

    // Lanzar Chrome
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

    // Opciones de Lighthouse
    const options = {
      logLevel: 'info',
      output: ['json', 'html'],
      port: chrome.port,
      emulatedFormFactor: 'mobile',
    };

    // Ejecutar auditoría
    const runnerResult = await lighthouse(url, options);

    // Crear directorio de reportes
    const reportDir = path.join(__dirname, '../lighthouse-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Timestamp para nombres únicos
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    // Guardar JSON
    const jsonFile = path.join(reportDir, `lighthouse-${timestamp}.json`);
    fs.writeFileSync(jsonFile, runnerResult.report[0]);
    console.log(`✅ Reporte JSON: ${jsonFile}\n`);

    // Guardar HTML
    const htmlFile = path.join(reportDir, `lighthouse-${timestamp}.html`);
    fs.writeFileSync(htmlFile, runnerResult.report[1]);
    console.log(`✅ Reporte HTML: ${htmlFile}\n`);

    // Mostrar scores
    const scores = runnerResult.lhr.categories;
    console.log('📊 SCORES:\n');
    console.log(`  Performance:   ${scores.performance.score * 100}  ${getEmoji(scores.performance.score)}`);
    console.log(`  Accessibility: ${scores.accessibility.score * 100}  ${getEmoji(scores.accessibility.score)}`);
    console.log(`  Best Practices:${scores['best-practices'].score * 100}  ${getEmoji(scores['best-practices'].score)}`);
    console.log(`  SEO:           ${scores.seo.score * 100}  ${getEmoji(scores.seo.score)}`);
    console.log(`  PWA:           ${scores.pwa.score * 100}  ${getEmoji(scores.pwa.score)}\n`);

    // Mostrar Core Web Vitals
    const audit = runnerResult.lhr.audits;
    console.log('⚡ CORE WEB VITALS:\n');
    if (audit['largest-contentful-paint']) {
      console.log(`  LCP: ${audit['largest-contentful-paint'].displayValue}`);
    }
    if (audit['first-input-delay']) {
      console.log(`  FID: ${audit['first-input-delay'].displayValue}`);
    }
    if (audit['cumulative-layout-shift']) {
      console.log(`  CLS: ${audit['cumulative-layout-shift'].displayValue}`);
    }
    console.log();

  } catch (error) {
    console.error('❌ Error ejecutando Lighthouse:', error);
    process.exit(1);
  } finally {
    // Cerrar Chrome
    if (chrome) {
      await chrome.kill();
    }
  }
}

function getEmoji(score) {
  if (score >= 0.9) return '🟢';
  if (score >= 0.7) return '🟡';
  return '🔴';
}

// URL por defecto (ajustar según necesidad)
const url = process.argv[2] || 'http://localhost:3000';
runLighthouse(url);
