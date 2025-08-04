# Lesson 6: Development Environment Setup

## Learning Objectives

- Understand what a development environment is and why it's important.
- Install and verify Node.js and npm.
- Install and configure Visual Studio Code (VS Code) as your code editor.
- Install and set up Git for version control.
- Understand the role of the command line (terminal).

---

## 1. What is a Development Environment?

A **development environment** is the collection of tools and processes that a developer or QA engineer uses to write and test software. It's your digital workshop. Just like a carpenter needs a workbench, a saw, and a hammer, you need a code editor, a programming language runtime, and other tools to do your job effectively.

For our journey, our core tools will be:
- **Node.js:** A JavaScript runtime that lets us run JavaScript code outside of a web browser.
- **npm (Node Package Manager):** A tool that comes with Node.js for installing and managing project dependencies (like Playwright).
- **Visual Studio Code (VS Code):** A powerful and popular code editor.
- **Git:** A version control system to track changes in our code.
- **A Command-Line Interface (CLI):** A text-based interface (like PowerShell or Command Prompt) to interact with your computer.

## 2. Introduction to the Command Line

Before we install anything, let's get comfortable with the command line. This is a powerful tool that allows you to interact with your computer by typing commands.

On Windows, you have a few options, but we'll use **PowerShell**.

1.  Press the `Windows Key`.
2.  Type `PowerShell`.
3.  Click on "Windows PowerShell" to open it.

You'll see a window with a text prompt, something like `PS C:\Users\YourName>`. This is where you type commands. We will use this to verify our installations.

## 3. Installing Node.js and npm on Windows

Node.js is the engine that will run our JavaScript-based test scripts. npm is the package manager we'll use to install Playwright and other tools.

1.  **Download the Installer:**
    - Open your web browser and go to the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
    - You will see two versions available. Download the **LTS** version. LTS stands for "Long-Term Support" and is the most stable version.

2.  **Run the Installer:**
    - Once the `.msi` file is downloaded, double-click it to run it.
    - Follow the setup wizard. It's safe to accept the default settings for all steps. The installer will add Node.js and npm to your system's PATH, which allows you to run them from the command line.

3.  **Verify the Installation:**
    - Open a **new** PowerShell window (it's important to open a new one after installing).
    - Type the following command and press Enter:
      ```powershell
      node -v
      ```
      This should print the version number of Node.js, like `v18.17.1`.
    - Now, type this command and press Enter:
      ```powershell
      npm -v
      ```
      This should print the version number of npm, like `9.6.7`.

If both commands show a version number, congratulations! You've successfully installed Node.js and npm.

## 4. Installing Visual Studio Code (VS Code)

VS Code is where we will write all our code. It's a free, powerful, and highly customizable code editor from Microsoft.

1.  **Download VS Code:**
    - Go to the official VS Code website: [https://code.visualstudio.com/](https://code.visualstudio.com/)
    - Click the "Download for Windows" button.

2.  **Run the Installer:**
    - Run the downloaded installer.
    - Accept the license agreement.
    - On the "Select Additional Tasks" screen, make sure to check the boxes for:
      - `Add "Open with Code" action to Windows Explorer file context menu`
      - `Add "Open with Code" action to Windows Explorer directory context menu`
      - `Register Code as an editor for supported file types`
      - `Add to PATH (requires shell restart)`
    - Click "Install" and let it finish.

### Essential VS Code Extensions

Extensions add new features to VS Code. Open VS Code, and on the left-hand side, click the "Extensions" icon (it looks like four squares). Search for and install the following:

- **Playwright Test for VSCode:** This is the official extension from Microsoft that provides syntax highlighting, debugging, and other great features for Playwright.
- **Prettier - Code formatter:** This will automatically format your code to keep it clean and consistent.
- **ESLint:** This tool will analyze your code to find potential problems and enforce coding standards.

## 5. Installing Git for Version Control

Git is a **version control system**. It's like a "save" button for your entire project that lets you track every change you make and revert to previous versions if something goes wrong. It's an essential tool for any developer or tester.

1.  **Download Git:**
    - Go to the official Git website: [https://git-scm.com/downloads](https://git-scm.com/downloads)
    - The download for Windows should start automatically.

2.  **Run the Installer:**
    - Run the downloaded installer.
    - The Git installer has many options. For a beginner, it is safe to accept the default settings for every step. Just keep clicking "Next" until you get to "Install".

3.  **Verify the Installation:**
    - Open a new PowerShell window.
    - Type the following command and press Enter:
      ```powershell
      git --version
      ```
      This should print the version of Git you installed, like `git version 2.41.0.windows.1`.

You now have a complete, professional development environment set up on your computer. You are ready to start writing code!