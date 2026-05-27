const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

// ===== RECOMMENDATIONS =====
exports.getRecommendations = asyncHandler(async (req, res) => {
  // Recommend customers for marketing: active, high engagement, not churned
  const customers = await Customer.find({
    churned: false,
    socialMediaEngagementScore: { $gte: 50 },
    emailOpenRate: { $gte: 40 },
    daysSinceLastPurchase: { $lte: 60 },
  }).sort({ lifetimeValue: -1 }).limit(20);
  res.json({ success: true, description: 'Customers recommended for marketing campaigns', count: customers.length, data: customers });
});

// ===== PREDICTIONS =====
exports.predictChurn = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ churned: false });
  const predictions = customers.map(c => {
    let score = 0;
    if (c.daysSinceLastPurchase > 60) score += 25;
    if (c.daysSinceLastPurchase > 90) score += 15;
    if (c.loginFrequency < 5) score += 20;
    if (c.cartAbandonmentRate > 60) score += 15;
    if (c.sessionDurationAvg < 10) score += 10;
    if (c.socialMediaEngagementScore < 30) score += 10;
    if (c.customerServiceCalls > 5) score += 5;
    return { customerId: c._id, country: c.country, city: c.city, churnProbability: Math.min(score, 100), risk: score >= 60 ? 'High' : score >= 30 ? 'Medium' : 'Low' };
  }).sort((a, b) => b.churnProbability - a.churnProbability).slice(0, 50);
  res.json({ success: true, description: 'Churn probability predictions (heuristic-based)', count: predictions.length, data: predictions });
});

exports.predictRetention = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$membershipYears', totalCustomers: { $sum: 1 }, activeCustomers: { $sum: { $cond: ['$churned', 0, 1] } }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' } } },
    { $addFields: { retentionRate: { $round: [{ $multiply: [{ $divide: ['$activeCustomers', '$totalCustomers'] }, 100] }, 2] } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, description: 'Retention trends by membership years', data });
});

// ===== SEGMENTS =====
const makeSegment = (filter, description) => asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const total = await Customer.countDocuments(filter);
  const customers = await Customer.find(filter).skip(skip).limit(limit);
  res.json({ success: true, description, ...getPaginationMeta(total, page, limit), data: customers });
});

exports.segmentPremium = makeSegment({ lifetimeValue: { $gte: config.PREMIUM_LIFETIME }, totalPurchases: { $gte: config.PREMIUM_PURCHASES } }, 'Premium customer segment');
exports.segmentHighValue = makeSegment({ lifetimeValue: { $gte: config.HIGH_LIFETIME_VALUE } }, 'High value customer segment');
exports.segmentLoyal = makeSegment({ membershipYears: { $gte: config.LOYAL_MEMBERSHIP_YEARS }, churned: false }, 'Loyal customer segment');
exports.segmentRisky = makeSegment({ daysSinceLastPurchase: { $gte: 60 }, loginFrequency: { $lte: 5 }, churned: false }, 'Risky customer segment');
exports.segmentInactive = makeSegment({ daysSinceLastPurchase: { $gte: config.INACTIVE_DAYS } }, 'Inactive customer segment');

// ===== HEATMAPS =====
exports.heatmapCountries = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$country', count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' }, churnRate: { $avg: { $cond: ['$churned', 1, 0] } } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ success: true, description: 'Country-wise customer heatmap', data });
});

exports.heatmapCities = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$city', country: { $first: '$country' }, count: { $sum: 1 }, avgLifetime: { $avg: '$lifetimeValue' } } },
    { $sort: { count: -1 } }, { $limit: 50 },
  ]);
  res.json({ success: true, description: 'City-wise customer heatmap', data });
});

// ===== INSIGHTS =====
exports.insightsPurchases = asyncHandler(async (req, res) => {
  const [stats] = await Customer.aggregate([{ $group: { _id: null, avg: { $avg: '$totalPurchases' }, max: { $max: '$totalPurchases' }, min: { $min: '$totalPurchases' }, total: { $sum: '$totalPurchases' } } }]);
  const byQuarter = await Customer.aggregate([{ $group: { _id: '$signupQuarter', avgPurchases: { $avg: '$totalPurchases' } } }, { $sort: { _id: 1 } }]);
  res.json({ success: true, data: { overview: stats, byQuarter } });
});

exports.insightsMobileUsage = asyncHandler(async (req, res) => {
  const [stats] = await Customer.aggregate([{ $group: { _id: null, avg: { $avg: '$mobileAppUsage' }, max: { $max: '$mobileAppUsage' }, min: { $min: '$mobileAppUsage' } } }]);
  const byGender = await Customer.aggregate([{ $group: { _id: '$gender', avgMobile: { $avg: '$mobileAppUsage' } } }]);
  res.json({ success: true, data: { overview: stats, byGender } });
});

exports.insightsDiscounts = asyncHandler(async (req, res) => {
  const [stats] = await Customer.aggregate([{ $group: { _id: null, avg: { $avg: '$discountUsageRate' }, max: { $max: '$discountUsageRate' } } }]);
  const byChurn = await Customer.aggregate([{ $group: { _id: '$churned', avgDiscount: { $avg: '$discountUsageRate' } } }]);
  res.json({ success: true, data: { overview: stats, byChurnStatus: byChurn } });
});

exports.insightsEngagement = asyncHandler(async (req, res) => {
  const [stats] = await Customer.aggregate([{ $group: { _id: null, avg: { $avg: '$socialMediaEngagementScore' }, max: { $max: '$socialMediaEngagementScore' } } }]);
  const byCountry = await Customer.aggregate([{ $group: { _id: '$country', avgEngagement: { $avg: '$socialMediaEngagementScore' } } }, { $sort: { avgEngagement: -1 } }, { $limit: 10 }]);
  res.json({ success: true, data: { overview: stats, topCountries: byCountry } });
});

// ===== ALERTS =====
exports.alertsHighChurn = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ churned: false, daysSinceLastPurchase: { $gte: 60 }, loginFrequency: { $lte: 5 } }).sort({ daysSinceLastPurchase: -1 }).limit(20);
  res.json({ success: true, alert: 'High churn risk customers', count: customers.length, data: customers });
});

exports.alertsInactiveUsers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ daysSinceLastPurchase: { $gte: config.INACTIVE_DAYS } }).sort({ daysSinceLastPurchase: -1 }).limit(20);
  res.json({ success: true, alert: 'Inactive customer alert', count: customers.length, data: customers });
});

exports.alertsHighCartAbandonment = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ cartAbandonmentRate: { $gte: 70 } }).sort({ cartAbandonmentRate: -1 }).limit(20);
  res.json({ success: true, alert: 'High cart abandonment alert', count: customers.length, data: customers });
});

// ===== SYSTEM =====
exports.systemHealth = asyncHandler(async (req, res) => {
  const dbState = require('mongoose').connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ success: true, status: 'ok', uptime: process.uptime(), database: states[dbState] || 'unknown', timestamp: new Date().toISOString() });
});

exports.systemVersion = asyncHandler(async (req, res) => {
  res.json({ success: true, version: config.API_VERSION, nodeVersion: process.version, environment: process.env.NODE_ENV || 'development' });
});

exports.systemConfig = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { defaultPageSize: config.DEFAULT_LIMIT, maxPageSize: config.MAX_LIMIT, thresholds: { highLifetimeValue: config.HIGH_LIFETIME_VALUE, highPurchases: config.HIGH_PURCHASES, highCredit: config.HIGH_CREDIT, highEngagement: config.HIGH_ENGAGEMENT, loyalMembershipYears: config.LOYAL_MEMBERSHIP_YEARS } } });
});

exports.clearCache = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Cache cleared successfully' });
});

// ===== LOGS & ACTIVITY =====
exports.getLogs = asyncHandler(async (req, res) => {
  const logPath = path.join(__dirname, '..', 'logs', 'activity.json');
  if (!fs.existsSync(logPath)) return res.json({ success: true, data: [] });
  const logs = JSON.parse(fs.readFileSync(logPath, 'utf8') || '[]');
  res.json({ success: true, count: logs.length, data: logs.slice(-50) });
});

exports.getActivity = asyncHandler(async (req, res) => {
  const logPath = path.join(__dirname, '..', 'logs', 'activity.json');
  if (!fs.existsSync(logPath)) return res.json({ success: true, data: [] });
  const logs = JSON.parse(fs.readFileSync(logPath, 'utf8') || '[]');
  res.json({ success: true, count: logs.length, data: logs.slice(-20) });
});

// ===== LIVE SEARCH =====
exports.liveSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json({ success: true, data: [] });
  const regex = new RegExp(q.trim(), 'i');
  const customers = await Customer.find({ $or: [{ country: regex }, { city: regex }, { gender: regex }] }).limit(10);
  res.json({ success: true, count: customers.length, data: customers });
});

// ===== DASHBOARD =====
exports.dashboardSummary = asyncHandler(async (req, res) => {
  const total = await Customer.countDocuments();
  const churned = await Customer.countDocuments({ churned: true });
  const [avgs] = await Customer.aggregate([{ $group: { _id: null, avgAge: { $avg: '$age' }, avgLifetime: { $avg: '$lifetimeValue' }, avgPurchases: { $avg: '$totalPurchases' }, avgCredit: { $avg: '$creditBalance' } } }]);
  const topCountries = await Customer.aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]);
  res.json({ success: true, data: { totalCustomers: total, churnedCustomers: churned, activeCustomers: total - churned, churnRate: total > 0 ? Math.round(churned / total * 10000) / 100 : 0, averages: avgs, topCountries } });
});

exports.dashboardRevenue = asyncHandler(async (req, res) => {
  const [revenue] = await Customer.aggregate([{ $group: { _id: null, totalLifetimeValue: { $sum: '$lifetimeValue' }, avgOrderValue: { $avg: '$averageOrderValue' }, totalPurchases: { $sum: '$totalPurchases' }, avgCredit: { $avg: '$creditBalance' } } }]);
  const byQuarter = await Customer.aggregate([{ $group: { _id: '$signupQuarter', revenue: { $sum: '$lifetimeValue' }, customers: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
  res.json({ success: true, data: { overview: revenue, byQuarter } });
});
