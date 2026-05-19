export default {
  testEnvironment: "node",
  transform: {},
  setupFiles: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "<rootDir>/src/tests/**/*.test.js",
    "<rootDir>/src/tests/**/*.integration.test.js",
  ],
  clearMocks: true,
};
