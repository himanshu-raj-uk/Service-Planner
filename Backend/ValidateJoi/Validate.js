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
  budget: Joi.number().min(1).required(),
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
  budget: Joi.number().positive().required(),
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

module.exports = {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  plannerSchema,
  birthdaySchema,
};
