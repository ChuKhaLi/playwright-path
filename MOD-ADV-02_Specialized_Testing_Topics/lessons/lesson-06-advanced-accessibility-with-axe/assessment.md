# Lesson 6: Assessment

## Knowledge Check

Test your understanding of advanced accessibility testing with Axe.

### Question 1

How can you configure `AxeBuilder` to only check for WCAG 2.1 Level AA violations?

a) `new AxeBuilder({ page }).withLevel('AA')`
b) `new AxeBuilder({ page }).withTags(['wcag21aa'])`
c) `new AxeBuilder({ page }).wcag21aa()`
d) This level of configuration is not possible.

**Answer:** b) `new AxeBuilder({ page }).withTags(['wcag21aa'])`

### Question 2

What is the purpose of the `disableRules()` method in `AxeBuilder`?

a) To make the scan run faster.
b) To permanently remove rules from the Axe engine.
c) To temporarily ignore specific known violations during a scan.
d) To disable accessibility features in the browser.

**Answer:** c) To temporarily ignore specific known violations during a scan.

### Question 3

Which `AxeBuilder` method would you use to scan only the main navigation bar of a website, which has a CSS selector of `#main-nav`?

a) `include('#main-nav')`
b) `exclude('#main-nav')`
c) `only('#main-nav')`
d) `focus('#main-nav')`

**Answer:** a) `include('#main-nav')`

### Question 4

Why is it beneficial to run an accessibility scan after a user interaction, like opening a modal?

a) To check if the user interaction was successful.
b) To ensure that dynamically loaded content is also accessible.
c) To make the test look more complex.
d) To slow down the test and wait for the page to settle.

**Answer:** b) To ensure that dynamically loaded content is also accessible.

### Question 5

When should you use the `exclude()` method in an accessibility scan?

a) To make the test pass even if there are violations.
b) To ignore parts of the page that you don't have control over, like a third-party widget.
c) To test only a single element on the page.
d) To hide elements from screen readers.

**Answer:** b) To ignore parts of the page that you don't have control over, like a third-party widget.