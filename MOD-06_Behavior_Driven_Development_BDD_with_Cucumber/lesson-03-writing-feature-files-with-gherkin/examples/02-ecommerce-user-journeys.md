# Example 02: E-commerce User Journeys

## 📋 Overview

This example demonstrates how to write comprehensive Gherkin feature files that capture complete user journeys in an e-commerce context. It focuses on end-to-end business processes rather than isolated features, showing how to model complex user workflows that span multiple pages and interactions.

## 🎯 Learning Objectives

- Model complete user journeys from start to finish
- Write business-focused scenarios that reflect real user behavior  
- Structure multi-step workflows using proper Gherkin syntax
- Handle complex data flows between scenario steps
- Apply business rule validation in user journey context
- Create maintainable scenarios for evolving business processes

## 🛒 Complete User Journey Examples

### File: `customer-purchase-journey.feature`

```gherkin
@purchase-journey @critical-path @revenue
Feature: Customer Purchase Journey
  As a potential customer
  I want to discover, evaluate, and purchase products seamlessly
  So that I can fulfill my needs with confidence and convenience

  # This feature represents the core revenue-generating user journey
  # Business Impact: Directly affects conversion rates and customer satisfaction
  # Success Metrics: Conversion rate >3%, cart abandonment <70%, checkout completion >85%
  
  Background:
    Given the e-commerce platform is operational
    And the product catalog contains available items
    And the payment processing system is online
    And inventory levels are accurately tracked
    And shipping services are available

  @product-discovery @browsing @high-priority
  Scenario: Customer discovers products through category browsing
    Given I am an anonymous visitor on the homepage
    When I navigate to "Electronics" category
    And I filter products by "Smartphones" subcategory
    And I sort products by "Customer Rating" in descending order
    Then I should see a list of smartphones ordered by rating
    And each product should display essential information:
      | Information     | Required |
      | Product Name    | Yes      |
      | Price          | Yes      |
      | Rating         | Yes      |
      | In Stock Status| Yes      |
      | Product Image  | Yes      |
    And I should see pagination if more than 24 products exist
    And the page should load within 3 seconds

  @product-discovery @search @conversion-critical  
  Scenario: Customer finds specific product through search
    Given I am on any page of the website
    When I enter "iPhone 15 Pro Max 256GB" in the search box
    And I click the search button
    Then I should see search results for "iPhone 15 Pro Max 256GB"
    And the most relevant products should appear first
    And I should see search filters for:
      | Filter Type | Examples           |
      | Price Range | $0-500, $500-1000 |
      | Brand       | Apple, Samsung     |
      | Storage     | 128GB, 256GB       |
      | Color       | Black, White       |
    And search completion should occur within 2 seconds
    And I should see "X results found" message

  @product-evaluation @detailed-view @engagement
  Scenario: Customer evaluates product through detailed product page
    Given I have found "iPhone 15 Pro Max 256GB Space Black" in search results
    When I click on the product title or image
    Then I should be taken to the detailed product page
    And I should see comprehensive product information:
      | Section           | Content                                    |
      | Product Gallery   | Multiple high-resolution images, 360° view|
      | Specifications    | Technical details, dimensions, weight      |
      | Customer Reviews  | Rating breakdown, verified purchase reviews|
      | Q&A Section      | Customer questions and answers             |
      | Shipping Info    | Delivery options, estimated arrival dates  |
      | Return Policy    | Return window, conditions, process         |
    And I should see real-time stock availability
    And the "Add to Cart" button should be prominent and accessible
    And related products should be suggested at the bottom

  @cart-management @user-intent @conversion-funnel
  Scenario: Customer adds products to cart and manages quantities
    Given I am viewing "iPhone 15 Pro Max 256GB Space Black" product page
    And the product is currently in stock
    When I select quantity "1" from the quantity dropdown
    And I choose "Space Black" color option
    And I click "Add to Cart" button
    Then I should see a cart confirmation message
    And the cart icon should update to show "1 item"
    And I should see options to:
      | Action                    | Description                        |
      | Continue Shopping         | Return to previous page            |
      | View Cart                | Go to cart summary page            |
      | Proceed to Checkout      | Begin checkout process             |
    When I click "View Cart" 
    Then I should see my cart summary with:
      | Information    | Details                              |
      | Product Image  | Thumbnail of selected product        |
      | Product Name   | iPhone 15 Pro Max 256GB Space Black |
      | Unit Price     | Current product price                |
      | Quantity       | Editable quantity selector           |
      | Subtotal       | Unit price × quantity                |
      | Total          | Sum of all items + taxes             |

  @cart-optimization @cross-selling @revenue-enhancement
  Scenario: Customer modifies cart with additional items
    Given I have "iPhone 15 Pro Max 256GB" in my cart
    And I am viewing my cart page
    When I see recommended accessories:
      | Product              | Price   | Category    |
      | MagSafe Charger     | $39.00  | Accessory   |
      | iPhone Case         | $49.00  | Protection  |
      | AirPods Pro         | $249.00 | Audio       |
    And I click "Add to Cart" for "MagSafe Charger"
    Then the charger should be added to my cart
    And my cart total should be recalculated automatically
    And I should see updated shipping calculations
    When I change iPhone quantity from "1" to "2"
    Then the cart should update in real-time
    And I should see bulk pricing discounts if applicable
    And inventory availability should be revalidated

  @checkout-initiation @user-journey-progression @critical-conversion
  Scenario: Customer begins secure checkout process
    Given I have items totaling $1,200 in my cart
    And I am ready to purchase
    When I click "Proceed to Checkout" button
    Then I should be taken to the secure checkout page
    And the URL should indicate HTTPS secure connection
    And I should see a checkout progress indicator showing:
      | Step              | Status    |
      | Cart Review       | Completed |
      | Shipping Info     | Current   |
      | Payment Method    | Pending   |
      | Order Confirmation| Pending   |
    And I should see my order summary sidebar with:
      | Information       | Display              |
      | Items List        | Product names, qty   |
      | Subtotal         | Pre-tax amount       |
      | Shipping Cost    | Calculated based on address |
      | Tax Amount       | Based on shipping location  |
      | Order Total      | Final amount to charge      |

  @guest-checkout @conversion-optimization @user-choice
  Scenario: Guest customer completes purchase without account creation
    Given I am at the checkout page as a guest user
    And I have selected "Checkout as Guest" option
    When I fill in my shipping information:
      | Field         | Value                    |
      | First Name    | John                     |
      | Last Name     | Smith                    |
      | Email Address | john.smith@email.com     |
      | Phone Number  | +1-555-123-4567         |
      | Street Address| 123 Main Street         |
      | City          | Anytown                  |
      | State         | California               |
      | ZIP Code      | 90210                    |
      | Country       | United States            |
    And I select "Standard Shipping (5-7 business days)" for $9.99
    And I continue to payment
    Then I should see available payment methods:
      | Payment Type     | Details                           |
      | Credit Card      | Visa, MasterCard, Amex, Discover |
      | PayPal          | Redirect to PayPal login          |
      | Apple Pay       | If supported device detected      |
      | Google Pay      | If supported browser detected     |
    When I select "Credit Card" payment method
    And I enter valid payment information:
      | Field            | Value              |
      | Card Number      | 4111111111111111  |
      | Expiration Date  | 12/25             |
      | Security Code    | 123               |
      | Cardholder Name  | John Smith        |
      | Billing Address  | Same as shipping  |
    And I review my complete order details
    And I click "Place Order" button
    Then my payment should be processed securely
    And I should receive an order confirmation page
    And I should see my order number and confirmation details
    And an order confirmation email should be sent to john.smith@email.com

  @registered-user-checkout @account-benefits @streamlined-experience
  Scenario: Returning customer uses saved information for faster checkout
    Given I am logged in as a returning customer "jane.doe@example.com"
    And I have saved shipping addresses and payment methods
    And I have items worth $750 in my cart
    When I proceed to checkout
    Then I should see my saved information pre-populated:
      | Information Type | Status           |
      | Shipping Address | 3 saved addresses|
      | Payment Methods  | 2 saved cards    |
      | Contact Info     | Auto-filled      |
    When I select my "Home Address" from saved addresses
    And I choose my "Visa ending in 4321" payment method
    And I apply my "LOYAL10" loyalty discount code
    Then I should see the discount applied: $75.00 off
    And my order total should be recalculated to $684.99
    When I confirm my order with one-click
    Then the order should be placed immediately
    And I should earn loyalty points for this purchase
    And I should see estimated delivery based on my address history

  @mobile-checkout @responsive-design @accessibility
  Scenario: Customer completes purchase on mobile device
    Given I am using a mobile phone to browse the website
    And I have added products to my cart via mobile interface
    When I proceed to mobile checkout
    Then the checkout form should be optimized for mobile:
      | Mobile Feature        | Implementation                    |
      | Touch-Friendly Inputs | Large tap targets, proper spacing |
      | Auto-Complete Support | Address and payment auto-fill     |
      | Mobile Keyboard Types | Numeric for phone, email for email|
      | Progress Indication   | Clear step-by-step guidance       |
      | Error Messaging      | Inline, clear, actionable         |
    And I should be able to use mobile payment options:
      | Mobile Payment | Availability              |
      | Apple Pay      | iOS Safari users          |
      | Google Pay     | Android Chrome users      |
      | Samsung Pay    | Samsung device users      |
    When I complete the mobile checkout process
    Then the experience should be as smooth as desktop
    And all functionality should work with touch interactions
    And the confirmation page should be mobile-optimized

  @post-purchase @customer-satisfaction @retention
  Scenario: Customer receives comprehensive post-purchase communication
    Given I have successfully placed order "#ORD-2024-001234"
    And my payment has been processed
    When the order is confirmed in the system
    Then I should receive an immediate order confirmation email containing:
      | Email Content        | Details                              |
      | Order Summary        | Items, quantities, prices            |
      | Shipping Information | Address, method, estimated delivery  |
      | Payment Confirmation | Amount charged, payment method       |
      | Order Tracking       | Tracking number when available       |
      | Customer Service     | Contact information for support      |
      | Return Policy        | Easy returns within 30 days          |
    And I should receive SMS notifications if opted in:
      | SMS Type            | Timing                    |
      | Order Confirmation  | Immediately              |
      | Shipping Notification| When shipped            |
      | Delivery Alert      | When out for delivery    |
      | Delivery Confirmation| When delivered          |
    And my account should show the order in "Order History"
    And I should be able to track the order status in real-time
```

### File: `customer-support-journey.feature`

```gherkin
@customer-support @post-purchase @satisfaction
Feature: Customer Support Journey
  As a customer who needs assistance
  I want to easily access help and resolve issues
  So that I can have a positive experience with the brand

  Background:
    Given the customer support system is operational
    And support agents are available during business hours
    And the knowledge base is up-to-date
    And customer account information is accessible

  @self-service @knowledge-base @efficiency
  Scenario: Customer finds solution through self-service options
    Given I am a customer with an order-related question
    And I am on the website's help center
    When I search for "track my order" in the help search
    Then I should see relevant help articles ranked by usefulness:
      | Article Title              | Category      | Helpfulness |
      | How to Track Your Order    | Order Status  | 95%         |
      | Order Processing Timeline  | Shipping      | 87%         |
      | Understanding Order Status | Order Status  | 82%         |
    When I click "How to Track Your Order"
    Then I should see step-by-step instructions with screenshots
    And I should see a "Track Your Order" widget embedded in the article
    And I should be able to enter my order number directly
    And the solution should resolve my question without contacting support

  @live-chat @real-time-support @conversion-recovery
  Scenario: Customer gets immediate help through live chat
    Given I am browsing products but having difficulty with size selection
    And I notice a live chat widget in the bottom right corner
    When I click the chat widget
    Then I should see a chat window open with:
      | Element              | Content                           |
      | Welcome Message      | "Hi! How can we help you today?" |
      | Agent Availability   | "Average wait time: 2 minutes"   |
      | Pre-chat Form       | Name, email, order# (optional)   |
      | Chat Categories     | Orders, Products, Technical, Returns |
    When I select "Products" category and type "Need help with shoe sizing"
    Then I should be connected to a product specialist
    And the agent should have access to:
      | Information         | Purpose                              |
      | Current Page        | See what product I'm viewing         |
      | Cart Contents       | Understand purchase intent           |
      | Account History     | Provide personalized recommendations |
      | Product Details     | Give accurate sizing guidance        |
    And the agent should provide personalized sizing recommendations
    And I should receive a chat transcript via email after the session

  @return-process @customer-retention @satisfaction-recovery
  Scenario: Customer initiates return through online portal
    Given I have received order "#ORD-2024-001234" but the item doesn't fit
    And it's been 10 days since delivery
    When I log into my account and navigate to "Order History"
    And I click "Return Items" next to my recent order
    Then I should see a return initiation page showing:
      | Return Information    | Details                              |
      | Eligible Items        | Items available for return           |
      | Return Window         | Days remaining for return            |
      | Return Reasons        | Dropdown with specific options       |
      | Return Process        | Step-by-step return instructions     |
      | Refund Information    | When and how refund will be processed|
    When I select the item to return and choose reason "Size too small"
    And I request a "Store Credit" instead of refund to original payment
    Then I should receive a prepaid return shipping label
    And I should see confirmation that store credit will be issued within 3-5 business days
    And I should receive email instructions for packaging and shipping the return
```

## 🎨 User Journey Design Patterns

### Journey Mapping Structure

#### **Complete Journey Arc**
```gherkin
# 1. Discovery Phase
Given [user context and intent]
When [discovery action]
Then [discovery outcome]

# 2. Evaluation Phase  
Given [discovery context established]
When [evaluation actions] 
Then [evaluation outcomes]

# 3. Decision Phase
Given [sufficient evaluation context]
When [decision-making actions]
Then [decision outcomes]

# 4. Action Phase
Given [decision made]
When [primary actions taken]
Then [immediate outcomes]

# 5. Fulfillment Phase
Given [action completed]
When [fulfillment process]
Then [fulfillment outcomes]

# 6. Post-Action Phase
Given [fulfillment completed]
When [follow-up interactions]
Then [satisfaction outcomes]
```

### Business Context Integration

#### **Revenue Impact Scenarios**
```gherkin
@revenue-critical @conversion-funnel
Scenario: High-value customer completes premium purchase
  # Focus on business metrics and revenue impact
  Given a customer with purchase history over $5,000
  When they add premium items totaling $2,500 to cart
  Then checkout should prioritize:
    | Priority Feature      | Business Reason                    |
    | Express Checkout      | Reduce abandonment for high-value |
    | VIP Support Access    | Ensure smooth premium experience   |
    | Loyalty Point Preview | Show value of completing purchase  |
    | Premium Shipping Free | Incentive for high-value orders   |
```

#### **Customer Lifecycle Scenarios**
```gherkin
@customer-lifecycle @retention @lifetime-value
Scenario: First-time visitor becomes repeat customer
  # Track the complete customer lifecycle progression
  Given an anonymous visitor from search engine
  When they complete their first purchase successfully
  And they receive exceptional post-purchase experience
  Then they should be guided into customer lifecycle:
    | Stage              | Action                               |
    | Welcome Series     | Email series with brand introduction |
    | Product Education  | How-to guides for purchased items    |
    | Community Access   | Invitation to customer community     |
    | Loyalty Program    | Automatic enrollment with benefits   |
    | Repurchase Triggers| Reminders based on product lifecycle |
```

### Complex Data Flow Management

#### **Cross-Session Data Persistence**
```gherkin
@data-persistence @user-experience @seamless-journey
Scenario: Customer journey spans multiple sessions and devices
  Given a customer starts shopping on mobile during lunch break
  And adds items to cart but doesn't complete purchase
  When they continue shopping on desktop at home 2 hours later
  Then their complete context should be preserved:
    | Data Type           | Preservation Method                  |
    | Cart Contents       | Cloud sync across devices            |
    | Browsing History    | Recommendation engine input          |
    | Search Queries      | Personalization data                 |
    | Wishlist Items      | Account-based storage                |
    | Size Preferences    | Profile-based defaults               |
    | Payment Methods     | Encrypted secure storage             |
  And their experience should feel continuous and personalized
```

#### **Multi-Stakeholder Scenarios**
```gherkin
@b2b-purchasing @approval-workflow @complex-stakeholders
Scenario: Business customer manages approval-based purchasing
  Given I am a procurement manager at "TechCorp Inc"
  And my company has a $50,000 monthly purchasing limit
  When I create a purchase order for $15,000 of equipment
  Then the system should handle business purchasing workflow:
    | Workflow Step       | Stakeholder           | Action Required        |
    | Request Creation    | Procurement Manager   | Specify business needs |
    | Budget Approval     | Finance Manager       | Verify budget availability |
    | Technical Review    | IT Manager           | Validate specifications |
    | Final Authorization | Department Director   | Approve purchase       |
    | Purchase Execution  | System               | Process approved order |
  And all stakeholders should receive appropriate notifications
  And the audit trail should be maintained for compliance
```

### Error Handling in User Journeys

#### **Graceful Degradation Patterns**
```gherkin
@error-handling @user-experience @resilience
Scenario: Customer journey continues despite service interruptions
  Given a customer is in the middle of checkout process
  And they have entered all shipping and payment information
  When the payment processing service becomes temporarily unavailable
  Then the system should gracefully handle the situation:
    | Recovery Action        | User Experience                     |
    | Save Progress          | All entered data preserved          |
    | Clear Communication    | "Processing temporarily unavailable"|
    | Alternative Options    | PayPal, saved payment methods       |
    | Status Updates        | Real-time service restoration info   |
    | Retry Mechanism       | One-click retry when service returns|
    | Customer Support      | Immediate chat availability         |
  And the customer should not lose their progress or have to re-enter information
```

#### **Business Rule Validation**
```gherkin
@business-rules @inventory-management @real-time-validation
Scenario: Customer attempts to purchase item with complex availability rules
  Given a limited edition product with complex availability rules:
    | Rule Type              | Condition                           |
    | Geographic Restriction | Available only in certain states   |
    | Purchase Limit         | Maximum 2 per customer              |
    | Time Window           | Available only during flash sale    |
    | Membership Requirement | VIP members get early access        |
  When a non-VIP customer from a restricted state attempts to purchase 3 items
  Then the system should validate each rule in business priority order:
    | Validation Order | Rule Check              | Error Response         |
    | 1               | Geographic Eligibility  | "Not available in your area" |
    | 2               | Membership Status       | "VIP early access period"    |
    | 3               | Quantity Limit         | "Limit 2 per customer"       |
    | 4               | Time Window            | "Sale starts at 3 PM"       |
  And provide clear guidance on how to resolve each restriction
  And maintain the customer's intent to purchase when possible
```

## 📊 Business Metrics Integration

### Conversion Funnel Tracking

```gherkin
@analytics @conversion-tracking @business-intelligence
Scenario: Customer journey generates comprehensive analytics data
  Given a customer progresses through the complete purchase funnel
  When each major interaction occurs
  Then the system should capture business-relevant metrics:
    | Funnel Stage        | Key Metrics                          |
    | Product Discovery   | Search terms, category engagement    |
    | Product Evaluation  | Time on product page, image views    |
    | Cart Addition       | Add-to-cart rate, cart value         |
    | Checkout Initiation | Cart abandonment point identification |
    | Payment Processing  | Payment method preference, success rate |
    | Order Completion    | Conversion rate, average order value  |
    | Post-Purchase       | Satisfaction score, repeat purchase intent |
  And data should be available for business intelligence analysis
  And privacy regulations should be strictly followed
```

### Customer Satisfaction Measurement

```gherkin
@customer-satisfaction @feedback-collection @continuous-improvement
Scenario: Customer provides feedback throughout their journey
  Given a customer completes a significant interaction
  When they reach natural feedback collection points
  Then they should have opportunities to provide input:
    | Feedback Point      | Collection Method                   |
    | Post-Purchase       | Email survey with rating scales     |
    | Customer Support    | Chat satisfaction rating            |
    | Product Delivery    | SMS with delivery experience rating |
    | Return Process      | Return reason and experience survey |
    | Site Experience     | Periodic in-app feedback prompts    |
  And feedback should be immediately actionable by relevant teams
  And customers should see how their feedback drives improvements
```

## ✅ Journey Quality Standards

### Completeness Checklist
- [ ] Journey covers end-to-end user experience
- [ ] Business value is clearly articulated
- [ ] Multiple user types and paths are considered  
- [ ] Error conditions and edge cases are included
- [ ] Cross-functional dependencies are documented
- [ ] Success metrics are defined and measurable

### Business Alignment Checklist
- [ ] Scenarios reflect actual user behavior patterns
- [ ] Business rules are accurately represented
- [ ] Revenue impact is considered and measured
- [ ] Customer satisfaction is prioritized
- [ ] Operational efficiency is optimized
- [ ] Compliance requirements are addressed

### Technical Integration Checklist
- [ ] Data flows between systems are modeled
- [ ] Performance requirements are specified
- [ ] Security considerations are included
- [ ] Accessibility standards are met
- [ ] Mobile experience is optimized
- [ ] Analytics and monitoring are integrated

## 🚀 Advanced Journey Patterns

### Personalization Integration

```gherkin
@personalization @machine-learning @customer-experience
Scenario: Customer receives AI-powered personalized experience
  Given a customer with 6 months of interaction history
  And machine learning models have analyzed their preferences
  When they visit the website
  Then their experience should be personalized:
    | Personalization Type | Implementation                       |
    | Product Recommendations | Based on purchase and browse history |
    | Content Prioritization | Show relevant categories first       |
    | Pricing Display        | Highlight applicable discounts       |
    | Shipping Options       | Preferred delivery methods shown first|
    | Communication Tone     | Match customer's interaction style   |
  And personalization should improve over time based on feedback
```

### Cross-Channel Continuity

```gherkin
@omnichannel @customer-experience @seamless-integration
Scenario: Customer journey spans online and offline channels
  Given a customer researches products online
  And visits physical store to experience product
  And completes purchase online for convenience
  When they need support after purchase
  Then their cross-channel journey should be unified:
    | Channel Integration | Data Sharing                         |
    | Online to Store     | Product interest shared with staff   |
    | Store to Online     | In-store experience influences recommendations |
    | Support Access      | Full journey context available to agents |
    | Loyalty Program     | Points earned across all channels    |
    | Return Process      | Return to any channel regardless of purchase channel |
```

## 📚 Summary

This example demonstrates:

1. **End-to-End Journey Modeling** - Complete user experiences from discovery to satisfaction
2. **Business-Focused Language** - Scenarios written from business value perspective  
3. **Complex Data Handling** - Multi-step workflows with persistent data
4. **Cross-Functional Integration** - Scenarios spanning multiple business areas
5. **Real-World Complexity** - Error handling, business rules, and edge cases
6. **Measurable Outcomes** - Business metrics and success criteria integrated

### Key Takeaways

- **Think in Journeys**: Users don't interact with features, they complete journeys
- **Business Value Focus**: Every scenario should connect to business outcomes
- **Data Continuity**: Model how information flows through complex workflows
- **Stakeholder Perspective**: Write scenarios that business stakeholders can validate
- **Measurable Success**: Include specific, measurable acceptance criteria

### Next Steps

With this foundation, you can model complete user journeys for any business domain by focusing on the end-to-end user experience rather than individual system features. Remember: great BDD scenarios tell the story of how your users achieve their goals! 🎯