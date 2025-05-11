const asyncHandler = require("express-async-handler");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

// Create a new expense
const createExpense = asyncHandler(async (req, res) => {
  const { householdId, name, amount, date, payer, participants } = req.body;

  if (
    !name ||
    !amount ||
    !payer ||
    !participants ||
    participants.length === 0
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const totalShare = participants.reduce((sum, p) => sum + p.share, 0);
  if (Math.abs(totalShare - 1) > 0.01) {
    res.status(400);
    throw new Error("Total share must equal 100%");
  }

  const expense = await Expense.create({
    householdId,
    name,
    amount,
    date,
    payer,
    participants,
  });

  res.status(201).json(expense);
});

// Get all expenses for a household
const getExpenses = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const expenses = await Expense.find({ householdId })
    .populate("payer")
    .populate("participants.user");
  res.json(expenses);
});

// Get net balances per member
const getBalances = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const expenses = await Expense.find({ householdId });

  const balanceMap = {};

  for (const exp of expenses) {
    const { amount, payer, participants } = exp;
    for (const { user, share } of participants) {
      const owedAmount = amount * share;

      // Owed
      balanceMap[user] = (balanceMap[user] || 0) - owedAmount;

      // Paid
      balanceMap[payer] = (balanceMap[payer] || 0) + owedAmount;
    }
  }

  res.json(balanceMap); // { userId1: -50, userId2: +50, ... }
});

// Settle up suggestion (minimize transactions)
const getSettleUpSuggestions = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const expenses = await Expense.find({ householdId });

  const balanceMap = {};

  for (const exp of expenses) {
    const { amount, payer, participants } = exp;
    for (const { user, share } of participants) {
      const owedAmount = amount * share;
      balanceMap[user] = (balanceMap[user] || 0) - owedAmount;
      balanceMap[payer] = (balanceMap[payer] || 0) + owedAmount;
    }
  }

  const debtors = [];
  const creditors = [];

  Object.entries(balanceMap).forEach(([user, balance]) => {
    if (Math.abs(balance) < 0.01) return;
    if (balance < 0) debtors.push({ user, balance });
    else creditors.push({ user, balance });
  });

  const transactions = [];

  debtors.sort((a, b) => a.balance - b.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  while (debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(-debtor.balance, creditor.balance);

    transactions.push({
      from: debtor.user,
      to: creditor.user,
      amount: Math.round(amount * 100) / 100,
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 0.01) debtors.shift();
    if (Math.abs(creditor.balance) < 0.01) creditors.shift();
  }

  res.json(transactions);
});

module.exports = {
  createExpense,
  getExpenses,
  getBalances,
  getSettleUpSuggestions,
};
