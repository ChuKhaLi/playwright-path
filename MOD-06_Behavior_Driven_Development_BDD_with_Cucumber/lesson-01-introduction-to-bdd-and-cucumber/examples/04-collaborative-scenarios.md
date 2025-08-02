# Collaborative Scenarios - Three Amigos in Action

This file demonstrates how the Three Amigos (Product Owner, Developer, Tester) collaborate to create comprehensive BDD scenarios through real-world examples of their collaborative process.

---

## The Three Amigos Approach

### Who Are the Three Amigos?

**🏢 Product Owner (PO)**
- Represents business stakeholders and end users
- Defines acceptance criteria and business value
- Validates scenarios align with user needs
- Provides domain expertise and business context

**👩‍💻 Developer (DEV)**  
- Understands technical implementation constraints
- Identifies edge cases and system behaviors
- Estimates implementation complexity
- Ensures scenarios are technically feasible

**🧪 Tester (QA)**
- Brings quality and risk assessment perspective
- Identifies testing scenarios and edge cases
- Ensures comprehensive coverage
- Validates testability of scenarios

---

## Collaboration Example 1: Shopping Cart Feature

### Initial User Story
```
As a customer
I want to add products to my shopping cart
So that I can purchase multiple items in one transaction
```

### Three Amigos Collaboration Session

#### Step 1: Initial PO Perspective
**Product Owner starts with business requirements:**

```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to add products to my cart
  So that I can buy multiple items

  Scenario: Add product to cart
    Given I am viewing a product
    When I click "Add to Cart"
    Then the product should be in my cart
```

**PO Comments:**
- "Customers should see immediate feedback when adding items"
- "We need to handle inventory limits"
- "Cart should persist across sessions"

---

#### Step 2: Developer Input
**Developer raises technical considerations:**

**DEV:** "What happens if the product goes out of stock while it's in the cart?"
**DEV:** "Do we need to handle quantity limits per customer?"
**DEV:** "How do we handle concurrent users adding the same limited item?"

**Updated scenario after DEV input:**

```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to add products to my cart
  So that I can buy multiple items at once

  Background:
    Given I am logged in as "customer@example.com"
    And the following products are available:
      | product_id | name           | price | inventory | max_per_customer |
      | PROD-001   | iPhone 14 Pro  | 999   | 5         | 2                |
      | PROD-002   | MacBook Pro    | 2499  | 2         | 1                |

  Scenario: Successfully add available product to cart
    Given I am viewing product "iPhone 14 Pro"
    And my cart is empty
    When I select quantity "1"
    And I click "Add to Cart"
    Then I should see "iPhone 14 Pro added to cart" success message
    And my cart should contain 1 item
    And the cart total should be "$999.00"
    And the product inventory should be reduced to 4

  Scenario: Add product when approaching customer limit
    Given I have 1 "iPhone 14 Pro" in my cart already
    And I am viewing product "iPhone 14 Pro"
    When I select quantity "1"
    And I click "Add to Cart"
    Then I should see "iPhone 14 Pro added to cart" success message
    And I should see "Maximum 2 per customer - limit reached" warning
    And the "Add to Cart" button should be disabled

  Scenario: Attempt to add product exceeding customer limit
    Given I have 2 "iPhone 14 Pro" in my cart already
    And I am viewing product "iPhone 14 Pro"
    Then I should see "Maximum 2 per customer - limit reached" message
    And the "Add to Cart" button should be disabled
    And quantity selector should be disabled
```

---

#### Step 3: Tester Enhancements
**Tester identifies additional test scenarios:**

**QA:** "What about edge cases like network failures during add to cart?"
**QA:** "Do we need to test cart persistence across different devices?"
**QA:** "What happens with price changes while items are in cart?"

**Final comprehensive scenarios after QA input:**

```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to add products to my cart reliably
  So that I can purchase multiple items without losing my selections

  Background:
    Given I am logged in as "customer@example.com"
    And the following products are available:
      | product_id | name           | price | inventory | max_per_customer | status     |
      | PROD-001   | iPhone 14 Pro  | 999   | 5         | 2                | active     |
      | PROD-002   | MacBook Pro    | 2499  | 1         | 1                | active     |
      | PROD-003   | Old iPhone     | 599   | 0         | 3                | discontinued |

  # Happy Path Scenarios
  Scenario: Successfully add available product to empty cart
    Given I am viewing product "iPhone 14 Pro"
    And my cart is empty
    When I select quantity "1"
    And I click "Add to Cart"
    Then I should see "iPhone 14 Pro added to cart" success message
    And my cart icon should show "1" item
    And the cart total should be "$999.00"
    And I should see "Continue Shopping" and "View Cart" options

  Scenario: Add multiple different products to cart
    Given my cart is empty
    When I add the following products to my cart:
      | product        | quantity |
      | iPhone 14 Pro  | 1        |
      | MacBook Pro    | 1        |
    Then my cart should contain 2 items
    And the cart total should be "$3,498.00"
    And I should see both products listed in cart preview

  # Business Logic Scenarios  
  Scenario: Enforce customer purchase limits
    Given I have 1 "iPhone 14 Pro" in my cart already
    When I attempt to add 2 more "iPhone 14 Pro" items
    Then I should see "Exceeds maximum of 2 per customer" error
    And only 1 additional item should be added to my cart
    And I should see "Maximum limit reached" warning

  Scenario: Handle inventory constraints
    Given "MacBook Pro" has only 1 item in inventory
    And another customer has "MacBook Pro" in their cart
    When I try to add "MacBook Pro" to my cart
    Then I should see "Only 1 remaining - may not be available at checkout" warning
    But the item should still be added to my cart
    And I should see "Secure your item by checking out soon" message

  # Error and Edge Case Scenarios
  Scenario: Handle product becoming unavailable during add to cart
    Given I am viewing "iPhone 14 Pro" with 1 item in inventory
    And another customer purchases the last "iPhone 14 Pro"
    When I click "Add to Cart"
    Then I should see "Sorry, this item just sold out" error message
    And the product should not be added to my cart
    And I should see "Get notified when back in stock" option

  Scenario: Handle discontinued product
    Given I have a direct link to discontinued product "Old iPhone"
    When I try to access the product page
    Then I should see "This product is no longer available" message
    And I should not see "Add to Cart" button
    And I should see "View similar products" suggestions

  Scenario: Cart persistence across sessions
    Given I have 2 items in my cart
    When I log out and log back in
    Then my cart should still contain 2 items
    And all product details should be preserved
    And prices should be current (not cached)

  Scenario: Handle network failure during add to cart
    Given I am viewing "iPhone 14 Pro"
    When I click "Add to Cart" but the network request fails
    Then I should see "Connection error - please try again" message
    And I should see a "Retry" button
    And the product should not be added to cart
    When I click "Retry" and the network is restored
    Then the product should be successfully added to cart

  # Cross-Device Scenarios
  Scenario: Cart synchronization across devices
    Given I add "iPhone 14 Pro" to cart on my desktop
    When I login to the same account on my mobile device
    Then I should see "iPhone 14 Pro" in my mobile cart
    And the cart total should match across devices
    When I add "MacBook Pro" on mobile
    Then both devices should show 2 items in cart

  # Price Change Scenarios
  Scenario: Handle price changes for items in cart
    Given I have "iPhone 14 Pro" in my cart at "$999.00"
    When the product price changes to "$899.00"
    And I view my cart
    Then I should see "Price updated: iPhone 14 Pro now $899.00" notification
    And the cart total should reflect the new price
    And I should see "You saved $100.00!" message

  Scenario: Handle price increases for items in cart
    Given I have "MacBook Pro" in my cart at "$2,499.00"
    When the product price increases to "$2,599.00"
    And I view my cart
    Then I should see "Price updated: MacBook Pro now $2,599.00" notification
    And I should see "Price increased by $100.00" warning
    And I should have option to "Remove item" or "Accept new price"
```

**QA Additional Considerations:**
- Performance testing with multiple concurrent users
- Accessibility testing for cart interactions
- Mobile responsiveness of cart functionality
- Analytics tracking for cart abandonment

---

## Collaboration Example 2: User Registration Feature

### Three Amigos Discussion Flow

#### Initial Story
```
As a new visitor
I want to create an account
So I can make purchases and track my orders
```

#### Round 1: Business Requirements (PO Lead)

**Product Owner defines business value:**

```gherkin
Feature: User Account Registration
  As a new visitor to ShopEasy
  I want to create an account quickly and easily
  So that I can make purchases and track my order history

  Scenario: Quick registration process
    Given I am on the registration page
    When I provide my email and password
    And I click "Create Account"
    Then I should have a new account
    And I should be logged in automatically
```

**PO Business Context:**
- "We're losing customers due to lengthy registration"
- "Need to capture minimal info initially"
- "Should integrate with social login options"
- "GDPR compliance is required"

---

#### Round 2: Technical Feasibility (DEV Lead)

**Developer identifies technical requirements:**

**DEV Questions:**
- "What password complexity do we require?"
- "How do we handle duplicate email registrations?"
- "Do we need email verification before account activation?"
- "What about rate limiting for registration attempts?"

**Enhanced scenarios with technical considerations:**

```gherkin
Feature: User Account Registration
  As a new visitor to ShopEasy
  I want to create a secure account efficiently
  So that I can shop with confidence and track my orders

  Background:
    Given I am on the ShopEasy registration page
    And the following accounts already exist:
      | email                | status   | verified |
      | existing@example.com | active   | true     |
      | pending@example.com  | pending  | false    |

  Scenario: Successful registration with valid information
    When I fill in the registration form with:
      | field            | value                    |
      | email           | newuser@example.com       |
      | password        | SecurePass123!           |
      | confirm_password| SecurePass123!           |
      | first_name      | John                     |
      | last_name       | Smith                    |
    And I check "I agree to Terms and Privacy Policy"
    And I click "Create Account"
    Then I should see "Account created successfully!" message
    And I should receive verification email at "newuser@example.com"
    And I should be redirected to "Welcome" page
    And I should see "Please check your email to verify your account"

  Scenario: Password complexity validation
    When I enter password "weak"
    And I move to the next field
    Then I should see password strength indicator showing "Weak"
    And I should see requirements:
      | requirement               | status |
      | At least 8 characters     | ❌     |
      | One uppercase letter      | ❌     |
      | One number               | ❌     |
      | One special character    | ❌     |
    And the "Create Account" button should be disabled

  Scenario: Handle duplicate email registration
    When I fill in registration form with email "existing@example.com"
    And I complete all other required fields
    And I click "Create Account"
    Then I should see "An account with this email already exists" error
    And I should see "Sign in instead" link
    And I should see "Forgot password?" option
    And no new account should be created

  Scenario: Email verification requirement
    Given I have registered with email "newuser@example.com"
    But I have not verified my email yet
    When I try to login with my credentials
    Then I should see "Please verify your email before signing in" message
    And I should see "Resend verification email" link
    When I click "Resend verification email"
    Then I should receive a new verification email
    And I should see "Verification email sent" confirmation
```

---

#### Round 3: Quality and Risk Assessment (QA Lead)

**Tester expands with comprehensive testing scenarios:**

**QA Risk Analysis:**
- "What about malicious registration attempts?"
- "How do we handle partial registration failures?"
- "Need to test accessibility and mobile experience"
- "What about different email providers and formats?"

**Final comprehensive test scenarios:**

```gherkin
Feature: User Account Registration
  As a potential customer
  I want to create an account securely and accessibly
  So that I can shop confidently across all devices

  Background:
    Given the registration system is operational
    And the following test data exists:
      | email_domain    | status  | notes                    |
      | gmail.com       | allowed | Standard email provider  |
      | tempmail.com    | blocked | Temporary email service  |
      | company.com     | allowed | Corporate email          |

  # Happy Path Scenarios
  Scenario: Complete registration flow with email verification
    Given I am on the registration page
    When I register with valid details:
      | field            | value                    |
      | email           | test@gmail.com           |
      | password        | MySecure123!             |
      | confirm_password| MySecure123!             |
      | first_name      | Sarah                    |
      | last_name       | Johnson                  |
    And I agree to terms and privacy policy
    And I click "Create Account"
    Then I should see "Registration successful!" message
    And I should receive email verification at "test@gmail.com"
    When I click the verification link in the email
    Then my email should be verified
    And I should be able to login successfully
    And I should see "Welcome to ShopEasy, Sarah!" greeting

  # Security and Validation Scenarios
  Scenario Outline: Password strength validation with real-time feedback
    When I enter password "<password>"
    Then I should see strength indicator: "<strength>"
    And I should see feedback: "<feedback>"
    And create account button should be "<button_state>"

    Examples:
      | password      | strength | feedback                           | button_state |
      | weak          | Weak     | Too short, needs complexity        | disabled     |
      | Password1     | Fair     | Add special character              | disabled     |
      | Password1!    | Good     | Strong password                    | enabled      |
      | MySecure123!  | Strong   | Excellent password                 | enabled      |

  Scenario: Registration attempt with blocked email domain
    When I try to register with email "user@tempmail.com"
    And I complete all other required fields
    And I click "Create Account"
    Then I should see "Temporary email addresses are not allowed" error
    And I should see "Please use a permanent email address" guidance
    And no account should be created

  Scenario: Handle registration form validation errors
    When I submit registration form with invalid data:
      | field            | value         | expected_error               |
      | email           | invalid-email | Please enter valid email     |
      | password        | 123          | Password too weak            |
      | confirm_password| different    | Passwords do not match       |
      | first_name      | ""           | First name is required       |
    Then I should see all validation errors displayed
    And each invalid field should be highlighted
    And the form should not be submitted
    And cursor should focus on first invalid field

  # Accessibility and User Experience Scenarios
  Scenario: Registration form accessibility compliance
    Given I am using a screen reader
    When I navigate the registration form
    Then all form fields should have proper labels
    And validation errors should be announced
    And I should be able to complete registration using only keyboard
    And focus indicators should be clearly visible
    And form should follow logical tab order

  Scenario: Mobile registration experience
    Given I am using a mobile device
    When I access the registration page
    Then the form should be responsive and readable
    And virtual keyboard should not obscure form fields
    And I should be able to scroll to see validation errors
    And touch targets should be appropriately sized
    When I complete registration
    Then confirmation should be mobile-optimized

  # Error Handling and Recovery Scenarios
  Scenario: Handle partial registration failure
    Given I am completing registration
    When the network connection fails during account creation
    Then I should see "Registration incomplete - please try again" error
    And my form data should be preserved
    And I should see "Retry Registration" button
    When I click "Retry Registration" and connection is restored
    Then registration should complete successfully
    And I should not see duplicate account errors

  Scenario: Email verification link expiration
    Given I registered 25 hours ago (verification expires in 24 hours)
    When I click the expired verification link
    Then I should see "Verification link expired" message
    And I should see "Request new verification email" button
    When I click "Request new verification email"
    Then I should receive a fresh verification email
    And the new link should work for verification

  # Rate Limiting and Security Scenarios
  Scenario: Registration rate limiting protection
    When I attempt to register 6 accounts in 1 minute from same IP
    Then the 6th attempt should be blocked
    And I should see "Too many registration attempts" error
    And I should see "Please try again in 15 minutes" guidance
    When I wait 15 minutes and try again
    Then registration should work normally

  # Integration Scenarios
  Scenario: Social login registration option
    Given social login is enabled
    When I click "Register with Google"
    Then I should be redirected to Google OAuth
    When I complete Google authentication
    Then I should return to ShopEasy with account created
    And my profile should include Google profile information
    And I should not need separate email verification
    And I should be automatically logged in

  # Data Privacy and GDPR Scenarios
  Scenario: GDPR-compliant registration with consent tracking
    When I view the registration form
    Then I should see clear privacy policy link
    And consent checkboxes should be explicit and unchecked by default
    When I check "I agree to marketing emails" (optional)
    And I check "I agree to Terms and Privacy Policy" (required)
    And I complete registration
    Then my consent preferences should be recorded with timestamp
    And I should receive confirmation of my privacy choices
```

**QA Testing Considerations:**
- Cross-browser compatibility testing
- Performance testing with high registration volumes
- Security testing for SQL injection and XSS
- Email deliverability testing across providers
- Localization testing for international users

---

## Collaboration Benefits Demonstrated

### 1. Comprehensive Coverage
**Without Collaboration:**
- Basic happy path only
- Missing technical edge cases
- No consideration of user experience issues
- Limited security scenarios

**With Three Amigos:**
- Business value clearly defined
- Technical constraints identified
- Quality risks addressed
- User experience optimized

### 2. Shared Understanding
**Product Owner Gains:**
- Technical feasibility insights
- Quality risk awareness
- Implementation complexity understanding

**Developer Gains:**
- Clear acceptance criteria
- Business context for decisions
- Quality expectations

**Tester Gains:**
- Business priorities
- Technical architecture knowledge
- Risk prioritization guidance

### 3. Early Issue Detection
**Examples from Shopping Cart Collaboration:**
- Inventory concurrency issues identified before development
- Customer limits clarified upfront
- Price change handling defined early
- Cross-device synchronization requirements captured

**Examples from Registration Collaboration:**
- Password policy aligned with security requirements
- Email verification flow clarified
- Rate limiting requirements defined
- GDPR compliance integrated from start

### 4. Living Documentation
The scenarios created through Three Amigos collaboration serve as:
- **Requirements specification** for development
- **Test cases** for quality assurance
- **User documentation** for support teams
- **Acceptance criteria** for product validation

---

## Best Practices for Three Amigos Sessions

### 1. Preparation
- **PO:** Prepare user story with business context
- **DEV:** Review technical constraints and dependencies
- **QA:** Identify potential risk areas and edge cases

### 2. Session Structure
1. **Story Overview** (5 min) - PO explains business value
2. **Initial Scenarios** (15 min) - Collaborative scenario creation
3. **Technical Review** (10 min) - DEV input on feasibility
4. **Quality Enhancement** (10 min) - QA adds edge cases
5. **Final Review** (10 min) - Validate completeness

### 3. Documentation
- Capture all scenarios in Gherkin format
- Record decisions and assumptions
- Note any follow-up research needed
- Share scenarios with broader team

### 4. Success Metrics
- All stakeholders understand acceptance criteria
- Technical feasibility confirmed
- Quality risks identified and addressed
- Scenarios ready for implementation and testing

---

*These collaborative examples demonstrate how the Three Amigos approach creates better software through shared understanding, comprehensive scenario coverage, and early issue detection.*