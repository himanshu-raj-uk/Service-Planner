const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    eventType: {
      type: String,
      enum: [
        "Corporate",
        "Wedding",
        "Anniversary",
        "Engagement",
        "Conference",
        "Workshop",
        "Seminar",
        "Meetup",
        "College",
        "School",
        "Festival",
        "Religious",
        "Sports",
        "Cultural",
        "Exhibition",
        "Networking",
        "Product Launch",
        "Award Ceremony",
        "Charity",
        "Other",
      ],
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      default: "",
      trim: true,
    },

    people: {
      type: Number,
      required: true,
      min: 10,
    },

    budget: {
      type: Number,
      required: true,
      min: 10000,
    },

    location: {
      country: {
        type: String,
        default: "India",
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      area: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },
    },

    venueType: {
      type: String,
      enum: [
        "Office",
        "Home",
        "Restaurant",
        "Cafe",
        "Hotel",
        "Banquet",
        "Conference Hall",
        "Rooftop",
        "Outdoor",
        "Resort",
        "Community Hall",
        "Stadium",
        "Exhibition Hall",
        "Other",
        "Any",
      ],
      default: "Any",
    },

    theme: {
      type: String,
      default: "",
      trim: true,
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

    catering: {
      type: Boolean,
      default: false,
    },

    decoration: {
      type: Boolean,
      default: false,
    },

    photography: {
      type: Boolean,
      default: false,
    },

    entertainment: {
      type: Boolean,
      default: false,
    },

    music: {
      type: Boolean,
      default: false,
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

module.exports =
  mongoose.models.Event || mongoose.model("Event", EventSchema);