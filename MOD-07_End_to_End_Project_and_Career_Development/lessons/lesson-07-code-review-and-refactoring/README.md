# Lesson 7.7: Code Review and Refactoring

## Learning Objectives

By the end of this lesson, you will be able to:

- **Conduct effective code reviews** using industry-standard practices and tools
- **Implement systematic refactoring** techniques to improve code quality and maintainability
- **Apply SOLID principles** to test automation architecture
- **Identify and eliminate code smells** in test automation projects
- **Establish quality gates** and coding standards for team collaboration
- **Use automated tools** for code quality analysis and improvement
- **Document refactoring decisions** and maintain code evolution history
- **Balance technical debt** with feature delivery in professional environments

## Prerequisites

- Completed Lesson 7.6 (Integrating CI/CD and Reporting)
- Understanding of TypeScript advanced features and design patterns
- Experience with version control and branching strategies
- Familiarity with collaborative development workflows

## Estimated Duration

**4-5 hours** (including code review exercises and refactoring implementation)

---

## Introduction

Code review and refactoring are critical skills for professional QA engineers. They ensure code quality, knowledge sharing, and long-term maintainability of test automation frameworks. In this lesson, you'll learn systematic approaches to reviewing code, identifying improvement opportunities, and implementing refactoring strategies that enhance your project's architecture and reliability.

These skills are essential for senior-level positions and demonstrate your ability to contribute to code quality beyond just writing tests.

---

## Section 1: Code Review Fundamentals

### Understanding Code Review Benefits

Code reviews provide:
- **Quality Assurance**: Catch bugs and issues before they reach production
- **Knowledge Sharing**: Spread expertise across the team
- **Standards Enforcement**: Maintain consistent coding practices
- **Mentorship**: Develop junior team members
- **Risk Mitigation**: Reduce single points of failure

### 1.1 Setting Up Code Review Processes

#### GitHub Pull Request Template

Create a comprehensive PR template:

```markdown
<!-- .github/pull_request_template.md -->
## Description
Brief description of changes and their purpose.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Refactoring (non-breaking change that improves code quality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] Cross-browser testing performed (if applicable)

## Code Quality Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of the code completed
- [ ] Code is properly commented
- [ ] No debugging statements left in code
- [ ] Error handling implemented appropriately
- [ ] Performance considerations addressed

## Test Coverage
- [ ] Unit test coverage maintained/improved
- [ ] E2E test coverage maintained/improved
- [ ] Edge cases tested
- [ ] Error scenarios tested

## Documentation
- [ ] README updated (if applicable)
- [ ] API documentation updated (if applicable)
- [ ] Comments added for complex logic
- [ ] Commit messages are clear and descriptive

## Screenshots/Videos
(If applicable, add screenshots or videos to demonstrate changes)

## Additional Notes
Any additional information reviewers should know.
```

#### Review Workflow Configuration

```yaml
# .github/workflows/code-review.yml
name: Code Review Automation

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  automated-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint -- --format=json --output-file=lint-results.json
        continue-on-error: true
      
      - name: Run type checking
        run: npm run typecheck -- --noEmit --pretty false > typecheck-results.txt 2>&1
        continue-on-error: true
      
      - name: Run tests with coverage
        run: npm run test:coverage -- --json --outputFile=test-results.json
        continue-on-error: true
      
      - name: Analyze code complexity
        run: npx plato -r -d complexity-report src/
        continue-on-error: true
      
      - name: Security audit
        run: npm audit --audit-level=moderate --json > security-audit.json
        continue-on-error: true
      
      - name: Comment PR with results
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            
            // Read analysis results
            const lintResults = JSON.parse(fs.readFileSync('lint-results.json', 'utf8'));
            const testResults = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
            
            // Generate comment
            const comment = `
            ## Automated Code Review Results
            
            ### Linting Issues: ${lintResults.length}
            ${lintResults.slice(0, 5).map(issue => 
              `- **${issue.severity}**: ${issue.message} (${issue.ruleId})`
            ).join('\n')}
            
            ### Test Coverage: ${testResults.coverageMap?.total?.statements?.pct || 'N/A'}%
            
            ### Security Issues: Check security audit results
            
            ---
            *This is an automated review. Please address critical issues before requesting human review.*
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });

  require-approval:
    runs-on: ubuntu-latest
    if: github.event.pull_request.base.ref == 'main'
    steps:
      - name: Require senior developer approval
        uses: actions/github-script@v7
        with:
          script: |
            const { data: reviews } = await github.rest.pulls.listReviews({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number
            });
            
            const approvals = reviews.filter(review => review.state === 'APPROVED');
            const seniorApprovals = approvals.filter(review => 
              ['senior-dev', 'tech-lead', 'qa-lead'].includes(review.user.login)
            );
            
            if (seniorApprovals.length === 0) {
              core.setFailed('Pull request requires approval from a senior team member');
            }
```

### 1.2 Code Review Guidelines and Standards

#### Comprehensive Review Checklist

```typescript
// src/utils/ReviewGuidelines.ts
export interface CodeReviewCriteria {
  readability: {
    naming: boolean;
    structure: boolean;
    comments: boolean;
  };
  functionality: {
    correctness: boolean;
    performance: boolean;
    security: boolean;
  };
  maintainability: {
    modularity: boolean;
    testability: boolean;
    documentation: boolean;
  };
  standards: {
    styleGuide: boolean;
    bestPractices: boolean;
    patterns: boolean;
  };
}

export class CodeReviewHelper {
  static generateReviewGuide(): string {
    return `
# Code Review Guidelines

## 🔍 What to Look For

### Readability & Style
- [ ] Variable and function names are descriptive and follow conventions
- [ ] Code structure is logical and easy to follow
- [ ] Complex logic is well-commented
- [ ] Consistent indentation and formatting
- [ ] No unused imports or variables

### Functionality & Logic
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled appropriately
- [ ] Error handling is comprehensive
- [ ] No obvious bugs or logical errors
- [ ] Performance considerations are addressed

### Test Quality
- [ ] Tests cover the main paths and edge cases
- [ ] Test names clearly describe what they're testing
- [ ] Tests are independent and repeatable
- [ ] Appropriate assertions are used
- [ ] Test data is well-organized

### Architecture & Design
- [ ] Code follows SOLID principles
- [ ] Appropriate design patterns are used
- [ ] Dependencies are minimized
- [ ] Code is modular and reusable
- [ ] Separation of concerns is maintained

### Security & Best Practices
- [ ] No hardcoded secrets or credentials
- [ ] Input validation is present
- [ ] Security best practices are followed
- [ ] TypeScript types are used effectively
- [ ] Async/await is used properly

## 💬 How to Give Feedback

### Positive Feedback
- Highlight good practices and clever solutions
- Acknowledge improvements and learning
- Encourage continued growth

### Constructive Criticism
- Be specific about issues and suggest alternatives
- Explain the "why" behind recommendations
- Focus on the code, not the person
- Ask questions to understand the author's reasoning

### Example Comments
✅ Good: "Consider extracting this logic into a separate function for better testability and reusability."
❌ Poor: "This is wrong."

✅ Good: "I like how you handled the error case here. The user-friendly message will improve the experience."
❌ Poor: "Looks good."
`;
  }

  static analyzeCodeComplexity(filePath: string): {
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    linesOfCode: number;
    suggestions: string[];
  } {
    // Implementation would use actual complexity analysis tools
    return {
      cyclomaticComplexity: 0,
      cognitiveComplexity: 0,
      linesOfCode: 0,
      suggestions: []
    };
  }
}
```

---

## Section 2: Systematic Refactoring Techniques

### 2.1 Identifying Code Smells in Test Automation

Common test automation code smells and their solutions:

```typescript
// BEFORE: Code Smells Example
// ❌ Poor: Large test class with multiple responsibilities
export class ECommerceTests {
  async testLogin() {
    await this.page.goto('https://example.com/login');
    await this.page.fill('#email', 'test@example.com');
    await this.page.fill('#password', 'password123');
    await this.page.click('#login-button');
    await this.page.waitForSelector('#dashboard');
    // ... 50 more lines of test logic
  }

  async testProductSearch() {
    await this.page.goto('https://example.com');
    await this.page.fill('#search', 'laptop');
    await this.page.click('#search-button');
    await this.page.waitForSelector('.product-item');
    // ... more test logic mixed with page interactions
  }

  async testCheckout() {
    // ... hundreds of lines of mixed concerns
  }
}

// AFTER: Refactored with proper separation of concerns
// ✅ Good: Focused test class with clear responsibilities
export class AuthenticationTests {
  private loginPage: LoginPage;
  private dashboardPage: DashboardPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
  }

  @test('should login with valid credentials')
  async shouldLoginSuccessfully() {
    // Arrange
    const credentials = TestDataFactory.createValidCredentials();
    
    // Act
    await this.loginPage.navigate();
    await this.loginPage.login(credentials);
    
    // Assert
    await expect(this.dashboardPage.welcomeMessage).toBeVisible();
    await expect(this.dashboardPage.userProfile).toContainText(credentials.email);
  }
}

export class ProductSearchTests {
  private homePage: HomePage;
  private searchResultsPage: SearchResultsPage;

  constructor(page: Page) {
    this.homePage = new HomePage(page);
    this.searchResultsPage = new SearchResultsPage(page);
  }

  @test('should find products matching search criteria')
  async shouldFindRelevantProducts() {
    const searchTerm = 'laptop';
    
    await this.homePage.navigate();
    await this.homePage.searchForProduct(searchTerm);
    
    await expect(this.searchResultsPage.productResults).toHaveCountGreaterThan(0);
    await this.searchResultsPage.verifyProductsContainTerm(searchTerm);
  }
}
```

### 2.2 Applying SOLID Principles to Test Architecture

#### Single Responsibility Principle (SRP)

```typescript
// BEFORE: Page object with mixed responsibilities
// ❌ Poor: LoginPage handling both UI interactions and data validation
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
    
    // ❌ SRP violation: validation logic in page object
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (password.length < 8) {
      throw new Error('Password too short');
    }
  }
}

// AFTER: Separated responsibilities
// ✅ Good: LoginPage focused only on UI interactions
export class LoginPage {
  constructor(private page: Page) {}

  async enterCredentials(credentials: UserCredentials): Promise<void> {
    await this.page.fill('#email', credentials.email);
    await this.page.fill('#password', credentials.password);
  }

  async submitLogin(): Promise<void> {
    await this.page.click('#login-button');
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.enterCredentials(credentials);
    await this.submitLogin();
  }
}

// ✅ Good: Separate validator class
export class CredentialsValidator {
  static validate(credentials: UserCredentials): ValidationResult {
    const errors: string[] = [];
    
    if (!credentials.email.includes('@')) {
      errors.push('Invalid email format');
    }
    
    if (credentials.password.length < 8) {
      errors.push('Password too short');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

#### Open/Closed Principle (OCP)

```typescript
// BEFORE: Hard to extend notification system
// ❌ Poor: TestReporter class that needs modification for new notification types
export class TestReporter {
  async sendNotification(type: string, message: string): Promise<void> {
    if (type === 'slack') {
      // Slack implementation
      await this.sendSlackMessage(message);
    } else if (type === 'email') {
      // Email implementation
      await this.sendEmail(message);
    } else if (type === 'teams') {
      // Teams implementation - requires modifying existing code
      await this.sendTeamsMessage(message);
    }
  }
}

// AFTER: Open for extension, closed for modification
// ✅ Good: Strategy pattern implementation
export interface NotificationStrategy {
  send(message: string): Promise<void>;
}

export class SlackNotificationStrategy implements NotificationStrategy {
  async send(message: string): Promise<void> {
    // Slack-specific implementation
  }
}

export class EmailNotificationStrategy implements NotificationStrategy {
  async send(message: string): Promise<void> {
    // Email-specific implementation
  }
}

export class TeamsNotificationStrategy implements NotificationStrategy {
  async send(message: string): Promise<void> {
    // Teams-specific implementation (no modification of existing code needed)
  }
}

export class TestReporter {
  private notificationStrategies: NotificationStrategy[] = [];

  addNotificationStrategy(strategy: NotificationStrategy): void {
    this.notificationStrategies.push(strategy);
  }

  async sendNotifications(message: string): Promise<void> {
    await Promise.all(
      this.notificationStrategies.map(strategy => strategy.send(message))
    );
  }
}
```

### 2.3 Advanced Refactoring Patterns

#### Extract Method Pattern

```typescript
// BEFORE: Long method with multiple responsibilities
// ❌ Poor: Complex test method doing too much
async testCompleteUserJourney() {
  // Login
  await this.page.goto('https://example.com/login');
  await this.page.fill('#email', 'test@example.com');
  await this.page.fill('#password', 'password123');
  await this.page.click('#login-button');
  await this.page.waitForSelector('#dashboard');
  
  // Navigate to products
  await this.page.click('#products-link');
  await this.page.waitForSelector('.product-grid');
  
  // Search for product
  await this.page.fill('#search', 'laptop');
  await this.page.click('#search-button');
  await this.page.waitForSelector('.search-results');
  
  // Add to cart
  await this.page.click('.product-item:first-child .add-to-cart');
  await this.page.waitForSelector('.cart-notification');
  
  // Checkout
  await this.page.click('#cart-icon');
  await this.page.click('#checkout-button');
  await this.page.fill('#billing-address', '123 Test St');
  await this.page.fill('#billing-city', 'Test City');
  await this.page.fill('#payment-card', '4111111111111111');
  await this.page.click('#submit-order');
  await this.page.waitForSelector('#order-confirmation');
}

// AFTER: Extracted methods with clear responsibilities
// ✅ Good: Broken down into focused methods
async testCompleteUserJourney() {
  await this.performLogin();
  await this.navigateToProducts();
  await this.searchForProduct('laptop');
  await this.addFirstProductToCart();
  await this.completeCheckout();
  await this.verifyOrderConfirmation();
}

private async performLogin(): Promise<void> {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await loginPage.login({
    email: 'test@example.com',
    password: 'password123'
  });
}

private async navigateToProducts(): Promise<void> {
  const navigation = new NavigationComponent(this.page);
  await navigation.goToProducts();
}

private async searchForProduct(searchTerm: string): Promise<void> {
  const searchComponent = new SearchComponent(this.page);
  await searchComponent.search(searchTerm);
}

private async addFirstProductToCart(): Promise<void> {
  const productGrid = new ProductGridComponent(this.page);
  await productGrid.addFirstProductToCart();
}

private async completeCheckout(): Promise<void> {
  const checkoutFlow = new CheckoutFlow(this.page);
  await checkoutFlow.proceedToCheckout();
  await checkoutFlow.fillBillingInformation({
    address: '123 Test St',
    city: 'Test City'
  });
  await checkoutFlow.addPaymentMethod({
    cardNumber: '4111111111111111'
  });
  await checkoutFlow.submitOrder();
}

private async verifyOrderConfirmation(): Promise<void> {
  const orderConfirmation = new OrderConfirmationPage(this.page);
  await expect(orderConfirmation.confirmationMessage).toBeVisible();
}
```

#### Replace Magic Numbers with Named Constants

```typescript
// BEFORE: Magic numbers and strings scattered throughout code
// ❌ Poor: Hard-coded values
export class TestHelpers {
  async waitForPageLoad() {
    await this.page.waitForTimeout(5000); // What does 5000 represent?
  }

  async retryAction() {
    for (let i = 0; i < 3; i++) { // Why 3 retries?
      try {
        await this.performAction();
        break;
      } catch (error) {
        if (i === 2) throw error; // Magic number again
        await this.page.waitForTimeout(1000); // Another magic number
      }
    }
  }
}

// AFTER: Named constants with clear meaning
// ✅ Good: Descriptive constants
export class TestConstants {
  static readonly TIMEOUTS = {
    PAGE_LOAD: 5000,
    ELEMENT_WAIT: 3000,
    RETRY_DELAY: 1000,
    ANIMATION: 500
  } as const;

  static readonly RETRY_ATTEMPTS = {
    DEFAULT: 3,
    NETWORK_OPERATIONS: 5,
    CRITICAL_ACTIONS: 2
  } as const;

  static readonly SELECTORS = {
    LOADING_SPINNER: '[data-testid="loading-spinner"]',
    ERROR_MESSAGE: '[data-testid="error-message"]',
    SUCCESS_BANNER: '[data-testid="success-banner"]'
  } as const;
}

export class TestHelpers {
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForTimeout(TestConstants.TIMEOUTS.PAGE_LOAD);
  }

  async retryAction(
    action: () => Promise<void>,
    maxAttempts: number = TestConstants.RETRY_ATTEMPTS.DEFAULT
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await action();
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(`Action failed after ${maxAttempts} attempts: ${error}`);
        }
        await this.page.waitForTimeout(TestConstants.TIMEOUTS.RETRY_DELAY);
      }
    }
  }
}
```

---

## Section 3: Automated Code Quality Tools

### 3.1 ESLint Configuration for Test Code

```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:playwright/playwright-test"
  ],
  "plugins": [
    "@typescript-eslint",
    "playwright"
  ],
  "rules": {
    // Code quality rules
    "complexity": ["error", { "max": 10 }],
    "max-lines-per-function": ["error", { "max": 50 }],
    "max-depth": ["error", { "max": 4 }],
    "max-params": ["error", { "max": 5 }],
    
    // TypeScript specific
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/no-unused-vars": "error",
    
    // Test specific rules
    "playwright/missing-playwright-await": "error",
    "playwright/no-conditional-in-test": "error",
    "playwright/prefer-web-first-assertions": "error",
    "playwright/no-useless-await": "error",
    "playwright/valid-expect": "error",
    
    // Custom rules for test organization
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error"
  },
  "overrides": [
    {
      "files": ["*.test.ts", "*.spec.ts"],
      "rules": {
        "max-lines-per-function": ["error", { "max": 100 }]
      }
    }
  ]
}
```

### 3.2 SonarQube Integration

```typescript
// src/utils/CodeQualityAnalyzer.ts
export interface QualityMetrics {
  codeSmells: number;
  technicalDebt: string;
  coverage: number;
  duplicatedLines: number;
  maintainabilityRating: 'A' | 'B' | 'C' | 'D' | 'E';
  reliabilityRating: 'A' | 'B' | 'C' | 'D' | 'E';
  securityRating: 'A' | 'B' | 'C' | 'D' | 'E';
}

export class CodeQualityAnalyzer {
  async analyzeProject(): Promise<QualityMetrics> {
    // Integration with SonarQube API
    const sonarUrl = process.env.SONAR_URL;
    const projectKey = process.env.SONAR_PROJECT_KEY;
    const token = process.env.SONAR_TOKEN;

    const response = await fetch(
      `${sonarUrl}/api/measures/component?component=${projectKey}&metricKeys=code_smells,sqale_index,coverage,duplicated_lines_density,sqale_rating,reliability_rating,security_rating`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    return this.parseMetrics(data);
  }

  private parseMetrics(sonarData: any): QualityMetrics {
    const measures = sonarData.component.measures;
    const getMetricValue = (key: string) => 
      measures.find((m: any) => m.metric === key)?.value || '0';

    return {
      codeSmells: parseInt(getMetricValue('code_smells')),
      technicalDebt: getMetricValue('sqale_index'),
      coverage: parseFloat(getMetricValue('coverage')),
      duplicatedLines: parseFloat(getMetricValue('duplicated_lines_density')),
      maintainabilityRating: getMetricValue('sqale_rating') as any,
      reliabilityRating: getMetricValue('reliability_rating') as any,
      securityRating: getMetricValue('security_rating') as any
    };
  }

  generateQualityReport(metrics: QualityMetrics): string {
    return `
# Code Quality Report

## Overview
- **Code Smells**: ${metrics.codeSmells}
- **Technical Debt**: ${metrics.technicalDebt}
- **Test Coverage**: ${metrics.coverage}%
- **Code Duplication**: ${metrics.duplicatedLines}%

## Ratings
- **Maintainability**: ${metrics.maintainabilityRating}
- **Reliability**: ${metrics.reliabilityRating}
- **Security**: ${metrics.securityRating}

## Recommendations
${this.generateRecommendations(metrics)}
`;
  }

  private generateRecommendations(metrics: QualityMetrics): string {
    const recommendations: string[] = [];

    if (metrics.codeSmells > 10) {
      recommendations.push('- Consider refactoring to reduce code smells');
    }

    if (metrics.coverage < 80) {
      recommendations.push('- Increase test coverage to at least 80%');
    }

    if (metrics.duplicatedLines > 5) {
      recommendations.push('- Extract common code to reduce duplication');
    }

    if (metrics.maintainabilityRating > 'B') {
      recommendations.push('- Focus on improving code maintainability');
    }

    return recommendations.join('\n') || '- Code quality metrics look good!';
  }
}
```

---

## Section 4: Refactoring Workshop

### 4.1 Practical Refactoring Exercise

Let's refactor a real test automation project step by step:

```typescript
// BEFORE: Legacy test file with multiple issues
// ❌ Problems: Long methods, code duplication, poor naming, mixed concerns
export class LegacyECommerceTest {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async test1() {
    await this.page.goto('http://localhost:3000');
    await this.page.click('#login-link');
    await this.page.fill('#email', 'john@example.com');
    await this.page.fill('#password', 'password123');
    await this.page.click('#login-btn');
    await this.page.waitForTimeout(2000);
    let text = await this.page.textContent('#welcome');
    if (text?.includes('Welcome')) {
      console.log('Login successful');
    }
    
    await this.page.click('#products');
    await this.page.waitForTimeout(1000);
    await this.page.fill('#search-box', 'laptop');
    await this.page.click('#search-btn');
    await this.page.waitForTimeout(3000);
    
    let products = await this.page.$$('.product-card');
    if (products.length > 0) {
      await products[0].click();
      await this.page.waitForTimeout(2000);
      await this.page.click('#add-to-cart');
      await this.page.waitForTimeout(1000);
      
      let cartCount = await this.page.textContent('#cart-count');
      if (cartCount === '1') {
        console.log('Product added to cart');
      }
    }
  }

  async test2() {
    // Similar login code duplicated
    await this.page.goto('http://localhost:3000');
    await this.page.click('#login-link');
    await this.page.fill('#email', 'jane@example.com');
    await this.page.fill('#password', 'password456');
    await this.page.click('#login-btn');
    await this.page.waitForTimeout(2000);
    
    // Different test logic but same patterns
    await this.page.click('#cart-icon');
    // ... more duplicated patterns
  }
}

// AFTER: Refactored with proper structure and practices
// ✅ Good: Clean architecture, reusable components, proper naming

// Step 1: Extract Page Objects
export class LoginPage {
  constructor(private page: Page, private config: TestConfig) {}

  async navigate(): Promise<void> {
    await this.page.goto(this.config.baseUrl);
    await this.page.click(PageSelectors.LOGIN_LINK);
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.page.fill(PageSelectors.EMAIL_INPUT, credentials.email);
    await this.page.fill(PageSelectors.PASSWORD_INPUT, credentials.password);
    await this.page.click(PageSelectors.LOGIN_BUTTON);
    await this.page.waitForSelector(PageSelectors.WELCOME_MESSAGE);
  }

  async getWelcomeMessage(): Promise<string> {
    return await this.page.textContent(PageSelectors.WELCOME_MESSAGE) || '';
  }
}

export class ProductSearchPage {
  constructor(private page: Page) {}

  async navigateToProducts(): Promise<void> {
    await this.page.click(PageSelectors.PRODUCTS_LINK);
    await this.page.waitForSelector(PageSelectors.PRODUCT_GRID);
  }

  async searchForProduct(searchTerm: string): Promise<void> {
    await this.page.fill(PageSelectors.SEARCH_INPUT, searchTerm);
    await this.page.click(PageSelectors.SEARCH_BUTTON);
    await this.page.waitForSelector(PageSelectors.SEARCH_RESULTS);
  }

  async getProductCount(): Promise<number> {
    return await this.page.locator(PageSelectors.PRODUCT_CARD).count();
  }

  async selectFirstProduct(): Promise<void> {
    await this.page.locator(PageSelectors.PRODUCT_CARD).first().click();
    await this.page.waitForSelector(PageSelectors.PRODUCT_DETAILS);
  }
}

export class ShoppingCartPage {
  constructor(private page: Page) {}

  async addToCart(): Promise<void> {
    await this.page.click(PageSelectors.ADD_TO_CART_BUTTON);
    await this.page.waitForSelector(PageSelectors.CART_NOTIFICATION);
  }

  async getCartItemCount(): Promise<number> {
    const countText = await this.page.textContent(PageSelectors.CART_COUNT);
    return parseInt(countText || '0');
  }

  async openCart(): Promise<void> {
    await this.page.click(PageSelectors.CART_ICON);
    await this.page.waitForSelector(PageSelectors.CART_CONTENT);
  }
}

// Step 2: Create Test Data Factory
export class TestDataFactory {
  static createLoginCredentials(type: 'valid' | 'invalid' = 'valid'): UserCredentials {
    const credentials = {
      valid: {
        email: 'john@example.com',
        password: 'password123'
      },
      invalid: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }
    };

    return credentials[type];
  }

  static createProductSearchTerm(): string {
    const searchTerms = ['laptop', 'phone', 'tablet', 'headphones'];
    return searchTerms[Math.floor(Math.random() * searchTerms.length)];
  }
}

// Step 3: Create Constants File
export class PageSelectors {
  static readonly LOGIN_LINK = '#login-link';
  static readonly EMAIL_INPUT = '#email';
  static readonly PASSWORD_INPUT = '#password';
  static readonly LOGIN_BUTTON = '#login-btn';
  static readonly WELCOME_MESSAGE = '#welcome';
  static readonly PRODUCTS_LINK = '#products';
  static readonly PRODUCT_GRID = '.product-grid';
  static readonly SEARCH_INPUT = '#search-box';
  static readonly SEARCH_BUTTON = '#search-btn';
  static readonly SEARCH_RESULTS = '.search-results';
  static readonly PRODUCT_CARD = '.product-card';
  static readonly PRODUCT_DETAILS = '.product-details';
  static readonly ADD_TO_CART_BUTTON = '#add-to-cart';
  static readonly CART_NOTIFICATION = '.cart-notification';
  static readonly CART_COUNT = '#cart-count';
  static readonly CART_ICON = '#cart-icon';
  static readonly CART_CONTENT = '.cart-content';
}

// Step 4: Refactored Test Class
export class ECommerceWorkflowTests {
  private loginPage: LoginPage;
  private productSearchPage: ProductSearchPage;
  private shoppingCartPage: ShoppingCartPage;
  private config: TestConfig;

  constructor(page: Page, config: TestConfig) {
    this.loginPage = new LoginPage(page, config);
    this.productSearchPage = new ProductSearchPage(page);
    this.shoppingCartPage = new ShoppingCartPage(page);
    this.config = config;
  }

  @test('should allow user to login and add product to cart')
  async shouldCompleteLoginAndAddToCart(): Promise<void> {
    // Arrange
    const credentials = TestDataFactory.createLoginCredentials('valid');
    const searchTerm = TestDataFactory.createProductSearchTerm();

    // Act & Assert - Login
    await this.performLogin(credentials);
    await this.verifyLoginSuccess();

    // Act & Assert - Product Search and Add to Cart
    await this.searchAndAddProductToCart(searchTerm);
    await this.verifyProductAddedToCart();
  }

  @test('should handle different user login scenarios')
  async shouldHandleDifferentLoginScenarios(): Promise<void> {
    const credentials = TestDataFactory.createLoginCredentials('valid');
    credentials.email = 'jane@example.com';
    credentials.password = 'password456';

    await this.performLogin(credentials);
    await this.verifyLoginSuccess();
    
    await this.shoppingCartPage.openCart();
    // Additional cart-specific tests
  }

  // Private helper methods for better organization
  private async performLogin(credentials: UserCredentials): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.login(credentials);
  }

  private async verifyLoginSuccess(): Promise<void> {
    const welcomeMessage = await this.loginPage.getWelcomeMessage();
    expect(welcomeMessage).toContain('Welcome');
  }

  private async searchAndAddProductToCart(searchTerm: string): Promise<void> {
    await this.productSearchPage.navigateToProducts();
    await this.productSearchPage.searchForProduct(searchTerm);

    const productCount = await this.productSearchPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    await this.productSearchPage.selectFirstProduct();
    await this.shoppingCartPage.addToCart();
  }

  private async verifyProductAddedToCart(): Promise<void> {
    const cartItemCount = await this.shoppingCartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
  }
}
```

### 4.2 Refactoring Checklist and Validation

```typescript
// src/utils/RefactoringValidator.ts
export class RefactoringValidator {
  static validateRefactoring(beforeMetrics: CodeMetrics, afterMetrics: CodeMetrics): RefactoringReport {
    const improvements: string[] = [];
    const regressions: string[] = [];

    // Check complexity reduction
    if (afterMetrics.cyclomaticComplexity < beforeMetrics.cyclomaticComplexity) {
      improvements.push(`Reduced cyclomatic complexity from ${beforeMetrics.cyclomaticComplexity} to ${afterMetrics.cyclomaticComplexity}`);
    } else if (afterMetrics.cyclomaticComplexity > beforeMetrics.cyclomaticComplexity) {
      regressions.push(`Increased cyclomatic complexity from ${beforeMetrics.cyclomaticComplexity} to ${afterMetrics.cyclomaticComplexity}`);
    }

    // Check code duplication
    if (afterMetrics.duplicationPercentage < beforeMetrics.duplicationPercentage) {
      improvements.push(`Reduced code duplication from ${beforeMetrics.duplicationPercentage}% to ${afterMetrics.duplicationPercentage}%`);
    }

    // Check maintainability
    if (afterMetrics.maintainabilityIndex > beforeMetrics.maintainabilityIndex) {
      improvements.push(`Improved maintainability index from ${beforeMetrics.maintainabilityIndex} to ${afterMetrics.maintainabilityIndex}`);
    }

    return {
      overall: regressions.length === 0 ? 'SUCCESS' : 'NEEDS_REVIEW',
      improvements,
      regressions,
      recommendation: this.generateRecommendation(improvements, regressions)
    };
  }

  private static generateRecommendation(improvements: string[], regressions: string[]): string {
    if (regressions.length === 0 && improvements.length > 0) {
      return 'Refactoring successful! Code quality has improved.';
    } else if (regressions.length > 0) {
      return 'Refactoring needs review. Some metrics have regressed.';
    } else {
      return 'Neutral refactoring. No significant changes in metrics.';
    }
  }
}

interface CodeMetrics {
  cyclomaticComplexity: number;
  duplicationPercentage: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  testCoverage: number;
}

interface RefactoringReport {
  overall: 'SUCCESS' | 'NEEDS_REVIEW' | 'NEUTRAL';
  improvements: string[];
  regressions: string[];
  recommendation: string;
}
```

---

## Section 5: Documentation and Knowledge Sharing

### 5.1 Refactoring Documentation Standards

```markdown
<!-- REFACTORING_LOG.md -->
# Refactoring Log

## [2024-01-15] Login Flow Refactoring

### Problem
The login functionality was scattered across multiple test files with duplicated code and inconsistent patterns.

### Solution
- Extracted `LoginPage` class with consistent interface
- Created `UserCredentials` interface for type safety
- Implemented `TestDataFactory` for credential generation
- Standardized error handling and assertions

### Impact
- **Code Duplication**: Reduced from 45% to 12%
- **Cyclomatic Complexity**: Reduced from 15 to 6
- **Test Maintainability**: Improved by 40%
- **Development Time**: 25% faster for login-related features

### Files Changed
- `src/pages/LoginPage.ts` (created)
- `src/types/UserCredentials.ts` (created)
- `src/factories/TestDataFactory.ts` (modified)
- `tests/auth/*.spec.ts` (refactored)

### Migration Guide
```typescript
// Before
await page.fill('#email', 'test@example.com');
await page.fill('#password', 'password');
await page.click('#login');

// After
const loginPage = new LoginPage(page);
const credentials = TestDataFactory.createValidCredentials();
await loginPage.login(credentials);
```

### Validation
- All existing tests pass
- Code coverage maintained at 85%
- Performance tests show no regression
- Manual testing completed

---

## [2024-01-10] Page Object Model Restructuring

### Problem
Page objects were inconsistent and contained business logic mixed with UI interactions.

### Solution
- Implemented strict separation of concerns
- Created base `BasePage` class with common functionality
- Standardized page object interfaces
- Extracted business logic to service classes

### Impact
- **Maintainability Index**: Improved from 65 to 82
- **Code Reusability**: Increased by 60%
- **Onboarding Time**: New team members 50% faster

### Files Changed
[List of changed files...]
```

### 5.2 Code Review Training Materials

```typescript
// src/training/CodeReviewExamples.ts
export class CodeReviewTrainingExamples {
  /**
   * Example 1: Naming Conventions
   * 
   * BAD EXAMPLE:
   * async function t1() {
   *   const u = await getUserData();
   *   const x = u.email;
   *   return x;
   * }
   * 
   * GOOD EXAMPLE:
   */
  async getUserEmail(): Promise<string> {
    const userData = await this.getUserData();
    const userEmail = userData.email;
    return userEmail;
  }

  /**
   * Example 2: Error Handling
   * 
   * BAD EXAMPLE:
   * async function login() {
   *   try {
   *     await page.click('#login');
   *   } catch {
   *     // Silent failure
   *   }
   * }
   * 
   * GOOD EXAMPLE:
   */
  async performLogin(credentials: UserCredentials): Promise<void> {
    try {
      await this.loginPage.login(credentials);
    } catch (error) {
      throw new Error(`Login failed for user ${credentials.email}: ${error.message}`);
    }
  }

  /**
   * Example 3: Magic Numbers
   * 
   * BAD EXAMPLE:
   * await page.waitForTimeout(5000);
   * 
   * GOOD EXAMPLE:
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForTimeout(this.TIMEOUTS.PAGE_LOAD);
  }

  private readonly TIMEOUTS = {
    PAGE_LOAD: 5000,
    ELEMENT_APPEAR: 3000,
    NETWORK_REQUEST: 10000
  } as const;
}
```

---

## Exercises

### Exercise 1: Code Review Practice

Conduct a comprehensive code review of a provided test file:

1. Identify at least 5 code smells
2. Suggest specific improvements for each issue
3. Prioritize issues by impact and effort required
4. Create a refactoring plan with timeline estimates

### Exercise 2: SOLID Principles Implementation

Refactor a monolithic test class to follow SOLID principles:

1. Apply Single Responsibility Principle to break down large classes
2. Implement Open/Closed Principle with strategy patterns
3. Use Dependency Inversion for better testability
4. Document the improvements and trade-offs

### Exercise 3: Automated Quality Gate Setup

Set up comprehensive code quality automation:

1. Configure ESLint with custom rules for test code
2. Integrate SonarQube or similar quality analysis tool
3. Create quality gates that block poor-quality code
4. Set up automated reporting and notifications

### Exercise 4: Legacy Code Refactoring

Take a legacy test automation project and systematically refactor it:

1. Analyze current code quality metrics
2. Create a prioritized refactoring plan
3. Implement refactoring in small, testable increments
4. Validate improvements with metrics and stakeholder feedback

---

## Advanced Concepts

### Microservices Testing Architecture

```typescript
// Advanced pattern for distributed system testing
export class MicroserviceTestOrchestrator {
  async orchestrateDistributedTest(
    services: MicroserviceConfig[],
    testScenario: TestScenario
  ): Promise<TestResult> {
    // Implementation for coordinating tests across microservices
    return {} as TestResult;
  }
}
```

### AI-Assisted Code Review

```typescript
// Integration with AI tools for automated code analysis
export class AICodeReviewAssistant {
  async analyzeCodeChanges(diff: GitDiff): Promise<AIReviewSuggestions> {
    // Implementation using AI APIs for intelligent code review
    return {} as AIReviewSuggestions;
  }
}
```

---

## Summary

In this lesson, you've mastered the art of code review and systematic refactoring for test automation projects:

### Key Accomplishments

1. **Code Review Mastery**: Implemented comprehensive review processes with automated tools
2. **Systematic Refactoring**: Applied proven techniques to improve code quality and maintainability
3. **SOLID Principles**: Restructured test architecture following professional software design principles
4. **Quality Automation**: Set up automated quality gates and continuous improvement processes
5. **Documentation Standards**: Created comprehensive documentation and knowledge sharing practices
6. **Team Collaboration**: Established processes that enhance team productivity and code quality

### Professional Skills Developed

- **Code Quality Leadership**: Ability to establish and maintain coding standards across teams
- **Technical Debt Management**: Skills in identifying, prioritizing, and systematically addressing technical debt
- **Mentorship Capabilities**: Knowledge to guide junior developers in code quality practices
- **Process Improvement**: Experience in implementing and optimizing development workflows
- **Quality Engineering**: Advanced understanding of quality assurance beyond testing

### Next Steps

With your code review and refactoring skills mastered, you're ready to prepare for the final project presentation and comprehensive assessment in the next lesson.

---

## Additional Resources

- **Refactoring Catalog**: [Martin Fowler's Refactoring Guide](https://refactoring.com/)
- **Code Review Best Practices**: [Google's Code Review Guidelines](https://google.github.io/eng-practices/review/)
- **SOLID Principles**: [Clean Code Principles](https://example.com/clean-code)
- **Automated Quality Tools**: [SonarQube Documentation](https://docs.sonarqube.org/)

---

*Your code review and refactoring expertise demonstrates senior-level capabilities. Proceed to the final project presentation in the next lesson!*
