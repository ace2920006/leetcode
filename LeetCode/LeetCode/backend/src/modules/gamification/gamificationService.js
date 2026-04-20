const Submission = require("../../models/Submission");
const User = require("../../models/User");

const levelFromXp = (xp) => Math.floor(xp / 200) + 1;

const awardForAcceptedSubmission = async (userId, problemId, xpReward) => {
  const alreadySolved = await Submission.exists({
    userId,
    problemId,
    mode: "submit",
    result: "accepted",
  });

  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const sameDay =
    user.lastSolvedDate &&
    user.lastSolvedDate.toDateString() === now.toDateString();
  const continuedStreak =
    user.lastSolvedDate &&
    user.lastSolvedDate.toDateString() === yesterday.toDateString();

  if (!sameDay) {
    user.streak = continuedStreak ? user.streak + 1 : 1;
    user.lastSolvedDate = now;
  }

  if (!alreadySolved) {
    user.xp += xpReward;
    user.level = levelFromXp(user.xp);
  }

  if (user.streak >= 7 && !user.achievements.includes("7_day_streak")) {
    user.achievements.push("7_day_streak");
  }

  if (user.xp >= 50 && !user.achievements.includes("first_xp")) {
    user.achievements.push("first_xp");
  }

  await user.save();

  return {
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    achievements: user.achievements,
    rewarded: !alreadySolved,
  };
};

module.exports = { levelFromXp, awardForAcceptedSubmission };
