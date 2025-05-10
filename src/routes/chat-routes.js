// // routes/chat-routes.js
// const express = require("express");
// const { PitchRoom } = require("../models/pitch-room-model");
// const {
//   AuthenticationHandler,
// } = require("../middleware/authenticationHandler");

// const router = express.Router();

// // POST /pitchRoom - Create a chat room
// router.post("/", AuthenticationHandler, async (req, res) => {
//   try {
//     const {
//       roomName,
//       founderId,
//       investorIds,
//       startTime,
//       endTime,
//       pitchPdf,
//       offeredAmount,
//       offeredEquity,
//     } = req.body;

//     if (
//       !roomName ||
//       !founderId ||
//       !investorIds ||
//       !startTime ||
//       !endTime ||
//       !pitchPdf ||
//       !offeredAmount ||
//       !offeredEquity
//     ) {
//       return res.status(400).send({ message: "All fields are required" });
//     }

//     const newPitchRoom = new PitchRoom({
//       roomName,
//       founderId,
//       investorIds,
//       startTime,
//       endTime,
//       pitchPdf,
//       offeredAmount,
//       offeredEquity,
//     });

//     await newPitchRoom.save();

//     res
//       .status(201)
//       .send({ message: "Pitch room created", pitchRoom: newPitchRoom });
//   } catch (err) {
//     console.error("Error creating pitch room:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // GET /pitchRoom/:id - Get chat room details
// router.get("/:id", AuthenticationHandler, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pitchRoom = await PitchRoom.findById(id).populate(
//       "founderId investorIds"
//     );

//     if (!pitchRoom)
//       return res.status(404).send({ message: "Pitch room not found" });

//     res.status(200).send(pitchRoom);
//   } catch (err) {
//     console.error("Error getting pitch room:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// // POST /pitchRoom/:id/chat - Add a message to the chat room
// router.post("/:id/chat", AuthenticationHandler, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { senderId, content } = req.body;

//     if (!senderId || !content) {
//       return res
//         .status(400)
//         .send({ message: "SenderId and content are required" });
//     }

//     const pitchRoom = await PitchRoom.findById(id);

//     if (!pitchRoom)
//       return res.status(404).send({ message: "Pitch room not found" });

//     const newMessage = {
//       senderId,
//       content,
//       timestamp: new Date(),
//     };

//     pitchRoom.chatMessages.push(newMessage);
//     await pitchRoom.save();

//     // Emit socket event
//     req.app.get("io").to(id).emit("newMessage", newMessage);

//     res
//       .status(201)
//       .send({ message: "Message added", chatMessages: pitchRoom.chatMessages });
//   } catch (err) {
//     console.error("Error adding message:", err);
//     res.status(500).send({ message: "Server error", error: err.message });
//   }
// });

// module.exports = { chatRouter: router };
