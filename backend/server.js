const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const requestTime = require('./middleware/requestTime');
const { generalLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ===== GLOBAL MIDDLEWARE =====
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  if (req.method === 'OPTIONS') {
    // Let the options request fall through to custom route handlers
    return next();
  }
  next();
});
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestTime);
app.use(requestLogger);

// ===== ROUTES =====
app.use('/customers', require('./routes/customerRoutes'));
app.use('/search', require('./routes/searchRoutes'));
app.use('/analytics', require('./routes/analyticsRoutes'));
app.use('/stats', require('./routes/statsRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/jwt', require('./routes/jwtRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/protected', require('./routes/protectedRoutes'));
app.use('/middleware', require('./routes/middlewareRoutes'));

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce Customer Churn Analytics API',
    version: '1.0.0',
    endpoints: {
      customers: '/customers',
      search: '/search/customers',
      analytics: '/analytics/customers',
      stats: '/stats/customers',
      auth: '/auth',
      jwt: '/jwt',
      admin: '/admin',
      protected: '/protected',
      middleware: '/middleware',
    },
  });
});

// ===== 404 HANDLER =====
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use(errorHandler);

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
