# Lesson 2: Exercises

## 1. Knowledge Check

1.  What is the purpose of the `page` object in a Playwright test?
2.  Why is the `await` keyword important when writing Playwright tests?
3.  What is an "assertion" in the context of testing?
4.  How do you run all the tests in your project?

## 2. Practical Task

Your task is to write a new Playwright test script.

1.  In your Playwright project, create a new file in the `tests` directory called `google.spec.ts`.
2.  Write a test that:
    a.  Navigates to `https://www.google.com`.
    b.  Asserts that the page title is "Google".
3.  Write a second test in the same file that:
    a.  Navigates to `https://www.google.com`.
    b.  Finds the search input field (hint: it has a `name` attribute of `q`).
    c.  Types "Playwright" into the search field.
    d.  Presses the "Enter" key.
    e.  Asserts that the new page's URL contains the word "Playwright".
4.  Run your new test file and make sure both tests pass.
5.  Share your `google.spec.ts` file and a screenshot of the successful test run in your terminal.