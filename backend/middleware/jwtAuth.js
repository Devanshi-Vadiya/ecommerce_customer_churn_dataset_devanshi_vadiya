const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * JWT auth middleware specifically for JWT routes.
 * Same logic as auth.js but kept separate for clarity.
 */
const jwtAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. JWT token required.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User associated with token not found.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid JWT token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'JWT token has expired. Please refresh.'));
    }
    next(new ApiError(401, 'JWT authentication failed'));
  }
};

module.exports = jwtAuth;
