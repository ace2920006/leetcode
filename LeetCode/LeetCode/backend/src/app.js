const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./modules/auth/authRoutes");
const problemRoutes = require("./modules/problems/problemRoutes");
const submissionRoutes = require("./modules/submissions/submissionRoutes");
const leaderboardRoutes = require("./modules/leaderboard/leaderboardRoutes");
const userRoutes = require("./modules/users/userRoutes");
const gameRoutes = require("./modules/game/gameRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(
  "/api/submissions",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);

app.use(errorHandler);

module.exports = app;
