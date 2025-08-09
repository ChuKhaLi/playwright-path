# Exercise 1: API Integration Test

## Objective

Write an integration test that chains two API calls together, using the result from the first call as input for the second.

## Scenario

We will use the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/). The goal is to:
1.  Fetch a list of all users.
2.  Pick the first user from the list.
3.  Use that user's `id` to fetch all the posts made by that user.
4.  Assert that the posts returned actually belong to the correct user.

## Instructions

1.  **Create a Test Spec File:** Create a file named `integration.spec.ts`.

2.  **Write the Test:**
    -   **Step 1: Fetch Users.** Send a `GET` request to `/users`.
    -   Assert that the request was successful and that the response body is an array.
    -   **Step 2: Get the First User.** Extract the first user object from the response array and get their `id`.
    -   **Step 3: Fetch User's Posts.** Send a new `GET` request to `/posts`, using a query parameter to filter by `userId`. The URL should look like `/posts?userId=<id_from_step_2>`.
    -   Assert that this second request was also successful.
    -   **Step 4: Verify Posts.** Get the response body (an array of posts). Loop through the array and assert that every single post object has a `userId` property equal to the ID of the user you fetched.