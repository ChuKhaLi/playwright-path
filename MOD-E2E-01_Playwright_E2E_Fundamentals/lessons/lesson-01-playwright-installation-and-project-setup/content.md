# Lesson 1: Playwright Installation and Project Setup

## 🎯 Learning Objectives
After completing this lesson, you will be able to:
- Verify Node.js and npm are installed correctly.
- Initialize a new Node.js project for automation.
- Install Playwright and its browser dependencies using the recommended interactive setup.
- Understand the structure of a new Playwright project.
- Identify the key settings in the `playwright.config.ts` file.

---

## 1. Introduction to Your E2E Testing Journey

Welcome to the world of end-to-end (E2E) testing with Playwright! E2E testing is a methodology used to test whether the flow of an application is performing as designed from start to finish.

Playwright is a modern, powerful, and reliable framework for E2E testing developed by Microsoft. It allows you to automate tests across all modern browsers: Chromium (Chrome, Edge), Firefox, and WebKit (Safari).

## 2. Prerequisites: Verifying Your Environment

Playwright is a Node.js library, so the first step is to ensure you have Node.js and its package manager, npm, installed.

### Step-by-Step Verification:
1.  **Open PowerShell:** Open a new PowerShell or Command Prompt terminal.
2.  **Check Versions:** Run the following commands to check the installed versions of Node.js and npm.

    ```powershell
    # Check Node.js version (should be 18+ for latest Playwright versions)
    node -v

    # Check npm version
    npm -v
    ```
    You should see version numbers printed to the console (e.g., `v18.17.0` or higher for Node). If not, please visit the official [Node.js website](https://nodejs.org/) and install the LTS version.

## 3. Initializing Your Playwright Project

With the prerequisites verified, you can now create a new project for your Playwright tests.

### Step-by-Step Project Initialization:
1.  **Create a Project Directory:** In your terminal, create a new folder for your project and navigate into it.

    ```powershell
    mkdir my-playwright-project
    cd my-playwright-project
    ```

2.  **Initialize Playwright:** The easiest way to get started is to use the official `init` command. This command will ask you a few questions to scaffold a new project, install Playwright, and download the necessary browser binaries.

    ```powershell
    npm init playwright@latest
    ```

3.  **Follow the Interactive Prompts:** The installer will guide you through the setup. We recommend the following choices for this course:

    ```
    ? Do you want to use TypeScript or JavaScript? › TypeScript
    ? Where to put your end-to-end tests? › tests
    ? Add a GitHub Actions workflow? › true
    ? Install Playwright browsers (can be done manually via 'npx playwright install')? › true
    ```

    The installer will now create the project files and download the browsers. This might take a few minutes.

## 4. Understanding the Project Structure

After the installation is complete, your project directory will contain several new files and folders:

```
my-playwright-project/
├── node_modules/
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tests/
│   └── example.spec.ts
└── tests-examples/
    └── demo-todo-app.spec.ts
```

- **`node_modules/`**: Contains all your project's dependencies, including Playwright.
- **`package.json`**: Your project's manifest file, listing dependencies and scripts.
- **`playwright.config.ts`**: The main configuration file for Playwright.
- **`tests/`**: The primary folder where you will write your test files (`.spec.ts`).
- **`tests-examples/`**: Contains more detailed examples provided by Playwright.

## 5. Exploring the `playwright.config.ts` File

The [`playwright.config.ts`](playwright.config.ts:1) file is the heart of your project's configuration. Let's look at the most important default settings:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directory where Playwright looks for test files.
  testDir: './tests',

  // Run test files in parallel to speed up execution.
  fullyParallel: true,

  // Reporter for test results. 'html' generates an interactive report.
  reporter: 'html',

  // Global settings for all tests.
  use: {
    // Creates a trace file for debugging failed tests.
    trace: 'on-first-retry',
  },

  // Defines the browsers and devices to test against.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## Summary

In this lesson, you successfully set up your environment for Playwright testing. You verified your Node.js installation, initialized a new Playwright project, and explored the default project structure and configuration. You are now ready to write your first E2E test!