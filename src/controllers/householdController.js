const asyncHandler = require("express-async-handler");
const Household = require("../models/houseHoldModel");
const User = require("../models/userModel");
const { sendInviteEmail } = require("../utility/emailSender");
// @desc    Create a household (user becomes owner)
const createHousehold = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const household = await Household.create({
    name,
    owner: req.user._id,
  });

  // Update user's role
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      households: {
        householdId: household._id,
        role: "owner",
      },
    },
  });

  res.status(201).json(household);
});

// @desc    Join a household (user becomes member)
const joinHousehold = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  const household = await Household.findOne({ inviteCode });
  if (!household) {
    res.status(404);
    throw new Error("Household not found");
  }

  // Check if already a member
  const isMember = req.user.households.some((h) =>
    h.householdId.equals(household._id)
  );
  if (isMember) {
    res.status(400);
    throw new Error("Already a member");
  }

  // Add to members array
  // Add to members array
  await Household.findByIdAndUpdate(household._id, {
    $addToSet: { members: req.user._id },
    $pull: { pendingInvites: req.user._id },
  });

  // Update user's households
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      households: {
        householdId: household._id,
        role: "member",
      },
    },
  });

  res.json({ success: true });
});

// @desc    Send invite email
const sendInvite = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { householdId } = req.params;

  const household = await Household.findById(householdId);
  if (!household) {
    res.status(404);
    throw new Error("Household not found");
  }

  if (!household.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the owner can send invites");
  }

  if (
    household.members.includes(userId) ||
    household.pendingInvites.includes(userId)
  ) {
    res.status(200);
    res.json({ success: true });
    return;
  }

  const user = await User.findById(userId).select("email");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await sendInviteEmail(user.email, household.inviteCode, household.name);

  household.pendingInvites.push(userId);
  await household.save();

  res.json({ success: true });
});

// @desc    Send bulk invites and update pendingInvites
const sendBulkInvites = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const { userIds: invitees } = req.body; // array of userIds

  const household = await Household.findById(householdId);
  if (!household) {
    res.status(404);
    throw new Error("Household not found");
  }

  if (!household.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the owner can send invites");
  }

  const filteredInvitees = invitees.filter(
    (uid) =>
      !household.members.includes(uid) &&
      !household.pendingInvites.includes(uid)
  );

  if (filteredInvitees.length === 0) {
    return res.json({ success: true, invitedCount: 0 });
  }

  const users = await User.find({ _id: { $in: filteredInvitees } }).select(
    "email"
  );

  // Send invites
  for (const user of users) {
    await sendInviteEmail(user.email, household.inviteCode, household.name);
  }

  // Add to pendingInvites
  household.pendingInvites.push(...filteredInvitees);
  await household.save();

  res.json({ success: true, invitedCount: filteredInvitees.length });
});

//@desc    Remove a member
const removeMember = asyncHandler(async (req, res) => {
  const { householdId, userId } = req.params;

  // 1. Verify requester is owner
  const household = await Household.findById(householdId);
  if (!household.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the owner can remove members");
  }

  // 2. Prevent owner from removing themselves
  if (userId === req.user._id.toString()) {
    res.status(400);
    throw new Error("Owners cannot remove themselves");
  }

  // 3. Update Household (remove from members array)
  await Household.findByIdAndUpdate(householdId, {
    $pull: { members: userId },
  });

  // 4. Update User (remove household reference)
  await User.findByIdAndUpdate(userId, {
    $pull: { households: { householdId } },
  });

  res.json({ success: true });
});

// @desc    Get all households where user is owner or member
const getUserHouseholds = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const households = await Household.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "fullName email") // Optional: populate owner info
    .populate("members", "fullName email"); // Optional: populate member info

  res.json(households);
});

const getHouseHoldById = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const household = await Household.findById(householdId).populate("members");
  res.json(household);
});

// @desc    Member removes themselves from a household
// @route   DELETE /api/households/:householdId/leave
// @access  Private
const removeSelfFromHousehold = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const userId = req.user._id;

  const household = await Household.findById(householdId);
  if (!household) {
    res.status(404);
    throw new Error("Household not found");
  }

  if (household.owner.equals(userId)) {
    res.status(400);
    throw new Error("Owner cannot leave the household");
  }

  if (!household.members.includes(userId)) {
    res.status(400);
    throw new Error("You are not a member of this household");
  }

  household.members = household.members.filter(
    (memberId) => !memberId.equals(userId)
  );

  await household.save();

  res.json({ success: true, message: "You have left the household" });
});

// @desc    Owner deletes the entire household
// @route   DELETE /api/households/:householdId
// @access  Private
const deleteHousehold = asyncHandler(async (req, res) => {
  const { householdId } = req.params;

  const household = await Household.findById(householdId);
  if (!household) {
    res.status(404);
    throw new Error("Household not found");
  }

  if (!household.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the owner can delete the household");
  }

  await household.deleteOne();

  await User.updateMany(
    { "households.householdId": householdId },
    { $pull: { households: { householdId } } }
  );

  res.json({ success: true, message: "Household deleted successfully" });
});

module.exports = {
  createHousehold,
  joinHousehold,
  sendInvite,
  removeMember,
  getUserHouseholds,
  sendBulkInvites,
  getHouseHoldById,
  deleteHousehold,
  removeSelfFromHousehold,
};
