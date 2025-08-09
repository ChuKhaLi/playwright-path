# Exercises: Fixture Management

## Exercise 1: Create a Page Object Fixture

**Objective:** Create a fixture that provides an instance of a page object.

**Instructions:**
1. You have a `HomePage` page object class.
2. Create a custom fixture called `homePage`.
3. This fixture should instantiate the `HomePage` and provide it to the test.
4. Write a test that uses the `homePage` fixture to interact with the home page.

## Exercise 2: Create a Data Fixture

**Objective:** Create a fixture that provides test data.

**Instructions:**
1. Create a fixture called `userData`.
2. This fixture should read user data from a JSON file (`test-data/users.json`).
3. The fixture should return a user object with `username` and `password` properties.
4. Write a test that uses the `userData` fixture to perform a login.

## Exercise 3: Chain Fixtures

**Objective:** Create a fixture that depends on another custom fixture.

**Instructions:**
1. You have the `authenticatedPage` fixture from the lesson.
2. You also have a `cartPage` fixture that provides an instance of the `CartPage` object.
3. Create a new fixture called `cartWithItems`.
4. This fixture should depend on both `authenticatedPage` and `cartPage`.
5. It should use the API to add items to the user's cart.
6. It should then return the `cartPage` instance.
7. Write a test that uses the `cartWithItems` fixture to verify the items in the cart.