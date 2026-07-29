require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const billsRouter = require("./routes/bills");
const estimatesRouter = require("./routes/estimates");
const authRouter = require("./routes/auth");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-jf3f.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

// Health Check Endpoint for Render
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/bills", billsRouter);
app.use("/api/estimates", estimatesRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Start server immediately so Render health checks pass
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

if (!MONGO_URI) {
  console.error("WARNING: MONGO_URI is not defined in environment variables!");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err.message));
}
