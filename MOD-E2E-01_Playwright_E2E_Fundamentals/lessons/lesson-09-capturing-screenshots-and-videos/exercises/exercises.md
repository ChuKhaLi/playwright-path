# Lesson 9: Exercises

## 1. Knowledge Check

1.  How can you take a screenshot of a single element?
2.  What is the benefit of setting `screenshot: 'only-on-failure'`?
3.  What is the difference between `video: 'on'` and `video: 'retain-on-failure'`?
4.  What is the Trace Viewer, and why is it so useful?

## 2. Practical Task

Your task is to configure screenshots, videos, and tracing in your project.

1.  Open your `playwright.config.ts` file.
2.  Configure Playwright to:
    a.  Take a screenshot only when a test fails.
    b.  Record a video, but only keep it if the test fails.
    c.  Enable the Trace Viewer, but only keep the trace if the test fails.
3.  Create a new test file called `tests/failure.spec.ts`.
4.  Write a test in this file that is designed to fail (e.g., assert that `true` is `false`).
5.  Run your tests. You should see one test fail.
6.  Open the test report and find the screenshot and video for the failed test.
7.  Open the trace file for the failed test using `npx playwright show-trace`.
8.  Share a screenshot of your Trace Viewer.