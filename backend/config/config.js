// Threshold constants for filtering "high" values
module.exports = {
  // Lifetime value threshold
  HIGH_LIFETIME_VALUE: 5000,

  // Purchase thresholds
  HIGH_PURCHASES: 20,

  // Credit balance threshold
  HIGH_CREDIT: 2000,

  // Engagement score threshold (0-100)
  HIGH_ENGAGEMENT: 70,

  // Mobile app usage threshold (0-100)
  HIGH_MOBILE_USAGE: 50,

  // Discount usage rate threshold (0-100)
  HIGH_DISCOUNT_RATE: 40,

  // Cart abandonment rate threshold (0-100)
  HIGH_CART_ABANDONMENT: 50,

  // Login frequency threshold
  HIGH_LOGIN_FREQUENCY: 15,

  // Session duration threshold (minutes)
  HIGH_SESSION_DURATION: 30,
  LOW_SESSION_DURATION: 10,

  // Days since last purchase for "recent" buyers
  RECENT_BUYER_DAYS: 30,

  // Days since last purchase for "inactive" customers
  INACTIVE_DAYS: 90,

  // Minimum reviews to be a "top reviewer"
  TOP_REVIEWER_REVIEWS: 10,

  // Membership years for "loyal" customers
  LOYAL_MEMBERSHIP_YEARS: 5,

  // Average order value threshold
  HIGH_ORDER_VALUE: 200,

  // Premium customer criteria (combined)
  PREMIUM_LIFETIME: 8000,
  PREMIUM_PURCHASES: 30,

  // Pagination defaults
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,

  // Sort field mappings (query alias -> MongoDB field)
  SORT_FIELDS: {
    age: 'age',
    membershipYears: 'membershipYears',
    loginFrequency: 'loginFrequency',
    sessionDuration: 'sessionDurationAvg',
    purchases: 'totalPurchases',
    averageOrderValue: 'averageOrderValue',
    lifetimeValue: 'lifetimeValue',
    creditBalance: 'creditBalance',
    discountRate: 'discountUsageRate',
    mobileUsage: 'mobileAppUsage',
    daysSinceLastPurchase: 'daysSinceLastPurchase',
    cartAbandonment: 'cartAbandonmentRate',
    reviews: 'productReviewsWritten',
    engagement: 'socialMediaEngagementScore',
  },

  // API Version
  API_VERSION: '1.0.0',
};
