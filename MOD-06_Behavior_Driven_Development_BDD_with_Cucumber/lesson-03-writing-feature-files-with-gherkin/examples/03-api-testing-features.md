# Example 03: API Testing Features

## 📋 Overview

This example demonstrates how to write effective Gherkin feature files for API testing scenarios. It focuses on business-oriented API testing that validates service behavior, data integrity, and system integration from a user value perspective rather than purely technical validation.

## 🎯 Learning Objectives

- Write business-focused API testing scenarios
- Model service interactions from user value perspective
- Handle complex API data flows and dependencies
- Apply BDD principles to backend service testing
- Validate business rules through API contracts
- Structure API test scenarios for maintainability and clarity

## 🔌 Business-Focused API Testing Examples

### File: `user-account-service.feature`

```gherkin
@api-testing @user-management @core-service
Feature: User Account Service
  As a mobile app or web client
  I want to reliably manage user accounts through the API
  So that users can securely access their personalized experience

  # Service Level Agreement: 99.9% uptime, <200ms response time
  # Business Impact: User registration, authentication, profile management
  # Integration Points: Authentication service, notification service, audit logging

  Background:
    Given the User Account Service is operational
    And the authentication service is available
    And the database connection is stable
    And rate limiting is configured for security

  @account-creation @onboarding @business-critical
  Scenario: New user successfully registers for account
    Given the email "newuser@example.com" is not already registered
    And the username "john_smith_2024" is available
    When a registration request is submitted with:
      | Field          | Value                    | Business Rule                    |
      | email          | newuser@example.com      | Must be valid email format       |
      | username       | john_smith_2024          | Must be unique, 3-30 characters  |
      | password       | SecurePass123!           | Must meet complexity requirements |
      | firstName      | John                     | Required for personalization     |
      | lastName       | Smith                    | Required for personalization     |
      | dateOfBirth    | 1990-05-15              | Must be 18+ for legal compliance |
      | marketingOptIn | true                     | GDPR compliance requirement      |
    Then the API should respond with status code 201
    And the response should contain:
      | Field           | Expectation                         |
      | userId          | Unique identifier generated         |
      | email           | newuser@example.com                 |
      | username        | john_smith_2024                     |
      | accountStatus   | ACTIVE                              |
      | createdAt       | Current timestamp                   |
      | emailVerified   | false                               |
    And a welcome email should be queued for delivery
    And an email verification token should be generated
    And the user should be added to the new user onboarding workflow
    And audit log should record account creation with IP address

  @account-validation @security @data-integrity
  Scenario: Registration fails with invalid email format
    Given I want to register a new account
    When a registration request is submitted with invalid email "invalid-email-format"
    Then the API should respond with status code 400
    And the error response should contain:
      | Field   | Value                                              |
      | error   | VALIDATION_ERROR                                   |
      | message | Email format is invalid                            |
      | field   | email                                              |
      | code    | INVALID_EMAIL_FORMAT                               |
    And no user account should be created
    And no welcome email should be sent
    And the validation error should be logged for monitoring

  @authentication @session-management @security
  Scenario: User successfully authenticates with valid credentials
    Given a verified user account exists:
      | Field    | Value                 |
      | email    | user@example.com      |
      | password | ValidPassword123!     |
      | status   | ACTIVE                |
      | verified | true                  |
    When an authentication request is submitted with:
      | Field    | Value             |
      | email    | user@example.com  |
      | password | ValidPassword123! |
    Then the API should respond with status code 200
    And the response should include:
      | Field        | Expectation                           |
      | accessToken  | JWT token valid for 1 hour            |
      | refreshToken | Secure token valid for 30 days        |
      | user         | Basic user profile information        |
      | permissions  | Array of user permissions             |
      | sessionId    | Unique session identifier             |
    And the access token should contain valid user claims
    And the session should be tracked in the active sessions store
    And successful login should be logged with timestamp and IP

  @authentication-failure @security @brute-force-protection
  Scenario: Authentication fails and triggers security measures
    Given a user account exists with email "user@example.com"
    And the account has had 4 consecutive failed login attempts in the last hour
    When an authentication request is submitted with:
      | Field    | Value              |
      | email    | user@example.com   |
      | password | WrongPassword123   |
    Then the API should respond with status code 429
    And the response should indicate:
      | Information    | Value                                       |
      | error          | TOO_MANY_ATTEMPTS                          |
      | message        | Account temporarily locked due to multiple failed attempts |
      | lockoutUntil   | Timestamp 15 minutes from now              |
      | remainingAttempts | 0                                       |
    And the account should be locked for 15 minutes
    And a security alert email should be queued to the user
    And the failed attempt should trigger security monitoring
    And no valid session should be created
```

### File: `order-processing-service.feature`

```gherkin
@api-testing @order-management @revenue-critical
Feature: Order Processing Service
  As an e-commerce platform
  I want to reliably process customer orders through the API
  So that customers receive their purchases and the business generates revenue

  # Business SLA: 99.95% uptime, order processing <5 seconds
  # Revenue Impact: Direct revenue generation, customer satisfaction
  # Integration Points: Payment service, inventory service, shipping service, notification service

  Background:
    Given the Order Processing Service is running
    And the payment processing service is available
    And the inventory management service is operational
    And the shipping service is accessible
    And product catalog data is current
    And tax calculation service is responsive

  @order-creation @checkout-completion @revenue-generation
  Scenario: Customer successfully creates order with multiple items
    Given customer "customer123" is authenticated
    And the customer has items in their cart:
      | Product ID | Product Name        | Quantity | Unit Price | Availability |
      | PROD-001   | Wireless Headphones | 1        | $199.99    | In Stock     |
      | PROD-002   | Phone Case          | 2        | $24.99     | In Stock     |
    And the customer has a valid shipping address in California
    And the customer has provided valid payment method "card_visa_4321"
    When an order creation request is submitted with:
      | Field           | Value                           |
      | customerId      | customer123                     |
      | items           | Cart contents from above        |
      | shippingAddress | Customer's California address   |
      | paymentMethod   | card_visa_4321                  |
      | shippingMethod  | STANDARD                        |
    Then the API should respond with status code 201
    And the order should be created with:
      | Field              | Expected Value                    |
      | orderId            | Unique order identifier           |
      | customerId         | customer123                       |
      | orderStatus        | CONFIRMED                         |
      | subtotal           | $249.97                          |
      | shippingCost       | $9.99                            |
      | taxAmount          | $20.25 (CA tax rate applied)     |
      | totalAmount        | $280.21                          |
      | estimatedDelivery  | 5-7 business days from now       |
    And inventory should be reserved for all ordered items
    And payment should be authorized for $280.21
    And the order should be queued for fulfillment processing
    And order confirmation email should be triggered
    And the customer should receive order tracking information

  @inventory-validation @stock-management @business-rules
  Scenario: Order creation fails when insufficient inventory
    Given customer "customer456" is authenticated
    And the customer attempts to order:
      | Product ID | Product Name     | Requested Qty | Available Stock |
      | PROD-003   | Limited Edition  | 5             | 2               |
    When an order creation request is submitted
    Then the API should respond with status code 422
    And the error response should indicate:
      | Field           | Value                                     |
      | error           | INSUFFICIENT_INVENTORY                    |
      | message         | Requested quantity exceeds available stock|
      | productId       | PROD-003                                  |
      | requestedQty    | 5                                         |
      | availableQty    | 2                                         |
      | suggestedAction | Reduce quantity or check back later      |
    And no order should be created
    And no inventory should be reserved
    And no payment should be processed
    And the customer should be notified of the stock limitation
```

## 🎨 API Testing Design Patterns

### Service Boundary Testing

#### **Request/Response Validation**
```gherkin
@api-contract @data-validation @integration
Scenario: API enforces strict input validation for business rules
  Given the User Registration API endpoint is available
  When a registration request is submitted with:
    | Field Validation Test | Input Value      | Expected Outcome       |
    | Email Format         | invalid@         | Rejected with specific error |
    | Password Strength    | 123              | Rejected with complexity rules |
    | Age Verification     | 2010-01-01       | Rejected as under 18   |
    | Required Fields      | Missing lastName | Rejected with field requirement |
  Then each validation should provide:
    | Validation Response  | Content                             |
    | Specific Error Code  | Machine-readable error identifier   |
    | Human-Readable Message | Clear explanation for user       |
    | Field Reference      | Which field caused the error        |
    | Suggestion          | How to correct the input            |
```

#### **State Management Testing**
```gherkin
@state-management @data-consistency @business-logic
Scenario: API maintains consistent state across multiple operations
  Given a user account is in state "PENDING_VERIFICATION"
  When sequential API calls are made:
    | Operation              | Expected State Transition         |
    | Email Verification     | PENDING_VERIFICATION → ACTIVE    |
    | Profile Update Request | Should succeed with ACTIVE state |
    | Password Change        | Should succeed with ACTIVE state |
    | Account Deactivation   | ACTIVE → DEACTIVATED             |
    | Login Attempt          | Should fail with DEACTIVATED     |
  Then each state transition should be:
    | Validation Aspect      | Requirement                       |
    | Atomically Consistent  | No partial state changes          |
    | Properly Audited       | All transitions logged            |
    | Business Rule Compliant| Follow defined state machine     |
    | Performance Optimized  | State checks under 50ms          |
```

### Business Rule Validation

#### **Complex Business Logic**
```gherkin
@business-rules @pricing-logic @revenue-accuracy
Scenario: Pricing API applies complex business rules correctly
  Given a customer is eligible for multiple discount types:
    | Discount Type        | Condition                           | Value  |
    | Loyalty Member       | Customer for 2+ years               | 10%    |
    | Bulk Purchase        | Order quantity over 50 items        | 15%    |
    | Seasonal Promotion   | Valid during holiday season         | 20%    |
    | First-Time Buyer     | Never purchased before              | 25%    |
  When pricing calculation is requested for:
    | Order Characteristics | Value                              |
    | Customer Type         | 3-year loyalty member              |
    | Order Quantity        | 75 items                           |
    | Purchase History      | Multiple previous orders           |
    | Current Date          | During holiday promotion           |
  Then the pricing engine should:
    | Business Rule Application | Expected Behavior               |
    | Discount Stacking         | Apply highest single discount (20% seasonal) |
    | Minimum Order Value       | Ensure profitability maintained |
    | Price Floor Enforcement   | Never go below cost + margin    |
    | Tax Calculation           | Apply correct regional tax rates |
    | Final Validation          | Verify business rule compliance |
  And the pricing response should include:
    | Pricing Transparency  | Information                         |
    | Applied Discounts     | Which discounts were used           |
    | Discount Reasoning    | Why certain discounts were chosen   |
    | Price Breakdown       | Itemized cost components            |
    | Savings Summary       | Total amount saved                  |
```

### Performance and Scalability Testing

#### **Load Behavior Validation**
```gherkin
@performance @scalability @business-continuity
Scenario: API maintains business SLA under expected load
  Given the system is configured for peak traffic handling
  When concurrent API requests are submitted:
    | Load Characteristic   | Specification                       |
    | Concurrent Users      | 1,000 simultaneous requests         |
    | Request Types         | 70% read, 30% write operations      |
    | Duration              | Sustained for 10 minutes            |
    | Geographic Distribution | Requests from 5 different regions |
  Then performance should meet business requirements:
    | Performance Metric    | SLA Requirement                     |
    | Response Time         | 95th percentile under 200ms         |
    | Throughput           | Minimum 500 requests per second     |
    | Error Rate           | Less than 0.1% of requests          |
    | Resource Utilization  | CPU under 70%, memory under 80%    |
  And business functionality should remain intact:
    | Business Function     | Requirement                         |
    | Data Accuracy         | No data corruption under load       |
    | Transaction Integrity | All financial operations accurate   |
    | User Experience       | No degradation of core features     |
    | Recovery Time         | Return to normal within 1 minute    |
```

## 📊 API Testing Quality Standards

### Business Value Focus
- [ ] Scenarios validate business outcomes, not just technical responses
- [ ] Error conditions reflect real user impact
- [ ] Performance requirements align with business SLAs
- [ ] Security testing protects business assets
- [ ] Integration testing validates end-to-end business processes

### Maintainability Standards
- [ ] Business language used throughout scenarios
- [ ] Service contracts clearly documented
- [ ] Data dependencies explicitly stated
- [ ] Error handling covers business-relevant failures
- [ ] Testing data reflects realistic business scenarios

### Collaboration Quality
- [ ] Product owners can validate business rules
- [ ] Developers understand integration requirements  
- [ ] Operations teams can monitor service health
- [ ] Security teams can validate protection measures
- [ ] Customer support can understand failure modes

## 🚀 Advanced API Testing Patterns

### Contract Testing Integration

```gherkin
@contract-testing @service-evolution @backward-compatibility
Scenario: API contract changes maintain backward compatibility
  Given version 1.2 of the User API is deployed
  And consumers are using contract expectations from version 1.1
  When a new field "socialSecurityNumber" is added as optional
  Then existing consumers should continue to work:
    | Compatibility Check   | Requirement                         |
    | Existing Fields       | All v1.1 fields remain available   |
    | Response Structure    | No breaking changes to JSON schema |
    | HTTP Status Codes     | Same codes for same scenarios       |
    | Error Messages        | Consistent error response format    |
  And new consumers should access enhanced functionality:
    | Enhancement          | Availability                        |
    | New Optional Fields  | Available when requested            |
    | Extended Validation  | Applied to new field usage          |
    | Improved Error Detail| More specific error information     |
```

### Event-Driven Architecture Testing

```gherkin
@event-driven @async-processing @business-workflow
Scenario: Order event triggers correct downstream business processes
  Given the event-driven order processing system is active
  When an "ORDER_PLACED" event is published with order data:
    | Event Field          | Value                               |
    | orderId              | ORD-2024-7890                       |
    | customerId           | CUST-12345                          |
    | totalAmount          | $299.99                             |
    | items                | 2 products                          |
  Then downstream services should process the event:
    | Service              | Expected Processing                 |
    | Inventory Service    | Reserve ordered items               |
    | Payment Service      | Charge customer payment method      |
    | Shipping Service     | Calculate delivery options          |
    | Notification Service | Send order confirmation email       |
    | Analytics Service    | Update sales metrics                |
  And event processing should be completed:
    | Processing Requirement| Specification                       |
    | Processing Time       | All events processed within 30s     |
    | Failure Handling      | Dead letter queue for failed events |
    | Ordering Guarantees   | Events processed in correct sequence|
    | Idempotency          | Duplicate events handled gracefully |
```

## 📚 Summary

This example demonstrates:

1. **Business-Focused API Testing** - Scenarios validate business value through service APIs
2. **Service Integration Patterns** - Testing complex interactions between services
3. **State Management Validation** - Ensuring business rules are enforced across state transitions
4. **Error Handling Excellence** - Comprehensive coverage of failure scenarios
5. **Performance Within Business Context** - Testing that aligns with business SLAs
6. **Real-World Complexity** - Advanced patterns for production systems

### Key Takeaways

- **Business Value First**: API tests should validate business outcomes, not just technical contracts
- **Integration Focus**: Test service interactions that deliver end-to-end business value
- **Realistic Scenarios**: Use business-realistic data and workflows
- **Error Handling**: Cover failure modes that impact business operations
- **Performance Alignment**: Test performance requirements that matter to the business

### Next Steps

Apply these patterns to your API testing by focusing on the business value delivered through your services. Remember: great API tests validate that your services deliver business value reliably! 🎯
