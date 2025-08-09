# Lesson 2: Setting Up the Project Environment

## 1. Introduction

A solid foundation is critical for any successful software project, and test automation is no exception. In this lesson, we'll walk through the essential steps to set up a professional and scalable project environment for our E2E test automation framework.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Initialize a Node.js Project:** Use `npm` to create a new project and manage dependencies.
-   **Install Playwright:** Add Playwright to the project and understand its core components.
-   **Configure TypeScript:** Set up a `tsconfig.json` file to configure the TypeScript compiler for our project.
-   **Structure the Project:** Create a logical directory structure for a scalable test automation framework.
-   **Career Context:** Understand why a well-structured project setup is a hallmark of a professional QA automation engineer.

## 3. Step 1: Initializing the Node.js Project

First, we need to create a `package.json` file. This file is the heart of any Node.js project, tracking metadata and dependencies.

1.  **Create a Project Directory:**
    ```bash
    mkdir my-e2e-project
    cd my-e2e-project
    ```

2.  **Initialize npm:**
    ```bash
    npm init -y
    ```
    The `-y` flag accepts all the default options, creating a `package.json` file for you.

## 4. Step 2: Installing Dependencies

We'll need TypeScript and Playwright as our primary dependencies.

```bash
npm install --save-dev typescript @playwright/test
```

-   `--save-dev`: This flag installs the packages as "development dependencies," which is appropriate for testing tools.

After this command, you'll see a `node_modules` directory and a `package-lock.json` file. You should never commit the `node_modules` directory to version control.

## 5. Step 3: Configuring TypeScript

TypeScript needs a `tsconfig.json` file to know how to compile your `.ts` files into JavaScript.

1.  **Create the `tsconfig.json` file:**
    You can create this file manually or by running:
    ```bash
    npx tsc --init
    ```

2.  **Recommended `tsconfig.json` for Playwright:**
    Replace the generated content with the following configuration, which is optimized for a Playwright project:

    ```json
    {
      "compilerOptions": {
        "target": "es2021",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist"
      },
      "include": ["src/**/*.ts", "tests/**/*.ts"]
    }
    ```

    -   **`target`**: Specifies the JavaScript version to compile to.
    -   **`module`**: Uses the standard Node.js module system.
    -   **`strict`**: Enables all strict type-checking options.
    -   **`outDir`**: Specifies where to output the compiled JavaScript.

## 6. Step 4: Creating the Project Structure

A well-organized project is easier to navigate and maintain. Here is a recommended structure for our framework:

```
my-e2e-project/
├── node_modules/
├── src/
│   ├── pages/
│   │   └── base.page.ts
│   └── utils/
│       └── logger.ts
├── tests/
│   └── example.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

-   **`src/`**: This directory will contain our framework's source code, such as page objects and utility functions.
-   **`src/pages/`**: For our Page Object Model (POM) files.
-   **`src/utils/`**: For helper functions, like logging or data generation.
-   **`tests/`**: This is where our actual Playwright test files (`.spec.ts`) will live.
-   **`.gitignore`**: A crucial file that tells Git which files to ignore (e.g., `node_modules`, `dist`).

## 7. Career Development: The Importance of a Clean Setup

In a professional environment, you're often judged by the quality and organization of your code.

-   **First Impressions:** A clean, well-structured project demonstrates professionalism and attention to detail.
-   **Collaboration:** A logical structure makes it easier for other team members to understand and contribute to your framework.
-   **Scalability:** A good structure allows the framework to grow without becoming a tangled mess.

Taking the time to set up your project correctly is an investment that pays off in the long run.

## 8. Next Steps

Now that our project environment is set up, we're ready to start building the foundation of our test framework. In the next lesson, we'll dive into the Page Object Model and create our first page object.