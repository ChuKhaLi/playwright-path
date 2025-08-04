# Assessment: Testing Complex User Workflows

## Knowledge Check

### Question 1
What is the primary benefit of using `test.step()` in a long E2E test?
a) It makes the test run faster.
b) It groups test actions into logical, collapsible sections in the test report, improving readability and debugging.
c) It allows you to skip parts of the test.
d) It is required for tests that are longer than 100 lines.

**Answer:** b) It groups test actions into logical, collapsible sections in the test report, improving readability and debugging.

---

### Question 2
What is the main reason to extract repeated sequences of actions into a helper function?
a) To make the test code longer and more explicit.
b) To follow the DRY (Don't Repeat Yourself) principle, making tests more maintainable and readable.
c) To make the test harder to understand for other developers.
d) To ensure the actions run in a different browser context.

**Answer:** b) To follow the DRY (Don't Repeat Yourself) principle, making tests more maintainable and readable.

---

### Question 3
How would you typically pass data from one step of a workflow to another within the same test function?
a) By writing the data to a file and reading it back.
b) By using global variables.
c) By storing the data in a local variable within the test function's scope.
d) By using `page.evaluate()` to store it in `window`.

**Answer:** c) By storing the data in a local variable within the test function's scope.

---

### Question 4
When testing a complex workflow, why is it important to also test conditional paths (e.g., error states)?
a) To increase the number of tests in your suite.
b) Because real users often make mistakes, and the application should handle them gracefully.
c) To ensure the "happy path" is the only one that works.
d) It is not important; only the successful path needs to be tested.

**Answer:** b) Because real users often make mistakes, and the application should handle them gracefully.

---

## Practical Application

### Scenario
You are testing a "Create a new project" workflow in a project management tool. The workflow is as follows:
1.  User navigates to the dashboard and clicks "New Project".
2.  User fills out the project name and description and clicks "Create".
3.  The user is redirected to the new project's page.
4.  On the project page, the user can invite a team member by entering their email and clicking "Invite".

### Task
Write a single Playwright test that covers this entire workflow.
1.  **Structure the test:** Use `test.step()` to break the test into three logical parts: "Create New Project", "Navigate to Project Page", and "Invite Team Member".
2.  **Create Project:**
    -   Navigate to the app.
    -   Click "New Project".
    -   Fill in the project name "My Test Project".
    -   Click "Create".
3.  **Navigate and Verify:**
    -   After creation, the URL should change to `/projects/{id}`. You'll need to get the new project's ID. For this exercise, assume the "Invite" button on the next page contains the project ID in a `data-project-id` attribute.
    -   Assert that the heading of the new page is "My Test Project".
4.  **Invite Member:**
    -   On the project page, fill in the invite form with the email "team@example.com".
    -   Click "Invite".
    -   Assert that a success message "Invitation sent to team@example.com" appears.

Provide the complete TypeScript code for this test.