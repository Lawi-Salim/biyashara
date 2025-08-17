console.log('=== VERCEL TEST: Test file loaded ===');
console.log('=== VERCEL TEST: Node version:', process.version);
console.log('=== VERCEL TEST: Environment:', process.env.NODE_ENV);
console.log('=== VERCEL TEST: Current directory:', __dirname);

const express = require('express');
const app = express();

console.log('=== VERCEL TEST: Express loaded ===');

app.get('/', (req, res) => {
  console.log('=== VERCEL TEST: Root route accessed ===');
  res.json({ 
    message: 'Test API working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/test', (req, res) => {
  console.log('=== VERCEL TEST: API test route accessed ===');
  res.json({ 
    message: 'API test route working!',
    timestamp: new Date().toISOString()
  });
});

console.log('=== VERCEL TEST: Routes configured ===');

module.exports = app;
