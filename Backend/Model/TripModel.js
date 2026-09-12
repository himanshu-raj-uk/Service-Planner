const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    startLocation: {
      type: String,
      required: true,
      trim: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 1,
    },

    people: {
      type: Number,
      required: true,
      min: 1,
    },

    days: {
      type: Number,
      required: true,
      min: 1,
    },

    travelType: {
      type: String,
      enum: [
        "Solo",
        "Couple",
        "Family",
        "Friends",
        "Business",
      ],
      required: true,
    },

    hotelType: {
      type: String,
      enum: [
        "Budget",
        "Standard",
        "Luxury",
      ],
      required: true,
    },

    transport: {
      type: String,
      enum: [
        "Car",
        "Bike",
        "Bus",
        "Train",
        "Flight",
        "Any",
      ],
      default: "Any",
    },

    foodPreference: {
      type: String,
      enum: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Jain",
        "Any",
      ],
      default: "Any",
    },

    specialRequest: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Created",
        "Booked",
        "Completed",
        "Cancelled",
      ],
      default: "Created",
    },

    estimatedCost: {
      type: Number,
      default: 0,
    },

    aiPlan: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    review: {
      type: String,
      default: "",
    },

    isBooked: {
      type: Boolean,
      default: false,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);