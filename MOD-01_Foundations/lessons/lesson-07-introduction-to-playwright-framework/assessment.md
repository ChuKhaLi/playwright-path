# Lesson 7: Assessment

## Instructions

Read each question carefully and select the best answer. These questions are designed to test your understanding of the Playwright framework and its initial setup.

---

### Question 1

What is the primary benefit of Playwright's "auto-wait" feature?

a) It makes tests run slower.
b) It automatically adds random pauses to your test.
c) It makes tests more reliable by automatically waiting for elements to be ready before interacting with them.
d) It requires the tester to manually add `waitForTimeout` commands everywhere.

---

### Question 2

What command do you use to initialize a new Playwright project in your terminal?

a) `npm start playwright`
b) `npx playwright install`
c) `npm init playwright@latest`
d) `npx start-project playwright`

---

### Question 3

In a Playwright test script, what does the `page` object represent?

a) The entire browser window, including all tabs.
b) A single tab or page within a browser.
c) The test report file.
d) A collection of test cases.

---

### Question 4

What is the purpose of the `expect` function in a Playwright test?

a) To navigate to a new web page.
b) To create a new test file.
c) To make an assertion, which checks if a certain condition is true.
d) To import libraries into the test file.

---

### Question 5

After running your tests with `npx playwright test`, what command do you use to view the HTML report?

a) `npx playwright report`
b) `npx playwright open-report`
c) `npx playwright html-report`
d) `npx playwright show-report`

---

## Answer Key

1. **c) It makes tests more reliable by automatically waiting for elements to be ready before interacting with them.**
   - *Explanation: Auto-waiting is a core feature that solves a common cause of flakiness in automated tests.*

2. **c) `npm init playwright@latest`**
   - *Explanation: This command uses npm to download and run the latest Playwright initialization script.*

3. **b) A single tab or page within a browser.**
   - *Explanation: The `page` fixture is the main object you use to interact with the content of a web page.*

4. **c) To make an assertion, which checks if a certain condition is true.**
   - *Explanation: Assertions are the "checks" in your test. The `expect` function is how you perform these checks to validate application behavior.*

5. **d) `npx playwright show-report`**
   - *Explanation: This command opens the last generated HTML report in your default web browser.*