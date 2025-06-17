module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/__tests__/**/*.(test|spec).[jt]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(your-esm-package)/)"
  ],
  moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/$1"
  },
  testEnvironment: "jsdom",
}
