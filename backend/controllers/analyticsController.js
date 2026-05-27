const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');

const topN = (field, limit = 20) => asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort({ [field]: -1 }).limit(limit);
  res.json({ success: true, count: customers.length, data: customers });
});

exports.topBuyers = topN('totalPurchases');
exports.topLifetime = topN('lifetimeValue');
exports.topCredit = topN('creditBalance');
exports.topEngagement = topN('socialMediaEngagementScore');
exports.topMobileUsers = topN('mobileAppUsage');
exports.topDiscountUsers = topN('discountUsageRate');
exports.topReviewers = topN('productReviewsWritten');

exports.churnAnalysis = asyncHandler(async (req, res) => {
  const [result] = await Customer.aggregate([
    { $group: { _id: '$churned', count: { $sum: 1 }, avgAge: { $avg: '$age' }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' }, avgLoginFreq: { $avg: '$loginFrequency' }, avgCartAbandonment: { $avg: '$cartAbandonmentRate' }, avgDaysSincePurchase: { $avg: '$daysSinceLastPurchase' } } },
    { $sort: { _id: 1 } },
  ]);
  const all = await Customer.aggregate([
    { $group: { _id: '$churned', count: { $sum: 1 }, avgAge: { $avg: '$age' }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' }, avgLoginFreq: { $avg: '$loginFrequency' }, avgCartAbandonment: { $avg: '$cartAbandonmentRate' }, avgDaysSincePurchase: { $avg: '$daysSinceLastPurchase' } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, data: all });
});

exports.retention = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$membershipYears', count: { $sum: 1 }, churnedCount: { $sum: { $cond: ['$churned', 1, 0] } }, activeCount: { $sum: { $cond: ['$churned', 0, 1] } }, avgLifetime: { $avg: '$lifetimeValue' } } },
    { $addFields: { retentionRate: { $multiply: [{ $divide: ['$activeCount', '$count'] }, 100] } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, data });
});

exports.sessionAnalysis = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $bucket: { groupBy: '$sessionDurationAvg', boundaries: [0, 10, 20, 30, 40, 50, 100], default: '100+', output: { count: { $sum: 1 }, avgPurchases: { $avg: '$totalPurchases' }, avgLifetime: { $avg: '$lifetimeValue' } } } },
  ]);
  res.json({ success: true, data });
});

exports.purchaseAnalysis = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $bucket: { groupBy: '$totalPurchases', boundaries: [0, 5, 10, 20, 30, 50, 100], default: '100+', output: { count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, avgOrderValue: { $avg: '$averageOrderValue' }, churnRate: { $avg: { $cond: ['$churned', 1, 0] } } } } },
  ]);
  res.json({ success: true, data });
});

exports.countryAnalysis = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$country', count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' }, churnRate: { $avg: { $cond: ['$churned', 1, 0] } } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ success: true, data });
});

exports.cityAnalysis = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$city', count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' } } },
    { $sort: { count: -1 } }, { $limit: 50 },
  ]);
  res.json({ success: true, data });
});

exports.signupAnalysis = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$signupQuarter', count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, churnRate: { $avg: { $cond: ['$churned', 1, 0] } } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, data });
});

exports.paymentAnalysis = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$paymentMethodDiversity', count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, data });
});
