/** @type {import('jest').Config} */
module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: ".", outputName: "junit.xml" }],
  ],
};
