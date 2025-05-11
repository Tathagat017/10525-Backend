const mongoose = require("mongoose");

const householdSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    inviteCode: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 8).toUpperCase(),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Household = mongoose.model("Household", householdSchema);
module.exports = Household;
