const express = require("express");
const Problem = require("../../models/Problem");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { difficulty = "", search = "" } = req.query;
    const query = {};

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const problems = await Problem.find(query)
      .select("title slug difficulty xpReward topic order")
      .sort({ order: 1, createdAt: 1 });
    res.json(problems);
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.json(problem);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
