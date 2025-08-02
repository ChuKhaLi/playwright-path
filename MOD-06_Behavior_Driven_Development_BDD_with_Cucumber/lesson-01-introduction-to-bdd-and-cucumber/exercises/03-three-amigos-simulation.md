# Exercise 03: Three Amigos Collaboration Simulation

**Difficulty:** Intermediate  
**Estimated Time:** 25 minutes  
**Skills Practiced:** Collaborative scenario creation, stakeholder perspectives, edge case identification, business-technical alignment

## Learning Objectives

By completing this exercise, you will:
- Experience the Three Amigos collaborative approach to scenario creation
- Practice thinking from different stakeholder perspectives (Product Owner, Developer, Tester)
- Learn to identify and incorporate technical constraints and quality risks
- Create more comprehensive scenarios through collaborative enhancement

## Exercise Overview

You'll role-play as each member of the Three Amigos team to iteratively improve BDD scenarios. Starting with a basic user story, you'll enhance it by considering each stakeholder's perspective and concerns.

## The Three Amigos Roles

### 🏢 Product Owner (PO)
**Focus:** Business value, user needs, acceptance criteria
**Concerns:** User experience, business rules, market requirements
**Questions:** What value does this provide? How do users benefit? What are the business rules?

### 👩‍💻 Developer (DEV)  
**Focus:** Technical feasibility, implementation details, system constraints
**Concerns:** Architecture, performance, dependencies, edge cases
**Questions:** How will this work technically? What could go wrong? What are the constraints?

### 🧪 Tester (QA)
**Focus:** Quality assurance, risk assessment, comprehensive coverage
**Concerns:** Edge cases, error scenarios, user experience, security
**Questions:** What could fail? What are the risks? How do we verify quality?

---

## Task 1: Email Notification System

### Initial User Story:
```
As a customer
I want to receive email notifications about my order
So that I stay informed about my purchase
```

### Step 1: Product Owner Perspective

**Your Task as PO:** Expand this story with business context and user value. Define what notifications are important to customers and when they should be sent.

**PO Questions to Consider:**
- What specific order events require notification?
- What information should each email contain?
- How does this improve customer satisfaction?
- Are there customer preferences to consider?

**Your PO Enhancement:**
```
User Story (Enhanced):
As a ____________________,
I want ____________________,
So that ____________________.

Business Context:
- ____________________
- ____________________
- ____________________

Initial Acceptance Criteria:
1. ____________________
2. ____________________
3. ____________________
```

### Step 2: Developer Input

**Your Task as DEV:** Consider technical implementation and identify potential challenges. What technical constraints or edge cases need to be addressed?

**DEV Questions to Consider:**
- What happens if email delivery fails?
- How do we handle email address changes?
- What about email provider limitations?
- How do we track delivery status?
- What about internationalization?

**Your DEV Additions:**
```
Technical Considerations:
- ____________________
- ____________________
- ____________________

Additional Scenarios Needed:
1. ____________________
2. ____________________
3. ____________________

System Requirements:
- ____________________
- ____________________
```

### Step 3: Tester Enhancements

**Your Task as QA:** Identify quality risks and comprehensive test scenarios. Consider what could go wrong and how to verify the feature works reliably.

**QA Questions to Consider:**
- What are the failure scenarios?
- How do we test different email providers?
- What about spam filtering?
- How do we verify email content accuracy?
- What security considerations exist?

**Your QA Additions:**
```
Quality Risks Identified:
- ____________________
- ____________________
- ____________________

Additional Test Scenarios:
1. ____________________
2. ____________________
3. ____________________
4. ____________________

Verification Requirements:
- ____________________
- ____________________
```

### Step 4: Collaborative Final Scenarios

**Your Task:** Combine all perspectives into comprehensive Gherkin scenarios.

**Your Final Feature File:**
```gherkin
Feature: ________________________________
  As a ____________________
  I want ____________________
  So that ____________________.

  Background:
    ____________________
    ____________________

  Scenario: ____________________
    Given ____________________
    When ____________________
    Then ____________________
    And ____________________

  Scenario: ____________________
    Given ____________________
    When ____________________
    Then ____________________
    And ____________________

  Scenario: ____________________
    Given ____________________
    When ____________________
    Then ____________________
    And ____________________
```

---

## Task 2: Product Recommendation Engine

### Initial User Story:
```
As a shopper
I want to see recommended products
So that I can discover items I might like
```

### Step 1: Product Owner Analysis

**Your Task as PO:** Define the business value and user experience for product recommendations.

**Consider:**
- Where should recommendations appear?
- What makes a good recommendation?
- How do recommendations increase sales?
- What personalization is needed?

**Your PO Analysis:**
```
Business Value:
- ____________________
- ____________________

User Experience Requirements:
- ____________________
- ____________________
- ____________________

Success Metrics:
- ____________________
- ____________________
```

### Step 2: Developer Technical Review

**Your Task as DEV:** Identify technical implementation challenges and constraints.

**Consider:**
- How are recommendations generated?
- What data is needed for personalization?
- How do we handle new users with no history?
- What about performance and scalability?

**Your DEV Analysis:**
```
Technical Architecture Needs:
- ____________________
- ____________________

Performance Considerations:
- ____________________
- ____________________

Edge Cases to Handle:
- ____________________
- ____________________
```

### Step 3: Quality Assurance Review

**Your Task as QA:** Identify testing challenges and quality risks.

**Consider:**
- How do we test recommendation accuracy?
- What about recommendation diversity?
- How do we handle inappropriate recommendations?
- What privacy concerns exist?

**Your QA Analysis:**
```
Testing Challenges:
- ____________________
- ____________________

Quality Risks:
- ____________________
- ____________________

Privacy/Security Concerns:
- ____________________
- ____________________
```

### Step 4: Collaborative Scenarios

**Your Task:** Create comprehensive scenarios incorporating all perspectives.

**Your Scenarios:**
```gherkin
Feature: ________________________________

  Scenario: ____________________
    ____________________
    ____________________
    ____________________

  Scenario: ____________________
    ____________________
    ____________________
    ____________________

  Scenario: ____________________
    ____________________
    ____________________
    ____________________
```

---

## Task 3: Multi-Currency Support

### Initial User Story:
```
As an international customer
I want to see prices in my local currency
So that I can understand the cost in familiar terms
```

### Three Amigos Collaboration

**Your Task:** Work through this story from all three perspectives simultaneously, identifying concerns and enhancements from each role.

### Product Owner Concerns:
```
PO Questions:
- ____________________
- ____________________
- ____________________

PO Requirements:
- ____________________
- ____________________
- ____________________
```

### Developer Concerns:
```
DEV Questions:
- ____________________
- ____________________
- ____________________

DEV Technical Issues:
- ____________________
- ____________________
- ____________________
```

### Tester Concerns:
```
QA Questions:
- ____________________
- ____________________
- ____________________

QA Risk Areas:
- ____________________
- ____________________
- ____________________
```

### Collaborative Resolution:
```gherkin
Feature: ________________________________
  ________________________________

  Background:
    ________________________________
    ________________________________

  Scenario: ____________________
    ________________________________
    ________________________________
    ________________________________

  Scenario: ____________________
    ________________________________
    ________________________________
    ________________________________

  Scenario: ____________________
    ________________________________
    ________________________________
    ________________________________
```

---

## Self-Assessment Questions

After completing the role-playing exercises:

1. **Perspective Understanding:**
   - Could you identify unique concerns for each role?
   - Did you find value in considering multiple viewpoints?
   - Which role felt most natural to you? Most challenging?

2. **Collaboration Benefits:**
   - How did scenarios improve through multiple perspectives?
   - What issues were identified that single-role thinking missed?
   - Did the collaborative approach reveal new requirements?

3. **Scenario Quality:**
   - Are your final scenarios more comprehensive than initial stories?
   - Do they address technical, business, and quality concerns?
   - Would all stakeholders understand and agree with the scenarios?

---

## Solution Examples

### Task 1 Solution:

#### Product Owner Enhancement:
```
User Story (Enhanced):
As a customer who has placed an order,
I want to receive timely email notifications about my order status,
So that I can track my purchase progress and plan for delivery without having to check the website repeatedly.

Business Context:
- Reduces customer support inquiries about order status
- Improves customer satisfaction and trust through proactive communication
- Increases likelihood of repeat purchases through positive experience

Initial Acceptance Criteria:
1. Customer receives confirmation email immediately after order placement
2. Customer receives shipping notification with tracking number when order ships
3. Customer receives delivery confirmation when order is delivered
```

#### Developer Additions:
```
Technical Considerations:
- Email delivery service integration (SendGrid, AWS SES)
- Handle email bounce-backs and delivery failures
- Template management for different notification types
- Queue management for high-volume sending
- Retry logic for failed deliveries

Additional Scenarios Needed:
1. Email address validation and bounce handling
2. Delivery failure retry mechanism
3. Template rendering with dynamic content
4. Unsubscribe functionality compliance

System Requirements:
- Email service provider integration
- Message queue for reliable delivery
- Bounce and complaint handling
- Email preference management
```

#### QA Enhancements:
```
Quality Risks Identified:
- Emails marked as spam by recipients
- Incorrect or missing order information in emails
- Security risks with embedded links
- Email delivery timing inconsistencies

Additional Test Scenarios:
1. Email content accuracy across different order types
2. Email delivery to various email providers (Gmail, Outlook, Yahoo)
3. Spam filter avoidance testing
4. Email rendering across different clients
5. Unsubscribe link functionality and compliance

Verification Requirements:
- Email content validation against order data
- Delivery confirmation tracking
- Performance testing under high volume
- Security testing for email links and content
```

#### Final Collaborative Scenarios:
```gherkin
Feature: Order Status Email Notifications
  As a customer who has placed an order
  I want to receive timely and accurate email notifications about my order status
  So that I can stay informed about my purchase without having to check the website

  Background:
    Given I am a registered customer with email "customer@example.com"
    And I have placed order "ORD-123456" containing:
      | product    | quantity | price |
      | iPhone 14  | 1        | $999  |
      | Phone Case | 1        | $25   |

  Scenario: Receive order confirmation email immediately after purchase
    When my order is successfully placed
    Then I should receive order confirmation email within 2 minutes
    And the email should contain:
      | field          | value                    |
      | order_number   | ORD-123456              |
      | total_amount   | $1,024.00               |
      | items_count    | 2                       |
      | delivery_date  | [estimated date]        |
    And the email should include order tracking link

  Scenario: Receive shipping notification with tracking information
    Given my order status changes to "shipped"
    When the shipping notification is triggered
    Then I should receive shipping confirmation email within 30 minutes
    And the email should contain tracking number
    And the email should include carrier information
    And tracking link should be valid and functional

  Scenario: Handle email delivery failure with retry
    Given my email provider is temporarily unavailable
    When order confirmation email is sent
    Then the system should retry delivery 3 times over 24 hours
    And if delivery still fails, customer support should be notified
    And I should see order confirmation in my account dashboard

  Scenario: Respect customer email preferences
    Given I have unsubscribed from promotional emails
    But I have opted to receive order notifications
    When my order status changes
    Then I should still receive order-related emails
    And I should not receive promotional content in order emails
    And email should include preference management link
```

### Key Learning Points from Solutions:

**Collaboration Benefits Demonstrated:**
- **PO perspective** provided business context and customer value
- **DEV perspective** identified technical constraints and implementation needs  
- **QA perspective** revealed edge cases and quality risks
- **Combined approach** created comprehensive, testable scenarios

**Scenario Improvements Through Collaboration:**
- More specific acceptance criteria
- Technical edge cases included
- Quality and security considerations addressed
- User experience details refined
- Business rules clarified

---

## Best Practices for Three Amigos Sessions

### 1. Session Preparation
- **All participants** review the user story beforehand
- **PO** prepares business context and user research
- **DEV** considers technical constraints and dependencies
- **QA** identifies potential risk areas and edge cases

### 2. Structured Discussion
- Start with **business value** and user needs (PO lead)
- Discuss **technical feasibility** and constraints (DEV input)
- Identify **quality risks** and edge cases (QA input)
- Collaboratively create **comprehensive scenarios**

### 3. Outcome Documentation
- Record all scenarios in Gherkin format
- Capture assumptions and decisions made
- Note any follow-up research or investigation needed
- Ensure all participants agree on final scenarios

### 4. Success Indicators
- All stakeholders understand and agree on scenarios
- Technical implementation is feasible
- Quality risks are identified and addressed
- Scenarios are comprehensive and testable

---

## Common Collaboration Challenges

### Challenge 1: Dominant Perspectives
**Problem:** One role dominates discussion, others don't contribute
**Solution:** Use structured turn-taking, ensure each role has dedicated time

### Challenge 2: Getting Lost in Details  
**Problem:** Sessions become too technical or too business-focused
**Solution:** Keep focus on user behavior and value, park detailed discussions

### Challenge 3: Disagreement on Requirements
**Problem:** Stakeholders have conflicting views on what's needed
**Solution:** Use scenarios to explore different options, escalate unresolved conflicts

### Challenge 4: Time Management
**Problem:** Sessions run too long or don't cover all scenarios
**Solution:** Timebox discussions, focus on most critical scenarios first

---

## Next Steps

After completing this collaborative exercise:

1. **Reflect on the process** - which role perspectives were most valuable?
2. **Compare scenario quality** - how much better are collaborative scenarios?
3. **Move to Exercise 04** to analyze BDD vs traditional approaches
4. **Practice facilitation** - try leading Three Amigos sessions in real projects

Remember: The Three Amigos approach is about shared understanding, not just better documentation. The conversations and collaboration are as valuable as the scenarios produced.