console.log('=== HELLO TEST: File loaded ===');

module.exports = (req, res) => {
  console.log('=== HELLO TEST: Function called ===');
  console.log('=== HELLO TEST: Method:', req.method);
  console.log('=== HELLO TEST: URL:', req.url);
  
  res.json({
    message: 'Hello from Vercel!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};
