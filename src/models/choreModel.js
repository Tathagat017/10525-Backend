const mongoose = require("mongoose");

const choreSchema = new mongoose.Schema(
  {
    householdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    name: { type: String, required: true },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isOverDue: { type: Boolean, default: false },
    rotationIndex: {
      type: Number,
      default: 0,
    },
    history: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        completedAt: Date,
        wasMissed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Chore = mongoose.model("Chore", choreSchema);
module.exports = Chore;
