# Lesson 3: Assessment

## Knowledge Check

### Question 1
What is the primary benefit of using a component-based approach for Page Objects?

a) It makes the test execution faster.
b) It allows you to reuse code for common UI elements (like headers or navigation bars) across multiple pages.
c) It is the only way to test single-page applications.
d) It combines all page objects into a single file for simplicity.

**Answer:** b) It allows you to reuse code for common UI elements (like headers or navigation bars) across multiple pages.

---

### Question 2
What does a method in a fluent interface typically return?

a) A boolean value indicating success or failure.
b) The `page` object from Playwright.
c) An instance of the next Page Object in the user flow.
d) Nothing (`void`).

**Answer:** c) An instance of the next Page Object in the user flow.

---

### Question 3
According to the principle of separating actions and assertions, where should `expect()` calls be located?

a) Inside the Page Object methods.
b) In the test files (`*.spec.ts`).
c) In a separate `utils.ts` file.
d) In the `playwright.config.ts` file.

**Answer:** b) In the test files (`*.spec.ts`).

---

### Question 4
What is the main purpose of creating a `BasePage` class?

a) To list all the pages in the application.
b) To act as a single page object for the entire application.
c) To share common properties (like a `HeaderComponent`) and methods (like `waitForPageLoad`) among all page objects.
d) To store test data.

**Answer:** c) To share common properties (like a `HeaderComponent`) and methods (like `waitForPageLoad`) among all page objects.

---

### Question 5
In a component-based architecture, how does a Page Object use a component?

a) The component extends the page object.
b) The page object creates an instance of the component within its constructor (composition).
c) The page object calls the component's methods statically.
d) The component and the page object are completely independent and do not interact.

**Answer:** b) The page object creates an instance of the component within its constructor (composition).