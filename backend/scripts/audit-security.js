#!/usr/bin/env node

/**
 * Security Audit Script for Pureza Naturalis
 * Valida que todos los headers de seguridad estén presentes
 */

const http = require('http');
const https = require('https');

const SECURITY_HEADERS = {
  'content-security-policy': {
    required: true,
    description: 'Protege contra XSS y ataques de inyección',
  },
  'x-content-type-options': {
    required: true,
    expectedValue: 'nosniff',
    description: 'Previene MIME-sniffing attacks',
  },
  'x-frame-options': {
    required: true,
    expectedValue: 'DENY',
    description: 'Previene Clickjacking',
  },
  'x-xss-protection': {
    required: true,
    description: 'Protección XSS adicional',
  },
  'strict-transport-security': {
    required: true,
    description: 'Fuerza HTTPS en todas las conexiones',
  },
  'referrer-policy': {
    required: true,
    description: 'Controla información del referrer',
  },
  'permissions-policy': {
    required: true,
    description: 'Restringe acceso a APIs de hardware',
  },
};

async function checkHeaders(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, { timeout: 5000 }, (res) => {
        const headers = res.headers;
        const results = {};

        for (const [headerName, config] of Object.entries(SECURITY_HEADERS)) {
          const headerValue = headers[headerName];
          results[headerName] = {
            present: !!headerValue,
            value: headerValue || 'MISSING',
            required: config.required,
            description: config.description,
          };
        }

        resolve(results);
      })
      .on('error', reject);
  });
}

async function main() {
  const apiUrl = process.argv[2] || 'http://localhost:3001';

  console.log('\n🔒 Security Headers Audit - Pureza Naturalis\n');
  console.log(`📍 Checking: ${apiUrl}\n`);

  try {
    const results = await checkHeaders(apiUrl);
    let allGood = true;

    for (const [header, info] of Object.entries(results)) {
      const status = info.present ? '✅' : '❌';
      console.log(`${status} ${header}`);
      console.log(`   Description: ${info.description}`);
      if (!info.present && info.required) {
        console.log(`   ⚠️  REQUIRED BUT MISSING`);
        allGood = false;
      }
      if (info.value !== 'MISSING' && info.value.length < 100) {
        console.log(`   Value: ${info.value}`);
      }
      console.log();
    }

    if (allGood) {
      console.log('✅ All security headers are present!\n');
      process.exit(0);
    } else {
      console.log('❌ Some required security headers are missing!\n');
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error checking headers: ${error.message}\n`);
    process.exit(1);
  }
}

main();
