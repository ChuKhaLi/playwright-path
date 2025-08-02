# Lesson 03 Assessment: Writing Feature Files with Gherkin

## 🎯 Assessment Overview 

This comprehensive assessment evaluates your mastery of feature file creation, Gherkin syntax, data-driven testing, complex business rule modeling, and living documentation principles. The assessment combines theoretical knowledge validation with practical application through hands-on feature file development.

## 📚 Learning Objectives Assessment

This assessment validates your ability to:
- ✅ Write syntactically correct and business-focused Gherkin feature files
- ✅ Apply proper scenario organization and tagging strategies  
- ✅ Create effective scenario outlines for data-driven testing
- ✅ Model complex business rules and conditional workflows
- ✅ Transform feature files into comprehensive living documentation
- ✅ Apply collaborative techniques for feature file development
- ✅ Design maintainable and scalable feature file architectures

## ⏱️ Time Allocation
- **Total Assessment Time**: 180 minutes
- **Part A**: Gherkin Fundamentals (30 minutes)
- **Part B**: Practical Feature File Creation (60 minutes)
- **Part C**: Advanced Pattern Application (45 minutes)
- **Part D**: Integration and Best Practices (45 minutes)

---

## 📝 Part A: Gherkin Fundamentals (30 minutes)

### Section A1: Syntax and Structure Knowledge (15 minutes)

#### Question 1: Gherkin Keyword Usage (5 points)
Match each Gherkin keyword with its correct purpose and usage context:

| Keyword | Purpose Options |
|---------|----------------|
| Feature | A) Preconditions that set up the scenario context |
| Background | B) High-level business capability being described |
| Scenario | C) Alternative pathway or additional verification |
| Given | D) Shared setup steps common to all scenarios |
| When | E) Specific business scenario being tested |
| Then | F) Action or event that triggers the behavior |
| And | G) Expected outcome or system response |
| But | H) Additional step in same category as previous step |

**Answer Key**: Feature-B, Background-D, Scenario-E, Given-A, When-F, Then-G, And-H, But-C

#### Question 2: Feature File Structure Analysis (10 points)
Analyze the following feature file and identify **5 structural or syntactic issues**:

```gherkin
feature: User Login System
  I want to log into the system
  So that I can access my account

  given the login page is loaded
  Scenario: successful login
    When I enter valid credentials
    then I should be redirected to dashboard
    and I should see welcome message

  Background:
    Given I am on the login page

  scenario outline: Invalid login attempts
    Given I enter email "<email>" and password "<password>"
    when I click login button
    Then I should see error "<error>"

    examples:
      | email | password | error |
      | invalid@test.com | wrong | Invalid credentials |
```

**Issues to Identify** (2 points each):
1. Feature keyword not capitalized
2. Missing "As a" user story format in feature description  
3. Background placed after scenario (should be before)
4. Inconsistent keyword capitalization (given vs Given, then vs Then)
5. Scenario Outline missing Examples data or incorrect structure

#### Question 3: BRIEF Principle Application (10 points)
Evaluate the following scenario against the BRIEF principle (Business, Real, Intention, Essential, Focused). Identify what's wrong and provide an improved version:

```gherkin
Scenario: User does something with the database
  Given the database connection is established
  And the user table has 1000 records
  And the authentication service is running on port 8080
  And the cache is cleared
  When the user clicks the login button
  And enters "john@example.com" in the email field
  And enters "password123" in the password field  
  And clicks submit
  And waits for 2 seconds for the API response
  Then the HTTP status code should be 200
  And the JWT token should be valid
  And the session should be created in Redis
  And the user should be redirected to /dashboard
  And the page title should contain "Dashboard"
```

**Improvement Areas** (2 points each):
- **Business Language**: Remove technical implementation details
- **Real Examples**: Use realistic business scenarios
- **Clear Intention**: Focus on business outcome
- **Essential Information**: Remove unnecessary technical steps
- **Focused Scope**: One clear business behavior per scenario

---

### Section A2: Business Rule Modeling (15 minutes)

#### Question 4: Business Rule Translation (10 points)
Convert the following business rule into proper Gherkin scenarios:

**Business Rule**: "ReadMore Books applies a 15% discount to orders over $75, but VIP customers get 20% off any order over $50. However, promotional codes cannot be combined with VIP discounts, and the maximum discount on any single order is 30%."

Write **2 scenarios** that capture this rule completely:

**Scenario 1**: _____________________________________
**Scenario 2**: _____________________________________

#### Question 5: Scenario Organization (5 points)
Given these scenario titles, organize them into logical groups and suggest appropriate tags:

- Customer updates profile successfully
- Customer receives welcome email after registration  
- System prevents duplicate email registration
- Customer resets password with valid email
- Invalid email format rejected during registration
- Customer logs out and session expires
- Password reset fails with invalid email
- Profile update fails with invalid phone format

**Organization Groups**:
1. Group 1: _________________ (Tag suggestions: _____________)
2. Group 2: _________________ (Tag suggestions: _____________)  
3. Group 3: _________________ (Tag suggestions: _____________)

---

## 💻 Part B: Practical Feature File Creation (60 minutes)

### Section B1: E-commerce Feature Development (35 minutes)

#### Practical Task 1: Shopping Cart Management
**Business Context**: ReadMore Books needs comprehensive shopping cart functionality that handles various customer interactions and business rules.

**Requirements**:
- Customers can add books to cart with quantity selection
- Cart shows running total including applicable taxes
- Customers can modify quantities or remove items
- Cart persists during session and for logged-in users
- System handles out-of-stock scenarios gracefully
- Volume discounts apply automatically (10% off orders >$50, 15% off orders >$100)

**Your Task**: Create a complete feature file with:
- Proper feature header with business value
- Background setup (if appropriate)
- At least 5 scenarios covering main workflows
- At least 2 error/edge case scenarios
- Appropriate tagging strategy
- Business-focused language throughout

**Evaluation Criteria** (35 points total):
- **Syntax Correctness** (5 points): Proper Gherkin structure and keywords
- **Business Focus** (10 points): Business language, clear value proposition
- **Scenario Coverage** (10 points): Comprehensive coverage of requirements
- **Error Handling** (5 points): Edge cases and error scenarios included
- **Organization** (5 points): Logical scenario organization, appropriate tags

---

### Section B2: Data-Driven Testing Implementation (25 minutes)

#### Practical Task 2: User Registration Validation
**Business Context**: Create scenario outlines for comprehensive user registration validation.

**Validation Requirements**:
- Email format validation (valid/invalid patterns)
- Password strength (length, complexity, common passwords)
- Required field validation (name, email, password, terms acceptance)
- Business rules (age verification, duplicate prevention)

**Your Task**: Create scenario outlines with:
- At least 15 examples total across multiple example groups
- Logical grouping of examples (valid cases, email errors, password errors, etc.)
- Meaningful parameter names and realistic data
- Clear expected outcomes for each example

**Evaluation Criteria** (25 points total):
- **Data Organization** (10 points): Logical example grouping and clear structure
- **Coverage Completeness** (8 points): All validation scenarios covered
- **Parameter Naming** (4 points): Business-focused, descriptive parameter names
- **Data Realism** (3 points): Realistic examples and expected outcomes

---

## 🔧 Part C: Advanced Pattern Application (45 minutes)

### Section C1: Complex Business Rules (25 minutes)

#### Practical Task 3: Multi-Layered Pricing Engine
**Business Context**: ReadMore Books implements dynamic pricing with multiple overlapping rules that must be prioritized correctly.

**Business Rules**:
1. **Base Pricing**: Standard catalog prices
2. **Customer Tier Discounts**: New (0%), Regular (5%), Loyal (10%), VIP (15%)
3. **Volume Discounts**: $50+ (5% additional), $100+ (10% additional), $200+ (15% additional)
4. **Promotional Codes**: Cannot stack with customer tier discounts
5. **Seasonal Adjustments**: Summer reading promotion (20% off fiction, June-August)
6. **Maximum Discount Rule**: No order can have more than 40% total discount

**Your Task**: Create scenarios that demonstrate how these rules interact and resolve conflicts:
- Model rule priority hierarchy
- Show conflict resolution (promotional codes vs tier discounts)
- Include edge cases for maximum discount limits
- Demonstrate seasonal promotion interactions

**Evaluation Criteria** (25 points total):
- **Rule Interaction Modeling** (10 points): Complex rule relationships captured
- **Conflict Resolution** (8 points): Rule conflicts handled clearly
- **Edge Case Coverage** (4 points): Boundary conditions and limits tested
- **Business Logic Clarity** (3 points): Clear business reasoning demonstrated

---

### Section C2: Workflow and Exception Handling (20 minutes)

#### Practical Task 4: Order Processing Exceptions
**Business Context**: Model order processing workflow with various exception scenarios and recovery mechanisms.

**Workflow Stages**:
- Order validation (inventory, payment method, customer eligibility)
- Payment processing (authorization, capture, fraud detection)
- Inventory allocation (reservation, multi-warehouse coordination)
- Fulfillment initiation (picking, packing, shipping label generation)

**Exception Scenarios**:
- Payment failures and retry mechanisms
- Inventory shortages and backorder handling
- Fraud detection triggers and manual review
- System failures and recovery procedures

**Your Task**: Create scenarios that cover:
- Normal workflow progression
- At least 3 different exception types
- Recovery and fallback mechanisms
- Customer communication throughout process

**Evaluation Criteria** (20 points total):
- **Workflow Modeling** (8 points): Complete workflow captured accurately
- **Exception Handling** (7 points): Various failure scenarios modeled
- **Recovery Mechanisms** (3 points): Fallback and retry logic included
- **Customer Experience** (2 points): Customer communication considered

---

## 📚 Part D: Integration and Best Practices (45 minutes)

### Section D1: Living Documentation Design (25 minutes)

#### Practical Task 5: Multi-Stakeholder Feature File
**Business Context**: Create a feature file that serves multiple stakeholders (business analysts, developers, testers, customer support, compliance teams) for a customer data management feature.

**Feature Requirements**:
- Customer can view and update personal information
- Email changes require verification
- Data export capability (GDPR compliance)
- Account deletion with data retention rules
- Audit logging for all changes

**Your Task**: Create a feature file that includes:
- Stakeholder-specific comments and context
- Business value statements for each scenario
- Technical implementation notes where appropriate
- Compliance and regulatory mapping
- Customer support troubleshooting information

**Evaluation Criteria** (25 points total):
- **Multi-Stakeholder Value** (8 points): Different stakeholder needs addressed
- **Business Context** (6 points): Clear business value and impact statements
- **Technical Guidance** (5 points): Appropriate technical context provided
- **Compliance Integration** (3 points): Regulatory requirements mapped
- **Maintainability** (3 points): Documentation structure supports long-term maintenance

---

### Section D2: Quality and Maintainability Analysis (20 minutes)

#### Analytical Task 6: Feature File Review and Optimization
**Context**: Review the provided feature file and identify improvement opportunities across multiple dimensions.

```gherkin
@login @security
Feature: Login System
  Users need to log in

  Scenario: User logs in
    Given user is on login page
    When user enters email and password
    Then user is logged in

  Scenario: User enters wrong password
    Given user is on login page  
    When user enters valid email and invalid password
    Then error message is shown

  Scenario Outline: Login validation
    Given user enters "<email>" and "<password>"
    When login is submitted
    Then result is "<result>"
    
    Examples:
      | email | password | result |
      | test@example.com | valid123 | success |
      | invalid | valid123 | error |
      | test@example.com | wrong | error |
```

**Your Analysis Task**:
1. **Identify 5 specific improvement opportunities** (10 points)
2. **Rewrite one scenario with improvements** (5 points)  
3. **Suggest enhanced tagging strategy** (3 points)
4. **Recommend maintainability improvements** (2 points)

---

## 🏆 Assessment Scoring

### Scoring Rubric

**Part A: Gherkin Fundamentals (30 points)**
- 26-30: Excellent understanding of Gherkin syntax and principles
- 21-25: Good grasp with minor gaps in knowledge
- 16-20: Adequate understanding, some concepts need reinforcement
- 11-15: Basic understanding, significant study needed
- 0-10: Insufficient knowledge, requires fundamental review

**Part B: Practical Feature Creation (60 points)**
- 54-60: Exceptional feature file creation skills
- 45-53: Proficient with well-structured, business-focused features
- 36-44: Competent with good structure and coverage
- 24-35: Basic competency, needs improvement in organization or coverage
- 0-23: Insufficient practical skills demonstrated

**Part C: Advanced Patterns (45 points)**
- 41-45: Mastery of complex business rule modeling and exception handling
- 34-40: Strong skills in advanced pattern application
- 27-33: Good understanding with some gaps in complex scenarios
- 18-26: Basic pattern recognition, needs more practice
- 0-17: Limited understanding of advanced concepts

**Part D: Integration and Best Practices (45 points)**
- 41-45: Excellent understanding of living documentation and maintainability
- 34-40: Good grasp of integration concepts and quality practices
- 27-33: Adequate understanding with room for improvement
- 18-26: Basic awareness, needs more development
- 0-17: Insufficient understanding of integration principles

### Overall Assessment Levels

**Total Score: 180 points**

- **150-180: Expert Level** (83-100%)
  - Ready for advanced BDD implementation
  - Can mentor others in feature file development
  - Demonstrates comprehensive understanding across all areas

- **120-149: Proficient Level** (67-82%)
  - Strong foundation with minor areas for improvement
  - Ready to implement BDD in most scenarios
  - Should focus on advanced pattern refinement

- **90-119: Developing Level** (50-66%)
  - Good basic understanding with significant gaps
  - Needs additional practice before complex implementations
  - Should review challenging concepts and practice more

- **60-89: Novice Level** (33-49%)
  - Basic concepts understood but needs substantial development
  - Requires additional study and guided practice
  - Should complete supplementary exercises before proceeding

- **0-59: Needs Foundation Work** (0-32%)
  - Insufficient understanding for progression
  - Requires comprehensive review of all lesson materials
  - Should seek additional support and practice extensively

---

## 📋 Self-Assessment Checklist

Before submitting your assessment, verify:

### Technical Excellence
- [ ] All Gherkin syntax is correct and follows conventions
- [ ] Feature files are properly structured with appropriate headers
- [ ] Scenarios use business language and avoid technical implementation details
- [ ] Tags are meaningful and support test organization
- [ ] Data tables and scenario outlines are well-organized

### Business Alignment  
- [ ] Feature files clearly articulate business value
- [ ] Scenarios reflect realistic business workflows
- [ ] Edge cases and error scenarios are business-relevant
- [ ] User stories follow proper format and focus on outcomes
- [ ] Business rules are captured accurately and completely

### Quality and Maintainability
- [ ] Scenarios are independent and can be executed in any order
- [ ] Feature files are organized logically and easy to navigate
- [ ] Comments and documentation enhance understanding
- [ ] Examples use realistic data and meaningful parameter names
- [ ] Coverage is comprehensive without unnecessary duplication

### Advanced Concepts
- [ ] Complex business rules are modeled clearly
- [ ] Data-driven scenarios demonstrate proper pattern usage
- [ ] Living documentation principles are applied effectively
- [ ] Integration with broader documentation ecosystem is considered
- [ ] Maintenance and evolution planning is evident

---

## 🔗 Post-Assessment Actions

### Immediate Next Steps
1. **Review Results**: Analyze performance across all assessment areas
2. **Identify Gaps**: Focus on areas scoring below proficient level
3. **Create Action Plan**: Prioritize improvement areas based on impact
4. **Practice Planning**: Design targeted practice for weak areas
5. **Resource Planning**: Identify additional learning resources needed

### Remediation Resources (for scores below proficient)

**Gherkin Fundamentals Support**:
- Review lesson content section on syntax and structure
- Complete additional practice exercises from examples directory
- Study BRIEF principle application in provided examples
- Practice with Gherkin syntax validator tools

**Practical Skills Development**:
- Work through additional feature file creation exercises
- Practice with different business domains and scenarios
- Seek feedback from peers or mentors on feature file quality
- Study high-quality feature file examples from open source projects

**Advanced Pattern Mastery**:
- Review complex business rule examples in detail
- Practice modeling multi-layered decision logic
- Study exception handling patterns in enterprise scenarios
- Work with scenario outlines for various data-driven scenarios

**Integration and Best Practices**:
- Study living documentation principles and examples
- Practice collaborative feature development techniques
- Review documentation integration patterns
- Understand maintenance and evolution strategies

### Progression Readiness

**Ready for Lesson 04** (Score 120+):
- Strong foundation in feature file creation
- Good understanding of business rule modeling
- Adequate grasp of advanced patterns
- Ready to learn step definition implementation

**Needs Additional Practice** (Score 90-119):
- Complete supplementary exercises before proceeding
- Focus on weak areas identified in assessment
- Consider additional mentoring or peer review
- May proceed with extra support and attention

**Requires Lesson Review** (Score <90):
- Comprehensive review of all lesson 03 materials required
- Complete all exercises with careful attention to feedback
- Seek additional support from instructors or peers
- Do not proceed until achieving proficient understanding

---

## 📚 Assessment Summary

This comprehensive assessment validates your mastery of feature file creation and Gherkin best practices across multiple dimensions:

✅ **Syntax and Structure**: Proper Gherkin usage and organization
✅ **Business Focus**: Stakeholder-readable, value-driven scenarios  
✅ **Data-Driven Testing**: Effective scenario outline implementation
✅ **Complex Rule Modeling**: Multi-layered decision logic and workflows
✅ **Living Documentation**: Multi-stakeholder documentation integration
✅ **Quality and Maintainability**: Long-term sustainability practices

Your performance on this assessment indicates readiness for implementing step definitions and advancing to more technical BDD implementation aspects in subsequent lessons.

**Remember**: Feature files are the foundation of effective BDD implementation. Mastery at this level ensures success in all subsequent BDD practices and enables you to serve as a bridge between business stakeholders and technical implementation teams.