import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        exclude: [
            "**/node_modules/**",
            "**/templates/**/__tests__/**",
            "**/templates/**/*.test.*",
            "**/test-*/**",
        ],
    },
});
