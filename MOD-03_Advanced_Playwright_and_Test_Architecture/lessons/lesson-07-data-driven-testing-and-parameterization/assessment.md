# Lesson 7: Assessment - Data-Driven Testing

This assessment will test your understanding of data-driven testing concepts in Playwright.

## Questions

### Question 1:
**What is the primary benefit of data-driven testing?**
a) It makes tests run in parallel automatically.
b) It allows you to run the same test logic with multiple sets of data, reducing code duplication and improving coverage.
c) It eliminates the need for assertions.
d) It is the only way to use external files in Playwright.

**Answer:**
b) It allows you to run the same test logic with multiple sets of data, reducing code duplication and improving coverage.

---

### Question 2:
**You have an array of search terms and want to create a separate test for each one. What is the most common and straightforward way to achieve this in Playwright?**
a) Use `test.describe.parallel()` with the array.
b) Create a custom fixture that loops through the array.
c) Use a `for...of` loop to iterate over the array, and call `test()` inside the loop.
d) Use `test.generate(searchTerms, ...)`

**Answer:**
c) Use a `for...of` loop to iterate over the array, and call `test()` inside the loop. This is the standard pattern for generating parameterized tests in Playwright.

---

### Question 3:
**Why is it a good practice to create dynamic test titles when parameterizing tests, like `test(\`should work for user: \${user.name}\`, ...)`?**
a) It is a requirement for the test runner to work.
b) It makes the test report much more readable, as you can see at a glance which data set passed or failed.
c) It helps Playwright to run the tests faster.
d) It allows you to use more than 10 data sets.

**Answer:**
b) It makes the test report much more readable, as you can see at a glance which data set passed or failed.

---

### Question 4:
**You are storing test data in a `users.json` file. How do you make this data available in your test script?**
a) `const users = await page.request.get('users.json');`
b) `import users from './data/users.json';`
c) `const users = require('fs').readFileSync('users.json');`
d) You must convert the JSON to a `.ts` file first.

**Answer:**
b) `import users from './data/users.json';`. With modern bundlers and TypeScript configurations (like the one Playwright sets up), you can directly import JSON files. You may need to ensure `resolveJsonModule` is `true` in your `tsconfig.json`.