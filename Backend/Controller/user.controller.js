const bcrypt = require("bcrypt");
const User = require("../Model/UserModel");
const TripModel = require("../Model/TripModel");
const BirthdayModel = require("../Model/BirthdayModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Config/MailSender");
const ApiError = require("../Utilities/ApiError");
const cloudinary = require("../Config/Cloudinary");
const Notification = require("../Model/AppNotificationModel");
const PendingUser = require("../Model/PendingUserModel");
const Support = require("../Model/UserSupport");

const {
  forgotPasswordService,
  verifyOTPService,
  resetPasswordService,
  resendOTPService,
  // sendEmail,
  loginEmail,
} = require("../Middleware/AllServices");

const emailTemplate = require("../Template/EmailTemplate");
const loginSuccess = require("../Template/LoginTemplate");
const getDeviceInfo = require("../Utilities/DeviceInfo");
const getLocation = require("../Utilities/getLocation");

const {
  verificationToken,
  AccessToken,
  RefreshToken,
} = require("../Config/Token");

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      throw new ApiError(400, "Email is already registered");
    }

    const existingPhone = await User.findOne({
      phone,
    });

    if (existingPhone) {
      throw new ApiError(400, "Mobile number is already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("REGISTER OTP:", otp);

    const hashOtp = await bcrypt.hash(otp, 10);

    await PendingUser.deleteOne({
      email: normalizedEmail,
    });

    const pendingUser = await PendingUser.create({
      name,
      email: normalizedEmail,
      password: hashPassword,
      phone,
      otp: hashOtp,
      otpExpire: new Date(Date.now() + 5 * 60 * 1000),
    });

    const token = jwt.sign(
      { id: pendingUser._id.toString(), type: "verify-email", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" },
    );

    let emailSent = false;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await sendEmail({
          to: pendingUser.email,
          subject: "Welcome to All Services Planner",
          html: emailTemplate({
            heading: `Hello ${pendingUser.name}`,
            message: `
              <div style="text-align: center;">
                <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.6;">
                  Your registration has been received successfully.
                </p>

                <p style="margin: 0 0 10px; font-size: 15px; font-weight: 600;">
                  Your OTP is:
                </p>

                <div style="margin: 18px 0; text-align: center;">
                  <span style="
                    display: inline-block;
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: 8px;
                    line-height: 1.4;
                  ">
                    ${otp}
                  </span>
                </div>

                <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                  This OTP is valid for <strong>5 minutes</strong>.
                </p>

                <p style="margin: 22px 0 0; font-size: 14px; line-height: 1.6;">
                  Regards,<br>
                  <strong>All Services Planners ❤️</strong>
                </p>
              </div>
            `,
          }),
        });

        emailSent = true;

        console.log(`Registration email sent on attempt ${attempt}`);

        break;
      } catch (emailError) {
        console.error(
          `Registration email attempt ${attempt} failed:`,
          emailError.message,
        );

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    if (!emailSent) {
      return res.status(503).json({
        status: false,
        message:
          "Registration saved, but OTP email could not be sent. Please try Resend OTP.",
        verificationToken: token,
        data: {
          email: pendingUser.email,
        },
      });
    }

    return res.status(201).json({
      status: true,
      message: "OTP sent successfully.",
      verificationToken: token,
      data: {
        email: pendingUser.email,
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
      throw new ApiError(404, "User not found");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Your account has been blocked");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = AccessToken(user);
    const refreshToken = RefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    const deviceInfo = getDeviceInfo(req.headers["user-agent"]);

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const location = getLocation(ip);

    const loginTime = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    try {
      await Notification.create({
        user: user._id,
        title: "Login Successful",
        message: `Your account was logged in from ${deviceInfo} at ${location} on ${loginTime}.`,
        type: "Login",
      });
    } catch (notificationError) {
      console.error("NOTIFICATION CREATION ERROR:", notificationError);
    }

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

const forgotPasswords = async (req, res, next) => {
  try {
    const token = await forgotPasswordService(req.body.email, "user");

    res.status(200).json({
      status: true,
      message: "OTP sent successfully.",
      token,
    });
  } catch (err) {
    next(err);
  }
};

const resetPasswords = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new ApiError(401, "Reset token required");
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    await resetPasswordService(token, req.body.password, "user");

    res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
};

const ResendOtp = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      throw new ApiError(401, "Verification token required");
    }

    await resendOTPService(token, "user");

    res.status(200).json({
      status: true,
      message: "OTP resent successfully.",
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    req.user.refreshToken = null;

    await req.user.save();

    res.status(200).json({
      status: true,
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};

const profile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Please login first.");
    }

    const user = req.user.toObject();

    delete user.password;
    delete user.otp;
    delete user.refreshToken;

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const matched = await bcrypt.compare(currentPassword, user.password);

    if (!matched) {
      return res.status(401).json({
        status: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { name, email, phone, address } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    let parsedAddress = user.address || {};

    if (address) {
      try {
        parsedAddress =
          typeof address === "string" ? JSON.parse(address) : address;
      } catch (error) {
        return next(new ApiError(400, "Invalid address data"));
      }
    }

    user.name = name?.trim() || user.name;
    user.email = email?.trim().toLowerCase() || user.email;
    user.phone = phone?.trim() || user.phone;

    user.address = {
      fullName: parsedAddress.fullName?.trim() || "",
      houseNo: parsedAddress.houseNo?.trim() || "",
      area: parsedAddress.area?.trim() || "",
      city: parsedAddress.city?.trim() || "",
      state: parsedAddress.state?.trim() || "",
      country: parsedAddress.country?.trim() || "India",
      pincode: parsedAddress.pincode?.trim() || "",
    };

    if (req.file) {
      if (user.profileImage?.public_id) {
        try {
          await cloudinary.uploader.destroy(user.profileImage.public_id);
        } catch (error) {
          console.log("OLD IMAGE DELETE ERROR:", error.message);
        }
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "all-services-planner/profiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        stream.end(req.file.buffer);
      });

      user.profileImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password -otp -refreshToken",
    );

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "Authentication required");
    }

    const userId = req.user._id;

    const tripFields =
      "destination startLocation budget people days travelType hotelType transport foodPreference specialRequest status estimatedCost aiPlan rating review isBooked isPaid createdAt updatedAt";

    const birthdayFields =
      "Name Age Area budget people eventType venueType cakeFlavour cakeWeight prank foodPreference specialRequest status estimatedCost aiPlan rating review isBooked isPaid createdAt updatedAt";

    const supportFields =
      "name email category priority subject message status createdAt updatedAt";

    const [
      allTrips,
      confirmedTrips,
      cancelledTrips,
      allBirthdays,
      confirmedBirthdays,
      cancelledBirthdays,
      latestSupportRequest,
    ] = await Promise.all([
      TripModel.find({
        user: userId,
      })
        .select(tripFields)
        .sort({ createdAt: -1 })
        .lean(),

      TripModel.find({
        user: userId,
        isBooked: true,
        status: { $ne: "Cancelled" },
      })
        .select(tripFields)
        .sort({ createdAt: -1 })
        .lean(),

      TripModel.find({
        user: userId,
        status: "Cancelled",
      })
        .select(tripFields)
        .sort({ createdAt: -1 })
        .lean(),

      BirthdayModel.find({
        user: userId,
      })
        .select(birthdayFields)
        .sort({ createdAt: -1 })
        .lean(),

      BirthdayModel.find({
        user: userId,
        isBooked: true,
        status: { $ne: "Cancelled" },
      })
        .select(birthdayFields)
        .sort({ createdAt: -1 })
        .lean(),

      BirthdayModel.find({
        user: userId,
        status: "Cancelled",
      })
        .select(birthdayFields)
        .sort({ createdAt: -1 })
        .lean(),

      Support.findOne({
        user: userId,
      })
        .select(supportFields)
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).json({
      status: true,
      message: "Dashboard data fetched successfully",
      data: {
        allTrips,
        confirmedTrips,
        cancelledTrips,
        allBirthdays,
        confirmedBirthdays,
        cancelledBirthdays,
        latestSupportRequest: latestSupportRequest || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const { tripId } = req.query;

    if (!tripId) {
      throw new ApiError(400, "Trip ID is required.");
    }

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      user: req.user._id,
    }).lean();

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    return res.status(200).json({
      status: true,
      message: "Trip loaded successfully.",
      data: {
        _id: trip._id,
        tripId: trip._id,
        destination: trip.destination || "",
        startLocation: trip.startLocation || "",
        budget: trip.budget ?? 0,
        people: trip.people ?? 1,
        days: trip.days ?? 1,
        travelType: trip.travelType || "",
        hotelType: trip.hotelType || "",
        transport: trip.transport || "",
        foodPreference: trip.foodPreference || "",
        specialRequest: trip.specialRequest || "",
        status: trip.status || "Generated",
        isBooked: trip.isBooked || false,
        tripPlan: trip.aiPlan || {},
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const confirmTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    if (!tripId) {
      throw new ApiError(400, "Trip ID is required.");
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      user: req.user._id,
    });

    if (!trip) {
      throw new ApiError(404, "Trip plan not found.");
    }

    if (trip.status === "Cancelled") {
      throw new ApiError(400, "Cancelled trip plans cannot be confirmed.");
    }

    if (trip.status === "Completed") {
      throw new ApiError(400, "Completed trip plans cannot be confirmed.");
    }

    trip.status = "Booked";
    trip.isBooked = true;

    await trip.save();

    return res.status(200).json({
      status: true,
      message: "Trip plan confirmed successfully.",
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

const cancelTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    if (!tripId) {
      throw new ApiError(400, "Trip ID is required.");
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      user: req.user._id,
    });

    if (!trip) {
      throw new ApiError(404, "Trip plan not found.");
    }

    if (trip.status === "Booked") {
      throw new ApiError(400, "Confirmed trip plans cannot be cancelled.");
    }

    if (trip.status === "Completed") {
      throw new ApiError(400, "Completed trip plans cannot be cancelled.");
    }

    trip.status = "Cancelled";
    trip.isBooked = false;

    await trip.save();

    return res.status(200).json({
      status: true,
      message: "Trip plan cancelled successfully.",
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

const getBirthdayById = async (req, res, next) => {
  try {
    const { birthdayId } = req.query;

    if (!birthdayId) {
      throw new ApiError(400, "Birthday ID is required.");
    }

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const birthday = await BirthdayModel.findOne({
      _id: birthdayId,
      user: req.user._id,
    }).lean();

    if (!birthday) {
      throw new ApiError(404, "Birthday plan not found.");
    }

    return res.status(200).json({
      status: true,
      message: "Birthday plan loaded successfully.",
      data: {
        _id: birthday._id,
        birthdayId: birthday._id,
        Name: birthday.Name || "",
        Age: birthday.Age ?? 1,
        Area: birthday.Area || "",
        budget: birthday.budget ?? 0,
        people: birthday.people ?? 1,
        eventType: birthday.eventType || "",
        venueType: birthday.venueType || "",
        foodPreference: birthday.foodPreference || "",
        specialRequest: birthday.specialRequest || "",
        status: birthday.status || "Created",
        estimatedCost: birthday.estimatedCost ?? 0,
        isBooked: birthday.isBooked || false,
        isPaid: birthday.isPaid || false,
        rating: birthday.rating ?? null,
        review: birthday.review || "",
        birthdayPlan: birthday.aiPlan || {},
        createdAt: birthday.createdAt,
        updatedAt: birthday.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const confirmBirthday = async (req, res, next) => {
  try {
    const { birthdayId } = req.params;

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    if (!birthdayId) {
      throw new ApiError(400, "Birthday ID is required.");
    }

    const birthday = await BirthdayModel.findOne({
      _id: birthdayId,
      user: req.user._id,
    });

    if (!birthday) {
      throw new ApiError(404, "Birthday plan not found.");
    }

    if (birthday.status === "Cancelled") {
      throw new ApiError(400, "Cancelled birthday plans cannot be confirmed.");
    }

    if (birthday.status === "Completed") {
      throw new ApiError(400, "Completed birthday plans cannot be confirmed.");
    }

    birthday.status = "Booked";
    birthday.isBooked = true;

    await birthday.save();

    return res.status(200).json({
      status: true,
      message: "Birthday plan confirmed successfully.",
      data: birthday,
    });
  } catch (error) {
    next(error);
  }
};

const cancelBirthday = async (req, res, next) => {
  try {
    const { birthdayId } = req.params;

    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    if (!birthdayId) {
      throw new ApiError(400, "Birthday ID is required.");
    }

    const birthday = await BirthdayModel.findOne({
      _id: birthdayId,
      user: req.user._id,
    });

    if (!birthday) {
      throw new ApiError(404, "Birthday plan not found.");
    }

    if (birthday.status === "Booked") {
      throw new ApiError(400, "Confirmed birthday plans cannot be cancelled.");
    }

    if (birthday.status === "Completed") {
      throw new ApiError(400, "Completed birthday plans cannot be cancelled.");
    }

    birthday.status = "Cancelled";
    birthday.isBooked = false;

    await birthday.save();

    return res.status(200).json({
      status: true,
      message: "Birthday plan cancelled successfully.",
      data: birthday,
    });
  } catch (error) {
    next(error);
  }
};

const createSupportRequest = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const { name, email, category, priority, subject, message } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !category ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      throw new ApiError(400, "Please fill all required fields.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Please enter a valid email address.");
    }

    if (message.trim().length < 10) {
      throw new ApiError(400, "Please describe your problem in more detail.");
    }

    const supportRequest = await Support.create({
      user: req.user._id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category,
      priority: priority || "Normal",
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      status: true,
      message: "Your support request has been submitted successfully.",
      data: supportRequest,
    });
  } catch (err) {
    next(err);
  }
};

const getMySupportRequests = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const supportRequests = await Support.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Support requests fetched successfully.",
      data: supportRequests,
    });
  } catch (err) {
    next(err);
  }
};

const getSupportRequestById = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const { supportId } = req.params;

    const supportRequest = await Support.findOne({
      _id: supportId,
      user: req.user._id,
    });

    if (!supportRequest) {
      throw new ApiError(404, "Support request not found.");
    }

    res.status(200).json({
      status: true,
      message: "Support request fetched successfully.",
      data: supportRequest,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
  profile,
  updateProfile,
  verifyOTP,
  forgotPasswords,
  resetPasswords,
  ResendOtp,
  getDashboard,
  getTripById,
  confirmTrip,
  cancelTrip,
  getBirthdayById,
  confirmBirthday,
  cancelBirthday,
  createSupportRequest,
  getMySupportRequests,
  getSupportRequestById,
};
