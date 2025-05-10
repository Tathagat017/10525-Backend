// const express = require("express");
// const { StartUpProfile } = require("../models/start-up-profile-model");
// const {
//   AuthenticationHandler,
// } = require("../middleware/authenticationHandler");

// const router = express.Router();

// // ✅ Create a new startup profile
// router.post("/", AuthenticationHandler, async (req, res) => {
//   try {
//     const {
//       founderId,
//       startUpName,
//       companyVision,
//       productDescription,
//       marketSize,
//       businessModel,
//       pitchPdf,
//     } = req.body;

//     if (
//       !founderId ||
//       !startUpName ||
//       !companyVision ||
//       !productDescription ||
//       !marketSize ||
//       !businessModel ||
//       !pitchPdf
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newProfile = new StartUpProfile({
//       founderId,
//       startUpName: startUpName,
//       companyVision: companyVision,
//       productDescription: productDescription,
//       marketSize: marketSize,
//       businessModel: businessModel,
//       pitchPdf,
//     });

//     await newProfile.save();
//     res
//       .status(201)
//       .json({ message: "Startup profile created", profile: newProfile });
//   } catch (err) {
//     console.error("Create error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ Edit an existing startup profile
// router.put("/:id", AuthenticationHandler, async (req, res) => {
//   try {
//     const updatedProfile = await StartUpProfile.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({ message: "Startup profile not found" });
//     }

//     res.json({ message: "Startup profile updated", profile: updatedProfile });
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ Get all startup profiles
// router.get("/", AuthenticationHandler, async (req, res) => {
//   try {
//     const profiles = await StartUpProfile.find();
//     res.json({ profiles });
//   } catch (err) {
//     console.error("Fetch all error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ Get startup profile by founder ID
// router.get("/founder/:founderId", AuthenticationHandler, async (req, res) => {
//   try {
//     const profile = await StartUpProfile.findOne({
//       founderId: req.params.founderId,
//     });

//     if (!profile) {
//       return res.status(200).json(null);
//     }

//     res.json({ profile });
//   } catch (err) {
//     console.error("Fetch by founderId error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// router.patch("/:id/update-funding", async (req, res) => {
//   try {
//     const { requestAmount = 0, requestedEquity = 0 } = req.body;

//     const updatedProfile = await StartUpProfile.findByIdAndUpdate(
//       req.params.id,
//       { requestAmount, requestedEquity },
//       { new: true }
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({ message: "Startup profile not found" });
//     }

//     return res.status(200).json(updatedProfile);
//   } catch (err) {
//     console.error("Update funding error:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// });

// module.exports = { startupProfileRouter: router };
