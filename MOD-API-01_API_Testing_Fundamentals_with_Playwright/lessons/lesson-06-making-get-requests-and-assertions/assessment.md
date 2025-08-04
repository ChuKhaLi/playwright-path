# Assessment: Making GET Requests and Assertions

This assessment tests your ability to make and validate `GET` requests using Playwright.

---

## Question 1: Basic `GET` Request (Multiple Choice)

Which code snippet correctly makes a `GET` request to the `/api/posts/1` endpoint?
A) `await request.get({ url: '/api/posts/1' });`
B) `await request.get('/api/posts/1');`
C) `await request.send('GET', '/api/posts/1');`
D) `await get(request, '/api/posts/1');`

---

## Question 2: Query Parameters (Multiple Choice)

How do you correctly pass query parameters to a `GET` request?
A) `await request.get('/api/posts?userId=1');`
B) `await request.get('/api/posts', { query: { userId: 1 } });`
C) `await request.get('/api/posts', { data: { userId: 1 } });`
D) `await request.get('/api/posts', { params: { userId: 1 } });`

---

## Question 3: Validating a Collection (Short Answer)

You receive a JSON response where the main data is an array. What two `expect` assertions are essential for validating the array itself, before you check its contents?

---

## Question 4: `response.ok()` (Short Answer)

What does the `response.ok()` method check for, and why is it useful?

---

## Question 5: Error Handling (Code Assertion)

You make a request for a resource that doesn't exist. Write the `expect` assertion to verify that the API returns the correct status code.

---

## Answer Key

### Question 1
**B) `await request.get('/api/posts/1');`**. The URL is passed as a direct argument to the `.get()` method.

### Question 2
**D) `await request.get('/api/posts', { params: { userId: 1 } });`**. The `params` option is used to send query parameters.

### Question 3
1.  **Check if it's an array**: `expect(Array.isArray(body.data)).toBe(true);`
2.  **Check its length**: `expect(body.data).toHaveLength(10);`

### Question 4
`response.ok()` checks if the HTTP status code is in the **2xx range** (e.g., 200, 201, 204). It's useful for quickly checking if a request was successful without needing to know the exact success code.

### Question 5
```typescript
expect(response.status()).toBe(404);