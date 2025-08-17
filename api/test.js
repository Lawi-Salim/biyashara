console.log('=== VERCEL FUNCTION: test.js loaded ===');
console.log('=== VERCEL FUNCTION: Environment:', process.env.NODE_ENV);
console.log('=== VERCEL FUNCTION: Node version:', process.version);

module.exports = (req, res) => {
  console.log('=== VERCEL FUNCTION: test.js called ===');
  console.log('=== VERCEL FUNCTION: Method:', req.method);
  console.log('=== VERCEL FUNCTION: URL:', req.url);
  console.log('=== VERCEL FUNCTION: Headers:', req.headers);
  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    message: 'Vercel function is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    environment: process.env.NODE_ENV
  });
};
