# Example 01: Basic Feature File Structure

## 📋 Overview

This example demonstrates the fundamental structure and syntax of a well-written Gherkin feature file. It covers all essential elements including feature description, backgrounds, scenarios, and proper step organization.

## 🎯 Learning Objectives

- Understand the anatomy of a complete feature file
- Learn proper Gherkin keyword usage
- Master basic scenario organization
- Apply tagging and commenting strategies
- Follow naming conventions and best practices

## 📝 Complete Feature File Example

### File: `user-authentication.feature`

```gherkin
@authentication @smoke
Feature: User Authentication
  As a registered user
  I want to securely access my account
  So that I can use the application's personalized features

  # This feature covers the core authentication functionality
  # including login, logout, and session management
  # Security requirements: OAuth 2.0 compliant, session timeout after 30 minutes

  Background:
    Given the application server is running
    And the user database contains test accounts
    And the authentication service is available

  @login @happy-path
  Scenario: Successful login with valid credentials
    Given I am on the login page
    And I am not currently logged in
    When I enter valid email "john.doe@example.com"
    And I enter valid password "SecurePassword123!"
    And I click the login button
    Then I should be redirected to my dashboard
    And I should see a welcome message "Welcome back, John!"
    And my session should be active for 30 minutes

  @login @validation @error-handling
  Scenario: Failed login with incorrect password
    Given I am on the login page
    And a user account exists with email "john.doe@example.com"
    When I enter email "john.doe@example.com"
    And I enter incorrect password "WrongPassword"
    And I click the login button
    Then I should remain on the login page
    And I should see an error message "Invalid email or password"
    And the password field should be cleared
    And my login attempt should be logged for security

  @login @validation @security
  Scenario: Account lockout after multiple failed attempts
    Given I am on the login page
    And a user account exists with email "john.doe@example.com"
    And the account has 4 previous failed login attempts
    When I enter email "john.doe@example.com"
    And I enter incorrect password "WrongPassword"
    And I click the login button
    Then I should see an error message "Account temporarily locked"
    And the account should be locked for 15 minutes
    And an account lockout notification should be sent to the user
    And the lockout event should be logged

  @logout @session-management
  Scenario: User initiated logout
    Given I am logged in as "john.doe@example.com"
    And I am on any page within the application
    When I click the logout button
    Then I should be redirected to the login page
    And my session should be terminated
    And I should see a confirmation message "You have been logged out"
    And any cached user data should be cleared

  @session @timeout @security
  Scenario: Automatic session timeout
    Given I am logged in as "john.doe@example.com"
    And I have been inactive for 30 minutes
    When I attempt to access any protected page
    Then I should be redirected to the login page
    And I should see a message "Your session has expired"
    And my previous session data should be cleared
    And I should be able to log in again

  @login @accessibility
  Scenario: Login page accessibility compliance
    Given I am on the login page
    When I navigate using only keyboard controls
    Then all interactive elements should be accessible via tab navigation
    And form labels should be properly associated with input fields
    And error messages should be announced by screen readers
    And the page should meet WCAG 2.1 AA standards
```

## 📊 Structure Analysis

### Feature Header Components

#### 1. **Tags** (`@authentication @smoke`)
```gherkin
@authentication @smoke
```
- **Purpose**: Categorize and filter scenarios during execution
- **Best Practice**: Use meaningful, hierarchical tags
- **Common Patterns**: `@smoke`, `@regression`, `@feature-name`, `@priority-high`

#### 2. **Feature Declaration**
```gherkin
Feature: User Authentication
```
- **Purpose**: Provides a clear, concise feature name
- **Best Practice**: Use noun phrases that describe business capability
- **Guidelines**: Keep under 50 characters, avoid technical jargon

#### 3. **Feature Narrative** (As/I want/So that)
```gherkin
As a registered user
I want to securely access my account
So that I can use the application's personalized features
```
- **Purpose**: Explains business value and user perspective
- **Structure**: Role → Goal → Benefit
- **Best Practice**: Focus on business value, not technical implementation

#### 4. **Feature Description Comments**
```gherkin
# This feature covers the core authentication functionality
# including login, logout, and session management
# Security requirements: OAuth 2.0 compliant, session timeout after 30 minutes
```
- **Purpose**: Provide additional context and constraints
- **Content**: Business rules, technical requirements, dependencies
- **Best Practice**: Include only essential information

### Background Section

```gherkin
Background:
  Given the application server is running
  And the user database contains test accounts
  And the authentication service is available
```

#### **Purpose and Usage**
- **Common Setup**: Steps that apply to all scenarios in the feature
- **DRY Principle**: Avoid repeating setup steps across scenarios
- **Best Practice**: Keep background minimal and focused on essential prerequisites

#### **What to Include**
- System state prerequisites
- Test data setup
- Service availability checks
- Common navigation steps

#### **What to Avoid**
- Scenario-specific setup
- Complex business logic
- Variable data that changes per scenario

### Scenario Structure

#### **Complete Scenario Anatomy**
```gherkin
@login @happy-path
Scenario: Successful login with valid credentials
  Given I am on the login page
  And I am not currently logged in
  When I enter valid email "john.doe@example.com"
  And I enter valid password "SecurePassword123!"
  And I click the login button
  Then I should be redirected to my dashboard
  And I should see a welcome message "Welcome back, John!"
  And my session should be active for 30 minutes
```

#### **Component Breakdown**

**1. Scenario Tags** (`@login @happy-path`)
- Purpose: Scenario-level categorization
- Usage: Execution filtering, test organization
- Examples: `@happy-path`, `@error-handling`, `@edge-case`

**2. Scenario Title** (`Successful login with valid credentials`)
- Purpose: Clear description of the test case
- Format: Outcome-focused, descriptive phrases
- Length: Ideally under 60 characters

**3. Given Steps** (Context/Preconditions)
```gherkin
Given I am on the login page
And I am not currently logged in
```
- Purpose: Establish necessary context
- Focus: System state, user state, data prerequisites
- Best Practice: Only include relevant context

**4. When Steps** (Actions/Events)
```gherkin
When I enter valid email "john.doe@example.com"
And I enter valid password "SecurePassword123!"
And I click the login button
```
- Purpose: Describe the action being tested
- Focus: User interactions, system events
- Best Practice: Use active voice, be specific about actions

**5. Then Steps** (Expected Outcomes)
```gherkin
Then I should be redirected to my dashboard
And I should see a welcome message "Welcome back, John!"
And my session should be active for 30 minutes
```
- Purpose: Define expected results
- Focus: Observable outcomes, state changes
- Best Practice: Be specific and measurable

## 🎨 Gherkin Style Guidelines

### Naming Conventions

#### **Feature Names**
```gherkin
✅ Good Examples:
- User Authentication
- Shopping Cart Management
- Order Processing Workflow
- Customer Support Ticketing

❌ Poor Examples:
- Login Tests
- Test Suite 1
- UI Validation
- System Check
```

#### **Scenario Names**
```gherkin
✅ Good Examples:
- Successful login with valid credentials
- Account lockout after multiple failed attempts
- Password reset via email verification
- Session timeout redirects to login

❌ Poor Examples:
- Test case 1
- Login test
- Check validation
- Verify functionality
```

### Step Writing Patterns

#### **Given Step Patterns**
```gherkin
# User State
Given I am logged in as "user@example.com"
Given I am not currently authenticated
Given I have an active session

# System State  
Given the authentication service is available
Given the user database contains test accounts
Given rate limiting is enabled

# Data State
Given a user account exists with email "test@example.com"
Given the account has 3 failed login attempts
Given the user has premium account privileges
```

#### **When Step Patterns**
```gherkin
# User Actions
When I enter email "user@example.com"
When I click the login button
When I navigate to the dashboard

# System Events
When the session expires
When the authentication service becomes unavailable
When a password reset is requested

# Time-based Events
When 30 minutes have passed
When the daily limit is reached
When the maintenance window begins
```

#### **Then Step Patterns**
```gherkin
# UI Validation
Then I should see the dashboard page
Then the error message "Invalid credentials" should be displayed
Then the login form should be cleared

# State Validation
Then my session should be active
Then the account should be locked
Then the user should be logged out

# System Behavior
Then a notification email should be sent
Then the login attempt should be logged
Then the session data should be cleared
```

## 🏷️ Tagging Strategy

### Hierarchical Tag Organization

```gherkin
# Feature Level Tags
@authentication          # Functional area
@core-feature            # Business criticality
@smoke                   # Test suite classification

# Scenario Level Tags  
@login @logout           # Specific functionality
@happy-path @error-handling  # Test case type
@security @accessibility    # Quality attributes
@integration @unit          # Test scope
```

### Common Tag Categories

#### **Functional Tags**
- `@authentication`, `@authorization`
- `@user-management`, `@account-settings`
- `@shopping-cart`, `@checkout`
- `@search`, `@navigation`

#### **Test Type Tags**
- `@smoke` - Critical functionality tests
- `@regression` - Full feature validation
- `@integration` - System integration tests
- `@sanity` - Basic functionality checks

#### **Quality Attribute Tags**
- `@security` - Security-related scenarios
- `@performance` - Performance validation
- `@accessibility` - Accessibility compliance
- `@usability` - User experience validation

#### **Execution Tags**
- `@manual` - Requires manual execution
- `@automated` - Fully automated scenarios
- `@wip` - Work in progress
- `@skip` - Temporarily disabled

## 📝 Documentation Integration

### Comments for Context

```gherkin
Feature: User Authentication
  # Business Context:
  # Critical revenue path - affects user retention and security compliance
  # Must maintain 99.9% uptime during business hours
  # Integrates with: OAuth provider, user database, audit logging
  
  # Technical Context:
  # Session timeout: 30 minutes inactive, 8 hours maximum
  # Rate limiting: 5 attempts per IP per minute
  # Security: OWASP compliance required
```

### Living Documentation Elements

```gherkin
# Feature Metadata
# Owner: Product Team (product@company.com)
# Last Updated: 2024-01-15
# Review Cycle: Monthly
# Dependencies: OAuth Service, User Database
# Performance SLA: Login < 2 seconds, 99.9% success rate
```

## ✅ Quality Checklist

### Structure Quality
- [ ] Feature has clear business narrative (As/I want/So that)
- [ ] Background contains only shared prerequisites
- [ ] Scenarios focus on single business outcomes
- [ ] Steps follow Given-When-Then pattern correctly
- [ ] Tags are meaningful and consistently applied

### Content Quality
- [ ] Business language used throughout
- [ ] Scenario names describe expected outcomes
- [ ] Steps are at appropriate level of abstraction
- [ ] Real data examples provided where relevant
- [ ] Edge cases and error conditions covered

### Collaboration Quality
- [ ] Stakeholders can understand without technical knowledge
- [ ] Scenarios reflect actual business processes
- [ ] Requirements are testable and specific
- [ ] Maintenance information is documented
- [ ] Regular review process is established

## 🚀 Advanced Patterns

### Conditional Logic with Rules

```gherkin
Feature: Account Security

  Rule: Passwords must meet complexity requirements
    
    Scenario: Strong password accepted
      Given I am creating a new account
      When I provide password "MySecure123!@#"
      Then the password should be accepted
      
    Scenario: Weak password rejected
      Given I am creating a new account  
      When I provide password "123456"
      Then I should see "Password does not meet requirements"

  Rule: Account lockout prevents brute force attacks
    
    Scenario: Account locks after 5 failed attempts
      Given I have failed to log in 4 times
      When I fail to log in again
      Then my account should be locked for 15 minutes
```

### Multiple Example Categories

```gherkin
@login @data-driven
Scenario Outline: Login validation with various inputs
  Given I am on the login page
  When I enter email "<email>" and password "<password>"
  And I submit the login form
  Then I should see "<result>"

  Examples: Valid Credentials
    | email              | password        | result           |
    | user@example.com   | ValidPass123!   | Welcome message  |
    | admin@company.org  | AdminSecure456@ | Admin dashboard  |

  Examples: Invalid Credentials  
    | email              | password        | result           |
    | invalid@email      | ValidPass123!   | Invalid email    |
    | user@example.com   | wrongpassword   | Invalid password |
    | user@example.com   | 123            | Password too weak |
```

## 📚 Summary

This example demonstrates:

1. **Complete Feature Structure** - All essential Gherkin elements
2. **Proper Syntax Usage** - Correct keyword application
3. **Business Focus** - Stakeholder-friendly language
4. **Quality Organization** - Logical scenario grouping
5. **Best Practices** - Industry-standard patterns

### Key Takeaways

- **Structure Matters**: Consistent organization improves readability
- **Business Language**: Focus on outcomes, not implementation
- **Tag Strategy**: Use hierarchical, meaningful categorization
- **Documentation**: Include context without overwhelming detail
- **Quality Focus**: Every element should add value

### Next Steps

With this foundation, you can:
- Create your own feature files using these patterns
- Adapt the structure to your domain and requirements
- Build scenario libraries for common business processes
- Establish team standards based on these examples

Remember: Great feature files are living documents that evolve with your understanding of the business domain! 🎯