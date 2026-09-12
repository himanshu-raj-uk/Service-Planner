const bcrypt = require("bcrypt");
const User = require("../Model/UserModel");
const Admin = require("../Model/AdminModel");
const ApiError = require("../Utilities/ApiError");
const jwt = require("jsonwebtoken");
const Transporter = require("../Config/MailSender");
const {
  forgotPasswordService,
  verifyOTPService,
  resetPasswordService,
  sendEmail,
  loginEmail,
  resendOTPService,
} = require("../Middleware/AllServices");

const emailTemplate = require("../Template/EmailTemplate");
const loginSuccess = require("../Template/LoginTemplate");
const getDeviceInfo = require("../Utilities/DeviceInfo");
const getLocation = require("../Utilities/getLocation");
const {
  verificationToken,
  RefreshToken,
  AccessToken,
} = require("../Config/token");

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashOtp = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      phone,
      otp: hashOtp,
      otpExpire: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
      role: "admin",
    });

    await Admin.create({
      user: user._id,
      isProfileCompleted: true,
    });

    const token = verificationToken(user, "verify-email");
    await sendEmail({
      to: user.email,
      subject: "Welcome to All Services Planner",
      html: emailTemplate({
        heading: `Hello ${user.name}`,
        message: `
            Your account has been created successfully.
            <br><br>
            Your OTP is:
             <h2 style="letter-spacing:5px;">${otp}</h2>
              This OTP is valid for <b>5 minutes</b>.
               <br><br>
              Regards,<br>
              <b>All Services Planners❤️</b>
                `,
      }),
    });

    res.status(201).json({
      status: true,
      message: "OTP sent successfully. Please verify your email.",
      verificationToken: token,
      data: {
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      throw new ApiError(404, "Admin not found");
    }

    if (user.role !== "admin") {
      throw new ApiError(403, "This account is not an admin");
    }

    const admin = await Admin.findOne({
      user: user._id,
    });

    if (!admin) {
      throw new ApiError(404, "Admin profile not found");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Your account has been blocked");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email first");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(400, "Invalid password");
    }

    const accessToken = AccessToken(user);
    const refreshToken = RefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// const refreshAccessToken = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization");

//     if (!token) {
//       throw new ApiError(401, "Refresh token is required.");
//     }

//     const accessToken = await refreshTokenService(token);

//     res.status(200).json({
//       status: true,
//       message: "Access token refreshed successfully.",
//       accessToken,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const forgotPasswords = async (req, res, next) => {
  try {
    const token = await forgotPasswordService(req.body.email, "admin");
    res.status(200).json({
      status: true,
      message: "OTP sent successfully.",
      token,
    });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new ApiError(401, "Verification token is required.");
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const { otp } = req.body;

    const user = await verifyOTPService(token, String(otp));

    let message;

    if (user.resetVerified) {
      message = "Reset OTP verified successfully.";
    } else {
      message =
        user.role === "admin"
          ? "Admin account verified successfully."
          : "User account verified successfully.";
    }

    res.status(200).json({
      status: true,
      message,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        resetVerified: user.resetVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

const ResendOtp = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      throw new ApiError(401, "Verification token is required.");
    }

    await resendOTPService(token, "admin");

    res.status(200).json({
      status: true,
      message: "New OTP sent successfully.",
    });
  } catch (err) {
    next(err);
  }
};

const resetPasswords = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new ApiError(401, "Reset password token is required.");
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const { password } = req.body;

    await resetPasswordService(token, password, "admin");

    res.status(200).json({
      status: true,
      message: "Password reset successfully.",
    });
  } catch (err) {
    next(err);
  }
};
const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.refreshToken = null;

    await user.save();

    res.status(200).json({
      status: true,
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
  forgotPasswords,
  ResendOtp,
  resetPasswords,
  logout,
};
