# Exercise 02: Writing Your First Gherkin Scenarios

**Difficulty:** Beginner  
**Estimated Time:** 20 minutes  
**Skills Practiced:** Gherkin syntax, scenario structure, Background usage, data tables

## Learning Objectives

By completing this exercise, you will:
- Practice writing Gherkin scenarios using Given-When-Then structure
- Learn to organize related scenarios using Feature files and Background sections
- Use data tables to make scenarios more readable and maintainable
- Create business-readable scenarios that serve as living documentation

## Exercise Overview

You'll write Gherkin scenarios for various e-commerce functionality, focusing on clear language and proper structure that both technical and non-technical stakeholders can understand.

## Gherkin Syntax Reference

### Basic Structure:
```gherkin
Feature: [Brief description of the feature]
  As a [user type]
  I want [functionality]
  So that [business value]

  Background:
    Given [common setup for all scenarios]

  Scenario: [Brief description of the scenario]
    Given [preconditions]
    When [action performed]
    Then [expected outcome]
    And [additional expected outcome]

  Scenario Outline: [Template scenario with examples]
    Given [precondition with <parameter>]
    When [action with <parameter>]
    Then [outcome with <parameter>]

    Examples:
      | parameter | value1 | value2 |
      | data1     | result1| result2|
```

---

## Task 1: User Login Feature

### Your Task:
Write a complete feature file for user login functionality. Include scenarios for successful login, failed login, and account lockout.

### Requirements:
- Users can log in with email and password
- Invalid credentials show appropriate error messages
- Accounts are locked after 3 failed login attempts
- Locked accounts show specific guidance to users

**Your Answer:**
```gherkin
Feature: ________________________________
  As a ____________________________
  I want ____________________________
  So that ____________________________

  Background:
    Given ____________________________
    And the following user accounts exist:
      | email               | password    | status | failed_attempts |
      | __________________ | __________ | _____ | ______________ |
      | __________________ | __________ | _____ | ______________ |
      | __________________ | __________ | _____ | ______________ |

  Scenario: ____________________________
    Given ____________________________
    When ____________________________
    And ____________________________
    Then ____________________________
    And ____________________________

  Scenario: ____________________________
    Given ____________________________
    When ____________________________
    And ____________________________
    Then ____________________________
    And ____________________________

  Scenario: ____________________________
    Given ____________________________
    When ____________________________
    And ____________________________
    Then ____________________________
    And ____________________________
```

---

## Task 2: Product Search with Filters

### Your Task:
Create scenarios for product search functionality that includes filtering by category, price range, and brand.

### Requirements:
- Users can search by product name or keywords
- Results can be filtered by category, price range, and brand
- No results scenario should provide helpful suggestions
- Search results should be paginated

**Your Answer:**
```gherkin
Feature: ________________________________
  As a ____________________________
  I want ____________________________
  So that ____________________________

  Background:
    Given I am on the ShopEasy website
    And the following products are available:
      | name              | category    | brand   | price | rating |
      | ________________ | __________ | ______ | _____ | _____ |
      | ________________ | __________ | ______ | _____ | _____ |
      | ________________ | __________ | ______ | _____ | _____ |
      | ________________ | __________ | ______ | _____ | _____ |

  Scenario: ____________________________
    When ____________________________
    Then ____________________________
    And ____________________________

  Scenario: ____________________________
    Given ____________________________
    When ____________________________
    And ____________________________
    Then ____________________________
    And ____________________________

  Scenario: ____________________________
    When ____________________________
    Then ____________________________
    And ____________________________
```

---

## Task 3: Shopping Cart Scenarios with Data Tables

### Your Task:
Write scenarios for shopping cart functionality using Scenario Outline and data tables to test multiple product combinations.

### Requirements:
- Users can add multiple products to cart
- Cart shows correct totals and item counts
- Users can modify quantities and remove items
- Cart persists for logged-in users

**Your Answer:**
```gherkin
Feature: ________________________________
  As a ____________________________
  I want ____________________________
  So that ____________________________

  Background:
    Given ____________________________
    And ____________________________

  Scenario Outline: Add different products to cart
    Given ____________________________
    When I add "<product>" with quantity <quantity> to my cart
    Then my cart should contain <expected_items> items
    And the cart total should be "<expected_total>"

    Examples:
      | product          | quantity | expected_items | expected_total |
      | ________________ | _______ | _____________ | _____________ |
      | ________________ | _______ | _____________ | _____________ |
      | ________________ | _______ | _____________ | _____________ |

  Scenario: ____________________________
    Given ____________________________
    When ____________________________
    Then ____________________________
    And ____________________________

  Scenario: ____________________________
    Given ____________________________
    When ____________________________
    And ____________________________
    Then ____________________________
```

---

## Task 4: Order Checkout Process

### Your Task:
Create a comprehensive checkout flow that includes address selection, payment method, and order confirmation.

### Requirements:
- Users must be logged in to checkout
- Users can select shipping address (or add new one)
- Multiple payment methods are supported
- Order confirmation shows complete order details
- Users receive confirmation email

**Your Answer:**
```gherkin
Feature: ________________________________
  ________________________________
  ________________________________
  ________________________________

  Background:
    ________________________________
    ________________________________

  Scenario: ____________________________
    Given ____________________________
    And ____________________________
    When ____________________________
    And ____________________________
    And ____________________________
    And ____________________________
    Then ____________________________
    And ____________________________
    And ____________________________

  Scenario: ____________________________
    Given ____________________________
    When ____________________________
    Then ____________________________
    And ____________________________
```

---

## Task 5: Customer Reviews with Validation

### Your Task:
Write scenarios for the product review system including review submission, validation, and display.

### Requirements:
- Only customers who purchased a product can review it
- Reviews include star rating (1-5) and optional comment
- Reviews are displayed with reviewer information
- Reviews can be sorted by date, rating, or helpfulness

**Your Answer:**
```gherkin
Feature: ________________________________
  ________________________________
  ________________________________
  ________________________________

  Background:
    Given the following customers exist:
      | email                | name          | 
      | __________________ | ____________ |
      | __________________ | ____________ |
    And the following purchase history exists:
      | customer_email      | product       | purchase_date |
      | __________________ | ____________ | ____________ |
      | __________________ | ____________ | ____________ |

  Scenario: ____________________________
    ________________________________
    ________________________________
    ________________________________
    ________________________________

  Scenario: ____________________________
    ________________________________
    ________________________________
    ________________________________

  Scenario Outline: Review validation
    ________________________________
    ________________________________
    ________________________________

    Examples:
      | rating | comment          | expected_result |
      | _____ | _______________ | ______________ |
      | _____ | _______________ | ______________ |
```

---

## Self-Assessment Questions

After completing the tasks, evaluate your Gherkin scenarios:

1. **Language Clarity:**
   - Are your scenarios written in plain English?
   - Would a business stakeholder understand each scenario?
   - Do you avoid technical jargon?

2. **Structure and Organization:**
   - Do your scenarios follow Given-When-Then structure consistently?
   - Are related scenarios grouped appropriately?
   - Do you use Background sections effectively?

3. **Completeness:**
   - Do your scenarios cover both positive and negative cases?
   - Are edge cases included?
   - Do scenarios test complete user journeys?

4. **Data Usage:**
   - Are data tables used appropriately?
   - Do Scenario Outlines reduce duplication effectively?
   - Is test data realistic and meaningful?

---

## Solution Examples

### Task 1 Solution:
```gherkin
Feature: User Authentication
  As a returning customer
  I want to securely log into my account
  So that I can access my order history and make purchases

  Background:
    Given I am on the ShopEasy login page
    And the following user accounts exist:
      | email                | password    | status | failed_attempts |
      | john@example.com     | SecurePass1 | active | 0              |
      | jane@example.com     | MyPassword2 | active | 2              |
      | bob@example.com      | TempPass123 | locked | 3              |

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter email "john@example.com"
    And I enter password "SecurePass1"
    And I click "Sign In"
    Then I should be redirected to my account dashboard
    And I should see "Welcome back, John!" message

  Scenario: Failed login with invalid password
    Given I am on the login page  
    When I enter email "john@example.com"
    And I enter password "wrongpassword"
    And I click "Sign In"
    Then I should remain on the login page
    And I should see "Invalid email or password" error message
    And the password field should be cleared

  Scenario: Account lockout after failed attempts
    Given user "jane@example.com" has 2 failed login attempts
    When I enter email "jane@example.com"
    And I enter password "wrongpassword"
    And I click "Sign In"
    Then I should see "Account locked due to multiple failed attempts" error
    And I should see "Contact support or try again in 30 minutes" message
    And the account status should be changed to "locked"
```

### Task 2 Solution:
```gherkin
Feature: Product Search and Discovery
  As a customer browsing the online store
  I want to search and filter products effectively
  So that I can find exactly what I'm looking for

  Background:
    Given I am on the ShopEasy website
    And the following products are available:
      | name              | category    | brand    | price | rating |
      | iPhone 14 Pro     | electronics | Apple    | 999   | 4.5    |
      | Samsung Galaxy S23| electronics | Samsung  | 799   | 4.3    |
      | Nike Air Force 1  | footwear    | Nike     | 90    | 4.4    |
      | Adidas Stan Smith | footwear    | Adidas   | 75    | 4.2    |

  Scenario: Search by product name returns relevant results
    When I search for "iPhone"
    Then I should see 1 product in the results
    And the first result should be "iPhone 14 Pro"
    And I should see the price "$999"

  Scenario: Filter search results by category and price
    Given I have searched for "electronics"
    When I apply filter "Category: Electronics"
    And I apply filter "Price: Under $900"
    Then I should see 1 product in the results
    And the result should be "Samsung Galaxy S23"
    And I should see active filters displayed

  Scenario: No results found provides helpful suggestions
    When I search for "nonexistent product"
    Then I should see "No results found for 'nonexistent product'" message
    And I should see "Popular categories" suggestions
    And I should see "Trending products" suggestions
```

### Task 3 Solution:
```gherkin
Feature: Shopping Cart Management
  As a customer browsing products
  I want to manage items in my shopping cart
  So that I can collect products before making a purchase

  Background:
    Given I am logged in as "customer@example.com"
    And the following products are available:
      | name         | price |
      | iPhone 14    | 999   |
      | Phone Case   | 25    |
      | Charger      | 30    |

  Scenario Outline: Add different products to cart
    Given my cart is empty
    When I add "<product>" with quantity <quantity> to my cart
    Then my cart should contain <expected_items> items
    And the cart total should be "<expected_total>"

    Examples:
      | product      | quantity | expected_items | expected_total |
      | iPhone 14    | 1        | 1             | $999.00       |
      | Phone Case   | 2        | 2             | $50.00        |
      | Charger      | 3        | 3             | $90.00        |

  Scenario: Update item quantity in cart
    Given I have "iPhone 14" with quantity 1 in my cart
    When I change the quantity to 2
    Then my cart should contain 2 items
    And the cart total should be "$1,998.00"

  Scenario: Remove item from cart
    Given I have multiple items in my cart
    When I click "Remove" for "Phone Case"
    Then "Phone Case" should no longer be in my cart
    And the cart total should be updated accordingly
```

---

## Common Gherkin Mistakes to Avoid

### ❌ **Technical Language**
```gherkin
# Wrong
Given the user authentication API returns 200 status
When I POST to /login endpoint
Then the JWT token should be generated
```

```gherkin  
# Right
Given I have a valid user account
When I log in with my credentials
Then I should be successfully signed in
```

### ❌ **Implementation Details**
```gherkin
# Wrong  
When I click the submit button with id="login-btn"
Then the page should redirect using HTTP 302
```

```gherkin
# Right
When I click "Sign In"
Then I should be taken to my account dashboard
```

### ❌ **Vague Descriptions**
```gherkin
# Wrong
Then the system should work correctly
And everything should be fine
```

```gherkin
# Right  
Then I should see "Login successful" message
And I should be redirected to the dashboard page
```

### ❌ **Testing Multiple Things**
```gherkin
# Wrong
Scenario: Login and add to cart and checkout
  Given I am not logged in
  When I log in and add items and proceed to checkout
  Then everything should work
```

```gherkin
# Right
Scenario: Successful user login
  Given I have a valid account
  When I log in with correct credentials
  Then I should access my account dashboard

Scenario: Add items to cart after login
  Given I am logged in
  When I add items to my cart
  Then my cart should contain the selected items
```

---

## Key Learning Points

### ✅ **Good Gherkin Characteristics:**

1. **Business Language:** Use terminology that business stakeholders understand
2. **User Perspective:** Write from the user's point of view, not system perspective  
3. **Specific Examples:** Use concrete data instead of abstract placeholders
4. **Clear Structure:** Each scenario focuses on one specific behavior
5. **Readable Flow:** Scenarios tell a story that anyone can follow

### ✅ **Effective Data Tables:**
- Use tables for multiple similar test cases
- Keep parameter names clear and meaningful
- Include both valid and invalid data examples
- Organize data logically (often from simple to complex cases)

### ✅ **Background Usage:**
- Include common setup that applies to all scenarios in the feature
- Keep background steps minimal and focused
- Avoid putting test data in background unless needed by most scenarios

---

## Next Steps

After completing this exercise:

1. **Review your scenarios** - do they tell clear user stories?
2. **Check for completeness** - have you covered main user paths and edge cases?
3. **Move to Exercise 03** to practice collaborative scenario creation
4. **Consider automation** - could these scenarios be automated with step definitions?

Remember: Good Gherkin scenarios serve as both specification and test cases. They should be understandable by all stakeholders and provide clear acceptance criteria for development teams.