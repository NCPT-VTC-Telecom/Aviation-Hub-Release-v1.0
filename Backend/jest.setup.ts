// jest.setup.ts

import "jest-extended"; // Import Jest extended matchers
import { jest } from "@jest/globals";

// Mock global objects if necessary
global.console = {
  ...global.console, // Retain existing console methods
  log: jest.fn(), // Mock console.log
  error: jest.fn(), // Mock console.error
  warn: jest.fn(), // Mock console.warn
  info: jest.fn(), // Mock console.info
};
  
// Example: Set up a global Jest configuration or library
jest.setTimeout(30000); // Increase default timeout if needed (in milliseconds)

// You can also add setup code for database mocks, global variables, etc.
// Example:
// import { initializeTestDB } from './src/utils/testDB';
// beforeAll(() => {
//   initializeTestDB(); // Initialize the test database
// });
