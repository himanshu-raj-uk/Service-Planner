const express = require("express");

const app = express.Router();

const validate = require("../Middleware/Validate");
const { auth, roleAuth } = require("../Middleware/RoleAuth");
const { birthdaySchema } = require("../ValidateJoi/Validate");
const { createBirthday } = require("../Controller/Birthday.ai.controller");


app.post("/create",validate(birthdaySchema), auth, roleAuth("user"), createBirthday);

module.exports = app;