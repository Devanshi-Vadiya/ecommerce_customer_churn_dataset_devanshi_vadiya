const mongoose = require('mongoose');
require('dotenv').config();

async function checkCollections() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections in ecommerce_churn:", collections.map(c => c.name));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkCollections();
