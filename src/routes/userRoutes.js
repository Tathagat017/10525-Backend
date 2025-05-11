const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
  getProfile,
} = require("../controllers/userController");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");

const router = express.Router();

router.route("/allUsers").post(AuthenticationHandler, allUsers);
router.route("/register").post(registerUser);
router.post("/login", loginUser);
router.post("/profile", AuthenticationHandler, getProfile);

module.exports = { userRouter: router };
