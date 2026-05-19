/**
 * Minimal env for tests (no real DB required for unit / test-route integration tests).
 */
process.env.NODE_ENV = "test";
process.env.PORT = "3000";
process.env.DB_NAME = "test_db";
process.env.DB_USER = "test_user";
process.env.DB_PASSWORD = "test_password";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "3307";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ??
  "mysql://test_user:test_password@localhost:3307/test_db";
process.env.JWT_SECRET = "test-jwt-secret-min-32-chars-long";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id.apps.googleusercontent.com";
process.env.FRONTEND_ORIGIN = "http://localhost:5173";
