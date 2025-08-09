# Lesson 10: Exercises

## 1. Knowledge Check

1.  What is the first thing you should do when a test fails?
2.  How do you run a test in debug mode?
3.  What does `await page.pause()` do?
4.  Name two common reasons why a test might fail.

## 2. Practical Task

Your task is to practice your debugging skills.

1.  Take the failing test you created in the previous lesson (`tests/failure.spec.ts`).
2.  Run the test in debug mode.
3.  Step through the test using the Playwright Inspector and observe the state of the page.
4.  Add a `page.pause()` before the failing assertion and run the test again.
5.  Use the Inspector to explore the page and figure out why the test is failing (even though you already know!).
6.  Fix the test so that it passes.
7.  Share a screenshot of you using the Playwright Inspector.