// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");

// const { Founder } = require("../models/founder-model");
// const { Investor } = require("../models/invester-modal");

// dotenv.config();
// const router = express.Router();

// const getModelByRole = (role) => {
//   return role === "founder" ? Founder : Investor;
// };

// // Register route
// router.post("/register", async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       password,
//       role,
//       profilePictureUrl,
//       startUpName,
//       bio,
//       industriesInterestedIn,
//     } = req.body;

//     if (!fullName || !email || !password || !role) {
//       return res.status(400).send({ message: "Missing required fields" });
//     }

//     const Model = getModelByRole(role);
//     const existing = await Model.findOne({ email });
//     if (existing)
//       return res.status(409).send({ message: "Email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const userData = {
//       fullName,
//       email,
//       password: hashedPassword,
//       profilePictureUrl,
//       role,
//     };

//     if (role === "founder") {
//       userData.startupName = startUpName;
//     } else {
//       userData.bio = bio;
//       userData.industriesInterestedIn = industriesInterestedIn || [];
//     }

//     const user = new Model(userData);
//     await user.save();

//     return res.status(201).send({ message: "Registered successfully" });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .send({ message: "Registration error", error: err.message });
//   }
// });

// // Login route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     if (!email || !password || !role)
//       return res.status(400).send({ message: "Missing credentials" });

//     const Model = getModelByRole(role);
//     const user = await Model.findOne({ email });

//     if (!user)
//       return res
//         .status(404)
//         .send({ message: "User not found. Please register." });

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid)
//       return res.status(401).send({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user._id, fullName: user.fullName, role, email: user.email },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "2h" }
//     );

//     return res.status(200).send({
//       message: "Login successful",
//       token,
//       user: user,
//       role,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ message: "Login error", error: err.message });
//   }
// });

// router.get("/all", async (req, res) => {
//   try {
//     const founders = await Founder.find({}, "_id fullName");
//     const investors = await Investor.find({}, "_id fullName");

//     const users = [
//       ...founders.map((f) => ({
//         id: f._id,
//         fullName: f.fullName,
//         role: "founder",
//       })),
//       ...investors.map((i) => ({
//         id: i._id,
//         fullName: i.fullName,
//         role: "investor",
//       })),
//     ];

//     return res.status(200).json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     return res
//       .status(500)
//       .json({ message: "Failed to fetch users", error: err.message });
//   }
// });

// module.exports = { authRouter: router };
