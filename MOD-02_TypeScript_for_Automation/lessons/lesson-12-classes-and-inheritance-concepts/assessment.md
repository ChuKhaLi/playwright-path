# Lesson 7 Assessment: Classes and Inheritance Concepts

## Multiple Choice Questions

1.  **In Object-Oriented Programming, what is a `class`?**
    a)  An actual object that exists in memory.
    b)  A blueprint or template for creating objects.
    c)  A function that belongs to an object.
    d)  A variable that belongs to an object.

2.  **What is the name of the special method that is called when you create a new instance of a class?**
    a)  `init()`
    b)  `start()`
    c)  `constructor()`
    d)  `new()`

3.  **What keyword is used to create an instance of a class?**
    a)  `create`
    b)  `instance`
    c)  `new`
    d)  `build`

4.  **In the context of inheritance, what does the `super()` keyword do inside a child class's constructor?**
    a)  It calls a method from the child class.
    b)  It calls the constructor of the parent class.
    c)  It creates a new instance of the parent class.
    d)  It deletes the parent class.

5.  **Which keyword is used to make one class inherit from another?**
    a)  `inherits`
    b)  `implements`
    c)  `extends`
    d)  `uses`

## Practical Exercise

This exercise simulates the creation of base and specialized page objects, a core concept in the Page Object Model (POM).

1.  **Create a Base Page Class:**
    -   Create a `class` named `BasePage`.
    -   It should have one property: `pageTitle` of type `string`.
    -   Its `constructor` should accept one argument, `title` (a `string`), and assign it to the `pageTitle` property.
    -   It should have one method named `getPageTitle()` that takes no arguments and returns the value of the `pageTitle` property.

2.  **Create a Specialized Page Class:**
    -   Create a new `class` named `LoginPage` that **inherits** from `BasePage`.
    -   The `LoginPage` class should have two new properties: `usernameInputLocator` (a `string`) and `passwordInputLocator` (a `string`).
    -   The `constructor` for `LoginPage` should:
        -   Call the parent constructor with a fixed title: `"Login Page"`.
        -   Initialize `usernameInputLocator` to `"#username"` and `passwordInputLocator` to `"#password"`.
    -   The `LoginPage` class should have a new method named `login()` that takes no arguments and returns `void`. Inside this method, simply log a message like `"Logging in using #username and #password locators."`.

3.  **Instantiate and Use the Classes:**
    -   Create an instance of the `LoginPage` class and store it in a `const` named `myLoginPage`.
    -   Call the `getPageTitle()` method on `myLoginPage` and log the result. (Note: This method is inherited from `BasePage`).
    -   Call the `login()` method on `myLoginPage`.
    -   Log the `usernameInputLocator` property of `myLoginPage` to the console.

## Answer Key

### Multiple Choice
1.  b) A blueprint or template for creating objects.
2.  c) `constructor()`
3.  c) `new`
4.  b) It calls the constructor of the parent class.
5.  c) `extends`

### Practical Exercise (Example Solution)
```typescript
// 1. Create a Base Page Class
class BasePage {
  pageTitle: string;

  constructor(title: string) {
    this.pageTitle = title;
  }

  getPageTitle(): string {
    return this.pageTitle;
  }
}

// 2. Create a Specialized Page Class
class LoginPage extends BasePage {
  usernameInputLocator: string;
  passwordInputLocator: string;

  constructor() {
    // Call the parent constructor with a fixed title
    super("Login Page");
    
    // Initialize its own properties
    this.usernameInputLocator = "#username";
    this.passwordInputLocator = "#password";
  }

  login(): void {
    console.log(`Logging in using ${this.usernameInputLocator} and ${this.passwordInputLocator} locators.`);
  }
}

// 3. Instantiate and Use the Classes
const myLoginPage = new LoginPage();

// Call inherited method
const title = myLoginPage.getPageTitle();
console.log(`The page title is: ${title}`);

// Call its own method
myLoginPage.login();

// Access its own property
console.log(`The username locator is: ${myLoginPage.usernameInputLocator}`);

// Expected Output:
// The page title is: Login Page
// Logging in using #username and #password locators.
// The username locator is: #username