# Project: E-Commerce BDD Testing Framework

This project is a comprehensive BDD test automation framework for a fictional e-commerce website. It is built using Playwright, TypeScript, and Cucumber.

## Features to Test

- User Registration
- User Login
- Product Search
- Add to Cart
- Checkout Process

## Project Structure

- `features/`: Contains the Gherkin feature files.
- `src/`:
  - `pages/`: Contains the Page Objects.
  - `step-definitions/`: Contains the step definition files.
  - `support/`: Contains hooks, world context, and reporter configuration.
  - `data/`: Contains test data files.
- `reports/`: Contains the generated test reports.
- `package.json`: Project dependencies and scripts.
- `cucumber.js`: Cucumber configuration file.
- `tsconfig.json`: TypeScript configuration file.