/**
 * Exercise: Advanced Types and Utilities
 *
 * This exercise is designed to help you practice with TypeScript's advanced and utility types.
 * Your goal is to use types like Partial, Readonly, Pick, and Omit to create new, derived types
 * for common test automation scenarios.
 *
 * Follow the instructions in the comments for each section.
 */

// Base interface for a test configuration
interface TestConfig {
  testName: string;
  browser: 'Chrome' | 'Firefox' | 'Safari';
  retries: number;
  headless: boolean;
  timeout: number;
}

// 1. Partial<T>:
//    - Imagine you are creating a function to override parts of a default test configuration.
//    - Create a type alias named 'TestConfigOverride' that allows any property of 'TestConfig'
//      to be optional. Use the 'Partial' utility type.
//    - Create a function named 'applyConfigOverrides' that takes a 'baseConfig' (TestConfig)
//      and an 'overrides' (TestConfigOverride).
//    - The function should return a new configuration object with the overrides applied.

// Define 'TestConfigOverride' and 'applyConfigOverrides' here

// 2. Readonly<T>:
//    - Create a default, immutable configuration object named 'defaultConfig'.
//    - Use the 'Readonly' utility type to ensure that this default configuration cannot be changed.
//    - Try to modify a property on 'defaultConfig' and observe the TypeScript error.

// Define 'defaultConfig' here

// 3. Pick<T, K>:
//    - Imagine you need to create a summary of a test run that only includes the test name and browser.
//    - Create a type alias named 'TestSummary' that only contains the 'testName' and 'browser'
//      properties from 'TestConfig'. Use the 'Pick' utility type.
//    - Create a variable of type 'TestSummary' and initialize it.

// Define 'TestSummary' and a sample variable here

// 4. Omit<T, K>:
//    - Now, imagine you need a configuration for a CI/CD environment where the timeout is
//      globally configured and should not be in the local config.
//    - Create a type alias named 'CiConfig' that includes all properties from 'TestConfig'
//      EXCEPT for 'timeout'. Use the 'Omit' utility type.
//    - Create a variable of type 'CiConfig' and initialize it.

// Define 'CiConfig' and a sample variable here

// 5. Use your created types and functions:
//    - Create a base configuration object.
//    - Create an override object.
//    - Call 'applyConfigOverrides' and log the result.
//    - Log your 'TestSummary' and 'CiConfig' variables.

// Use your types and functions here