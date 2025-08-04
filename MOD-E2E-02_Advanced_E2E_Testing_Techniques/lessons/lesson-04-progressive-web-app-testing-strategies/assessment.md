# Assessment: Progressive Web App (PWA) Testing Strategies

## Knowledge Check

### Question 1
What is the primary role of a service worker in a PWA?
a) To style the web page with CSS.
b) To run background scripts for features like offline caching and push notifications.
c) To define the application's metadata, like its name and icon.
d) To provide a secure HTTPS connection.

**Answer:** b) To run background scripts for features like offline caching and push notifications.

---

### Question 2
How can you simulate an offline network condition in Playwright?
a) By disconnecting your computer from the internet.
b) Using `page.setOffline(true)`.
c) Creating a new browser context with the `offline: true` option.
d) It is not possible to simulate offline conditions.

**Answer:** c) Creating a new browser context with the `offline: true` option.

---

### Question 3
What is the purpose of the Web App Manifest file?
a) It contains the JavaScript logic for the application.
b) It lists all the files that should be cached by the service worker.
c) It's a JSON file that provides metadata about the PWA (name, icons, display mode).
d) It handles user authentication.

**Answer:** c) It's a JSON file that provides metadata about the PWA (name, icons, display mode).

---

### Question 4
Why is it difficult to write a fully automated test for the "Add to Home Screen" prompt?
a) The prompt is controlled by the browser and its appearance is based on specific heuristics that are hard to trigger in a test.
b) Playwright does not have access to the browser's UI elements.
c) The prompt only appears on mobile devices.
d) You need special permissions to interact with the prompt.

**Answer:** a) The prompt is controlled by the browser and its appearance is based on specific heuristics that are hard to trigger in a test.

---

## Practical Application

### Scenario
You are testing a simple PWA blog. The PWA uses a service worker to cache articles for offline reading. It also has a web app manifest.

### Task
Write a Playwright test script that performs the following actions:
1.  **Verify Service Worker:**
    -   Navigates to the blog's home page.
    -   Asserts that a service worker named `sw.js` is successfully registered and active.
2.  **Test Offline Functionality:**
    -   With the browser online, navigate to a specific article page to ensure it gets cached.
    -   Create a new offline browser context.
    -   In the offline context, navigate to that same article page.
    -   Assert that the article's main heading is visible, proving it was loaded from the cache.
3.  **Validate Manifest:**
    -   Fetch the `manifest.json` file.
    -   Assert that the `name` property in the manifest is "My Awesome Blog".
    -   Assert that the `display` property is "fullscreen".

Provide the complete TypeScript code for this test.