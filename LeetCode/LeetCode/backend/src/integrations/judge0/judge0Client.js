const axios = require("axios");
const env = require("../../config/env");

const languageMap = {
  python: 71,
  java: 62,
  cpp: 54,
};

const judge0Headers = env.judge0ApiKey
  ? {
      "x-rapidapi-key": env.judge0ApiKey,
      "x-rapidapi-host": env.judge0ApiHost,
    }
  : {};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const executeCode = async ({ language, sourceCode, stdin }) => {
  const languageId = languageMap[language];
  if (!languageId) {
    throw new Error("Unsupported language");
  }

  const createResp = await axios.post(
    `${env.judge0BaseUrl}/submissions?base64_encoded=false&wait=false`,
    {
      language_id: languageId,
      source_code: sourceCode,
      stdin: stdin || "",
      cpu_time_limit: 2,
      memory_limit: 128000,
    },
    { headers: judge0Headers }
  );

  const token = createResp.data.token;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    await wait(500);
    const resultResp = await axios.get(
      `${env.judge0BaseUrl}/submissions/${token}?base64_encoded=false`,
      { headers: judge0Headers }
    );
    const statusId = resultResp.data.status?.id;
    if (![1, 2].includes(statusId)) {
      return { token, ...resultResp.data };
    }
  }

  throw new Error("Code execution timed out");
};

module.exports = { executeCode };
