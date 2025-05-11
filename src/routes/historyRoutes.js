const express = require("express");
const router = express.Router();
const {
  getHistory,
  exportHistoryToCSV,
} = require("../controllers/historyController");

router.get("/previous/:householdId", getHistory);

router.get("/export/:householdId", exportHistoryToCSV);

module.exports = { historyRouter: router };
