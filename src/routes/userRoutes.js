const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userController");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");

const router = express.Router();

router.route("/").get(AuthenticationHandler, allUsers);
router.route("/register").post(registerUser);
router.post("/login", loginUser);

module.exports = { userRouter: router };
