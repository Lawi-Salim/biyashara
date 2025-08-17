console.log('=== VERCEL API: index.js loaded ===');
console.log('=== VERCEL API: Environment:', process.env.NODE_ENV);
console.log('=== VERCEL API: Node version:', process.version);

const express = require('express');
const app = express();

console.log('=== VERCEL API: Express loaded ===');

app.use(express.json());

app.get('/', (req, res) => {
  console.log('=== VERCEL API: Root route accessed ===');
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/test', (req, res) => {
  console.log('=== VERCEL API: Test route accessed ===');
  res.json({
    message: 'API test route working!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('=== VERCEL API: Login route accessed ===');
  res.json({
    message: 'Login route working!',
    timestamp: new Date().toISOString()
  });
});

console.log('=== VERCEL API: Routes configured ===');

module.exports = app;
