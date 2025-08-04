# Lesson 1: Playwright Installation and Project Setup

## Learning Objectives
After completing this lesson, you will be able to:
- Install Node.js and npm, the prerequisites for Playwright.
- Initialize a new Node.js project.
- Install Playwright and its browser dependencies.
- Understand the structure of a new Playwright project.
- Configure the `playwright.config.ts` file for basic use.

---

## 1. Introduction to Your E2E Testing Journey

Welcome to the world of end-to-end (E2E) testing with Playwright! In MOD-01, you learned the fundamentals of QA, and in MOD-02, you gained the TypeScript skills necessary for modern web development and testing. Now, it's time to combine that knowledge and build your first automated tests.

E2E testing is a methodology used to test whether the flow of an application is performing as designed from start to finish. The purpose of carrying out E2E tests is to identify system dependencies and to ensure that the right information is passed between various system components and systems.

Playwright is a modern, powerful, and reliable framework for E2E testing that is developed and maintained by Microsoft. It allows you to automate tests across all modern browsers, including Chromium (Chrome, Edge), Firefox, and WebKit (Safari).

## 2. Prerequisites: Installing Node.js and npm

Playwright is a Node.js library, so the first step is to ensure you have Node.js and its package manager, npm, installed on your Windows machine.

### Step-by-Step Installation:
1.  **Download Node.js:** Go to the official [Node.js website](https://nodejs.org/). Download the LTS (Long-Term Support) version, which is recommended for most users.
2.  **Run the Installer:** Open the downloaded `.msi` file and follow the installation wizard. Use the default settings. The installer will automatically add Node.js and npm to your system's PATH.
3.  **Verify the Installation:** To confirm that Node.js and npm are installed correctly, open a new PowerShell or Command Prompt terminal and run the following commands:

    ```powershell
    node -v
    npm -v
    ```

    You should see the version numbers for both Node.js and npm printed to the console.

## 3. Initializing Your Playwright Project

With the prerequisites installed, you can now create a new project for your Playwright tests.

### Step-by-Step Project Initialization:
1.  **Create a Project Directory:** Create a new folder for your project. You can do this through the File Explorer or by using the command line.

    ```powershell
    mkdir my-playwright-project
    cd my-playwright-project
    ```

2.  **Initialize a Node.js Project:** Inside your new project directory, run the following command to create a `package.json` file. This file will track your project's dependencies, including Playwright.

    ```powershell
    npm init -y
    ```
    The `-y` flag automatically accepts all the default options.

3.  **Install Playwright:** Now, use the Playwright `init` command. This is the easiest way to get started. It will install Playwright, create a basic project structure, and download the necessary browser binaries.

    ```powershell
    npm init playwright@latest
    ```

    The installer will ask you a few questions:
    - **Choose between TypeScript or JavaScript:** Select **TypeScript**.
    - **Name of your tests folder:** Press Enter to accept the default (`tests`).
    - **Add a GitHub Actions workflow:** Press Enter to accept the default (`true`). This will create a basic CI/CD configuration file.
    - **Install Playwright browsers:** Press Enter to accept the default (`true`). This is crucial.

    The installer will then create the necessary files and download the browsers.

## 4. Understanding the Project Structure

After the installation is complete, your project directory will look like this:

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

- **`node_modules/`**: This directory contains all your project's dependencies, including Playwright itself.
- **`package.json`**: Your project's manifest file, which lists dependencies and scripts.
- **`package-lock.json`**: Records the exact versions of your dependencies.
- **`playwright.config.ts`**: The main configuration file for Playwright. You'll learn more about this file below.
- **`tests/`**: This is where you will write your test files. It comes with an `example.spec.ts` to get you started.
- **`tests-examples/`**: Contains more detailed examples, including a test for a demo to-do app.

## 5. Exploring the `playwright.config.ts` File

The [`playwright.config.ts`](playwright.config.ts) file is the heart of your Playwright project's configuration. Let's look at some of the key properties:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
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

- **`testDir`**: Specifies the directory where Playwright will look for test files.
- **`fullyParallel`**: A boolean that, when `true`, allows test files to run in parallel to speed up execution.
- **`reporter`**: Configures the test reporter. The default `html` reporter generates a beautiful, interactive report of your test run.
- **`use`**: An object for global test settings. For example, `trace: 'on-first-retry'` will generate a trace file for failed tests, which is incredibly useful for debugging.
- **`projects`**: An array that defines the browsers and devices you want to test against. By default, it's configured to run your tests on Chrome, Firefox, and Safari.

---

## Summary

In this lesson, you successfully set up your environment for Playwright testing. You installed Node.js and npm, initialized a new Playwright project, and explored the default project structure and configuration. You are now ready to write your first E2E test!