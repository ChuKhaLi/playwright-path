# Lesson 4: Advanced API Testing with Authentication

## 1. Beyond Simple Authentication

Welcome to a deep dive into enterprise-grade authentication testing. While we've touched on JWT and OAuth basics, real-world applications present more complex scenarios. This lesson covers testing strategies for these advanced cases, including token lifecycle management, multi-tenancy, and Role-Based Access Control (RBAC).

Mastering these patterns is non-negotiable for anyone looking to test complex, secure, and scalable applications professionally.

## 2. Advanced OAuth 2.0 Scenarios

### Testing the Token Refresh Mechanism

Access tokens are short-lived for security reasons. When they expire, a client uses a long-lived **refresh token** to get a new access token without forcing the user to log in again. Our tests must be able to handle this.

**Strategy:**
1.  Create a wrapper around your API request logic.
2.  This wrapper makes the initial request with the current access token.
3.  If it receives a `401 Unauthorized` response, it triggers the refresh token flow.
4.  It requests a new access token using the refresh token.
5.  It stores the new access and refresh tokens.
6.  It retries the original API request with the new access token.

```typescript
// utils/api-client.ts
// A simplified conceptual example
async function makeRequest(url: string, options: any) {
  let accessToken = getStoredAccessToken();
  
  let response = await request.get(url, {
    ...options,
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (response.status() === 401) {
    console.log('Access token expired. Refreshing...');
    const newTokens = await refreshAccessToken();
    saveTokens(newTokens);
    
    // Retry the request with the new token
    response = await request.get(url, {
      ...options,
      headers: { 'Authorization': `Bearer ${newTokens.accessToken}` },
    });
  }
  
  return response;
}
```

### Validating OAuth Scopes

OAuth scopes limit what an application can do on behalf of a user. A token with a `read:profile` scope should not be able to update a profile.

**Test Strategy:**
1.  Obtain tokens with different sets of scopes.
2.  For each token, attempt to access endpoints that are both within and outside its permitted scopes.
3.  Assert that requests within scope succeed (e.g., `200 OK`).
4.  Assert that requests outside the scope are forbidden (e.g., `403 Forbidden`).

```typescript
test('token with "read" scope should not be able to write data', async ({ request }) => {
  const readOnlyToken = await getOAuthToken({ scope: 'read:data' });
  
  const response = await request.post('/api/data', {
    headers: { 'Authorization': `Bearer ${readOnlyToken}` },
    data: { newData: 'important stuff' },
  });
  
  expect(response.status()).toBe(403);
});
```

## 3. Advanced JWT Management

### Validating JWT Structure and Claims

A JWT consists of three parts: Header, Payload, and Signature. The payload contains "claims" (e.g., user ID, roles, expiration time). We should validate these.

-   `iss` (Issuer): Who issued the token.
-   `aud` (Audience): Who the token is for.
-   `exp` (Expiration Time): When the token expires.
-   `iat` (Issued At): When the token was issued.
-   Custom claims: `userId`, `roles`, `tenantId`, etc.

You can use a library like `jose` to decode and verify JWTs.

```typescript
import * as jose from 'jose';

const token = 'your.jwt.token';
const decoded = jose.decodeJwt(token);

expect(decoded.iss).toBe('my-auth-server');
expect(decoded.roles).toContain('admin');
```

## 4. Testing Enterprise Authentication Patterns

### Role-Based Access Control (RBAC)

RBAC ensures users can only access resources appropriate for their role (e.g., `admin`, `editor`, `viewer`).

**Test Strategy:**
-   Create test users for each role.
-   For each user role, write a set of tests that attempt to perform various actions.
-   **Admin User:** Should be able to perform all actions (GET, POST, PUT, DELETE).
-   **Editor User:** Should be able to GET, POST, and PUT, but not DELETE.
-   **Viewer User:** Should only be able to GET data.

This is a perfect use case for data-driven testing.

```typescript
// tests/api/rbac.spec.ts
const testCases = [
  { role: 'viewer', action: 'DELETE', expectedStatus: 403 },
  { role: 'viewer', action: 'GET',    expectedStatus: 200 },
  { role: 'editor', action: 'PUT',    expectedStatus: 200 },
  { role: 'admin',  action: 'DELETE', expectedStatus: 204 },
];

for (const tc of testCases) {
  test(`a ${tc.role} should get ${tc.expectedStatus} for ${tc.action}`, async ({ request }) => {
    const token = await loginAs(tc.role);
    const response = await request[tc.action.toLowerCase()]('/api/resource/123', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    expect(response.status()).toBe(tc.expectedStatus);
  });
}
```

### Multi-Tenant Authentication

In a multi-tenant application, data for different customers (tenants) is isolated. A user from Tenant A should never be able to access data from Tenant B, even if they are an admin in their own tenant.

**Test Strategy:**
1.  Create users in at least two different tenants (e.g., UserA in TenantA, UserB in TenantB).
2.  Log in as UserA.
3.  Attempt to access a resource belonging to TenantA (e.g., `/api/tenantA/invoices/1`). This should succeed.
4.  Attempt to access a resource belonging to TenantB (e.g., `/api/tenantB/invoices/2`). This **must** fail, typically with a `403 Forbidden` or `404 Not Found`.
5.  Repeat the process for UserB.

## 5. Summary

-   **Token Refresh:** Essential for long-running test suites. Build resilient API clients that can handle token expiration.
-   **OAuth Scopes:** Don't just get a token; test the boundaries of what the token is allowed to do.
-   **JWT Claims:** Validate the contents of the token itself, not just its existence.
-   **RBAC Testing:** Systematically verify that each user role has the correct permissions.
-   **Multi-Tenancy:** Crucial for SaaS applications. Always test for data isolation between tenants.

By implementing these advanced authentication testing strategies, you move from simply "testing an API" to ensuring the security and integrity of an enterprise-level application.