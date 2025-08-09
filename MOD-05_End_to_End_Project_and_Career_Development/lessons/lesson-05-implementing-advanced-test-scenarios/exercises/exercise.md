# Exercise: Implement Advanced Testing Scenarios

## 1. Objective

This exercise will challenge you to apply the advanced testing techniques covered in the lesson. You will implement a data-driven test and a test that involves a file upload.

## 2. Instructions

### Part 1: Data-Driven Login Test

1.  **Create Test Data:**
    In your `tests/login.spec.ts` file, create an array of test data for different login scenarios. Include at least three scenarios:
    -   A valid user.
    -   A user with a correct username but an incorrect password.
    -   A non-existent user.

    ```typescript
    const loginScenarios = [
      {
        description: 'Valid credentials',
        username: 'testuser',
        password: 'password123',
        expectedResult: 'My Account',
      },
      {
        description: 'Invalid password',
        username: 'testuser',
        password: 'wrongpassword',
        expectedResult: 'Error: Invalid credentials',
      },
      {
        description: 'Non-existent user',
        username: 'nouser',
        password: 'password',
        expectedResult: 'Error: Invalid credentials',
      },
    ];
    ```

2.  **Create the Data-Driven Test:**
    -   Use a `for...of` loop to iterate over your `loginScenarios` array.
    -   Create a dynamic test name for each scenario, like `test(\`should handle login with \${scenario.description}\`, ...)`.
    -   Inside the test, use the `login` method from your `LoginPage` object with the `username` and `password` from the current scenario.
    -   **Assertion:** Write an assertion that checks for the `expectedResult`. You'll need to add methods to your page objects to get the account page title or an error message.

### Part 2: File Upload Test

1.  **Create a new test file:** Create `tests/profile.spec.ts`.
2.  **Assume the Scenario:** Imagine the "My Account" page has a feature to upload a profile picture.
    -   The upload button has an ID of `#profile-upload-button`.
    -   After a successful upload, an image with the ID `#profile-image` becomes visible.
3.  **Write the test:**
    -   Name the test `"should allow a user to upload a profile picture"`.
    -   For this exercise, you don't need to implement the full login flow. Assume the user is already logged in.
    -   Use the `page.waitForEvent('filechooser')` pattern from the lesson to handle the file upload.
    -   You'll need a placeholder file to upload. Create a simple text file named `placeholder.txt` in the root of your project. Use this file in your `setFiles` method.
    -   **Assertion:** Assert that the profile image (`#profile-image`) is visible after the upload.

## 3. Career Development Reflection

-   **Data-Driven Testing:** How does this approach improve your test suite's coverage and maintainability compared to writing three separate tests? How would you explain the benefit to a non-technical manager?
-   **Authentication:** Although we didn't fully implement the `storageState` in this exercise, think about a large test suite with 100+ tests. What is the potential time-saving impact of using a setup test for authentication?