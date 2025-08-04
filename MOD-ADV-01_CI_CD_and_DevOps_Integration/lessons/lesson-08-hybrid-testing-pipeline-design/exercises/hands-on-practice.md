# Lesson 8: Hybrid Testing Pipeline Design - Exercises

## Exercise 1: Create a Hybrid Workflow

1. **Create a new GitHub Actions workflow file named `hybrid-workflow.yml`.**
2. **Copy the example hybrid workflow from the lesson into your file.**
3. **Tag your API tests with `@api` and your E2E tests with `@e2e`.**
4. **Run the workflow and verify that both the API and E2E test jobs are executed.**

## Exercise 2: Add a Component Test Job

1. **Add a new job to your hybrid workflow for running component tests.**
2. **Tag your component tests with `@component`.**
3. **Configure the job to run the component tests.**
4. **Make the E2E test job dependent on the component test job.**
5. **Run the workflow and verify that all three test jobs are executed in the correct order.**