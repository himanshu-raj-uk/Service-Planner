const NodeSender = require("nodemailer");

const Transporter = NodeSender.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER_NAME,
    pass: process.env.GOOGLE_USER_PASSWORD,
  },
});

module.exports = Transporter;
