# Lesson 14: Advanced XPath Techniques - Assessment

## Multiple Choice Questions

1.  **Which XPath expression correctly selects an `input` element that is both `required` and not `disabled`?**
    a.  `//input[@required or not(@disabled)]`
    b.  `//input[@required and not(@disabled)]`
    c.  `//input[@required | @disabled]`
    d.  `//input[not(@required) and @disabled]`

2.  **What is the purpose of the `concat()` function in XPath?**
    a.  To count the number of characters in a string.
    b.  To join two or more strings together.
    c.  To extract a substring from a string.
    d.  To convert a string to a number.

3.  **How would you select a `div` element that contains a `p` element with the exact text "Success!"?**
    a.  `//div[p[text()='Success!']]`
    b.  `//div[.//p[text()='Success!']]`
    c.  `//div/p[text()='Success!']`
    d.  `//div[contains(p, 'Success!')]`

4.  **Which of the following is a good practice for writing performant XPath selectors?**
    a.  Always start expressions with `//` for flexibility.
    b.  Use the wildcard `*` as much as possible.
    c.  Avoid indexing (`[1]`, `[2]`, etc.) on large sets of nodes.
    d.  Use `contains()` for all text matching.

5.  **What is the result of the XPath `//div[starts-with(@id, 'user-')]`?**
    a.  It selects all `div` elements.
    b.  It selects `div` elements where the `id` attribute is exactly "user-".
    c.  It selects `div` elements where the `id` attribute value begins with the string "user-".
    d.  It will result in an error because `starts-with` is not a valid function.

## Short Answer Questions

1.  **Explain the difference between `//div[p]` and `//div[.//p]`. When would you use one over the other?**
2.  **Write an XPath expression to select the `label` for an `input` element with the `id` "email". Assume the `label` is a preceding sibling of the `input`.**
3.  **Why is the expression `//div[contains(concat(' ', normalize-space(@class), ' '), ' my-class ')]` a more robust way to find an element by class name than `//div[contains(@class, 'my-class')]`?**

## Practical Application

**Given the following HTML snippet:**

```html
<div id="main-content">
    <div class="widget-container" data-widget-id="widget-123-a">
        <h3>User Details</h3>
        <p>Username: <span>johndoe</span></p>
        <button class="btn-primary">Edit</button>
    </div>
    <div class="widget-container" data-widget-id="widget-456-b">
        <h3>Account Settings</h3>
        <p>Status: <span class="status-active">Active</span></p>
        <button class="btn-secondary" disabled>Edit</button>
    </div>
    <div class="widget-container" data-widget-id="widget-789-c">
        <h3>Notifications</h3>
        <p>Email alerts: <span>Enabled</span></p>
        <button class="btn-primary">Edit</button>
    </div>
</div>
```

1.  **Write an XPath to select the "Edit" button for the user "johndoe".**
2.  **Write an XPath to select the `div` with the class `widget-container` that contains the text "Account Settings" AND has a disabled button.**
3.  **Write an XPath to select all `widget-container` divs whose `data-widget-id` attribute starts with "widget-" and ends with "-c". (Note: `ends-with` is XPath 2.0, provide a 1.0 compatible answer).**