/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/__tests__/**", "!src/server.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  transform: {},
};
