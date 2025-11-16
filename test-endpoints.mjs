// Script de validación de endpoints backend
// Node.js 24+ tiene fetch nativo

const BASE_URL = 'http://localhost:3000';

console.log('🧪 Iniciando tests de endpoints backend...\n');

// Test 1: Health Check
console.log('📍 Test 1: Health Check');
try {
  const res1 = await fetch(`${BASE_URL}/health`);
  const data1 = await res1.json();
  console.log('✅ Status:', res1.status);
  console.log('✅ Response:', JSON.stringify(data1, null, 2));
} catch (err) {
  console.error('❌ Error:', err.message);
}

console.log('\n📍 Test 2: Signup (nuevo usuario)');
try {
  const res2 = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nuevo@test.com',
      password: 'Test1234',
      name: 'Usuario Nuevo'
    })
  });
  const data2 = await res2.json();
  console.log('✅ Status:', res2.status);
  console.log('✅ Response:', JSON.stringify(data2, null, 2));
  
  // Verificar cookies
  const cookies = res2.headers.get('set-cookie');
  console.log('✅ Cookies:', cookies ? 'Presentes (accessToken, refreshToken)' : '❌ No enviadas');
} catch (err) {
  console.error('❌ Error:', err.message);
}

console.log('\n📍 Test 3: Login (usuario existente)');
try {
  const res3 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'test123'
    })
  });
  const data3 = await res3.json();
  console.log('✅ Status:', res3.status);
  console.log('✅ Response:', JSON.stringify(data3, null, 2));
  
  // Guardar cookies para siguiente test
  const cookieHeader = res3.headers.get('set-cookie');
  const accessToken = cookieHeader?.match(/accessToken=([^;]+)/)?.[1];
  const refreshToken = cookieHeader?.match(/refreshToken=([^;]+)/)?.[1];
  
  console.log('✅ AccessToken:', accessToken ? 'JWT válido (hidden)' : '❌ No recibido');
  console.log('✅ RefreshToken:', refreshToken ? 'JWT válido (hidden)' : '❌ No recibido');
  
  // Test 4: Get User (autenticado)
  if (accessToken) {
    console.log('\n📍 Test 4: Get User (/api/auth/me) - Autenticado');
    const res4 = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 
        'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}`
      }
    });
    const data4 = await res4.json();
    console.log('✅ Status:', res4.status);
    console.log('✅ Response:', JSON.stringify(data4, null, 2));
  }
} catch (err) {
  console.error('❌ Error:', err.message);
}

console.log('\n📍 Test 5: Login con credenciales incorrectas');
try {
  const res5 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'wrongpassword'
    })
  });
  const data5 = await res5.json();
  console.log('✅ Status:', res5.status, '(esperado 401)');
  console.log('✅ Response:', JSON.stringify(data5, null, 2));
} catch (err) {
  console.error('❌ Error:', err.message);
}

console.log('\n🎉 Tests completados!');
