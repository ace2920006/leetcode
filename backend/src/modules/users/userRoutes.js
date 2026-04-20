const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

const router = express.Router();

router.get("/profile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
