/**
 * Solution: Advanced Types and Utilities
 *
 * This file contains the solution to the 'Advanced Types and Utilities' exercise.
 */

// Base interface for a test configuration
interface TestConfig {
  testName: string;
  browser: 'Chrome' | 'Firefox' | 'Safari';
  retries: number;
  headless: boolean;
  timeout: number;
}

// 1. Partial<T>
//    'Partial<TestConfig>' creates a new type where all properties of 'TestConfig' are optional.
//    This is perfect for update/override scenarios.
type TestConfigOverride = Partial<TestConfig>;

function applyConfigOverrides(baseConfig: TestConfig, overrides: TestConfigOverride): TestConfig {
  // The spread operator (...) merges the base config with the overrides.
  // Properties in 'overrides' will overwrite those in 'baseConfig'.
  return { ...baseConfig, ...overrides };
}

// 2. Readonly<T>
//    'Readonly<TestConfig>' creates a type where all properties are read-only.
//    This is useful for creating immutable constants, like a default configuration.
const defaultConfig: Readonly<TestConfig> = {
  testName: 'Default Test',
  browser: 'Chrome',
  retries: 2,
  headless: true,
  timeout: 30000
};

// defaultConfig.timeout = 50000; // This line would cause a TypeScript error.

// 3. Pick<T, K>
//    'Pick<TestConfig, 'testName' | 'browser'>' creates a new type by picking
//    only the specified properties from 'TestConfig'.
type TestSummary = Pick<TestConfig, 'testName' | 'browser'>;

const summary: TestSummary = {
  testName: 'Login Flow Summary',
  browser: 'Firefox'
};

// 4. Omit<T, K>
//    'Omit<TestConfig, 'timeout'>' creates a new type by taking all properties
//    from 'TestConfig' and removing the specified ones.
type CiConfig = Omit<TestConfig, 'timeout'>;

const ciRunConfig: CiConfig = {
  testName: 'CI Smoke Test',
  browser: 'Chrome',
  retries: 0,
  headless: true
};

// 5. Use your created types and functions
const baseConfig: TestConfig = {
  testName: 'User Registration',
  browser: 'Safari',
  retries: 1,
  headless: false,
  timeout: 60000
};

const overrides: TestConfigOverride = {
  browser: 'Chrome',
  timeout: 90000
};

const finalConfig = applyConfigOverrides(baseConfig, overrides);

console.log("--- Default Config (Readonly) ---");
console.log(defaultConfig);

console.log("\n--- Final Config with Overrides ---");
console.log(finalConfig);

console.log("\n--- Test Summary (Picked) ---");
console.log(summary);

console.log("\n--- CI Config (Omitted) ---");
console.log(ciRunConfig);