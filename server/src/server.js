const app = require("./app");
const { connectDb } = require("./config/db");
const env = require("./config/env");

async function start() {
  // Sanity Checks
  if (!env.mongoUri) {
    console.error("FATAL: MONGODB_URI is not defined.");
    process.exit(1);
  }
  if (!env.openAiKey) {
    console.error("FATAL: OPENAI_API_KEY is not defined.");
    process.exit(1);
  }

  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();
