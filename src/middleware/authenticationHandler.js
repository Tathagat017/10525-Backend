const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
dotenv.config();

const AuthenticationHandler = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({ _id: decoded._id }).select("-password");
      req.user = user;

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("No token, authorization denied");
  }
});

module.exports = { AuthenticationHandler };
