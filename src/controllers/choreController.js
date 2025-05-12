const asyncHandler = require("express-async-handler");
const Chore = require("../models/choreModel");
const Household = require("../models/houseHoldModel");

// Create a new chore
// Create a new chore
const createChore = asyncHandler(async (req, res) => {
  const { name, frequency, householdId, assignedTo, dueDate } = req.body;

  const household = await Household.findById(householdId).populate("members");
  if (!household) throw new Error("Household not found");

  // Validate that the assigned user is a member of the household
  if (assignedTo) {
    const isMember = household.members.some(
      (member) => member._id.toString() === assignedTo.toString()
    );
    const isOwner = household.owner.toString() === assignedTo.toString();

    if (!isMember && !isOwner) {
      res.status(400);
      throw new Error(
        "Assigned user must be a member or owner of the household"
      );
    }
  }

  // Use assignedTo if provided, otherwise use the first member
  const firstAssigneeId =
    assignedTo?.toString() || household.members[0]._id.toString();

  const now = new Date();
  const lastDate = new Date(now);

  if (frequency === "daily") {
    lastDate.setDate(now.getDate() + 1);
  } else if (frequency === "weekly") {
    lastDate.setDate(now.getDate() + 7);
  } else if (frequency === "monthly") {
    lastDate.setMonth(now.getMonth() + 1);
  }

  if (dueDate) {
    lastDate.setTime(new Date(dueDate).getTime());
  }

  const chore = await Chore.create({
    name,
    frequency,
    householdId,
    assignedTo: firstAssigneeId,
    rotationIndex: 0,
    dueDate: lastDate,
    isOverDue: false,
  });

  res.status(201).json(chore);
});

// Get all chores for a household
const getChores = asyncHandler(async (req, res) => {
  const { householdId } = req.params;

  // Get the household with members
  const household = await Household.findById(householdId).populate(
    "members",
    "name _id"
  );
  if (!household) {
    return res.status(404).json({ message: "Household not found" });
  }

  const members = household.members;
  const chores = await Chore.find({ householdId });

  const now = new Date();
  const updatedChores = await Promise.all(
    chores.map(async (chore) => {
      // Check and update isOverDue
      const wasOverdue = chore.isOverDue;
      const isNowOverdue = chore.dueDate < now;

      if (wasOverdue !== isNowOverdue) {
        chore.isOverDue = isNowOverdue;
      }

      // Only update rotation-based assignment if there's no manual assignment
      if (!chore.assignedTo && members.length > 0) {
        if (chore.rotationIndex < members.length) {
          const user = members[chore.rotationIndex % members.length];
          chore.assignedTo = user._id;
        } else {
          chore.assignedTo = null; // fallback if no members
        }
      }

      await chore.save();

      return chore.populate("assignedTo", "name _id");
    })
  );

  res.json(updatedChores);
});

// Mark chore as done and rotate
const completeChore = asyncHandler(async (req, res) => {
  const { choreId } = req.params;

  const chore = await Chore.findById(choreId);
  if (!chore) throw new Error("Chore not found");

  const household = await Household.findById(chore.householdId).populate(
    "members"
  );
  if (!household) throw new Error("Household not found");

  // Create a combined array of members and owner for rotation
  const allParticipants = [...household.members];
  if (
    !allParticipants.some(
      (member) => member._id.toString() === household.owner.toString()
    )
  ) {
    allParticipants.push(household.owner);
  }

  const now = new Date();
  const wasMissed = chore.dueDate < now; // was overdue

  // ✅ 1. Log this completion
  chore.history.push({
    user: req.user._id,
    completedAt: now,
    wasMissed,
  });

  // ✅ 2. Update chore's dueDate based on frequency, starting from now if it was missed
  const newDueDate = new Date(wasMissed ? now : chore.dueDate);
  if (chore.frequency === "daily") {
    newDueDate.setDate(newDueDate.getDate() + 1);
  } else if (chore.frequency === "weekly") {
    newDueDate.setDate(newDueDate.getDate() + 7);
  } else if (chore.frequency === "monthly") {
    newDueDate.setMonth(newDueDate.getMonth() + 1);
  }
  chore.dueDate = newDueDate;

  // ✅ 3. Reset overdue flag
  chore.isOverDue = false;

  // ✅ 4. Rotate assignedTo if there are multiple participants
  if (allParticipants.length <= 1) {
    chore.assignedTo = req.user._id;
    chore.rotationIndex = 0;
  } else {
    const nextIndex = (chore.rotationIndex + 1) % allParticipants.length;
    chore.assignedTo = allParticipants[nextIndex]._id ?? req.user._id;
    chore.rotationIndex = nextIndex;
  }

  await chore.save();
  res.json({ success: true });
});

const getChoreById = asyncHandler(async (req, res) => {
  const { choreId } = req.params;
  const chore = await Chore.findById(choreId);
  res.json(chore);
});

const deleteChore = asyncHandler(async (req, res) => {
  const { choreId } = req.params;

  const chore = await Chore.findById(choreId);
  if (!chore) {
    res.status(404);
    throw new Error("Chore not found");
  }

  const household = await Household.findById(chore.householdId);
  if (!household) {
    res.status(404);
    throw new Error("Associated household not found");
  }

  // Check if the logged-in user is the owner of the household
  if (household.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the household owner can delete chores");
  }

  await chore.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Chore deleted successfully" });
});

module.exports = {
  createChore,
  getChores,
  completeChore,
  getChoreById,
  deleteChore,
};
