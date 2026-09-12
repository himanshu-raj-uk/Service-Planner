const express = require("express");
const app = express.Router();

const validate = require("../Middleware/Validate");
const { auth, roleAuth, adminTokenAuth } = require("../Middleware/RoleAuth");

const { Login_Limit, Register_Limiter } = require("../Middleware/Security");

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} = require("../ValidateJoi/Validate");

const {
  register,
  login,
  logout,
  verifyOTP,
  forgotPasswords,
  resetPasswords,
  ResendOtp,
} = require("../Controller/auth.controller");

const { profile } = require("../Controller/admin.controller");

app.post("/register", validate(registerSchema), Register_Limiter, adminTokenAuth, register);

app.post("/login", validate(loginSchema), Login_Limit, login);

app.post("/verify-otp", validate(verifyOtpSchema), verifyOTP);

app.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswords);

app.post("/reset-password", validate(resetPasswordSchema), resetPasswords);

app.post("/resend-otp", ResendOtp);

app.post("/logout", auth, logout);

app.get("/profile", auth, roleAuth("user", "admin"), profile);

module.exports = app;
