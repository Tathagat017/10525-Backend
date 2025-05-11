const express = require("express");
const {
  createHousehold,
  joinHousehold,
  sendInvite,
  removeMember,
  sendBulkInvites,
  getUserHouseholds,
  getHouseHoldById,
  removeSelfFromHousehold,
  deleteHousehold,
} = require("../controllers/householdController");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");

const router = express.Router();

router.get("/:householdId", getHouseHoldById);
router.post("/", AuthenticationHandler, createHousehold);
router.post("/join", AuthenticationHandler, joinHousehold);
router.post("/mine", AuthenticationHandler, getUserHouseholds);
router.post("/single/:householdId/invite", AuthenticationHandler, sendInvite);
router.post(
  "/bulk/:householdId/invite",
  AuthenticationHandler,
  sendBulkInvites
);
router.post(
  "/deleteMember/:householdId/members/:userId",
  AuthenticationHandler,
  removeMember
);
router.post(
  "/selfRemove/:householdId",
  AuthenticationHandler,
  removeSelfFromHousehold
);
router.post("/delete/:householdId", AuthenticationHandler, deleteHousehold);
module.exports = { householdRouter: router };
