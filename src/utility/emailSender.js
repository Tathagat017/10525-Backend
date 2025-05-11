const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendInviteEmail = async (email, inviteCode, householdName) => {
  const mailOptions = {
    from: `"RentMate" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Join ${householdName} on RentMate!`,
    html: `
      <p>You've been invited to join <b>${householdName}</b>.</p>
      <p>Use this invite code: <strong>${inviteCode}</strong></p>
      <a href="${process.env.FRONTEND_URL}/join/${inviteCode}" 
         style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">
         Join Household
      </a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invite sent to ${email}`);
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send invite");
  }
};

module.exports = { sendInviteEmail };
