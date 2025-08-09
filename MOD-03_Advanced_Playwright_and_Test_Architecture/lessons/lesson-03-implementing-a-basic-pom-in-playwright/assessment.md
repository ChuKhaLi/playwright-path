# Lesson 3: Assessment - Implementing a Basic POM

## Knowledge Check

### Question 1

What is the primary purpose of a Page Object Model (POM)?

a) To make tests run faster.
b) To centralize the logic for interacting with a page, improving maintainability and readability.
c) To replace the need for assertions in tests.
d) To automatically generate test data.

**Answer:** b

---

### Question 2

In a Page Object class, what is the recommended way to handle locators?

a) As `readonly` properties of the class.
b) As static methods that return a string.
c) Hardcoded directly inside the action methods.
d) In a separate JSON file imported by the class.

**Answer:** a

---

### Question 3

How should a Page Object class get access to the Playwright `Page` instance?

a) By creating a new `Page` instance inside the class.
b) By importing it as a global variable.
c) By passing it into the class's constructor.
d) By using `test.page()` directly in the methods.

**Answer:** c

---

### Question 4

Which of the following is a key benefit of using POM in your test suite?

a) It eliminates the need for `async/await`.
b) If a UI locator changes, you only need to update it in one place.
c) It automatically handles all test assertions.
d) It makes the test report more detailed.

**Answer:** b

---

### Question 5

In a test script, how do you use a Page Object?

a) `const loginPage = new LoginPage();`
b) `const loginPage = new LoginPage(page);`
c) `const loginPage = LoginPage.create(page);`
d) `const loginPage = page.extend(LoginPage);`

**Answer:** b