import http from 'http';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body)
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

console.log('🧪 Testing Backend Endpoints\n');

// Test 1: Health
console.log('📍 Test 1: GET /health');
try {
  const res1 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
  });
  console.log('✅ Status:', res1.status);
  console.log('✅ Body:', JSON.stringify(res1.body, null, 2));
} catch (err) {
  console.error('❌ Error:', err.code, err.message);
}

// Test 2: Signup
console.log('\n📍 Test 2: POST /api/auth/signup');
try {
  const res2 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'validacion@test.com',
    password: 'Test1234',
    name: 'Usuario Validacion'
  });
  console.log('✅ Status:', res2.status);
  console.log('✅ Body:', JSON.stringify(res2.body, null, 2));
  console.log('✅ Cookies:', res2.headers['set-cookie'] ? 'accessToken + refreshToken presentes' : '❌ No cookies');
} catch (err) {
  console.error('❌ Error:', err.code, err.message);
}

// Test 3: Login
console.log('\n📍 Test 3: POST /api/auth/login');
try {
  const res3 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'test@example.com',
    password: 'test123'
  });
  console.log('✅ Status:', res3.status);
  console.log('✅ Body:', JSON.stringify(res3.body, null, 2));
  
  const cookies = res3.headers['set-cookie'];
  if (cookies) {
    const accessToken = cookies.find(c => c.startsWith('accessToken='))?.split(';')[0].split('=')[1];
    const refreshToken = cookies.find(c => c.startsWith('refreshToken='))?.split(';')[0].split('=')[1];
    
    console.log('✅ AccessToken:', accessToken ? `${accessToken.substring(0, 20)}...` : '❌');
    console.log('✅ RefreshToken:', refreshToken ? `${refreshToken.substring(0, 20)}...` : '❌');
    
    // Test 4: Get User
    if (accessToken && refreshToken) {
      console.log('\n📍 Test 4: GET /api/auth/me (autenticado)');
      try {
        const res4 = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/api/auth/me',
          method: 'GET',
          headers: { 
            'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}`
          }
        });
        console.log('✅ Status:', res4.status);
        console.log('✅ Body:', JSON.stringify(res4.body, null, 2));
      } catch (err) {
        console.error('❌ Error:', err.code, err.message);
      }
    }
  }
} catch (err) {
  console.error('❌ Error:', err.code, err.message);
}

// Test 5: Login failed
console.log('\n📍 Test 5: POST /api/auth/login (credenciales incorrectas)');
try {
  const res5 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'test@example.com',
    password: 'wrongpassword'
  });
  console.log('✅ Status:', res5.status, '(esperado 401)');
  console.log('✅ Body:', JSON.stringify(res5.body, null, 2));
} catch (err) {
  console.error('❌ Error:', err.code, err.message);
}

console.log('\n🎉 Validación completada!');
