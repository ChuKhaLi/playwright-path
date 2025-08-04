# Lesson 1 Assessment: Why TypeScript for Automation?

## Multiple Choice Questions

1.  **What is the primary feature that TypeScript adds to JavaScript?**
    a)  Asynchronous programming with async/await
    b)  A static type system
    c)  The ability to run in a browser
    d)  A new framework for building user interfaces

2.  **What does it mean for TypeScript to be a "superset" of JavaScript?**
    a)  It is a completely different language from JavaScript.
    b)  It can only be used for a small subset of what JavaScript can do.
    c)  All valid JavaScript code is also valid TypeScript code.
    d)  It is an older version of JavaScript.

3.  **What is the main advantage of "type safety" in test automation?**
    a)  It makes the code run faster.
    b)  It allows you to write less code.
    c)  It helps catch bugs related to incorrect data types before the code is run.
    d)  It automatically generates test reports.

4.  **How does TypeScript improve the developer experience when using Playwright?**
    a)  By providing better error messages in the browser console.
    b)  By offering code autocompletion (IntelliSense) for the Playwright API.
    c)  By automatically installing all necessary dependencies.
    d)  By making tests run in parallel by default.

5.  **In the following TypeScript code, what does `: string` signify?**
    ```typescript
    let browserName: string = "Chrome";
    ```
    a)  It is a comment explaining the variable.
    b)  It is a type annotation, specifying that `browserName` must be a string.
    c)  It is a function that converts the value to a string.
    d)  It is an optional part of the syntax that has no effect.

## Short Answer Questions

1.  Explain in your own words the difference between a statically typed language and a dynamically typed language.
2.  Describe a scenario in test automation (other than the one in the lesson) where TypeScript's type safety could prevent a bug that might be missed in plain JavaScript.
3.  Why is it beneficial that Playwright itself is written in TypeScript?

## Answer Key

### Multiple Choice
1.  b) A static type system
2.  c) All valid JavaScript code is also valid TypeScript code.
3.  c) It helps catch bugs related to incorrect data types before the code is run.
4.  b) By offering code autocompletion (IntelliSense) for the Playwright API.
5.  b) It is a type annotation, specifying that `browserName` must be a string.

### Short Answer (Example Responses)
1.  A statically typed language (like TypeScript) checks the types of variables at compile time (before the code runs), which helps catch errors early. A dynamically typed language (like JavaScript) checks types at runtime (as the code is running), so you might not find a type-related error until that line of code is executed.
2.  An example could be testing an API response. You expect a user's ID to be a number, but due to a bug, the API starts returning it as a string (e.g., "123" instead of 123). In JavaScript, if you perform a mathematical operation on it, you might get unexpected results. In TypeScript, you would define an interface for the API response where `userId` is a `number`, and the compiler would immediately flag the incorrect data type when you try to assign the string response, preventing the test from passing with bad data.
3.  Because Playwright is written in TypeScript, its entire API is well-defined with types. This means when we use TypeScript to write our tests, we get perfect autocompletion, documentation, and type-checking for every function and object Playwright provides. It creates a much smoother and more reliable development experience.