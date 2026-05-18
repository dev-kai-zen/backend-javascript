import "dotenv/config";

import { createApp } from "./app.js";
import { registerModuleModels } from "./bootstrap/register-module-models.js";
import { buildV1ModulesRouter } from "./bootstrap/register-module-routes.js";
import { env } from "./config/env-config.js";
import { sequelize } from "./config/sequelize-config.js";

async function start() {
  await registerModuleModels();
  const v1ModulesRouter = await buildV1ModulesRouter();
  const app = createApp(v1ModulesRouter);

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
