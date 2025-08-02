# Example 03: Advanced Tagging and Organization

## Overview

This example demonstrates sophisticated tagging strategies and organizational patterns for managing large-scale BDD test suites. You'll learn how to implement hierarchical tagging systems, create efficient test execution strategies, and organize tests for maximum maintainability and clarity.

## Learning Objectives

By completing this example, you will:

- **Master Hierarchical Tagging**: Implement multi-level tagging systems for complex test organization
- **Design Execution Strategies**: Create optimized test execution plans using tag combinations
- **Implement Risk-Based Testing**: Organize tests by risk level and business impact
- **Manage Feature Flags**: Use tags to handle feature toggle scenarios
- **Create Environment-Specific Tests**: Organize tests for different deployment environments
- **Build Performance Categories**: Tag tests by execution time and resource requirements

## Key Concepts

### Tagging Hierarchies
- **Functional Categories**: Feature areas and business domains
- **Technical Categories**: Test types and automation levels
- **Organizational Categories**: Teams, ownership, and maintenance responsibility
- **Execution Categories**: Priority, timing, and resource requirements

### Advanced Tag Patterns
- **Compound Tags**: Multiple tags working together
- **Conditional Tags**: Tags that change based on context
- **Dynamic Tags**: Runtime-determined tag assignments
- **Meta Tags**: Tags that describe other tags

## Implementation

### Project Structure

```
advanced-tagging/
├── features/
│   ├── critical-path/
│   │   ├── user-authentication.feature
│   │   ├── payment-processing.feature
│   │   └── order-fulfillment.feature
│   ├── business-features/
│   │   ├── product-catalog.feature
│   │   ├── shopping-cart.feature
│   │   └── customer-support.feature
│   ├── integration/
│   │   ├── external-apis.feature
│   │   ├── database-operations.feature
│   │   └── third-party-services.feature
│   └── support/
│       ├── world.ts
│       ├── hooks.ts
│       └── tag-manager.ts
├── step-definitions/
│   ├── authentication.steps.ts
│   ├── payment.steps.ts
│   ├── catalog.steps.ts
│   └── shared.steps.ts
├── config/
│   ├── cucumber.js
│   ├── tag-profiles.json
│   └── execution-strategies.json
├── scripts/
│   ├── run-by-risk.js
│   ├── run-by-team.js
│   └── generate-reports.js
└── package.json
```

### Feature Files with Advanced Tagging

#### Critical Path Features

```gherkin
# features/critical-path/user-authentication.feature
@critical @authentication @security @p1
@team:security @owner:auth-team @maintained-by:security-guild
@smoke @regression @nightly @pre-deployment
Feature: User Authentication System
  As a security-conscious application
  I want to ensure robust user authentication
  So that user accounts and data remain secure

Background:
  Given the authentication system is configured
  And security policies are enforced
  And audit logging is enabled

@critical @smoke @login @happy-path @fast
@environments:all @browsers:chrome,firefox,safari
@data-category:synthetic @pii:none
Scenario: Successful user login with valid credentials
  Given I am on the login page
  When I enter valid credentials for user "testuser@example.com"
  And I click the login button
  Then I should be successfully logged in
  And I should see the dashboard
  And login event should be logged

@critical @smoke @login @error-handling @medium
@environments:all @browsers:chrome,firefox
@data-category:synthetic @pii:none @accessibility:wcag-aa
Scenario: Login failure with invalid credentials
  Given I am on the login page
  When I enter invalid credentials
  And I click the login button
  Then I should see an appropriate error message
  And I should remain on the login page
  And failed login attempt should be logged
  And account lockout rules should be evaluated

@critical @security @brute-force @slow @manual-verification
@environments:staging,production @risk:high @compliance:required
@team:security @review-required @monitoring:enabled
Scenario: Account lockout after multiple failed attempts
  Given I am on the login page
  And user "testuser@example.com" has a valid account
  When I attempt to login with invalid credentials 5 times
  Then the account should be temporarily locked
  And security alert should be triggered
  And lockout notification should be sent
  And incident should be logged in security system

@critical @mfa @security @integration @slow
@environments:staging,production @external-dependencies:sms,email
@compliance:pci,sox @data-category:production-like
Scenario Outline: Multi-factor authentication verification
  Given I have successfully entered valid credentials
  And MFA is enabled for my account with <mfa_method>
  When I request MFA verification
  Then I should receive verification code via <delivery_method>
  And I should be prompted to enter the verification code
  When I enter the correct verification code
  Then I should be fully authenticated
  And MFA success should be logged

Examples: MFA Methods and Delivery
  @sms @mobile-required @carrier-dependent
  | mfa_method | delivery_method | verification_time | fallback_available |
  | SMS        | text_message    | 30_seconds       | email             |
  
  @email @reliable @universal
  | mfa_method | delivery_method | verification_time | fallback_available |
  | Email      | email_inbox     | 60_seconds       | sms               |
  
  @app @authenticator @offline-capable @secure
  | mfa_method | delivery_method | verification_time | fallback_available |
  | App        | authenticator   | instant          | backup_codes      |

@critical @session @timeout @security @medium
@environments:all @automated @regression
@data-retention:session-only @privacy:gdpr-compliant
Scenario: Session timeout after inactivity
  Given I am logged in successfully
  And session timeout is configured for 30 minutes
  When I remain inactive for 30 minutes
  Then my session should automatically expire
  And I should be redirected to login page
  And session expiry should be logged
  And temporary data should be cleared
```

#### Payment Processing Features

```gherkin
# features/critical-path/payment-processing.feature
@critical @payment @financial @p1
@team:payments @owner:fintech-team @maintained-by:payments-guild
@compliance:pci-dss @security:high @monitoring:real-time
Feature: Payment Processing System
  As an e-commerce platform
  I want to process payments securely and reliably
  So that customers can complete purchases successfully

Background:
  Given the payment gateway is configured
  And fraud detection is enabled
  And compliance monitoring is active

@critical @payment @credit-card @happy-path @integration
@environments:staging,production @external-dependencies:stripe,paypal
@pci-compliant @encrypted @audit-required @fast
Scenario: Successful credit card payment processing
  Given I have items in my shopping cart worth $99.99
  And I proceed to checkout
  When I enter valid credit card information:
    | card_number      | 4111111111111111 |
    | expiry_month     | 12               |
    | expiry_year      | 2025             |
    | cvv              | 123              |
    | cardholder_name  | John Doe         |
  And I submit the payment
  Then the payment should be processed successfully
  And I should receive payment confirmation
  And order should be created with "paid" status
  And payment event should be logged securely

@critical @payment @validation @error-handling @medium
@environments:all @data-category:synthetic @security:moderate
@accessibility:screen-reader @localization:multi-currency
Scenario Outline: Payment validation with various card scenarios
  Given I have items in my cart worth <amount>
  When I attempt payment with <card_type> card:
    | scenario           | <scenario>           |
    | card_number        | <card_number>        |
    | expected_result    | <expected_result>    |
    | error_type         | <error_type>         |
  Then the result should match expectations
  And appropriate user feedback should be provided
  And fraud detection should evaluate the transaction

Examples: Card Validation Scenarios
  @declined-card @fraud-prevention @user-experience
  | amount | card_type | scenario        | card_number      | expected_result | error_type      |
  | $50.00 | Visa      | declined        | 4000000000000002 | failure         | card_declined   |
  | $25.00 | Visa      | insufficient    | 4000000000009995 | failure         | insufficient_funds |
  | $75.00 | Visa      | expired         | 4000000000000069 | failure         | expired_card    |
  
  @processing-errors @gateway-integration @resilience
  | amount | card_type | scenario        | card_number      | expected_result | error_type      |
  | $100.00| Visa      | timeout         | 4000000000000259 | retry           | gateway_timeout |
  | $200.00| Visa      | network_error   | 4000000000000119 | retry           | network_error   |

@critical @payment @refund @financial @slow
@environments:staging,production @compliance:required
@approval-required @financial-impact:high @audit-trail
Scenario: Full refund processing
  Given I have a completed order with payment ID "PAY123456"
  And the order was placed within the refund window
  When customer service initiates a full refund
  And the refund is approved by a manager
  Then the refund should be processed to original payment method
  And customer should receive refund confirmation
  And order status should be updated to "refunded"
  And financial reconciliation should be triggered
  And audit entry should be created

@critical @payment @subscription @recurring @integration
@environments:production @external-dependencies:billing-system
@revenue-impact:high @customer-lifecycle @long-running
Scenario: Recurring subscription payment processing
  Given customer has an active subscription plan
  And billing cycle is set to monthly
  And next billing date is today
  When subscription billing is processed
  Then payment should be automatically charged
  And subscription should be renewed for next period
  And customer should receive billing notification
  And subscription analytics should be updated
  And revenue recognition should be recorded
```

#### Business Features with Team-Based Tagging

```gherkin
# features/business-features/product-catalog.feature
@business @catalog @product-management @p2
@team:product @owner:catalog-team @maintained-by:product-guild
@customer-facing @revenue-impacting @seo-critical
Feature: Product Catalog Management
  As a product manager
  I want to manage product listings effectively
  So that customers can discover and purchase products

@catalog @search @performance @medium
@team:search @elasticsearch @indexing
@user-experience @conversion-critical @fast
Scenario: Product search with filtering and sorting
  Given the catalog contains 10000 products
  And search indexing is up to date
  When I search for "bluetooth headphones"
  And I apply filters:
    | filter_type | values                    |
    | price_range | $50-$200                 |
    | brand       | Sony, Bose, Apple        |
    | rating      | 4_stars_and_above        |
    | availability| in_stock                 |
  And I sort by "price_low_to_high"
  Then search results should be returned within 500ms
  And results should match all applied filters
  And results should be sorted correctly
  And search analytics should be tracked

@catalog @inventory @real-time @integration @fast
@team:inventory @external-dependencies:warehouse-system
@business-critical @stock-management @automated
Scenario: Real-time inventory updates
  Given product "SKU12345" has 5 units in stock
  And inventory sync is enabled
  When 2 units are sold through the website
  And 1 unit is reserved for another channel
  Then available inventory should show 2 units
  And inventory update should be reflected within 10 seconds
  And warehouse system should be notified
  And low stock alert should be triggered if applicable

@catalog @pricing @dynamic @complex @medium
@team:pricing @revenue-optimization @promotion-engine
@business-rules @margin-protection @scheduled
Scenario: Dynamic pricing with promotional rules
  Given I have products configured with base pricing
  And promotional rules are active:
    | rule_type    | condition              | discount     | priority |
    | volume       | quantity >= 3          | 10%          | 1        |
    | seasonal     | summer_sale            | 15%          | 2        |
    | member       | premium_member = true  | 5%           | 3        |
    | clearance    | discontinued = true    | 30%          | 4        |
  When customer views product pricing
  Then applicable promotional discounts should be calculated
  And final price should reflect highest priority applicable discount
  And discount reason should be displayed to customer
  And pricing analytics should capture discount usage
```

#### Integration Tests with Dependency Tagging

```gherkin
# features/integration/external-apis.feature
@integration @external-apis @dependencies @p2
@team:platform @owner:integration-team @maintained-by:platform-guild
@third-party @resilience @monitoring-critical
Feature: External API Integration
  As a platform service
  I want to integrate reliably with external APIs
  So that business functionality remains available

@integration @shipping @api @external-dependency @medium
@team:logistics @service:fedex,ups,usps @fallback-required
@business-continuity @sla-dependent @rate-limited
Scenario: Shipping rate calculation with multiple carriers
  Given shipping service integrations are available
  And rate limiting is configured appropriately
  When I request shipping rates for:
    | origin      | destination | weight | dimensions    |
    | 90210       | 10001      | 2.5kg  | 30x20x10cm   |
  Then I should receive rates from available carriers:
    | carrier | service_type    | estimated_cost | delivery_time | tracking_included |
    | FedEx   | ground          | $12.99         | 3-5_days     | yes              |
    | UPS     | ground          | $11.99         | 2-4_days     | yes              |
    | USPS    | priority        | $8.99          | 2-3_days     | yes              |
  And response time should be under 2 seconds
  And fallback should be available if primary carrier fails

@integration @payment-gateway @financial @critical @slow
@team:payments @service:stripe @pci-compliance @encrypted
@real-money @production-data @approval-required
Scenario: Payment gateway health monitoring
  Given payment gateway connections are established
  And health check endpoints are configured
  When I perform system health verification
  Then payment gateway should respond within SLA
  And connection pool should be healthy
  And fraud detection should be operational
  And backup gateway should be standby ready
  And monitoring alerts should be functional

@integration @inventory @warehouse @real-time @complex
@team:fulfillment @service:warehouse-management-system
@data-synchronization @eventual-consistency @performance
Scenario: Multi-warehouse inventory synchronization
  Given multiple warehouse locations are configured:
    | warehouse_id | location    | capacity | specialization     |
    | WH001        | East Coast  | 10000    | electronics        |
    | WH002        | West Coast  | 8000     | clothing,books     |
    | WH003        | Midwest     | 12000    | general_merchandise|
  When inventory levels change across warehouses
  Then all systems should eventually reach consistency
  And allocation rules should be applied correctly
  And cross-warehouse transfers should be optimized
  And inventory reporting should aggregate accurately
```

### Advanced Tagging Configuration

#### Tag Profiles Configuration

```json
// config/tag-profiles.json
{
  "profiles": {
    "smoke": {
      "description": "Quick smoke tests for basic functionality",
      "tags": "@smoke and not @slow and not @external-dependencies",
      "parallel": 4,
      "timeout": 30000,
      "retry": 1
    },
    "regression": {
      "description": "Full regression test suite",
      "tags": "@regression",
      "parallel": 8,
      "timeout": 60000,
      "retry": 2
    },
    "critical-path": {
      "description": "Business-critical functionality",
      "tags": "@critical",
      "parallel": 2,
      "timeout": 120000,
      "retry": 3,
      "failFast": false
    },
    "team-security": {
      "description": "Tests owned by security team",
      "tags": "@team:security",
      "parallel": 1,
      "timeout": 90000,
      "retry": 1,
      "reportFormat": "security"
    },
    "fast-feedback": {
      "description": "Quick tests for fast feedback",
      "tags": "@fast and not @integration and not @external-dependencies",
      "parallel": 8,
      "timeout": 15000,
      "retry": 0
    },
    "nightly": {
      "description": "Comprehensive nightly test run",
      "tags": "@nightly or (@regression and not @manual)",
      "parallel": 12,
      "timeout": 300000,
      "retry": 2,
      "generateReport": true
    },
    "pre-deployment": {
      "description": "Pre-deployment verification tests",
      "tags": "@pre-deployment and @environments:production",
      "parallel": 4,
      "timeout": 180000,
      "retry": 3,
      "failFast": true
    },
    "performance": {
      "description": "Performance and load tests",
      "tags": "@performance or @slow",
      "parallel": 1,
      "timeout": 600000,
      "retry": 1,
      "resourceLimits": {
        "memory": "4GB",
        "cpu": "2cores"
      }
    },
    "compliance": {
      "description": "Compliance and security tests",
      "tags": "@compliance or @security or @pci-compliant",
      "parallel": 1,
      "timeout": 180000,
      "retry": 0,
      "auditLog": true,
      "reportFormat": "compliance"
    },
    "feature-flags": {
      "description": "Tests for feature flag scenarios",
      "tags": "@feature-flag",
      "parallel": 4,
      "timeout": 60000,
      "retry": 1,
      "dynamicConfig": true
    }
  },
  "environments": {
    "development": {
      "allowedTags": ["@smoke", "@fast", "@unit", "@development"],
      "excludedTags": ["@production-only", "@real-money", "@pci-required"],
      "parallel": 8
    },
    "staging": {
      "allowedTags": ["@smoke", "@regression", "@integration", "@staging"],
      "excludedTags": ["@production-only", "@real-money"],
      "parallel": 6
    },
    "production": {
      "allowedTags": ["@production", "@monitoring", "@health-check"],
      "excludedTags": ["@destructive", "@load-test"],
      "parallel": 2,
      "approvalRequired": true
    }
  },
  "riskCategories": {
    "high": {
      "tags": ["@critical", "@financial", "@security", "@compliance"],
      "executionPolicy": {
        "retry": 3,
        "timeout": 300000,
        "approvalRequired": true,
        "reviewRequired": true
      }
    },
    "medium": {
      "tags": ["@business", "@integration", "@user-facing"],
      "executionPolicy": {
        "retry": 2,
        "timeout": 120000,
        "approvalRequired": false
      }
    },
    "low": {
      "tags": ["@unit", "@fast", "@developer"],
      "executionPolicy": {
        "retry": 1,
        "timeout": 30000,
        "approvalRequired": false
      }
    }
  }
}
```

#### Execution Strategies Configuration

```json
// config/execution-strategies.json
{
  "strategies": {
    "pyramid": {
      "description": "Test pyramid execution order",
      "execution_order": [
        {
          "phase": "unit",
          "tags": "@unit and @fast",
          "parallel": 10,
          "failFast": true
        },
        {
          "phase": "integration",
          "tags": "@integration and not @external-dependencies",
          "parallel": 6,
          "dependsOn": ["unit"]
        },
        {
          "phase": "e2e-smoke",
          "tags": "@smoke and @e2e",
          "parallel": 4,
          "dependsOn": ["integration"]
        },
        {
          "phase": "e2e-full",
          "tags": "@e2e and not @smoke",
          "parallel": 2,
          "dependsOn": ["e2e-smoke"]
        }
      ]
    },
    "risk-based": {
      "description": "Risk-based execution prioritization",
      "execution_order": [
        {
          "phase": "critical-path",
          "tags": "@critical",
          "parallel": 2,
          "timeout": 300000,
          "failFast": true
        },
        {
          "phase": "high-risk",
          "tags": "@risk:high and not @critical",
          "parallel": 4,
          "dependsOn": ["critical-path"]
        },
        {
          "phase": "medium-risk",
          "tags": "@risk:medium",
          "parallel": 6,
          "dependsOn": ["high-risk"]
        },
        {
          "phase": "low-risk",
          "tags": "@risk:low",
          "parallel": 8,
          "dependsOn": ["medium-risk"]
        }
      ]
    },
    "team-parallel": {
      "description": "Team-based parallel execution",
      "execution_order": [
        {
          "phase": "security-team",
          "tags": "@team:security",
          "parallel": 2,
          "isolated": true
        },
        {
          "phase": "payments-team",
          "tags": "@team:payments",
          "parallel": 3,
          "isolated": true
        },
        {
          "phase": "platform-team",
          "tags": "@team:platform",
          "parallel": 4,
          "isolated": true
        },
        {
          "phase": "product-team",
          "tags": "@team:product",
          "parallel": 6,
          "isolated": true
        }
      ]
    },
    "continuous-integration": {
      "description": "CI/CD pipeline execution strategy",
      "execution_order": [
        {
          "phase": "pre-commit",
          "tags": "@fast and @unit",
          "parallel": 8,
          "timeout": 120000,
          "failFast": true
        },
        {
          "phase": "post-commit",
          "tags": "@smoke and not @external-dependencies",
          "parallel": 6,
          "timeout": 300000,
          "dependsOn": ["pre-commit"]
        },
        {
          "phase": "integration",
          "tags": "@integration",
          "parallel": 4,
          "timeout": 600000,
          "dependsOn": ["post-commit"]
        },
        {
          "phase": "deployment-verification",
          "tags": "@pre-deployment",
          "parallel": 2,
          "timeout": 900000,
          "dependsOn": ["integration"],
          "environment": "staging"
        }
      ]
    }
  }
}
```

### Tag Management Utilities

```typescript
// features/support/tag-manager.ts
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { ICustomWorld } from './world';

export class TagManager {
  private static instance: TagManager;
  private tagProfiles: any;
  private executionStrategies: any;
  private environmentConfig: any;

  constructor() {
    this.loadConfigurations();
  }

  static getInstance(): TagManager {
    if (!TagManager.instance) {
      TagManager.instance = new TagManager();
    }
    return TagManager.instance;
  }

  private loadConfigurations(): void {
    this.tagProfiles = require('../../config/tag-profiles.json');
    this.executionStrategies = require('../../config/execution-strategies.json');
    this.environmentConfig = this.getCurrentEnvironmentConfig();
  }

  getTagsForScenario(scenario: any): string[] {
    const tags = [];
    
    // Extract tags from scenario and feature
    if (scenario.pickle.tags) {
      tags.push(...scenario.pickle.tags.map(tag => tag.name));
    }
    
    return tags;
  }

  shouldSkipScenario(tags: string[], environment: string): boolean {
    const envConfig = this.tagProfiles.environments[environment];
    
    if (!envConfig) {
      return false;
    }

    // Check excluded tags
    for (const excludedTag of envConfig.excludedTags || []) {
      if (tags.includes(excludedTag)) {
        return true;
      }
    }

    // Check if scenario has any allowed tags
    const hasAllowedTag = tags.some(tag => 
      envConfig.allowedTags.includes(tag)
    );

    return !hasAllowedTag;
  }

  getExecutionConfig(tags: string[]): any {
    // Determine risk category
    const riskCategory = this.determineRiskCategory(tags);
    const riskConfig = this.tagProfiles.riskCategories[riskCategory];

    // Find matching profile
    const profile = this.findMatchingProfile(tags);

    return {
      riskCategory,
      profile,
      executionPolicy: riskConfig?.executionPolicy || {},
      timeout: profile?.timeout || 60000,
      retry: riskConfig?.executionPolicy?.retry || 1,
      parallel: profile?.parallel || 1
    };
  }

  private determineRiskCategory(tags: string[]): string {
    const riskCategories = this.tagProfiles.riskCategories;
    
    for (const [category, config] of Object.entries(riskCategories)) {
      if (config.tags.some(tag => tags.includes(tag))) {
        return category;
      }
    }
    
    return 'low';
  }

  private findMatchingProfile(tags: string[]): any {
    for (const [profileName, profile] of Object.entries(this.tagProfiles.profiles)) {
      if (this.tagsMatchProfile(tags, profile.tags)) {
        return { name: profileName, ...profile };
      }
    }
    
    return null;
  }

  private tagsMatchProfile(scenarioTags: string[], profileTagExpression: string): boolean {
    // Simple tag expression evaluation
    // In a real implementation, you'd use a proper expression parser
    const requiredTags = profileTagExpression.split(' and ').map(t => t.trim());
    
    return requiredTags.every(requiredTag => {
      if (requiredTag.startsWith('not ')) {
        const notTag = requiredTag.substring(4);
        return !scenarioTags.includes(notTag);
      }
      return scenarioTags.includes(requiredTag);
    });
  }

  private getCurrentEnvironmentConfig(): any {
    const environment = process.env.TEST_ENV || 'development';
    return this.tagProfiles.environments[environment] || {};
  }

  generateExecutionReport(results: any[]): any {
    const tagStats = {};
    const teamStats = {};
    const riskStats = {};

    for (const result of results) {
      // Count tag occurrences
      for (const tag of result.tags) {
        tagStats[tag] = (tagStats[tag] || 0) + 1;
      }

      // Count team ownership
      const teamTag = result.tags.find(tag => tag.startsWith('@team:'));
      if (teamTag) {
        const team = teamTag.substring(6);
        teamStats[team] = (teamStats[team] || 0) + 1;
      }

      // Count risk categories
      const riskCategory = this.determineRiskCategory(result.tags);
      riskStats[riskCategory] = (riskStats[riskCategory] || 0) + 1;
    }

    return {
      totalScenarios: results.length,
      tagDistribution: tagStats,
      teamDistribution: teamStats,
      riskDistribution: riskStats,
      executionTime: this.calculateTotalExecutionTime(results),
      coverage: this.calculateCoverage(results)
    };
  }

  private calculateTotalExecutionTime(results: any[]): number {
    return results.reduce((total, result) => total + (result.duration || 0), 0);
  }

  private calculateCoverage(results: any[]): any {
    const coveredFeatures = new Set();
    const coveredTeams = new Set();
    const coveredRiskLevels = new Set();

    for (const result of results) {
      // Extract feature coverage
      if (result.feature) {
        coveredFeatures.add(result.feature);
      }

      // Extract team coverage
      const teamTag = result.tags.find(tag => tag.startsWith('@team:'));
      if (teamTag) {
        coveredTeams.add(teamTag.substring(6));
      }

      // Extract risk coverage
      const riskCategory = this.determineRiskCategory(result.tags);
      coveredRiskLevels.add(riskCategory);
    }

    return {
      features: coveredFeatures.size,
      teams: coveredTeams.size,
      riskLevels: coveredRiskLevels.size
    };
  }
}

// Hook implementations
BeforeAll(async function () {
  const tagManager = TagManager.getInstance();
  console.log('Tag Manager initialized with current environment configuration');
});

Before(async function (this: ICustomWorld, scenario) {
  const tagManager = TagManager.getInstance();
  const tags = tagManager.getTagsForScenario(scenario);
  
  this.scenarioTags = tags;
  this.executionConfig = tagManager.getExecutionConfig(tags);
  
  // Set timeouts based on tags
  if (this.executionConfig.timeout) {
    this.setDefaultTimeout(this.executionConfig.timeout);
  }
  
  // Skip scenario if not appropriate for current environment
  const environment = process.env.TEST_ENV || 'development';
  if (tagManager.shouldSkipScenario(tags, environment)) {
    return 'skipped';
  }
  
  console.log(`Executing scenario with tags: ${tags.join(', ')}`);
  console.log(`Risk category: ${this.executionConfig.riskCategory}`);
});

After(async function (this: ICustomWorld, scenario) {
  const tagManager = TagManager.getInstance();
  
  // Log execution results with tag context
  const result = {
    scenario: scenario.pickle.name,
    tags: this.scenarioTags,
    duration: scenario.result?.duration || 0,
    status: scenario.result?.status || 'unknown',
    feature: scenario.pickle.uri
  };
  
  // Store result for reporting
  this.executionResults = this.executionResults || [];
  this.executionResults.push(result);
});

AfterAll(async function () {
  const tagManager = TagManager.getInstance();
  
  // Generate execution report if results are available
  if (global.executionResults && global.executionResults.length > 0) {
    const report = tagManager.generateExecutionReport(global.executionResults);
    console.log('Execution Report:', JSON.stringify(report, null, 2));
  }
});
```

### Execution Scripts

```javascript
// scripts/run-by-risk.js
const { spawn } = require('child_process');
const tagProfiles = require('../config/tag-profiles.json');

async function runByRisk() {
  const riskCategories = ['high', 'medium', 'low'];
  
  for (const risk of riskCategories) {
    console.log(`\n🔍 Running ${risk} risk tests...`);
    
    const riskConfig = tagProfiles.riskCategories[risk];
    const tagExpression = riskConfig.tags.map(tag => `${tag}`).join(' or ');
    const policy = riskConfig.executionPolicy;
    
    const args = [
      'cucumber-js',
      '--tags', `(${tagExpression})`,
      '--parallel', policy.parallel || 1,
      '--retry', policy.retry || 1,
      '--timeout', policy.timeout || 60000,
      '--format', 'json:reports/cucumber-report-' + risk + '.json',
      '--format', 'html:reports/cucumber-report-' + risk + '.html'
    ];
    
    if (policy.failFast) {
      args.push('--fail-fast');
    }
    
    try {
      await runCommand('npx', args);
      console.log(`✅ ${risk} risk tests completed successfully`);
    } catch (error) {
      console.error(`❌ ${risk} risk tests failed:`, error.message);
      
      if (risk === 'high' && policy.failFast) {
        console.log('🛑 Stopping execution due to high-risk test failures');
        process.exit(1);
      }
    }
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      reject(error);
    });
  });
}

// Run the script
runByRisk().catch(console.error);
```

```javascript
// scripts/run-by-team.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runByTeam() {
  const teams = ['security', 'payments', 'platform', 'product'];
  const results = {};
  
  // Run tests for each team in parallel
  const promises = teams.map(async (team) => {
    console.log(`\n👥 Running tests for ${team} team...`);
    
    const args = [
      'cucumber-js',
      '--tags', `@team:${team}`,
      '--parallel', '4',
      '--format', `json:reports/team-${team}-report.json`,
      '--format', `html:reports/team-${team}-report.html`
    ];
    
    try {
      await runCommand('npx', args);
      results[team] = { status: 'success', message: 'All tests passed' };
      console.log(`✅ ${team} team tests completed successfully`);
    } catch (error) {
      results[team] = { status: 'failure', message: error.message };
      console.error(`❌ ${team} team tests failed:`, error.message);
    }
  });
  
  await Promise.allSettled(promises);
  
  // Generate team summary report
  generateTeamSummary(results);
}

function generateTeamSummary(results) {
  const summaryPath = path.join('reports', 'team-summary.json');
  const summary = {
    timestamp: new Date().toISOString(),
    teams: results,
    overall: {
      total: Object.keys(results).length,
      passed: Object.values(results).filter(r => r.status === 'success').length,
      failed: Object.values(results).filter(r => r.status === 'failure').length
    }
  };
  
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📊 Team summary report generated: ${summaryPath}`);
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      reject(error);
    });
  });
}

// Run the script
runByTeam().catch(console.error);
```

## Key Learning Points

### Hierarchical Tagging Strategy

1. **Multi-Level Organization**: Use nested tag categories for complex test suites
2. **Team Ownership**: Clear responsibility and maintenance tracking
3. **Risk-Based Prioritization**: Execute tests based on business impact
4. **Environment Awareness**: Different tag strategies for different environments

### Execution Optimization

1. **Parallel Execution**: Configure parallelization based on test characteristics
2. **Resource Management**: Allocate resources appropriately for different test types
3. **Failure Strategies**: Handle failures differently based on risk and context
4. **Conditional Execution**: Skip or modify tests based on environment and context

### Advanced Tag Patterns

1. **Compound Tagging**: Multiple related tags working together
2. **Dynamic Configuration**: Runtime tag evaluation and assignment
3. **Meta Information**: Tags that provide execution context and requirements
4. **Integration Points**: Tags that identify external dependencies and requirements

## Common Tag Patterns

### Priority and Risk Tags
```gherkin
@p1 @critical @risk:high @business-critical
@p2 @important @risk:medium @user-facing
@p3 @nice-to-have @risk:low @developer-focused
```

### Team and Ownership Tags
```gherkin
@team:security @owner:auth-team @maintained-by:security-guild
@team:payments @owner:fintech-team @code-owner:payments-dev
```

### Technical Classification Tags
```gherkin
@unit @integration @e2e @performance @security
@fast @medium @slow @resource-intensive
@automated @manual @exploratory
```

### Environment and Deployment Tags
```gherkin
@environments:all @environments:staging,production
@pre-deployment @post-deployment @monitoring
@feature-flag:enabled @feature-flag:disabled
```

## Summary

This example demonstrates sophisticated tagging strategies that enable effective management of large-scale test suites. The hierarchical approach to tagging, combined with execution strategies and team-based organization, provides a robust foundation for enterprise test automation.

Key takeaways:
- Design tag hierarchies that reflect your organizational structure
- Use execution strategies to optimize test runs
- Implement risk-based testing approaches
- Create clear ownership and maintenance responsibilities
- Build flexible execution configurations for different contexts

## Next Steps

- Explore [Example 04: Multi-Step Workflow Scenarios](./04-multi-step-workflow-scenarios.md)
- Implement similar tagging strategies in your test suite
- Experiment with different execution strategies and configurations
- Consider how these patterns apply to your specific organizational and technical requirements