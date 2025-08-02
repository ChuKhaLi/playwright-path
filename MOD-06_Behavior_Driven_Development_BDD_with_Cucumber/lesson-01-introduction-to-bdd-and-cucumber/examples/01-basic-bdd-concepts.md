# Basic BDD Concepts - Examples

This file demonstrates fundamental BDD principles through practical examples, showing how BDD transforms the way we think about and write tests.

---

## Example 1: From Requirements to BDD Scenarios

### Traditional Requirement Document
```
User Story: As a customer, I want to login to my account so that I can access my order history.

Acceptance Criteria:
- User can enter email and password
- System validates credentials
- User is redirected to dashboard upon success
- Error message shown for invalid credentials
```

### BDD Scenarios (Gherkin)
```gherkin
Feature: User Login
  As a customer
  I want to login to my account
  So that I can access my order history and personal information

  Background:
    Given I am on the login page
    And the following users exist:
      | email                | password | status |
      | john@example.com     | secret123| active |
      | jane@example.com     | pass456  | locked |

  Scenario: Successful login with valid credentials
    When I enter email "john@example.com"
    And I enter password "secret123"
    And I click the "Login" button
    Then I should be redirected to my dashboard
    And I should see "Welcome back, John!" message

  Scenario: Failed login with invalid password
    When I enter email "john@example.com"
    And I enter password "wrongpassword"
    And I click the "Login" button
    Then I should remain on the login page
    And I should see "Invalid email or password" error message
    And the password field should be cleared

  Scenario: Failed login with locked account
    When I enter email "jane@example.com"
    And I enter password "pass456"
    And I click the "Login" button
    Then I should see "Account is locked" error message
    And I should see a "Contact Support" link

  Scenario: Login form validation
    When I click the "Login" button without entering credentials
    Then I should see "Email is required" error message
    And I should see "Password is required" error message
    And the "Login" button should remain disabled
```

**Key Differences:**
- **BDD scenarios are specific** with actual data examples
- **BDD covers edge cases** like locked accounts and validation
- **BDD uses business language** that stakeholders can understand
- **BDD provides clear acceptance criteria** for each scenario

---

## Example 2: The Three Amigos in Action

### Scenario Creation Process

**Initial Business Requirement:**
"Customers should be able to add products to their shopping cart"

#### Three Amigos Discussion:

**🎯 Product Owner Input:**
- "Customers should see immediate feedback when adding items"
- "We need to handle out-of-stock products"
- "Cart should persist during the session"
- "Show running total as items are added"

**👨‍💻 Developer Input:**
- "We need to consider inventory validation"
- "What happens if two users try to add the last item?"
- "Should we allow adding more than available stock?"
- "How do we handle session timeout?"

**🧪 Tester Input:**
- "What about adding the same product multiple times?"
- "How do we handle network failures during add to cart?"
- "What's the maximum quantity allowed?"
- "Should guests be able to add to cart without login?"

#### Resulting Collaborative Scenarios:

```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to add products to my shopping cart
  So that I can purchase multiple items together

  Background:
    Given I am logged in as a customer
    And the following products are available:
      | product_id | name          | price | stock_quantity |
      | 1         | MacBook Pro   | 1299  | 5              |
      | 2         | iPhone 14     | 999   | 0              |
      | 3         | AirPods Pro   | 249   | 10             |

  Scenario: Add available product to empty cart
    Given my shopping cart is empty
    And I am viewing product "MacBook Pro"
    When I click "Add to Cart"
    Then I should see "Product added to cart" success message
    And my cart should contain 1 item
    And the cart total should show "$1,299.00"
    And the cart icon should display "1" item count

  Scenario: Add out-of-stock product
    Given I am viewing product "iPhone 14"
    When I click "Add to Cart"
    Then I should see "Out of Stock" message
    And the "Add to Cart" button should be disabled
    And my cart should remain unchanged
    And I should see "Notify when available" option

  Scenario: Add same product multiple times
    Given I have 1 "MacBook Pro" in my cart
    And I am viewing product "MacBook Pro"
    When I click "Add to Cart"
    Then my cart should contain 2 "MacBook Pro" items
    And the cart total should show "$2,598.00"
    And I should see quantity "2" next to "MacBook Pro"

  Scenario: Attempt to add more than available stock
    Given I have 4 "MacBook Pro" in my cart
    And I am viewing product "MacBook Pro"
    When I click "Add to Cart"
    Then I should see "Only 1 more available" warning message
    And my cart should contain 5 "MacBook Pro" items
    And the "Add to Cart" button should be disabled

  Scenario: Add to cart as guest user
    Given I am not logged in
    And I am viewing product "AirPods Pro"
    When I click "Add to Cart"
    Then I should see "Sign in to add to cart" message
    And I should be redirected to the login page
    And the product should be remembered for after login
```

**Collaborative Benefits Demonstrated:**
- **Comprehensive coverage** of business logic, technical constraints, and edge cases
- **Shared understanding** across all stakeholders
- **Testable scenarios** with specific examples and expected outcomes
- **Clear acceptance criteria** for development and testing

---

## Example 3: Living Documentation in Practice

### Before BDD: Static Documentation

**Test Case Document (Created once, rarely updated):**
```
Test Case ID: TC_001
Title: Verify successful product search
Steps:
1. Navigate to product catalog
2. Enter search term
3. Click search button
4. Verify results displayed

Expected Result: Products matching search term are displayed
```

**Problems:**
- ❌ Vague acceptance criteria
- ❌ No specific examples or test data
- ❌ Becomes outdated when features change
- ❌ Not connected to actual test execution

### After BDD: Living Documentation

**Feature File (Always current because it's executed as tests):**
```gherkin
Feature: Product Search
  As a customer
  I want to search for products by name, category, or brand
  So that I can quickly find items I want to purchase

  Background:
    Given I am on the product catalog page
    And the following products exist:
      | name        | category | brand   | price | tags           |
      | iPhone 14   | phones   | Apple   | 999   | smartphone,5G  |
      | Galaxy S23  | phones   | Samsung | 899   | smartphone,5G  |
      | MacBook Pro | laptops  | Apple   | 1299  | laptop,pro     |
      | ThinkPad X1 | laptops  | Lenovo  | 1199  | laptop,business|

  Scenario: Search by product name
    When I search for "iPhone"
    Then I should see 1 product in the results
    And the result should contain "iPhone 14"
    And the result should show price "$999"

  Scenario: Search by brand
    When I search for "Apple"
    Then I should see 2 products in the results
    And the results should contain "iPhone 14" and "MacBook Pro"
    And all results should display "Apple" as the brand

  Scenario: Search by category
    When I search for "laptops"
    Then I should see 2 products in the results
    And all results should be in "laptops" category
    And results should be sorted by price ascending

  Scenario: Search with no results
    When I search for "xyz123nonexistent"
    Then I should see "No products found" message
    And I should see "Did you mean:" suggestions
    And I should see links to popular categories

  Scenario: Search with filters applied
    Given I have applied filter "category: phones"
    When I search for "Samsung"
    Then I should see 1 product in the results
    And the result should be "Galaxy S23"
    And the category filter should remain active
```

**Living Documentation Benefits:**
- ✅ **Always accurate** - tests fail if documentation is wrong
- ✅ **Executable examples** - documentation doubles as test cases
- ✅ **Business readable** - stakeholders can understand and validate
- ✅ **Comprehensive** - covers happy path, edge cases, and error conditions

---

## Example 4: BDD vs Traditional Testing Mindset

### Traditional Testing Approach

**Test Case:**
```
Title: Test login functionality
Steps:
1. Open application
2. Click login
3. Enter username and password
4. Click submit
5. Verify user is logged in
```

**Problems:**
- Focus on **how** to test, not **what** behavior to verify
- No context about **why** this matters to users
- Missing **specific examples** and **edge cases**
- **Technical perspective** only

### BDD Approach

**Gherkin Scenario:**
```gherkin
Feature: User Authentication
  As a returning customer
  I want to securely access my account
  So that I can view my orders and manage my profile

  Scenario: Customer logs in with remembered credentials
    Given I have previously logged in and selected "Remember me"
    And I return to the site after 2 days
    When I visit any page requiring authentication
    Then I should be automatically logged in
    And I should see my personalized dashboard
    And I should see "Welcome back, [My Name]" greeting

  Scenario: Customer logs in after long absence
    Given I have not visited the site for 90 days
    And my session has expired
    When I enter my valid credentials
    And I click "Sign In"
    Then I should be prompted to verify my email
    And I should receive a verification email
    And I should be logged in after email verification
```

**BDD Benefits:**
- Focus on **user behavior** and **business value**
- **Specific scenarios** with real-world context
- **Clear acceptance criteria** for each situation  
- **User-centric language** that business stakeholders understand

---

## Example 5: Collaborative Scenario Refinement

### Initial Scenario (Too Generic)
```gherkin
Scenario: Update user profile
  Given I am logged in
  When I update my profile
  Then my profile should be updated
```

### After Three Amigos Collaboration

**Business Questions Raised:**
- What specific fields can be updated?
- Are there validation rules?
- What happens to active sessions?
- Should other users see changes immediately?

**Developer Questions Raised:**
- How do we handle concurrent updates?
- What fields require re-authentication?
- Are there rate limits on updates?
- How do we validate email changes?

**Tester Questions Raised:**
- What are the field length limits?
- How do we handle special characters?
- What error messages should users see?
- Can partial updates be saved?

#### Refined Scenarios:

```gherkin
Feature: User Profile Management
  As a registered customer
  I want to update my profile information
  So that I can keep my account details current and accurate

  Background:
    Given I am logged in as customer "john@example.com"
    And my current profile contains:
      | field         | value            |
      | first_name    | John             |
      | last_name     | Smith            |
      | email         | john@example.com |
      | phone         | +1-555-123-4567  |

  Scenario: Update basic profile information
    Given I am on my profile page
    When I change my first name to "Jonathan"
    And I change my phone to "+1-555-987-6543"
    And I click "Save Changes"
    Then I should see "Profile updated successfully" message
    And my profile should show first name "Jonathan"
    And my profile should show phone "+1-555-987-6543"
    And other profile fields should remain unchanged

  Scenario: Update email address with verification
    Given I am on my profile page
    When I change my email to "jonathan@example.com"
    And I click "Save Changes"
    Then I should see "Verification email sent" message
    And my displayed email should still show "john@example.com"
    And I should receive verification email at "jonathan@example.com"
    When I click the verification link in the email
    Then my profile should show email "jonathan@example.com"
    And I should be logged out and prompted to log in again

  Scenario: Validation error for invalid phone format
    Given I am on my profile page
    When I change my phone to "invalid-phone"
    And I click "Save Changes"
    Then I should see "Please enter a valid phone number" error
    And my phone field should be highlighted in red
    And no changes should be saved to my profile

  Scenario: Concurrent profile update handling
    Given another session has updated my profile
    And I am editing my profile in a different browser
    When I try to save my changes
    Then I should see "Profile was updated elsewhere" warning
    And I should see current values alongside my changes
    And I should be able to choose which changes to keep
```

**Collaboration Results:**
- **Comprehensive scenarios** covering various user situations
- **Technical considerations** like concurrent updates and validation
- **Business logic** clearly defined with specific examples
- **User experience details** like error messages and verification flows

---

## Key Takeaways from Examples

### 1. **Collaboration Creates Better Scenarios**
- Each perspective (business, development, testing) adds valuable insights
- Combined knowledge produces comprehensive test coverage
- Shared understanding reduces development iterations

### 2. **Specificity Prevents Ambiguity**
- Concrete examples eliminate guesswork
- Clear acceptance criteria enable accurate implementation
- Specific test data makes scenarios executable

### 3. **Living Documentation Stays Current**
- Executable specifications can't become outdated
- Documentation failures are caught immediately
- Business stakeholders can always see current behavior

### 4. **User Focus Improves Quality**
- User-centric scenarios cover real-world usage patterns
- Business value is clearly connected to technical implementation
- Edge cases are discovered through user journey thinking

---

*These examples demonstrate the foundational concepts that will be built upon in subsequent lessons with actual Cucumber implementation and automation.*