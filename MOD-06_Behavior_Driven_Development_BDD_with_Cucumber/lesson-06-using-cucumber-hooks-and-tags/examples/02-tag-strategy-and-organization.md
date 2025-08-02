# Example 02: Tag Strategy and Organization

## Overview

This example demonstrates comprehensive tag strategy design for large-scale BDD projects, including naming conventions, hierarchical organization, team collaboration patterns, and maintenance strategies that scale with project growth.

## Learning Focus

- **Tag Taxonomy Design**: Systematic approach to tag organization and naming
- **Team Collaboration**: Multi-team tag strategies and conflict resolution
- **Maintenance Strategies**: Keeping tag systems organized and up-to-date
- **Execution Optimization**: Efficient test selection and filtering patterns

## Tag Taxonomy Fundamentals

### Hierarchical Tag Organization

```typescript
// config/tag-taxonomy.ts
/**
 * Comprehensive tag taxonomy for enterprise BDD projects
 * Organized by category with consistent naming conventions
 */

export const TAG_TAXONOMY = {
    // 1. EXECUTION SCOPE TAGS
    scope: {
        // Test execution scope
        unit: '@unit',              // Unit-level behavior tests
        integration: '@integration', // Integration tests
        e2e: '@e2e',               // End-to-end tests
        system: '@system',          // System-level tests
        
        // Test coverage scope
        smoke: '@smoke',            // Core functionality tests
        regression: '@regression',   // Full regression suite
        sanity: '@sanity',          // Quick health checks
        comprehensive: '@comprehensive' // Complete feature coverage
    },

    // 2. FUNCTIONAL AREA TAGS
    functional: {
        // Application domains
        auth: '@auth',              // Authentication & authorization
        user: '@user',              // User management
        payment: '@payment',        // Payment processing
        inventory: '@inventory',    // Inventory management
        reporting: '@reporting',    // Reports and analytics
        admin: '@admin',           // Administrative functions
        
        // Technical areas
        api: '@api',               // API testing
        ui: '@ui',                 // User interface testing
        db: '@database',           // Database operations
        security: '@security',     // Security testing
        performance: '@performance' // Performance testing
    },

    // 3. PRIORITY AND CRITICALITY TAGS
    priority: {
        critical: '@critical',      // Business-critical functionality
        high: '@high',             // High priority features
        medium: '@medium',         // Medium priority features
        low: '@low',               // Low priority features
        
        // Business impact
        revenue: '@revenue-impact', // Revenue-affecting features
        compliance: '@compliance',  // Regulatory compliance
        security: '@security-critical' // Security-critical features
    },

    // 4. ENVIRONMENT AND DEPLOYMENT TAGS
    environment: {
        // Target environments
        dev: '@dev',               // Development environment
        qa: '@qa',                 // QA environment  
        staging: '@staging',       // Staging environment
        prod: '@prod-safe',        // Production-safe tests
        
        // Deployment phases
        prerelease: '@pre-release', // Pre-release validation
        postrelease: '@post-release', // Post-release verification
        maintenance: '@maintenance'  // Maintenance window tests
    },

    // 5. TEAM AND OWNERSHIP TAGS
    ownership: {
        // Team ownership
        frontend: '@team-frontend',  // Frontend team
        backend: '@team-backend',    // Backend team
        devops: '@team-devops',     // DevOps team
        qa: '@team-qa',             // QA team
        
        // Component ownership
        shared: '@shared-component', // Shared components
        external: '@external-dependency' // External dependencies
    },

    // 6. DEVELOPMENT STATUS TAGS
    status: {
        // Development status
        wip: '@wip',               // Work in progress
        ready: '@ready',           // Ready for testing
        blocked: '@blocked',       // Blocked by dependencies
        deprecated: '@deprecated', // Deprecated functionality
        
        // Quality status
        flaky: '@flaky',          // Flaky/unstable tests
        manual: '@manual',        // Requires manual verification
        automated: '@automated'   // Fully automated tests
    },

    // 7. FEATURE AND EPIC TAGS
    features: {
        // Epic-level organization
        epic: '@epic',            // Epic-level tests
        story: '@story',          // User story tests
        spike: '@spike',          // Technical spike validation
        
        // Feature flags
        feature: '@feature-flag', // Feature flag dependent
        experimental: '@experimental' // Experimental features
    }
} as const;
```

### Tag Naming Conventions

```typescript
// config/tag-conventions.ts
/**
 * Tag naming conventions and validation rules
 */

export class TagNamingConventions {
    // Standard tag prefixes for different categories
    private static readonly PREFIXES = {
        TEAM: 'team-',
        EPIC: 'epic-',
        STORY: 'story-',
        FEATURE: 'feature-',
        BUG: 'bug-',
        ENV: 'env-',
        COMPONENT: 'comp-'
    } as const;

    /**
     * Generate team-specific tags
     */
    static team(teamName: string): string {
        return `@${this.PREFIXES.TEAM}${teamName.toLowerCase().replace(/\s+/g, '-')}`;
    }

    /**
     * Generate epic-specific tags
     */
    static epic(epicId: string): string {
        return `@${this.PREFIXES.EPIC}${epicId.toLowerCase()}`;
    }

    /**
     * Generate story-specific tags
     */
    static story(storyId: string): string {
        return `@${this.PREFIXES.STORY}${storyId.toLowerCase()}`;
    }

    /**
     * Generate feature flag tags
     */
    static feature(featureName: string): string {
        return `@${this.PREFIXES.FEATURE}${featureName.toLowerCase().replace(/\s+/g, '-')}`;
    }

    /**
     * Generate bug tracking tags
     */
    static bug(bugId: string): string {
        return `@${this.PREFIXES.BUG}${bugId.toLowerCase()}`;
    }

    /**
     * Generate environment-specific tags
     */
    static environment(envName: string): string {
        return `@${this.PREFIXES.ENV}${envName.toLowerCase()}`;
    }

    /**
     * Generate component-specific tags
     */
    static component(componentName: string): string {
        return `@${this.PREFIXES.COMPONENT}${componentName.toLowerCase().replace(/\s+/g, '-')}`;
    }

    /**
     * Validate tag naming conventions
     */
    static validateTag(tag: string): TagValidationResult {
        const cleanTag = tag.startsWith('@') ? tag.slice(1) : tag;
        
        return {
            isValid: this.isValidTagName(cleanTag),
            category: this.categorizeTag(cleanTag),
            suggestions: this.generateSuggestions(cleanTag)
        };
    }

    private static isValidTagName(tag: string): boolean {
        // Tags should be lowercase, alphanumeric with hyphens
        const validPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
        return validPattern.test(tag) && !tag.includes('--');
    }

    private static categorizeTag(tag: string): TagCategory {
        for (const [category, prefix] of Object.entries(this.PREFIXES)) {
            if (tag.startsWith(prefix)) {
                return category as TagCategory;
            }
        }
        return 'GENERAL';
    }

    private static generateSuggestions(tag: string): string[] {
        const suggestions: string[] = [];
        
        // Suggest fixes for common issues
        if (tag.includes('_')) {
            suggestions.push(tag.replace(/_/g, '-'));
        }
        
        if (tag.includes(' ')) {
            suggestions.push(tag.replace(/\s+/g, '-'));
        }
        
        if (/[A-Z]/.test(tag)) {
            suggestions.push(tag.toLowerCase());
        }
        
        return suggestions;
    }
}

interface TagValidationResult {
    isValid: boolean;
    category: TagCategory;
    suggestions: string[];
}

type TagCategory = 'TEAM' | 'EPIC' | 'STORY' | 'FEATURE' | 'BUG' | 'ENV' | 'COMPONENT' | 'GENERAL';
```

## Advanced Tag Strategy Patterns

### Multi-Dimensional Tag Organization

```typescript
// config/tag-strategies.ts
/**
 * Advanced tag strategy patterns for complex project organization
 */

export class TagStrategies {
    /**
     * Feature-based tag strategy
     * Organize tests by feature boundaries and dependencies
     */
    static featureStrategy = {
        // Core features with dependency mapping
        userManagement: {
            primary: '@user-management',
            dependencies: ['@auth', '@database', '@api'],
            subFeatures: [
                '@user-registration',
                '@user-profile',
                '@user-preferences',
                '@user-security'
            ]
        },
        
        paymentProcessing: {
            primary: '@payment-processing',
            dependencies: ['@auth', '@user-management', '@external-payment-gateway'],
            subFeatures: [
                '@payment-cards',
                '@payment-wallets',
                '@payment-subscriptions',
                '@payment-refunds'
            ]
        },
        
        inventoryManagement: {
            primary: '@inventory-management',
            dependencies: ['@database', '@api'],
            subFeatures: [
                '@inventory-tracking',
                '@inventory-alerts',
                '@inventory-reports',
                '@inventory-forecasting'
            ]
        }
    };

    /**
     * Risk-based tag strategy
     * Organize tests by business risk and impact
     */
    static riskStrategy = {
        highRisk: {
            tags: ['@critical', '@revenue-impact', '@security-critical'],
            executionFrequency: 'every-commit',
            environments: ['@staging', '@prod-safe']
        },
        
        mediumRisk: {
            tags: ['@high', '@user-facing', '@integration'],
            executionFrequency: 'daily',
            environments: ['@qa', '@staging']
        },
        
        lowRisk: {
            tags: ['@medium', '@low', '@internal'],
            executionFrequency: 'weekly',
            environments: ['@dev', '@qa']
        }
    };

    /**
     * Team collaboration strategy
     * Organize tests for efficient team collaboration
     */
    static teamStrategy = {
        crossTeam: {
            // Tests requiring multiple team coordination
            tags: ['@cross-team', '@integration', '@e2e'],
            teams: ['@team-frontend', '@team-backend', '@team-qa'],
            coordination: 'required'
        },
        
        independent: {
            // Tests that can be run independently by single teams
            frontend: ['@team-frontend', '@ui', '@component'],
            backend: ['@team-backend', '@api', '@database'],
            qa: ['@team-qa', '@automation', '@manual']
        },
        
        shared: {
            // Shared components and utilities
            tags: ['@shared', '@utility', '@common'],
            ownership: 'all-teams',
            maintenance: 'rotation'
        }
    };

    /**
     * CI/CD pipeline strategy
     * Organize tests for efficient pipeline execution
     */
    static pipelineStrategy = {
        preCommit: {
            tags: ['@smoke', '@fast', '@unit'],
            maxDuration: '5 minutes',
            failureBehavior: 'block-commit'
        },
        
        postCommit: {
            tags: ['@regression', '@integration'],
            maxDuration: '30 minutes',
            failureBehavior: 'notify-team'
        },
        
        nightly: {
            tags: ['@comprehensive', '@e2e', '@performance'],
            maxDuration: '2 hours',
            failureBehavior: 'create-ticket'
        },
        
        preRelease: {
            tags: ['@critical', '@smoke', '@regression'],
            maxDuration: '1 hour',
            failureBehavior: 'block-release'
        }
    };
}
```

### Dynamic Tag Generation

```typescript
// utilities/dynamic-tags.ts
/**
 * Dynamic tag generation based on runtime conditions
 */

export class DynamicTagGenerator {
    /**
     * Generate environment-specific tags
     */
    static generateEnvironmentTags(): string[] {
        const env = process.env.NODE_ENV || 'development';
        const region = process.env.AWS_REGION || 'us-east-1';
        const version = process.env.APP_VERSION || 'dev';
        
        return [
            `@env-${env}`,
            `@region-${region}`,
            `@version-${version.replace(/\./g, '-')}`
        ];
    }

    /**
     * Generate feature flag tags
     */
    static generateFeatureFlagTags(): string[] {
        const featureFlags = this.getActiveFeatureFlags();
        
        return featureFlags.map(flag => `@feature-${flag.toLowerCase().replace(/_/g, '-')}`);
    }

    /**
     * Generate time-based tags
     */
    static generateTimeTags(): string[] {
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay();
        
        const tags: string[] = [];
        
        // Time-of-day tags
        if (hour >= 9 && hour <= 17) {
            tags.push('@business-hours');
        } else {
            tags.push('@after-hours');
        }
        
        // Day-of-week tags
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            tags.push('@weekday');
        } else {
            tags.push('@weekend');
        }
        
        return tags;
    }

    /**
     * Generate load-based tags
     */
    static generateLoadTags(): string[] {
        const cpuUsage = this.getCurrentCPUUsage();
        const memoryUsage = this.getCurrentMemoryUsage();
        
        const tags: string[] = [];
        
        if (cpuUsage < 50) {
            tags.push('@low-cpu');
        } else if (cpuUsage < 80) {
            tags.push('@medium-cpu');
        } else {
            tags.push('@high-cpu');
        }
        
        if (memoryUsage < 70) {
            tags.push('@low-memory');
        } else {
            tags.push('@high-memory');
        }
        
        return tags;
    }

    private static getActiveFeatureFlags(): string[] {
        // Implementation would connect to feature flag service
        return [
            'NEW_PAYMENT_FLOW',
            'ENHANCED_SEARCH',
            'BETA_DASHBOARD'
        ];
    }

    private static getCurrentCPUUsage(): number {
        // Implementation would get actual CPU usage
        return Math.random() * 100;
    }

    private static getCurrentMemoryUsage(): number {
        // Implementation would get actual memory usage
        return Math.random() * 100;
    }
}
```

## Tag Maintenance and Governance

### Tag Lifecycle Management

```typescript
// governance/tag-lifecycle.ts
/**
 * Tag lifecycle management and governance
 */

export class TagLifecycleManager {
    private tagUsageStats: Map<string, TagUsageStats> = new Map();
    
    /**
     * Analyze tag usage across the test suite
     */
    async analyzeTagUsage(testSuitePath: string): Promise<TagAnalysisReport> {
        const features = await this.discoverFeatureFiles(testSuitePath);
        const tagStats: Map<string, TagUsageStats> = new Map();
        
        for (const feature of features) {
            const tags = await this.extractTagsFromFeature(feature);
            
            for (const tag of tags) {
                const stats = tagStats.get(tag) || {
                    tag,
                    usage: 0,
                    files: [],
                    lastSeen: new Date(),
                    category: this.categorizeTag(tag)
                };
                
                stats.usage++;
                stats.files.push(feature);
                stats.lastSeen = new Date();
                
                tagStats.set(tag, stats);
            }
        }
        
        return this.generateAnalysisReport(tagStats);
    }

    /**
     * Identify orphaned or unused tags
     */
    identifyOrphanedTags(stats: Map<string, TagUsageStats>): string[] {
        const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        
        return Array.from(stats.values())
            .filter(stat => stat.usage === 0 || stat.lastSeen < threshold)
            .map(stat => stat.tag);
    }

    /**
     * Suggest tag consolidation opportunities
     */
    suggestTagConsolidation(stats: Map<string, TagUsageStats>): TagConsolidationSuggestion[] {
        const suggestions: TagConsolidationSuggestion[] = [];
        const tags = Array.from(stats.keys());
        
        // Find similar tags that could be consolidated
        for (let i = 0; i < tags.length; i++) {
            for (let j = i + 1; j < tags.length; j++) {
                const similarity = this.calculateTagSimilarity(tags[i], tags[j]);
                
                if (similarity > 0.8) {
                    suggestions.push({
                        primaryTag: tags[i],
                        duplicateTag: tags[j],
                        similarity,
                        recommendation: 'consolidate'
                    });
                }
            }
        }
        
        return suggestions;
    }

    /**
     * Generate tag maintenance report
     */
    private generateAnalysisReport(stats: Map<string, TagUsageStats>): TagAnalysisReport {
        const totalTags = stats.size;
        const activeTags = Array.from(stats.values()).filter(s => s.usage > 0).length;
        const orphanedTags = this.identifyOrphanedTags(stats);
        const consolidationSuggestions = this.suggestTagConsolidation(stats);
        
        return {
            summary: {
                totalTags,
                activeTags,
                orphanedTags: orphanedTags.length,
                consolidationOpportunities: consolidationSuggestions.length
            },
            orphanedTags,
            consolidationSuggestions,
            categoryBreakdown: this.generateCategoryBreakdown(stats),
            recommendations: this.generateRecommendations(stats)
        };
    }

    private calculateTagSimilarity(tag1: string, tag2: string): number {
        // Simple similarity calculation - could be enhanced with more sophisticated algorithms
        const longer = tag1.length > tag2.length ? tag1 : tag2;
        const shorter = tag1.length > tag2.length ? tag2 : tag1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    private levenshteinDistance(str1: string, str2: string): number {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
        
        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,     // deletion
                    matrix[j - 1][i] + 1,     // insertion
                    matrix[j - 1][i - 1] + indicator // substitution
                );
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    private async discoverFeatureFiles(path: string): Promise<string[]> {
        // Implementation would recursively find .feature files
        return [];
    }

    private async extractTagsFromFeature(featurePath: string): Promise<string[]> {
        // Implementation would parse .feature files and extract tags
        return [];
    }

    private categorizeTag(tag: string): string {
        // Implementation would categorize tags based on naming conventions
        return 'general';
    }

    private generateCategoryBreakdown(stats: Map<string, TagUsageStats>): Record<string, number> {
        const breakdown: Record<string, number> = {};
        
        for (const stat of stats.values()) {
            breakdown[stat.category] = (breakdown[stat.category] || 0) + 1;
        }
        
        return breakdown;
    }

    private generateRecommendations(stats: Map<string, TagUsageStats>): string[] {
        const recommendations: string[] = [];
        
        // Add specific recommendations based on analysis
        const orphanedCount = this.identifyOrphanedTags(stats).length;
        if (orphanedCount > 0) {
            recommendations.push(`Remove ${orphanedCount} orphaned tags to reduce clutter`);
        }
        
        const consolidationCount = this.suggestTagConsolidation(stats).length;
        if (consolidationCount > 0) {
            recommendations.push(`Consider consolidating ${consolidationCount} similar tags`);
        }
        
        return recommendations;
    }
}

interface TagUsageStats {
    tag: string;
    usage: number;
    files: string[];
    lastSeen: Date;
    category: string;
}

interface TagConsolidationSuggestion {
    primaryTag: string;
    duplicateTag: string;
    similarity: number;
    recommendation: string;
}

interface TagAnalysisReport {
    summary: {
        totalTags: number;
        activeTags: number;
        orphanedTags: number;
        consolidationOpportunities: number;
    };
    orphanedTags: string[];
    consolidationSuggestions: TagConsolidationSuggestion[];
    categoryBreakdown: Record<string, number>;
    recommendations: string[];
}
```

## Feature File Examples

### Comprehensive Tag Usage

```gherkin
# features/user-management/user-registration.feature
@user-management @user-registration @critical @team-frontend @team-backend
@smoke @regression @api @ui @database
Feature: User Registration
  As a potential user
  I want to register for an account
  So that I can access the application features

  Background:
    Given the user registration service is available
    And the database is in a clean state

  @smoke @happy-path @fast
  Scenario: Successful user registration with valid data
    Given I navigate to the registration page
    When I fill in the registration form with valid data
      | field    | value                |
      | email    | test@example.com     |
      | password | SecurePassword123!   |
      | name     | John Doe            |
    And I submit the registration form
    Then I should see a success message
    And I should receive a confirmation email
    And my account should be created in the database

  @validation @edge-case @medium
  Scenario: Registration with invalid email format
    Given I navigate to the registration page
    When I fill in the registration form with invalid email
      | field    | value           |
      | email    | invalid-email   |
      | password | SecurePass123!  |
      | name     | Jane Doe        |
    And I submit the registration form
    Then I should see an email validation error
    And the account should not be created

  @security @security-critical @high
  Scenario: Registration with weak password
    Given I navigate to the registration page
    When I fill in the registration form with weak password
      | field    | value        |
      | email    | test@example.com |
      | password | 123          |
      | name     | Bob Smith    |
    And I submit the registration form
    Then I should see a password strength error
    And the account should not be created

  @integration @external-dependency @slow
  Scenario: Registration when email service is unavailable
    Given I navigate to the registration page
    And the email service is unavailable
    When I fill in the registration form with valid data
    And I submit the registration form
    Then the account should be created
    But no confirmation email should be attempted
    And the email should be queued for later delivery
```

### Team-Specific Feature

```gherkin
# features/admin/user-management-admin.feature
@admin @user-management @team-backend @team-qa
@integration @database @api
Feature: Admin User Management
  As an administrator
  I want to manage user accounts
  So that I can maintain system integrity

  @admin-only @high @security
  Scenario: Admin can view all user accounts
    Given I am logged in as an administrator
    When I navigate to the user management dashboard
    Then I should see a list of all user accounts
    And I should see user statistics
    And I should have access to user management actions

  @admin-only @critical @audit @compliance
  Scenario: Admin can disable user accounts
    Given I am logged in as an administrator
    And there is an active user account "john@example.com"
    When I disable the user account "john@example.com"
    Then the account should be marked as disabled
    And the user should no longer be able to log in
    And an audit log entry should be created
```

## Command-Line Usage Patterns

### Basic Tag Filtering

```bash
# Run smoke tests only
npx cucumber-js --tags "@smoke"

# Run critical tests
npx cucumber-js --tags "@critical"

# Run tests for specific team
npx cucumber-js --tags "@team-frontend"

# Run tests for specific feature
npx cucumber-js --tags "@user-management"
```

### Advanced Tag Combinations

```bash
# Run smoke tests that are also critical
npx cucumber-js --tags "@smoke and @critical"

# Run either smoke or regression tests
npx cucumber-js --tags "@smoke or @regression"

# Run tests excluding work in progress
npx cucumber-js --tags "not @wip"

# Complex combinations
npx cucumber-js --tags "(@smoke or @critical) and not @flaky"
npx cucumber-js --tags "@team-frontend and (@ui or @integration)"
npx cucumber-js --tags "(@high or @critical) and not (@slow or @wip)"
```

### Environment-Specific Execution

```bash
# Production-safe tests only
npx cucumber-js --tags "@prod-safe"

# QA environment tests
npx cucumber-js --tags "@qa and (@smoke or @regression)"

# Development environment with experimental features
npx cucumber-js --tags "@dev and (@experimental or @feature-flag)"
```

### CI/CD Pipeline Integration

```bash
# Pre-commit hook tests (fast execution)
npx cucumber-js --tags "@smoke and @fast and not @slow"

# Post-commit pipeline
npx cucumber-js --tags "@regression and not @flaky"

# Nightly comprehensive testing
npx cucumber-js --tags "@comprehensive or (@e2e and @critical)"

# Pre-release validation
npx cucumber-js --tags "(@critical or @high) and @prod-safe"
```

## Key Learning Points

### **Tag Strategy Best Practices**
- ✅ Use hierarchical naming conventions for consistency
- ✅ Implement multi-dimensional tag organization (scope, priority, team, status)
- ✅ Design tags for both execution control and organization
- ✅ Regular tag maintenance and cleanup to prevent proliferation

### **Team Collaboration Patterns**
- ✅ Clear ownership boundaries with team-specific tags
- ✅ Cross-team coordination tags for integration scenarios
- ✅ Shared responsibility patterns for common components
- ✅ Tag governance processes and documentation

### **Maintenance Strategies**
- ✅ Regular tag usage analysis and orphan removal
- ✅ Automated tag validation and naming convention enforcement
- ✅ Tag consolidation opportunities identification
- ✅ Evolution planning for changing project needs

### **Execution Optimization**
- ✅ Efficient tag expressions for different execution contexts
- ✅ Environment-specific tag strategies
- ✅ Risk-based test selection using priority tags
- ✅ CI/CD pipeline integration with appropriate tag filters

---

**Next Steps**: Explore [Conditional Execution Patterns](./03-conditional-execution-patterns.md) to learn advanced tag-based execution control and automation strategies.