import "dotenv/config";

/** Registers all Sequelize models + associations (`shared/models`). */
import "./shared/models/index.js";

import { createApp } from "./app.js";
import { env } from "./config/env-config.js";
import { sequelize } from "./config/sequelize-config.js";

async function start() {
  const app = createApp();

  await sequelize.authenticate();
  console.log("Database connection OK");

  app.listen(env.port, () => {
    console.log(`Listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
