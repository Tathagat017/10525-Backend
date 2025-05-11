const asyncHandler = require("express-async-handler");
const Expense = require("../models/expenseModel");
const Chore = require("../models/choreModel");

const getCalendarEvents = asyncHandler(async (req, res) => {
  const { householdId } = req.params;

  const expenses = await Expense.find({ householdId });
  const now = new Date();
  const chores = await Chore.find({ householdId });
  for (const chore of chores) {
    const wasOverdue = chore.isOverDue;
    const isNowOverdue = chore.dueDate < now;

    if (wasOverdue !== isNowOverdue) {
      chore.isOverDue = isNowOverdue;
      await chore.save();
    }
  }

  const expenseEvents = expenses.map((exp) => ({
    id: `expense_${exp._id}`,
    title: `${exp.name} - $${exp.amount}`,
    start: exp.date.toISOString(),
    backgroundColor: "#008080", // red
    extendedProps: {
      type: "expense",
      description: exp.name,
      amount: exp.amount,
    },
  }));

  const choreEvents = chores.map((chore) => ({
    id: `chore-${chore._id}`,
    title: `Chore: ${chore.name}`,
    start: chore.dueDate,
    color: chore.isOverDue || chore.dueDate < now ? "#ff6b6b" : "#339af0",
    extendedProps: {
      type: "chore",
      isOverDue: chore.isOverDue,
      assignedTo: chore.assignedTo,
    },
  }));

  const combined = [...expenseEvents, ...choreEvents];
  res.json(combined);
});

module.exports = { getCalendarEvents };
