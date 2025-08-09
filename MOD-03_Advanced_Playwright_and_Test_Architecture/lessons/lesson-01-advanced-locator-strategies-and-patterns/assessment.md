# Lesson 1: Assessment - Advanced Locator Strategies

This assessment tests your understanding of the advanced locator strategies covered in this lesson.

## Questions

### Question 1:
**Which of the following is Playwright's most recommended locator strategy and why?**
a) `page.locator('#submit-button')`
b) `page.getByRole('button', { name: 'Submit' })`
c) `page.locator('//button[text()="Submit"]')`
d) `page.getByText('Submit')`

**Answer:**
b) `page.getByRole('button', { name: 'Submit' })`. It is the most recommended because it aligns with how users and assistive technologies perceive the page, making it more resilient to changes in the DOM structure.

---

### Question 2:
**You have a list of products, and you want to click the "Add to Cart" button only for the product named "Super Widget". The HTML looks like this:**

```html
<div class="product">
  <h3>Super Widget</h3>
  <button>Add to Cart</button>
</div>
<div class="product">
  <h3>Mega Widget</h3>
  <button>Add to Cart</button>
</div>
```

**Which is the most robust way to locate the correct button?**
a) `page.getByRole('button', { name: 'Add to Cart' }).first().click()`
b) `page.locator('.product:has-text("Super Widget")').getByRole('button').click()`
c) `page.locator('div.product > button').nth(0).click()`
d) `page.getByText('Super Widget').locator('..').getByRole('button').click()`

**Answer:**
b) `page.locator('.product:has-text("Super Widget")').getByRole('button').click()`. This approach correctly scopes the search for the button within the container of the product with the specific text, making it very robust. Option (d) is also good, but (b) is often considered slightly more readable.

---

### Question 3:
**What is the primary benefit of using relative (layout-based) locators like `rightOf()`?**
a) They are faster than CSS selectors.
b) They can find elements even if they are not visible.
c) They rely on the visual layout of the page rather than the DOM structure, making them resilient to markup changes.
d) They only work for elements that are next to each other in the DOM.

**Answer:**
c) They rely on the visual layout of the page rather than the DOM structure, making them resilient to markup changes.

---

### Question 4:
**How would you select the third `<li>` element in a `<ul>` list?**
a) `page.locator('li').third()`
b) `page.getByRole('listitem').nth(3)`
c) `page.getByRole('listitem').nth(2)`
d) `page.locator('li[2]')`

**Answer:**
c) `page.getByRole('listitem').nth(2)`. The `nth()` method is 0-indexed, so the third element is at index 2. `getByRole('listitem')` is also preferred over the tag selector `li`.