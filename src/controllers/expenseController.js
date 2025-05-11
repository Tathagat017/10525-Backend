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

const getBalances = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const expenses = await Expense.find({ householdId });

  const balanceMap = {};

  for (const exp of expenses) {
    const { payer, participants, amount } = exp;

    // Add the full amount to payer's balance
    balanceMap[payer] = (balanceMap[payer] || 0) + amount;

    // Subtract each participant's share
    for (const { user, share, amountPaid } of participants) {
      const shareAmount = amount * share;
      balanceMap[user] = (balanceMap[user] || 0) - shareAmount;

      // If participant has paid, add their payment to their balance
      if (amountPaid > 0) {
        balanceMap[user] = (balanceMap[user] || 0) + amountPaid;
        balanceMap[payer] = (balanceMap[payer] || 0) - amountPaid;
      }
    }
  }

  res.json(balanceMap);
});

// Settle up suggestion (minimize transactions)
// ... existing code ...

// Settle up suggestion (minimize transactions)
const getSettleUpSuggestions = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const expenses = await Expense.find({ householdId });

  const balanceMap = {};

  // Calculate balances using the same logic as getBalances
  for (const exp of expenses) {
    const { payer, participants, amount } = exp;

    // Add the full amount to payer's balance
    balanceMap[payer] = (balanceMap[payer] || 0) + amount;

    // Subtract each participant's share
    for (const { user, share, amountPaid } of participants) {
      const shareAmount = amount * share;
      balanceMap[user] = (balanceMap[user] || 0) - shareAmount;

      // If participant has paid, add their payment to their balance
      if (amountPaid > 0) {
        balanceMap[user] = (balanceMap[user] || 0) + amountPaid;
        balanceMap[payer] = (balanceMap[payer] || 0) - amountPaid;
      }
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

// Pay your share
const payShare = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user._id;
  const { amount } = req.body;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const participant = expense.participants.find(
    (p) => p.user.toString() === userId.toString()
  );

  if (!participant) {
    res.status(403);
    throw new Error("You are not a participant of this expense");
  }

  if (participant.isPaid) {
    res.status(400);
    throw new Error("You already paid your share");
  }

  const expectedAmount = expense.amount * participant.share;
  if (Math.abs(amount - expectedAmount) > 0.01) {
    res.status(400);
    throw new Error("Incorrect amount paid");
  }

  participant.isPaid = true;
  participant.amountPaid = amount;

  const allPaid = expense.participants.every((p) => p.isPaid);
  expense.isCompletelyPaid = allPaid;

  await expense.save();

  res.json({ success: true, expense });
});

module.exports = {
  createExpense,
  getExpenses,
  getBalances,
  getSettleUpSuggestions,
  payShare,
};
