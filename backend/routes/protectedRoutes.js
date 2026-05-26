const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { customerCreateRules, customerUpdateRules, validate } = require('../middleware/validator');

router.use(auth);

router.post('/customers', customerCreateRules, validate, asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({ success: true, data: customer });
}));

router.patch('/customers/:id', customerUpdateRules, validate, asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) return next(new ApiError(404, 'Customer not found'));
  res.json({ success: true, data: customer });
}));

router.delete('/customers/:id', asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return next(new ApiError(404, 'Customer not found'));
  res.json({ success: true, message: 'Customer deleted successfully' });
}));

module.exports = router;
