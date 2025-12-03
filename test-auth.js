// @ts-nocheck
// Simple test script for authentication endpoints

async function testAuth() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('Testing authentication endpoints...\n');
  
  // Test login with invalid credentials
  try {
    console.log('1. Testing login with invalid credentials...');
    const loginResult = await new Promise((resolve, reject) => {
      const http = require('http');
      const data = JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      });
      
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/admin/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      
      const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, data: responseData });
        });
      });
      
      req.on('error', (err) => {
        reject(err);
      });
      
      req.write(data);
      req.end();
    });
    
    console.log(`Login response status: ${loginResult.status}`);
    console.log(`Login response: ${loginResult.data}\n`);
  } catch (error) {
    console.log(`Login test error: ${error.message}\n`);
  }
  
  // Test invite endpoint
  try {
    console.log('2. Testing invite endpoint...');
    const inviteResult = await new Promise((resolve, reject) => {
      const http = require('http');
      const data = JSON.stringify({
        email: 'test@example.com',
        role: 'admin'
      });
      
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/admin/invite',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'x-admin-secret': 'kenan-admin-2024-secret-key'
        }
      };
      
      const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, data: responseData });
        });
      });
      
      req.on('error', (err) => {
        reject(err);
      });
      
      req.write(data);
      req.end();
    });
    
    console.log(`Invite response status: ${inviteResult.status}`);
    console.log(`Invite response: ${inviteResult.data}\n`);
  } catch (error) {
    console.log(`Invite test error: ${error.message}\n`);
  }
  
  console.log('Authentication tests completed.');
}

testAuth().catch(console.error);