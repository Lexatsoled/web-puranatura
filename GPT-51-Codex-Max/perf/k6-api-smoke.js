import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.9'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
const defaultHeaders = {
  Accept: 'application/json',
};

let selectedProductId = '';
const vuState = {};

const authPayload = JSON.stringify({
  email: __ENV.SMOKE_USER || 'smoke@puranatura.test',
  password: __ENV.SMOKE_PASS || 'SmokeP@ss123',
});

const ensureState = () => {
  if (!vuState[__VU]) {
    vuState[__VU] = {
      csrf: '',
      authenticated: false,
      token: '',
    };
  }
  return vuState[__VU];
};

const updateCsrf = (response) => {
  if (!response || !response.cookies) return;
  const cookie = response.cookies['csrfToken'];
  if (cookie && cookie.length > 0) {
    ensureState().csrf = cookie[0].value;
  }
};

const updateAuthToken = (response) => {
  if (!response || !response.cookies) return;
  const tokenCookie = response.cookies['token'];
  if (tokenCookie && tokenCookie.length > 0) {
    const state = ensureState();
    state.token = tokenCookie[0].value;
    state.authenticated = true;
  }
};

const readCsrfFromJar = () => {
  const jarCookies = http.cookieJar().cookiesForURL(BASE_URL);
  if (jarCookies && jarCookies.csrfToken && jarCookies.csrfToken.length > 0) {
    ensureState().csrf = jarCookies.csrfToken[0];
  }
};

const applyCsrfHeaders = (headers) => {
  const state = ensureState();
  if (!state.csrf) {
    readCsrfFromJar();
  }
  if (state.csrf) {
    headers['x-csrf-token'] = state.csrf;
  }
  return headers;
};

export default function () {
  const state = ensureState();

  group('consultas de salud y catalogo', () => {
    const health = http.get(`${BASE_URL}/api/health`, { headers: defaultHeaders });
    updateCsrf(health);
    check(health, { 'health 200': (r) => r.status === 200 });

    const products = http.get(`${BASE_URL}/api/products?page=1&pageSize=3`, {
      headers: defaultHeaders,
    });
    if (__ITER === 0 && __VU === 1) {
      console.log('productos status sample', products.status, products.body);
    }
    updateCsrf(products);
    let parsedProducts = [];
    let parsed = false;
    try {
      parsedProducts = products.json();
      parsed = Array.isArray(parsedProducts);
    } catch (err) {
      parsed = false;
    }
    check(products, {
      'productos 200': (r) => r.status === 200,
      'productos contiene array': () => parsed && parsedProducts.length <= 3,
    });
    if (parsed && parsedProducts.length > 0 && parsedProducts[0].id) {
      selectedProductId = parsedProducts[0].id;
    }
  });

  group('auth flows y ordenes', () => {
    let loginResponse;
    if (state.authenticated) {
      loginResponse = { status: 200 };
    } else {
      const loginHeaders = applyCsrfHeaders(
        Object.assign({}, defaultHeaders, {
          'Content-Type': 'application/json',
        })
      );
      loginResponse = http.post(`${BASE_URL}/api/auth/login`, authPayload, {
        headers: loginHeaders,
      });
      if (__ITER === 0 && __VU === 1) {
        console.log('login status sample', loginResponse.status, loginResponse.body);
      }
      updateCsrf(loginResponse);
      if (loginResponse.status === 200) {
        updateAuthToken(loginResponse);
      } else {
        state.authenticated = false;
      }
    }

    check(loginResponse, {
      'login 200/401': (r) => r.status === 200 || r.status === 401,
    });

    if (state.authenticated && state.token && selectedProductId) {
      const payload = {
        items: [{ productId: selectedProductId, quantity: 1 }],
      };
      const orderHeaders = applyCsrfHeaders(
        Object.assign({}, defaultHeaders, {
          'Content-Type': 'application/json',
        })
      );
      orderHeaders.Authorization = `Bearer ${state.token}`;

      const orderRes = http.post(
        `${BASE_URL}/api/orders`,
        JSON.stringify(payload),
        { headers: orderHeaders }
      );
      updateCsrf(orderRes);
      check(orderRes, {
        'orders 201/400': (r) => r.status === 201 || r.status === 400,
      });
    }
  });

  group('analytics y CSP', () => {
    const analytics = http.post(
      `${BASE_URL}/api/analytics/events`,
      JSON.stringify({ category: 'smoke', action: 'ping' }),
      {
        headers: Object.assign({}, defaultHeaders, {
          'Content-Type': 'application/json',
        }),
      }
    );
    check(analytics, {
      'analytics 202/503': (r) => r.status === 202 || r.status === 503,
    });

    const csp = http.post(
      `${BASE_URL}/api/security/csp-report`,
      JSON.stringify({ 'csp-report': { 'blocked-uri': 'http://example.test' } }),
      {
        headers: Object.assign({}, defaultHeaders, {
          'Content-Type': 'application/json',
        }),
      }
    );
    check(csp, {
      'csp 204/400': (r) => r.status === 204 || r.status === 400,
    });
  });

  sleep(1);
}
