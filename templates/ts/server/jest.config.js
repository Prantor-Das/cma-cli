/** @type {import("jest").Config} **/
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/__tests__/**", "!src/server.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapping: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
