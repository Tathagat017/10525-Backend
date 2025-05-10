// const mongoose = require("mongoose");

// const startUpProfileSchema = new mongoose.Schema(
//   {
//     founderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Founder",
//       required: true,
//     },
//     startUpName: {
//       type: String,
//       required: true,
//     },
//     companyVision: {
//       type: String,
//       required: true,
//     },
//     productDescription: {
//       type: String,
//       required: true,
//     },
//     marketSize: {
//       type: String,
//       enum: ["small", "medium", "large"],
//       required: true,
//     },
//     businessModel: {
//       type: String,
//       required: true,
//     },
//     pitchPdf: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const StartUpProfile = mongoose.model("StartUpProfile", startUpProfileSchema);

// module.exports = { StartUpProfile };
