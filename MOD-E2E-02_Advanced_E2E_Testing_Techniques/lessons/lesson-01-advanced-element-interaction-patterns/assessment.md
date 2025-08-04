# Assessment: Advanced Element Interaction Patterns

## Knowledge Check

### Question 1
Which Playwright method is used to simulate a user moving their mouse cursor over an element without clicking it?
a) `focus()`
b) `mouse.over()`
c) `hover()`
d) `pointTo()`

**Answer:** c) `hover()`

---

### Question 2
What is the primary difference between `locator.dragTo(target)` and `page.dragAndDrop(source, target)`?
a) `dragTo` is a method on the `Locator` object, while `dragAndDrop` is on the `Page` object.
b) `dragTo` is more high-level and simulates the entire drag action.
c) `dragAndDrop` requires CSS selectors as arguments.
d) All of the above.

**Answer:** d) All of the above.

---

### Question 3
Why might you need to use `page.mouse.down()`, `page.mouse.move()`, and `page.mouse.up()` to interact with a slider?
a) Sliders do not support the `fill()` method.
b) This sequence accurately simulates a user dragging the slider handle.
c) It's the only way to get the slider's `boundingBox`.
d) It is required for all `input[type="range"]` elements.

**Answer:** b) This sequence accurately simulates a user dragging the slider handle.

---

### Question 4
When testing a custom dropdown made of `<div>` elements, what is the typical first step?
a) Use `selectOption()` as you would with a standard `<select>` element.
b) Click the element that triggers the dropdown to open.
c) Hover over the dropdown to reveal the options.
d) Directly locate the desired option text on the page.

**Answer:** b) Click the element that triggers the dropdown to open.

---

## Practical Application

### Scenario
You are testing a web application with a "Settings" page. On this page, there is a "Theme" section with a custom-styled switch for toggling between "Light" and "Dark" mode. The switch is not a standard checkbox but a `<div>` with a role of `switch`.

Additionally, there is a "Notifications" panel that only appears when you hover over a bell icon.

### Task
Write a Playwright test script that performs the following actions:
1.  Navigates to the "Settings" page.
2.  Hovers over the bell icon to reveal the "Notifications" panel.
3.  Asserts that the "Notifications" panel is visible.
4.  Finds the theme switch and clicks it to change the theme.
5.  Asserts that the theme has changed by checking for a class `dark-mode` on the `<body>` element.

Provide the complete TypeScript code for this test.