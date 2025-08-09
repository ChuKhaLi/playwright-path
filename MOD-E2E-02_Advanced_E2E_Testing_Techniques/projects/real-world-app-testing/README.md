# Project: Real-World App Testing

This project is designed to be a comprehensive example of how to apply the advanced E2E testing techniques covered in this module to a real-world application.

## 1. The Application

We will be testing [Conduit](https://demo.realworld.io/), a Medium clone that is a common example application for testing. It includes features like:

- Authentication
- Creating and editing articles
- Commenting
- Tagging

## 2. The Tests

The tests in this project will demonstrate:

- **Authentication:** Using `storageState` to log in once and reuse the session.
- **Network Mocking:** Mocking API requests to test the frontend in isolation.
- **Page Object Model:** Using the Page Object Model to create a scalable and maintainable test suite.
- **Custom Fixtures:** Creating custom fixtures to simplify test setup.

## 3. How to Run the Tests

1.  Install the dependencies: `npm install`
2.  Run the tests: `npx playwright test`