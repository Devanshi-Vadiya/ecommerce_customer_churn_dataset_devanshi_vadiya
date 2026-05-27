const express = require('express');
const router = express.Router();
const a = require('../controllers/analyticsController');
const { analyticsLimiter } = require('../middleware/rateLimiter');

router.use(analyticsLimiter);

router.get('/customers/top-buyers', a.topBuyers);
router.get('/customers/top-lifetime', a.topLifetime);
router.get('/customers/top-credit', a.topCredit);
router.get('/customers/top-engagement', a.topEngagement);
router.get('/customers/top-mobile-users', a.topMobileUsers);
router.get('/customers/top-discount-users', a.topDiscountUsers);
router.get('/customers/top-reviewers', a.topReviewers);
router.get('/customers/churn-analysis', a.churnAnalysis);
router.get('/customers/retention', a.retention);
router.get('/customers/session-analysis', a.sessionAnalysis);
router.get('/customers/purchase-analysis', a.purchaseAnalysis);
router.get('/customers/country-analysis', a.countryAnalysis);
router.get('/customers/city-analysis', a.cityAnalysis);
router.get('/customers/signup-analysis', a.signupAnalysis);
router.get('/customers/payment-analysis', a.paymentAnalysis);

// HEAD
router.head('/customers/top-buyers', (req, res) => res.status(200).end());

module.exports = router;
