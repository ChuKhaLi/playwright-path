# Exercise 1: Mocking an API Response for UI Testing

## Objective

Use `page.route()` to mock an API response and test how a web page displays the mocked data.

## Instructions

1.  **Target Application:** We will use a simple test page that fetches and displays user data: `https://demo.playwright.dev/api-mocking`.

2.  **Create a Test Spec File:** Create a file named `ui-mocking.spec.ts`.

3.  **Write the Test:**
    -   Navigate to the target application page.
    -   Use `page.route()` to intercept network requests to the fruit API (`/api/v1/fruits`).
    -   Inside the route handler, use `route.fulfill()` to provide a custom mock response.
    -   The mock response should be a JSON array containing a list of fruits. Choose your own fruit names! For example:
        ```json
        [
          { "name": "Dragonfruit", "id": 1 },
          { "name": "Lychee", "id": 2 }
        ]
        ```
    -   After setting up the mock, the page will automatically fetch the data.
    -   Assert that the fruit names you provided in your mock response are visible on the page.