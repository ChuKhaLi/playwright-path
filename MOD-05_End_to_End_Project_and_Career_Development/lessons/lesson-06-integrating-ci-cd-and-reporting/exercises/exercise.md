# Exercise: Set Up a CI Workflow with GitHub Actions

## 1. Objective

In this exercise, you will create a GitHub Actions workflow to automatically run your Playwright tests. This will give you hands-on experience with setting up a basic Continuous Integration (CI) pipeline.

## 2. Prerequisites

-   You must have a GitHub account.
-   Your project should be pushed to a GitHub repository. If you haven't done this yet:
    1.  Create a new repository on GitHub.
    2.  In your local project directory, run the following commands:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        git branch -M main
        git remote add origin <YOUR_REPOSITORY_URL>
        git push -u origin main
        ```

## 3. Instructions

### Step 1: Create the Workflow File

1.  In the root of your local project, create the directory structure `.github/workflows/`.
2.  Inside the `workflows` directory, create a new file named `playwright.yml`.

### Step 2: Define the Workflow

1.  Copy the YAML content for the GitHub Actions workflow from the lesson into your `playwright.yml` file.
2.  Read through the file and make sure you understand what each section does.

### Step 3: Configure the HTML Reporter

1.  Open your `playwright.config.ts` file.
2.  Ensure that the `reporter` option is set to `'html'`.
3.  It's also a good idea to add the `trace: 'on-first-retry'` option to the `use` block, as shown in the lesson. This will help you debug failures that only happen in CI.

### Step 4: Commit and Push Your Changes

1.  Add the new workflow file to Git:
    ```bash
    git add .github/workflows/playwright.yml
    git add playwright.config.ts
    ```
2.  Commit the changes:
    ```bash
    git commit -m "feat: Add GitHub Actions workflow for Playwright tests"
    ```
3.  Push the commit to your GitHub repository:
    ```bash
    git push
    ```

### Step 5: Verify the Workflow Run

1.  Go to your repository on GitHub.
2.  Click on the "Actions" tab.
3.  You should see your "Playwright Tests" workflow running or completed.
4.  Click on the workflow run to see the details of the job.
5.  If the job completes successfully, you should see a green checkmark.
6.  Look for the "Artifacts" section on the summary page of the workflow run. You should see a `playwright-report` artifact. Download it, unzip it, and open the `index.html` file to view your test report.

## 4. Career Development Reflection

-   Why is it important that the CI pipeline runs on every `pull_request`? How does this prevent bugs from being merged into the main branch?
-   Imagine a test fails in the CI pipeline but passes on your local machine. What are some of the first things you would check in the workflow logs and the HTML report to debug the issue? (This is a very common interview question!)