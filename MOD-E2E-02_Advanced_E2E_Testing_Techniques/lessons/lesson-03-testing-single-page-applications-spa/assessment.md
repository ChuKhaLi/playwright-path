# Assessment: Testing Single-Page Applications (SPA)

## Knowledge Check

### Question 1
What is the primary characteristic of client-side routing in a SPA?
a) The entire page is reloaded from the server on every navigation.
b) Navigation occurs without a full page reload, and the URL is updated dynamically.
c) It is impossible to use the browser's back and forward buttons.
d) It only works with the React framework.

**Answer:** b) Navigation occurs without a full page reload, and the URL is updated dynamically.

---

### Question 2
What is the best practice for handling asynchronous operations in Playwright, such as waiting for API data to load?
a) Using `page.waitForTimeout()` with a fixed delay.
b) Using web-first assertions like `expect(locator).toBeVisible()`.
c) Clicking the refresh button until the element appears.
d) Adding a `try...catch` block around the interaction.

**Answer:** b) Using web-first assertions like `expect(locator).toBeVisible()`.

---

### Question 3
Which Playwright method is used to intercept and mock network requests?
a) `page.intercept()`
b) `page.mock()`
c) `page.route()`
d) `page.fulfill()`

**Answer:** c) `page.route()`

---

### Question 4
What is a major benefit of mocking API responses when testing a SPA?
a) It makes tests more dependent on the backend services.
b) It slows down the tests by adding network latency.
c) It allows you to test the frontend in isolation with predictable data, making tests faster and more stable.
d) It is the only way to test API calls.

**Answer:** c) It allows you to test the frontend in isolation with predictable data, making tests faster and more stable.

---

## Practical Application

### Scenario
You are testing a simple SPA that displays a list of articles. The articles are fetched from an API endpoint at `**/api/articles`. When a user clicks on an article title, the app navigates to a details page for that article using client-side routing.

### Task
Write a Playwright test script that does the following:
1.  Mocks the response for the `**/api/articles` endpoint to return a specific list of two articles.
2.  Navigates to the main page of the application.
3.  Asserts that both mocked article titles are visible on the page.
4.  Clicks on the title of the first article.
5.  Asserts that the URL has changed to `/articles/1`.
6.  Asserts that the heading on the new "page" matches the title of the first article.

Provide the complete TypeScript code for this test. Assume the mock articles should have `id` and `title` properties.