console.log('=== HELLO: Function loaded ===');

module.exports = (req, res) => {
  console.log('=== HELLO: Function called ===');
  
  res.json({
    message: 'Hello from Vercel!',
    timestamp: new Date().toISOString()
  });
};
