/*
this module is created to connect the backend server with DataBase (moongoDB compass)
here we imported the mongoose and dotenv module which helps in connection
.env file store the url when using local host and mongodb atlas string when deploying on servers
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Connection error:', err);
  }
}
module.exports = connectDB;