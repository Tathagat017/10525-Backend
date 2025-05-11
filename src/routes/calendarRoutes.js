const express = require("express");
const router = express.Router();
const { getCalendarEvents } = require("../controllers/calendarController");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");

router.get("/:householdId", AuthenticationHandler, getCalendarEvents);

module.exports = { calendarRouter: router };
