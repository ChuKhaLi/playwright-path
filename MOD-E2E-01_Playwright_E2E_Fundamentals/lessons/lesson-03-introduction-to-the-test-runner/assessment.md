# Assessment: Introduction to the Test Runner

## Instructions

This assessment tests your understanding of Playwright's test runner structure, hooks, and execution order. Choose the best answer for each question.

**Time Limit**: 10 minutes  
**Passing Score**: 75% (3 out of 4 questions correct)

---

## Question 1: Test Function Basics

Which of the following is the correct way to write a basic Playwright test?

**A)** 
```typescript
function test('should verify page title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example');
});
```

**B)** 
```typescript
test('should verify page title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example');
});
```

**C)** 
```typescript
it('should verify page title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example');
});
```

**D)** 
```typescript
test('should verify page title', ({ page }) => {
  page.goto('https://example.com');
  expect(page).toHaveTitle('Example');
});
```

<details>
<summary>Click to reveal answer</summary>

**Correct Answer: B**

**Explanation**: 
- Option A is incorrect because `test` is not a regular function declaration - it's imported from `@playwright/test`
- Option B is correct - it uses the proper `test()` function with `async/await` syntax
- Option C uses `it()` which is from other testing frameworks like Jest/Mocha, not Playwright
- Option D is missing `async/await` which is required for Playwright's asynchronous operations

**Key Learning**: Playwright tests use the [`test()`](../content.md:15) function with `async/await` syntax for handling asynchronous operations.
</details>

---

## Question 2: Hook Execution Order

Given the following test structure, what will be the execution order of the console.log statements?

```typescript
describe('Hook Order Test', () => {
  beforeAll(() => console.log('A'));
  beforeEach(() => console.log('B'));
  afterEach(() => console.log('C'));
  afterAll(() => console.log('D'));
  
  test('first test', () => console.log('E'));
  test('second test', () => console.log('F'));
});
```

**A)** A, B, E, C, B, F, C, D  
**B)** A, B, C, D, E, F  
**C)** B, A, E, F, C, D  
**D)** A, E, F, B, C, D  

<details>
<summary>Click to reveal answer</summary>

**Correct Answer: A**

**Explanation**: 
The execution order follows this pattern:
1. `A` - [`beforeAll()`](../content.md:16) runs once at the start
2. `B` - [`beforeEach()`](../content.md:8) runs before first test
3. `E` - First test executes
4. `C` - [`afterEach()`](../content.md:12) runs after first test
5. `B` - [`beforeEach()`](../content.md:8) runs before second test
6. `F` - Second test executes
7. `C` - [`afterEach()`](../content.md:12) runs after second test
8. `D` - [`afterAll()`](../content.md:20) runs once at the end

**Key Learning**: [`beforeEach()`](../content.md:8) and [`afterEach()`](../content.md:12) run for every individual test, while [`beforeAll()`](../content.md:16) and [`afterAll()`](../content.md:20) run only once per describe block.
</details>

---

## Question 3: Test Organization and Describe Blocks

What is the primary purpose of using [`describe()`](../content.md:35) blocks in Playwright tests?

**A)** To make tests run faster by grouping them together  
**B)** To organize related tests and apply scoped hooks  
**C)** To prevent tests from running in parallel  
**D)** To automatically generate test reports  

<details>
<summary>Click to reveal answer</summary>

**Correct Answer: B**

**Explanation**: 
- Option A is incorrect - [`describe()`](../content.md:35) blocks don't inherently make tests run faster
- Option B is correct - [`describe()`](../content.md:35) blocks help organize related tests and allow you to apply hooks to specific groups of tests
- Option C is incorrect - Playwright can still run tests in parallel within and across describe blocks
- Option D is incorrect - while describe blocks help with report organization, they don't automatically generate reports

**Key Learning**: [`describe()`](../content.md:35) blocks are primarily used for test organization and applying scoped setup/cleanup logic through hooks.
</details>

---

## Question 4: Test Modifiers

You're debugging a specific test and want to run only that test while skipping all others. You also have a broken test that you want to temporarily disable. Which combination of modifiers should you use?

**A)** Use `.only` on the test you want to debug and `.skip` on the broken test  
**B)** Use `.focus` on the test you want to debug and `.disable` on the broken test  
**C)** Use `.run` on the test you want to debug and `.ignore` on the broken test  
**D)** Use `.single` on the test you want to debug and `.skip` on the broken test  

<details>
<summary>Click to reveal answer</summary>

**Correct Answer: A**

**Explanation**: 
- Option A is correct - [`.only`](../content.md:89) runs exclusively the marked test(s) and [`.skip`](../content.md:85) disables tests
- Option B is incorrect - `.focus` and `.disable` are not valid Playwright test modifiers
- Option C is incorrect - `.run` and `.ignore` are not valid Playwright test modifiers
- Option D is incorrect - `.single` is not a valid Playwright test modifier

**Key Learning**: Playwright uses [`.only`](../content.md:89) to run specific tests exclusively and [`.skip`](../content.md:85) to temporarily disable tests during development.

**Important Note**: Remember to remove `.only` modifiers before committing code to version control!
</details>

---

## Bonus Question (Optional)

Which hook would be most appropriate for logging into an application before each test in a test suite?

**A)** [`beforeAll()`](../content.md:16) - because login only needs to happen once  
**B)** [`beforeEach()`](../content.md:8) - to ensure each test starts with a fresh login state  
**C)** [`afterEach()`](../content.md:12) - to clean up the login session  
**D)** [`afterAll()`](../content.md:20) - to handle login at the end of testing  

<details>
<summary>Click to reveal answer</summary>

**Correct Answer: B**

**Explanation**: 
- Option A might seem efficient, but login sessions can expire or become invalid between tests
- Option B is correct - [`beforeEach()`](../content.md:8) ensures each test starts with a fresh, valid login state, making tests more reliable and independent
- Option C is for cleanup, not setup
- Option D runs after all tests, which doesn't help with login setup

**Key Learning**: Use [`beforeEach()`](../content.md:8) for setup that needs to be fresh for each test, ensuring test independence and reliability.
</details>

---

## Assessment Results

### Scoring Guide
- **4/4 correct (100%)**: Excellent! You have a strong understanding of Playwright's test runner
- **3/4 correct (75%)**: Good job! You understand the core concepts
- **2/4 correct (50%)**: Review the lesson content and try the hands-on exercise
- **1/4 or less (25% or less)**: Please review the lesson content thoroughly and complete the practice exercise

### What to Do Next

**If you scored 75% or higher:**
- ✅ You're ready to move on to the next lesson
- Consider completing the bonus hands-on challenges
- Start exploring the next lesson on locators and element interactions

**If you scored below 75%:**
- 📚 Review the [lesson content](../content.md) focusing on areas you missed
- 🛠️ Complete the [hands-on practice exercise](../exercises/hands-on-practice.md)
- 🔄 Retake this assessment
- 💡 Review the [test runner demo example](../examples/test-runner-demo.spec.ts)

### Key Concepts to Remember

1. **Test Structure**: Use [`test()`](../content.md:15) function with descriptive names and `async/await`
2. **Organization**: Group related tests with [`describe()`](../content.md:35) blocks
3. **Hooks**: Use [`beforeEach()`](../content.md:8)/[`afterEach()`](../content.md:12) for per-test setup/cleanup, [`beforeAll()`](../content.md:16)/[`afterAll()`](../content.md:20) for suite-level setup/cleanup
4. **Execution Order**: beforeAll → (beforeEach → test → afterEach) × n → afterAll
5. **Modifiers**: Use [`.skip`](../content.md:85) to disable tests, [`.only`](../content.md:89) to run specific tests (remove before committing!)

### Additional Resources

- [Playwright Test Runner Documentation](https://playwright.dev/docs/test-runners)
- [Test Hooks Best Practices](https://playwright.dev/docs/test-fixtures)
- [Test Organization Patterns](https://playwright.dev/docs/test-organize)

---

**Congratulations on completing the assessment!** 🎉

Remember: Understanding the test runner structure is fundamental to writing maintainable and reliable automated tests. These concepts will be used throughout your Playwright testing journey.