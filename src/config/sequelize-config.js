import { Sequelize } from "sequelize";

import { env } from "./env-config.js";

/** Runtime connection. Schema changes belong in Sequelize CLI migrations (`database/migrations/`). See `npm run migration:*`. */
const PHILIPPINE_TIMEZONE = "+08:00";

export const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "mysql",
  timezone: PHILIPPINE_TIMEZONE,
  logging: env.isDevelopment
    ? (sql) => {
        console.log(sql);
      }
    : false,
});
