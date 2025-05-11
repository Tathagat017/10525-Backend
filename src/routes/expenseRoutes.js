const express = require("express");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");
const {
  createExpense,
  getExpenses,
  getBalances,
  getSettleUpSuggestions,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", AuthenticationHandler, createExpense);
router.get("/expense/:householdId", AuthenticationHandler, getExpenses);
router.get("/balance/:householdId", AuthenticationHandler, getBalances);
router.get(
  "/settle-up/:householdId",
  AuthenticationHandler,
  getSettleUpSuggestions
);

module.exports = { expenseRouter: router };
