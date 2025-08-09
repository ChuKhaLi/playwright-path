# Lesson 1: Playwright Basics & Installation

## 1. Welcome to E2E Testing with Playwright!

Welcome to the world of End-to-End (E2E) testing! In this module, we'll learn how to automate web application testing using Playwright, a powerful and modern tool built by Microsoft.

### What is E2E Testing?

Think of E2E testing as simulating a real user's journey through an application. We're not just checking if a single button works; we're testing the entire workflow from start to finish. For example, an E2E test for an e-commerce site might involve:

1.  Searching for a product.
2.  Adding it to the cart.
3.  Proceeding to checkout.
4.  Filling in shipping details.
5.  Completing the purchase.

This ensures that all parts of the application work together correctly.

### Why Playwright?

Playwright is a fantastic choice for E2E testing because it's:

-   **Fast and Reliable:** It's built to handle modern web applications and is known for its speed and stability.
-   **Cross-Browser:** Write one test and run it on all major browsers (Chrome, Firefox, Safari/WebKit).
-   **Powerful:** It can handle complex scenarios, including file uploads, authentication, and more.
-   **Great for Beginners:** It has excellent documentation and a supportive community.

## 2. Setting Up Your Environment

Before we can write our first test, we need to set up our development environment.

### Prerequisites

-   **Node.js:** Playwright is a Node.js library, so you'll need to have it installed. You can download it from [nodejs.org](https://nodejs.org/). We recommend the LTS (Long-Term Support) version.
-   **A Code Editor:** We recommend using [Visual Studio Code](https://code.visualstudio.com/), which has great support for TypeScript and Playwright.

### Installation

1.  **Create a Project Directory:** Open your terminal and create a new directory for your project.
    ```bash
    mkdir my-playwright-project
    cd my-playwright-project
    ```

2.  **Initialize a Node.js Project:** This will create a `package.json` file, which will manage your project's dependencies.
    ```bash
    npm init -y
    ```

3.  **Install Playwright:** Now, we'll install Playwright. This command will download Playwright and the browsers it needs.
    ```bash
    npm init playwright@latest
    ```
    The installer will ask you a few questions. For now, you can accept the defaults.

## 3. Your First Playwright Project

After the installation, you'll see a few new files and directories:

-   `playwright.config.ts`: This is where you'll configure Playwright's behavior.
-   `tests/`: This directory will contain your test files.
-   `tests-examples/`: This directory contains some example tests to get you started.

We're all set! In the next lesson, we'll write our very first Playwright script.