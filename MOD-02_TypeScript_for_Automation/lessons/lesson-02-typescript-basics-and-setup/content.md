# Lesson 2: TypeScript Basics and Setup

## Learning Objectives
After completing this lesson, you will be able to:
- Set up a new project with TypeScript.
- Install TypeScript and other necessary tools.
- Understand the purpose and basic configuration of `tsconfig.json`.
- Write, compile, and run a simple TypeScript file.

## Introduction
It's time to move from theory to practice. In this lesson, we'll set up your first TypeScript project. This is a foundational step that you will repeat for every new automation project you start. We'll keep it simple and focus on the core components you need to get up and running.

## Prerequisites
Before we start, make sure you have the following installed from MOD-01:
- **Node.js and npm:** Node.js is a JavaScript runtime, and npm is its package manager. You can check if they are installed by opening a terminal and running `node -v` and `npm -v`.
- **Visual Studio Code (VS Code):** Our recommended code editor, which has excellent built-in support for TypeScript.

## Step 1: Setting Up the Project Folder
First, let's create a dedicated folder for our project.

1.  Open your terminal or command prompt.
2.  Navigate to a directory where you want to store your projects.
3.  Create a new folder and navigate into it. Remember to use Windows-compatible commands.

```bash
mkdir MOD-02-Lesson-02
cd MOD-02-Lesson-02
```

## Step 2: Initializing a Node.js Project
Every Node.js project, including our TypeScript project, needs a `package.json` file. This file tracks your project's metadata and dependencies.

Run the following command in your terminal:

```bash
npm init -y
```
The `-y` flag tells npm to use the default settings, which is fine for our purposes. You should now see a `package.json` file in your project folder.

## Step 3: Installing TypeScript
Next, we need to install the TypeScript compiler, which is named `tsc`. We will install it as a "development dependency" because it's a tool we need for development, but it's not needed to *run* the final JavaScript code.

```bash
npm install typescript --save-dev
```
You will now see a `node_modules` folder and a `package-lock.json` file.
- `node_modules`: Where all your project's dependencies are stored.
- `package-lock.json`: A file that records the exact versions of your dependencies to ensure consistent installations.

## Step 4: Creating a TypeScript Configuration File (`tsconfig.json`)
The `tsconfig.json` file is the heart of a TypeScript project. It tells the TypeScript compiler (`tsc`) how to compile your `.ts` files into `.js` files.

We can generate a default `tsconfig.json` file using the TypeScript compiler itself, which we can access via `npx`. `npx` is a tool that comes with npm and allows you to run packages from the `node_modules` folder.

```bash
npx tsc --init
```
This command creates a `tsconfig.json` file with many options, most of which are commented out. For now, we only need to care about a few key settings.

Open `tsconfig.json` in VS Code and ensure the following options are set. You can uncomment them and change their values if needed.

```json
{
  "compilerOptions": {
    "target": "es2016", // The version of JavaScript the compiler will output. ES2016 is a good modern default.
    "module": "commonjs", // The module system to use. CommonJS is standard for Node.js.
    "outDir": "./dist", // Where to output the compiled JavaScript files.
    "rootDir": "./src", // Where to find the source TypeScript files.
    "strict": true, // Enables a wide range of type checking behavior for stricter code.
    "esModuleInterop": true // Allows for better compatibility between CommonJS and ES modules.
  }
}
```
*Analogy:* Think of `tsconfig.json` as the rulebook for a translator. It tells the translator (the TypeScript compiler) what dialect of JavaScript to translate to (`target`), how to handle imports and exports (`module`), and where to put the source and translated files (`rootDir` and `outDir`).

## Step 5: Writing Your First TypeScript Code
Now for the fun part!

1.  Create a new folder named `src` in your project's root directory. This is where our source code will live, as specified in `tsconfig.json`.
2.  Inside the `src` folder, create a new file named `hello.ts`. The `.ts` extension is for TypeScript files.
3.  Add the following code to `src/hello.ts`:

```typescript
// A simple function to greet a user.
// Notice the type annotation for the 'name' parameter.
function greet(name: string) {
  console.log(`Hello, ${name}! Welcome to TypeScript for Automation.`);
}

let qaEngineer: string = "Alex";
greet(qaEngineer);

// Let's try to cause a type error!
// Uncomment the line below and see what happens in VS Code.
// greet(123);
```
Notice that VS Code will immediately underline `greet(123)` with a red squiggly line if you uncomment it. This is TypeScript's static analysis in action!

## Step 6: Compiling and Running Your Code
We have our TypeScript code, but Node.js can only run JavaScript. So, we need to compile our `.ts` file into a `.js` file.

1.  **Compile:** In your terminal, at the root of your project, run the TypeScript compiler:
    ```bash
    npx tsc
    ```
    `tsc` will read your `tsconfig.json`, find all `.ts` files in the `src` directory, compile them to JavaScript, and place them in the `dist` directory. You should now have a `dist/hello.js` file.

2.  **Run:** Now, run the compiled JavaScript file using Node.js:
    ```bash
    node dist/hello.js
    ```
You should see the following output in your terminal:
```
Hello, Alex! Welcome to TypeScript for Automation.
```

## Summary
Congratulations! You have successfully set up a TypeScript project from scratch.
- We initialized a Node.js project with `npm init -y`.
- We installed TypeScript as a dev dependency with `npm install typescript --save-dev`.
- We created a `tsconfig.json` file to configure the compiler.
- We wrote our first TypeScript code in a `.ts` file.
- We compiled our TypeScript to JavaScript using `npx tsc`.
- We ran the resulting JavaScript file with `node`.

This setup forms the basis for all our future lessons and for building a full Playwright automation framework.