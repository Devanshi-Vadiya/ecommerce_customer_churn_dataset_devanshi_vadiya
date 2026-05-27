const express = require('express');
const router = express.Router();
const s = require('../controllers/statsController');

router.get('/customers/count', s.totalCount);
router.get('/customers/average-age', s.averageAge);
router.get('/customers/average-lifetime', s.averageLifetime);
router.get('/customers/average-credit', s.averageCredit);
router.get('/customers/average-order-value', s.averageOrderValue);
router.get('/customers/highest-purchases', s.highestPurchases);
router.get('/customers/highest-lifetime', s.highestLifetime);
router.get('/customers/highest-credit', s.highestCredit);
router.get('/customers/country-count', s.countryCount);
router.get('/customers/city-count', s.cityCount);
router.get('/customers/gender-count', s.genderCount);
router.get('/customers/churn-count', s.churnCount);
router.get('/customers/signup-quarter-count', s.signupQuarterCount);
router.get('/customers/review-count', s.reviewCount);
router.get('/customers/mobile-usage', s.mobileUsageStats);

// HEAD
router.head('/customers/count', (req, res) => res.status(200).end());

module.exports = router;
