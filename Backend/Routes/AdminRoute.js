const express = require("express");
const app = express.Router();
const {
  auth,
  roleAuth,
  adminTokenAuth,
} = require("../Middleware/RoleAuth");

const {
  profile,
  dashboard,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
} = require("../Controller/admin.controller");

app.get("/profile", auth, roleAuth, profile);

app.get("/dashboard", auth, roleAuth, dashboard);

app.get("/users", auth, roleAuth, getAllUsers);

app.get("/users/:id", auth, roleAuth, getUserById);

app.patch("/block/:id", auth, roleAuth, blockUser);

app.patch("/unblock/:id", auth, roleAuth, unblockUser);

app.delete("/users/:id", auth, roleAuth, deleteUser);

module.exports = app;