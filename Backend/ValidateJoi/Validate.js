const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(20).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const verifyOtpSchema = Joi.object({
  otp: Joi.string().length(6).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(20).required(),
});

const plannerSchema = Joi.object({
  destination: Joi.string().trim().required(),
  startLocation: Joi.string().trim().required(),
  budget: Joi.number().min(5000).required(),
  people: Joi.number().min(1).required(),
  days: Joi.number().min(1).required(),
  travelType: Joi.string().trim().required(),
  hotelType: Joi.string().trim().required(),
  transport: Joi.string().trim().required(),
  foodPreference: Joi.string().trim().required(),
  services: Joi.array().items(Joi.string().valid("Tour")),
  notes: Joi.string().allow(""),
});

const birthdaySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  age: Joi.number().integer().min(1).required(),
  area: Joi.string().trim().min(2).max(100).required(),
  budget: Joi.number().positive().min(1000).required(),
  people: Joi.number().integer().min(1).required(),
  cakeFlavour: Joi.string()
    .valid(
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
    )
    .required(),
  cakeWeight: Joi.number().valid(0.5, 1, 1.5, 2, 2.5, 3, 4, 5).required(),
  prank: Joi.string().valid("Yes", "No").required(),
  eventType: Joi.string()
    .valid(
      "Kids Party",
      "Teen Party",
      "Adult Gathering",
      "Milestone Birthday",
      "Surprise Party",
    )
    .required(),
  venueType: Joi.string()
    .valid("Cafe", "Restaurant", "Rooftop", "Banquet", "Outdoor", "Any")
    .default("Any"),
  foodPreference: Joi.string()
    .valid("Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Any")
    .default("Any"),
  specialRequest: Joi.string().trim().allow("").default(""),
});

const eventSchema = Joi.object({
  eventName: Joi.string().trim().required(),
  eventType: Joi.string().trim().required(),
  eventDate: Joi.date().required(),
  startTime: Joi.string().trim().required(),
  endTime: Joi.string().trim().allow(""),
  people: Joi.number().integer().min(10).required(),
  budget: Joi.number().min(10000).required(),
  location: Joi.object({
    country: Joi.string().trim().default("India"),
    state: Joi.string().trim().required(),
    area: Joi.string().trim().required(),
    address: Joi.string().trim().allow(""),
  }).required(),
  venueType: Joi.string()
    .valid(
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
    )
    .default("Any"),
  theme: Joi.string().trim().allow(""),
  foodPreference: Joi.string()
    .valid(
      "Vegetarian",
      "Non-Vegetarian",
      "Vegan",
      "Jain",
      "Any",
    )
    .default("Any"),
  catering: Joi.boolean().default(false),
  decoration: Joi.boolean().default(false),
  photography: Joi.boolean().default(false),
  entertainment: Joi.boolean().default(false),
  music: Joi.boolean().default(false),
  specialRequest: Joi.string().trim().allow(""),
  services: Joi.array().items(Joi.string()),
  notes: Joi.string().allow(""),
});


const addressSchema = Joi.object({
  houseNo: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "House / Flat number is required.",
      "string.min": "House / Flat number is required.",
      "string.max": "House / Flat number cannot exceed 100 characters.",
      "any.required": "House / Flat number is required.",
    }),

  area: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.empty": "Area is required.",
      "string.min": "Area must be at least 2 characters.",
      "string.max": "Area cannot exceed 150 characters.",
      "any.required": "Area is required.",
    }),

  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "City is required.",
      "string.min": "City must be at least 2 characters.",
      "string.max": "City cannot exceed 100 characters.",
      "any.required": "City is required.",
    }),

  state: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "State is required.",
      "string.min": "State is required.",
      "string.max": "State cannot exceed 100 characters.",
      "any.required": "State is required.",
    }),

  country: Joi.string()
    .trim()
    .valid("India")
    .default("India")
    .required()
    .messages({
      "any.only": "Country must be India.",
      "string.empty": "Country is required.",
      "any.required": "Country is required.",
    }),

  pincode: Joi.string()
    .trim()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "Pincode is required.",
      "string.pattern.base": "Pincode must be exactly 6 digits.",
      "any.required": "Pincode is required.",
    }),
}).required();

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 3 characters.",
      "string.max": "Name cannot exceed 50 characters.",
      "any.required": "Name is required.",
    }),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "any.required": "Phone number is required.",
    }),

  address: addressSchema,
}).required();


module.exports = {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  plannerSchema,
  birthdaySchema,
  eventSchema,
  updateProfileSchema
};
