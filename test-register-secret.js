
const http = require('http');

const postData = JSON.stringify({
  adminSecret: 'kenan-admin-2024-secret-key',
  name: 'Test Admin Secret',
  email: `test_secret_${Date.now()}@example.com`,
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    console.log('BODY:', rawData);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
