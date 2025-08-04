# Lesson 5: Parallel Execution and Optimization - Exercises

## Exercise 1: Configure Parallel Execution

1. **Open your `playwright.config.ts` file.**
2. **Set the `fullyParallel` option to `true`.**
3. **Set the `workers` option to a number greater than 1.**
4. **Run your tests and observe the time it takes to complete.**
5. **Experiment with different numbers of workers to see how it affects the execution time.**

## Exercise 2: Implement Test Sharding in a Workflow

1. **Create a new GitHub Actions workflow file.**
2. **Use a matrix strategy to create two jobs for sharding.**
3. **In each job, use the `--shard` flag to specify the shard to run.**
   ```bash
   npx playwright test --shard=1/2
   npx playwright test --shard=2/2
   ```
4. **Run the workflow and verify that the tests are split between the two jobs.**