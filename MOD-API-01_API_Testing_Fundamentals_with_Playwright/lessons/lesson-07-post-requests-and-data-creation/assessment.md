# Assessment: POST Requests and Data Creation

This assessment tests your understanding of how to create and validate new resources using `POST` requests.

---

## Question 1: `POST` Request Status Code (Multiple Choice)

What is the most appropriate HTTP status code for a successful resource creation?
A) 200 OK
B) 201 Created
C) 202 Accepted
D) 204 No Content

---

## Question 2: Sending Data (Multiple Choice)

When using `request.post()`, which option is used to send a JSON payload?
A) `params`
B) `body`
C) `data`
D) `json`

---

## Question 3: Server-Generated Values (Short Answer)

When you validate the response of a `POST` request, besides checking for the data you sent, what are two common server-generated properties you should also assert are present?

---

## Question 4: Input Validation (Short Answer)

If you send a `POST` request with missing required fields, what HTTP status code should you typically expect the API to return?

---

## Question 5: Validation Assertion (Code Snippet)

You have just created a new user and have the response body in a variable named `body`. Write an `expect` assertion to verify that the `createdAt` property exists in the response.

---

## Answer Key

### Question 1
**B) 201 Created**. This status code specifically indicates that a new resource has been successfully created as a result of the request.

### Question 2
**C) `data`**. The `data` option is used to send a JSON payload. Playwright will automatically serialize the object and set the correct `Content-Type` header.

### Question 3
1.  A unique **`id`** for the new resource.
2.  A **`createdAt`** timestamp.

### Question 4
You should expect a **`400 Bad Request`** status code.

### Question 5
```typescript
expect(body).toHaveProperty('createdAt');