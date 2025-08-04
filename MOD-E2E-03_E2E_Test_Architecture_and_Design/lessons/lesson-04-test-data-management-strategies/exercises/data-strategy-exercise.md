# Exercise: Implementing a Data Management Strategy

## Objective

To gain practical experience implementing two different data management strategies: data-driven testing from a JSON file and API-based data seeding.

## Scenario

You are testing a "Create Post" feature on a blogging platform.

-   **Part 1:** You need to test that the title field has certain validation rules (e.g., min length, max length, required field).
-   **Part 2:** You need to test that a logged-in user can successfully create a blog post. For this test to be isolated, the user should be created via an API before the test runs.

## Your Task

### Part 1: Data-Driven Validation Test

1.  **Create a Data File:**
    -   Create a new JSON file: `data/post-validation-data.json`.
    -   Add several data objects to this file to test different validation scenarios for a post title. Each object should have a `title` and an `expectedErrorMessage`.
    -   Include cases for:
        -   An empty title.
        -   A title that is too short.
        -   A title that is too long.
        -   A valid title (where `expectedErrorMessage` would be `null` or an empty string).

2.  **Create the Test Script:**
    -   Create a test file: `tests/e2e/post-creation-validation.spec.ts`.
    -   Import the JSON data file.
    -   Create a `for` loop to iterate over your data set.
    -   For each data object, write a test that:
        -   Navigates to the "create post" page.
        -   Fills the title field with the `title` from your data.
        -   Clicks the "Save" button.
        -   Asserts that the appropriate error message is displayed (or not displayed for the valid case).

### Part 2: API-Seeded Test

1.  **Create a User Fixture:**
    -   Create a new fixture file: `fixtures/user.fixture.ts`.
    -   Assume there is an API endpoint `POST /api/users` to create a user and `DELETE /api/users/:id` to delete one.
    -   Create a fixture named `authenticatedUser`.
    -   In the setup part of the fixture:
        -   Use the `request` object to make a `POST` call to create a new user.
        -   Store the `userId` and `authToken` from the API response.
        -   Use `page.context().addCookies([...])` or `page.context().setExtraHTTPHeaders({...})` to make the browser session authenticated.
        -   `use` an object containing the `userId` and `authToken`.
    -   In the teardown part of the fixture (after `use`), make a `DELETE` call to remove the user that was created.

2.  **Create the Test Script:**
    -   Create a test file: `tests/e2e/post-creation-success.spec.ts`.
    -   Import your custom `test` from the user fixture file.
    -   Write a test that uses the `authenticatedUser` fixture.
    -   The test should:
        -   Navigate to the "create post" page.
        -   Fill in a title and body for the post.
        -   Click "Save".
        -   Assert that the page redirects to the new post's URL and the title is correct.

## Submission

Submit all the new files you created:
-   `data/post-validation-data.json`
-   `tests/e2e/post-creation-validation.spec.ts`
-   `fixtures/user.fixture.ts`
-   `tests/e2e/post-creation-success.spec.ts`