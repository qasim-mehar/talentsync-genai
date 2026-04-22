const mongoose = require("mongoose");
async function DBConnect() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connect successfully");
  } catch (err) {
    console.log("Database not connected");
  }
}
module.exports = DBConnect;
