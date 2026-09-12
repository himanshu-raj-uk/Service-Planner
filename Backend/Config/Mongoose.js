const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongoose_Connect);

    console.log("Database Connected Successfully");
  } catch (err) {
    console.log(" Database Error:", err.message);
  }
};

module.exports = connectDB;
