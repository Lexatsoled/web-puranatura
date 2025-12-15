import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const METRICS_FILE = path.join(
  rootDir,
  'src',
  'data',
  'generated-metrics.json'
);
const DIST_DIR = path.join(rootDir, 'dist', 'assets');
// Prefer fresh run from tmp/, fallback to stored report in reports/
const FRESH_LIGHTHOUSE_REPORT = path.join(
  rootDir,
  'tmp',
  'lighthouse-report.json'
);
const STORED_LIGHTHOUSE_REPORT = path.join(
  rootDir,
  'reports',
  'lighthouse-desktop.report.json'
);
const COVERAGE_REPORT = path.join(rootDir, 'coverage', 'coverage-summary.json');

// Interface for our metrics data
interface MetricsData {
  updatedAt: string;
  metrics: {
    lcp: { value: number; unit: string };
    cls: { value: number; unit: string };
    tbt: { value: number; unit: string };
    fcp: { value: number; unit: string };
    bundle: { value: number; unit: string };
    coverage: { value: number; unit: string };
  };
  history: {
    lcp: { label: string; valor: number }[];
    bundle: { label: string; valor: number }[];
  };
}

// 1. Calculate Bundle Size (JS + CSS in dist/assets)
// 1. Calculate Bundle Size
function getBundleSize(): { total: number; main: number } {
  try {
    if (!fs.existsSync(DIST_DIR)) {
      console.warn('⚠️  dist/assets not found. Run build first.');
      return { total: 0, main: 0 };
    }

    const files = fs.readdirSync(DIST_DIR);
    let totalBytes = 0;
    let mainBytes = 0;

    files.forEach((file) => {
      const filePath = path.join(DIST_DIR, file);
      const stats = fs.statSync(filePath);

      if (file.endsWith('.js') || file.endsWith('.css')) {
        totalBytes += stats.size;

        // Primitive detection of main entry point (index-*.js and index-*.css)
        if (file.startsWith('index-')) {
          mainBytes += stats.size;
        }
      }
    });

    return {
      total: Number((totalBytes / 1024).toFixed(2)), // KB
      main: Number((mainBytes / 1024).toFixed(2)), // KB
    };
  } catch {
    console.error('Error calculating bundle size');
    return { total: 0, main: 0 };
  }
}

// 2. Get Lighthouse Metrics (LCP, CLS, TBT, FCP)
function getLighthouseMetrics() {
  const defaults = { lcp: 0, cls: 0, tbt: 0, fcp: 0 };
  let reportPath = FRESH_LIGHTHOUSE_REPORT;

  if (!fs.existsSync(reportPath)) {
    if (fs.existsSync(STORED_LIGHTHOUSE_REPORT)) {
      reportPath = STORED_LIGHTHOUSE_REPORT;
    } else {
      console.warn(
        '⚠️  Lighthouse report not found (checked tmp/ and reports/).'
      );
      return defaults;
    }
  }

  try {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    return {
      lcp:
        Number(
          (
            report.audits['largest-contentful-paint']?.numericValue / 1000
          )?.toFixed(2)
        ) || 0, // s
      cls:
        Number(
          report.audits['cumulative-layout-shift']?.numericValue?.toFixed(3)
        ) || 0, // unitless
      tbt:
        Number(
          report.audits['total-blocking-time']?.numericValue?.toFixed(0)
        ) || 0, // ms
      fcp:
        Number(
          (
            report.audits['first-contentful-paint']?.numericValue / 1000
          )?.toFixed(2)
        ) || 0, // s
    };
  } catch (error) {
    console.error('Error reading Lighthouse metrics:', error);
    return defaults;
  }
}

// 3. Get Coverage from Istanbul Summary
function getCoverage(): number {
  try {
    if (!fs.existsSync(COVERAGE_REPORT)) {
      // Fallback or skip
      return 0;
    }
    const report = JSON.parse(fs.readFileSync(COVERAGE_REPORT, 'utf-8'));
    // Usually total.statements.pct
    return report.total.statements.pct;
  } catch {
    // Quietly fail if no coverage report yet
    return 0;
  }
}

// Main Update Function
function updateMetrics() {
  console.log('🔄 Updating Metrics Dashboard Data...');

  let currentData: MetricsData = {
    updatedAt: new Date().toISOString(),
    metrics: {
      lcp: { value: 0, unit: 's' },
      cls: { value: 0, unit: 'ratio' },
      tbt: { value: 0, unit: 'ms' },
      fcp: { value: 0, unit: 's' },
      bundle: { value: 0, unit: 'kb' },
      coverage: { value: 0, unit: '%' },
    },
    history: { lcp: [], bundle: [] },
  };

  // Load existing data
  if (fs.existsSync(METRICS_FILE)) {
    try {
      currentData = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf-8'));
      // Ensure structure exists if file is old
      if (!currentData.metrics.cls)
        currentData.metrics.cls = { value: 0, unit: 'ratio' };
      if (!currentData.metrics.tbt)
        currentData.metrics.tbt = { value: 0, unit: 'ms' };
      if (!currentData.metrics.fcp)
        currentData.metrics.fcp = { value: 0, unit: 's' };
    } catch {
      console.warn('Could not parse existing metrics file, starting fresh.');
    }
  }

  const bundleSizes = getBundleSize();
  const lhMetrics = getLighthouseMetrics();
  const coverage = getCoverage();
  const todayLabel = new Date().toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
  });

  // Update current values
  currentData.updatedAt = new Date().toISOString();
  currentData.metrics.bundle.value = bundleSizes.total; // Keep total for history consistency or change logic?
  // Let's store total but log main. For now updating logic to track main size preference if needed.
  // Actually, let's stick to total for backward compat in JSON, but log main.

  currentData.metrics.coverage.value = coverage;

  currentData.metrics.lcp.value = lhMetrics.lcp;
  currentData.metrics.cls.value = lhMetrics.cls;
  currentData.metrics.tbt.value = lhMetrics.tbt;
  currentData.metrics.fcp.value = lhMetrics.fcp;

  // Update History (LCP & Bundle)
  if (lhMetrics.lcp > 0) {
    const lastLcp = currentData.history.lcp[currentData.history.lcp.length - 1];
    if (lastLcp && lastLcp.label === todayLabel) {
      lastLcp.valor = lhMetrics.lcp;
    } else {
      currentData.history.lcp.push({ label: todayLabel, valor: lhMetrics.lcp });
      if (currentData.history.lcp.length > 10) currentData.history.lcp.shift();
    }
  }

  if (bundleSizes.total > 0) {
    const lastBundle =
      currentData.history.bundle[currentData.history.bundle.length - 1];
    if (lastBundle && lastBundle.label === todayLabel) {
      lastBundle.valor = bundleSizes.total;
    } else {
      currentData.history.bundle.push({
        label: todayLabel,
        valor: bundleSizes.total,
      });
      if (currentData.history.bundle.length > 10)
        currentData.history.bundle.shift();
    }
  }

  fs.writeFileSync(METRICS_FILE, JSON.stringify(currentData, null, 2));
  console.log(
    '✅ Metrics updated successfully in src/data/generated-metrics.json'
  );
  console.log({ ...bundleSizes, ...lhMetrics, coverage });
}

updateMetrics();
