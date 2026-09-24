const NodeSender = require("nodemailer");

const Transporter = NodeSender.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_USER_NAME,
    pass: process.env.GOOGLE_USER_PASSWORD,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("SMTP VERIFY START");

    await Transporter.verify();

    console.log("SMTP CONNECTION VERIFIED");

    const info = await Transporter.sendMail({
      from: `"All Services Planner" <${process.env.GOOGLE_USER_NAME}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;
