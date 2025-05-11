const express = require("express");
const router = express.Router();
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");
const {
  createChore,
  getChores,
  completeChore,
  getChoreById,
} = require("../controllers/choreController");

router.post("/add", AuthenticationHandler, createChore);
router.post("/allChores/:householdId", AuthenticationHandler, getChores);
router.get("/singleChore/:choreId", AuthenticationHandler, getChoreById);
router.patch("/mark/:choreId/complete", AuthenticationHandler, completeChore);

module.exports = { choreRouter: router };
