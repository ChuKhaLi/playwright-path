# Lesson 1: GitHub Actions Fundamentals - Exercises

## Exercise 1: Create Your First Workflow

1. **Create a new repository on GitHub.**
2. **Add a `.github/workflows` directory to your repository.**
3. **Create a new file named `playwright.yml` in the `.github/workflows` directory.**
4. **Copy the example workflow from the lesson into your `playwright.yml` file.**
5. **Commit and push your changes to the `main` branch.**
6. **Go to the "Actions" tab in your GitHub repository to see your workflow run.**

## Exercise 2: Modify the Workflow

1. **Modify the `playwright.yml` file to run on a `pull_request` to the `develop` branch.**
2. **Change the `node-version` to `20`.**
3. **Commit and push your changes to a new branch named `feature/update-workflow`.**
4. **Create a pull request from the `feature/update-workflow` branch to the `develop` branch.**
5. **Go to the "Actions" tab to see your workflow run on the pull request.**