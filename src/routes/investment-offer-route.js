// const express = require("express");
// const { InvestmentOffer } = require("../models/investment-offer-model");
// const {
//   AuthenticationHandler,
// } = require("../middleware/authenticationHandler");

// const router = express.Router();

// // POST /investment-offers - Create a new offer (Investor)
// router.post("/", AuthenticationHandler, async (req, res) => {
//   try {
//     const {
//       investorId,
//       investorName,
//       founderId,
//       offeredAmount,
//       offeredEquity,
//       message,
//     } = req.body;

//     if (
//       !investorId ||
//       !investorName ||
//       !founderId ||
//       !offeredAmount ||
//       !offeredEquity
//     ) {
//       return res.status(400).send({ message: "Missing required fields" });
//     }

//     const newOffer = new InvestmentOffer({
//       investorId,
//       investorName,
//       founderId,
//       offeredAmount,
//       offeredEquity,
//       message,
//       status: "pending",
//       isNewOffer: true,
//       lastUpdatedBy: {
//         userId: req.user._id,
//         role: req.user.role === "founder" ? "founder" : "investor",
//         name: req.user.fullName,
//       },
//     });

//     await newOffer.save();
//     res.status(201).send({ message: "Offer created", offer: newOffer });
//   } catch (err) {
//     console.error("Error creating offer:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // GET /investment-offers/founder/:founderId - Offers received by founder
// router.get("/founder/:founderId", AuthenticationHandler, async (req, res) => {
//   try {
//     const { founderId } = req.params;
//     const offers = await InvestmentOffer.find({ founderId }).sort({
//       createdAt: -1,
//     });
//     res.status(200).send(offers);
//   } catch (err) {
//     console.error("Error getting offers for founder:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // GET /investment-offers/investor/:investorId - Offers sent by investor
// router.get("/investor/:investorId", AuthenticationHandler, async (req, res) => {
//   try {
//     const { investorId } = req.params;
//     const offers = await InvestmentOffer.find({ investorId }).sort({
//       createdAt: -1,
//     });
//     res.status(200).send(offers);
//   } catch (err) {
//     console.error("Error getting offers for investor:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // PUT /investment-offers/:offerId/accept - Accept offer
// router.put("/:offerId/accept", AuthenticationHandler, async (req, res) => {
//   try {
//     const { offerId } = req.params;
//     const offer = await InvestmentOffer.findById(offerId);

//     if (!offer) return res.status(404).send({ message: "Offer not found" });

//     const lastUpdatedRole = offer.lastUpdatedBy?.role;
//     const currentUserRole = req.user.role;

//     // Logic to determine who should accept
//     if (
//       (lastUpdatedRole === "founder" && currentUserRole !== "investor") ||
//       (lastUpdatedRole === "investor" && currentUserRole !== "founder") ||
//       !offer.lastUpdatedBy
//     ) {
//       return res.status(400).send({
//         message: `Only the ${
//           lastUpdatedRole === "investor" ? "founder" : "investor"
//         } can accept the offer.`,
//       });
//     }

//     offer.status = "accepted";
//     offer.isNewOffer = false;
//     offer.lastUpdatedBy = {
//       userId: req.user._id,
//       role: currentUserRole === "founder" ? "founder" : "investor",
//       name: req.user.fullName,
//     };

//     await offer.save();
//     res.status(200).send({ message: "Offer accepted", offer });
//   } catch (err) {
//     console.error("Error accepting offer:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // PUT /investment-offers/:offerId/reject - Reject offer
// router.put("/:offerId/reject", AuthenticationHandler, async (req, res) => {
//   try {
//     const { offerId } = req.params;
//     const offer = await InvestmentOffer.findByIdAndUpdate(
//       offerId,
//       {
//         status: "rejected",
//         isNewOffer: false,
//         lastUpdatedBy: {
//           userId: req.user._id,
//           role: req.user.role === "founder" ? "founder" : "investor",
//           name: req.user.fullName,
//         },
//       },
//       { new: true }
//     );

//     if (!offer) return res.status(404).send({ message: "Offer not found" });
//     res.status(200).send({ message: "Offer rejected", offer });
//   } catch (err) {
//     console.error("Error rejecting offer:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // PUT /investment-offers/:offerId/negotiate
// router.put("/:offerId/negotiate", AuthenticationHandler, async (req, res) => {
//   try {
//     const { offerId } = req.params;
//     const {
//       offeredAmount,
//       offeredEquity,
//       message,
//       userRole,
//       userId,
//       fullName,
//     } = req.body;

//     const offer = await InvestmentOffer.findById(offerId);
//     if (!offer) return res.status(404).send({ message: "Offer not found" });

//     // Push current data to history
//     offer.history.push({
//       offeredAmount: offer.offeredAmount,
//       offeredEquity: offer.offeredEquity,
//       message: offer.message,
//       updatedBy: {
//         userId: userId,
//         role: userRole === "founder" ? "founder" : "investor",
//         name: fullName,
//       },
//     });

//     // Update main fields
//     offer.offeredAmount = offeredAmount;
//     offer.offeredEquity = offeredEquity;
//     offer.message = message;
//     offer.status = "pending";
//     offer.isNewOffer = false;
//     offer.lastUpdatedBy = {
//       userId: userId,
//       role: userRole === "founder" ? "founder" : "investor",
//       name: fullName,
//     };

//     await offer.save();
//     res.status(200).send({ message: "Offer negotiated", offer });
//   } catch (err) {
//     console.error("Error negotiating offer:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // GET /investment-offers/:offerId/history
// router.get("/:offerId/history", AuthenticationHandler, async (req, res) => {
//   try {
//     const { offerId } = req.params;
//     const offer = await InvestmentOffer.findById(offerId, "history");

//     if (!offer) return res.status(404).send({ message: "Offer not found" });
//     res.status(200).send({ history: offer.history });
//   } catch (err) {
//     console.error("Error fetching offer history:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// module.exports = { investmentOfferRouter: router };
