# Lesson 13: XPath Fundamentals - Assessment

## Multiple Choice Questions

1.  **Which of the following is the primary advantage of XPath over CSS selectors for test automation?**
    a.  Better performance
    b.  Simpler syntax
    c.  Ability to navigate up the DOM tree (e.g., to a parent element)
    d.  Better support for styling

2.  **What does the `//` syntax at the beginning of an XPath expression represent?**
    a.  Selects the root element
    b.  Selects elements from anywhere in the document
    c.  Selects the direct children of the current node
    d.  Selects the parent element

3.  **Which XPath function is used to select an element based on its exact text content?**
    a.  `contains()`
    b.  `text()`
    c.  `starts-with()`
    d.  `like()`

4.  **How would you select the `<body>` element using an absolute XPath?**
    a.  `//body`
    b.  `/html/body`
    c.  `body`
    d.  `./body`

5.  **Which XPath axis selects all siblings of the current node that appear after it in the document?**
    a.  `following`
    b.  `preceding-sibling`
    c.  `descendant`
    d.  `following-sibling`

## Short Answer Questions

1.  **Explain the difference between an absolute and a relative XPath. Which one is generally preferred in test automation and why?**
2.  **Write an XPath expression to select an `input` element that has a `name` attribute equal to "username" and is inside a `form` with an `id` of "login-form".**
3.  **What is the purpose of the `last()` function in XPath? Provide an example of how you might use it to select the last `<li>` element in a list.**

## Practical Application

**Given the following HTML snippet:**

```html
<div class="product-container">
    <h2>Our Products</h2>
    <ul>
        <li class="product-item">
            <span>Product A</span>
            <button>Add to Cart</button>
        </li>
        <li class="product-item">
            <span>Product B</span>
            <button>Add to Cart</button>
        </li>
        <li class="product-item">
            <span>Product C</span>
            <button class="disabled">Out of Stock</button>
        </li>
    </ul>
</div>
```

1.  **Write an XPath to select the "Add to Cart" button for "Product B".**
2.  **Write an XPath to select the `<span>` element containing the text "Product C".**
3.  **Write an XPath to select only the enabled "Add to Cart" buttons (i.e., not the one that is disabled).**