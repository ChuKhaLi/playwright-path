# Lesson 6: Exercises

## 1. Knowledge Check

1.  What is a "flaky" test?
2.  How does Playwright's auto-waiting help prevent flaky tests?
3.  When should you use an explicit wait?
4.  Why should you avoid using `waitForTimeout`?

## 2. Practical Task

Your task is to write a test that handles a delayed element.

1.  Go to this page: [http://the-internet.herokuapp.com/dynamic_loading/1](http://the-internet.herokuapp.com/dynamic_loading/1)
2.  This page has a "Start" button. When you click it, a "Hello World!" message appears after a few seconds.
3.  Write a Playwright test that:
    a.  Navigates to the page.
    b.  Clicks the "Start" button.
    c.  Waits for the "Hello World!" message to appear.
    d.  Asserts that the message is visible.
4.  Run your test and make sure it passes.
5.  Share your test file.