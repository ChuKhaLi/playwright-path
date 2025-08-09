# Exercise 1: Testing a GraphQL Query and Mutation

## Objective

Write two tests for a public GraphQL API: one to test a query and another to test a mutation.

## Instructions

1.  **Target API:** We will use the [GraphQL Zero API](https://graphqlzero.almansi.me/), which is a fake online GraphQL API for testing. The endpoint is `https://graphqlzero.almansi.me/api`.

2.  **Create a Test Spec File:** Create a file named `graphql-posts.spec.ts`.

3.  **Test 1: Query for a Post**
    -   Write a test to fetch a single post.
    -   The GraphQL query should look like this:
        ```graphql
        query ($id: ID!) {
          post(id: $id) {
            id
            title
            body
          }
        }
        ```
    -   Send a `POST` request to the API endpoint. The request `data` should be a JSON object containing the `query` and `variables` (e.g., `{ "id": 1 }`).
    -   Assert that the response is `ok()`.
    -   Assert that the response body contains the `data.post` object with the correct `id`, `title`, and `body`.

4.  **Test 2: Create a Post with a Mutation**
    -   Write a test to create a new post.
    -   The GraphQL mutation should look like this:
        ```graphql
        mutation ($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            title
            body
          }
        }
        ```
    -   The `variables` object should contain an `input` object with `title` and `body` fields.
    -   Send the `POST` request.
    -   Assert that the response is `ok()`.
    -   Assert that the response body contains the `data.createPost` object with the `title` and `body` you provided, and a newly generated `id`.