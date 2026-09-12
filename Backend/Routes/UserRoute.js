const express = require("express");
const app = express.Router();
const validate = require("../Middleware/Validate");
const { auth } = require("../Middleware/RoleAuth");
const upload = require("../Middleware/upload");
const { Login_Limit, Register_Limiter } = require("../Middleware/Security");

const {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../ValidateJoi/Validate");

const {
  getNotifications,
  getUnreadNotification,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead,
} = require("../Controller/user.notification");

const {
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
} = require("../Controller/user.controller");

app.post("/register", validate(registerSchema), Register_Limiter, register);

app.post("/login", validate(loginSchema), Login_Limit, login);

app.post("/verify-otp", validate(verifyOtpSchema), verifyOTP);

app.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswords);

app.put("/change-password", auth, changePassword);

app.post("/reset-password", validate(resetPasswordSchema), resetPasswords);

app.post("/resend-otp", ResendOtp);

app.post("/logout", auth, logout);

app.get("/profile", auth, profile);

app.get("/dashboard", auth, getDashboard);

app.get("/getTripById", auth, getTripById);

app.patch("/trip/:tripId/confirm", auth, confirmTrip);

app.patch("/trip/:tripId/cancel", auth, cancelTrip);

app.get("/getBirthdayById", auth, getBirthdayById);

app.patch("/birthday/:birthdayId/confirm", auth, confirmBirthday);

app.patch("/birthday/:birthdayId/cancel", auth, cancelBirthday);

app.put("/profile", auth, upload.single("profileImage"), updateProfile);

app.get("/notification", auth, getNotifications);

app.get("/unread-notification", auth, getUnreadNotification);

app.delete("/notification", auth, deleteAllNotifications);

app.delete("/notification/:notificationId", auth, deleteNotification);

app.patch("/notification/read-all", auth, markAllNotificationsAsRead);

app.post("/support/create", auth, createSupportRequest);

app.get("/support/my-requests", auth, getMySupportRequests);

app.get("/support/:supportId", auth, getSupportRequestById);

module.exports = app;
