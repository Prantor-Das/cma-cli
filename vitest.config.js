import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    exclude: [
      "**/node_modules/**",
      "**/templates/**",
      "**/cma-landing/**",
      "**/test-*/**",
      "**/dist/**",
    ],
    testTimeout: 10000, // 10 seconds should be enough with mocks
    hookTimeout: 10000, // 10 seconds for hooks
  },
});
