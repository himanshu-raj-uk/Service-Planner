const User = require("../Model/UserModel");
const Admin = require("../Model/AdminModel");
const ApiError = require("../Utilities/ApiError");

const profile = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      user: req.user._id,
    }).populate({
      path: "user",
      select: "-password -otp -refreshToken",
    });

    if (!admin) {
      throw new ApiError(404, "Admin profile not found");
    }

    res.status(200).json({
      status: true,
      message: "Profile fetched successfully",
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const users = await User.countDocuments({ role: "user" });
    const admins = await User.countDocuments({ role: "admin" });
    const blockedUsers = await User.countDocuments({
      role: "user",
      isBlocked: true,
    });
    const plans = await Plan.countDocuments();
    const hotels = await Hotel.countDocuments();
    const payments = await Payment.countDocuments();
    const reviews = await Review.countDocuments();

    res.status(200).json({
      status: true,
      message: "Dashboard fetched successfully.",
      data: {
        users,
        admins,
        blockedUsers,
        plans,
        hotels,
        payments,
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    res.status(200).json({
      status: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role === "admin") {
      throw new ApiError(403, "Admin cannot be blocked");
    }

    if (user.isBlocked) {
      throw new ApiError(400, "User is already blocked");
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({
      status: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isBlocked) {
      throw new ApiError(400, "User is already unblocked");
    }

    user.isBlocked = false;

    await user.save();

    res.status(200).json({
      status: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  profile,
  dashboard,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser
};
