export default {
  transform: {
    "^.+\\.tsx?$": "babel-jest"
  },
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testTimeout: 10000,
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: ".", outputName: "junit.xml" }]
  ]
};
