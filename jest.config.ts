import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    collectCoverageFrom: ["src/**/*.ts"],
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};

export default config;