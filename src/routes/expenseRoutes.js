const express = require("express");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");
const {
  createExpense,
  getExpenses,
  getBalances,
  getSettleUpSuggestions,
  payShare,
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
router.post("/pay/:expenseId", AuthenticationHandler, payShare);

module.exports = { expenseRouter: router };
