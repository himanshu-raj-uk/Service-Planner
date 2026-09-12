const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpire: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.PendingUser ||
  mongoose.model("PendingUser", pendingUserSchema);
