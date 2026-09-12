require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const connectDB = require("./Config/Mongoose");

const userRoutes = require("./Routes/UserRoute");
const adminRoutes = require("./routes/AdminRoute");
const authRoutes = require("./Routes/AuthRoute");
const tourplan = require("./Routes/TripRoute");
const birthdayplan = require("./Routes/BirthdayRoute")
const errorMiddleware = require("./middleware/Error");

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/tour", tourplan);
app.use("/birthday",birthdayplan)
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Started Successfully`);
});
