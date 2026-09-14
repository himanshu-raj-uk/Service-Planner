require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/Mongoose");

const userRoutes = require("./Routes/UserRoute");
const adminRoutes = require("./Routes/AdminRoute");
const authRoutes = require("./Routes/AuthRoute");
const tourplan = require("./Routes/TripRoute");
const birthdayplan = require("./Routes/BirthdayRoute");
const errorMiddleware = require("./Middleware/Error");

const app = express();
app.set("trust proxy", 1);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
  });
});

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/tour", tourplan);
app.use("/birthday", birthdayplan);

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server Started Successfully");
});
