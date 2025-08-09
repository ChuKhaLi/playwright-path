# Exercises: Test Configuration

## Exercise 1: Create a Development Project

**Objective:** Create a dedicated project in your `playwright.config.ts` for local development.

**Instructions:**
1. Open your `playwright.config.ts` file.
2. Create a new project named `development`.
3. This project should:
   - Run on desktop Chrome.
   - Use a `baseURL` of `http://localhost:4200`.
   - Run in headed mode (`headless: false`).
   - Automatically open the trace viewer on failure (`trace: 'retain-on-failure'`).

## Exercise 2: Create a CI Project

**Objective:** Create a project optimized for running in a CI/CD environment.

**Instructions:**
1. Create a new project named `ci`.
2. This project should:
   - Run on all three browsers (Chromium, Firefox, WebKit).
   - Run in headless mode.
   - Have 2 retries for failed tests.
   - Use a `baseURL` from an environment variable called `STAGING_URL`.

## Exercise 3: Use Environment Variables

**Objective:** Use `dotenv` to manage environment variables.

**Instructions:**
1. Install the `dotenv` package.
2. Create a `.env` file in the root of your project.
3. In the `.env` file, define `STAGING_URL=https://my-staging-app.com`.
4. Update your `playwright.config.ts` to load the `.env` file and use the `STAGING_URL` in your `ci` project.