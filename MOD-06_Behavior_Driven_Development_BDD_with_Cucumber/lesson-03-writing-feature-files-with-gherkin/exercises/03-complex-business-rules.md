# Exercise 03: Complex Business Rules

## 🎯 Exercise Overview

This advanced exercise challenges you to model complex, interconnected business rules using sophisticated Gherkin patterns. You'll work with multi-layered decision logic, conditional workflows, and business rules that have dependencies, priorities, and exceptions.

## 📚 Learning Objectives

By completing this exercise, you will:
- Model complex business logic with multiple decision points
- Handle conditional workflows and rule dependencies
- Create scenarios for business rules with exceptions and edge cases
- Structure feature files for maintainable complex rule testing
- Apply advanced Gherkin patterns for sophisticated business scenarios
- Balance comprehensive coverage with readability and maintainability

## ⏱️ Time Allocation
- **Total Time**: 150 minutes
- **Part A**: Multi-Layered Decision Logic (40 minutes)
- **Part B**: Conditional Workflows (35 minutes)
- **Part C**: Rule Dependencies and Priorities (40 minutes)
- **Part D**: Exception Handling and Edge Cases (35 minutes)

---

## 🧠 Part A: Multi-Layered Decision Logic (40 minutes)

### Task A1: Insurance Risk Assessment Engine

**Business Context**: ReadMore Books offers shipping insurance with complex risk assessment algorithms that consider multiple factors to determine coverage eligibility, pricing tiers, and special handling requirements.

#### Business Rules Complexity:

**Primary Risk Factors:**
- Package value tiers: Low (<$50), Medium ($50-$200), High ($200-$500), Premium (>$500)
- Destination risk levels: Safe, Moderate, High-Risk, Restricted
- Shipping method: Standard, Express, Overnight, International
- Customer reliability score: New (0-2), Established (3-6), Trusted (7-8), VIP (9-10)

**Secondary Considerations:**
- Historical claim rate by customer and destination
- Seasonal risk adjustments (holiday rush, weather patterns)
- Package contents (fragile, valuable, restricted items)
- Insurance claim history and fraud indicators

**Decision Matrix Outcomes:**
- Coverage: Approved, Approved with Conditions, Declined
- Premium calculation: Base rate + risk multipliers
- Special requirements: Signature required, Photo proof, Adult signature
- Claim limits: Standard, Enhanced, Premium, Unlimited

#### Your Task:
Create a comprehensive feature file that models this decision matrix using advanced Gherkin patterns.

#### Template Framework:
```gherkin
@insurance-risk-assessment @complex-business-rules @decision-matrix
Feature: Shipping Insurance Risk Assessment
  As ReadMore Books insurance underwriter
  I want to accurately assess shipping insurance risk
  So that we provide appropriate coverage while managing business risk

  # Business Impact: Risk management, profitability, customer satisfaction
  # Complexity: Multi-factor decision matrix with conditional logic
  # Stakeholders: Insurance, Operations, Customer Service, Finance

  Background:
    Given the insurance risk assessment engine is operational
    And historical risk data is loaded and current
    And customer reliability scores are updated
    And destination risk levels are configured
    And seasonal adjustments are applied for current period

  @comprehensive-risk-evaluation @multi-factor-analysis
  Scenario Outline: Risk assessment evaluates multiple factors for coverage decision
    Given a shipping insurance request with package details:
      | Package Attribute | Value                |
      | packageValue      | <packageValue>       |
      | contents          | <contents>           |
      | fragility         | <fragility>          |
      | dimensions        | <dimensions>         |
    And customer profile shows:
      | Customer Attribute | Value                |
      | reliabilityScore   | <reliabilityScore>   |
      | claimHistory       | <claimHistory>       |
      | accountTenure      | <accountTenure>      |
      | fraudIndicators    | <fraudIndicators>    |
    And shipping details are:
      | Shipping Attribute | Value                |
      | destination        | <destination>        |
      | shippingMethod     | <shippingMethod>     |
      | deliveryTimeline   | <deliveryTimeline>   |
    When risk assessment is performed
    Then the coverage decision should be <coverageDecision>
    And the risk tier should be classified as <riskTier>
    And the premium calculation should include:
      | Premium Component  | Value                |
      | baseRate          | <baseRate>           |
      | riskMultiplier    | <riskMultiplier>     |
      | seasonalAdjustment| <seasonalAdjustment> |
      | totalPremium      | <totalPremium>       |
    And special requirements should be <specialRequirements>
    And claim limit should be set to <claimLimit>

    Examples: Low-Risk High-Value Scenarios
      # Add comprehensive examples covering various combinations
      
    Examples: High-Risk Customer Scenarios
      # Focus on customers with risk indicators
      
    Examples: International Shipping Complexities
      # Complex international shipping rules
      
    Examples: Seasonal Risk Adjustments
      # Holiday and weather-related risk changes
```

#### Success Criteria:
- [ ] Minimum 40 examples across all risk combinations
- [ ] All business rule intersections covered
- [ ] Edge cases for boundary values included
- [ ] Clear business logic validation in assertions
- [ ] Realistic risk assessment data used

---

### Task A2: Dynamic Content Personalization Engine

**Business Context**: ReadMore Books implements sophisticated content personalization that considers reading history, demographic data, browsing behavior, and contextual factors to deliver targeted book recommendations and personalized experiences.

#### Multi-Layered Personalization Logic:

**User Profiling Dimensions:**
- Reading preferences: Genre preferences, author following, series completion rates
- Engagement patterns: Browse time, review activity, purchase frequency
- Demographic factors: Age group, geographic region, language preferences
- Behavioral indicators: Device usage, time of day, session patterns

**Contextual Factors:**
- Current trends and seasonal interests
- Social influence (friends' activity, popular choices)
- Inventory optimization (promote overstocked items)
- Marketing campaign alignment

**Personalization Outcomes:**
- Homepage layout customization
- Recommendation algorithm weights
- Promotional content targeting
- Email marketing personalization
- Search result ranking adjustments

#### Your Task:
Model this personalization engine as testable business scenarios focusing on decision logic and outcomes.

#### Success Criteria:
- [ ] Cover all major personalization dimensions
- [ ] Include contextual factor interactions
- [ ] Model edge cases for new users vs. established users
- [ ] Validate business outcomes rather than technical implementation
- [ ] Demonstrate how multiple factors combine to influence decisions

---

## 🔄 Part B: Conditional Workflows (35 minutes)

### Task B1: Order Fulfillment Workflow Engine

**Business Context**: ReadMore Books order fulfillment involves complex conditional workflows that adapt based on inventory status, customer preferences, geographic constraints, and business priorities.

#### Workflow Decision Points:

**Inventory Assessment:**
- Available in primary warehouse → Standard fulfillment
- Available in secondary warehouse → Cross-dock fulfillment  
- Partial availability → Split shipment or backorder decision
- Out of stock → Supplier order or alternative recommendation

**Customer Preference Integration:**
- Delivery speed requirements vs. cost sensitivity
- Environmental preferences (consolidated shipping)
- Gift wrapping and special handling needs
- Communication preferences for updates

**Geographic and Regulatory Considerations:**
- International shipping restrictions and documentation
- Regional tax and duty calculations
- Local delivery partnerships and capabilities
- Customs and compliance requirements

#### Your Task:
Create feature files that model these conditional workflows with proper decision branching.

#### Template Pattern:
```gherkin
@order-fulfillment @conditional-workflows @supply-chain
Feature: Order Fulfillment Workflow Orchestration
  As ReadMore Books operations manager
  I want orders to be fulfilled optimally based on multiple factors
  So that customer satisfaction is maximized while operational efficiency is maintained

  Background:
    Given the order fulfillment system is operational
    And inventory levels are current across all warehouses
    And shipping partner capabilities are updated
    And customer preference data is accessible

  @inventory-driven-decisions @workflow-branching
  Scenario Outline: Order fulfillment adapts workflow based on inventory availability
    Given an order with items:
      | Item Details      | Value                    |
      | bookTitles        | <bookTitles>             |
      | quantities        | <quantities>             |
      | specialRequests   | <specialRequests>        |
    And current inventory status shows:
      | Inventory Location | Availability             |
      | primaryWarehouse   | <primaryAvailability>    |
      | secondaryWarehouse | <secondaryAvailability>  |
      | supplierStock      | <supplierAvailability>   |
    And customer preferences are:
      | Preference Type   | Value                    |
      | deliverySpeed     | <deliverySpeed>          |
      | costSensitivity   | <costSensitivity>        |
      | consolidatedShip  | <consolidatedShipping>   |
    When order fulfillment workflow is initiated
    Then the fulfillment strategy should be <fulfillmentStrategy>
    And the workflow should branch to <workflowBranch>
    And customer communication should include <customerUpdate>
    And estimated delivery should be <estimatedDelivery>

    Examples: Standard Fulfillment Scenarios
      # Primary warehouse has full inventory
      
    Examples: Complex Multi-Warehouse Scenarios
      # Split across warehouses requiring coordination
      
    Examples: Backorder and Alternative Workflows
      # Out of stock scenarios with customer choice points
      
    Examples: International Shipping Complexities
      # Cross-border fulfillment with regulatory considerations
```

#### Success Criteria:
- [ ] All major workflow branches covered
- [ ] Decision points clearly modeled
- [ ] Customer choice scenarios included
- [ ] Business rule priorities respected
- [ ] Exception handling workflows addressed

---

### Task B2: Customer Service Escalation Matrix

**Business Context**: ReadMore Books customer service uses a sophisticated escalation matrix that routes issues based on complexity, customer value, issue type, and available resources.

#### Escalation Logic:
- Issue categorization and complexity scoring
- Customer tier and relationship value assessment  
- Agent skill matching and availability
- Resolution time commitments and SLA management
- Escalation triggers and approval workflows

#### Your Task:
Model the customer service escalation decision matrix as conditional workflow scenarios.

---

## 🏗️ Part C: Rule Dependencies and Priorities (40 minutes)

### Task C1: Multi-Vendor Marketplace Pricing Engine

**Business Context**: ReadMore Books operates a marketplace where multiple vendors sell books, requiring complex pricing rules that handle vendor margins, platform fees, competitive positioning, and promotional strategies.

#### Interdependent Pricing Rules:

**Vendor Tier System:**
- Platinum vendors: 5% platform fee, priority listing, promotional support
- Gold vendors: 8% platform fee, standard listing, basic promotional access
- Silver vendors: 12% platform fee, limited listing visibility
- Bronze vendors: 15% platform fee, minimal promotional access

**Competitive Pricing Logic:**
- Price matching within vendor tier (automatic adjustments)
- Cross-tier price protection (prevent undercutting)
- Promotional price approval workflows
- Dynamic pricing based on demand and inventory

**Platform Revenue Optimization:**
- Minimum margin requirements
- High-velocity item fee adjustments
- Seasonal pricing strategy enforcement
- Category-specific pricing rules

**Customer Experience Priorities:**
- Price transparency and consistency
- Fair competition between vendors
- Quality-price balance optimization

#### Your Task:
Create scenarios that validate how these interdependent rules work together and resolve conflicts.

#### Template Structure:
```gherkin
@marketplace-pricing @rule-dependencies @vendor-management
Feature: Multi-Vendor Marketplace Pricing Engine
  As ReadMore Books marketplace manager
  I want pricing rules to balance vendor success with platform profitability
  So that we maintain a competitive, fair, and profitable marketplace

  Background:
    Given the marketplace pricing engine is operational
    And vendor tier data is current
    And competitive pricing data is loaded
    And promotional campaigns are configured
    And platform margin requirements are set

  @rule-priority-resolution @conflict-management
  Scenario Outline: Pricing engine resolves rule conflicts according to business priorities
    Given marketplace vendors with details:
      | Vendor Attribute | Vendor A          | Vendor B          | Vendor C          |
      | vendorTier       | <tierA>           | <tierB>           | <tierC>           |
      | currentMargin    | <marginA>         | <marginB>         | <marginC>         |
      | performanceScore | <performanceA>    | <performanceB>    | <performanceC>    |
    And they are selling the same book with pricing:
      | Pricing Attribute | Vendor A          | Vendor B          | Vendor C          |
      | proposedPrice     | <priceA>          | <priceB>          | <priceC>          |
      | promotionalOffer  | <promoA>          | <promoB>          | <promoC>          |
    And current market conditions are:
      | Market Factor     | Value                                  |
      | demandLevel       | <demandLevel>                         |
      | competitorPricing | <competitorPricing>                   |
      | seasonalFactor    | <seasonalFactor>                      |
    When pricing rule evaluation is performed
    Then the pricing decisions should be:
      | Vendor | Final Price | Listing Priority | Promotional Eligibility | Margin Impact |
      | A      | <finalPriceA> | <priorityA>    | <promoEligibilityA>     | <marginImpactA> |
      | B      | <finalPriceB> | <priorityB>    | <promoEligibilityB>     | <marginImpactB> |
      | C      | <finalPriceC> | <priorityC>    | <promoEligibilityC>     | <marginImpactC> |
    And rule conflicts should be resolved as <conflictResolution>
    And platform revenue impact should be <revenueImpact>

    Examples: # Comprehensive rule interaction scenarios
```

#### Success Criteria:
- [ ] All rule interdependencies covered
- [ ] Conflict resolution scenarios included
- [ ] Business priority hierarchy validated
- [ ] Edge cases for rule boundary conditions
- [ ] Platform and vendor outcome balance

---

### Task C2: Subscription Plan Migration Engine

**Business Context**: ReadMore Books subscription service handles complex plan migrations with prorations, feature transitions, billing adjustments, and customer communication requirements.

#### Migration Rule Dependencies:
- Current plan features vs. target plan capabilities
- Billing cycle alignment and proration calculations
- Usage data migration and feature access continuity
- Customer communication workflow and approval processes
- Revenue recognition and accounting implications

#### Your Task:
Model subscription plan migration scenarios that handle rule dependencies and business priorities.

---

## ⚠️ Part D: Exception Handling and Edge Cases (35 minutes)

### Task D1: Payment Processing Exception Matrix

**Business Context**: ReadMore Books payment processing must handle various failure scenarios, fraud prevention triggers, international payment complexities, and recovery workflows while maintaining excellent customer experience.

#### Exception Scenarios:

**Payment Failure Types:**
- Insufficient funds → Retry logic and customer notification
- Invalid payment method → Alternative payment options
- Fraud detection triggers → Manual review and verification
- Technical failures → Automatic retry with escalation
- International payment blocks → Compliance and alternative routing

**Recovery Workflows:**
- Automatic retry strategies with exponential backoff
- Customer self-service recovery options
- Manual intervention triggers and approval processes
- Partial payment scenarios and instalment options
- Refund and cancellation workflows

**Business Rule Exceptions:**
- VIP customer special handling
- High-value transaction manual approval
- Regulatory compliance requirements
- Seasonal payment processing adjustments

#### Your Task:
Create comprehensive scenarios that cover payment exception handling and recovery workflows.

#### Template Pattern:
```gherkin
@payment-processing @exception-handling @fraud-prevention
Feature: Payment Processing Exception Management
  As ReadMore Books payment operations manager
  I want payment failures to be handled gracefully with optimal recovery outcomes
  So that customer experience is maintained while business risk is minimized

  Background:
    Given the payment processing system is operational
    And fraud detection algorithms are active
    And customer notification systems are available
    And manual review workflows are staffed
    And alternative payment methods are configured

  @comprehensive-failure-handling @recovery-workflows
  Scenario Outline: Payment processing handles exceptions according to failure type and customer profile
    Given a customer with profile:
      | Customer Attribute | Value                  |
      | customerTier       | <customerTier>         |
      | paymentHistory     | <paymentHistory>       |
      | riskScore          | <riskScore>            |
      | accountTenure      | <accountTenure>        |
    And a payment attempt with details:
      | Payment Attribute  | Value                  |
      | amount             | <amount>               |
      | paymentMethod      | <paymentMethod>        |
      | currency           | <currency>             |
      | merchantCategory   | <merchantCategory>     |
    When payment processing encounters <failureType>
    Then the system should respond with <immediateResponse>
    And the recovery workflow should be <recoveryWorkflow>
    And customer communication should include <customerMessage>
    And retry strategy should be <retryStrategy>
    And business escalation should be <escalationLevel>
    And transaction status becomes <finalStatus>

    Examples: Standard Payment Failures
      # Common failure scenarios with standard recovery
      
    Examples: Fraud Detection Scenarios
      # Security-triggered failures requiring verification
      
    Examples: High-Value Transaction Exceptions
      # Special handling for large amounts
      
    Examples: International Payment Complexities
      # Cross-border payment specific failures
      
    Examples: VIP Customer Special Handling
      # Enhanced service for premium customers
```

#### Success Criteria:
- [ ] All major exception types covered
- [ ] Recovery workflows clearly defined
- [ ] Customer experience considerations addressed
- [ ] Business risk mitigation strategies included
- [ ] Escalation procedures validated

---

### Task D2: Inventory Synchronization Edge Cases

**Business Context**: ReadMore Books multi-channel inventory system must handle synchronization conflicts, timing issues, and data inconsistencies while preventing overselling and maintaining accurate availability information.

#### Edge Case Categories:
- Concurrent order processing with limited inventory
- Real-time inventory updates vs. cached display data
- Warehouse transfer timing and in-transit inventory
- Vendor drop-ship coordination and availability windows
- System outage recovery and data reconciliation

#### Your Task:
Model inventory synchronization edge cases and exception handling scenarios.

---

## 🏆 Advanced Integration Challenge

### Task: Comprehensive Business Rule Orchestra

**Challenge**: Create a feature file that demonstrates how multiple complex business rule systems work together in a realistic end-to-end scenario.

**Scenario**: A high-value VIP customer places a complex international order during a promotional period, requiring integration of:
- Customer tier privileges and personalization
- Inventory allocation across multiple warehouses
- International shipping and compliance rules
- Promotional pricing with multiple discount stacking
- Payment processing with currency conversion
- Risk assessment for high-value international shipment

#### Your Challenge:
Design scenarios that show how these systems interact and handle conflicts or exceptions.

#### Success Criteria:
- [ ] Multiple business rule systems integrated
- [ ] Cross-system dependencies handled
- [ ] Exception scenarios across system boundaries
- [ ] Business priority resolution demonstrated
- [ ] End-to-end customer experience maintained

---

## 💡 Complex Rules Best Practices

### Modeling Techniques

#### **1. Hierarchical Rule Organization**
```gherkin
# Organize rules by priority and dependency
Feature: Primary Business Rules
  # Core rules that other systems depend on

Feature: Secondary Business Rules  
  # Rules that extend or modify primary rules
  
Feature: Exception Handling Rules
  # Special cases and edge condition handling
```

#### **2. Clear Rule Precedence**
```gherkin
Scenario: Rule conflict resolution follows business priority hierarchy
  Given multiple applicable rules:
    | Rule Type          | Priority | Applicability |
    | Customer Tier      | HIGH     | VIP Customer  |
    | Promotional Code   | MEDIUM   | Active Campaign |
    | Volume Discount    | LOW      | Order Size > $100 |
  When rule evaluation is performed
  Then the highest priority rule should take precedence
  And lower priority rules should be adjusted accordingly
```

#### **3. Dependency Mapping**
```gherkin
# Make rule dependencies explicit in scenarios
Given customer eligibility is verified (prerequisite)
And inventory availability is confirmed (prerequisite)
When promotional pricing rules are applied (dependent on prerequisites)
Then pricing calculation should reflect all applicable adjustments
```

### Maintainability Strategies

#### **1. Business Rule Documentation**
- Include business rule references in feature comments
- Link scenarios to business policy documents
- Explain rule precedence and conflict resolution

#### **2. Scenario Organization**
- Group related rule scenarios together
- Use clear naming conventions for complex rules
- Separate normal flow from exception handling

#### **3. Data Management**
- Use realistic business data in examples
- Maintain consistency across related scenarios
- Document data relationships and dependencies

---

## 🎯 Deliverables

By the end of this exercise, you should have:

1. **Insurance Risk Assessment** - Multi-factor decision matrix modeling
2. **Content Personalization** - Complex algorithm behavior scenarios
3. **Order Fulfillment Workflows** - Conditional workflow branching
4. **Customer Service Escalation** - Decision matrix with priorities
5. **Marketplace Pricing Engine** - Interdependent rule validation
6. **Subscription Migration** - Complex rule dependency handling
7. **Payment Exception Matrix** - Comprehensive failure scenario coverage
8. **Inventory Synchronization** - Edge case and timing issue scenarios
9. **Integration Challenge** - End-to-end complex rule orchestration

Each deliverable should demonstrate:
- ✅ Complex business logic modeled clearly
- ✅ Rule dependencies and priorities validated
- ✅ Exception handling and edge cases covered
- ✅ Business stakeholder readability maintained
- ✅ Comprehensive test coverage achieved

---

## 🔗 Next Steps

After mastering complex business rules:
1. **Stakeholder validation** - Review complex scenarios with business experts
2. **Implementation strategy** - Plan step definition architecture for complex rules
3. **Test data management** - Design data strategies for complex scenario execution
4. **Performance considerations** - Optimize complex rule testing for efficiency
5. **Maintenance planning** - Establish processes for business rule changes

This advanced foundation prepares you for the most sophisticated business rule testing challenges in enterprise environments! 🎯

---

## 📚 Resources for Reference

- **Business Rule Modeling**: Techniques for complex logic representation
- **Decision Matrix Design**: Methods for multi-factor decision modeling
- **Exception Handling Patterns**: Strategies for comprehensive error scenario coverage
- **Workflow Modeling**: Approaches for conditional business process testing