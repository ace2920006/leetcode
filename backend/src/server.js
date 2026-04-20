const app = require("./app");
const connectDb = require("./config/db");
const env = require("./config/env");

const start = async () => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Server startup failed", error);
    process.exit(1);
  }
};

start();
