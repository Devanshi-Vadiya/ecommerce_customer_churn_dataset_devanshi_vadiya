const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');

exports.totalCount = asyncHandler(async (req, res) => {
  const count = await Customer.countDocuments();
  res.json({ success: true, data: { totalCustomers: count } });
});

const avgStat = (field, label) => asyncHandler(async (req, res) => {
  const [result] = await Customer.aggregate([{ $group: { _id: null, average: { $avg: `$${field}` } } }]);
  res.json({ success: true, data: { [label]: result ? Math.round(result.average * 100) / 100 : 0 } });
});

exports.averageAge = avgStat('age', 'averageAge');
exports.averageLifetime = avgStat('lifetimeValue', 'averageLifetimeValue');
exports.averageCredit = avgStat('creditBalance', 'averageCreditBalance');
exports.averageOrderValue = avgStat('averageOrderValue', 'averageOrderValue');

const highestStat = (field) => asyncHandler(async (req, res) => {
  const customer = await Customer.findOne().sort({ [field]: -1 });
  res.json({ success: true, data: customer });
});

exports.highestPurchases = highestStat('totalPurchases');
exports.highestLifetime = highestStat('lifetimeValue');
exports.highestCredit = highestStat('creditBalance');

const groupCount = (field) => asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ success: true, data });
});

exports.countryCount = groupCount('country');
exports.cityCount = groupCount('city');
exports.genderCount = groupCount('gender');
exports.signupQuarterCount = groupCount('signupQuarter');

exports.churnCount = asyncHandler(async (req, res) => {
  const data = await Customer.aggregate([
    { $group: { _id: '$churned', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  const total = data.reduce((s, d) => s + d.count, 0);
  res.json({ success: true, data: { breakdown: data, total, churnRate: total > 0 ? Math.round((data.find(d => d._id === true)?.count || 0) / total * 10000) / 100 : 0 } });
});

exports.reviewCount = asyncHandler(async (req, res) => {
  const [result] = await Customer.aggregate([{ $group: { _id: null, totalReviews: { $sum: '$productReviewsWritten' }, avgReviews: { $avg: '$productReviewsWritten' } } }]);
  res.json({ success: true, data: result || { totalReviews: 0, avgReviews: 0 } });
});

exports.mobileUsageStats = asyncHandler(async (req, res) => {
  const [result] = await Customer.aggregate([{ $group: { _id: null, avgUsage: { $avg: '$mobileAppUsage' }, maxUsage: { $max: '$mobileAppUsage' }, minUsage: { $min: '$mobileAppUsage' } } }]);
  res.json({ success: true, data: result || { avgUsage: 0, maxUsage: 0, minUsage: 0 } });
});
