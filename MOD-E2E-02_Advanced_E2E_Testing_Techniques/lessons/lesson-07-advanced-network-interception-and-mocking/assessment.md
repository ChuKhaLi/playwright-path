# Assessment: Advanced Network Interception and Mocking

## Knowledge Check

### Question 1
Which `Route` method allows you to let a network request proceed to the server, but with modifications?
a) `route.fulfill()`
b) `route.abort()`
c) `route.continue()`
d) `route.fetch()`

**Answer:** c) `route.continue()`

---

### Question 2
What is the purpose of `route.fetch()` inside a `page.route()` callback?
a) To create a new network request from scratch.
b) To fetch the original response from the server, which can then be modified.
c) To fetch a local file to use as a mock response.
d) To abort the request.

**Answer:** b) To fetch the original response from the server, which can then be modified.

---

### Question 3
How would you simulate a "Not Found" error for an API endpoint?
a) `await route.abort()`
b) `await route.fulfill({ status: 404 })`
c) `await route.continue({ status: 404 })`
d) `await route.fulfill({ error: 'Not Found' })`

**Answer:** b) `await route.fulfill({ status: 404 })`

---

### Question 4
What is a common reason to use `route.abort('aborted')` in a test?
a) To test how the application handles server errors.
b) To make the test run slower and more deliberately.
c) To prevent non-essential resources like tracking scripts or large images from loading, speeding up the test.
d) To ensure all network requests succeed.

**Answer:** c) To prevent non-essential resources like tracking scripts or large images from loading, speeding up the test.

---

## Practical Application

### Scenario
You are testing an e-commerce product page. The page fetches product details from `/api/products/{id}`. You need to test two scenarios:
1.  How the page displays a product that is on sale (a property in the API response).
2.  How the page behaves when the product's image fails to load.

### Task
Write a single Playwright test script with two tests to cover these scenarios.

**Test 1: Sale Price Display**
1.  Intercept requests to `/api/products/123`.
2.  Fetch the original response from the server using `route.fetch()`.
3.  Parse the JSON response, add a property `onSale: true`, and set the `salePrice` to `49.99`.
4.  Fulfill the request with the modified response.
5.  Navigate to the product page `/products/123`.
6.  Assert that a "Sale" badge is visible on the page.
7.  Assert that the displayed price is "$49.99".

**Test 2: Image Load Failure**
1.  Navigate to the same product page `/products/123`.
2.  Intercept and `abort()` any request for `.jpg` files.
3.  Assert that the main product image element is not visible.
4.  Assert that a placeholder or fallback element with the text "Image not available" is visible instead.

Provide the complete TypeScript code for this test file.