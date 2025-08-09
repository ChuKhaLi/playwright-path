# Lesson 10: Hands-on Practice - Architecting Your Framework

## Objective

To apply architectural principles by organizing your existing test code into a well-structured framework.

## Scenario

You will take all the code you've written in the previous lessons (Page Objects, tests, data files, etc.) and refactor it into the recommended folder structure. This is a "cleanup" and organization task that will set the stage for building a truly scalable framework.

## Instructions

This exercise does not involve writing much new code. Instead, it's about moving files and organizing your project.

### Part 1: Create the Folder Structure

1.  **Review the recommended folder structure** from the lesson.
2.  In your project, create the following directories if they don't already exist:
    -   `tests/`
    -   `tests/specs/`
    -   `tests/specs/ui/`
    -   `tests/specs/api/`
    -   `tests/pages/`
    -   `tests/pages/components/`
    -   `tests/utils/`
    -   `tests/data/`
    -   `tests/auth/`

### Part 2: Organize Your Files

Now, move your existing files into their new, correct locations.

1.  **Test Files (`*.spec.ts`):**
    -   Move all your UI-related test files (like `login.spec.ts`, `product.spec.ts`, `iframe.spec.ts`, `windows.spec.ts`) into the `tests/specs/ui/` directory.
    -   Move your API test file (`posts.api.spec.ts`) into the `tests/specs/api/` directory.

2.  **Page Objects (`*.page.ts`):**
    -   Move your `LoginPage`, `ProductPage`, and `CartPage` files into the `tests/pages/` directory.

3.  **Component Objects (`*.component.ts`):**
    -   Move your `HeaderComponent` file into the `tests/pages/components/` directory.

4.  **Authentication Files:**
    -   Move your `global.setup.ts` file into the `tests/auth/` directory.

5.  **Data Files (`*.json`):**
    -   Move your `users.json` and `products.json` files into the `tests/data/` directory.

### Part 3: Update Imports and Configurations

After moving all the files, your imports will be broken. You need to fix them.

1.  **Update `playwright.config.ts`:**
    -   The path to your `globalSetup` file has changed. Update it to point to the new location: `tests/auth/global.setup.ts`.

2.  **Update Imports in Test Files:**
    -   Go through each of your `.spec.ts` files.
    -   Update the import paths for your Page Objects and data files to reflect their new locations.
    -   For example, `import { LoginPage } from '../pages/login-page';` might become `import { LoginPage } from '../../pages/login.page';`. Pay close attention to the relative paths.

3.  **Update Imports in Page Objects:**
    -   Go through your Page Object files.
    -   Update the import paths for any Component Objects they use. For example, in `ProductPage`, the import for `HeaderComponent` will need to be changed.

### Part 4: Run Your Tests

1.  **Run the entire test suite:** `npx playwright test`.
2.  **Verify:** All your tests should still pass. If they don't, it's likely due to an incorrect import path. Read the error messages carefully to debug.

## Bonus Challenge

1.  **Create a `BasePage` class:**
    -   Create a new file `tests/pages/base.page.ts`.
    -   Create a `BasePage` class that takes the `page` object in its constructor.
    -   Have your other Page Objects (`LoginPage`, `ProductPage`) `extend` this `BasePage`. This is the foundation for a core framework layer.
2.  **Create a Utility Function:**
    -   Imagine you often need to generate a random string for your tests.
    -   Create a new file `tests/utils/data-generator.ts`.
    -   Inside, create and export a function `generateRandomString(length: number): string`.
    -   Import and use this function in one of your tests to see it in action.