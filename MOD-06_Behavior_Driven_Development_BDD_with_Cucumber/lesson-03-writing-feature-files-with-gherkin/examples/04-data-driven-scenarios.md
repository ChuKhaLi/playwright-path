# Example 04: Data-Driven Scenarios

## 📋 Overview

This example demonstrates advanced Gherkin patterns for handling complex data scenarios, including scenario outlines, data tables, parameterization, and dynamic data handling. It focuses on creating maintainable, scalable test scenarios that can handle multiple data variations efficiently.

## 🎯 Learning Objectives

- Master scenario outline syntax and implementation
- Design effective data tables for complex scenarios
- Handle dynamic and variable data in feature files
- Create parameterized scenarios for comprehensive testing
- Structure data-driven tests for maintainability
- Apply advanced Gherkin patterns for business rule validation

## 📊 Advanced Data-Driven Patterns

### File: `user-registration-validation.feature`

```gherkin
@data-driven @user-registration @validation
Feature: User Registration Data Validation
  As a platform administrator
  I want to ensure user registration data meets business requirements
  So that we maintain data quality and regulatory compliance

  # Data Quality Requirements: All fields validated, duplicates prevented
  # Compliance: GDPR, age verification, format validation
  # Business Impact: User experience, data integrity, legal compliance

  Background:
    Given the user registration service is available
    And data validation rules are configured
    And the user database is accessible
    And email verification service is operational

  @validation-rules @comprehensive-testing @boundary-conditions
  Scenario Outline: Registration validation enforces business rules
    Given I am attempting to register a new user account
    When I submit registration data with:
      | Field       | Value          |
      | email       | <email>        |
      | password    | <password>     |
      | firstName   | <firstName>    |
      | lastName    | <lastName>     |
      | dateOfBirth | <dateOfBirth>  |
      | country     | <country>      |
    Then the registration should be <result>
    And I should see <message>
    And the system should log <logEntry>

    Examples: Valid Registration Data
      | email               | password        | firstName | lastName | dateOfBirth | country       | result   | message              | logEntry          |
      | john@example.com    | SecurePass123!  | John      | Smith    | 1990-05-15  | United States | accepted | Welcome to platform  | successful_registration |
      | maria@domain.org    | StrongPwd456@   | Maria     | Garcia   | 1985-12-03  | Spain         | accepted | Welcome to platform  | successful_registration |
      | alex@company.co.uk  | ComplexKey789#  | Alex      | Johnson  | 1992-08-20  | United Kingdom| accepted | Welcome to platform  | successful_registration |
      | lisa@startup.io     | MegaSecure012$  | Lisa      | Chen     | 1988-03-10  | Canada        | accepted | Welcome to platform  | successful_registration |

    Examples: Invalid Email Formats
      | email               | password        | firstName | lastName | dateOfBirth | country       | result   | message                    | logEntry               |
      | invalid-email       | SecurePass123!  | John      | Smith    | 1990-05-15  | United States | rejected | Invalid email format       | validation_error_email |
      | @missing-local.com  | SecurePass123!  | John      | Smith    | 1990-05-15  | United States | rejected | Invalid email format       | validation_error_email |
      | user@.com           | SecurePass123!  | John      | Smith    | 1990-05-15  | United States | rejected | Invalid email format       | validation_error_email |
      | user@domain         | SecurePass123!  | John      | Smith    | 1990-05-15  | United States | rejected | Invalid email format       | validation_error_email |

    Examples: Weak Password Combinations
      | email               | password        | firstName | lastName | dateOfBirth | country       | result   | message                    | logEntry                  |
      | user@example.com    | 123456          | John      | Smith    | 1990-05-15  | United States | rejected | Password too weak          | validation_error_password |
      | user@example.com    | password        | John      | Smith    | 1990-05-15  | United States | rejected | Password too weak          | validation_error_password |
      | user@example.com    | ALLUPPERCASE    | John      | Smith    | 1990-05-15  | United States | rejected | Password too weak          | validation_error_password |
      | user@example.com    | nouppercase123  | John      | Smith    | 1990-05-15  | United States | rejected | Password too weak          | validation_error_password |

    Examples: Age Verification Requirements
      | email               | password        | firstName | lastName | dateOfBirth | country       | result   | message                    | logEntry               |
      | teen@example.com    | SecurePass123!  | Jane      | Doe      | 2010-01-01  | United States | rejected | Must be 18 or older        | validation_error_age   |
      | minor@example.com   | SecurePass123!  | Mike      | Wilson   | 2008-06-15  | United States | rejected | Must be 18 or older        | validation_error_age   |
      | child@example.com   | SecurePass123!  | Sarah     | Brown    | 2015-12-25  | United States | rejected | Must be 18 or older        | validation_error_age   |

    Examples: Name Validation Rules
      | email               | password        | firstName | lastName | dateOfBirth | country       | result   | message                    | logEntry               |
      | user@example.com    | SecurePass123!  | J         | S        | 1990-05-15  | United States | rejected | Names too short            | validation_error_name  |
      | user@example.com    | SecurePass123!  |           | Smith    | 1990-05-15  | United States | rejected | First name required        | validation_error_name  |
      | user@example.com    | SecurePass123!  | John      |          | 1990-05-15  | United States | rejected | Last name required         | validation_error_name  |
      | user@example.com    | SecurePass123!  | 123       | 456      | 1990-05-15  | United States | rejected | Names cannot be numeric    | validation_error_name  |

  @duplicate-prevention @data-integrity @business-rules
  Scenario Outline: System prevents duplicate registrations across different scenarios
    Given existing user accounts in the system:
      | Email                | Username     | Status    | Created Date |
      | existing@example.com | john_smith   | ACTIVE    | 2024-01-01   |
      | inactive@example.com | jane_doe     | INACTIVE  | 2024-01-15   |
      | pending@example.com  | mike_wilson  | PENDING   | 2024-02-01   |
    When a new registration attempt is made with:
      | Field    | Value        |
      | email    | <email>      |
      | username | <username>   |
    Then the registration should be <result>
    And the response should indicate <errorType>
    And the existing account should remain <accountStatus>

    Examples: Email Duplication Prevention
      | email                | username      | result   | errorType           | accountStatus |
      | existing@example.com | new_user      | rejected | DUPLICATE_EMAIL     | unchanged     |
      | EXISTING@EXAMPLE.COM | new_user      | rejected | DUPLICATE_EMAIL     | unchanged     |
      | existing@EXAMPLE.com | new_user      | rejected | DUPLICATE_EMAIL     | unchanged     |

    Examples: Username Duplication Prevention  
      | email                | username      | result   | errorType           | accountStatus |
      | new@example.com      | john_smith    | rejected | DUPLICATE_USERNAME  | unchanged     |
      | new@example.com      | JOHN_SMITH    | rejected | DUPLICATE_USERNAME  | unchanged     |
      | new@example.com      | John_Smith    | rejected | DUPLICATE_USERNAME  | unchanged     |

    Examples: Edge Cases with Inactive Accounts
      | email                | username      | result   | errorType           | accountStatus |
      | inactive@example.com | new_username  | rejected | ACCOUNT_EXISTS      | unchanged     |
      | pending@example.com  | another_user  | rejected | ACCOUNT_EXISTS      | unchanged     |
```

### File: `ecommerce-pricing-scenarios.feature`

```gherkin
@pricing-engine @data-driven @revenue-critical
Feature: E-commerce Pricing Engine
  As an e-commerce platform
  I want to calculate accurate prices with various discounts and rules
  So that customers receive correct pricing and the business maintains profitability

  # Business Rules: Tiered pricing, seasonal discounts, loyalty programs, bulk pricing
  # Revenue Impact: Direct pricing accuracy affects revenue and customer satisfaction
  # Complexity: Multiple overlapping discount rules, tax calculations, currency handling

  Background:
    Given the pricing engine is operational
    And product catalog with pricing data is loaded
    And customer loyalty data is available
    And current promotional campaigns are active
    And tax calculation service is responsive

  @pricing-tiers @bulk-discounts @customer-segments
  Scenario Outline: Pricing engine applies correct discount tiers
    Given a customer with profile:
      | Attribute           | Value              |
      | loyaltyTier         | <loyaltyTier>      |
      | membershipYears     | <membershipYears>  |
      | totalSpent          | <totalSpent>       |
      | region              | <region>           |
    And they are purchasing products:
      | Product Category | Quantity | Unit Price | Discount Eligible |
      | Electronics      | <qty1>   | $100.00    | Yes               |
      | Books           | <qty2>   | $25.00     | Yes               |
      | Clothing        | <qty3>   | $50.00     | Yes               |
    When pricing calculation is performed
    Then the order should be calculated as:
      | Calculation Component | Expected Value     |
      | subtotal             | <subtotal>         |
      | loyaltyDiscount      | <loyaltyDiscount>  |
      | bulkDiscount         | <bulkDiscount>     |
      | totalDiscount        | <totalDiscount>    |
      | taxAmount            | <taxAmount>        |
      | finalTotal           | <finalTotal>       |

    Examples: Gold Tier Customer Scenarios
      | loyaltyTier | membershipYears | totalSpent | region    | qty1 | qty2 | qty3 | subtotal | loyaltyDiscount | bulkDiscount | totalDiscount | taxAmount | finalTotal |
      | GOLD        | 3               | $5000.00   | US-CA     | 2    | 4    | 1    | $450.00  | $67.50         | $0.00        | $67.50        | $30.70    | $413.20    |
      | GOLD        | 5               | $8000.00   | US-NY     | 5    | 10   | 3    | $1000.00 | $150.00        | $50.00       | $200.00       | $68.00    | $868.00    |
      | GOLD        | 2               | $3000.00   | US-FL     | 1    | 2    | 1    | $200.00  | $30.00         | $0.00        | $30.00        | $11.90    | $181.90    |

    Examples: Silver Tier Customer Scenarios
      | loyaltyTier | membershipYears | totalSpent | region    | qty1 | qty2 | qty3 | subtotal | loyaltyDiscount | bulkDiscount | totalDiscount | taxAmount | finalTotal |
      | SILVER      | 2               | $2000.00   | US-TX     | 3    | 5    | 2    | $525.00  | $52.50         | $0.00        | $52.50        | $35.44    | $507.94    |
      | SILVER      | 1               | $800.00    | US-WA     | 1    | 1    | 1    | $175.00  | $17.50         | $0.00        | $17.50        | $15.75    | $173.25    |

    Examples: Bronze Tier Customer Scenarios
      | loyaltyTier | membershipYears | totalSpent | region    | qty1 | qty2 | qty3 | subtotal | loyaltyDiscount | bulkDiscount | totalDiscount | taxAmount | finalTotal |
      | BRONZE      | 1               | $500.00    | US-OR     | 2    | 3    | 1    | $325.00  | $16.25         | $0.00        | $16.25        | $24.70    | $333.45    |
      | BRONZE      | 0               | $100.00    | US-NV     | 1    | 2    | 0    | $150.00  | $7.50          | $0.00        | $7.50         | $11.39    | $153.89    |

    Examples: High-Volume Bulk Purchase Scenarios
      | loyaltyTier | membershipYears | totalSpent | region    | qty1 | qty2 | qty3 | subtotal | loyaltyDiscount | bulkDiscount | totalDiscount | taxAmount | finalTotal |
      | SILVER      | 2               | $2000.00   | US-CA     | 20   | 50   | 30   | $4250.00 | $425.00        | $425.00      | $850.00       | $272.00   | $3672.00   |
      | GOLD        | 4               | $6000.00   | US-NY     | 15   | 40   | 25   | $3250.00 | $487.50        | $325.00      | $812.50       | $195.00   | $2632.50   |

  @seasonal-promotions @time-based-pricing @campaign-management
  Scenario Outline: Seasonal promotions override standard pricing rules
    Given current date is <currentDate>
    And active promotional campaigns:
      | Campaign Name    | Start Date | End Date   | Discount Type | Discount Value | Applicable Categories |
      | Summer Sale      | 2024-06-01 | 2024-08-31 | PERCENTAGE    | 25%           | Clothing, Sports      |
      | Back to School   | 2024-08-15 | 2024-09-15 | FIXED_AMOUNT  | $20.00        | Books, Electronics    |
      | Holiday Special  | 2024-11-20 | 2024-12-31 | PERCENTAGE    | 30%           | All Categories        |
    And a customer purchases:
      | Product Category | Quantity | Unit Price |
      | <category>       | <qty>    | <price>    |
    When promotional pricing is calculated
    Then the pricing should reflect:
      | Pricing Element      | Value                    |
      | originalPrice        | <originalPrice>          |
      | applicablePromotion  | <applicablePromotion>    |
      | promotionDiscount    | <promotionDiscount>      |
      | finalPrice           | <finalPrice>             |

    Examples: Summer Sale Period (July 2024)
      | currentDate | category | qty | price   | originalPrice | applicablePromotion | promotionDiscount | finalPrice |
      | 2024-07-15  | Clothing | 3   | $50.00  | $150.00       | Summer Sale         | $37.50           | $112.50    |
      | 2024-07-15  | Sports   | 2   | $75.00  | $150.00       | Summer Sale         | $37.50           | $112.50    |
      | 2024-07-15  | Books    | 5   | $25.00  | $125.00       | None               | $0.00            | $125.00    |

    Examples: Back to School Overlap Period (August 2024)
      | currentDate | category    | qty | price   | originalPrice | applicablePromotion | promotionDiscount | finalPrice |
      | 2024-08-20  | Books       | 4   | $25.00  | $100.00       | Back to School      | $20.00           | $80.00     |
      | 2024-08-20  | Electronics | 1   | $200.00 | $200.00       | Back to School      | $20.00           | $180.00    |
      | 2024-08-20  | Clothing    | 2   | $50.00  | $100.00       | Summer Sale         | $25.00           | $75.00     |

    Examples: Holiday Special Period (December 2024)
      | currentDate | category    | qty | price   | originalPrice | applicablePromotion | promotionDiscount | finalPrice |
      | 2024-12-15  | Electronics | 1   | $300.00 | $300.00       | Holiday Special     | $90.00           | $210.00    |
      | 2024-12-15  | Clothing    | 4   | $40.00  | $160.00       | Holiday Special     | $48.00           | $112.00    |
      | 2024-12-15  | Books       | 8   | $15.00  | $120.00       | Holiday Special     | $36.00           | $84.00     |

  @geographic-pricing @tax-calculation @international-commerce
  Scenario Outline: International pricing handles currency and tax variations
    Given a customer located in <country>
    And their preferred currency is <currency>
    And local tax rate is <taxRate>
    And current exchange rates are loaded
    When they purchase items worth <baseAmountUSD> USD
    Then the pricing should be calculated as:
      | Pricing Component    | Value                |
      | baseAmount           | <baseAmountUSD> USD  |
      | convertedAmount      | <localAmount>        |
      | localTaxRate         | <taxRate>            |
      | taxAmount            | <taxAmount>          |
      | totalWithTax         | <totalWithTax>       |
      | displayCurrency      | <currency>           |

    Examples: European Union Countries
      | country     | currency | taxRate | baseAmountUSD | localAmount | taxAmount | totalWithTax |
      | Germany     | EUR      | 19%     | $100.00       | €92.50      | €17.58    | €110.08      |
      | France      | EUR      | 20%     | $100.00       | €92.50      | €18.50    | €111.00      |
      | Spain       | EUR      | 21%     | $100.00       | €92.50      | €19.43    | €111.93      |
      | Italy       | EUR      | 22%     | $100.00       | €92.50      | €20.35    | €112.85      |

    Examples: Asia-Pacific Countries
      | country     | currency | taxRate | baseAmountUSD | localAmount | taxAmount | totalWithTax |
      | Japan       | JPY      | 10%     | $100.00       | ¥14,800     | ¥1,480    | ¥16,280      |
      | Australia   | AUD      | 10%     | $100.00       | A$152.00    | A$15.20   | A$167.20     |
      | Singapore   | SGD      | 7%      | $100.00       | S$135.50    | S$9.49    | S$144.99     |

    Examples: Americas Countries
      | country     | currency | taxRate | baseAmountUSD | localAmount | taxAmount | totalWithTax |
      | Canada      | CAD      | 13%     | $100.00       | C$136.25    | C$17.71   | C$153.96     |
      | Mexico      | MXN      | 16%     | $100.00       | $1,850.00   | $296.00   | $2,146.00    |
      | Brazil      | BRL      | 17%     | $100.00       | R$520.00    | R$88.40   | R$608.40     |
```

### File: `subscription-billing-scenarios.feature`

```gherkin
@subscription-billing @data-driven @recurring-revenue
Feature: Subscription Billing Engine
  As a SaaS platform
  I want to accurately calculate subscription billing across different plans and scenarios
  So that customers are billed correctly and revenue is optimized

  # Business Model: Tiered SaaS subscriptions with usage-based billing
  # Revenue Impact: Recurring revenue accuracy, customer retention
  # Complexity: Prorations, upgrades, downgrades, seasonal adjustments

  Background:
    Given the subscription billing engine is operational
    And customer subscription data is current
    And pricing plans are configured and active
    And payment processing system is available
    And usage tracking data is accessible

  @plan-variations @billing-cycles @customer-segments
  Scenario Outline: Subscription billing calculates correct amounts for different plans
    Given a customer with subscription:
      | Attribute        | Value            |
      | planType         | <planType>       |
      | billingCycle     | <billingCycle>   |
      | signupDate       | <signupDate>     |
      | currentUsage     | <currentUsage>   |
      | contractLength   | <contractLength> |
    And current billing date is <billingDate>
    When monthly billing is processed
    Then the billing calculation should include:
      | Billing Component | Value              |
      | basePlanCost      | <basePlanCost>     |
      | usageCharges      | <usageCharges>     |
      | discountApplied   | <discountApplied>  |
      | totalAmount       | <totalAmount>      |
      | nextBillingDate   | <nextBillingDate> |

    Examples: Starter Plan Variations
      | planType | billingCycle | signupDate | currentUsage | contractLength | billingDate | basePlanCost | usageCharges | discountApplied | totalAmount | nextBillingDate |
      | STARTER  | MONTHLY      | 2024-01-15 | 500 API calls| 1 month       | 2024-02-15  | $29.00       | $5.00        | $0.00          | $34.00      | 2024-03-15     |
      | STARTER  | ANNUAL       | 2024-01-15 | 400 API calls| 12 months     | 2024-02-15  | $290.00      | $4.00        | $58.00         | $236.00     | 2025-01-15     |
      | STARTER  | MONTHLY      | 2024-01-15 | 1200 API calls| 1 month      | 2024-02-15  | $29.00       | $35.00       | $0.00          | $64.00      | 2024-03-15     |

    Examples: Professional Plan Variations
      | planType     | billingCycle | signupDate | currentUsage  | contractLength | billingDate | basePlanCost | usageCharges | discountApplied | totalAmount | nextBillingDate |
      | PROFESSIONAL | MONTHLY      | 2024-01-01 | 2500 API calls| 1 month       | 2024-02-01  | $99.00       | $0.00        | $0.00          | $99.00      | 2024-03-01     |
      | PROFESSIONAL | ANNUAL       | 2024-01-01 | 8000 API calls| 12 months     | 2024-02-01  | $990.00      | $300.00      | $198.00        | $1092.00    | 2025-01-01     |
      | PROFESSIONAL | QUARTERLY    | 2024-01-01 | 5000 API calls| 3 months      | 2024-02-01  | $277.20      | $0.00        | $20.79         | $256.41     | 2024-05-01     |

    Examples: Enterprise Plan Variations
      | planType   | billingCycle | signupDate | currentUsage   | contractLength | billingDate | basePlanCost | usageCharges | discountApplied | totalAmount | nextBillingDate |
      | ENTERPRISE | MONTHLY      | 2024-01-01 | 15000 API calls| 1 month       | 2024-02-01  | $299.00      | $0.00        | $0.00          | $299.00     | 2024-03-01     |
      | ENTERPRISE | ANNUAL       | 2024-01-01 | 50000 API calls| 12 months     | 2024-02-01  | $2990.00     | $0.00        | $598.00        | $2392.00    | 2025-01-01     |

  @plan-changes @prorations @upgrade-downgrade
  Scenario Outline: Plan changes trigger accurate proration calculations
    Given a customer currently on <currentPlan> plan
    And their current billing cycle started on <cycleStartDate>
    And they have paid <amountPaid> for the current cycle
    And today's date is <changeDate>
    When they change to <newPlan> plan
    Then the proration should be calculated as:
      | Proration Component  | Value                   |
      | daysInCurrentCycle   | <daysInCycle>          |
      | daysUsedOldPlan      | <daysUsedOld>          |
      | daysRemainingNewPlan | <daysRemainingNew>     |
      | oldPlanRefund        | <oldPlanRefund>        |
      | newPlanCharge        | <newPlanCharge>        |
      | netAdjustment        | <netAdjustment>        |

    Examples: Mid-Cycle Upgrades (Starter to Professional)
      | currentPlan | cycleStartDate | amountPaid | changeDate | newPlan      | daysInCycle | daysUsedOld | daysRemainingNew | oldPlanRefund | newPlanCharge | netAdjustment |
      | STARTER     | 2024-01-01     | $29.00     | 2024-01-15 | PROFESSIONAL | 31          | 14          | 17               | $15.52        | $54.55        | $39.03        |
      | STARTER     | 2024-01-01     | $29.00     | 2024-01-10 | PROFESSIONAL | 31          | 9           | 22               | $20.48        | $70.97        | $50.49        |
      | STARTER     | 2024-01-01     | $29.00     | 2024-01-25 | PROFESSIONAL | 31          | 24          | 7                | $6.55         | $22.26        | $15.71        |

    Examples: Mid-Cycle Downgrades (Professional to Starter)
      | currentPlan  | cycleStartDate | amountPaid | changeDate | newPlan | daysInCycle | daysUsedOld | daysRemainingNew | oldPlanRefund | newPlanCharge | netAdjustment |
      | PROFESSIONAL | 2024-01-01     | $99.00     | 2024-01-15 | STARTER | 31          | 14          | 17               | $54.55        | $15.52        | -$39.03       |
      | PROFESSIONAL | 2024-01-01     | $99.00     | 2024-01-20 | STARTER | 31          | 19          | 12               | $38.39        | $11.23        | -$27.16       |

    Examples: Enterprise Plan Changes
      | currentPlan  | cycleStartDate | amountPaid | changeDate | newPlan    | daysInCycle | daysUsedOld | daysRemainingNew | oldPlanRefund | newPlanCharge | netAdjustment |
      | PROFESSIONAL | 2024-01-01     | $99.00     | 2024-01-10 | ENTERPRISE | 31          | 9           | 22               | $70.97        | $212.90       | $141.93       |
      | ENTERPRISE   | 2024-01-01     | $299.00    | 2024-01-20 | STARTER    | 31          | 19          | 12               | $105.81       | $11.23        | -$94.58       |

  @usage-overages @billing-tiers @cost-optimization
  Scenario Outline: Usage-based billing applies correct overage charges
    Given a customer on <planType> plan
    And their plan includes <includedUsage> included usage per month
    And overage pricing is <overageRate> per additional unit
    And their actual usage for the month is <actualUsage>
    When usage billing is calculated
    Then the usage charges should be:
      | Usage Calculation    | Value              |
      | includedUsage        | <includedUsage>    |
      | actualUsage          | <actualUsage>      |
      | overageUnits         | <overageUnits>     |
      | overageRate          | <overageRate>      |
      | totalOverageCharge   | <totalOverage>     |
      | usageEfficiency      | <efficiency>       |

    Examples: Starter Plan Usage Scenarios
      | planType | includedUsage | overageRate | actualUsage | overageUnits | totalOverage | efficiency |
      | STARTER  | 1000         | $0.05       | 850         | 0            | $0.00        | 85%        |
      | STARTER  | 1000         | $0.05       | 1000        | 0            | $0.00        | 100%       |
      | STARTER  | 1000         | $0.05       | 1250        | 250          | $12.50       | 125%       |
      | STARTER  | 1000         | $0.05       | 2500        | 1500         | $75.00       | 250%       |

    Examples: Professional Plan Usage Scenarios
      | planType     | includedUsage | overageRate | actualUsage | overageUnits | totalOverage | efficiency |
      | PROFESSIONAL | 5000         | $0.03       | 4200        | 0            | $0.00        | 84%        |
      | PROFESSIONAL | 5000         | $0.03       | 5000        | 0            | $0.00        | 100%       |
      | PROFESSIONAL | 5000         | $0.03       | 6800        | 1800         | $54.00       | 136%       |
      | PROFESSIONAL | 5000         | $0.03       | 12000       | 7000         | $210.00      | 240%       |

    Examples: Enterprise Plan Usage Scenarios
      | planType   | includedUsage | overageRate | actualUsage | overageUnits | totalOverage | efficiency |
      | ENTERPRISE | 25000        | $0.01       | 20000       | 0            | $0.00        | 80%        |
      | ENTERPRISE | 25000        | $0.01       | 25000       | 0            | $0.00        | 100%       |
      | ENTERPRISE | 25000        | $0.01       | 35000       | 10000        | $100.00      | 140%       |
      | ENTERPRISE | 25000        | $0.01       | 75000       | 50000        | $500.00      | 300%       |
```

## 🎨 Advanced Data Patterns

### Dynamic Data Handling

#### **Context-Sensitive Data**
```gherkin
@context-sensitive @dynamic-data @business-intelligence
Scenario Outline: System adapts behavior based on contextual data
  Given the current business context is:
    | Context Dimension    | Value              |
    | seasonality          | <season>           |
    | marketConditions     | <marketCondition>  |
    | competitorActivity   | <competitorLevel>  |
    | inventoryLevels      | <inventoryStatus>  |
  And a customer with profile matching <customerSegment>
  When they interact with product category <productCategory>
  Then the system should optimize for:
    | Optimization Target  | Strategy              |
    | pricingStrategy      | <pricingStrategy>     |
    | recommendationFocus  | <recommendationFocus> |
    | promotionalOffer     | <promotionalOffer>    |
    | inventoryPriority    | <inventoryPriority>   |

  Examples: High-Demand Holiday Season
    | season | marketCondition | competitorLevel | inventoryStatus | customerSegment | productCategory | pricingStrategy | recommendationFocus | promotionalOffer | inventoryPriority |
    | WINTER | HIGH_DEMAND     | AGGRESSIVE      | LOW            | VIP_CUSTOMER    | ELECTRONICS     | PREMIUM         | AVAILABILITY        | LIMITED_TIME     | RESERVED_STOCK    |
    | WINTER | HIGH_DEMAND     | MODERATE        | NORMAL         | NEW_CUSTOMER    | GIFTS           | COMPETITIVE     | POPULAR_ITEMS       | FIRST_PURCHASE   | FAST_MOVING       |

  Examples: Low-Demand Summer Period
    | season | marketCondition | competitorLevel | inventoryStatus | customerSegment | productCategory | pricingStrategy | recommendationFocus | promotionalOffer | inventoryPriority |
    | SUMMER | LOW_DEMAND      | PRICE_CUTTING   | HIGH           | BARGAIN_HUNTER  | SEASONAL        | CLEARANCE       | DISCOUNTED_ITEMS    | BULK_DISCOUNT    | EXCESS_INVENTORY  |
    | SUMMER | STABLE          | MODERATE        | NORMAL         | LOYAL_CUSTOMER  | ESSENTIALS      | STANDARD        | COMPLEMENTARY       | LOYALTY_BONUS    | REGULAR_STOCK     |
```

#### **Multi-Dimensional Data Tables**
```gherkin
@multi-dimensional @complex-business-rules @cross-functional
Scenario Outline: Complex business rules evaluated across multiple dimensions
  Given a business transaction with characteristics:
    | Transaction Dimension | Value                  |
    | customerTier          | <customerTier>         |
    | transactionType       | <transactionType>      |
    | geographicRegion      | <region>               |
    | timeOfYear            | <timeOfYear>           |
    | channelUsed           | <channel>              |
    | riskScore             | <riskScore>            |
  When business rule evaluation is performed
  Then the system should apply:
    | Business Rule Category | Applied Rule              |
    | approvalRequirement    | <approvalRequirement>     |
    | riskMitigationLevel    | <riskMitigation>          |
    | customerCommunication  | <communicationStrategy>   |
    | processingPriority     | <processingPriority>      |
    | complianceChecks       | <complianceLevel>         |

  Examples: High-Value VIP Transactions
    | customerTier | transactionType | region | timeOfYear | channel | riskScore | approvalRequirement | riskMitigation | communicationStrategy | processingPriority | complianceLevel |
    | VIP         | LARGE_PURCHASE  | US     | HOLIDAY    | ONLINE  | LOW       | MANAGER_APPROVAL    | STANDARD       | PERSONAL_CALL        | HIGH              | ENHANCED        |
    | VIP         | RETURN          | EU     | REGULAR    | STORE   | MEDIUM    | SUPERVISOR_OK       | ENHANCED       | EMAIL_PRIORITY       | MEDIUM            | STANDARD        |

  Examples: New Customer Risk Management
    | customerTier | transactionType | region | timeOfYear | channel | riskScore | approvalRequirement | riskMitigation | communicationStrategy | processingPriority | complianceLevel |
    | NEW         | FIRST_PURCHASE  | INTL   | REGULAR    | MOBILE  | HIGH      | FRAUD_REVIEW        | MAXIMUM        | SMS_VERIFICATION     | HOLD              | MAXIMUM         |
    | NEW         | SMALL_PURCHASE  | US     | REGULAR    | ONLINE  | LOW       | AUTOMATED           | MINIMAL        | STANDARD_EMAIL       | STANDARD          | BASIC           |
```

### Data Validation Patterns

#### **Cross-Field Validation**
```gherkin
@cross-field-validation @data-integrity @business-logic
Scenario Outline: System validates data consistency across related fields
  Given a data submission with fields:
    | Field Category    | Field Name        | Value            |
    | PersonalInfo      | dateOfBirth       | <dateOfBirth>    |
    | PersonalInfo      | age               | <age>            |
    | ContactInfo       | countryCode       | <countryCode>    |
    | ContactInfo       | phoneNumber       | <phoneNumber>    |
    | AddressInfo       | country           | <country>        |
    | AddressInfo       | postalCode        | <postalCode>     |
    | PaymentInfo       | cardType          | <cardType>       |
    | PaymentInfo       | cardNumber        | <cardNumber>     |
  When cross-field validation is performed
  Then the validation should result in <validationResult>
  And any inconsistencies should be reported as <errorType>

  Examples: Valid Data Combinations
    | dateOfBirth | age | countryCode | phoneNumber   | country | postalCode | cardType | cardNumber      | validationResult | errorType |
    | 1990-05-15  | 34  | +1          | 555-123-4567  | US      | 90210      | VISA     | 4111111111111111| VALID           | NONE      |
    | 1985-12-03  | 38  | +44         | 20-7946-0958  | UK      | SW1A 1AA   | MASTER   | 5555555555554444| VALID           | NONE      |

  Examples: Age-Date Inconsistencies
    | dateOfBirth | age | countryCode | phoneNumber   | country | postalCode | cardType | cardNumber      | validationResult | errorType     |
    | 1990-05-15  | 25  | +1          | 555-123-4567  | US      | 90210      | VISA     | 4111111111111111| INVALID         | AGE_MISMATCH  |
    | 2000-01-01  | 30  | +1          | 555-123-4567  | US      | 90210      | VISA     | 4111111111111111| INVALID         | AGE_MISMATCH  |

  Examples: Geographic Inconsistencies
    | dateOfBirth | age | countryCode | phoneNumber   | country | postalCode | cardType | cardNumber      | validationResult | errorType           |
    | 1990-05-15  | 34  | +44         | 555-123-4567  | US      | 90210      | VISA     | 4111111111111111| INVALID         | COUNTRY_PHONE_MISMATCH |
    | 1990-05-15  | 34  | +1          | 555-123-4567  | UK      | SW1A 1AA   | VISA     | 4111111111111111| INVALID         | COUNTRY_CODE_MISMATCH  |

  Examples: Payment Validation Issues
    | dateOfBirth | age | countryCode | phoneNumber   | country | postalCode | cardType | cardNumber      | validationResult | errorType        |
    | 1990-05-15  | 34  | +1          | 555-123-4567  | US      | 90210      | VISA     | 5555555555554444| INVALID         | CARD_TYPE_MISMATCH |
    | 1990-05-15  | 34  | +1          | 555-123-4567  | US      | 90210      | MASTER   | 4111111111111111| INVALID         | CARD_TYPE_MISMATCH |
```

## 📊 Data-Driven Testing Best Practices

### Table Design Guidelines

#### **Effective Data Organization**
```gherkin
# ✅ Good: Logical grouping and clear relationships
Examples: Customer Segmentation Scenarios
  | Segment    | Tenure | Spend  | Frequency | Channel    | Expected_Treatment |
  | NEW        | 0-3mo  | $0-100 | 1-2       | ONLINE     | ONBOARDING_FOCUS  |
  | GROWING    | 3-12mo | $100+  | 3-5       | MIXED      | ENGAGEMENT_BOOST  |
  | LOYAL      | 12mo+  | $500+  | 6+        | PREFERRED  | VIP_TREATMENT     |

# ❌ Poor: Too many unrelated columns, unclear relationships  
Examples: Mixed Data
  | email | age | country | price | discount | color | size | error_code | message | status |
```

#### **Data Boundary Testing**
```gherkin
# ✅ Good: Systematic boundary value testing
Examples: Age Verification Boundaries
  | Age Input | Category      | Expected_Result | Reason                    |
  | 17        | MINOR         | REJECTED       | Below minimum age         |
  | 18        | ADULT         | ACCEPTED       | Minimum valid age         |
  | 65        | SENIOR        | ACCEPTED       | Senior discount eligible  |
  | 150       | INVALID       | REJECTED       | Unrealistic age value     |
```

### Performance Considerations

#### **Data Volume Management**
```gherkin
@performance @data-volume @scalability
Scenario Outline: System handles various data volumes efficiently
  Given a dataset with <recordCount> records
  And each record has <fieldCount> fields
  And processing complexity is <complexity>
  When batch processing is initiated
  Then processing should complete within <timeLimit>
  And memory usage should stay under <memoryLimit>
  And throughput should exceed <throughputTarget>

  Examples: Small Dataset Performance
    | recordCount | fieldCount | complexity | timeLimit | memoryLimit | throughputTarget |
    | 1000        | 10         | LOW        | 5 seconds | 100MB       | 200 rec/sec     |
    | 5000        | 15         | MEDIUM     | 15 seconds| 250MB       | 300 rec/sec     |

  Examples: Large Dataset Performance
    | recordCount | fieldCount | complexity | timeLimit | memoryLimit | throughputTarget |
    | 100000      | 10         | LOW        | 5 minutes | 1GB         | 500 rec/sec     |
    | 1000000     | 20         | HIGH       | 30 minutes| 4GB         | 800 rec/sec     |
```

### Maintainability Strategies

#### **Data Source Management**
```gherkin
# ✅ Good: External data source reference
@external-data @maintainable
Scenario: Customer data validation uses current business rules
  Given customer data is loaded from "test-data/customer-segments.csv"
  And validation rules are loaded from "config/validation-rules.json"
  When validation is performed for each customer record
  Then results should match expected outcomes in "expected-results/validation-outcomes.csv"

# This approach allows:
# - Data updates without changing feature files
# - Business rule changes through configuration
# - Version control of test data
# - Easier maintenance and collaboration
```

## ✅ Data-Driven Quality Checklist

### Design Quality
- [ ] Data examples represent realistic business scenarios
- [ ] Boundary values and edge cases are included
- [ ] Data relationships are logically consistent
- [ ] Examples are organized for clarity and maintainability
- [ ] Volume of data is appropriate for testing goals

### Business Alignment
- [ ] Data reflects actual business rules and constraints
- [ ] Examples cover important customer segments
- [ ] Error scenarios match real-world failure modes
- [ ] Success criteria align with business objectives
- [ ] Data variations support risk assessment

### Technical Excellence
- [ ] Data tables are properly formatted and readable
- [ ] Parameter names are descriptive and consistent
- [ ] Expected outcomes are specific and measurable
- [ ] Performance implications are considered
- [ ] Data maintenance strategy is established

## 🚀 Advanced Data-Driven Patterns

### Machine Learning Integration

```gherkin
@ml-integration @predictive-testing @data-science
Scenario Outline: ML model predictions validated against business expectations
  Given a trained recommendation model
  And customer interaction history:
    | Customer_ID | Previous_Purchases | Browse_Categories | Time_on_Site | Purchase_Frequency |
    | <customer>  | <purchases>        | <categories>      | <time>       | <frequency>        |
  When recommendation engine generates suggestions
  Then predictions should meet business criteria:
    | Prediction Quality | Target                              |
    | Relevance Score    | Above <relevance_threshold>         |
    | Diversity Index    | Between <min_diversity> and <max_diversity> |
    | Business Value     | Expected revenue > <revenue_target> |
    | Customer Fit       | Matches <customer_segment> profile  |

  Examples: High-Value Customer Recommendations
    | customer | purchases              | categories        | time | frequency | relevance_threshold | min_diversity | max_diversity | revenue_target | customer_segment |
    | VIP001   | Electronics, Books     | Technology, Education | 45min | Weekly   | 0.85               | 0.3          | 0.7          | $200          | TECH_ENTHUSIAST |
    | VIP002   | Fashion, Home & Garden | Lifestyle, Decor     | 30min | Monthly  | 0.80               | 0.4          | 0.8          | $150          | LIFESTYLE_BUYER |
```

### A/B Testing Scenarios

```gherkin
@ab-testing @experimentation @conversion-optimization
Scenario Outline: A/B test variants produce measurable business outcomes
  Given an A/B test setup:
    | Test Configuration | Value              |
    | testName           | <testName>         |
    | variantA           | <variantA>         |
    | variantB           | <variantB>         |
    | trafficSplit       | <trafficSplit>     |
    | successMetric      | <successMetric>    |
  And customer segment <customerSegment> is selected for testing
  When the test runs for <testDuration>
  Then results should show:
    | Outcome Measurement | Target                    |
    | statisticalSignificance | >95%                 |
    | conversionLift         | ><conversionLift>     |
    | revenueImpact          | $<revenueImpact>      |
    | customerSatisfaction   | ><satisfactionScore>  |

  Examples: Checkout Flow Optimization
    | testName        | variantA         | variantB           | trafficSplit | successMetric | customerSegment | testDuration | conversionLift | revenueImpact | satisfactionScore |
    | CHECKOUT_FLOW   | SINGLE_PAGE      | MULTI_STEP         | 50/50        | COMPLETION    | NEW_USERS      | 2 weeks      | 15%           | 25000         | 4.2              |
    | PAYMENT_OPTIONS | CARD_ONLY        | MULTIPLE_METHODS   | 70/30        | CONVERSION    | ALL_USERS      | 1 month      | 8%            | 40000         | 4.5              |
```

## 📚 Summary

This example demonstrates:

1. **Advanced Scenario Outlines** - Comprehensive data-driven testing patterns
2. **Complex Data Relationships** - Multi-dimensional data validation
3. **Business Rule Validation** - Real-world business logic testing
4. **Performance Integration** - Data volume and performance considerations
5. **Maintainable Data Structures** - Scalable and maintainable data organization
6. **Advanced Patterns** - ML integration, A/B testing, and predictive scenarios

### Key Takeaways

- **Strategic Data Design**: Organize data to reflect business logic and relationships
- **Comprehensive Coverage**: Use scenario outlines to test multiple data variations efficiently
- **Business Rule Focus**: Ensure data-driven scenarios validate actual business requirements
- **Maintainable Structure**: Design data tables for long-term maintenance and evolution
- **Performance Awareness**: Consider data volume implications for test execution

### Next Steps

Apply these data-driven patterns to create comprehensive test coverage while maintaining readability and business alignment. Remember: effective data-driven testing combines business insight with technical precision! 🎯