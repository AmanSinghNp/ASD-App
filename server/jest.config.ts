/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: "ts-jest/presets/default-esm", // still support ESNext in your tests
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],

  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],

  reporters: [
    "default",
    ["jest-junit", { outputDirectory: ".", outputName: "junit.xml" }]
  ],

  globals: {
    "ts-jest": {
      useESM: true
    }
  }
};

module.exports = config;
