console.log('=== ROOT API: api.js loaded ===');
console.log('=== ROOT API: Environment:', process.env.NODE_ENV);
console.log('=== ROOT API: Node version:', process.version);

module.exports = (req, res) => {
  console.log('=== ROOT API: Function called ===');
  console.log('=== ROOT API: Method:', req.method);
  console.log('=== ROOT API: URL:', req.url);
  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    message: 'Root API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};
