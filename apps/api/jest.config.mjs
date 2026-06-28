/** @type {import('jest').Config} */
export default {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.(spec|test)\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s", "!**/*.test.ts", "!**/*.spec.ts"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};
