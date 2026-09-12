const mongoose = require("mongoose");

const BirthdaySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Name: {
      type: String,
      required: true,
      trim: true,
    },

    Age: {
      type: Number,
      required: true,
      min: 1,
    },

    Area: {
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

    eventType: {
      type: String,
      enum: [
        "Kids Party",
        "Teen Party",
        "Adult Gathering",
        "Milestone Birthday",
        "Surprise Party",
      ],
      required: true,
    },

    venueType: {
      type: String,
      enum: ["Cafe", "Restaurant", "Rooftop", "Banquet", "Outdoor", "Any"],
      default: "Any",
    },

    cakeFlavour: {
      type: String,
      enum: [
        "Vanilla",
        "Chocolate",
        "Black Forest",
        "White Forest",
        "Red Velvet",
        "Butterscotch",
        "Strawberry",
        "Pineapple",
        "Mango",
        "Blueberry",
        "Raspberry",
        "Coffee",
        "Caramel",
        "KitKat",
        "Oreo",
        "Ferrero Rocher",
        "Choco Truffle",
        "Belgian Chocolate",
        "Fruit Cake",
        "Black Currant",
        "Almond",
        "Pistachio",
        "Rasmalai",
        "Gulab Jamun",
        "Kesar Pista",
        "Kulfi",
        "Lotus Biscoff",
      ],
      required: true,
    },

    cakeWeight: {
      type: Number,
      enum: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5],
      required: true,
    },

    prank: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
      required: true,
    },

    foodPreference: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Any"],
      default: "Any",
    },

    specialRequest: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Created", "Booked", "Completed", "Cancelled"],
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
      trim: true,
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
  },
);

module.exports = mongoose.model("Birthday", BirthdaySchema);
