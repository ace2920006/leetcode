const express = require("express");
const User = require("../../models/User");

const router = express.Router();

router.get("/global", async (_req, res, next) => {
  try {
    const leaderboard = await User.find()
      .select("name xp level streak")
      .sort({ xp: -1, level: -1 })
      .limit(20);
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

router.get("/weekly", async (_req, res, next) => {
  try {
    // MVP fallback: weekly mirrors global until snapshot jobs are added.
    const leaderboard = await User.find()
      .select("name xp level streak")
      .sort({ xp: -1, level: -1 })
      .limit(20);
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
