# E-commerce Feature Files - Examples

This file contains complete Gherkin feature files for common e-commerce scenarios. These examples will be used throughout the module to demonstrate BDD implementation and automation with Cucumber and Playwright.

---

## user-registration.feature

```gherkin
Feature: User Registration
  As a potential customer
  I want to create an account on the e-commerce website
  So that I can make purchases and track my orders

  Background:
    Given I am on the registration page
    And the following email addresses are already registered:
      | email                    |
      | existing@example.com     |
      | another@test.com         |

  Scenario: Successful registration with valid details
    When I fill in the registration form with:
      | field           | value                |
      | first_name      | John                 |
      | last_name       | Smith                |
      | email           | john.smith@email.com |
      | password        | SecurePass123!       |
      | confirm_password| SecurePass123!       |
    And I accept the terms and conditions
    And I click "Create Account"
    Then I should see "Welcome to ShopEasy!" success message
    And I should be redirected to my account dashboard
    And I should receive a welcome email at "john.smith@email.com"

  Scenario: Registration fails with existing email
    When I fill in the registration form with:
      | field           | value                |
      | first_name      | Jane                 |
      | last_name       | Doe                  |
      | email           | existing@example.com |
      | password        | MyPassword123        |
      | confirm_password| MyPassword123        |
    And I accept the terms and conditions
    And I click "Create Account"
    Then I should see "Email already registered" error message
    And I should remain on the registration page
    And I should see "Sign in instead" link

  Scenario: Registration fails with password mismatch
    When I fill in the registration form with:
      | field           | value                |
      | first_name      | Bob                  |
      | last_name       | Wilson               |
      | email           | bob.wilson@email.com |
      | password        | Password123          |
      | confirm_password| Password456          |
    And I click "Create Account"
    Then I should see "Passwords do not match" error message
    And the password fields should be highlighted in red
    And the "Create Account" button should remain disabled

  Scenario: Registration validation for required fields
    When I click "Create Account" without filling any fields
    Then I should see the following validation errors:
      | field           | error_message              |
      | first_name      | First name is required     |
      | last_name       | Last name is required      |
      | email           | Email address is required  |
      | password        | Password is required       |
    And I should see "Please accept terms and conditions" checkbox error
    And the "Create Account" button should be disabled
```

---

## product-search.feature

```gherkin
Feature: Product Search and Filtering
  As a customer
  I want to search and filter products effectively
  So that I can quickly find exactly what I'm looking for

  Background:
    Given I am on the product catalog page
    And the following products are available:
      | name               | category    | brand    | price | rating | in_stock |
      | iPhone 14 Pro      | electronics | Apple    | 999   | 4.5    | true     |
      | Samsung Galaxy S23 | electronics | Samsung  | 899   | 4.3    | true     |
      | MacBook Pro 16"    | electronics | Apple    | 2499  | 4.7    | true     |
      | Dell XPS 13        | electronics | Dell     | 1299  | 4.4    | false    |
      | Nike Air Max       | clothing    | Nike     | 129   | 4.2    | true     |
      | Adidas Ultraboost  | clothing    | Adidas   | 149   | 4.6    | true     |

  Scenario: Search by product name
    When I search for "iPhone"
    Then I should see 1 product in the search results
    And the result should contain "iPhone 14 Pro"
    And the result should display price "$999"
    And the result should show 4.5 star rating

  Scenario: Search by brand
    When I search for "Apple"
    Then I should see 2 products in the search results
    And the results should contain "iPhone 14 Pro" and "MacBook Pro 16""
    And all results should display "Apple" brand
    And results should be sorted by relevance

  Scenario: Search with category filter
    Given I have selected "electronics" category filter
    When I search for "Samsung"
    Then I should see 1 product in the search results
    And the result should be "Samsung Galaxy S23"
    And the category filter should remain active
    And I should see "electronics" in the active filters

  Scenario: Search with price range filter
    Given I have set price filter from $100 to $1000
    When I search for products
    Then I should see 3 products in the search results
    And all products should be priced between $100 and $1000
    And results should be sorted by price ascending
    And I should see price range "$100 - $1000" in active filters

  Scenario: Search with no results
    When I search for "xyz123nonexistent"
    Then I should see "No products found" message
    And I should see "Did you mean:" suggestions section
    And I should see links to popular categories
    And I should see "Clear all filters" option

  Scenario: Filter out-of-stock items
    Given I have enabled "In stock only" filter
    When I view all products
    Then I should see 5 products in the results
    And I should not see "Dell XPS 13"
    And all displayed products should show "In Stock" status
```

---

## shopping-cart.feature

```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to manage items in my shopping cart
  So that I can control my purchases before checkout

  Background:
    Given I am logged in as a customer
    And the following products are available:
      | product_id | name            | price | stock |
      | 1          | iPhone 14 Pro   | 999   | 5     |
      | 2          | MacBook Pro 16" | 2499  | 3     |
      | 3          | AirPods Pro     | 249   | 10    |

  Scenario: Add product to empty cart
    Given my shopping cart is empty
    When I add "iPhone 14 Pro" to my cart
    Then my cart should contain 1 item
    And the cart total should be $999.00
    And I should see "Item added to cart" success message
    And the cart icon should display "1" badge

  Scenario: Add multiple different products
    Given my cart is empty
    When I add "iPhone 14 Pro" to my cart
    And I add "AirPods Pro" to my cart
    Then my cart should contain 2 different items
    And the cart total should be $1,248.00
    And I should see both products listed in cart summary

  Scenario: Increase quantity of existing item
    Given I have 1 "iPhone 14 Pro" in my cart
    When I increase the quantity to 2
    Then my cart should show quantity 2 for "iPhone 14 Pro"
    And the cart total should be $1,998.00
    And the cart icon should display "2" badge

  Scenario: Remove item from cart
    Given I have the following items in my cart:
      | product         | quantity |
      | iPhone 14 Pro   | 1        |
      | AirPods Pro     | 2        |
    When I remove "iPhone 14 Pro" from my cart
    Then I should see "Item removed from cart" message
    And my cart should contain only "AirPods Pro"
    And the cart total should be $498.00

  Scenario: Attempt to add more than available stock
    Given I have 3 "MacBook Pro 16"" in my cart
    When I try to increase quantity to 5
    Then I should see "Only 3 available in stock" warning
    And the quantity should remain at 3
    And I should see "Notify when restocked" option

  Scenario: Cart persistence across sessions
    Given I have 1 "iPhone 14 Pro" in my cart
    When I log out and log back in
    Then my cart should still contain 1 "iPhone 14 Pro"
    And the cart total should still be $999.00

  Scenario: Clear entire cart
    Given I have multiple items in my cart
    When I click "Clear Cart"
    And I confirm the action
    Then my cart should be empty
    And I should see "Your cart is empty" message
    And the cart icon should show no badge
```

---

## checkout-process.feature

```gherkin
Feature: Checkout Process
  As a customer
  I want to complete my purchase securely
  So that I can receive my ordered products

  Background:
    Given I am logged in as a customer "john@example.com"
    And I have the following items in my cart:
      | product       | quantity | price |
      | iPhone 14 Pro | 1        | 999   |
      | AirPods Pro   | 1        | 249   |
    And my cart total is $1,248.00

  Scenario: Complete checkout with saved payment method
    Given I have a saved credit card ending in "4242"
    And I have a saved shipping address
    When I proceed to checkout
    And I select my saved payment method
    And I select my saved shipping address
    And I click "Place Order"
    Then I should see "Order confirmed!" success message
    And I should receive order confirmation email
    And I should see order number in the format "ORD-XXXXXXXX"
    And my cart should be empty

  Scenario: Checkout with new shipping address
    Given I have a saved payment method
    But I have no saved addresses
    When I proceed to checkout
    And I enter a new shipping address:
      | field     | value                |
      | name      | John Smith           |
      | address   | 123 Main Street      |
      | city      | New York             |
      | state     | NY                   |
      | zip       | 10001                |
      | country   | United States        |
    And I select "Save this address" option
    And I click "Place Order"
    Then I should see "Order confirmed!" message
    And the address should be saved to my account

  Scenario: Checkout with new payment method
    Given I have a saved shipping address
    But I have no saved payment methods
    When I proceed to checkout
    And I enter new credit card details:
      | field       | value           |
      | card_number | 4242424242424242|
      | expiry      | 12/25           |
      | cvv         | 123             |
      | name        | John Smith      |
    And I select "Save payment method" option
    And I click "Place Order"
    Then I should see "Order confirmed!" message
    And the payment method should be saved to my account

  Scenario: Checkout fails with insufficient stock
    Given "iPhone 14 Pro" stock is reduced to 0 after I added it to cart
    When I proceed to checkout
    Then I should see "iPhone 14 Pro is no longer available" error
    And I should be redirected to my cart
    And the unavailable item should be highlighted
    And I should see "Remove unavailable items" option

  Scenario: Apply discount code during checkout
    Given I have a valid discount code "SAVE10" for 10% off
    When I proceed to checkout
    And I enter discount code "SAVE10"
    And I click "Apply Code"
    Then I should see "Discount applied!" success message
    And the discount should show as "-$124.80"
    And the new total should be $1,123.20

  Scenario: Checkout validation for required fields
    When I proceed to checkout
    And I click "Place Order" without filling required fields
    Then I should see the following validation errors:
      | section  | field           | error_message              |
      | shipping | address         | Shipping address required  |
      | payment  | payment_method  | Payment method required    |
    And the order should not be placed
    And I should remain on the checkout page
```

---

## order-tracking.feature

```gherkin
Feature: Order Tracking
  As a customer
  I want to track my orders after purchase
  So that I know when to expect delivery

  Background:
    Given I am logged in as customer "john@example.com"
    And I have placed the following orders:
      | order_id    | date       | status      | total | items                    |
      | ORD-001234  | 2024-01-15 | delivered   | 1248  | iPhone 14 Pro, AirPods  |
      | ORD-001235  | 2024-01-18 | shipped     | 2499  | MacBook Pro 16"         |
      | ORD-001236  | 2024-01-20 | processing  | 378   | AirPods Pro, Phone Case |

  Scenario: View order history
    When I visit my account orders page
    Then I should see 3 orders in my order history
    And orders should be sorted by date descending
    And each order should display:
      | field        |
      | order_number |
      | order_date   |
      | status       |
      | total_amount |
      | item_count   |

  Scenario: Track active order
    When I click on order "ORD-001235"
    Then I should see detailed order information:
      | field           | value                |
      | status          | Shipped              |
      | tracking_number | 1Z999AA1234567890    |
      | carrier         | UPS                  |
      | estimated_delivery | January 22, 2024   |
    And I should see order progress timeline
    And I should see "Track Package" link to carrier website

  Scenario: View delivered order details
    When I click on order "ORD-001234"
    Then I should see order status "Delivered"
    And I should see delivery date "January 17, 2024"
    And I should see "Write Review" buttons for each item
    And I should see "Reorder Items" option
    And I should not see tracking information

  Scenario: Search orders by product name
    When I search my orders for "MacBook"
    Then I should see 1 order in the results
    And the result should be order "ORD-001235"
    And the MacBook Pro should be highlighted in the order

  Scenario: Filter orders by status
    When I filter orders by status "processing"
    Then I should see 1 order in the results
    And the order should be "ORD-001236"
    And I should see "Cancel Order" option for processing orders

  Scenario: Download order invoice
    Given order "ORD-001234" is delivered
    When I click "Download Invoice" for order "ORD-001234"
    Then I should receive a PDF invoice download
    And the invoice should contain order details and billing information
```

---

## Key Features of These Examples

### 1. **Comprehensive Coverage**
- **Happy path scenarios** for normal user behavior
- **Edge cases** like out-of-stock items and validation errors
- **Error conditions** and system limitations
- **Business rules** like stock validation and discount codes

### 2. **Business-Readable Language** 
- **User-focused perspective** with "As a customer" context
- **Plain English** that non-technical stakeholders understand
- **Business terminology** rather than technical jargon
- **Value proposition** clearly stated in feature descriptions

### 3. **Specific and Testable**
- **Concrete data examples** with actual product names and prices
- **Precise expected outcomes** with specific messages and behaviors
- **Data tables** for organizing complex test data
- **Measurable assertions** that can be automated

### 4. **Real-World Scenarios**
- **Common e-commerce workflows** that users actually perform
- **Cross-feature integration** showing how features work together
- **User journey coverage** from registration through order tracking
- **Business logic complexity** reflecting actual application requirements

### 5. **Automation-Ready Structure**
- **Consistent step definitions** that can be reused across scenarios
- **Clear preconditions** set up in Background sections
- **Parameterized steps** using data tables and examples
- **Organized feature files** following BDD best practices

---

*These feature files will be implemented with actual Cucumber step definitions and Playwright automation in subsequent lessons of this module.*