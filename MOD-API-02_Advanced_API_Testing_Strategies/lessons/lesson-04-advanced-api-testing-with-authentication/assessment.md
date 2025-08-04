# Lesson 4: Assessment

## Knowledge Check

1.  **Question:** What is the primary purpose of a refresh token in OAuth 2.0?
    *   a) To be used as a short-lived access token.
    *   b) To obtain a new access token without requiring the user to re-authenticate.
    *   c) To define the permissions (scopes) of the access token.
    *   d) To log the user out.

2.  **Question:** When testing Role-Based Access Control (RBAC), what is a key principle?
    *   a) All users should be tested with admin privileges to ensure full coverage.
    *   b) Only test the "viewer" role, as it's the most common.
    *   c) Systematically test that each role can perform its allowed actions and is blocked from performing forbidden actions.
    *   d) Focus only on positive scenarios where users access what they are allowed to.

3.  **Question:** In a multi-tenant application, what is the most critical security aspect to test regarding authentication?
    *   a) That users can change their own passwords.
    *   b) That an admin user can access all data from all tenants.
    *   c) That a user from one tenant cannot access data from another tenant under any circumstances.
    *   d) That the login page looks the same for all tenants.

## Practical Exercise

### Objective

Write a data-driven test to verify Role-Based Access Control (RBAC) for a specific API endpoint.

### Scenario

You are testing a project management API. The endpoint `DELETE /api/projects/{projectId}` is highly sensitive and should only be accessible to users with the `admin` role. Users with `editor` or `viewer` roles should be denied access.

You have a helper function `loginAs(role: string): Promise<string>` that returns a valid JWT for a user of the given role (`admin`, `editor`, or `viewer`).

### Requirements

1.  Create a new test file `rbac.spec.ts`.
2.  Create a data-driven test that iterates through the roles: `admin`, `editor`, and `viewer`.
3.  For each role:
    *   Log in as that user to get their token.
    *   Send a `DELETE` request to `/api/projects/123`.
    *   Assert the response status code based on the role:
        *   `admin`: Expect a `204 No Content` (successful deletion).
        *   `editor`: Expect a `403 Forbidden`.
        *   `viewer`: Expect a `403 Forbidden`.

### Solution

```typescript
// tests/api/rbac.spec.ts
import { test, expect } from '@playwright/test';

// Assume this helper function exists and returns a valid token for the role.
async function loginAs(role: 'admin' | 'editor' | 'viewer'): Promise<string> {
  // In a real project, this would make an API call to a test-only endpoint
  // or use pre-generated tokens for test users.
  return `fake-jwt-for-${role}`; 
}

const testCases = [
  { role: 'admin',  expectedStatus: 204 },
  { role: 'editor', expectedStatus: 403 },
  { role: 'viewer', expectedStatus: 403 },
];

test.describe('Project Deletion RBAC', () => {
  for (const tc of testCases) {
    test(`a ${tc.role} user should receive status ${tc.expectedStatus}`, async ({ request }) => {
      const authToken = await loginAs(tc.role as 'admin' | 'editor' | 'viewer');
      
      const response = await request.delete('/api/projects/123', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status()).toBe(tc.expectedStatus);
    });
  }
});