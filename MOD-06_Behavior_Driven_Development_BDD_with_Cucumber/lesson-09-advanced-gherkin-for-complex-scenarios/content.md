# Lesson 9: Advanced Gherkin for Complex Scenarios

## 1. Introduction

Welcome to Lesson 9! While the basic Gherkin syntax (`Given`, `When`, `Then`) is powerful, some test scenarios require more complex structures. In this lesson, we'll explore advanced Gherkin features that allow you to handle a wider range of testing challenges.

We'll cover `Scenario Outlines`, `Data Tables`, and `Doc Strings` to make your feature files more expressive and powerful.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

- Use `Scenario Outlines` to run the same scenario with multiple data sets.
- Pass `Data Tables` from feature files to step definitions.
- Use `Doc Strings` to pass large blocks of text to step definitions.
- Understand when to use each of these advanced features.
- Write more concise and data-driven feature files.

## 3. Scenario Outlines

`Scenario Outlines` are a way to run the same scenario multiple times with different data. They are a great way to reduce duplication in your feature files.

A `Scenario Outline` uses placeholders in the scenario steps, which are then filled in by the values from an `Examples` table.

### Example:

```gherkin
Feature: User login

  Scenario Outline: User logs in with valid and invalid credentials
    Given I am on the login page
    When I enter username "<username>" and password "<password>"
    Then I should see the "<outcome>"
    
    Examples:
      | username        | password         | outcome                 |
      | standard_user   | secret_sauce     | Products page           |
      | locked_out_user | secret_sauce     | locked out error message|
      | problem_user    | secret_sauce     | Products page           |
      | invalid_user    | invalid_password | invalid credentials error|
```

In your step definitions, you'll receive the values from the `Examples` table as arguments.

```typescript
// Note: The step definition is the same as for a regular scenario
When("I enter username {string} and password {string}", async function (username, password) {
  await this.loginPage.login(username, password);
});
```

## 4. Data Tables

`Data Tables` are a way to pass a list of records from a feature file to a step definition. They are useful when you need to work with a collection of data, such as a list of products to add to a shopping cart.

### Example:

```gherkin
Scenario: Add multiple items to the cart
  Given I am on the products page
  When I add the following items to the cart:
    | Item Name              |
    | Sauce Labs Backpack    |
    | Sauce Labs Bike Light  |
    | Sauce Labs Bolt T-Shirt|
  Then the cart should contain 3 items
```

In your step definition, you can access the `Data Table` using the `dataTable` method.

```typescript
When("I add the following items to the cart:", async function (dataTable) {
  const items = dataTable.raw();
  for (const item of items) {
    await this.productsPage.addItemToCart(item[0]);
  }
});
```

## 5. Doc Strings

`Doc Strings` are used to pass a larger piece of text to a step definition. They are enclosed in triple quotes (`"""`). This is useful for things like passing an email body, a JSON payload, or a block of code.

### Example:

```gherkin
Scenario: Submitting a feedback form
  Given I am on the feedback page
  When I enter the following message:
    """
    Hello,

    I am writing to report a bug I found on your website.
    When I click the 'Submit' button, nothing happens.

    Please investigate.

    Thanks,
    A. User
    """
  And I click the "Submit" button
  Then I should see a "Thank you for your feedback" message
```

The `Doc String` is passed as the last argument to your step definition.

```typescript
When("I enter the following message:", async function (message) {
  await this.feedbackPage.enterMessage(message);
});
```

## 6. Conclusion

Advanced Gherkin features like `Scenario Outlines`, `Data Tables`, and `Doc Strings` allow you to create more powerful, flexible, and maintainable feature files. By using these features, you can handle a wide variety of complex testing scenarios with ease.

This lesson concludes our module on BDD with Cucumber. You now have a solid foundation for building robust and scalable BDD test automation frameworks.