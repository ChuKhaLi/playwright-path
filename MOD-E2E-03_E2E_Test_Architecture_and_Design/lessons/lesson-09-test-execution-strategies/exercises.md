# Exercises: Test Execution Strategies

## Exercise 1: Configure Parallel Workers

**Objective:** Configure the number of parallel workers for your test run.

**Instructions:**
1. Open your `playwright.config.ts` file.
2. Configure your project to run with 4 parallel workers.
3. Run your tests and observe the execution time.
4. Experiment with different numbers of workers to see how it affects the execution time.

## Exercise 2: Implement a Smoke Test Suite

**Objective:** Create a smoke test suite using tags.

**Instructions:**
1. Identify 3-5 of the most critical tests in your suite.
2. Add the `@smoke` tag to these tests.
3. Write the command to run only the smoke tests.
4. Add a new script to your `package.json` called `test:smoke` that runs this command.

## Exercise 3: Set Up Sharding in a CI Environment

**Objective:** Configure your CI pipeline to run your tests in parallel across multiple machines.

**Instructions:**
1. If you have a CI pipeline set up (e.g., GitHub Actions), modify your workflow file.
2. Add a `strategy` matrix to create 4 parallel jobs.
3. In each job, run a different shard of your test suite.
4. If you don't have a CI pipeline, write out the YAML configuration that you would use to achieve this.