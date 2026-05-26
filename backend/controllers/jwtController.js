const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '1h' });
const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });

// In-memory revoked tokens set
const revokedTokens = new Set();

exports.jwtProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

exports.jwtDashboard = asyncHandler(async (req, res) => {
  const totalCustomers = await Customer.countDocuments();
  const churnedCount = await Customer.countDocuments({ churned: true });
  const activeCount = totalCustomers - churnedCount;
  res.json({ success: true, data: { user: req.user.name, totalCustomers, churnedCount, activeCount, churnRate: totalCustomers > 0 ? Math.round(churnedCount / totalCustomers * 10000) / 100 : 0 } });
});

exports.generateToken = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ApiError(400, 'Email and password are required'));
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ApiError(401, 'Invalid credentials'));
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ApiError(401, 'Invalid credentials'));
  const token = signToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);
  res.json({ success: true, token, refreshToken, expiresIn: process.env.JWT_EXPIRE || '1h' });
});

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new ApiError(400, 'Token is required'));
  if (revokedTokens.has(token)) return res.json({ success: false, valid: false, message: 'Token has been revoked' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, valid: true, decoded });
  } catch (err) {
    res.json({ success: false, valid: false, message: err.message });
  }
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new ApiError(400, 'Refresh token is required'));
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new ApiError(401, 'User not found'));
    const newToken = signToken(user._id, user.role);
    const newRefreshToken = signRefreshToken(user._id);
    res.json({ success: true, token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired refresh token'));
  }
});

exports.revokeToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (token) revokedTokens.add(token);
  res.json({ success: true, message: 'Token revoked successfully' });
});

exports.privateCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().limit(20);
  res.json({ success: true, count: customers.length, data: customers });
});

exports.privateStats = asyncHandler(async (req, res) => {
  const total = await Customer.countDocuments();
  const churned = await Customer.countDocuments({ churned: true });
  const [avgLtv] = await Customer.aggregate([{ $group: { _id: null, avg: { $avg: '$lifetimeValue' } } }]);
  res.json({ success: true, data: { totalCustomers: total, churnedCustomers: churned, activeCustomers: total - churned, averageLifetimeValue: avgLtv ? Math.round(avgLtv.avg * 100) / 100 : 0 } });
});

exports.jwtAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') return next(new ApiError(403, 'Admin access required'));
  res.json({ success: true, message: 'Admin access granted', user: req.user });
});

exports.customerInsights = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$churned', count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' }, avgEngagement: { $avg: '$socialMediaEngagementScore' } } },
  ]);
  res.json({ success: true, data });
});
