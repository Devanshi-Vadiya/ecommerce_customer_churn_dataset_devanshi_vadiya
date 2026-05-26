const express = require('express');
const router = express.Router();
const ac = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerRules, loginRules, validate } = require('../middleware/validator');

// Public routes
router.post('/register', authLimiter, registerRules, validate, ac.register);
router.post('/login', authLimiter, loginRules, validate, ac.login);
router.post('/forgot-password', authLimiter, ac.forgotPassword);
router.post('/reset-password', ac.resetPassword);
router.post('/verify-email', ac.verifyEmail);
router.post('/send-otp', ac.sendOtp);
router.post('/verify-otp', ac.verifyOtp);
router.post('/resend-verification', ac.resendVerification);

// Protected routes
router.post('/logout', auth, ac.logout);
router.get('/profile', auth, ac.getProfile);
router.patch('/profile', auth, ac.updateProfile);
router.delete('/profile', auth, ac.deleteProfile);
router.post('/change-password', auth, ac.changePassword);
router.get('/session', auth, ac.getSession);
router.delete('/session', auth, ac.destroyAllSessions);

// HEAD & OPTIONS
router.head('/profile', auth, (req, res) => res.status(200).end());
router.options('/login', (req, res) => { res.set('Allow', 'POST, OPTIONS').json({ methods: ['POST', 'OPTIONS'] }); });

module.exports = router;
