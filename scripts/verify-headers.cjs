const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/health',
  method: 'HEAD',
};

const req = http.request(options, (res) => {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers, null, 2));

  const securityHeaders = [
    'x-content-type-options',
    'x-frame-options',
    'content-security-policy',
    'strict-transport-security',
  ];

  const missing = securityHeaders.filter((h) => !res.headers[h]);

  if (missing.length > 0) {
    console.error('❌ Missing security headers:', missing);
    process.exit(1);
  } else {
    console.log('✅ All key security headers present.');
    process.exit(0);
  }
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
  process.exit(1);
});

req.end();
