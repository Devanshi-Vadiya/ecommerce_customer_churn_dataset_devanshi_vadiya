const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimiter');

// Logger demo
router.get('/logger', (req, res) => {
  res.json({ success: true, message: 'Request logged successfully', method: req.method, url: req.originalUrl, timestamp: new Date().toISOString() });
});

// Auth demo
router.get('/auth', auth, (req, res) => {
  res.json({ success: true, message: 'Authentication middleware working', user: req.user });
});

// Rate limit demo
router.get('/rate-limit', generalLimiter, (req, res) => {
  res.json({ success: true, message: 'Rate limiting middleware working' });
});

// Error handler demo
router.get('/error-handler', (req, res, next) => {
  const error = new Error('Demo error for testing error handler');
  error.statusCode = 500;
  next(error);
});

// Request time demo
router.get('/request-time', (req, res) => {
  res.json({ success: true, message: 'Request time middleware working', requestTime: req.requestTime });
});

module.exports = router;
