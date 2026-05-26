const ApiError = require('../utils/ApiError');

/**
 * Admin authorization middleware.
 * Must be used after auth middleware (req.user must exist).
 */
const adminAuth = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Access denied. Admin privileges required.'));
  }

  next();
};

module.exports = adminAuth;
