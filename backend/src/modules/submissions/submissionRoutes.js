const express = require("express");
const auth = require("../../middleware/auth");
const Problem = require("../../models/Problem");
const Submission = require("../../models/Submission");
const { executeCode } = require("../../integrations/judge0/judge0Client");
const { awardForAcceptedSubmission } = require("../gamification/gamificationService");
const { evaluateAgainstHiddenTests } = require("./services/evaluatorService");

const router = express.Router();

router.post("/run", auth, async (req, res, next) => {
  try {
    const { problemId, language, code, stdin } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const result = await executeCode({ language, sourceCode: code, stdin });
    const submission = await Submission.create({
      userId: req.user.id,
      problemId: problem._id,
      language,
      code,
      mode: "run",
      result: result.status?.description || "run",
      runtime: result.time || "",
      memory: `${result.memory || ""}`,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      judge0Token: result.token,
    });

    return res.json({ submission, output: result.stdout || result.stderr || "" });
  } catch (error) {
    return next(error);
  }
});

router.post("/submit", auth, async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const { passedAll, lastRun, resultLabel } = await evaluateAgainstHiddenTests({
      problem,
      language,
      code,
    });

    const submission = await Submission.create({
      userId: req.user.id,
      problemId: problem._id,
      language,
      code,
      mode: "submit",
      result: resultLabel,
      runtime: lastRun?.time || "",
      memory: `${lastRun?.memory || ""}`,
      stdout: lastRun?.stdout || "",
      stderr: lastRun?.stderr || "",
      judge0Token: lastRun?.token || "",
    });

    let progression = null;
    if (passedAll) {
      progression = await awardForAcceptedSubmission(
        req.user.id,
        problem._id,
        problem.xpReward
      );
    }

    return res.json({
      submission,
      passed: passedAll,
      progression,
      message: passedAll ? "All hidden tests passed" : "Hidden tests failed",
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/mine", auth, async (req, res, next) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("problemId", "title slug");
    return res.json(submissions);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
