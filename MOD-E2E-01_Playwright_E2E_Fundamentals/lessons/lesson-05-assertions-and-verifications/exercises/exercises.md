# Lesson 5: Exercises

## 1. Knowledge Check

1.  What is the role of assertions in automated testing?
2.  What is "auto-waiting" in Playwright, and why is it useful?
3.  Which assertion would you use to check if a button is clickable?
4.  Which assertion would you use to verify the number of items in a list?

## 2. Practical Task

Your task is to add more assertions to your TodoMVC test.

1.  Open your `tests/todo.spec.ts` file.
2.  Add a new test case that:
    a.  Adds two to-do items.
    b.  Asserts that the to-do count at the bottom of the list is "2 items left".
    c.  Marks one item as complete.
    d.  Asserts that the to-do count is now "1 item left".
    e.  Clicks the "Clear completed" button.
    f.  Asserts that the completed item is no longer visible.
3.  Run your tests and make sure they all pass.
4.  Share your updated `todo.spec.ts` file.