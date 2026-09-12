const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    category: {
      type: String,
      enum: [
        "Login Problem",
        "Registration Problem",
        "OTP / Verification",
        "Tour Planning",
        "Birthday Planning",
        "Profile Problem",
        "Notification Problem",
        "Website Error",
        "Other",
      ],
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    attachment: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
      fileName: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Closed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Support || mongoose.model("Support", supportSchema);
