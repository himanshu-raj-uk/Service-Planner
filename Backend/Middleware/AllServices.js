const User = require("../Model/UserModel");
const PendingUser = require("../Model/PendingUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ApiError = require("../Utilities/ApiError");
const emailTemplate = require("../Template/EmailTemplate");
const Transporter = require("../Config/MailSender");
const { verificationToken } = require("../Config/Token");
const sendEmail = require("../Config/MailSender");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// const sendEmail = async ({ to, subject, html }) => {
//   await Transporter.sendMail({
//     from: `"All Services Planner" <${process.env.GOOGLE_USER_NAME}>`,
//     to,
//     subject,
//     html,
//   });
// };

const loginEmail = async ({ to, subject, html }) => {
  await Transporter.sendMail({
    from: `"All Services Planner" <${process.env.GOOGLE_USER_NAME}>`,
    to,
    subject,
    html,
  });
};

const refreshTokenService = async (token) => {
  if (!token) {
    throw new ApiError(401, "Refresh token is required.");
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token has expired.");
    }
    throw new ApiError(401, "Invalid refresh token.");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  if (!user.refreshToken) {
    throw new ApiError(401, "Please login again.");
  }
  if (user.refreshToken !== token) {
    throw new ApiError(401, "Invalid refresh token.");
  }
  const accessToken = AccessToken(user);
  return accessToken;
};

const forgotPasswordService = async (email, role) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
    role,
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.isVerified) {
    throw new ApiError(
      403,
      "Please verify your email before resetting your password.",
    );
  }

  const otp = generateOTP();

  const hashedOTP = await bcrypt.hash(otp, 10);

  user.otp = hashedOTP;
  user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  const token = verificationToken(user, "reset-password");

  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP - All Services Planner",
    html: emailTemplate({
      heading: `Hello ${user.name}`,
      message: `
        We received a request to reset your password.
        <br><br>
        Your Password Reset OTP is:
        <h2 style="letter-spacing:5px;">${otp}</h2>
        This OTP is valid for <b>5 minutes</b>.
        <br><br>
        If you didn't request this password reset, you can safely ignore this email.
        <br><br>
        Regards,<br>
        <b>All Services Planner Team ❤️</b>
      `,
    }),
  });
  return token;
};

const verifyOTPService = async (token, otp) => {
  if (!token) {
    throw new ApiError(401, "Verification token is required.");
  }

  if (!otp) {
    throw new ApiError(400, "OTP is required.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "verify-email" && decoded.type !== "reset-password") {
      throw new ApiError(401, "Invalid verification token.");
    }

    if (decoded.type === "verify-email") {
      const pendingUser = await PendingUser.findById(decoded.id);

      if (!pendingUser) {
        throw new ApiError(404, "Registration session not found.");
      }

      if (!pendingUser.otp) {
        throw new ApiError(400, "OTP has already been used.");
      }

      if (
        !pendingUser.otpExpire ||
        pendingUser.otpExpire.getTime() < Date.now()
      ) {
        throw new ApiError(400, "OTP has expired.");
      }

      const enteredOtp = String(otp).trim();

      const matched = await bcrypt.compare(enteredOtp, pendingUser.otp);

      if (!matched) {
        throw new ApiError(400, "Invalid OTP.");
      }

      const existingEmail = await User.findOne({
        email: pendingUser.email,
      });

      if (existingEmail) {
        throw new ApiError(400, "Email is already registered.");
      }

      const existingPhone = await User.findOne({
        phone: pendingUser.phone,
      });

      if (existingPhone) {
        throw new ApiError(400, "Mobile number is already registered.");
      }

      const user = await User.create({
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
        phone: pendingUser.phone,
        isVerified: true,
        role: "user",
      });

      await PendingUser.deleteOne({
        _id: pendingUser._id,
      });

      return await User.findById(user._id).select(
        "-password -otp -refreshToken",
      );
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.role !== decoded.role) {
      throw new ApiError(403, "Invalid user role.");
    }

    if (!user.otp) {
      throw new ApiError(400, "OTP has already been used.");
    }

    if (!user.otpExpire || user.otpExpire.getTime() < Date.now()) {
      throw new ApiError(400, "OTP has expired.");
    }

    const enteredOtp = String(otp).trim();

    const matched = await bcrypt.compare(enteredOtp, user.otp);

    if (!matched) {
      throw new ApiError(400, "Invalid OTP.");
    }

    user.resetVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return await User.findById(user._id).select("-password -otp -refreshToken");
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Verification token expired.");
    }

    if (err.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid verification token.");
    }

    throw err;
  }
};

const resendOTPService = async (token) => {
  if (!token) {
    throw new ApiError(401, "Verification token is required.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "verify-email") {
      throw new ApiError(401, "Invalid verification token.");
    }

    const pendingUser = await PendingUser.findById(decoded.id);

    if (!pendingUser) {
      throw new ApiError(
        404,
        "Registration session not found. Please register again.",
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashOtp = await bcrypt.hash(otp, 10);

    pendingUser.otp = hashOtp;
    pendingUser.otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    await pendingUser.save();

    await sendEmail({
      to: pendingUser.email,
      subject: "Your New OTP - All Services Planner",
      html: emailTemplate({
        heading: `Hello ${pendingUser.name}`,
        message: `
          <div style="text-align: center;">
            <p style="margin: 0 0 12px; font-size: 15px;">
              Your new OTP is:
            </p>

            <div style="margin: 18px 0;">
              <span style="
                font-size: 28px;
                font-weight: 700;
                letter-spacing: 8px;
              ">
                ${otp}
              </span>
            </div>

            <p style="margin: 0; font-size: 14px;">
              This OTP is valid for <strong>5 minutes</strong>.
            </p>
          </div>
        `,
      }),
    });

    return true;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Verification token expired.");
    }

    if (err.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid verification token.");
    }

    throw err;
  }
};

const resetPasswordService = async (token, password) => {
  if (!token) {
    throw new ApiError(401, "Reset password token is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Reset password token has expired.");
    }

    throw new ApiError(401, "Invalid reset password token.");
  }

  if (decoded.type !== "reset-password") {
    throw new ApiError(400, "Invalid reset password token.");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.resetVerified) {
    throw new ApiError(400, "Please verify OTP first.");
  }

  if (!user.password) {
    throw new ApiError(500, "User password is missing from database.");
  }

  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password.",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;

  user.otp = null;
  user.otpExpire = null;
  user.resetVerified = false;
  user.refreshToken = "";

  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      html: emailTemplate({
        heading: `Hello ${user.name}`,
        message: `
          Your password has been changed successfully.
          <br><br>
          If you did not perform this action, please contact All Services Planner Support immediately.
          <br><br>
          Regards,<br>
          <b>All Services Planner Team ❤️</b>
        `,
      }),
    });
  } catch (emailError) {
    console.log("Password change email failed:", emailError.message);
  }

  return true;
};

const createNotification = async ({ user, title, message, type }) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      type,
    });
  } catch (err) {
    console.error("Notification Error:", err.message);
  }
};

module.exports = {
  forgotPasswordService,
  verifyOTPService,
  resendOTPService,
  resetPasswordService,
  sendEmail,
  loginEmail,
  refreshTokenService,
  createNotification,
};
