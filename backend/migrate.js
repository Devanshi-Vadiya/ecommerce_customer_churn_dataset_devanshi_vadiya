const mongoose = require('mongoose');
const Customer = require('./models/Customer');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  // Check if data collection exists
  const collections = await db.listCollections().toArray();
  const hasDataCol = collections.some(c => c.name === 'data');
  const hasCustomersCol = collections.some(c => c.name === 'customers');
  
  if (!hasDataCol && hasCustomersCol) {
    console.log('Renaming "customers" collection to "data" for migration...');
    await db.collection('customers').rename('data');
  } else if (!hasDataCol) {
    console.log('No "data" or "customers" collection found to migrate from.');
    await mongoose.disconnect();
    return;
  }
  
  // Clear any partially migrated documents to start fresh (in case customers exists alongside data)
  console.log('Clearing existing customers collection (if any)...');
  await Customer.deleteMany({});
  
  console.log('Starting migration from "data" collection to "customers" collection...');
  const cursor = db.collection('data').find({});
  let count = 0;
  let batch = [];
  const batchSize = 1000;
  
  const clip = (val) => Math.max(0, Math.min(100, parseFloat(val || 0)));
  const nonNeg = (val) => Math.max(0, parseFloat(val || 0));
  const nonNegInt = (val) => Math.max(0, Math.round(parseFloat(val || 0)));
  
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    
    // Map fields from capitalized string format to our schema format, cleaning values to fit schema validators
    const mapped = {
      age: Math.min(120, nonNegInt(doc.Age || doc.age)), // Clip age to a max of 120
      gender: doc.Gender || doc.gender || 'Other',
      country: doc.Country || doc.country || '',
      city: doc.City || doc.city || '',
      membershipYears: nonNeg(doc.Membership_Years || doc.membershipYears),
      loginFrequency: nonNegInt(doc.Login_Frequency || doc.loginFrequency),
      sessionDurationAvg: nonNeg(doc.Session_Duration_Avg || doc.sessionDurationAvg),
      pagesPerSession: nonNeg(doc.Pages_Per_Session || doc.pagesPerSession),
      cartAbandonmentRate: clip(doc.Cart_Abandonment_Rate || doc.cartAbandonmentRate),
      wishlistItems: nonNegInt(doc.Wishlist_Items || doc.wishlistItems),
      totalPurchases: nonNegInt(doc.Total_Purchases || doc.totalPurchases),
      averageOrderValue: nonNeg(doc.Average_Order_Value || doc.averageOrderValue),
      daysSinceLastPurchase: nonNegInt(doc.Days_Since_Last_Purchase || doc.daysSinceLastPurchase),
      discountUsageRate: clip(doc.Discount_Usage_Rate || doc.discountUsageRate),
      returnsRate: clip(doc.Returns_Rate || doc.returnsRate),
      emailOpenRate: clip(doc.Email_Open_Rate || doc.emailOpenRate),
      customerServiceCalls: nonNegInt(doc.Customer_Service_Calls || doc.customerServiceCalls),
      productReviewsWritten: nonNegInt(doc.Product_Reviews_Written || doc.productReviewsWritten),
      socialMediaEngagementScore: clip(doc.Social_Media_Engagement_Score || doc.socialMediaEngagementScore),
      mobileAppUsage: clip(doc.Mobile_App_Usage || doc.mobileAppUsage),
      paymentMethodDiversity: Math.max(1, Math.min(5, nonNegInt(doc.Payment_Method_Diversity || doc.paymentMethodDiversity))),
      lifetimeValue: nonNeg(doc.Lifetime_Value || doc.lifetimeValue),
      creditBalance: nonNeg(doc.Credit_Balance || doc.creditBalance),
      churned: String(doc.Churned || doc.churned) === '1' || String(doc.Churned || doc.churned).toLowerCase() === 'true',
      signupQuarter: doc.Signup_Quarter || doc.signupQuarter || 'Q1'
    };
    
    // Ensure gender is normalized to Capitalized form
    if (mapped.gender) {
      mapped.gender = mapped.gender.charAt(0).toUpperCase() + mapped.gender.slice(1).toLowerCase();
      if (!['Male', 'Female', 'Other'].includes(mapped.gender)) {
        mapped.gender = 'Other';
      }
    }
    
    batch.push(mapped);
    count++;
    
    if (batch.length >= batchSize) {
      await Customer.insertMany(batch);
      console.log(`Migrated ${count} documents...`);
      batch = [];
    }
  }
  
  if (batch.length > 0) {
    await Customer.insertMany(batch);
    console.log(`Migrated final ${batch.length} documents.`);
  }
  
  console.log(`Migration completed successfully! Total documents migrated: ${count}`);
  await mongoose.disconnect();
}

run().catch(console.error);
