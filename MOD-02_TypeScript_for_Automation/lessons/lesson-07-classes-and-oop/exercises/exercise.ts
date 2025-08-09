/**
 * Exercise: Classes and Object-Oriented Programming
 *
 * This exercise is designed to help you practice with classes, inheritance, and basic OOP
 * principles in TypeScript. Your goal is to create a set of classes that could be used
 * to model a simple Page Object Model (POM) for a web application.
 *
 * Follow the instructions in the comments for each section.
 */

// 1. Base Page Class:
//    - Create a base class named 'BasePage'.
//    - It should have a constructor that accepts a 'url' (string) and stores it in a
//      protected property.
//    - It should have a public method named 'navigate' that logs a message like
//      "Navigating to [URL]".

// Implement 'BasePage' here

// 2. Login Page Class:
//    - Create a class named 'LoginPage' that extends 'BasePage'.
//    - The constructor should call the parent constructor with a specific login URL
//      (e.g., "/login").
//    - It should have public properties for 'usernameInput' (string) and 'passwordInput' (string),
//      representing selectors for the input fields.
//    - It should have a public method named 'login' that accepts 'username' (string) and
//      'password' (string) and logs a message like "Logging in with user: [username]".

// Implement 'LoginPage' here

// 3. Dashboard Page Class:
//    - Create a class named 'DashboardPage' that also extends 'BasePage'.
//    - The constructor should call the parent constructor with a specific dashboard URL
//      (e.g., "/dashboard").
//    - It should have a public property 'welcomeMessage' (string) representing a selector.
//    - It should have a public method 'getWelcomeMessage' that returns a hardcoded string
//      "Welcome, Admin!". In a real test, this would interact with the page.

// Implement 'DashboardPage' here

// 4. Instantiate and Use the Classes:
//    - Create an instance of 'LoginPage'.
//    - Call the 'navigate' method on the login page instance.
//    - Call the 'login' method with some sample credentials.
//    - Create an instance of 'DashboardPage'.
//    - Call the 'navigate' method on the dashboard page instance.
//    - Call the 'getWelcomeMessage' method and log the result.

// Instantiate and use the classes here