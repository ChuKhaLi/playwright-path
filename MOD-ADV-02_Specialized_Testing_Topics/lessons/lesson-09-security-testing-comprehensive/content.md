# Lesson 9: Comprehensive Security Testing

## 1. Common Web Security Vulnerabilities

It's important to be aware of the most common threats to web applications. The [OWASP Top 10](https://owasp.org/www-project-top-ten/) is a standard awareness document for developers and web application security. Here are a few key vulnerabilities:

-   **Broken Access Control:** This occurs when users can act outside of their intended permissions. For example, a regular user being able to access an admin dashboard.
-   **Cryptographic Failures:** Sensitive data, like passwords or credit card numbers, is not properly protected (e.g., stored in plain text).
-   **Injection:** This happens when untrusted data is sent to an interpreter as part of a command or query. The most famous example is SQL Injection.
-   **Cross-Site Scripting (XSS):** Flaws that allow attackers to inject malicious scripts into a website, which then run in the browsers of other users.

## 2. The Role of Playwright in Security Testing

Playwright is not a replacement for specialized security tools like OWASP ZAP or Burp Suite. However, it is an excellent tool for automating **"black-box" security checks** from the perspective of a user.

We can write tests that *try* to perform unauthorized actions and assert that the application correctly denies them.

## 3. Testing Authentication and Authorization

Authentication (who you are) and authorization (what you are allowed to do) are cornerstones of application security.

### Testing for Broken Access Control

A common scenario is to test if a regular user can access a page or resource that should only be available to an admin.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Access Control Tests', () => {
  // This test logs in as a regular user
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'user');
    await page.fill('#password', 'password');
    await page.click('#login-button');
  });

  test('a regular user should not be able to access the admin dashboard', async ({ page }) => {
    // Attempt to navigate directly to the admin URL
    await page.goto('/admin/dashboard');

    // Assert that the user is redirected to a login or "access denied" page
    await expect(page).not.toHaveURL('/admin/dashboard');
    await expect(page.locator('body')).toContainText('Access Denied');
  });

  test('a regular user should not be able to access admin data via API', async ({ page }) => {
    // Attempt to fetch data from a protected admin API endpoint
    const response = await page.request.get('/api/admin/users');

    // Assert that the API returns an unauthorized or forbidden status code
    expect(response.status()).toBeOneOf([401, 403]);
  });
});
```

## 4. Checking for Insecure Data Exposure

Your application should never send sensitive user data to the frontend unless it is absolutely necessary. We can write tests to check the content of API responses for sensitive information.

### Example: Checking an API Response

```typescript
import { test, expect } from '@playwright/test';

test('the user profile API should not expose sensitive data', async ({ page }) => {
  await page.goto('/login');
  // ... login as a user

  // Listen for the API response when visiting the profile page
  const responsePromise = page.waitForResponse('**/api/users/me');
  await page.goto('/profile');
  const response = await responsePromise;
  const responseJson = await response.json();

  // Assert that sensitive fields like password hashes or security questions are NOT present
  expect(responseJson).not.toHaveProperty('passwordHash');
  expect(responseJson).not.toHaveProperty('securityAnswer');

  // Assert that expected, non-sensitive fields ARE present
  expect(responseJson).toHaveProperty('username');
});
```

## 5. A Note on Penetration Testing

The techniques shown here are for automating known checks. They are part of a good "defense-in-depth" strategy but do not replace the need for professional penetration testing.

Penetration testers (or "ethical hackers") use a wide variety of tools and creative techniques to find unknown vulnerabilities in your system. Playwright's role is to ensure that the known, common vulnerabilities are consistently checked for with every code change.