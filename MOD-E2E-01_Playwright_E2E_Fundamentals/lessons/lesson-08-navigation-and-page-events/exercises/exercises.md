# Lesson 8: Exercises

## 1. Knowledge Check

1.  How do you handle a new page that opens in a new tab?
2.  Why is it important to start waiting for a `popup` event *before* the action that triggers it?
3.  How can you go back to the previous page in the browser's history?
4.  Name two page events you can listen for.

## 2. Practical Task

Your task is to write a test that handles a new tab.

1.  Go to this page: [http://the-internet.herokuapp.com/windows](http://the-internet.herokuapp.com/windows)
2.  Write a test that:
    a.  Clicks the "Click Here" link.
    b.  Switches to the new tab.
    c.  Asserts that the text "New Window" is visible on the new page.
    d.  Closes the new tab.
    e.  Switches back to the original tab.
    f.  Asserts that the text "Opening a new window" is visible on the original page.
3.  Run your test and make sure it passes.
4.  Share your test file.