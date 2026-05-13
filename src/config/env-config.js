/**
 * Single place to read and validate environment variables.
 * Import `env` from here instead of scattering `process.env` across the app.
 */
function required(name) {
  const v = process.env[name]?.trim();
  if (!v) {
    throw new Error(
      `${name} is not set. Add it to your .env (see env.example).`,
    );
  }
  return v;
}

function optional(name, fallback) {
  const v = process.env[name]?.trim();
  return v && v !== "" ? v : fallback;
}

const nodeEnv = optional("NODE_ENV", "development");

const databaseUrl = `mysql://${required("DB_USER")}:${required("DB_PASSWORD")}@${required("DB_HOST")}:${required("DB_PORT")}/${required("DB_NAME")}`;

export const env = {
  nodeEnv,
  isDevelopment: nodeEnv === "development",
  port: Number(process.env.PORT) || 3000,
  dbName: required("DB_NAME"),
  dbUser: required("DB_USER"),
  dbPassword: required("DB_PASSWORD"),
  dbHost: required("DB_HOST"),
  dbPort: required("DB_PORT"),
  databaseUrl,
  jwtSecret: required("JWT_SECRET"),
  googleClientId: required("GOOGLE_CLIENT_ID"),
  frontendOrigin: optional("FRONTEND_ORIGIN", "http://localhost:5173"),
};
