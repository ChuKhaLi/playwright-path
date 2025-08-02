# Gherkin Structure Breakdown

## Visual Purpose
This visual guide provides a detailed breakdown of Gherkin syntax, showing the purpose and proper usage of each keyword with annotated examples.

## Complete Gherkin Structure Overview

```gherkin
# Comments start with hash - provide context but aren't executed
@tag1 @smoke @regression    # Tags for test organization and filtering
Feature: User Account Management    # High-level feature description
  As a customer                    # User role - who benefits
  I want to manage my account      # Goal - what they want to do  
  So that I can control my profile # Benefit - why it's valuable

  # Background runs before each scenario in this feature
  Background:
    Given I am on the account management page
    And I am logged in as a registered customer

  @positive @happy-path    # Scenario-specific tags
  Scenario: Update profile information successfully
    Given my current email is "john@example.com"     # Preconditions
    And my current name is "John Smith"              # Additional context
    When I update my email to "john.smith@email.com" # Action/trigger
    And I update my name to "John A. Smith"          # Additional actions
    Then my profile should be updated successfully    # Expected outcome
    And I should see confirmation message            # Additional verification
    But my account ID should remain unchanged        # Contrasting assertion

  @negative @error-handling
  Scenario: Attempt to update with invalid email
    Given my current email is "john@example.com"
    When I try to update my email to "invalid-email"
    Then I should see an error message "Invalid email format"
    And my email should remain "john@example.com"

  # Scenario Outline for data-driven testing
  @data-driven @validation
  Scenario Outline: Validate email format requirements
    Given I am updating my profile
    When I enter "<email>" as my new email
    Then I should see "<result>"
    And the save button should be "<button_state>"

    Examples:
      | email                  | result              | button_state |
      | valid@example.com      | No error           | enabled      |
      | invalid.email          | Invalid format     | disabled     |
      | missing@              | Invalid format     | disabled     |
      | @missing-local.com     | Invalid format     | disabled     |

  # Alternative Examples table format
  Scenario Outline: Test different user roles
    Given I am logged in as a "<role>"
    When I try to access admin settings
    Then I should "<access_result>"

    Examples: Authorized Users
      | role           | access_result           |
      | administrator  | see admin dashboard     |
      | super_user     | see limited admin panel |

    Examples: Unauthorized Users  
      | role          | access_result              |
      | regular_user  | see access denied message  |
      | guest_user    | be redirected to login     |
```

## Keyword Breakdown and Usage Guide

### 1. Feature Block Structure

```
┌─────────────────────────────────────────────────┐
│                    FEATURE                      │
├─────────────────────────────────────────────────┤
│ @tags (optional)                                │
│ Feature: [Brief descriptive title]              │
│   [User story in "As a... I want... So that..."] │
│   [Additional feature description]               │
│                                                 │
│ Background: (optional)                          │
│   [Setup steps that run before each scenario]   │
│                                                 │
│ Scenario: [Descriptive scenario title]          │
│   [Given-When-Then steps]                       │
│                                                 │
│ [Additional scenarios...]                       │
└─────────────────────────────────────────────────┘
```

### 2. Core Keywords Explained

#### **Feature**
```gherkin
Feature: Shopping Cart Functionality
  As a customer browsing products
  I want to add items to my cart
  So that I can purchase multiple items together
```
**Purpose:** Defines the high-level feature being tested  
**Best Practice:** Include user story format for business context  
**Common Mistake:** Making it too technical instead of user-focused

#### **Background**
```gherkin
Background:
  Given I am on the e-commerce website
  And I am logged in as "customer@example.com"
  And there are products available in the catalog
```
**Purpose:** Setup steps that run before each scenario in the feature  
**Best Practice:** Keep it focused on essential preconditions  
**Common Mistake:** Including too many setup steps that aren't needed by all scenarios

#### **Scenario**
```gherkin
Scenario: Add single item to empty cart
  Given I am viewing product "iPhone 14" priced at $999
  And my cart is currently empty
  When I click "Add to Cart"
  Then the item should be added to my cart
  And my cart count should show "1"
  And my cart total should display "$999.00"
```
**Purpose:** Describes a specific behavior or test case  
**Best Practice:** Focus on one behavior per scenario  
**Common Mistake:** Creating scenarios that test multiple unrelated behaviors

### 3. Step Keywords in Detail

#### **Given** - Preconditions/Context
```gherkin
Given I am a registered customer          # User state
And I am logged into my account          # Authentication state  
And I have items in my wishlist          # Data state
And the promotion "SAVE20" is active     # System state
```
**Purpose:** Establishes the context and preconditions  
**Guidelines:**
- ✅ Set up the world before the action
- ✅ Use past tense ("I have logged in")
- ❌ Don't include actions or verifications

#### **When** - Actions/Events
```gherkin
When I click the "Add to Cart" button           # User action
And I select shipping option "Express"          # Additional action
```
**Purpose:** Describes the action or event that triggers the behavior  
**Guidelines:**
- ✅ Focus on the key action being tested
- ✅ Use present tense ("I click")
- ❌ Avoid multiple unrelated actions

#### **Then** - Expected Outcomes
```gherkin
Then I should see the item in my cart           # Verification
And the cart total should be updated            # Additional verification
And I should receive a confirmation message     # User feedback verification
```
**Purpose:** Describes the expected outcomes and verifications  
**Guidelines:**
- ✅ Focus on observable outcomes
- ✅ Use future or conditional tense ("should see")
- ❌ Don't include implementation details

#### **And/But** - Continuation Keywords
```gherkin
Given I am logged in
And I have a premium membership        # Additional context
When I add an expensive item
And I apply a discount code           # Additional action  
Then the discount should be applied
But the shipping cost should remain   # Contrasting assertion
And I should see the final total      # Additional verification
```
**Purpose:** Continue the previous step type without repeating Given/When/Then  
**Guidelines:**
- ✅ Use "And" for additional related information
- ✅ Use "But" for contrasting or negative assertions
- ❌ Don't overuse - keep scenarios readable

### 4. Advanced Gherkin Features

#### **Scenario Outline with Examples**
```gherkin
Scenario Outline: Login with different user types
  Given I am on the login page
  When I enter username "<username>" and password "<password>"
  Then I should "<result>"
  And I should see "<message>"

  Examples:
    | username    | password  | result        | message            |
    | admin       | admin123  | be logged in  | Welcome Dashboard  |
    | user        | user123   | be logged in  | Welcome Profile    |
    | invalid     | wrong     | see error     | Invalid credentials|
```
**Purpose:** Test the same scenario with different data sets  
**Best Practice:** Use meaningful parameter names  
**When to Use:** When the logic is the same but data varies

#### **Tags for Organization**
```gherkin
@smoke @critical
Scenario: User can complete checkout

@regression @payment @slow
Scenario: Process credit card payment

@wip @ignore
Scenario: Advanced reporting features
```
**Common Tag Categories:**
- **Test Type:** `@smoke`, `@regression`, `@integration`
- **Priority:** `@critical`, `@high`, `@low`
- **Functionality:** `@payment`, `@user-management`, `@reporting`
- **Status:** `@wip`, `@ignore`, `@manual`

#### **Data Tables**
```gherkin
Given the following products are available:
  | name      | price | category    | stock |
  | iPhone 14 | 999   | Electronics | 10    |
  | MacBook   | 1299  | Electronics | 5     |
  | AirPods   | 179   | Electronics | 20    |

When I search for products in "Electronics" category
Then I should see all available products:
  | name      | status      |
  | iPhone 14 | In Stock    |
  | MacBook   | In Stock    |
  | AirPods   | In Stock    |
```
**Purpose:** Pass structured data to step definitions  
**Best Practice:** Use clear, descriptive column headers  
**When to Use:** When you need to pass multiple related data points

### 5. Gherkin Quality Guidelines

#### ✅ Good Gherkin Characteristics

**Clear and Descriptive:**
```gherkin
Scenario: Customer receives order confirmation email after successful purchase
  Given I have completed checkout for order "ORD-12345"
  When the payment is processed successfully  
  Then I should receive order confirmation email within 2 minutes
  And the email should contain order details and tracking information
```

**Business-Focused Language:**
```gherkin
# ✅ Good - focuses on business behavior
Given I am a premium customer
When I request expedited shipping
Then my order should be processed with priority

# ❌ Bad - focuses on technical implementation
Given the user record has premium_flag = true
When POST request is sent to /api/shipping/expedite
Then the queue_priority field should be set to 1
```

**Appropriate Level of Detail:**
```gherkin
# ✅ Good - right level of abstraction
Given I have items in my cart
When I proceed to checkout
Then I should see the payment options

# ❌ Bad - too much UI detail
Given I click the cart icon in the top right corner
And I see the cart dropdown with item list
When I click the "Proceed to Checkout" button
Then I should be redirected to "/checkout" URL
And I should see payment form with fields for card details
```

#### ❌ Common Gherkin Mistakes

**Mixing Abstraction Levels:**
```gherkin
# ❌ Bad - mixes business and technical language
Scenario: User registration
  Given I am on the registration page
  When I submit POST to /api/users with valid data
  Then my account should be created successfully
```

**Testing Multiple Behaviors:**
```gherkin
# ❌ Bad - tests login, navigation, and purchase
Scenario: Complete user workflow  
  Given I am not logged in
  When I log in and navigate to products and add items and checkout
  Then everything should work correctly
```

**UI-Focused Instead of Behavior-Focused:**
```gherkin
# ❌ Bad - focuses on UI interactions
Scenario: Button clicking
  Given I see a blue button labeled "Submit"
  When I click the button with mouse
  Then the button should change color to green

# ✅ Good - focuses on user behavior
Scenario: Form submission confirmation
  Given I have filled out the contact form
  When I submit my information
  Then I should receive confirmation that my message was sent
```

### 6. Scenario Organization Patterns

#### Single Behavior Focus
```gherkin
# Each scenario tests one specific behavior
Scenario: Add item to cart
  # Test adding functionality

Scenario: Remove item from cart  
  # Test removal functionality

Scenario: Update item quantity in cart
  # Test quantity update functionality
```

#### Happy Path vs Error Handling
```gherkin
@positive
Scenario: Successful password reset
  Given I am a registered user
  When I request password reset with valid email
  Then I should receive reset instructions

@negative  
Scenario: Password reset with invalid email
  Given I am on the password reset page
  When I enter an unregistered email address
  Then I should see error message "Email not found"
```

#### Progressive Complexity
```gherkin
Scenario: Add single item to cart
  # Basic functionality

Scenario: Add multiple different items to cart
  # Multiple items

Scenario: Add items with different shipping requirements
  # Complex business rules
```

### 7. Integration with Step Definitions

#### Parameter Passing
```gherkin
# String parameters
When I enter "john@example.com" in the email field

# Number parameters  
And I select quantity 3

# Table parameters
Given the following users exist:
  | email              | role  | status |
  | admin@example.com  | admin | active |
```

#### Regular Expression Matching
```gherkin
# These steps could share the same step definition:
When I enter "test@example.com" in the email field
When I enter "user@domain.com" in the email field
When I enter "contact@company.org" in the email field

# Step definition pattern: /I enter "([^"]*)" in the email field/
```

## Visual Learning Questions

Use this guide to practice:

1. **Identify Issues:** Can you spot problems in poorly written scenarios?
2. **Improve Structure:** How would you refactor a technical scenario to be more business-focused?
3. **Choose Keywords:** When should you use Scenario vs Scenario Outline?
4. **Organize Features:** How would you structure multiple related scenarios?

## Next Steps

- **Practice Writing:** Use these patterns in Exercise 02
- **Review Examples:** Compare your scenarios against these guidelines  
- **Focus on Behavior:** Always ask "What is the user trying to accomplish?"
- **Keep Simple:** Start simple and add complexity only when needed

Remember: Good Gherkin serves as both specification and test - it should be readable by business stakeholders and executable by automation tools.