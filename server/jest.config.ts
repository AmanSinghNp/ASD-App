import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"], // look for .test.ts inside __tests__
  moduleFileExtensions: ["ts", "js", "json", "node"],
};

export default config;
