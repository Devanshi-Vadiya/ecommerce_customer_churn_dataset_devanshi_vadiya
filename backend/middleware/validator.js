const { body, param, validationResult } = require('express-validator');

/**
 * Process validation results and return errors if any.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value,
      })),
    });
  }
  next();
};

// Customer creation validation rules
const customerCreateRules = [
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be a number between 0 and 150'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('country').notEmpty().trim().withMessage('Country is required'),
  body('city').notEmpty().trim().withMessage('City is required'),
  body('membershipYears').isInt({ min: 0 }).withMessage('Membership years must be a non-negative integer'),
  body('loginFrequency').isInt({ min: 0 }).withMessage('Login frequency must be a non-negative integer'),
  body('sessionDurationAvg').isFloat({ min: 0 }).withMessage('Session duration must be a non-negative number'),
  body('pagesPerSession').isFloat({ min: 0 }).withMessage('Pages per session must be a non-negative number'),
  body('cartAbandonmentRate').isFloat({ min: 0, max: 100 }).withMessage('Cart abandonment rate must be between 0 and 100'),
  body('wishlistItems').isInt({ min: 0 }).withMessage('Wishlist items must be a non-negative integer'),
  body('totalPurchases').isInt({ min: 0 }).withMessage('Total purchases must be a non-negative integer'),
  body('averageOrderValue').isFloat({ min: 0 }).withMessage('Average order value must be a non-negative number'),
  body('daysSinceLastPurchase').isInt({ min: 0 }).withMessage('Days since last purchase must be a non-negative integer'),
  body('discountUsageRate').isFloat({ min: 0, max: 100 }).withMessage('Discount usage rate must be between 0 and 100'),
  body('returnsRate').isFloat({ min: 0, max: 100 }).withMessage('Returns rate must be between 0 and 100'),
  body('emailOpenRate').isFloat({ min: 0, max: 100 }).withMessage('Email open rate must be between 0 and 100'),
  body('customerServiceCalls').isInt({ min: 0 }).withMessage('Customer service calls must be a non-negative integer'),
  body('productReviewsWritten').isInt({ min: 0 }).withMessage('Product reviews must be a non-negative integer'),
  body('socialMediaEngagementScore').isFloat({ min: 0, max: 100 }).withMessage('Engagement score must be between 0 and 100'),
  body('mobileAppUsage').isFloat({ min: 0, max: 100 }).withMessage('Mobile app usage must be between 0 and 100'),
  body('paymentMethodDiversity').isInt({ min: 1, max: 5 }).withMessage('Payment method diversity must be between 1 and 5'),
  body('lifetimeValue').isFloat({ min: 0 }).withMessage('Lifetime value must be a non-negative number'),
  body('creditBalance').isFloat({ min: 0 }).withMessage('Credit balance must be a non-negative number'),
  body('churned').isBoolean().withMessage('Churned must be a boolean'),
  body('signupQuarter').isIn(['Q1', 'Q2', 'Q3', 'Q4']).withMessage('Signup quarter must be Q1, Q2, Q3, or Q4'),
];

// Customer update validation rules (all optional)
const customerUpdateRules = [
  body('age').optional().isInt({ min: 0, max: 150 }).withMessage('Age must be a number between 0 and 150'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('country').optional().notEmpty().trim().withMessage('Country cannot be empty'),
  body('city').optional().notEmpty().trim().withMessage('City cannot be empty'),
  body('membershipYears').optional().isInt({ min: 0 }).withMessage('Membership years must be a non-negative integer'),
  body('loginFrequency').optional().isInt({ min: 0 }).withMessage('Login frequency must be a non-negative integer'),
  body('sessionDurationAvg').optional().isFloat({ min: 0 }).withMessage('Session duration must be a non-negative number'),
  body('pagesPerSession').optional().isFloat({ min: 0 }).withMessage('Pages per session must be a non-negative number'),
  body('cartAbandonmentRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Cart abandonment rate must be between 0 and 100'),
  body('wishlistItems').optional().isInt({ min: 0 }).withMessage('Wishlist items must be a non-negative integer'),
  body('totalPurchases').optional().isInt({ min: 0 }).withMessage('Total purchases must be a non-negative integer'),
  body('averageOrderValue').optional().isFloat({ min: 0 }).withMessage('Average order value must be a non-negative number'),
  body('daysSinceLastPurchase').optional().isInt({ min: 0 }).withMessage('Days since last purchase must be a non-negative integer'),
  body('discountUsageRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount usage rate must be between 0 and 100'),
  body('returnsRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Returns rate must be between 0 and 100'),
  body('emailOpenRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Email open rate must be between 0 and 100'),
  body('customerServiceCalls').optional().isInt({ min: 0 }).withMessage('Customer service calls must be a non-negative integer'),
  body('productReviewsWritten').optional().isInt({ min: 0 }).withMessage('Product reviews must be a non-negative integer'),
  body('socialMediaEngagementScore').optional().isFloat({ min: 0, max: 100 }).withMessage('Engagement score must be between 0 and 100'),
  body('mobileAppUsage').optional().isFloat({ min: 0, max: 100 }).withMessage('Mobile app usage must be between 0 and 100'),
  body('paymentMethodDiversity').optional().isInt({ min: 1, max: 5 }).withMessage('Payment method diversity must be between 1 and 5'),
  body('lifetimeValue').optional().isFloat({ min: 0 }).withMessage('Lifetime value must be a non-negative number'),
  body('creditBalance').optional().isFloat({ min: 0 }).withMessage('Credit balance must be a non-negative number'),
  body('churned').optional().isBoolean().withMessage('Churned must be a boolean'),
  body('signupQuarter').optional().isIn(['Q1', 'Q2', 'Q3', 'Q4']).withMessage('Signup quarter must be Q1, Q2, Q3, or Q4'),
];

// Auth validation rules
const registerRules = [
  body('name').notEmpty().trim().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  validate,
  customerCreateRules,
  customerUpdateRules,
  registerRules,
  loginRules,
};
