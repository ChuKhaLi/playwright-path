import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Run all tests in parallel.
  fullyParallel: true,

  // Use 4 workers.
  workers: 4,

  // Shard the tests across 2 machines.
  // This is useful when running tests on a CI provider.
  // shard: { total: 2, current: 1 },
});