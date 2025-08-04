# Assessment: Working with Headers and Cookies

This assessment tests your understanding of how to manipulate and validate HTTP headers and cookies.

---

## Question 1: Sending Headers (Multiple Choice)

Which option is used to send custom headers in a Playwright API request?
A) `params`
B) `data`
C) `headers`
D) `cookies`

---

## Question 2: Reading Headers (Multiple Choice)

You have a response object named `response`. Which method would you use to get an object containing all the response headers?
A) `response.getHeaders()`
B) `response.headers()`
C) `response.headers`
D) `response.headerValues()`

---

## Question 3: Reading Cookies (Short Answer)

What `APIResponse` method automatically parses the `Set-Cookie` headers from a response and returns an array of cookie objects?

---

## Question 4: Sending Cookies (Short Answer)

What is the name of the HTTP header used to send cookies from the client to the server?

---

## Question 5: Code Snippet (Fill in the Blank)

Fill in the blank to correctly assert that a response header for rate limiting exists.

```typescript
const headers = response.headers();
expect(headers).toHaveProperty('____');
```
(Assume the header is named `x-ratelimit-remaining`)

---

## Answer Key

### Question 1
**C) `headers`**. The `headers` option takes an object of key-value pairs.

### Question 2
**B) `response.headers()`**. This method returns an object containing all response headers.

### Question 3
The **`.cookies()`** method.

### Question 4
The **`Cookie`** header.

### Question 5
The correct property is **`'x-ratelimit-remaining'`**.
```typescript
const headers = response.headers();
expect(headers).toHaveProperty('x-ratelimit-remaining');