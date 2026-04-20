const express = require("express");
const auth = require("../../middleware/auth");
const Problem = require("../../models/Problem");
const GameSession = require("../../models/GameSession");
const Submission = require("../../models/Submission");
const { evaluateAgainstHiddenTests } = require("../submissions/services/evaluatorService");

const router = express.Router();

const computeScore = ({ isSolved, timeSpentSec, attemptCount }) => {
  const base = isSolved ? 1000 : 0;
  const timeBonus = Math.max(0, 600 - timeSpentSec);
  const attemptPenalty = Math.max(0, (attemptCount - 1) * 50);
  return Math.max(0, base + timeBonus - attemptPenalty);
};

router.post("/start", auth, async (req, res, next) => {
  try {
    const { problemId, language = "python", timeLimitSec = 600 } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const session = await GameSession.create({
      userId: req.user.id,
      problemId: problem._id,
      language,
      timeLimitSec,
      startedAt: new Date(),
    });

    return res.status(201).json({
      sessionId: session._id,
      timeLimitSec: session.timeLimitSec,
      startedAt: session.startedAt,
      problemSlug: problem.slug,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/session/:sessionId", auth, async (req, res, next) => {
  try {
    const session = await GameSession.findOne({
      _id: req.params.sessionId,
      userId: req.user.id,
    }).populate("problemId");

    if (!session) {
      return res.status(404).json({ message: "Game session not found" });
    }

    return res.json(session);
  } catch (error) {
    return next(error);
  }
});

router.post("/submit", auth, async (req, res, next) => {
  try {
    const { sessionId, code } = req.body;
    const session = await GameSession.findOne({
      _id: sessionId,
      userId: req.user.id,
    }).populate("problemId");

    if (!session) {
      return res.status(404).json({ message: "Game session not found" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Game already completed" });
    }

    const now = new Date();
    const timeSpentSec = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
    session.timeSpentSec = Math.min(timeSpentSec, session.timeLimitSec);
    session.attemptCount += 1;

    const { passedAll, lastRun, resultLabel } = await evaluateAgainstHiddenTests({
      problem: session.problemId,
      language: session.language,
      code,
    });

    await Submission.create({
      userId: req.user.id,
      problemId: session.problemId._id,
      language: session.language,
      code,
      mode: "submit",
      result: resultLabel,
      runtime: lastRun?.time || "",
      memory: `${lastRun?.memory || ""}`,
      stdout: lastRun?.stdout || "",
      stderr: lastRun?.stderr || "",
      judge0Token: lastRun?.token || "",
    });

    session.isSolved = passedAll;
    const timedOut = session.timeSpentSec >= session.timeLimitSec;

    if (passedAll || timedOut) {
      session.endedAt = now;
      session.status = "completed";
      session.finalScore = computeScore({
        isSolved: session.isSolved,
        timeSpentSec: session.timeSpentSec,
        attemptCount: session.attemptCount,
      });
    }

    await session.save();

    return res.json({
      passed: passedAll,
      timedOut,
      status: session.status,
      attemptCount: session.attemptCount,
      timeSpentSec: session.timeSpentSec,
      finalScore: session.finalScore,
      message: passedAll ? "Accepted" : "Wrong answer",
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/finish", auth, async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await GameSession.findOne({
      _id: sessionId,
      userId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Game session not found" });
    }

    if (session.status === "completed") {
      return res.json(session);
    }

    const now = new Date();
    const timeSpentSec = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
    session.timeSpentSec = Math.min(timeSpentSec, session.timeLimitSec);
    session.endedAt = now;
    session.status = "completed";
    session.finalScore = computeScore({
      isSolved: session.isSolved,
      timeSpentSec: session.timeSpentSec,
      attemptCount: session.attemptCount,
    });

    await session.save();
    return res.json(session);
  } catch (error) {
    return next(error);
  }
});

router.get("/history", auth, async (req, res, next) => {
  try {
    const sessions = await GameSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("problemId", "title slug difficulty");

    return res.json(sessions);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
