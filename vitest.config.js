import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/templates/**/__tests__/**",
      "**/templates/**/*.test.*",
      "**/test-*/**",
    ],
    testTimeout: 10000, // 10 seconds should be enough with mocks
    hookTimeout: 10000, // 10 seconds for hooks
  },
});
