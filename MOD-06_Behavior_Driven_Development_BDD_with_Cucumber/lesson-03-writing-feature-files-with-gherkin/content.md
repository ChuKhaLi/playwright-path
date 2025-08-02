# Writing Feature Files with Gherkin

## 📖 Introduction

Gherkin is the language that Cucumber uses to define test cases. It's designed to be non-technical and human readable, allowing business stakeholders, developers, and testers to collaborate effectively. This lesson will teach you to write feature files that serve as both specifications and automated tests.

## 🎯 What Makes Good Gherkin?

### The Four Pillars of Effective Feature Files

1. **Business-Focused Language**: Use terms your stakeholders understand
2. **Clear Structure**: Follow consistent patterns and organization
3. **Testable Scenarios**: Write scenarios that can be automated
4. **Living Documentation**: Keep specifications current and valuable

## 📝 Gherkin Fundamentals

### Basic Syntax Overview

```gherkin
Feature: User Authentication
  As a registered user
  I want to log into my account
  So that I can access my personal dashboard

  Background:
    Given the application is running
    And the login page is displayed

  Scenario: Successful login with valid credentials
    Given I am a registered user with email "user@example.com"
    When I enter my valid credentials
    Then I should be logged into my account
    And I should see my personal dashboard

  Scenario: Failed login with invalid password
    Given I am a registered user with email "user@example.com"
    When I enter an incorrect password
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page
```

### Gherkin Keywords Explained

#### **Feature**
- **Purpose**: Describes the feature being tested
- **Structure**: Feature name, narrative (As/I want/So that), scenarios
- **Best Practice**: Keep feature names concise and business-focused

```gherkin
Feature: Shopping Cart Management
  As an online shopper
  I want to manage items in my shopping cart
  So that I can purchase the products I need
```

#### **Scenario**
- **Purpose**: Defines a specific test case
- **Structure**: Scenario name followed by Given-When-Then steps
- **Best Practice**: Use descriptive names that explain the business outcome

```gherkin
Scenario: Adding product to empty cart
Scenario: Removing the last item from cart
Scenario: Applying discount code to cart total
```

#### **Given** - Context/Preconditions
- **Purpose**: Sets up the initial state
- **Examples**: System state, user roles, existing data
- **Best Practice**: Focus on relevant context only

```gherkin
Given I am logged in as a premium user
Given the shopping cart is empty
Given there are 3 products in my cart
Given the system has processed 100 orders today
```

#### **When** - Actions/Events
- **Purpose**: Describes the action being performed
- **Examples**: User interactions, system events, API calls
- **Best Practice**: Use active voice and focus on the trigger

```gherkin
When I click the "Add to Cart" button
When I submit the checkout form
When the payment is processed
When a new order is received
```

#### **Then** - Expected Outcomes
- **Purpose**: Defines expected results and assertions
- **Examples**: UI changes, system responses, data updates
- **Best Practice**: Be specific about expected outcomes

```gherkin
Then I should see "Product added to cart" message
Then the cart total should be "$25.99"
Then I should receive a confirmation email
Then the order status should be "Processing"
```

#### **And/But** - Additional Steps
- **Purpose**: Chain multiple conditions or outcomes
- **Usage**: Improve readability when multiple steps have same context
- **Best Practice**: Use sparingly to maintain clarity

```gherkin
Given I am on the checkout page
And I have items in my cart
And I have selected expedited shipping
When I complete the payment process
Then I should see the order confirmation
And I should receive an order confirmation email
But I should not be charged for standard shipping
```

## 🏗️ Feature File Structure

### Complete Feature File Anatomy

```gherkin
@smoke @user-management
Feature: User Profile Management
  As a registered user
  I want to manage my profile information
  So that I can keep my account details current and accurate

  # This feature covers the core user profile functionality
  # including viewing, editing, and validating profile data

  Background:
    Given the application is running
    And I am logged in as a standard user
    And my profile exists in the system

  @profile-view @happy-path
  Scenario: Viewing complete profile information
    When I navigate to my profile page
    Then I should see my personal information displayed
    And I should see my contact information
    And I should see my account preferences
    And the information should be correctly formatted

  @profile-edit @data-validation
  Scenario: Updating profile with valid information
    Given I am on my profile edit page
    When I update my first name to "John"
    And I update my phone number to "+1-555-123-4567"
    And I save the changes
    Then I should see a success message "Profile updated successfully"
    And my updated information should be displayed
    And the changes should be persisted in the system

  @profile-edit @validation @error-handling
  Scenario: Attempting to save profile with invalid email
    Given I am on my profile edit page
    When I enter an invalid email "not-an-email"
    And I save the changes
    Then I should see an error message "Please enter a valid email address"
    And my profile should not be updated
    And I should remain on the edit page
    And the invalid email field should be highlighted

  @profile-security @password-change
  Scenario: Changing password with proper validation
    Given I am on the profile security page
    When I enter my current password "oldPassword123"
    And I enter a new password "newSecurePass456!"
    And I confirm the new password "newSecurePass456!"
    And I submit the password change form
    Then I should see a success message "Password updated successfully"
    And I should be prompted to log in again
    And my old password should no longer work
```

### Feature File Organization Best Practices

#### **File Naming Conventions**
```
✅ Good Examples:
- user-authentication.feature
- shopping-cart-management.feature
- order-processing-workflow.feature

❌ Poor Examples:
- test1.feature
- loginTests.feature
- UserStuff.feature
```

#### **Directory Structure**
```
features/
├── user-management/
│   ├── authentication.feature
│   ├── profile-management.feature
│   └── user-registration.feature
├── e-commerce/
│   ├── product-catalog.feature
│   ├── shopping-cart.feature
│   └── checkout-process.feature
└── admin/
    ├── user-administration.feature
    └── system-configuration.feature
```

## 📊 Advanced Gherkin Features

### Scenario Outlines - Data-Driven Testing

```gherkin
Feature: User Input Validation
  
  Scenario Outline: Validating user registration form
    Given I am on the registration page
    When I enter "<email>" in the email field
    And I enter "<password>" in the password field
    And I submit the registration form
    Then I should see "<result>"
    And the form should be "<form_state>"

    Examples: Valid Registration Data
      | email              | password        | result                    | form_state |
      | user@example.com   | SecurePass123!  | Registration successful   | submitted  |
      | test@company.org   | MyPassword456@  | Registration successful   | submitted  |
      
    Examples: Invalid Email Formats
      | email              | password        | result                    | form_state |
      | invalid-email      | SecurePass123!  | Invalid email format      | error      |
      | user@             | SecurePass123!  | Invalid email format      | error      |
      | @example.com       | SecurePass123!  | Invalid email format      | error      |
      
    Examples: Weak Passwords
      | email              | password        | result                    | form_state |
      | user@example.com   | 123            | Password too short        | error      |
      | user@example.com   | password       | Password too weak         | error      |
      | user@example.com   |                | Password required         | error      |
```

### Data Tables for Complex Data

```gherkin
Scenario: Creating a comprehensive user profile
  Given I am on the user registration page
  When I fill out the registration form with the following details:
    | Field         | Value                    |
    | First Name    | John                     |
    | Last Name     | Doe                      |
    | Email         | john.doe@example.com     |
    | Phone         | +1-555-123-4567          |
    | Date of Birth | 1990-05-15               |
    | Address       | 123 Main St              |
    | City          | Anytown                  |
    | State         | CA                       |
    | Zip Code      | 12345                    |
    | Country       | United States            |
  And I agree to the terms and conditions
  And I submit the registration form
  Then I should see a confirmation message
  And I should receive a welcome email
  And my profile should be created with all provided information
```

### Doc Strings for Large Text Content

```gherkin
Scenario: Sending a customer support message
  Given I am logged in as a customer
  And I am on the support contact page
  When I select "Technical Issue" as the category
  And I enter the following message:
    """
    I'm experiencing difficulties with the checkout process. 
    
    Steps I've taken:
    1. Added items to cart successfully
    2. Proceeded to checkout
    3. Entered billing information
    4. Selected payment method
    
    Error encountered:
    When I click "Complete Order", the page freezes and I get a 
    "Payment processing failed" error message. This has happened 
    3 times in the last hour.
    
    Browser: Chrome 120.0
    Operating System: Windows 11
    Order total: $156.99
    """
  And I submit the support request
  Then I should see a confirmation message
  And I should receive a support ticket number
  And the support team should receive my detailed message
```

### Background for Shared Setup

```gherkin
Feature: Online Banking Transactions

  Background:
    Given the banking system is operational
    And I am logged in as an account holder
    And my checking account has a balance of $1,000.00
    And my savings account has a balance of $5,000.00
    And there are no pending transactions

  Scenario: Transferring money between own accounts
    When I transfer $200.00 from checking to savings
    Then my checking account balance should be $800.00
    And my savings account balance should be $5,200.00
    And I should see a transaction confirmation

  Scenario: Making a bill payment
    Given I have set up "Electric Company" as a payee
    When I pay $75.50 to "Electric Company" from my checking account
    Then my checking account balance should be $924.50
    And I should see the payment in my transaction history
    And the payee should receive the payment notification
```

## 🎨 Writing Effective Scenarios

### The BRIEF Principle

- **B**usiness language
- **R**eal data
- **I**ntention revealing
- **E**ssential steps only
- **F**ocused on one outcome

#### **Business Language Example**

```gherkin
✅ Good - Business Language:
Scenario: Customer requests refund for defective product
  Given I purchased a defective laptop last week
  When I submit a refund request with proof of defect
  Then I should receive a full refund within 5 business days

❌ Poor - Technical Language:
Scenario: API call returns 200 status
  Given POST request to /api/refunds endpoint
  When JSON payload contains product_id and reason_code
  Then response status should be 200
```

#### **Real Data vs Abstract Data**

```gherkin
✅ Good - Realistic Data:
Scenario: Calculating shipping cost for international order
  Given I have a cart with total value of $150.00
  And I am shipping to "Toronto, Canada"
  When I select "Express International" shipping
  Then the shipping cost should be $25.00
  And the total order amount should be $175.00

❌ Poor - Abstract Data:
Scenario: Calculating shipping cost
  Given I have items in cart
  And I select international shipping
  When I calculate shipping
  Then shipping cost is calculated
```

#### **Intention Revealing Names**

```gherkin
✅ Good - Clear Intention:
Scenario: Premium customer receives priority customer support
Scenario: System prevents duplicate user registration
Scenario: Shopping cart persists across browser sessions

❌ Poor - Vague Names:
Scenario: User test case 1
Scenario: Testing the system
Scenario: Check if it works
```

### Common Anti-Patterns to Avoid

#### **The "UI Test" Anti-Pattern**

```gherkin
❌ Poor - UI Focused:
Scenario: Login functionality
  Given I open the browser
  And I navigate to "https://example.com/login"
  And I see the login form
  When I type "user@example.com" in the email textbox
  And I type "password123" in the password field
  And I click the "Login" button
  Then I should be redirected to "https://example.com/dashboard"

✅ Good - Behavior Focused:
Scenario: User accesses dashboard after successful login
  Given I am a registered user
  When I log in with valid credentials
  Then I should see my personal dashboard
  And I should have access to my account features
```

#### **The "Conjunction" Anti-Pattern**

```gherkin
❌ Poor - Multiple Outcomes:
Scenario: User registration and login and profile update
  Given I am on the registration page
  When I create a new account
  And I log in with my new credentials
  And I update my profile information
  Then I should have a complete profile
  And I should be logged in
  And I should see my updated information

✅ Good - Single Focused Outcome:
Scenario: New user completes account setup
  Given I have just registered for an account
  When I complete my profile setup
  Then my account should be fully configured
  And I should be ready to use all features
```

## 🔄 Living Documentation Practices

### Maintaining Feature Currency

#### **Regular Review Process**

```gherkin
# Feature header with maintenance information
Feature: User Account Management
  # Last reviewed: 2024-01-15
  # Stakeholder: Product Owner (jane.smith@company.com)
  # Business value: Critical - User retention depends on account management
  # Update frequency: Monthly or when user requirements change
  
  As a registered user
  I want to manage my account information
  So that I can maintain accurate personal data and preferences
```

#### **Version Control Integration**

```gherkin
# Use meaningful commit messages for feature file changes
# Examples:
# feat: add password reset functionality to user auth
# fix: update validation rules for email format
# docs: clarify shopping cart scenarios based on stakeholder feedback
# test: add edge cases for international shipping calculations
```

### Stakeholder Collaboration Patterns

#### **Three Amigos Sessions**

```gherkin
# Example of collaborative feature writing result
Feature: Return and Refund Processing
  # Created during Three Amigos session on 2024-01-10
  # Participants: Product Owner (Sarah), Developer (Mike), Tester (Lisa)
  # Business rule: Full refunds within 30 days, store credit after 30 days
  
  Rule: Full refunds are available within 30 days
    Scenario: Customer returns item within 30-day window
      Given I purchased a product 15 days ago
      And the product is in original condition
      When I request a return
      Then I should be eligible for a full refund
      And I should receive my refund within 5 business days

  Rule: Store credit is provided for returns after 30 days
    Scenario: Customer returns item after 30-day window
      Given I purchased a product 45 days ago
      And the product is in sellable condition
      When I request a return
      Then I should receive store credit for the purchase amount
      And the store credit should be valid for 1 year
```

### Documentation Generation

#### **Feature File Comments for Context**

```gherkin
Feature: E-commerce Checkout Process
  # Business Context:
  # This feature represents the core revenue-generating flow
  # Any changes must be approved by both Product and Finance teams
  # Performance SLA: Page load < 2 seconds, Transaction completion < 30 seconds
  
  # Technical Context:
  # Integrates with: Payment Gateway API, Inventory Service, Email Service
  # Dependencies: User must be authenticated, Cart must have items
  # Error handling: Graceful degradation with clear user messaging

  Background:
    # Standard checkout prerequisites
    Given I am logged in as a customer
    And I have items in my shopping cart
    And the payment system is operational
    And inventory levels are sufficient for my cart items

  @critical @checkout-flow
  Scenario: Successful purchase with credit card payment
    # This scenario covers the happy path for 80% of our transactions
    Given I am ready to complete my purchase
    When I provide valid payment information
    And I confirm my order
    Then my payment should be processed successfully
    And I should receive an order confirmation
    And my items should be reserved for fulfillment
    And I should receive a confirmation email within 5 minutes
```

## 🎯 Quality Checklist for Feature Files

### ✅ Content Quality

- [ ] **Business Language**: No technical jargon or implementation details
- [ ] **Clear Intent**: Scenario names clearly describe the business outcome
- [ ] **Realistic Data**: Uses believable data that reflects real usage
- [ ] **Complete Context**: All necessary preconditions are specified
- [ ] **Specific Outcomes**: Expected results are clearly defined and measurable

### ✅ Structure Quality

- [ ] **Logical Organization**: Related scenarios are grouped appropriately
- [ ] **Consistent Format**: Follows established naming and structure conventions
- [ ] **Appropriate Abstraction**: Right level of detail for the audience
- [ ] **Reusable Steps**: Common steps can be shared across scenarios
- [ ] **Maintainable Size**: Features are not too large or complex

### ✅ Collaboration Quality

- [ ] **Stakeholder Review**: Business stakeholders have reviewed and approved
- [ ] **Cross-Team Understanding**: Developers and testers understand requirements
- [ ] **Regular Updates**: Features are kept current with changing requirements
- [ ] **Clear Ownership**: Someone is responsible for maintaining each feature
- [ ] **Version Control**: Changes are tracked and documented appropriately

## 🚀 Advanced Techniques

### Rule-Based Organization

```gherkin
Feature: Account Security Management

  Rule: Password requirements must be enforced for all users
    
    Scenario: Creating account with secure password
      Given I am registering for a new account
      When I provide a password that meets security requirements
      Then my account should be created successfully
      
    Scenario: Rejecting weak passwords during registration
      Given I am registering for a new account
      When I provide a password that is too weak
      Then I should see password strength requirements
      And my registration should not be completed

  Rule: Account lockout prevents brute force attacks
    
    Scenario: Account locks after multiple failed login attempts
      Given I have attempted to log in 4 times with incorrect password
      When I attempt to log in with incorrect password again
      Then my account should be locked for 30 minutes
      And I should see an account lockout message
```

### Parameterized Backgrounds

```gherkin
Feature: Multi-tier Service Access

  Background:
    Given the application is running in production mode
    And user accounts exist with the following tiers:
      | user_email           | tier      | features_available    |
      | basic@example.com    | Basic     | read_only             |
      | premium@example.com  | Premium   | read_write, export    |
      | admin@example.com    | Admin     | read_write, manage    |

  Scenario: Basic user accesses allowed features
    Given I am logged in as "basic@example.com"
    When I attempt to view my dashboard
    Then I should see my personal data
    But I should not see edit options

  Scenario: Premium user accesses advanced features
    Given I am logged in as "premium@example.com"
    When I attempt to export my data
    Then I should be able to download my information
    And I should see export options in multiple formats
```

## 📚 Summary

### Key Takeaways

1. **Gherkin is a Communication Tool**: Focus on clarity and business value
2. **Structure Matters**: Consistent organization improves maintainability
3. **Collaboration is Essential**: Involve all stakeholders in writing and review
4. **Living Documentation**: Keep features current and valuable
5. **Quality Over Quantity**: Well-written scenarios are more valuable than many poor ones

### Best Practices Summary

- **Use business language** throughout your feature files
- **Focus on behavior** rather than implementation details
- **Keep scenarios focused** on single outcomes
- **Use realistic data** that reflects actual usage
- **Organize logically** with clear naming conventions
- **Review regularly** with stakeholders
- **Maintain currency** with changing requirements

### Next Steps

With solid Gherkin skills, you're ready to move on to implementing the step definitions that will make your feature files executable. The next lesson will cover writing robust TypeScript step definitions that maintain the separation between business logic and technical implementation.

Remember: Great feature files are the foundation of successful BDD. They serve as both specifications and tests, bridging the gap between business requirements and technical implementation. Take time to craft them well! 🎯