const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const moodRoutes = require("./routes/moodRoutes");
const communityRoutes = require("./routes/communityRoutes");
const chatRoutes = require("./routes/chatRoutes");
const expertRoutes = require("./routes/expertRoutes");
const musicRoutes = require("./routes/musicRoutes");

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://youth-mental-wellness-chi.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/music", musicRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Youth Mental Wellness Backend Running Successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});