import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.js"],
    include: [
      "src/**/*.test.js",
      "src/**/*.integration.test.js",
    ],
    clearMocks: true,
  },
});
