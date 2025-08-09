# Lesson 3: Exercises

## 1. Knowledge Check

1.  What is a "locator" in Playwright?
2.  Why are user-facing locators preferred over CSS or XPath selectors?
3.  What is the recommended locator for finding a button with the text "Submit"?
4.  When might you use a `data-testid` attribute?

## 2. Practical Task

Your task is to refactor a test to use better locators.

1.  Go to the TodoMVC application: `https://demo.playwright.dev/todomvc`
2.  Open your browser's developer tools and inspect the elements on the page.
3.  Take the test you wrote in the previous lesson (`todo.spec.ts`) and modify it to use the best possible locators.
    -   Instead of `page.locator('.new-todo')`, use a more user-facing locator.
    -   Instead of `page.locator('.todo-list li')`, find a better way to locate the list items.
4.  Run your tests to make sure they still pass.
5.  Share your updated `todo.spec.ts` file and explain why you chose the new locators.