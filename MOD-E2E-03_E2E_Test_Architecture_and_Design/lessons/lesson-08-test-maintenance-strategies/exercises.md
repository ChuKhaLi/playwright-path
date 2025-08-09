# Exercises: Test Maintenance Strategies

## Exercise 1: Refactor a Brittle Locator

**Objective:** Replace a brittle XPath locator with a more robust, user-facing locator.

**Instructions:**
1. You have the following line of code in a test:
   ```typescript
   await page.locator('//div/div[3]/div/button').click();
   ```
2. The button has the text "Submit".
3. Refactor this line to use a more robust locator.

## Exercise 2: Debug a Failing Test with the Trace Viewer

**Objective:** Use the Playwright trace viewer to debug a failing test.

**Instructions:**
1. You will be given a test that is failing due to a timing issue.
2. Run the test with tracing enabled.
3. Open the trace file.
4. Use the timeline, actions, and DOM snapshots to identify the root cause of the failure.
5. Fix the test by adding an appropriate web-first assertion.

## Exercise 3: Team Discussion: A Failure Triage Process

**Objective:** Establish a clear process for handling test failures.

**Instructions:**
1. As a team, discuss and document a process for triaging test failures.
2. Consider the following questions:
   - Who is responsible for looking at failures first?
   - How do you determine if it's a real bug or a test issue?
   - What is the process for filing a bug ticket?
   - How do you track and prioritize fixing flaky tests?
3. Add this process to your project's `README.md` or team wiki.