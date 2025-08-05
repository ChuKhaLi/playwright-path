# Lesson 1: Assessment - Playwright Installation and Setup

## 🎯 Assessment Overview
This assessment evaluates your understanding of Playwright installation, setup, and basic configuration.

---

## 📚 Part A: Knowledge Check

### Question 1
What is the primary command to initialize a new Playwright project with an interactive setup?
a) `npm install playwright`
b) `npm init playwright@latest`
c) `npx playwright install`
d) `npm start playwright`

**Answer:** b) `npm init playwright@latest` is the command that scaffolds a new project, creates configuration files, and installs Playwright.

---

### Question 2
Which file is the main configuration hub for a Playwright project?
a) `package.json`
b) `playwright.config.ts`
c) `example.spec.ts`
d) `project.config.js`

**Answer:** b) `playwright.config.ts` is where you configure browsers, reporters, test directories, and other core settings.

---

### Question 3
What does the `projects` array in `playwright.config.ts` define?
a) A list of your test files.
b) The browsers and devices to test against.
c) The reporters to use for test results.
d) The dependencies for the project.

**Answer:** b) The `projects` array is used to configure different test environments, such as Chrome, Firefox, and mobile viewports.

---

## 🛠️ Part B: Practical Implementation

### Task: Set Up a Project and Modify Configuration

1.  Create a new directory on your computer named `my-first-e2e-project`.
2.  Navigate into this new directory using your terminal.
3.  Initialize a new Playwright project using the interactive initializer (`npm init playwright@latest`).
    - Choose **TypeScript**.
    - Use the default `tests` folder.
    - Add the GitHub Actions workflow.
4.  After the installation, open the `playwright.config.ts` file.
5.  Add a new project configuration to test on a mobile device. Use the `Pixel 5` device descriptor provided by Playwright.

### Expected Outcome
Your `playwright.config.ts` file should be modified to include a new project configuration block for a mobile device. The `projects` array should look similar to this:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ... other settings
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
    // This is the new project you added
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  // ... other settings
});
```

This exercise confirms that you can successfully set up a new project and make basic modifications to the configuration, preparing you for more advanced setups in later lessons.