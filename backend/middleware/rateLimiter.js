const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Too many requests. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes limiter (login, register)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search routes limiter
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Too many search requests. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin routes limiter
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: 'Too many admin requests. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Analytics routes limiter
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many analytics requests. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Heavy computation routes limiter
const heavyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    error: 'Too many requests to heavy endpoints. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  searchLimiter,
  adminLimiter,
  analyticsLimiter,
  heavyLimiter,
};
