/**
 * In-memory OTP store for demo purposes.
 * In production, use Redis or database storage.
 */
const otpStore = new Map();

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOtp = (email, otp, expiresInMinutes = 10) => {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + expiresInMinutes * 60 * 1000,
  });
};

const verifyOtp = (email, otp) => {
  const stored = otpStore.get(email);
  if (!stored) return { valid: false, message: 'No OTP found for this email' };
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP has expired' };
  }
  if (stored.otp !== otp) return { valid: false, message: 'Invalid OTP' };
  otpStore.delete(email);
  return { valid: true, message: 'OTP verified successfully' };
};

module.exports = { generateOtp, storeOtp, verifyOtp };
