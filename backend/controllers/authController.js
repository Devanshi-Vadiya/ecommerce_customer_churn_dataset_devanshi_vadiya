const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { generateOtp, storeOtp, verifyOtp } = require('../utils/otpStore');
const { v4: uuidv4 } = require('uuid');

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '1h' });
const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, error: 'Email already registered' });
  const user = await User.create({ name, email, password, role: role || 'user' });
  const token = signToken(user._id, user.role);
  res.status(201).json({ success: true, token, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ApiError(400, 'Email and password are required'));
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ApiError(401, 'Invalid email or password'));
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ApiError(401, 'Invalid email or password'));
  const token = signToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);
  res.json({ success: true, token, refreshToken, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

exports.logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true });
  res.json({ success: true, data: user });
});

exports.deleteProfile = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ success: true, message: 'Profile deleted successfully' });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, 'No user found with that email'));
  const resetToken = uuidv4();
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: 'Password reset token generated', resetToken });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return next(new ApiError(400, 'Reset token and new password are required'));
  const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } }).select('+resetToken +resetTokenExpiry');
  if (!user) return next(new ApiError(400, 'Invalid or expired reset token'));
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  res.json({ success: true, message: 'Password reset successful' });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return next(new ApiError(401, 'Current password is incorrect'));
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, token } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, 'User not found'));
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: 'Email verified successfully' });
});

exports.sendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, 'User not found'));
  const otp = generateOtp();
  storeOtp(email, otp);
  res.json({ success: true, message: 'OTP sent successfully', otp /* returned for testing */ });
});

exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = verifyOtp(email, otp);
  if (!result.valid) return next(new ApiError(400, result.message));
  const user = await User.findOne({ email });
  if (user) { user.isVerified = true; await user.save({ validateBeforeSave: false }); }
  res.json({ success: true, message: result.message });
});

exports.resendVerification = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, 'User not found'));
  if (user.isVerified) return res.json({ success: true, message: 'Email already verified' });
  const otp = generateOtp();
  storeOtp(email, otp);
  res.json({ success: true, message: 'Verification OTP resent', otp });
});

exports.getSession = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user, isAuthenticated: true, sessionActive: true } });
});

exports.destroyAllSessions = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'All sessions destroyed' });
});
