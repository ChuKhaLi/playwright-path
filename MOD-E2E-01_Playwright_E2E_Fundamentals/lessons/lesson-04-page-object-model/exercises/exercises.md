# Lesson 4: Exercises

## 1. Knowledge Check

1.  What is the Page Object Model (POM)?
2.  What are the two main components of a page object class?
3.  What are the benefits of using POM?
4.  How do you pass the `page` object to a page object class?

## 2. Practical Task

Your task is to create a page object for the Google search page.

1.  In your Playwright project, create a new directory called `poms`.
2.  Inside the `poms` directory, create a new file called `google.page.ts`.
3.  Create a `GooglePage` class with:
    -   A `constructor` that takes the `page` object.
    -   A locator for the search input field.
    -   A `goto()` method that navigates to `https://www.google.com`.
    -   A `search()` method that takes a search term as an argument, types it into the search box, and presses "Enter".
4.  Refactor your `tests/google.spec.ts` file to use your new `GooglePage` page object.
5.  Run your tests to make sure they still pass.
6.  Share your `google.page.ts` and updated `google.spec.ts` files.