const mongoose = require('mongoose');

async function testConnection() {
  const uri = "mongodb+srv://devanshivadiyacg_db_user:0groaetH0eEFE803@cluster0.39kiigy.mongodb.net/ecommerce_churn?appName=Cluster0";
  try {
    console.log("Connecting...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
