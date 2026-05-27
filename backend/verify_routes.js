const http = require('http');

const request = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, rawBody: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function test() {
  console.log('--- STARTING ROUTE VERIFICATION ---');
  
  // 1. Root route
  const root = await request('GET', '/');
  console.log('Root endpoint:', root.status === 200 && root.body.success ? 'PASS' : 'FAIL');

  // 2. Customers List
  const customers = await request('GET', '/customers?limit=2');
  console.log('GET /customers:', customers.status === 200 && customers.body.total > 0 ? 'PASS' : 'FAIL');

  // 3. Customer Info routes (e.g. churned)
  const churned = await request('GET', '/customers/churned?limit=1');
  console.log('GET /customers/churned:', churned.status === 200 && churned.body.success ? 'PASS' : 'FAIL');

  // 4. Params routes
  const country = await request('GET', '/customers/country/Australia?limit=1');
  console.log('GET /customers/country/:country:', country.status === 200 && country.body.success ? 'PASS' : 'FAIL');
  
  // 5. Query parameters
  const queryFilter = await request('GET', '/customers?country=France&limit=1');
  console.log('GET /customers?country=France:', queryFilter.status === 200 && queryFilter.body.success ? 'PASS' : 'FAIL');

  // 6. Sorting
  const sorted = await request('GET', '/customers?sort=-lifetimeValue&limit=1');
  console.log('GET /customers?sort=-lifetimeValue:', sorted.status === 200 && sorted.body.success ? 'PASS' : 'FAIL');

  // 7. Search
  const search = await request('GET', '/search/customers?q=france');
  console.log('GET /search/customers?q=france:', search.status === 200 && search.body.success ? 'PASS' : 'FAIL');

  // 8. Stats
  const statsCount = await request('GET', '/stats/customers/count');
  console.log('GET /stats/customers/count:', statsCount.status === 200 && statsCount.body.data.totalCustomers > 0 ? 'PASS' : 'FAIL');

  // 9. Analytics
  const analytics = await request('GET', '/analytics/customers/top-buyers');
  console.log('GET /analytics/customers/top-buyers:', analytics.status === 200 && analytics.body.success ? 'PASS' : 'FAIL');

  // 10. Advanced / Predictions
  const predictions = await request('GET', '/customers/predictions/churn');
  console.log('GET /customers/predictions/churn:', predictions.status === 200 && predictions.body.success ? 'PASS' : 'FAIL');

  // 11. HEAD request
  const head = await request('HEAD', '/customers');
  console.log('HEAD /customers:', head.status === 200 ? 'PASS' : 'FAIL');

  // 12. OPTIONS request
  const options = await request('OPTIONS', '/customers');
  console.log('OPTIONS /customers:', options.status === 200 && options.headers.allow ? 'PASS' : 'FAIL');

  // 13. Registration and Login flow
  const rand = Math.floor(Math.random() * 1000000);
  const email = `admin${rand}@ecommerce.com`;
  const registerPayload = {
    name: 'Test Admin User',
    email: email,
    password: 'password123',
    role: 'admin'
  };
  const reg = await request('POST', '/auth/register', registerPayload);
  console.log('POST /auth/register:', reg.status === 201 && reg.body.success ? 'PASS' : 'FAIL');

  const loginPayload = {
    email: email,
    password: 'password123'
  };
  const login = await request('POST', '/auth/login', loginPayload);
  console.log('POST /auth/login:', login.status === 200 && login.body.token ? 'PASS' : 'FAIL');
  
  const token = login.body.token;

  // 14. Protected Admin route with Token
  const adminStats = await request('GET', '/admin/stats', null, { 'Authorization': `Bearer ${token}` });
  console.log('GET /admin/stats with Token:', adminStats.status === 200 && adminStats.body.success ? 'PASS' : 'FAIL');

  // 15. Middleware Demo routes
  const mwTime = await request('GET', '/middleware/request-time');
  console.log('GET /middleware/request-time:', mwTime.status === 200 && mwTime.body.requestTime ? 'PASS' : 'FAIL');

  // 16. JWT specific generation & verification
  const jwtGen = await request('POST', '/jwt/generate-token', loginPayload);
  console.log('POST /jwt/generate-token:', jwtGen.status === 200 && jwtGen.body.token ? 'PASS' : 'FAIL');

  console.log('--- ROUTE VERIFICATION COMPLETED ---');
}

test().catch(console.error);
