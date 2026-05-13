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

export const env = {
  nodeEnv,
  isDevelopment: nodeEnv === "development",
  port: Number(process.env.PORT) || 3000,
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  googleClientId: required("GOOGLE_CLIENT_ID"),
  frontendOrigin: optional("FRONTEND_ORIGIN", "http://localhost:5173"),
};
