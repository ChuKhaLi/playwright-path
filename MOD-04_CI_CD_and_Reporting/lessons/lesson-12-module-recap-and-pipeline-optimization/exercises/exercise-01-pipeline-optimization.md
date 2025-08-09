# Exercise 1: Pipeline Optimization

## Objective
In this exercise, you will apply several optimization techniques to a basic CI/CD pipeline to improve its speed and efficiency.

## Instructions

### Step 1: Start with a Basic Pipeline
1.  Create a new GitHub Actions workflow file, e.g., `.github/workflows/optimization-exercise.yml`.
2.  Start with the following basic (and inefficient) pipeline configuration:

    ```yaml
    name: Pipeline Optimization Exercise

    on: [push]

    jobs:
      build-and-test:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout code
            uses: actions/checkout@v3

          - name: Set up Node.js
            uses: actions/setup-node@v3
            with:
              node-version: '18'

          - name: Install dependencies
            run: npm install

          - name: Run unit tests
            run: npm run test:unit # Assume this script exists

          - name: Run integration tests
            run: npm run test:integration # Assume this script exists

          - name: Build application
            run: npm run build
    ```

### Step 2: Implement Caching
1.  Add a step to cache the `node_modules` directory using `actions/cache`.
2.  The cache key should depend on the runner's OS and the `package-lock.json` file.
3.  The `npm install` step should be modified to run only if the cache was not restored.

### Step 3: Parallelize Testing
1.  Instead of one `build-and-test` job, create two separate jobs: `unit-test-job` and `integration-test-job`.
2.  These two jobs should run in parallel.
3.  Each job should perform the checkout, setup, and install steps.
4.  The `unit-test-job` should only run the unit tests.
5.  The `integration-test-job` should only run the integration tests.

### Step 4: Add a Dependent Build Job
1.  Create a new job named `build-job`.
2.  This job should depend on the successful completion of both `unit-test-job` and `integration-test-job`. Use the `needs` keyword for this.
3.  The `build-job` should perform the checkout, setup, install (with cache), and build steps.

## Success Criteria
- Your final workflow has three distinct jobs (`unit-test-job`, `integration-test-job`, `build-job`).
- The test jobs run in parallel.
- The build job only starts after both test jobs succeed.
- The `node_modules` directory is cached to speed up dependency installation.