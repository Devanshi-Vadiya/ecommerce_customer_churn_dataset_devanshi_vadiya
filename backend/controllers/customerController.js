const Customer = require('../models/Customer');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { getSortObject } = require('../utils/sortHelper');
const { buildFilter } = require('../utils/filterBuilder');
const config = require('../config/config');

// Helper: fetch with filter, sort, pagination
const fetchCustomers = async (query, filter = {}) => {
  const { page, limit, skip } = getPagination(query);
  const sort = getSortObject(query.sort);
  const total = await Customer.countDocuments(filter);
  const customers = await Customer.find(filter).sort(sort).skip(skip).limit(limit);
  return { success: true, ...getPaginationMeta(total, page, limit), data: customers };
};

// ===== BASIC CRUD =====
exports.getAll = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);
  const result = await fetchCustomers(req.query, filter);
  res.json(result);
});

exports.getById = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return next(new ApiError(404, 'Customer not found'));
  res.json({ success: true, data: customer });
});

exports.create = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({ success: true, data: customer });
});

exports.replaceOne = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, overwrite: true });
  if (!customer) return next(new ApiError(404, 'Customer not found'));
  res.json({ success: true, data: customer });
});

exports.updateOne = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) return next(new ApiError(404, 'Customer not found'));
  res.json({ success: true, data: customer });
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return next(new ApiError(404, 'Customer not found'));
  res.json({ success: true, message: 'Customer deleted successfully', data: customer });
});

exports.checkExists = asyncHandler(async (req, res) => {
  const exists = await Customer.exists({ _id: req.params.id });
  res.json({ success: true, exists: !!exists });
});

exports.bulkCreate = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) return res.status(400).json({ success: false, error: 'Request body must be a non-empty array' });
  const customers = await Customer.insertMany(req.body, { ordered: false });
  res.status(201).json({ success: true, count: customers.length, data: customers });
});

exports.bulkUpdate = asyncHandler(async (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates) || updates.length === 0) return res.status(400).json({ success: false, error: 'Updates must be a non-empty array of {id, data}' });
  const results = await Promise.all(updates.map(u => Customer.findByIdAndUpdate(u.id, u.data, { new: true, runValidators: true })));
  res.json({ success: true, count: results.filter(Boolean).length, data: results.filter(Boolean) });
});

exports.bulkDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, error: 'IDs must be a non-empty array' });
  const result = await Customer.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, deletedCount: result.deletedCount });
});

// ===== CUSTOMER INFO ROUTES =====
const makeFilterRoute = (filter) => asyncHandler(async (req, res) => {
  const result = await fetchCustomers(req.query, filter);
  res.json(result);
});

exports.getChurned = makeFilterRoute({ churned: true });
exports.getActive = makeFilterRoute({ churned: false });
exports.getHighValue = makeFilterRoute({ lifetimeValue: { $gte: config.HIGH_LIFETIME_VALUE } });
exports.getHighPurchases = makeFilterRoute({ totalPurchases: { $gte: config.HIGH_PURCHASES } });
exports.getHighCredit = makeFilterRoute({ creditBalance: { $gte: config.HIGH_CREDIT } });
exports.getHighEngagement = makeFilterRoute({ socialMediaEngagementScore: { $gte: config.HIGH_ENGAGEMENT } });
exports.getHighMobileUsage = makeFilterRoute({ mobileAppUsage: { $gte: config.HIGH_MOBILE_USAGE } });
exports.getHighDiscountUsers = makeFilterRoute({ discountUsageRate: { $gte: config.HIGH_DISCOUNT_RATE } });
exports.getRecentBuyers = makeFilterRoute({ daysSinceLastPurchase: { $lte: config.RECENT_BUYER_DAYS } });
exports.getInactive = makeFilterRoute({ daysSinceLastPurchase: { $gte: config.INACTIVE_DAYS } });
exports.getTopReviewers = makeFilterRoute({ productReviewsWritten: { $gte: config.TOP_REVIEWER_REVIEWS } });
exports.getHighCartAbandonment = makeFilterRoute({ cartAbandonmentRate: { $gte: config.HIGH_CART_ABANDONMENT } });
exports.getFrequentLogins = makeFilterRoute({ loginFrequency: { $gte: config.HIGH_LOGIN_FREQUENCY } });
exports.getLoyal = makeFilterRoute({ membershipYears: { $gte: config.LOYAL_MEMBERSHIP_YEARS } });
exports.getPremium = makeFilterRoute({ lifetimeValue: { $gte: config.PREMIUM_LIFETIME }, totalPurchases: { $gte: config.PREMIUM_PURCHASES } });

// ===== ROUTE PARAMETER ROUTES =====
exports.getByCountry = asyncHandler(async (req, res) => {
  const result = await fetchCustomers(req.query, { country: new RegExp(`^${req.params.country}$`, 'i') });
  res.json(result);
});
exports.getByCity = asyncHandler(async (req, res) => {
  const result = await fetchCustomers(req.query, { city: new RegExp(`^${req.params.city}$`, 'i') });
  res.json(result);
});
exports.getByGender = asyncHandler(async (req, res) => {
  const g = req.params.gender;
  if (!['Male', 'Female', 'Other'].includes(g.charAt(0).toUpperCase() + g.slice(1).toLowerCase())) {
    return res.status(400).json({ success: false, error: 'Gender must be Male, Female, or Other' });
  }
  const result = await fetchCustomers(req.query, { gender: new RegExp(`^${g}$`, 'i') });
  res.json(result);
});
exports.getByAge = asyncHandler(async (req, res) => {
  const age = parseInt(req.params.age, 10);
  if (isNaN(age)) return res.status(400).json({ success: false, error: 'Invalid numeric value for age' });
  const result = await fetchCustomers(req.query, { age });
  res.json(result);
});
exports.getBySignupQuarter = asyncHandler(async (req, res) => {
  const q = req.params.quarter.toUpperCase();
  if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(q)) return res.status(400).json({ success: false, error: 'Quarter must be Q1, Q2, Q3, or Q4' });
  const result = await fetchCustomers(req.query, { signupQuarter: q });
  res.json(result);
});

const makeNumericParamRoute = (field) => asyncHandler(async (req, res) => {
  const val = parseFloat(req.params.value);
  if (isNaN(val)) return res.status(400).json({ success: false, error: `Invalid numeric value` });
  const result = await fetchCustomers(req.query, { [field]: val });
  res.json(result);
});

exports.getByLoginFrequency = makeNumericParamRoute('loginFrequency');
exports.getBySessionDuration = makeNumericParamRoute('sessionDurationAvg');
exports.getByPurchases = makeNumericParamRoute('totalPurchases');
exports.getByLifetimeValue = makeNumericParamRoute('lifetimeValue');
exports.getByCreditBalance = makeNumericParamRoute('creditBalance');
exports.getByMobileUsage = makeNumericParamRoute('mobileAppUsage');
exports.getByDiscountRate = makeNumericParamRoute('discountUsageRate');
exports.getByReviews = makeNumericParamRoute('productReviewsWritten');

exports.getByChurnStatus = asyncHandler(async (req, res) => {
  const s = req.params.status.toLowerCase();
  if (!['true', 'false', '1', '0', 'churned', 'active'].includes(s)) {
    return res.status(400).json({ success: false, error: 'Invalid churn status. Use true/false, 1/0, or churned/active' });
  }
  const churned = ['true', '1', 'churned'].includes(s);
  const result = await fetchCustomers(req.query, { churned });
  res.json(result);
});

// ===== SORT ROUTES =====
const makeSortRoute = (sortField, order = -1) => asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const total = await Customer.countDocuments();
  const customers = await Customer.find().sort({ [sortField]: order }).skip(skip).limit(limit);
  res.json({ success: true, ...getPaginationMeta(total, page, limit), data: customers });
});

exports.sortByAgeDesc = makeSortRoute('age', -1);
exports.sortByPurchasesDesc = makeSortRoute('totalPurchases', -1);
exports.sortByLifetimeDesc = makeSortRoute('lifetimeValue', -1);
exports.sortByLoginDesc = makeSortRoute('loginFrequency', -1);
exports.sortByCreditDesc = makeSortRoute('creditBalance', -1);

// ===== FILTER ROUTES =====
exports.filterHighPurchases = makeFilterRoute({ totalPurchases: { $gte: config.HIGH_PURCHASES } });
exports.filterHighLifetime = makeFilterRoute({ lifetimeValue: { $gte: config.HIGH_LIFETIME_VALUE } });
exports.filterHighCredit = makeFilterRoute({ creditBalance: { $gte: config.HIGH_CREDIT } });
exports.filterHighLogin = makeFilterRoute({ loginFrequency: { $gte: config.HIGH_LOGIN_FREQUENCY } });
exports.filterHighMobile = makeFilterRoute({ mobileAppUsage: { $gte: config.HIGH_MOBILE_USAGE } });
exports.filterHighDiscount = makeFilterRoute({ discountUsageRate: { $gte: config.HIGH_DISCOUNT_RATE } });
exports.filterHighCartAbandonment = makeFilterRoute({ cartAbandonmentRate: { $gte: config.HIGH_CART_ABANDONMENT } });
exports.filterHighEngagement = makeFilterRoute({ socialMediaEngagementScore: { $gte: config.HIGH_ENGAGEMENT } });
exports.filterHighReviews = makeFilterRoute({ productReviewsWritten: { $gte: config.TOP_REVIEWER_REVIEWS } });
exports.filterChurned = makeFilterRoute({ churned: true });
exports.filterActive = makeFilterRoute({ churned: false });
exports.filterLowSession = makeFilterRoute({ sessionDurationAvg: { $lte: config.LOW_SESSION_DURATION } });
exports.filterHighSession = makeFilterRoute({ sessionDurationAvg: { $gte: config.HIGH_SESSION_DURATION } });
exports.filterHighOrderValue = makeFilterRoute({ averageOrderValue: { $gte: config.HIGH_ORDER_VALUE } });
exports.filterLoyal = makeFilterRoute({ membershipYears: { $gte: config.LOYAL_MEMBERSHIP_YEARS } });

// ===== RANDOM =====
exports.getRandom = asyncHandler(async (req, res) => {
  const [customer] = await Customer.aggregate([{ $sample: { size: 1 } }]);
  if (!customer) return res.status(404).json({ success: false, error: 'No customers found' });
  res.json({ success: true, data: customer });
});

// ===== RECENT & TRENDING =====
exports.getRecent = asyncHandler(async (req, res) => {
  const result = await fetchCustomers(req.query, { daysSinceLastPurchase: { $lte: 7 } });
  res.json(result);
});

exports.getTrending = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const total = await Customer.countDocuments({ daysSinceLastPurchase: { $lte: 30 }, loginFrequency: { $gte: 10 } });
  const customers = await Customer.find({ daysSinceLastPurchase: { $lte: 30 }, loginFrequency: { $gte: 10 } })
    .sort({ totalPurchases: -1, lifetimeValue: -1 }).skip(skip).limit(limit);
  res.json({ success: true, ...getPaginationMeta(total, page, limit), data: customers });
});

// ===== IMPORT JSON =====
exports.importJson = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data || (Array.isArray(data) && data.length === 0)) return res.status(400).json({ success: false, error: 'Invalid JSON data. Provide an array of customer objects.' });
  const arr = Array.isArray(data) ? data : [data];
  const customers = await Customer.insertMany(arr, { ordered: false });
  res.status(201).json({ success: true, count: customers.length, data: customers });
});
