# Your First Day: Let's Build a Robot! 🤖

Welcome to Day 1! This is where the magic begins. Today, you'll give your very first instruction to a testing robot and see it come to life. It's going to be awesome.

If you haven't already, please read our [Welcome Guide](./welcome.md) and the [Before You Begin](./before-you-begin.md) guide.

**Your Goal for Today:** By the end of this guide, you will have set up your project and run a simple automated test on a real website.

## Our Tools of the Trade (Explained Simply)

Before we start, let's meet our tools. No need to memorize these, we'll introduce them as we go.

*   **Visual Studio Code (VS Code):** Think of this as your workshop or kitchen. It's a special text editor where you'll write the instructions (code) for your robot.
*   **The Terminal:** This is a command window inside VS Code. It looks like a black box where you type text commands. It's like a magic wand; you type a command, press Enter, and things happen!
*   **Playwright:** This is the special instruction book our robot understands. It contains all the commands for browsing websites, like "go to this web page," "click this button," or "check for this text."

*(Note: This guide assumes you have already installed Node.js and Visual Studio Code, which are the power source and workshop for our robot.)*

---

## Step 1: Set Up Your Workshop

Let's get our project folder ready.

1.  **Open VS Code.**
2.  At the top menu, click **Terminal > New Terminal**. A little window should pop up at the bottom of your screen. This is your command center!
3.  In the terminal, type the following command and press **Enter**. This command creates a new directory (folder) for our project.

    ```powershell
    mkdir my-first-project
    ```

    *(**Note for Windows Users:** This command works in both PowerShell (the default) and Command Prompt. No changes are needed!)*

4.  Now, let's move into that new folder. Type this command and press **Enter**:

    ```powershell
    cd my-first-project
    ```

    Your terminal prompt should now show `my-first-project`, which means you are inside your project folder.

## Step 2: Awaken the Robot with Playwright

Now we'll use a special command to install the Playwright instruction book into our project.

1.  In the terminal, type (or copy and paste) the following command and press **Enter**:

    ```powershell
    npm init playwright@latest
    ```

2.  Playwright will ask you a few questions. Just press **Enter** for each one to accept the defaults. It will look something like this:
    *   `Use TypeScript or JavaScript?` (Choose TypeScript by pressing Enter)
    *   `Where to put your end-to-end tests?` (Press Enter for `tests`)
    *   `Add a GitHub Actions workflow?` (Press Enter for `false`)
    *   `Install Playwright browsers?` (Press Enter for `true`)

    It will now download the necessary parts for our robot. This might take a minute or two.

### ✨ **CELEBRATION MOMENT!** ✨

You just created your very first automation project! Look at the left side of VS Code. You'll see a bunch of new files. You just told the computer to create a whole project structure for you. How cool is that?!

## Step 3: Run Your First Test

Playwright has already created an example test for us. Let's run it!

1.  In your terminal, make sure you are still in the `my-first-project` folder.
2.  Type the following command and press **Enter**:

    ```powershell
    npx playwright test
    ```

You'll see some text flash by, and then... you should see a message with a green checkmark saying `1 passed`.

### 🎉 **VICTORY DANCE!** 🎉

You did it! You just ran your first automated test! A robot, following your command, opened a web browser, performed some steps, and confirmed that everything worked. You are officially an automator!

## Step 4: Give Your Own Instruction

Let's change the test to do something different.

1.  On the left-side file explorer in VS Code, click the `tests` folder, and then click on the `example.spec.ts` file to open it.
2.  Don't be intimidated by the code! We're just making one tiny change.
3.  Find the line that says: `await page.goto('https://playwright.dev/');`
4.  Change the web address inside the quotes to `'https://www.google.com'`. It should now look like this:

    ```typescript
    await page.goto('https://www.google.com');
    ```

5.  Save the file (Ctrl+S or Cmd+S).
6.  Go back to your terminal and run the test command again:

    ```powershell
    npx playwright test
    ```

Again, you should see `1 passed`. This time, the robot visited Google instead!

### 🚀 **YOU ARE A SUPERSTAR!** 🚀

You just modified a script and gave your robot a custom instruction. This is the core of QA automation!

## Troubleshooting: When Things Go Wrong

*   **"Command not found" error?** This usually means Node.js isn't installed correctly or you need to restart VS Code after installing it.
*   **Typo in a command?** It happens to everyone! The terminal is very picky. Double-check your spelling and try again.
*   **Test failed (a red `X`)?** Don't worry! This is normal. Playwright creates a report for you. Type `npx playwright show-report` in the terminal to see exactly what went wrong.

## What's Next?

Congratulations on completing your first day! You've taken a huge step.

*   **Explore the Glossary:** Curious about some of the terms like `await` or `test`? Check out our [Comprehensive Glossary](./glossary.md).
*   **Take a Break:** Let this new knowledge sink in. You've earned it!
*   **Move to the Next Lesson:** When you're ready, proceed to the next module where we'll start explaining what all those lines of code actually mean.

You're on your way. We're so proud of you!