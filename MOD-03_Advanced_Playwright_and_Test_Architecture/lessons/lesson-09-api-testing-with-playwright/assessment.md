# Lesson 9: Assessment - API Testing with Playwright

## Knowledge Check

### Question 1

Which built-in Playwright fixture is used for making API requests?

a) `api`
b) `http`
c) `request`
d) `fetch`

**Answer:** c

---

### Question 2

How do you check if an API response has a successful status code (e.g., 200 OK)?

a) `expect(response.statusCode).toBe(200)`
b) `expect(response.status()).toBe(200)`
c) `expect(response.ok).toBe(true)`
d) `expect(response.get('status')).toBe(200)`

**Answer:** b

---

### Question 3

When making a `POST` request with a JSON payload, how do you pass the data?

a) `await request.post('/url', { body: myData })`
b) `await request.post('/url', { json: myData })`
c) `await request.post('/url', myData)`
d) `await request.post('/url', { data: myData })`

**Answer:** d

---

### Question 4

What is a major advantage of using Playwright for both UI and API testing?

a) It's the only framework that can do both.
b) It allows you to easily combine API calls and UI interactions within the same test to manage application state efficiently.
c) API tests run faster in Playwright than in any other tool.
d) It automatically generates API documentation from your tests.

**Answer:** b

---

### Question 5

In a combined UI and API test, what is the purpose of using `test.afterEach` to make a `DELETE` request?

a) To verify that the `DELETE` endpoint works.
b) To clean up the data created during the test, ensuring tests are isolated and don't affect each other.
c) To log the user out after the test is complete.
d) To delete the test report after the run.

**Answer:** b