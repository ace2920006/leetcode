const { executeCode } = require("../../../integrations/judge0/judge0Client");

const normalizeOutput = (value) => (value || "").trim();

const evaluateAgainstHiddenTests = async ({ problem, language, code }) => {
  let passedAll = true;
  let lastRun = null;

  for (const testCase of problem.hiddenTestCases) {
    const run = await executeCode({
      language,
      sourceCode: code,
      stdin: testCase.input,
    });
    lastRun = run;

    if (normalizeOutput(run.stdout) !== normalizeOutput(testCase.output)) {
      passedAll = false;
      break;
    }
  }

  return {
    passedAll,
    lastRun,
    resultLabel: passedAll ? "accepted" : "wrong_answer",
  };
};

module.exports = { evaluateAgainstHiddenTests };
