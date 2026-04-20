const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gamified-coding",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  judge0BaseUrl:
    process.env.JUDGE0_BASE_URL || "https://judge0-ce.p.rapidapi.com",
  judge0ApiKey: process.env.JUDGE0_API_KEY || "",
  judge0ApiHost: process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com",
};

module.exports = env;
