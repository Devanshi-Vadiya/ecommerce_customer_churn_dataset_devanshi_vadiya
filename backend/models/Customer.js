const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Gender must be Male, Female, or Other',
      },
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    membershipYears: {
      type: Number,
      required: [true, 'Membership years is required'],
      min: [0, 'Membership years cannot be negative'],
    },
    loginFrequency: {
      type: Number,
      required: [true, 'Login frequency is required'],
      min: [0, 'Login frequency cannot be negative'],
    },
    sessionDurationAvg: {
      type: Number,
      required: [true, 'Session duration average is required'],
      min: [0, 'Session duration cannot be negative'],
    },
    pagesPerSession: {
      type: Number,
      required: [true, 'Pages per session is required'],
      min: [0, 'Pages per session cannot be negative'],
    },
    cartAbandonmentRate: {
      type: Number,
      required: [true, 'Cart abandonment rate is required'],
      min: [0, 'Cart abandonment rate cannot be negative'],
      max: [100, 'Cart abandonment rate cannot exceed 100'],
    },
    wishlistItems: {
      type: Number,
      required: [true, 'Wishlist items is required'],
      min: [0, 'Wishlist items cannot be negative'],
    },
    totalPurchases: {
      type: Number,
      required: [true, 'Total purchases is required'],
      min: [0, 'Total purchases cannot be negative'],
    },
    averageOrderValue: {
      type: Number,
      required: [true, 'Average order value is required'],
      min: [0, 'Average order value cannot be negative'],
    },
    daysSinceLastPurchase: {
      type: Number,
      required: [true, 'Days since last purchase is required'],
      min: [0, 'Days since last purchase cannot be negative'],
    },
    discountUsageRate: {
      type: Number,
      required: [true, 'Discount usage rate is required'],
      min: [0, 'Discount usage rate cannot be negative'],
      max: [100, 'Discount usage rate cannot exceed 100'],
    },
    returnsRate: {
      type: Number,
      required: [true, 'Returns rate is required'],
      min: [0, 'Returns rate cannot be negative'],
      max: [100, 'Returns rate cannot exceed 100'],
    },
    emailOpenRate: {
      type: Number,
      required: [true, 'Email open rate is required'],
      min: [0, 'Email open rate cannot be negative'],
      max: [100, 'Email open rate cannot exceed 100'],
    },
    customerServiceCalls: {
      type: Number,
      required: [true, 'Customer service calls is required'],
      min: [0, 'Customer service calls cannot be negative'],
    },
    productReviewsWritten: {
      type: Number,
      required: [true, 'Product reviews written is required'],
      min: [0, 'Product reviews written cannot be negative'],
    },
    socialMediaEngagementScore: {
      type: Number,
      required: [true, 'Social media engagement score is required'],
      min: [0, 'Engagement score cannot be negative'],
      max: [100, 'Engagement score cannot exceed 100'],
    },
    mobileAppUsage: {
      type: Number,
      required: [true, 'Mobile app usage is required'],
      min: [0, 'Mobile app usage cannot be negative'],
      max: [100, 'Mobile app usage cannot exceed 100'],
    },
    paymentMethodDiversity: {
      type: Number,
      required: [true, 'Payment method diversity is required'],
      min: [1, 'Payment method diversity minimum is 1'],
      max: [5, 'Payment method diversity maximum is 5'],
    },
    lifetimeValue: {
      type: Number,
      required: [true, 'Lifetime value is required'],
      min: [0, 'Lifetime value cannot be negative'],
    },
    creditBalance: {
      type: Number,
      required: [true, 'Credit balance is required'],
      min: [0, 'Credit balance cannot be negative'],
    },
    churned: {
      type: Boolean,
      required: [true, 'Churned status is required'],
      default: false,
    },
    signupQuarter: {
      type: String,
      required: [true, 'Signup quarter is required'],
      enum: {
        values: ['Q1', 'Q2', 'Q3', 'Q4'],
        message: 'Signup quarter must be Q1, Q2, Q3, or Q4',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common queries
customerSchema.index({ country: 1 });
customerSchema.index({ city: 1 });
customerSchema.index({ gender: 1 });
customerSchema.index({ churned: 1 });
customerSchema.index({ signupQuarter: 1 });
customerSchema.index({ lifetimeValue: -1 });
customerSchema.index({ totalPurchases: -1 });
customerSchema.index({ creditBalance: -1 });

module.exports = mongoose.model('Customer', customerSchema);
