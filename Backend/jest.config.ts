// eslint-disable-next-line no-undef
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".", // Set root to the project directory (or specify path relative to the config file)
  testRegex: "test/.*\\.spec\\.ts$", // Match any .spec.ts file inside the 'test' directory
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.(t|j)s",
    "!**/*.module.(t|j)s", // Exclude module files
    "!main.(t|j)s", // Exclude main entry point
  ],
  coverageDirectory: "../coverage",
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  coveragePathIgnorePatterns: [
    "/node_modules/", // Ignore external modules
    "/test/", // Ignore test files
    "/dist/", // Ignore build output
    "/src/utils/", // Ignore utility files if needed
  ],

  setupFilesAfterEnv: ["./jest.setup.ts"], // Optional: for setting up testing libraries or configs
  verbose: true, // Show detailed test results
};
