# Lesson 16: Development Environment Setup - Hands-On Practice

## Objective

This exercise will guide you through the essential steps of setting up a local development environment for QA automation with Playwright. The goal is to ensure you have all the necessary tools installed and can run a basic test script.

## Setup

This entire exercise is the setup! Follow the tasks step-by-step. You will need a computer with internet access and administrative privileges to install software.

---

## Task 1: Install a Code Editor (Visual Studio Code)

If you don't already have it, a good code editor is essential. We highly recommend Visual Studio Code (VS Code).

1.  **Download:** Go to the official VS Code website: [https://code.visualstudio.com/](https://code.visualstudio.com/)
2.  **Install:** Download the installer for your operating system (Windows, Mac, or Linux) and run it. Accept the default settings.
3.  **Verify:** Open VS Code. You should see a welcome screen.

---

## Task 2: Install Node.js and npm

Playwright is a Node.js library, so you need to install Node.js, which includes npm (Node Package Manager).

1.  **Download:** Go to the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
2.  **Choose LTS:** Download the **LTS (Long-Term Support)** version. This is the most stable version recommended for most users.
3.  **Install:** Run the installer, accepting the default options.
4.  **Verify Installation:**
    -   Open a new terminal or command prompt. (In VS Code, you can go to `Terminal > New Terminal`).
    -   Type the following command and press Enter:
        ```bash
        node -v
        ```
        This should print a version number (e.g., `v18.17.1`).
    -   Type the next command and press Enter:
        ```bash
        npm -v
        ```
        This should also print a version number (e.g., `9.6.7`).

---

## Task 3: Initialize a New Project and Install Playwright

Now we'll create a project folder and install Playwright into it.

1.  **Create a Project Folder:**
    -   On your computer, create a new folder for your project. Name it something like `my-playwright-project`.
2.  **Open the Folder in VS Code:**
    -   In VS Code, go to `File > Open Folder...` and select the folder you just created.
3.  **Initialize a Node.js Project:**
    -   Open the terminal in VS Code (`Terminal > New Terminal`).
    -   Type the following command and press Enter. This creates a `package.json` file, which will manage your project's dependencies.
        ```bash
        npm init -y
        ```
4.  **Install Playwright:**
    -   In the same terminal, run the official Playwright installation command. This will install Playwright and the browsers it needs (Chromium, Firefox, WebKit).
        ```bash
        npm init playwright@latest
        ```
    -   The installer will ask you a few questions. For this exercise, you can accept the defaults by pressing Enter for each question. It will create a sample project structure for you.

---

## Task 4: Run the Example Test

Playwright's installer creates an example test to help you verify that everything is working.

1.  **Find the Example Test:**
    -   In the VS Code file explorer on the left, look inside the `tests` folder. You should see a file named `example.spec.ts`.
2.  **Run the Test:**
    -   In the VS Code terminal, type the following command and press Enter:
        ```bash
        npx playwright test
        ```
3.  **Analyze the Output:**
    -   You should see output indicating that the tests are running.
    -   At the end, you should see a message indicating that the tests passed. It will also tell you that you can run `npx playwright show-report` to see a detailed HTML report.
4.  **View the Report (Optional but Recommended):**
    -   Run the following command in the terminal:
        ```bash
        npx playwright show-report
        ```
    -   This will open a new tab in your browser showing a beautiful report of the test run.

## Congratulations!

If you have successfully run the example test, you have a fully functional development environment for QA automation with Playwright. You are now ready to start writing your own tests.