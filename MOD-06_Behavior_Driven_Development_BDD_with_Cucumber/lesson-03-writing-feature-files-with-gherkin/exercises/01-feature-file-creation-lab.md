# Exercise 01: Feature File Creation Lab

## 🎯 Exercise Overview

This hands-on lab provides practical experience in creating well-structured feature files using proper Gherkin syntax. You'll work through progressively complex scenarios, applying best practices and business-focused language to create maintainable, testable specifications.

## 📚 Learning Objectives

By completing this exercise, you will:
- Apply fundamental Gherkin syntax correctly in real scenarios
- Create business-focused feature files that serve as living documentation
- Structure scenarios for clarity, maintainability, and effective testing
- Use proper tagging strategies for test organization and execution
- Write effective backgrounds and scenario descriptions
- Apply the BRIEF principle (Business, Real, Intention, Essential, Focused)

## ⏱️ Time Allocation
- **Total Time**: 90 minutes
- **Part A**: Basic Feature Creation (30 minutes)
- **Part B**: Business Rule Modeling (25 minutes)
- **Part C**: Scenario Organization (20 minutes)
- **Part D**: Review and Refinement (15 minutes)

---

## 📋 Part A: Basic Feature Creation (30 minutes)

### Task A1: E-commerce Shopping Cart Feature

**Scenario**: You're working for an online bookstore called "ReadMore Books" that needs to implement a shopping cart feature. The business stakeholders have provided the following requirements:

#### Business Requirements:
- Customers can add books to their shopping cart
- Customers can view their cart contents
- Customers can update quantities of items in their cart
- Customers can remove items from their cart
- Cart should show total price including tax
- Cart should persist between browser sessions for logged-in users

#### Your Task:
Create a feature file named `shopping-cart.feature` that captures these requirements using proper Gherkin syntax.

#### Guidelines:
- Start with a descriptive feature header that explains business value
- Include appropriate tags for organization
- Use meaningful scenario names that describe business outcomes
- Focus on behavior, not implementation details
- Include edge cases and error scenarios

#### Template to Start:
```gherkin
@shopping-cart @ecommerce @core-functionality
Feature: Shopping Cart Management
  As a [WHO]
  I want to [WHAT]
  So that [WHY - business value]

  # Add your scenarios here
```

#### Success Criteria:
- [ ] Feature header clearly describes business value
- [ ] At least 5 scenarios covering main user journeys
- [ ] Proper Given-When-Then structure
- [ ] Business-focused language (no technical implementation details)
- [ ] Appropriate use of scenario tags
- [ ] Include at least one error scenario

---

### Task A2: User Account Registration Feature

**Scenario**: ReadMore Books needs a user registration system that ensures data quality and provides a smooth onboarding experience.

#### Business Requirements:
- New customers can create accounts with email and password
- System validates email format and password strength
- Duplicate email addresses are prevented
- New users receive welcome email after successful registration
- Account creation fails gracefully with helpful error messages
- Registration process should be quick and user-friendly

#### Your Task:
Create a feature file named `user-registration.feature` that addresses these business needs.

#### Special Focus Areas:
- Data validation scenarios
- Error handling and user feedback
- Success path with clear business outcomes
- Security considerations (without exposing technical details)

#### Success Criteria:
- [ ] Clear distinction between valid and invalid registration attempts
- [ ] User-friendly error scenarios
- [ ] Business-focused success outcomes
- [ ] Proper scenario organization with tags

---

## 📊 Part B: Business Rule Modeling (25 minutes)

### Task B1: Discount and Promotion Engine

**Scenario**: ReadMore Books wants to implement a flexible promotion system to drive sales and reward loyal customers.

#### Business Rules:
1. **Volume Discounts**: 
   - 10% off orders over $50
   - 15% off orders over $100
   - 20% off orders over $200

2. **First-Time Customer**: 
   - 15% off first purchase with code "WELCOME15"

3. **Loyalty Program**:
   - Bronze members: 5% off all purchases
   - Silver members: 10% off all purchases  
   - Gold members: 15% off all purchases

4. **Seasonal Promotions**:
   - Summer Reading: 25% off fiction books (June-August)
   - Back to School: 20% off educational books (August-September)

5. **Stacking Rules**:
   - Loyalty discounts stack with volume discounts
   - Promotional codes cannot be combined with other offers
   - Maximum discount of 40% on any single order

#### Your Task:
Create a feature file named `promotional-discounts.feature` that models these complex business rules clearly and testably.

#### Guidelines:
- Use scenario outlines where appropriate for multiple similar cases
- Create clear examples that business stakeholders can understand
- Focus on the business outcomes of discount application
- Consider edge cases and rule conflicts
- Organize scenarios logically by discount type

#### Success Criteria:
- [ ] All business rules are captured as testable scenarios
- [ ] Complex rules are broken down into understandable scenarios
- [ ] Appropriate use of scenario outlines for data-driven testing
- [ ] Clear handling of rule conflicts and edge cases
- [ ] Business-focused language throughout

---

### Task B2: Inventory Management Rules

**Scenario**: ReadMore Books needs to manage inventory levels and handle out-of-stock situations gracefully.

#### Business Rules:
- Books with quantity 0 show as "Out of Stock"
- Books with quantity 1-5 show as "Only X left in stock"
- Books with quantity 6+ show as "In Stock"
- Customers can backorder out-of-stock items
- Pre-orders are available for upcoming releases
- System should prevent overselling

#### Your Task:
Create scenarios that capture inventory business logic in `inventory-management.feature`.

#### Focus on:
- Customer experience with different stock levels
- Business logic for stock display messages
- Handling of edge cases (exactly 0, exactly 1, etc.)
- Backorder and pre-order workflows

---

## 🎨 Part C: Scenario Organization (20 minutes)

### Task C1: Background Optimization

**Scenario**: Review your feature files from Parts A and B. Identify common setup steps that could be moved to Background sections.

#### Your Task:
Refactor at least two of your feature files to use Background sections effectively.

#### Guidelines:
- Background should contain steps that are truly common to ALL scenarios
- Don't include steps that might change between scenarios
- Keep backgrounds concise and focused
- Ensure backgrounds enhance readability

#### Before/After Example:
```gherkin
# Before: Repetitive setup in each scenario
Scenario: Customer adds book to cart
  Given I am on the ReadMore Books website
  And I am logged in as a customer
  And there are books available in the catalog
  When I add "The Great Gatsby" to my cart
  Then my cart should contain 1 item

Scenario: Customer views empty cart
  Given I am on the ReadMore Books website  
  And I am logged in as a customer
  And there are books available in the catalog
  When I view my shopping cart
  Then I should see "Your cart is empty"

# After: Common setup moved to Background
Background:
  Given I am on the ReadMore Books website
  And I am logged in as a customer
  And there are books available in the catalog

Scenario: Customer adds book to cart
  When I add "The Great Gatsby" to my cart
  Then my cart should contain 1 item

Scenario: Customer views empty cart
  When I view my shopping cart
  Then I should see "Your cart is empty"
```

---

### Task C2: Tagging Strategy Implementation

**Scenario**: Implement a comprehensive tagging strategy across all your feature files.

#### Required Tag Categories:
1. **Feature Area**: `@shopping-cart`, `@user-management`, `@promotions`, `@inventory`
2. **Test Type**: `@smoke`, `@regression`, `@integration`
3. **Priority**: `@critical`, `@high`, `@medium`, `@low`
4. **Business Impact**: `@revenue-critical`, `@customer-experience`, `@compliance`
5. **Execution**: `@fast`, `@slow`, `@data-dependent`

#### Your Task:
Add appropriate tags to all scenarios in your feature files, considering:
- Which tests should run in smoke test suites
- Which scenarios are critical for revenue
- Which tests might be slow due to complex setup
- Which scenarios test core vs. edge case functionality

#### Example:
```gherkin
@shopping-cart @critical @revenue-critical @smoke
Scenario: Customer completes purchase successfully
  # This scenario is tagged as critical, revenue-impacting, and part of smoke tests

@promotions @medium @customer-experience @data-dependent  
Scenario: Loyalty discount applies correctly for silver members
  # This scenario tests promotions, has medium priority, affects CX, needs test data
```

---

## 🔍 Part D: Review and Refinement (15 minutes)

### Task D1: BRIEF Principle Evaluation

Review each of your feature files against the BRIEF principle:

#### **B** - Business Language
- [ ] Are scenarios written in business terms?
- [ ] Would a non-technical stakeholder understand them?
- [ ] Are technical implementation details avoided?

#### **R** - Real Examples
- [ ] Do scenarios use realistic data and situations?
- [ ] Are the examples meaningful to actual users?
- [ ] Do they reflect real business workflows?

#### **I** - Intention Focused  
- [ ] Is the business intention clear in each scenario?
- [ ] Do scenarios focus on outcomes rather than processes?
- [ ] Is the value to users/business evident?

#### **E** - Essential Information
- [ ] Are scenarios concise without unnecessary details?
- [ ] Is all information relevant to the behavior being tested?
- [ ] Are there any redundant or overly complex steps?

#### **F** - Focused Scope
- [ ] Does each scenario test one specific behavior?
- [ ] Are scenarios independent and self-contained?
- [ ] Is the scope appropriate for meaningful testing?

---

### Task D2: Peer Review Preparation

Prepare your feature files for peer review by:

1. **Adding Comments**: Include brief comments explaining complex business rules
2. **Checking Formatting**: Ensure consistent indentation and spacing
3. **Validating Syntax**: Review for proper Gherkin keyword usage
4. **Business Alignment**: Confirm scenarios reflect actual business requirements

#### Self-Review Checklist:
- [ ] All feature files follow consistent naming conventions
- [ ] Scenarios are organized logically within each feature
- [ ] Tags are applied consistently and meaningfully
- [ ] Business language is used throughout
- [ ] Edge cases and error scenarios are included
- [ ] Each scenario is independently testable

---

## 💡 Tips for Success

### Writing Effective Scenarios
1. **Start with the outcome**: Write "Then" steps first to clarify what you're testing
2. **Use concrete examples**: Instead of "some books", use "3 books totaling $45.99"
3. **Focus on behavior**: Describe what the system should do, not how it should do it
4. **Keep scenarios short**: Aim for 3-7 steps per scenario when possible

### Common Mistakes to Avoid
- **Technical language**: Avoid database, API, or UI implementation details
- **Too many scenarios in one file**: Split large features into focused files
- **Weak assertions**: Make "Then" steps specific and verifiable
- **Missing edge cases**: Don't forget error conditions and boundary values
- **Inconsistent language**: Use same terms throughout (e.g., "customer" vs "user")

### Business Collaboration
- **Involve stakeholders**: These scenarios should be reviewable by business experts
- **Use domain language**: Adopt terminology familiar to business users
- **Focus on value**: Each scenario should test something that matters to the business
- **Keep it current**: Feature files should reflect current business rules and processes

---

## 🎯 Deliverables

By the end of this exercise, you should have:

1. **shopping-cart.feature** - Complete feature file with 5+ scenarios
2. **user-registration.feature** - Registration scenarios with validation logic
3. **promotional-discounts.feature** - Complex business rule scenarios with data examples
4. **inventory-management.feature** - Stock level and availability scenarios
5. **Refactored files** - Updated versions using Background sections appropriately
6. **Tagged scenarios** - Comprehensive tagging strategy applied
7. **Self-review notes** - Documentation of BRIEF principle evaluation

Each feature file should demonstrate:
- ✅ Proper Gherkin syntax and structure
- ✅ Business-focused language and scenarios
- ✅ Appropriate use of tags for organization
- ✅ Clear, testable acceptance criteria
- ✅ Edge cases and error scenarios
- ✅ Maintainable and readable format

---

## 🔗 Next Steps

After completing this lab:
1. **Review with peers** - Share your feature files for feedback
2. **Stakeholder validation** - Have business experts review for accuracy
3. **Technical review** - Ensure scenarios are implementable and testable
4. **Integration planning** - Consider how these scenarios fit into your overall test strategy

This foundational work will prepare you for the next exercise on Scenario Outline mastery and advanced data-driven testing patterns!

---

## 📚 Resources for Reference

- **Gherkin Syntax Guide**: Refer to lesson content for keyword usage
- **BRIEF Principle**: Business, Real, Intention, Essential, Focused
- **Tag Strategy Examples**: See lesson examples for comprehensive tagging approaches
- **Business Language Tips**: Focus on outcomes, use domain terminology, avoid technical details