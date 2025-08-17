console.log('=== VERCEL FUNCTION: auth/login.js loaded ===');

module.exports = (req, res) => {
  console.log('=== VERCEL FUNCTION: auth/login.js called ===');
  console.log('=== VERCEL FUNCTION: Method:', req.method);
  console.log('=== VERCEL FUNCTION: Body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    message: 'Login function is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    receivedData: req.body
  });
};
