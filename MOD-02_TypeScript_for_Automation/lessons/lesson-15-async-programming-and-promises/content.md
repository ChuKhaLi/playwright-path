# Lesson 8: Async Programming and Promises

## Learning Objectives
After completing this lesson, you will be able to:
- Explain why asynchronous programming is essential for web automation.
- Understand the concept of a `Promise` and its states (pending, fulfilled, rejected).
- Use `async` and `await` to write clean, readable asynchronous code.
- Correctly type the return value of an `async` function.
- Apply `async/await` to simulate real-world automation scenarios.

## Introduction: Why Asynchronous?
Imagine you're testing a web page. Your script tells the browser:
1.  Go to the login page.
2.  Find the username field.
3.  Get the text of the main heading.

These actions are not instant. It takes time for the network request to complete, for the page to render, and for elements to appear. If your code was **synchronous**, it would try to do step 2 before step 1 was finished, leading to an immediate failure.

This is where **asynchronous** programming comes in. It's a way of writing code that doesn't block or wait for long-running tasks to complete. Instead, it can start a task (like navigating to a page), do something else, and then handle the result of the task when it's ready.

In modern JavaScript and TypeScript, this is handled using **Promises** and the `async/await` syntax. **Nearly every command in Playwright is asynchronous.**

## What is a Promise?
A `Promise` is an object that represents the eventual completion (or failure) of an asynchronous operation.

**Automation Analogy:** A `Promise` is like ordering a pizza.
1.  You place the order. You don't have the pizza yet, but you have a "promise" that you will get it eventually. This is the **pending** state.
2.  The pizza arrives at your door. The promise has been **fulfilled** (or **resolved**), and you have the result (the pizza).
3.  The restaurant calls to say they're out of dough. The promise has been **rejected**, and you have a reason for the failure.

A `Promise` in TypeScript is a placeholder for a future value.

## The `async` and `await` Keywords
While Promises are the underlying mechanism, TypeScript gives us a much cleaner syntax to work with them: `async` and `await`.

### `async`
The `async` keyword is placed before a function declaration. It does two things:
1.  It allows you to use the `await` keyword inside that function.
2.  It automatically makes the function return a `Promise`.

```typescript
async function myAsyncFunction(): Promise<void> {
  // You can use 'await' in here
}
```

### `await`
The `await` keyword can only be used inside an `async` function. It tells the code to **pause execution** at that line and wait for a `Promise` to be fulfilled or rejected before moving on.

When you `await` a `Promise`, you get the "unwrapped" value back. If the promise is fulfilled, `await` returns the result. If it's rejected, it throws an error.

## Simulating Asynchronous Operations
Let's create a fake function that simulates a network request to understand how `async/await` works.

```typescript
// This function simulates fetching user data from a server.
// It returns a Promise that will resolve with a user object after 2 seconds.
function fetchUserData(userId: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    console.log("Fetching data...");
    setTimeout(() => {
      const userData = { id: userId, name: "Alice" };
      console.log("Data fetched!");
      resolve(userData);
    }, 2000); // Simulate a 2-second delay
  });
}

// Now, let's use this function in an async context.
async function displayUserData(): Promise<void> {
  console.log("Starting user data display...");
  
  // We 'await' the promise. The code will pause here for 2 seconds.
  const user = await fetchUserData(123);
  
  // This line will only run AFTER the promise is fulfilled.
  console.log(`User Name: ${user.name}`);
  console.log("...Finished user data display.");
}

displayUserData();
```
**Output:**
```
Starting user data display...
Fetching data...
(2-second pause)
Data fetched!
User Name: Alice
...Finished user data display.
```
Without `await`, the `console.log(user.name)` line would execute immediately, and `user` would be a `Promise` object, not the user data, causing an error.

## Typing `async` Functions
When you declare an `async` function, its return type must always be a `Promise`.

- If the function returns a string, the type is `Promise<string>`.
- If it returns a number, the type is `Promise<number>`.
- If it returns nothing, the type is `Promise<void>`.

```typescript
// This async function will eventually return a string.
async function getPageTitle(): Promise<string> {
  // In Playwright, this would be: await page.title();
  await new Promise(resolve => setTimeout(resolve, 500)); // Fake delay
  return "My Test Application";
}

// This async function performs an action but returns nothing.
async function clickLoginButton(): Promise<void> {
  // In Playwright, this would be: await page.locator('#login').click();
  console.log("Clicked the login button.");
  await new Promise(resolve => setTimeout(resolve, 500)); // Fake delay
}
```

## Why This is CRITICAL for Playwright
Let's look at a pseudo-Playwright example.

**WRONG - Forgetting `await`:**
```typescript
async function loginTest(): Promise<void> {
  // This code is BROKEN
  page.goto("https://my-app.com/login"); // Starts navigating but doesn't wait
  page.fill("#username", "testuser");   // Tries to fill before page has loaded! ERROR!
}
```

**CORRECT - Using `await`:**
```typescript
// This is how you correctly write Playwright tests
async function loginTest(): Promise<void> {
  // Wait for the navigation to complete
  await page.goto("https://my-app.com/login");
  
  // NOW the page is loaded. Wait for the fill action to complete.
  await page.fill("#username", "testuser");
  
  // Wait for the next fill action to complete.
  await page.fill("#password", "secret");
  
  // Wait for the click action to complete.
  await page.click("#login-button");
}
```
**Rule of Thumb:** If a Playwright command performs an action on the page (navigate, click, fill, get text, etc.), you **must** `await` it.

## Summary
- Web automation is **asynchronous** because actions like loading pages and finding elements take time.
- A **`Promise`** is an object representing a future value.
- `async/await` is the modern syntax for handling Promises in a clean, readable way.
- An `async` function always returns a `Promise`.
- The `await` keyword pauses function execution until a `Promise` settles (is fulfilled or rejected).
- **You must `await` almost every Playwright command** to ensure your test steps execute in the correct order. Forgetting `await` is the most common source of bugs for beginners.