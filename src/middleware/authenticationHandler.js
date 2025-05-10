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
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
          if (decoded) {
            req.user = await User.findById(decoded.id).select("-password");
            next();
          } else {
            res.status(401).send({ message: err.message });
          }
        });
      } else {
        res.status(401).send({ message: "Please login first" });
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
});

module.exports = { AuthenticationHandler };
