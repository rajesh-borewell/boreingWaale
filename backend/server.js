require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const billsRouter = require("./routes/bills");
const authRouter = require("./routes/auth");

const app = express();

// Configure CORS to allow both localhost and your future Render frontend URL
const allowedOrigins = [
  "http://localhost:5173", // Default Vite local development port
  // "https://your-demo-frontend-link.onrender.com" // Replace with your Render frontend URL once you have it
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/bills", billsRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
