const Notification = require("../Model/AppNotificationModel");
const ApiError = require("../Utilities/ApiError");

const getNotifications = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      status: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

const getUnreadNotification = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      status: true,
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Notification.deleteMany({
      user: userId,
    });

    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    ).lean();

    if (!notification) {
      throw new ApiError(404, "Notification not found.");
    }

    return res.status(200).json({
      status: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "User authentication is required.");
    }

    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return res.status(200).json({
      status: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadNotification,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead 
};
