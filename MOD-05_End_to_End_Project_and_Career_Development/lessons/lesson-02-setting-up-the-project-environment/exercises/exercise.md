# Exercise: Set Up Your E2E Project

## 1. Objective

The goal of this exercise is to get hands-on experience setting up a professional test automation project from scratch. By the end, you will have a fully configured, ready-to-use framework structure.

## 2. Instructions

Follow the steps outlined in the lesson to create your project.

### Step 1: Create the Project Directory and Initialize npm

1.  Open your terminal or command prompt.
2.  Create a new directory for your project called `my-automation-framework`.
3.  Navigate into the new directory.
4.  Run `npm init -y` to create your `package.json` file.

### Step 2: Install Dependencies

1.  Install Playwright and TypeScript as development dependencies using the `npm` command from the lesson.
2.  Verify that `node_modules` and `package-lock.json` have been created.
3.  Check your `package.json` to see the new dependencies listed under `devDependencies`.

### Step 3: Configure TypeScript

1.  Create a `tsconfig.json` file in your project's root directory.
2.  Copy the recommended configuration from the lesson into your `tsconfig.json` file.

### Step 4: Create the Directory Structure

1.  Create the following directories and files inside your project:
    -   `src/`
    -   `src/pages/`
    -   `src/utils/`
    -   `tests/`
    -   An empty file named `example.spec.ts` inside the `tests/` directory.
    -   An empty file named `base.page.ts` inside the `src/pages/` directory.

### Step 5: Create a `.gitignore` File

1.  Create a file named `.gitignore` in the root of your project.
2.  Add the following lines to it to ensure you don't commit unnecessary files to version control:

    ```
    # Dependencies
    /node_modules

    # Build output
    /dist

    # Log files
    *.log
    ```

## 3. Verification

At the end of this exercise, your project structure should look like this:

```
my-automation-framework/
├── node_modules/
├── src/
│   ├── pages/
│   │   └── base.page.ts
│   └── utils/
├── tests/
│   └── example.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 4. Career Development Reflection

-   Why is it important to have a `.gitignore` file in a collaborative project?
-   How does this structured setup contribute to the "maintainability" of a test framework? Think about how a new team member would find their way around this project.