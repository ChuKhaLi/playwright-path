# Exercise 01: Converting Requirements to User Stories

**Difficulty:** Beginner  
**Estimated Time:** 15 minutes  
**Skills Practiced:** User story writing, acceptance criteria, business value identification

## Learning Objectives

By completing this exercise, you will:
- Transform traditional requirements into BDD-style user stories
- Practice writing user stories with clear business value
- Create specific acceptance criteria for user stories
- Understand the user-centered approach of BDD

## Exercise Overview

You'll be given traditional software requirements and need to convert them into user stories following the BDD format: `As a [user type], I want [functionality], so that [business value]`.

## Instructions

For each requirement below:
1. **Identify the user type** - who will use this functionality?
2. **Define the desired functionality** - what do they want to accomplish?
3. **Explain the business value** - why is this important to them?
4. **Write acceptance criteria** - how will we know it's working correctly?

---

## Task 1: E-commerce Product Search

### Traditional Requirement:
```
The system shall provide a search function that allows users to find products 
by entering keywords. The search should return relevant results and handle 
cases where no products match the search terms.
```

### Your Task:
**Write a user story and acceptance criteria for this requirement.**

**User Story Template:**
```
As a _______________,
I want _______________,
So that _______________.
```

**Acceptance Criteria Template:**
```
Given _______________,
When _______________,
Then _______________.
```

**Your Answer:**
```
User Story:
As a ________________________,
I want ________________________,
So that ________________________.

Acceptance Criteria:
1. Given ________________________,
   When ________________________,
   Then ________________________.

2. Given ________________________,
   When ________________________,
   Then ________________________.

3. Given ________________________,
   When ________________________,
   Then ________________________.
```

---

## Task 2: User Registration System

### Traditional Requirement:
```
The application must implement user registration functionality. Users should 
be able to create accounts with email and password. The system should validate 
email format and password strength. Email verification is required before 
account activation.
```

### Your Task:
**Convert this into user stories. Note: This requirement might need multiple user stories.**

**Your Answer:**
```
User Story 1:
As a ________________________,
I want ________________________,
So that ________________________.

Acceptance Criteria:
- ________________________
- ________________________
- ________________________

User Story 2:
As a ________________________,
I want ________________________,
So that ________________________.

Acceptance Criteria:
- ________________________
- ________________________
- ________________________
```

---

## Task 3: Order Status Tracking

### Traditional Requirement:
```
Customers should be able to view their order status and tracking information. 
The system will display order details including items purchased, shipping 
address, expected delivery date, and current status (processing, shipped, 
delivered, etc.).
```

### Your Task:
**Create a user story with comprehensive acceptance criteria.**

**Your Answer:**
```
User Story:
As a ________________________,
I want ________________________,
So that ________________________.

Acceptance Criteria:
1. ________________________
2. ________________________
3. ________________________
4. ________________________
5. ________________________
```

---

## Task 4: Shopping Cart Management

### Traditional Requirement:
```
The shopping cart feature should allow users to add products, modify quantities, 
remove items, and view total cost. The cart should persist across browser 
sessions for logged-in users.
```

### Your Task:
**Break this into multiple user stories, each focused on a specific user goal.**

**Your Answer:**
```
User Story 1 (Add Products):
As a ________________________,
I want ________________________,
So that ________________________.

User Story 2 (Modify Cart):
As a ________________________,
I want ________________________,
So that ________________________.

User Story 3 (Cart Persistence):
As a ________________________,
I want ________________________,
So that ________________________.
```

---

## Task 5: Customer Reviews System

### Traditional Requirement:
```
Implement a product review system where customers can rate products (1-5 stars) 
and write comments. Reviews should be displayed on product pages. Only customers 
who purchased the product can write reviews. Reviews can be sorted by date, 
rating, or helpfulness.
```

### Your Task:
**Create user stories from different user perspectives (consider reviewer and reader perspectives).**

**Your Answer:**
```
User Story 1 (Writing Reviews):
As a ________________________,
I want ________________________,
So that ________________________.

Acceptance Criteria:
- ________________________
- ________________________
- ________________________

User Story 2 (Reading Reviews):
As a ________________________,
I want ________________________,
So that ________________________.

Acceptance Criteria:
- ________________________
- ________________________
- ________________________
```

---

## Self-Assessment Questions

After completing the tasks, answer these questions:

1. **User-Centered Focus:** 
   - Did your user stories focus on user needs rather than system functionality?
   - Can you clearly identify who benefits from each story?

2. **Business Value:**
   - Does each "so that" clause explain real business value?
   - Would stakeholders understand why these features matter?

3. **Acceptance Criteria:**
   - Are your criteria specific and testable?
   - Do they cover both positive and negative scenarios?

4. **Story Size:**
   - Are your stories small enough to be completed in one iteration?
   - Did you break down complex requirements appropriately?

---

## Solution Examples

### Task 1 Solution:
```
User Story:
As a customer browsing the online store,
I want to search for products using keywords,
So that I can quickly find items I'm interested in purchasing.

Acceptance Criteria:
1. Given I am on the product catalog page,
   When I enter a product name in the search box,
   Then I should see relevant products matching my search term.

2. Given I search for a term with no matching products,
   When I submit the search,
   Then I should see a "No results found" message with search suggestions.

3. Given I enter partial product names,
   When I search,
   Then I should see products that contain those keywords in name or description.
```

### Task 2 Solution:
```
User Story 1:
As a new visitor to the online store,
I want to create an account with my email and password,
So that I can make purchases and track my order history.

Acceptance Criteria:
- Email format is validated before account creation
- Password must meet security requirements (length, complexity)
- Account creation sends verification email immediately
- User sees confirmation that verification email was sent

User Story 2:
As a new user who just registered,
I want to verify my email address,
So that I can activate my account and start shopping.

Acceptance Criteria:
- Verification email contains clickable activation link
- Clicking link activates account and confirms email
- Activated users can log in successfully
- Unverified users see reminder to check email when trying to log in
```

### Task 3 Solution:
```
User Story:
As a customer who has placed an order,
I want to view my order status and tracking information,
So that I know when to expect my delivery and can plan accordingly.

Acceptance Criteria:
1. I can access order details using my order number or from my account
2. Order status clearly shows current stage (processing, shipped, delivered)
3. Tracking number is displayed when order ships
4. Expected delivery date is shown and updated if changed
5. Complete order details show items, quantities, prices, and shipping address
```

### Task 4 Solution:
```
User Story 1 (Add Products):
As a customer browsing products,
I want to add items to my shopping cart,
So that I can collect items for purchase in one transaction.

User Story 2 (Modify Cart):
As a customer reviewing my cart,
I want to change quantities or remove items,
So that I can adjust my order before checkout.

User Story 3 (Cart Persistence):
As a returning customer,
I want my cart items to be saved when I log back in,
So that I don't lose my selections and can continue shopping later.
```

### Task 5 Solution:
```
User Story 1 (Writing Reviews):
As a customer who purchased a product,
I want to write a review and rating,
So that I can share my experience to help other customers make decisions.

Acceptance Criteria:
- Only verified purchasers can write reviews for products they bought
- Review includes star rating (1-5) and optional written comment
- Review submission includes purchase verification check
- Users can edit or delete their own reviews

User Story 2 (Reading Reviews):
As a potential customer considering a purchase,
I want to read reviews and ratings from other customers,
So that I can make an informed buying decision.

Acceptance Criteria:
- Reviews are displayed on product pages with rating and comment
- Reviews can be sorted by date, rating, or helpfulness
- Average rating is prominently displayed
- Review helpfulness voting is available for other customers
```

---

## Key Learning Points

### ✅ **User Story Format**
- **As a [user]:** Identifies who benefits from the feature
- **I want [functionality]:** Describes the desired capability
- **So that [value]:** Explains the business value or benefit

### ✅ **Good User Stories Are:**
- **User-focused:** Written from user perspective, not system perspective
- **Valuable:** Clear business value in the "so that" clause
- **Specific:** Concrete functionality, not vague requirements
- **Testable:** Acceptance criteria can be verified

### ✅ **Common Mistakes to Avoid:**
- ❌ **System-focused stories:** "As a system, I want to validate..."
- ❌ **Missing business value:** No clear "so that" explanation
- ❌ **Too large:** Stories that would take weeks to implement
- ❌ **Technical focus:** Implementation details instead of user needs

### ✅ **Acceptance Criteria Best Practices:**
- Use Given-When-Then format for clarity
- Cover both positive and negative scenarios
- Be specific about expected outcomes
- Make criteria testable and measurable

---

## Next Steps

Now that you've practiced converting requirements to user stories:

1. **Move to Exercise 02** to practice writing Gherkin scenarios
2. **Review your user stories** - do they pass the INVEST criteria?
   - **I**ndependent, **N**egotiable, **V**aluable, **E**stimable, **S**mall, **T**estable
3. **Think about stakeholders** - would business users understand your stories?

Remember: Good user stories are the foundation of effective BDD. They bridge the gap between business requirements and technical implementation.