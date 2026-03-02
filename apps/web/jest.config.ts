import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./"
});

const config: Config = {
  displayName: "web",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@supportops/contracts$": "<rootDir>/../../shared/contracts/src",
    "^@supportops/ui$": "<rootDir>/../../shared/ui/src",
    "^@supportops/ui-theme$": "<rootDir>/../../shared/ui/theme/src",
    "^@supportops/ui-form$": "<rootDir>/../../shared/ui/form/src",
    "^@supportops/ui-avatar$": "<rootDir>/../../shared/ui/avatar/dist",
    "^@supportops/ui-file-upload$": "<rootDir>/../../shared/ui/file-upload/dist"
  },
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}", "<rootDir>/__tests__/**/*.test.{ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/", "/.next/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/app/**/layout.tsx",
    "!src/app/**/loading.tsx",
    "!src/app/**/error.tsx"
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80
    }
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["@swc/jest", {}]
  }
};

export default createJestConfig(config);
