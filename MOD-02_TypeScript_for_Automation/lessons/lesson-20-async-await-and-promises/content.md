# Lesson 20: Async/Await and Promises

## Learning Objectives
- Understand what asynchronous programming is and why it's essential for test automation.
- Learn the basics of Promises and how they represent future values.
- Master the `async`/`await` syntax for writing clean and readable asynchronous code.
- Apply `async`/`await` to handle Playwright's asynchronous API calls effectively.

## Introduction
Modern web applications and test automation frameworks are inherently asynchronous. Actions like navigating to a page, clicking a button, or waiting for an API response don't happen instantly. JavaScript uses an event loop to handle these operations without blocking the main thread. Promises and the `async`/`await` syntax are the modern tools for managing this asynchronicity.

**Nearly every command in Playwright is asynchronous and returns a Promise.** Mastering this concept is non-negotiable for becoming a successful automation engineer.

## What is a Promise?
A **Promise** is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

A Promise can be in one of three states:
- **Pending:** The initial state; the operation has not completed yet.
- **Fulfilled:** The operation completed successfully, and the Promise has a resulting value.
- **Rejected:** The operation failed, and the Promise has a reason for the failure (an error).

### Creating a Promise (for demonstration)
You typically won't create Promises manually when using Playwright, but it's helpful to see how they work.

```typescript
const myPromise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve("Operation was successful!");
    } else {
      reject(new Error("Operation failed."));
    }
  }, 1000); // Simulate a 1-second delay
});
```

### Consuming a Promise (The old way: `.then()` and `.catch()`)
Before `async/await`, you would chain `.then()` and `.catch()` methods to a Promise.

```typescript
myPromise
  .then(successMessage => {
    // This runs if the promise is fulfilled
    console.log(successMessage);
  })
  .catch(error => {
    // This runs if the promise is rejected
    console.error(error.message);
  });
```
This syntax can become difficult to read when you have many sequential asynchronous operations (a situation often called "callback hell").

## `async`/`await`: The Modern Syntax
`async`/`await` is syntactic sugar built on top of Promises. It lets you write asynchronous code that looks and behaves like synchronous code, making it much easier to read and reason about.

- **`async`:** The `async` keyword is placed before a function declaration to turn it into an **async function**. Async functions always implicitly return a Promise.
- **`await`:** The `await` keyword can only be used inside an `async` function. It pauses the execution of the function and waits for a Promise to be fulfilled or rejected. If fulfilled, it returns the value. If rejected, it throws the error.

### Rewriting with `async`/`await`

```typescript
// An async function to wrap our logic
async function runMyPromise() {
  try {
    // 'await' pauses the function until the promise settles
    const successMessage = await myPromise;
    console.log(successMessage);
  } catch (error) {
    // If the promise is rejected, the error is caught here
    console.error(error.message);
  }
}

runMyPromise();
```
This code is much cleaner and easier to follow, especially when dealing with multiple steps.

## `async`/`await` in Playwright
Let's see how this applies directly to a Playwright test.

```typescript
import { test, expect, Page } from '@playwright/test';

// The test function is an async function
test('should log in with valid credentials', async ({ page }) => {
  // Every Playwright action returns a Promise, so we 'await' it.
  await page.goto('https://example.com/login');

  // 'await' ensures the fill action is complete before moving on
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'securepassword');

  // 'await' the click and the subsequent navigation/network response
  await page.click('#login-button');

  // 'await' the assertion. Playwright's web-first assertions are also async.
  await expect(page.locator('.welcome-message')).toHaveText('Welcome, testuser!');
});
```

### Common Mistakes
1.  **Forgetting `await`:** This is the most common mistake. If you forget `await`, the next line of code will execute immediately, before the asynchronous operation has finished, leading to flaky and incorrect tests.
2.  **Not making the containing function `async`:** You cannot use `await` in a function that is not marked as `async`.

## Summary
- **Asynchronous programming** is fundamental to test automation with Playwright.
- A **Promise** is an object representing a future value from an async operation.
- **`async`/`await`** is the modern, clean syntax for working with Promises.
- An `async` function always returns a Promise.
- The `await` keyword pauses function execution until a Promise settles.
- **You must `await` every Playwright command** to ensure your test steps execute in the correct order.