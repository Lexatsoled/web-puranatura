#!/usr/bin/env node

/**
 * Bundle Analysis Script
 *
 * Analyzes the Vite build output to identify:
 * - Largest bundles
 * - Optimization opportunities
 * - Chunk distribution
 * - Dependencies impact
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

/**
 * Parse build output to extract bundle sizes
 */
function parseBuildOutput() {
  const distPath = path.join(__dirname, '..', 'dist', 'assets');

  if (!fs.existsSync(distPath)) {
    console.error(
      `${colors.red}Error: dist/assets folder not found. Run 'npm run build' first.${colors.reset}`
    );
    process.exit(1);
  }

  const files = fs.readdirSync(distPath);
  const bundles = [];

  files.forEach((file) => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);

    if (file.endsWith('.js')) {
      bundles.push({
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        type: categorizeBundle(file),
      });
    }
  });

  return bundles.sort((a, b) => b.size - a.size);
}

/**
 * Categorize bundle by name pattern
 */
function categorizeBundle(filename) {
  if (filename.includes('products-data')) return 'Data (Products)';
  if (filename.includes('react-core')) return 'Core (React)';
  if (filename.includes('framer-motion')) return 'Animation';
  if (filename.includes('router')) return 'Routing';
  if (filename.includes('vendor')) return 'Vendor';
  if (filename.includes('components')) return 'Components';
  if (filename.includes('page-')) return 'Page';
  if (filename.includes('data') || filename.includes('static-data'))
    return 'Data';
  if (filename.includes('monitoring')) return 'Monitoring';
  if (filename.includes('state')) return 'State';
  if (filename.includes('virtual-scroll')) return 'Virtual Scroll';
  if (filename.includes('image-utils')) return 'Image Utils';
  return 'Other';
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Get color based on bundle size
 */
function getSizeColor(sizeKB) {
  if (sizeKB > 200) return colors.red;
  if (sizeKB > 100) return colors.yellow;
  if (sizeKB > 50) return colors.cyan;
  return colors.green;
}

/**
 * Generate recommendations based on bundle sizes
 */
function generateRecommendations(bundles) {
  const recommendations = [];

  // Check for large product data
  const productsData = bundles.find((b) => b.type === 'Data (Products)');
  if (productsData && productsData.size > 200 * 1024) {
    recommendations.push({
      severity: 'HIGH',
      bundle: productsData.name,
      issue: `Products data is ${productsData.sizeKB} KB (should be < 50 KB)`,
      solution:
        'Migrate products to database (Supabase) with API endpoints. Keep only metadata in client.',
      impact: 'Would reduce initial bundle by ~85% (264 KB → 40 KB)',
    });
  }

  // Check for large animation bundle
  const framerMotion = bundles.find((b) => b.type === 'Animation');
  if (framerMotion && framerMotion.size > 70 * 1024) {
    recommendations.push({
      severity: 'MEDIUM',
      bundle: framerMotion.name,
      issue: `Framer Motion is ${framerMotion.sizeKB} KB`,
      solution:
        'Use LazyMotion with domAnimation features only. Replace complex animations with CSS transitions where possible.',
      impact: 'Could reduce by ~40% (78 KB → 47 KB)',
    });
  }

  // Check total bundle size
  const totalSize = bundles.reduce((sum, b) => sum + b.size, 0);
  if (totalSize > 1024 * 1024) {
    recommendations.push({
      severity: 'MEDIUM',
      bundle: 'TOTAL',
      issue: `Total bundle size is ${formatBytes(totalSize)}`,
      solution:
        'Consider lazy loading non-critical pages and using dynamic imports for heavy components.',
      impact: 'Could reduce initial load by 30-40%',
    });
  }

  return recommendations;
}

/**
 * Group bundles by category
 */
function groupByCategory(bundles) {
  const grouped = {};

  bundles.forEach((bundle) => {
    if (!grouped[bundle.type]) {
      grouped[bundle.type] = [];
    }
    grouped[bundle.type].push(bundle);
  });

  return grouped;
}

/**
 * Calculate category totals
 */
function calculateCategoryTotals(grouped) {
  const totals = {};

  Object.keys(grouped).forEach((category) => {
    const categoryBundles = grouped[category];
    const totalSize = categoryBundles.reduce((sum, b) => sum + b.size, 0);
    totals[category] = {
      count: categoryBundles.length,
      size: totalSize,
      sizeKB: (totalSize / 1024).toFixed(2),
      percentage: 0, // Will calculate after
    };
  });

  // Calculate percentages
  const grandTotal = Object.values(totals).reduce((sum, t) => sum + t.size, 0);
  Object.keys(totals).forEach((category) => {
    totals[category].percentage = (
      (totals[category].size / grandTotal) *
      100
    ).toFixed(1);
  });

  return totals;
}

/**
 * Print analysis report
 */
function printReport() {
  console.log(
    `\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}║          📊 BUNDLE ANALYSIS - Web Puranatura                      ║${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════════════╝${colors.reset}\n`
  );

  const bundles = parseBuildOutput();
  const grouped = groupByCategory(bundles);
  const totals = calculateCategoryTotals(grouped);

  // Print summary by category
  console.log(
    `${colors.bright}📦 Bundle Distribution by Category:${colors.reset}\n`
  );

  const sortedCategories = Object.entries(totals).sort(
    (a, b) => b[1].size - a[1].size
  );

  sortedCategories.forEach(([category, data]) => {
    const color = getSizeColor(parseFloat(data.sizeKB));
    const bar = '█'.repeat(Math.ceil(data.percentage / 2));
    console.log(
      `  ${color}${category.padEnd(20)}${colors.reset} ${data.sizeKB.padStart(10)} KB  ${data.percentage.padStart(5)}%  ${bar}`
    );
  });

  // Print top 10 largest bundles
  console.log(`\n${colors.bright}🔍 Top 10 Largest Bundles:${colors.reset}\n`);

  bundles.slice(0, 10).forEach((bundle, index) => {
    const color = getSizeColor(parseFloat(bundle.sizeKB));
    console.log(
      `  ${(index + 1).toString().padStart(2)}.  ${color}${bundle.name.padEnd(45)}${colors.reset}  ${bundle.sizeKB.padStart(8)} KB  [${bundle.type}]`
    );
  });

  // Calculate and print totals
  const totalSize = bundles.reduce((sum, b) => sum + b.size, 0);
  const totalJS = bundles.reduce((sum, b) => sum + b.size, 0);

  console.log(`\n${colors.bright}📈 Total Bundle Sizes:${colors.reset}`);
  console.log(
    `  JavaScript:  ${colors.cyan}${formatBytes(totalJS).padStart(12)}${colors.reset}`
  );
  console.log(
    `  Total:       ${colors.bright}${formatBytes(totalSize).padStart(12)}${colors.reset}`
  );
  console.log(
    `  Files:       ${colors.bright}${bundles.length.toString().padStart(12)}${colors.reset}`
  );

  // Print recommendations
  const recommendations = generateRecommendations(bundles);

  if (recommendations.length > 0) {
    console.log(
      `\n${colors.bright}💡 Optimization Recommendations:${colors.reset}\n`
    );

    recommendations.forEach((rec) => {
      const severityColor =
        rec.severity === 'HIGH' ? colors.red : colors.yellow;
      console.log(
        `  ${severityColor}[${rec.severity}]${colors.reset} ${rec.bundle}`
      );
      console.log(`    ${colors.red}Issue:${colors.reset}    ${rec.issue}`);
      console.log(
        `    ${colors.green}Solution:${colors.reset} ${rec.solution}`
      );
      console.log(`    ${colors.blue}Impact:${colors.reset}   ${rec.impact}\n`);
    });
  }

  // Performance metrics
  console.log(`${colors.bright}⚡ Performance Metrics:${colors.reset}`);
  const criticalSize = bundles
    .filter(
      (b) =>
        b.type === 'Core (React)' ||
        b.type === 'Routing' ||
        b.name.includes('index-')
    )
    .reduce((sum, b) => sum + b.size, 0);

  console.log(
    `  Critical Path:     ${colors.yellow}${formatBytes(criticalSize).padStart(12)}${colors.reset}`
  );
  console.log(
    `  Lazy Loadable:     ${colors.green}${formatBytes(totalSize - criticalSize).padStart(12)}${colors.reset}`
  );
  console.log(
    `  Lazy Load %:       ${colors.green}${(((totalSize - criticalSize) / totalSize) * 100).toFixed(1)}%${colors.reset}`
  );

  console.log(`\n${colors.bright}✅ Analysis complete!${colors.reset}\n`);
}

// Run the analysis
try {
  printReport();
} catch (error) {
  console.error(
    `${colors.red}Error during analysis:${colors.reset}`,
    error.message
  );
  process.exit(1);
}
