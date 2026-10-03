const express = require("express");

const app = express.Router();

const validate = require("../Middleware/Validate");
const { auth, roleAuth } = require("../Middleware/RoleAuth");
const { createEvent } = require("../Controller/Event.ai.controller");
const {eventSchema}  = require("../ValidateJoi/Validate")


app.post("/create", validate(eventSchema),auth, roleAuth("user"), createEvent);

module.exports = app;