# Exercise 02: Scenario Outline Mastery

## 🎯 Exercise Overview

This intensive workshop focuses on mastering Scenario Outlines for data-driven testing. You'll learn to design effective data tables, create maintainable parameterized scenarios, and apply advanced patterns for comprehensive test coverage while maintaining readability and business alignment.

## 📚 Learning Objectives

By completing this exercise, you will:
- Master Scenario Outline syntax and advanced patterns
- Design effective data tables for comprehensive test coverage
- Create maintainable parameterized scenarios that scale
- Apply data-driven testing strategies for business rule validation
- Structure complex data relationships in readable formats
- Optimize scenario outlines for both coverage and maintainability

## ⏱️ Time Allocation
- **Total Time**: 120 minutes
- **Part A**: Basic Scenario Outline Creation (35 minutes)
- **Part B**: Advanced Data Relationships (30 minutes)
- **Part C**: Business Rule Validation (30 minutes)
- **Part D**: Optimization and Best Practices (25 minutes)

---

## 📊 Part A: Basic Scenario Outline Creation (35 minutes)

### Task A1: User Login Validation Matrix

**Business Context**: ReadMore Books needs comprehensive login validation that handles various input combinations while providing clear, helpful feedback to users.

#### Business Requirements:
- Email format validation (valid/invalid formats)
- Password strength requirements (minimum 8 characters, mixed case, numbers, symbols)
- Account status checking (active, inactive, locked, pending)
- Graceful error handling with specific user feedback
- Security logging for failed attempts

#### Your Task:
Create a scenario outline that tests all combinations of login validation rules.

#### Template to Start:
```gherkin
@login-validation @security @data-driven
Feature: User Login Validation
  As ReadMore Books platform
  I want to validate user login attempts comprehensively
  So that we maintain security while providing excellent user experience

  Background:
    Given the user authentication service is operational
    And user accounts exist in the system
    And security logging is enabled

  @comprehensive-validation @boundary-testing
  Scenario Outline: Login validation handles various input combinations
    Given a user account with status <accountStatus>
    When login is attempted with:
      | Field    | Value      |
      | email    | <email>    |
      | password | <password> |
    Then the login result should be <loginResult>
    And the user should see message <userMessage>
    And the system should log <logEntry>

    Examples: Valid Login Combinations
      # Add your data here

    Examples: Invalid Email Formats
      # Add your data here

    Examples: Password Validation Failures
      # Add your data here

    Examples: Account Status Issues
      # Add your data here
```

#### Success Criteria:
- [ ] At least 20 total examples across all categories
- [ ] Valid scenarios (minimum 3 examples)
- [ ] Invalid email formats (minimum 5 examples)
- [ ] Password validation failures (minimum 6 examples)
- [ ] Account status issues (minimum 4 examples)
- [ ] Clear, specific user messages for each scenario
- [ ] Appropriate log entries for security tracking

#### Guidelines:
- Use realistic email examples (both valid and invalid)
- Include edge cases for password validation
- Consider account status combinations
- Make user messages helpful and specific
- Ensure log entries support security monitoring

---

### Task A2: Product Search and Filtering

**Business Context**: ReadMore Books customers need powerful search functionality that handles various search criteria and delivers relevant results efficiently.

#### Business Requirements:
- Search by title, author, genre, ISBN
- Filter by price range, availability, publication year
- Sort by relevance, price (low to high, high to low), publication date, customer rating
- Handle zero results gracefully
- Provide search suggestions for typos
- Support pagination for large result sets

#### Your Task:
Create scenario outlines that comprehensively test the search and filtering functionality.

#### Focus Areas:
1. **Search Input Variations**: Different search terms and combinations
2. **Filter Combinations**: Price ranges, availability, categories
3. **Sort Options**: Different sorting criteria and directions
4. **Edge Cases**: Empty searches, no results, special characters

#### Template Structure:
```gherkin
@product-search @customer-experience @data-driven
Feature: Product Search and Filtering
  As ReadMore Books customer
  I want to find books efficiently using search and filters
  So that I can quickly discover books that match my interests

  # Create multiple scenario outlines covering different aspects
```

#### Success Criteria:
- [ ] Separate scenario outlines for search inputs, filters, and sorting
- [ ] Minimum 15 examples per scenario outline
- [ ] Business-focused assertions (user experience, not technical details)
- [ ] Edge cases and error scenarios covered
- [ ] Realistic book data in examples

---

## 🔄 Part B: Advanced Data Relationships (30 minutes)

### Task B1: Order Processing Workflow

**Business Context**: ReadMore Books processes orders through multiple stages with complex business rules affecting pricing, shipping, and customer communication.

#### Business Rules:
- **Order Value Tiers**: 
  - Under $25: Standard shipping, 5-7 days
  - $25-$75: Free standard shipping, expedited available
  - Over $75: Free expedited shipping, overnight available

- **Customer Types**:
  - New: Welcome discount eligible, email verification required
  - Loyal: Loyalty points earned, priority processing
  - VIP: Express processing, dedicated support

- **Inventory Scenarios**:
  - In stock: Immediate processing
  - Low stock: Priority allocation
  - Backorder: Extended shipping timeline
  - Pre-order: Release date dependent

#### Your Task:
Create a scenario outline that tests the intersection of these business rules.

#### Example Structure:
```gherkin
@order-processing @business-rules @multi-dimensional
Scenario Outline: Order processing applies correct business rules
  Given a customer with profile:
    | Attribute       | Value              |
    | customerType    | <customerType>     |
    | loyaltyLevel    | <loyaltyLevel>     |
    | membershipYears | <membershipYears>  |
  And an order with characteristics:
    | Attribute      | Value            |
    | orderValue     | <orderValue>     |
    | bookCount      | <bookCount>      |
    | inventoryStatus| <inventoryStatus>|
  When order processing is initiated
  Then the order should be processed with:
    | Processing Aspect | Expected Value     |
    | shippingOption    | <shippingOption>   |
    | processingTime    | <processingTime>   |
    | loyaltyPoints     | <loyaltyPoints>    |
    | specialHandling   | <specialHandling>  |
    | customerContact   | <customerContact>  |

  Examples: # Your comprehensive examples here
```

#### Success Criteria:
- [ ] At least 25 examples covering rule intersections
- [ ] Clear organization by customer type or order characteristics
- [ ] Business outcomes focused (shipping options, timelines, points)
- [ ] Edge cases where rules might conflict
- [ ] Realistic customer and order data

---

### Task B2: Dynamic Pricing Engine

**Business Context**: ReadMore Books implements dynamic pricing based on multiple factors including demand, inventory levels, customer segments, and competitive positioning.

#### Pricing Factors:
1. **Base Price**: List price from publisher
2. **Demand Level**: High, Medium, Low (affects markup/discount)
3. **Inventory Position**: Overstocked, Normal, Low, Critical
4. **Customer Segment**: New, Regular, Loyal, VIP
5. **Seasonal Factors**: Holiday rush, back-to-school, summer lull
6. **Competitive Position**: Above market, At market, Below market

#### Your Task:
Design a scenario outline that tests how these factors combine to determine final pricing.

#### Considerations:
- Use realistic price ranges and percentages
- Show how multiple factors interact
- Include edge cases where factors conflict
- Ensure business logic is clear and testable

---

## 🎯 Part C: Business Rule Validation (30 minutes)

### Task C1: Subscription Billing Scenarios

**Business Context**: ReadMore Books offers premium subscriptions with complex billing rules including prorations, plan changes, and usage-based charges.

#### Subscription Rules:
- Monthly, quarterly, and annual billing cycles
- Mid-cycle plan upgrades and downgrades with prorations
- Usage-based charges for premium features
- Discounts for annual commitments
- Grace periods for payment failures
- Automatic renewals with cancellation options

#### Your Task:
Create comprehensive scenario outlines that validate subscription billing accuracy.

#### Key Areas to Cover:
1. **New Subscriptions**: Different plans and billing cycles
2. **Plan Changes**: Upgrades, downgrades, proration calculations
3. **Usage Charges**: Overage billing, usage tracking
4. **Renewals**: Automatic renewals, failed payments, cancellations

#### Example Pattern:
```gherkin
@subscription-billing @revenue-critical @financial-accuracy
Scenario Outline: Subscription billing calculates charges correctly
  Given a customer subscription:
    | Subscription Detail | Value              |
    | currentPlan         | <currentPlan>      |
    | billingCycle        | <billingCycle>     |
    | startDate           | <startDate>        |
    | usageThisMonth      | <usageThisMonth>   |
    | accountCredit       | <accountCredit>    |
  And billing date is <billingDate>
  When monthly billing is processed
  Then the billing should calculate:
    | Billing Component | Amount          |
    | basePlanCharge    | <basePlanCharge>|
    | usageCharges      | <usageCharges>  |
    | discountsApplied  | <discounts>     |
    | creditsApplied    | <creditsUsed>   |
    | totalCharge       | <totalCharge>   |
    | nextBillingDate   | <nextBilling>   |

  Examples: # Your billing scenarios here
```

#### Success Criteria:
- [ ] Mathematical accuracy in all calculations
- [ ] Edge cases for prorations and usage charges
- [ ] Different subscription plans and cycles covered
- [ ] Business rules clearly validated through examples
- [ ] Realistic dates and amounts used

---

### Task C2: Return and Refund Policy

**Business Context**: ReadMore Books has a customer-friendly return policy with specific rules based on time elapsed, item condition, and customer history.

#### Return Policy Rules:
- **Time Limits**: 30 days for new items, 14 days for digital content
- **Condition Requirements**: New/unopened, lightly used, damaged
- **Customer History**: Return frequency, account standing
- **Item Types**: Physical books, digital books, special editions, pre-orders
- **Refund Methods**: Original payment, store credit, exchange only

#### Your Task:
Model the return policy as comprehensive scenario outlines.

#### Consider:
- Different combinations of time elapsed and item condition
- Customer history impact on return eligibility
- Various item types and their specific rules
- Business outcomes for each scenario

---

## ⚡ Part D: Optimization and Best Practices (25 minutes)

### Task D1: Data Table Optimization

**Objective**: Review and optimize your scenario outlines from previous tasks for maintainability and readability.

#### Optimization Techniques:

##### **1. Logical Grouping**
```gherkin
# Before: Mixed scenarios in one table
Examples: All Login Scenarios
  | email           | password   | account    | result   | message        |
  | valid@test.com  | Valid123!  | ACTIVE     | SUCCESS  | Welcome back   | 
  | invalid         | Valid123!  | ACTIVE     | FAILED   | Invalid email  |
  | valid@test.com  | weak       | ACTIVE     | FAILED   | Password weak  |
  | valid@test.com  | Valid123!  | LOCKED     | FAILED   | Account locked |

# After: Organized by failure type
Examples: Valid Login Attempts
  | email           | password   | account | result  | message      |
  | valid@test.com  | Valid123!  | ACTIVE  | SUCCESS | Welcome back |

Examples: Email Format Failures  
  | email           | password   | account | result | message       |
  | invalid         | Valid123!  | ACTIVE  | FAILED | Invalid email |
  | @missing.com    | Valid123!  | ACTIVE  | FAILED | Invalid email |

Examples: Password Validation Failures
  | email           | password | account | result | message       |
  | valid@test.com  | weak     | ACTIVE  | FAILED | Password weak |
  | valid@test.com  | 123      | ACTIVE  | FAILED | Password weak |
```

##### **2. Meaningful Parameter Names**
```gherkin
# Before: Generic names
| input1     | input2 | result1 | result2     |
| something  | other  | success | good message|

# After: Business-focused names  
| customerEmail | loginPassword | authResult | userFeedback |
| john@test.com | SecurePass!   | ALLOWED    | Welcome back |
```

#### Your Task:
1. **Review** all your scenario outlines from previous tasks
2. **Reorganize** examples into logical groups
3. **Rename** parameters to be more descriptive
4. **Eliminate** redundant examples
5. **Add** missing edge cases you identify

---

### Task D2: Performance and Maintainability Analysis

**Objective**: Analyze your scenario outlines for long-term maintainability and execution efficiency.

#### Analysis Framework:

##### **Maintainability Checklist**:
- [ ] **Parameter Consistency**: Same parameter names used consistently across scenarios
- [ ] **Business Language**: All examples use business terminology
- [ ] **Realistic Data**: Examples reflect real-world values and scenarios
- [ ] **Complete Coverage**: All important business rule combinations covered
- [ ] **Clear Organization**: Examples grouped logically and clearly labeled

##### **Performance Considerations**:
- [ ] **Data Volume**: Reasonable number of examples (not excessive)
- [ ] **Test Independence**: Examples don't depend on execution order
- [ ] **Setup Efficiency**: Background steps minimize repetitive setup
- [ ] **Boundary Focus**: Edge cases covered without unnecessary duplication

#### Your Task:
1. **Count** total examples across all your scenario outlines
2. **Identify** potential performance bottlenecks
3. **Suggest** optimizations for high-volume test execution
4. **Document** maintenance recommendations

#### Template for Analysis:
```markdown
## Scenario Outline Analysis Report

### Coverage Summary
- Total Scenario Outlines: X
- Total Examples: Y
- Average Examples per Outline: Z

### Maintainability Assessment
- Parameter Consistency: [Rating 1-5]
- Business Language Usage: [Rating 1-5]  
- Data Realism: [Rating 1-5]
- Organization Clarity: [Rating 1-5]

### Performance Considerations
- Execution Time Estimate: X minutes
- Resource Requirements: [Memory, Data setup needs]
- Optimization Opportunities: [List specific suggestions]

### Recommendations
1. [Specific improvement suggestion]
2. [Another improvement suggestion]
3. [etc.]
```

---

## 🏆 Advanced Patterns Challenge

### Task: Multi-Layered Business Rules

**Challenge**: Create a scenario outline that handles overlapping business rules with priorities and conflicts.

**Business Context**: ReadMore Books promotional system where multiple discounts could apply but business rules determine precedence.

#### Rule Hierarchy:
1. **Customer Loyalty** (always applies first)
2. **Volume Discounts** (applies to remaining amount)
3. **Promotional Codes** (cannot combine with volume discounts)
4. **Seasonal Sales** (lowest priority, fills remaining discount budget)
5. **Maximum Discount Cap** (40% total discount limit)

#### Your Challenge:
Design a scenario outline that tests these overlapping rules comprehensively.

#### Success Criteria:
- [ ] All rule combinations tested
- [ ] Conflict resolution clearly demonstrated
- [ ] Business logic priorities respected
- [ ] Edge cases around discount caps included
- [ ] Clear business outcomes in assertions

---

## 💡 Best Practices Summary

### Effective Scenario Outline Design

#### **Data Table Design**:
1. **Meaningful Headers**: Use business-focused parameter names
2. **Logical Grouping**: Organize examples by business scenarios
3. **Complete Coverage**: Include edge cases and error conditions
4. **Realistic Data**: Use examples that reflect real usage
5. **Reasonable Volume**: Balance coverage with execution time

#### **Business Focus**:
1. **Outcome-Oriented**: Focus on business results, not implementation
2. **Stakeholder Readable**: Business experts should understand examples
3. **Domain Language**: Use terminology familiar to business users
4. **Value-Driven**: Each example should test something that matters

#### **Maintainability**:
1. **Consistent Structure**: Use consistent parameter naming across features
2. **Clear Organization**: Group related examples logically
3. **Documentation**: Include comments for complex business rules
4. **Version Control**: Track changes to business rules through examples

---

## 🎯 Deliverables

By the end of this exercise, you should have:

1. **Comprehensive Login Validation** - Scenario outline with 20+ examples
2. **Product Search Scenarios** - Multiple outlines covering search, filter, sort
3. **Order Processing Rules** - Multi-dimensional business rule validation
4. **Dynamic Pricing Examples** - Complex factor interaction testing
5. **Subscription Billing** - Financial accuracy validation scenarios
6. **Return Policy Rules** - Policy compliance testing patterns
7. **Optimization Report** - Analysis of maintainability and performance
8. **Advanced Challenge** - Multi-layered business rule testing

Each deliverable should demonstrate:
- ✅ Proper Scenario Outline syntax and structure
- ✅ Business-focused examples and assertions  
- ✅ Comprehensive coverage of business rules
- ✅ Logical organization and clear naming
- ✅ Maintainable and scalable design patterns

---

## 🔗 Next Steps

After mastering scenario outlines:
1. **Review with stakeholders** - Validate business rule coverage
2. **Implementation planning** - Consider step definition complexity
3. **Test data strategy** - Plan for realistic test data management
4. **Execution optimization** - Design for efficient test runs
5. **Advanced patterns** - Explore dynamic data and external data sources

This foundation in data-driven testing will prepare you for complex business rule scenarios and advanced Gherkin patterns in subsequent exercises!

---

## 📚 Resources for Reference

- **Scenario Outline Syntax**: Complete Gherkin keyword reference
- **Data Table Patterns**: Examples of effective data organization
- **Business Rule Modeling**: Techniques for complex rule representation
- **Performance Optimization**: Strategies for large-scale data-driven testing