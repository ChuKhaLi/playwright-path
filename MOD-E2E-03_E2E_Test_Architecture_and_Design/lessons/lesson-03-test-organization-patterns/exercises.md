# Exercises: Test Organization Patterns

## Exercise 1: Organize Tests by Feature

**Objective:** Reorganize a flat list of test files into a feature-based directory structure.

**Instructions:**
1. You have the following test files in the `tests/` directory:
   - `login.spec.ts`
   - `logout.spec.ts`
   - `add-to-cart.spec.ts`
   - `remove-from-cart.spec.ts`
   - `view-profile.spec.ts`
   - `edit-profile.spec.ts`
2. Create a directory structure that organizes these files by feature (`auth`, `cart`, `profile`).
3. Move the files into the appropriate directories.

## Exercise 2: Implement Test Tagging

**Objective:** Add tags to your tests to create logical groupings.

**Instructions:**
1. Using the test files from Exercise 1, add the following tags:
   - `@smoke` to `login.spec.ts` and `add-to-cart.spec.ts`.
   - `@regression` to all test files.
   - `@profile` to `view-profile.spec.ts` and `edit-profile.spec.ts`.
2. Write the command to run only the smoke tests.
3. Write the command to run only the profile tests.

## Exercise 3: Discussion

**Objective:** Think critically about test organization.

**Instructions:**
- Discuss with your team or mentor the pros and cons of organizing tests by feature vs. by page/component for your current project.
- Decide on a consistent tagging strategy for your team. Document it in your project's `README.md`.