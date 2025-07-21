const mongoose = require('mongoose');
async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/CodeMate");
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Connection error:', err);
  }
}
module.exports = connectDB;