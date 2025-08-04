import { test, expect, Page } from '@playwright/test';

/**
 * Exercise: Testing a Vacation Request Workflow
 *
 * You are testing a "Request Time Off" feature in an HR application.
 * The workflow involves filling out a form, submitting it for approval,
 * and then seeing the pending request on a calendar.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Create a Helper Function:**
 *     - Create an async helper function `requestTimeOff(page, startDate, endDate)`.
 *     - This function should encapsulate the actions of filling the start and
 *       end date fields on the request form and clicking the "Submit Request" button.
 *
 * 2.  **Structure the Test with Steps:**
 *     - Use `test.step()` to divide the main test into three logical parts:
 *       "Navigate and Open Form", "Submit Valid Request", and "Verify Pending Request".
 *
 * 3.  **Implement the Test Logic:**
 *     - **Step 1:** Navigate to the time off page and click the "Request Time Off"
 *       button to open the form.
 *     - **Step 2:** Call your `requestTimeOff` helper function with valid dates
 *       (e.g., '2023-12-20' to '2023-12-25').
 *     - **Step 3:** After submission, assert that a success message "Request submitted"
 *       is visible. Then, find the calendar view on the page and assert that it
 *       contains an entry with the text "Pending: Vacation" for the dates you requested.
 *
 * 4.  **Test a Conditional Path (Optional Bonus):**
 *     - Create a second test.
 *     - In this test, call your `requestTimeOff` helper with an end date that is
 *       *before* the start date.
 *     - Assert that a validation error message "End date cannot be before start date"
 *       appears on the form.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';

// TODO: Step 1 - Create the helper function.
// async function requestTimeOff(page: Page, startDate: string, endDate: string) {
//   ...
// }

test.describe('Vacation Request Workflow', () => {
  test('should allow a user to submit a request and see it pending', async ({ page }) => {
    await page.goto(mockPageURL);

    // TODO: Step 3, Part 1 - Navigate and open the form.
    // await test.step('Navigate and Open Form', async () => {
    //   ...
    // });

    // TODO: Step 3, Part 2 - Submit the request using your helper.
    // await test.step('Submit Valid Request', async () => {
    //   await requestTimeOff(page, '2023-12-20', '2023-12-25');
    // });

    // TODO: Step 3, Part 3 - Verify the result.
    // await test.step('Verify Pending Request', async () => {
    //   await expect(page.locator('#status-message')).toHaveText(...);
    //   await expect(page.locator('#calendar-view')).toContainText(...);
    // });
  });

  // TODO: Step 4 (Optional) - Create the second test for the conditional path.
  // test('should show an error for invalid dates', async ({ page }) => {
  //   ...
  // });
});