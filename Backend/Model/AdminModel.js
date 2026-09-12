const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    designation: {
      type: String,
      default: "Admin",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    resetVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Admin", adminSchema);
