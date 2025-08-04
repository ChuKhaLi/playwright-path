# Lesson 15: API Security Testing

## 1. Why API Security Testing is Crucial

APIs are the new frontline of application security. They are a direct gateway to your application's data and logic, making them a prime target for attackers. Functional correctness and performance mean nothing if your API can be easily compromised.

API security testing is the practice of actively trying to find and exploit vulnerabilities in your API to verify its security controls. This is not about just checking for a `401 Unauthorized` status; it's about thinking like an attacker.

A great resource for understanding common vulnerabilities is the **OWASP API Security Top 10**. We will focus on testing for some of the most critical of these vulnerabilities.

## 2. OWASP API #1: Broken Object Level Authorization (BOLA)

This is the most common and severe API vulnerability. It occurs when a user can access data or objects they shouldn't be able to. For example, User A can access User B's data by guessing their ID.

**Test Strategy:**
This is identical to the multi-tenancy testing we covered in Lesson 4, but it deserves re-emphasis because it's so important.
1.  Authenticate as User A (e.g., `userId: 123`).
2.  Make a request to an endpoint that accesses a resource belonging to User A (e.g., `GET /api/orders/order-abc`). This should succeed.
3.  Now, change the ID in the URL to one that belongs to User B (e.g., `GET /api/orders/order-xyz`).
4.  This request **must** be rejected, typically with a `403 Forbidden` or `404 Not Found`. A `200 OK` response is a critical BOLA vulnerability.

```typescript
test('should not allow a user to access another user\'s orders', async ({ request }) => {
  // Login as User A (who owns order 'abc')
  const userAToken = await loginAs('userA');
  
  // Attempt to access an order belonging to User B
  const response = await request.get('/api/orders/order-xyz', {
    headers: { 'Authorization': `Bearer ${userAToken}` }
  });
  
  // Expect access to be denied
  expect(response.status()).toBe(403); 
});
```

## 3. OWASP API #2: Broken Authentication

This covers vulnerabilities in the authentication process itself. We've tested some of this already (e.g., RBAC), but other scenarios include:
-   **Weak Passwords:** Can users set simple passwords like "123456"?
-   **No Brute-Force Protection:** Can you attempt to log in with the wrong password hundreds of times without being locked out?
-   **JWTs with Weak Secrets:** If you know the secret key used to sign JWTs is weak, you could try to forge your own token.

## 4. OWASP API #3: Broken Object Property Level Authorization

This is a more granular version of BOLA. An endpoint might correctly check that you can access an object, but it might not check if you are allowed to view or modify specific *properties* of that object.

**Example:** A user might be allowed to view their own profile (`GET /users/me`), but the response should not include sensitive fields like `isAdmin` or `passwordHash`.

**Test Strategy:**
1.  Authenticate as a non-admin user.
2.  Make a request to `GET /users/me`.
3.  Assert that the response is `200 OK`.
4.  Inspect the JSON response body and assert that sensitive, admin-only fields are **not present**.

```typescript
test('user profile response should not contain sensitive fields for non-admins', async ({ request }) => {
  const userToken = await loginAs('regular-user');
  
  const response = await request.get('/api/users/me', {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  
  const profile = await response.json();
  
  expect(profile).not.toHaveProperty('isAdmin');
  expect(profile).not.toHaveProperty('roles');
});
```

## 5. OWASP API #5: Broken Function Level Authorization

This is about ensuring users can only access API functions appropriate for their role. This is exactly the **RBAC testing** we covered in Lesson 4. For example, an `editor` should not be able to call an endpoint intended only for an `admin`, like `POST /api/admin/delete-user`.

## 6. Injection Flaws

Injection flaws occur when untrusted user input is not properly sanitized and is executed as part of a command or query.
-   **SQL Injection:** Input is used directly in a database query.
-   **Command Injection:** Input is used directly in a system command.

**Test Strategy:**
-   Identify all API endpoints that accept user input (query parameters, request bodies, headers).
-   Send malicious payloads containing characters that have special meaning in SQL or shell commands (e.g., `'`, `;`, `--`, `&&`).
-   **Assertion:** A secure API should either reject the input with a `400 Bad Request` or sanitize it so it's treated as literal text. A `500 Internal Server Error` is a strong indicator of a potential injection vulnerability.

```typescript
test('should reject requests with potential SQL injection payloads', async ({ request }) => {
  // A classic SQL injection probe
  const maliciousInput = "1' OR '1'='1";
  
  const response = await request.get(`/api/products?search=${maliciousInput}`, {
    failOnStatusCode: false,
  });
  
  // The server should identify this as a malicious request and reject it.
  expect(response.status()).toBe(400); 
});
```

## 7. Security Headers

Your API should return proper security headers to protect the client.
-   `Strict-Transport-Security`: Enforces HTTPS.
-   `Content-Security-Policy`: Prevents XSS attacks.
-   `X-Content-Type-Options`: Prevents MIME-sniffing.

You can write a generic test that checks all important endpoints for the presence and correctness of these headers.

## 8. Summary

-   API security testing is a critical, non-negotiable part of quality assurance.
-   Use the **OWASP API Security Top 10** as your guide.
-   **Broken Object Level Authorization (BOLA)** is the most common and critical vulnerability; always test for it.
-   Test for broken authorization at the **object property** and **function levels** as well (RBAC).
-   Actively probe for **injection flaws** by sending malicious input.
-   Automate checks for the presence of important **security headers**.
-   Think like an attacker: don't just test the happy path; actively try to break the system's security controls.