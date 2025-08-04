# Lesson 4: Assessment - Browser Context and Session Handling

This assessment will test your understanding of Playwright's Browser Context and session management features.

## Questions

### Question 1:
**What is the relationship between Browser, BrowserContext, and Page in Playwright?**
a) A Page can have multiple BrowserContexts.
b) A Browser has one BrowserContext, which can have multiple Pages.
c) A Browser can have multiple BrowserContexts, and each BrowserContext can have multiple Pages.
d) Browser and BrowserContext are the same thing.

**Answer:**
c) A Browser can have multiple BrowserContexts, and each BrowserContext can have multiple Pages. This hierarchy allows for isolated sessions within a single browser instance.

---

### Question 2:
**What is the primary benefit of using `browser.newContext()` to simulate multiple users?**
a) It runs tests faster than using a single context.
b) It provides complete isolation between the users, including cookies, local storage, and cache.
c) It allows you to use different browser versions for each user.
d) It is the only way to open more than one tab.

**Answer:**
b) It provides complete isolation between the users, including cookies, local storage, and cache, which accurately simulates different users on different devices.

---

### Question 3:
**What is the most efficient way to handle user authentication across an entire test suite?**
a) Create a `login()` helper function and call it at the beginning of every test file.
b) Use a `globalSetup` script to log in once, save the `storageState`, and configure `use: { storageState: '...' }` in `playwright.config.ts`.
c) Store the username and password in environment variables and log in via the UI in every test.
d) Manually add the authentication cookie to the context in a `test.beforeEach()` hook.

**Answer:**
b) Use a `globalSetup` script to log in once, save the `storageState`, and configure `use: { storageState: '...' }` in `playwright.config.ts`. This avoids repetitive and slow UI logins.

---

### Question 4:
**How can you grant a specific permission, like 'clipboard-read', to a browser context?**
a) `await page.grantPermission('clipboard-read');`
b) By setting it in the `launchOptions` of the `playwright.config.ts`.
c) `const context = await browser.newContext({ permissions: ['clipboard-read'] });`
d) Permissions cannot be granted; they must be handled manually via the UI.

**Answer:**
c) `const context = await browser.newContext({ permissions: ['clipboard-read'] });`. Permissions are configured at the context level when a new context is created.