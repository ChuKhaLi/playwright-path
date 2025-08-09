# Lesson 6: Assessment - Handling Authentication and Sessions

## Knowledge Check

### Question 1

What is the primary disadvantage of performing a UI-based login before every single test?

a) It is more secure.
b) It is slow, repetitive, and makes the test suite brittle.
c) It doesn't work in headless mode.
d) It requires a special license from Playwright.

**Answer:** b

---

### Question 2

Which Playwright method is used to save the browser's authentication state (cookies, local storage) to a file?

a) `page.saveState({ path: 'auth.json' })`
b) `page.context().storageState({ path: 'auth.json' })`
c) `page.session.save({ path: 'auth.json' })`
d) `page.cookies.export({ path: 'auth.json' })`

**Answer:** b

---

### Question 3

In which file should you configure Playwright to run a global setup script and use a saved storage state?

a) `package.json`
b) `tsconfig.json`
c) The test file itself (`*.spec.ts`)
d) `playwright.config.ts`

**Answer:** d

---

### Question 4

What is the purpose of the `globalSetup` option in `playwright.config.ts`?

a) To specify a script that runs once before all test suites.
b) To define global variables for all tests.
c) To set up the global CSS styles for the test application.
d) To install global npm packages required for the tests.

**Answer:** a

---

### Question 5

How do you configure a Playwright project within `playwright.config.ts` to make all its tests start in an authenticated state?

a) By setting `use: { loggedIn: true }`
b) By setting `use: { storageState: 'path/to/auth.json' }`
c) By setting `use: { needsAuth: false }`
d) By adding a `test.beforeEach` login hook in the config file.

**Answer:** b