const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { adminLimiter } = require('../middleware/rateLimiter');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

router.use(auth);
router.use(adminAuth);
router.use(adminLimiter);

router.get('/customers', asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const total = await Customer.countDocuments();
  const customers = await Customer.find().skip(skip).limit(limit);
  res.json({ success: true, ...getPaginationMeta(total, page, limit), data: customers });
}));

router.get('/stats', asyncHandler(async (req, res) => {
  const total = await Customer.countDocuments();
  const churned = await Customer.countDocuments({ churned: true });
  const [avgs] = await Customer.aggregate([{ $group: { _id: null, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' }, avgAge: { $avg: '$age' } } }]);
  res.json({ success: true, data: { totalCustomers: total, churnedCustomers: churned, activeCustomers: total - churned, averages: avgs } });
}));

router.get('/churn-analysis', asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$churned', count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' }, avgDaysSincePurchase: { $avg: '$daysSinceLastPurchase' } } },
  ]);
  res.json({ success: true, data });
}));

// OPTIONS
router.options('/customers', (req, res) => { res.set('Allow', 'GET, OPTIONS').json({ methods: ['GET', 'OPTIONS'] }); });

module.exports = router;
