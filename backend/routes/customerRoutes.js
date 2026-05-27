const express = require('express');
const router = express.Router();
const c = require('../controllers/customerController');
const adv = require('../controllers/advancedController');
const { customerCreateRules, customerUpdateRules, validate } = require('../middleware/validator');
const { generalLimiter, heavyLimiter } = require('../middleware/rateLimiter');

router.use(generalLimiter);

// ===== SYSTEM ROUTES (must be before :id) =====
router.get('/system/health', adv.systemHealth);
router.get('/system/version', adv.systemVersion);
router.get('/system/config', adv.systemConfig);

// ===== DASHBOARD =====
router.get('/dashboard/summary', adv.dashboardSummary);
router.get('/dashboard/revenue', adv.dashboardRevenue);

// ===== BULK OPERATIONS =====
router.post('/bulk-create', c.bulkCreate);
router.patch('/bulk-update', c.bulkUpdate);
router.delete('/bulk-delete', c.bulkDelete);

// ===== IMPORT =====
router.post('/import-json', c.importJson);

// ===== CACHE =====
router.post('/cache/clear', adv.clearCache);

// ===== LOGS & ACTIVITY =====
router.get('/logs', adv.getLogs);
router.get('/activity', adv.getActivity);

// ===== LIVE SEARCH =====
router.get('/live-search', adv.liveSearch);

// ===== CUSTOMER INFO ROUTES =====
router.get('/churned', c.getChurned);
router.get('/active', c.getActive);
router.get('/high-value', heavyLimiter, c.getHighValue);
router.get('/high-purchases', c.getHighPurchases);
router.get('/high-credit', c.getHighCredit);
router.get('/high-engagement', c.getHighEngagement);
router.get('/high-mobile-usage', c.getHighMobileUsage);
router.get('/high-discount-users', c.getHighDiscountUsers);
router.get('/recent-buyers', c.getRecentBuyers);
router.get('/inactive', c.getInactive);
router.get('/top-reviewers', c.getTopReviewers);
router.get('/high-cart-abandonment', c.getHighCartAbandonment);
router.get('/frequent-logins', c.getFrequentLogins);
router.get('/loyal', c.getLoyal);
router.get('/premium', c.getPremium);
router.get('/random', heavyLimiter, c.getRandom);
router.get('/trending', c.getTrending);
router.get('/recent', c.getRecent);

// ===== RECOMMENDATIONS & PREDICTIONS =====
router.get('/recommendations', heavyLimiter, adv.getRecommendations);
router.get('/predictions/churn', heavyLimiter, adv.predictChurn);
router.get('/predictions/retention', adv.predictRetention);

// ===== SEGMENTS =====
router.get('/segments/premium', adv.segmentPremium);
router.get('/segments/high-value', adv.segmentHighValue);
router.get('/segments/loyal', adv.segmentLoyal);
router.get('/segments/risky', adv.segmentRisky);
router.get('/segments/inactive', adv.segmentInactive);

// ===== HEATMAPS =====
router.get('/heatmap/countries', adv.heatmapCountries);
router.get('/heatmap/cities', adv.heatmapCities);

// ===== INSIGHTS =====
router.get('/insights/purchases', adv.insightsPurchases);
router.get('/insights/mobile-usage', adv.insightsMobileUsage);
router.get('/insights/discounts', adv.insightsDiscounts);
router.get('/insights/engagement', adv.insightsEngagement);

// ===== ALERTS =====
router.get('/alerts/high-churn', adv.alertsHighChurn);
router.get('/alerts/inactive-users', adv.alertsInactiveUsers);
router.get('/alerts/high-cart-abandonment', adv.alertsHighCartAbandonment);

// ===== SORT ROUTES =====
router.get('/sort/age-desc', c.sortByAgeDesc);
router.get('/sort/purchases-desc', c.sortByPurchasesDesc);
router.get('/sort/lifetime-desc', c.sortByLifetimeDesc);
router.get('/sort/login-desc', c.sortByLoginDesc);
router.get('/sort/credit-desc', c.sortByCreditDesc);

// ===== FILTER ROUTES =====
router.get('/filter/high-purchases', c.filterHighPurchases);
router.get('/filter/high-lifetime', c.filterHighLifetime);
router.get('/filter/high-credit', c.filterHighCredit);
router.get('/filter/high-login', c.filterHighLogin);
router.get('/filter/high-mobile', c.filterHighMobile);
router.get('/filter/high-discount', c.filterHighDiscount);
router.get('/filter/high-cart-abandonment', c.filterHighCartAbandonment);
router.get('/filter/high-engagement', c.filterHighEngagement);
router.get('/filter/high-reviews', c.filterHighReviews);
router.get('/filter/churned', c.filterChurned);
router.get('/filter/active', c.filterActive);
router.get('/filter/low-session', c.filterLowSession);
router.get('/filter/high-session', c.filterHighSession);
router.get('/filter/high-order-value', c.filterHighOrderValue);
router.get('/filter/loyal', c.filterLoyal);

// ===== ROUTE PARAMETER ROUTES =====
router.get('/exists/:id', c.checkExists);
router.get('/country/:country', c.getByCountry);
router.get('/city/:city', c.getByCity);
router.get('/gender/:gender', c.getByGender);
router.get('/age/:age', c.getByAge);
router.get('/signup-quarter/:quarter', c.getBySignupQuarter);
router.get('/login-frequency/:value', c.getByLoginFrequency);
router.get('/session-duration/:value', c.getBySessionDuration);
router.get('/purchases/:value', c.getByPurchases);
router.get('/lifetime/:value', c.getByLifetimeValue);
router.get('/credit/:value', c.getByCreditBalance);
router.get('/churn-status/:status', c.getByChurnStatus);
router.get('/mobile-usage/:value', c.getByMobileUsage);
router.get('/discount-rate/:value', c.getByDiscountRate);
router.get('/reviews/:value', c.getByReviews);

// ===== BASIC CRUD (keep :id routes last) =====
router.get('/', c.getAll);
router.post('/', customerCreateRules, validate, c.create);
router.get('/:id', c.getById);
router.put('/:id', customerCreateRules, validate, c.replaceOne);
router.patch('/:id', customerUpdateRules, validate, c.updateOne);
router.delete('/:id', c.deleteOne);

// ===== HEAD & OPTIONS =====
router.head('/', (req, res) => { res.set('X-Total-Count', '0').status(200).end(); });
router.head('/:id', (req, res) => { res.status(200).end(); });
router.head('/country/:country', (req, res) => { res.status(200).end(); });
router.head('/system/health', (req, res) => { res.status(200).end(); });

router.options('/', (req, res) => { res.set('Allow', 'GET, POST, HEAD, OPTIONS').json({ methods: ['GET', 'POST', 'HEAD', 'OPTIONS'] }); });
router.options('/:id', (req, res) => { res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS').json({ methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] }); });
router.options('/system/health', (req, res) => { res.set('Allow', 'GET, HEAD, OPTIONS').json({ methods: ['GET', 'HEAD', 'OPTIONS'] }); });

module.exports = router;
