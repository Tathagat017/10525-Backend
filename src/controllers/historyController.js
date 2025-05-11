const asyncHandler = require("express-async-handler");
const Chore = require("../models/choreModel");
const Expense = require("../models/expenseModel");
const moment = require("moment");
const json2csv = require("json2csv").parse; // CSV export functionality

// Get combined history (chores and expenses)
const getHistory = asyncHandler(async (req, res) => {
  const { householdId } = req.params;

  // Fetch chores with history
  const chores = await Chore.find({ householdId }).populate(
    "history.user",
    "name"
  );

  // Fetch expenses
  const expenses = await Expense.find({ householdId }).populate(
    "payer",
    "name participants"
  );

  let history = [];

  // Combine chore history (logs of completed chores)
  chores.forEach((chore) => {
    chore.history.forEach((entry) => {
      history.push({
        type: "chore",
        action: `Chore: ${chore.name} completed by ${entry.user.name}`,
        date: entry.completedAt,
      });
    });
  });

  // Combine expense history (logs of expense creation and payments)
  expenses.forEach((expense) => {
    history.push({
      type: "expense",
      action: `Expense: ${expense.name} - Payer: ${expense.payer.name}`,
      date: expense.createdAt, // Use createdAt timestamp for expenses
    });
    expense.participants.forEach((participant) => {
      history.push({
        type: "expense",
        action: `Expense Payment: ${expense.name} - Payer: ${expense.payer.name} to Participant: ${participant.name}`,
        date: expense.createdAt, // Use createdAt timestamp for payments
      });
    });
  });

  // Sort by date (ascending order)
  history.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json(history);
});

// Export history to CSV
const exportHistoryToCSV = asyncHandler(async (req, res) => {
  const { householdId } = req.params;

  // Fetch chores and expenses as we did for the history
  const chores = await Chore.find({ householdId }).populate(
    "history.user",
    "name"
  );
  const expenses = await Expense.find({ householdId }).populate(
    "payer",
    "name participants"
  );

  let history = [];

  // Combine chore history
  chores.forEach((chore) => {
    chore.history.forEach((entry) => {
      history.push({
        type: "chore",
        action: `Chore: ${chore.name} completed by ${entry.user.name}`,
        date: entry.completedAt,
      });
    });
  });

  // Combine expense history
  expenses.forEach((expense) => {
    history.push({
      type: "expense",
      action: `Expense: ${expense.description} - Payer: ${expense.payer.name}`,
      date: expense.createdAt, // Use createdAt timestamp for expenses
    });
    expense.participants.forEach((participant) => {
      history.push({
        type: "expense",
        action: `Expense Payment: ${expense.description} - Payer: ${expense.payer.name} to Participant: ${participant.name}`,
        date: expense.createdAt, // Use createdAt timestamp for payments
      });
    });
  });

  // Sort by date (ascending order)
  history.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Convert to CSV format
  const csv = json2csv(history);

  // Set CSV headers
  res.header("Content-Type", "text/csv");
  res.attachment("history.csv");
  res.send(csv);
});

module.exports = { getHistory, exportHistoryToCSV };
