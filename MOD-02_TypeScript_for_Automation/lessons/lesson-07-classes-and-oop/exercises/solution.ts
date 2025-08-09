/**
 * Solution: Classes and Object-Oriented Programming
 *
 * This file contains the solution to the 'Classes and OOP' exercise.
 */

// 1. The 'BasePage' class serves as a blueprint for all other pages.
//    - The 'url' property is 'protected', meaning it's accessible within this class
//      and any class that extends it, but not from outside.
//    - This promotes code reuse, as the 'navigate' logic is defined only once.
class BasePage {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  public navigate(): void {
    console.log(`Navigating to ${this.url}`);
  }
}

// 2. 'LoginPage' extends 'BasePage', inheriting its properties and methods.
//    - 'super(url)' calls the constructor of the parent class ('BasePage').
//    - It adds its own specific properties and methods related to the login form.
class LoginPage extends BasePage {
  public usernameInput: string = "#username";
  public passwordInput: string = "#password";

  constructor() {
    super("/login");
  }

  public login(username: string, password: string): void {
    console.log(`Logging in with user: ${username}`);
    // In a real test, you would use Playwright to fill the inputs:
    // await page.fill(this.usernameInput, username);
    // await page.fill(this.passwordInput, password);
  }
}

// 3. 'DashboardPage' also extends 'BasePage', demonstrating how multiple pages
//    can share the same base functionality.
class DashboardPage extends BasePage {
  public welcomeMessage: string = ".welcome-message";

  constructor() {
    super("/dashboard");
  }

  public getWelcomeMessage(): string {
    console.log("Fetching welcome message...");
    // In a real test, this would get the text from the page:
    // return await page.textContent(this.welcomeMessage);
    return "Welcome, Admin!";
  }
}

// 4. Instantiate and use the classes to simulate a test flow.
console.log("--- Starting Login Test Flow ---");

// Create an instance of LoginPage.
const loginPage = new LoginPage();

// Call the inherited 'navigate' method.
loginPage.navigate();

// Call the 'login' method specific to LoginPage.
loginPage.login("admin", "password123");

console.log("\n--- Starting Dashboard Verification ---");

// Create an instance of DashboardPage.
const dashboardPage = new DashboardPage();

// Call the inherited 'navigate' method.
dashboardPage.navigate();

// Call the method specific to DashboardPage and log the result.
const message = dashboardPage.getWelcomeMessage();
console.log(`Verification Passed: ${message}`);