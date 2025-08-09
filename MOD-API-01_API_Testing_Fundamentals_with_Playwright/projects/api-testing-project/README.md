# API Testing Project: Reqres API

This project demonstrates the concepts learned in the API Testing Fundamentals with Playwright module. It uses the [Reqres](https://reqres.in/) API, which is a fake API for testing and prototyping.

## Setup

1.  Clone this repository.
2.  Install dependencies: `npm install`
3.  Run the tests: `npx playwright test`

## Tests

The tests are located in the `tests` directory and cover the following scenarios:

*   **GET requests**: Fetching single and multiple users.
*   **POST requests**: Creating a new user.
*   **PUT requests**: Updating a user.
*   **DELETE requests**: Deleting a user.
*   **Authentication**: (Simulated) testing a protected endpoint.
*   **Schema validation**: (Simulated) validating the structure of the API response.
