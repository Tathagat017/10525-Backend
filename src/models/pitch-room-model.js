// // models/pitch-room-model.js
// const mongoose = require("mongoose");

// const chatMessageSchema = new mongoose.Schema({
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// const pitchRoomSchema = new mongoose.Schema(
//   {
//     roomName: { type: String, required: true },
//     founderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Founder",
//       required: true,
//     },
//     investorIds: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "Investor", required: true },
//     ],
//     startTime: { type: Date, required: true },
//     endTime: { type: Date, required: true },
//     pitchPdf: { type: String, required: true }, // URL for the pitch PDF
//     offeredAmount: { type: Number, required: true },
//     offeredEquity: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["scheduled", "completed", "canceled"],
//       default: "scheduled",
//     },
//     chatMessages: [chatMessageSchema],
//   },
//   { timestamps: true }
// );

// const PitchRoom = mongoose.model("PitchRoom", pitchRoomSchema);

// module.exports = { PitchRoom };
