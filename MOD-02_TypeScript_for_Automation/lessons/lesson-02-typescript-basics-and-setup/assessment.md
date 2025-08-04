# Lesson 2 Assessment: TypeScript Basics and Setup

## Multiple Choice Questions

1.  **What is the purpose of the `npm init -y` command?**
    a)  To install TypeScript.
    b)  To create a `package.json` file with default settings.
    c)  To compile TypeScript files.
    d)  To create a `tsconfig.json` file.

2.  **Which file is used to configure the TypeScript compiler (`tsc`)?**
    a)  `package.json`
    b)  `node_modules`
    c)  `tsconfig.json`
    d)  `package-lock.json`

3.  **In a typical TypeScript project, where do you place your source `.ts` files?**
    a)  In the `dist` folder.
    b)  In the `node_modules` folder.
    c)  In the root of the project.
    d)  In the `src` folder.

4.  **What does the `npx tsc` command do?**
    a)  It runs the compiled JavaScript code.
    b)  It installs TypeScript.
    c)  It reads `tsconfig.json` and compiles `.ts` files into `.js` files.
    d)  It initializes a new npm project.

5.  **In the `tsconfig.json` file, what does the `outDir` option specify?**
    a)  The directory where the source TypeScript files are located.
    b)  The directory where the compiled JavaScript files should be placed.
    c)  The directory where third-party libraries are stored.
    d)  The version of JavaScript to compile to.

## Practical Exercise

1.  **Setup a New Project:**
    -   Create a new folder named `my-ts-project`.
    -   Navigate into this folder in your terminal.
    -   Initialize a new npm project.
    -   Install TypeScript as a development dependency.
    -   Generate a `tsconfig.json` file.

2.  **Configure `tsconfig.json`:**
    -   Modify your `tsconfig.json` to ensure the compiled JavaScript files will be placed in a `build` directory instead of `dist`.
    -   Ensure the source files are expected to be in a `source` directory instead of `src`.

3.  **Write and Compile Code:**
    -   Create the `source` directory.
    -   Inside `source`, create a file named `calculator.ts`.
    -   In `calculator.ts`, write a simple function named `add` that takes two numbers as parameters (with type annotations) and returns their sum.
    -   Call the `add` function with two numbers and log the result to the console.
    -   Compile the project using the appropriate command.

4.  **Verify and Run:**
    -   Verify that a `build` directory with a `calculator.js` file inside it has been created.
    -   Run the compiled `calculator.js` file using Node.js and confirm that the correct sum is printed to the console.

## Answer Key

### Multiple Choice
1.  b) To create a `package.json` file with default settings.
2.  c) `tsconfig.json`
3.  d) In the `src` folder.
4.  c) It reads `tsconfig.json` and compiles `.ts` files into `.js` files.
5.  b) The directory where the compiled JavaScript files should be placed.

### Practical Exercise (Verification Steps)
1.  After the setup, the `my-ts-project` folder should contain `package.json`, `package-lock.json`, `tsconfig.json`, and a `node_modules` directory.
2.  The `tsconfig.json` should have `"outDir": "./build"` and `"rootDir": "./source"`.
3.  The `source/calculator.ts` file could look like this:
    ```typescript
    function add(a: number, b: number): number {
      return a + b;
    }

    const result = add(5, 10);
    console.log(`The result is: ${result}`);
    ```
4.  After running `npx tsc`, a `build/calculator.js` file should exist. Running `node build/calculator.js` should output `The result is: 15`.