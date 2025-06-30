// importing mongoose module
const mongoose = require('mongoose');
// async function to connect to DB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/CodeMate');
    console.log('Database connected suggesfully Connected');
  } catch (err) {
    console.error('Connection error:', err);
  }
}
// exporting it as module
module.exports = connectDB;