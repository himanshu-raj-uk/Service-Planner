const express = require("express");

const app = express.Router();

const validate = require("../Middleware/Validate");
const { auth, roleAuth } = require("../Middleware/RoleAuth");
const { createTrip } = require("../Controller/Trip.ai.controller");
const {plannerSchema}  = require("../ValidateJoi/Validate")


app.post("/create", validate(plannerSchema),auth, roleAuth("user"), createTrip);

module.exports = app;