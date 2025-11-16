#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function analyzeLogs() {
  const logsDir = path.join(__dirname, '..', 'backend', 'logs');
  if (!fs.existsSync(logsDir)) {
    console.error('Logs directory not found:', logsDir);
    process.exit(1);
  }

  const files = fs
    .readdirSync(logsDir)
    .filter((file) => file.endsWith('.log'))
    .map((file) => path.join(logsDir, file));

  if (files.length === 0) {
    console.log('No log files found.');
    return;
  }

  const stats = {
    totalRequests: 0,
    errorCount: 0,
    warnCount: 0,
    authAttempts: { success: 0, failed: 0 },
    slowRequests: 0,
    endpoints: {},
  };

  for (const file of files) {
    const stream = fs.createReadStream(file, { encoding: 'utf-8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (!line.trim()) continue;
      let log;
      try {
        log = JSON.parse(line);
      } catch {
        continue;
      }

      if (log.method && log.url) {
        stats.totalRequests += 1;
        const endpoint = `${log.method} ${log.url}`;
        stats.endpoints[endpoint] = (stats.endpoints[endpoint] || 0) + 1;

        const durationMatch =
          typeof log.duration === 'string' ? parseInt(log.duration, 10) : undefined;
        if (!Number.isNaN(durationMatch) && durationMatch > 1000) {
          stats.slowRequests += 1;
        }
      }

      const level = typeof log.level === 'number' ? log.level : undefined;
      if (level !== undefined) {
        if (level >= 50) stats.errorCount += 1;
        if (level >= 40 && level < 50) stats.warnCount += 1;
      }

      if (log.event === 'auth_attempt') {
        if (log.success) {
          stats.authAttempts.success += 1;
        } else {
          stats.authAttempts.failed += 1;
        }
      }
    }
  }

  console.log('\n=== Estadisticas de Logs ===\n');
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Errors: ${stats.errorCount}`);
  console.log(`Warnings: ${stats.warnCount}`);
  console.log(`Slow Requests (>1s): ${stats.slowRequests}`);
  console.log('\nAuth Attempts:');
  console.log(`  Success: ${stats.authAttempts.success}`);
  console.log(`  Failed: ${stats.authAttempts.failed}`);

  console.log('\nTop Endpoints:');
  const sorted = Object.entries(stats.endpoints)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  sorted.forEach(([endpoint, count]) => {
    console.log(`  ${endpoint}: ${count}`);
  });
}

analyzeLogs().catch((err) => {
  console.error(err);
  process.exit(1);
});
