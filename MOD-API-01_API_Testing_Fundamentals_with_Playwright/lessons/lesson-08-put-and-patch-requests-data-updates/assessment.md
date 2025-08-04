# Assessment: PUT and PATCH Requests

This assessment tests your understanding of how to update resources using `PUT` and `PATCH` requests.

---

## Question 1: `PUT` vs. `PATCH` (Multiple Choice)

Which statement accurately describes the difference between `PUT` and `PATCH`?
A) `PUT` is for creating resources, and `PATCH` is for updating them.
B) `PUT` replaces the entire resource, while `PATCH` applies a partial update.
C) `PUT` is for partial updates, while `PATCH` replaces the entire resource.
D) There is no functional difference between them.

---

## Question 2: Status Code (Multiple Choice)

What is the most common HTTP status code for a successful `PUT` or `PATCH` request?
A) 200 OK
B) 201 Created
C) 204 No Content
D) 302 Found

---

## Question 3: Idempotency (Short Answer)

Which of the two update methods, `PUT` or `PATCH`, is expected to be idempotent, and what does that mean?

---

## Question 4: Testing a `PATCH` Request (Short Answer)

When you test a `PATCH` request, you must verify that the fields you sent were updated. What is the *other* critical thing you must verify?

---

## Question 5: Code Snippet (Fill in the Blank)

Fill in the blank with the correct method to perform a partial update.

```typescript
const response = await request.____('/api/users/1', {
  data: { job: 'new job' }
});
```

---

## Answer Key

### Question 1
**B) `PUT` replaces the entire resource, while `PATCH` applies a partial update.**

### Question 2
**A) 200 OK**. This is the standard response for a successful update.

### Question 3
**`PUT`** is expected to be idempotent. It means that making the same request multiple times produces the same result as making it once.

### Question 4
You must verify that the fields you **did not** send were **left unchanged**.

### Question 5
The correct method is **`patch`**.
```typescript
const response = await request.patch('/api/users/1', {
  data: { job: 'new job' }
});