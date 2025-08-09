# Exercises: Environment Management

## Exercise 1: Create Environment-Specific Data Files

**Objective:** Create separate test data files for your local and staging environments.

**Instructions:**
1. Create a `test-data` directory in your project.
2. Inside `test-data`, create two subdirectories: `local` and `staging`.
3. In each subdirectory, create a `users.json` file.
4. The `local/users.json` should contain a user for your local environment.
5. The `staging/users.json` should contain a different user for your staging environment.
6. Write a helper function that reads the correct `users.json` file based on an environment variable (`TEST_ENV`).

## Exercise 2: Use a Fixture to Expose the Environment

**Objective:** Create a fixture that provides the current test environment to your tests.

**Instructions:**
1. Create a fixture called `testEnvironment`.
2. This fixture should read the `TEST_ENV` environment variable.
3. It should return the value of the variable (e.g., 'local', 'staging').
4. Write a test that uses this fixture to log the current environment.

## Exercise 3: Conditional Logic Based on Environment

**Objective:** Write a test that behaves differently based on the environment.

**Instructions:**
1. Using the `testEnvironment` fixture from Exercise 2, write a test for a feature that is only enabled in the 'staging' environment.
2. The test should check the value of `testEnvironment`.
3. If the environment is 'staging', it should test the new feature.
4. If the environment is not 'staging', it should assert that the feature is not visible.