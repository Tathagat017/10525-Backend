// const mongoose = require("mongoose");

// const investmentOfferSchema = new mongoose.Schema(
//   {
//     investorName: { type: String, required: true },
//     investorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Investor",
//       required: true,
//     },
//     founderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Founder",
//       required: true,
//     },
//     offeredAmount: { type: Number, required: true },
//     offeredEquity: { type: Number, required: true },
//     message: { type: String },
//     status: {
//       type: String,
//       enum: ["pending", "accepted", "rejected"],
//       default: "pending",
//     },
//     isNewOffer: { type: Boolean, default: true },
//     lastUpdatedBy: {
//       userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//       role: { type: String, enum: ["investor", "founder"], required: true },
//       name: { type: String, required: true },
//     },
//     history: [
//       {
//         offeredAmount: Number,
//         offeredEquity: Number,
//         message: String,
//         updatedAt: { type: Date, default: Date.now },
//         updatedBy: {
//           userId: mongoose.Schema.Types.ObjectId,
//           role: { type: String, enum: ["Investor", "Founder"] },
//           name: String,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const InvestmentOffer = mongoose.model(
//   "InvestmentOffer",
//   investmentOfferSchema
// );

// module.exports = { InvestmentOffer };
