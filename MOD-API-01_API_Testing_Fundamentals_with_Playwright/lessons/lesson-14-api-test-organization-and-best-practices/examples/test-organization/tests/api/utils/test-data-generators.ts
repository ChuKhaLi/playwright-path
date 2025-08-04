/**
 * @fileoverview This file contains helper functions for generating dynamic test data.
 * Using dynamic data helps ensure that tests are independent and can be run in parallel.
 */

/**
 * Generates a user data object with a unique name.
 * @param overrides - An object to override default generated values.
 * @returns A user data object.
 */
export function generateUserData(overrides: Partial<{ name: string; job: string }> = {}) {
  return {
    name: `Test User ${Date.now()}`,
    job: 'QA Engineer',
    ...overrides,
  };
}