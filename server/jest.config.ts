import type { Config } from "jest";

const config: Config = {
  // Use the ts-jest ESM preset for ESNext modules
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"], // look for .test.ts inside __tests__
  moduleFileExtensions: ["ts", "js", "json", "node"],
  extensionsToTreatAsEsm: [".ts"],

  // Reporters for Azure Pipelines
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: ".", outputName: "junit.xml" }]
  ],
};

export default config;
