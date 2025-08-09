# Assessment: Advanced Data Handling and State Management

## Knowledge Check

### Question 1
What is the primary benefit of using API calls to create test data instead of using the UI?
a) It is slower but more realistic.
b) It is faster, more reliable, and less prone to breaking from UI changes.
c) It is the only way to create data in a database.
d) It requires less code.

**Answer:** b) It is faster, more reliable, and less prone to breaking from UI changes.

---

### Question 2
Which Playwright test hooks are commonly used for setting up and tearing down test data for each test?
a) `test.beforeAll` and `test.afterAll`
b) `test.beforeEach` and `test.afterEach`
c) `test.setup` and `test.teardown`
d) `test.start` and `test.end`

**Answer:** b) `test.beforeEach` and `test.afterEach`

---

### Question 3
Which Playwright method allows you to execute JavaScript code in the browser's context to manipulate things like `localStorage`?
a) `page.runScript()`
b) `page.execute()`
c) `page.evaluate()`
d) `page.inject()`

**Answer:** c) `page.evaluate()`

---

### Question 4
Why should you be cautious when directly manipulating `localStorage` in your tests?
a) It can be slow and unreliable.
b) It is not supported by all browsers.
c) It couples your test to the application's internal implementation, which might change.
d) It is not possible to clear `localStorage` after the test.

**Answer:** c) It couples your test to the application's internal implementation, which might change.

---

## Practical Application

### Scenario
You are testing a project management application. To test the "edit task" functionality, you need a specific task to exist in the system. The application uses an API for task management and stores the current user's theme preference ("dark" or "light") in `localStorage`.

### Task
Write a Playwright test script that performs the following actions:
1.  **Data Seeding:** In a `test.beforeEach` hook, use an API call (`POST /api/tasks`) to create a new task with the title "My Test Task". Store the ID of the created task.
2.  **Data Cleanup:** In a `test.afterEach` hook, use an API call (`DELETE /api/tasks/{id}`) to delete the task created in the setup hook.
3.  **State Injection:** Before navigating to the page, use `page.evaluate()` to set a `localStorage` item `theme` to `"dark"`.
4.  **Test Logic:**
    -   Navigate to the edit page for the created task (`/tasks/{id}/edit`).
    -   Assert that the `<body>` element has the class `theme-dark`, confirming the state injection worked.
    -   Assert that the input field for the task title contains "My Test Task".

Provide the complete TypeScript code for this test.