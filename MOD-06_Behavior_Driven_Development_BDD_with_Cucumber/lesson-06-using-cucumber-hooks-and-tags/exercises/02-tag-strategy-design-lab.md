# Exercise 02: Tag Strategy Design Lab

## 🎯 Exercise Overview

**Objective**: Design and implement comprehensive tag strategies for large-scale BDD projects, including taxonomy design, team collaboration patterns, and maintenance strategies that scale with project growth.

**Duration**: 40 minutes  
**Complexity**: Intermediate  
**Skills Focus**: Tag taxonomy design, naming conventions, team collaboration, maintenance strategies

## 📚 Learning Objectives

By completing this exercise, you will be able to:

1. **LO1**: Design scalable tag taxonomies for enterprise-level BDD projects
2. **LO2**: Implement effective team collaboration patterns using tags
3. **LO3**: Create maintainable naming conventions and governance rules
4. **LO4**: Build intelligent tag-based execution strategies for different contexts
5. **LO5**: Develop tag maintenance and lifecycle management processes

## 🛠️ Setup Requirements

### **Prerequisites**
- Completion of Exercise 01: Hook Implementation Workshop
- Understanding of team-based software development workflows
- Familiarity with CI/CD concepts
- Basic knowledge of project management methodologies

### **Initial Setup**
```bash
# Create exercise directory
mkdir tag-strategy-design-lab
cd tag-strategy-design-lab

# Initialize project structure
npm init -y
npm install --save-dev @cucumber/cucumber typescript ts-node

# Create comprehensive directory structure
mkdir -p {features,step-definitions,hooks,config,governance,documentation}
mkdir -p features/{user-management,payment,inventory,admin,reports}
mkdir -p config/{environments,teams,execution-strategies}
```

### **Project Configuration**
```json
// package.json scripts
{
  "scripts": {
    "test": "cucumber-js",
    "test:smoke": "cucumber-js --tags '@smoke'",
    "test:critical": "cucumber-js --tags '@critical'",
    "test:team-frontend": "cucumber-js --tags '@team-frontend'",
    "test:team-backend": "cucumber-js --tags '@team-backend'",
    "test:regression": "cucumber-js --tags '@regression and not @flaky'",
    "test:fast": "cucumber-js --tags '@fast and not @slow'",
    "test:ci": "cucumber-js --tags '(@smoke or @critical) and not @wip'",
    "test:nightly": "cucumber-js --tags '@comprehensive or @e2e'",
    "analyze-tags": "node scripts/tag-analyzer.js"
  }
}
```

## 📋 Lab Tasks

### **Task 1: Design Tag Taxonomy (15 minutes)**

Create a comprehensive tag taxonomy that supports multiple organizational dimensions.

**File**: `config/tag-taxonomy.ts`

```typescript
// config/tag-taxonomy.ts
/**
 * TODO: Design comprehensive tag taxonomy
 * Requirements:
 * 1. Create hierarchical tag categories
 * 2. Define naming conventions for each category
 * 3. Establish relationships between tag types
 * 4. Plan for scalability and maintenance
 * 5. Consider team collaboration needs
 */

export interface TagCategory {
    name: string;
    prefix?: string;
    description: string;
    examples: string[];
    rules: string[];
}

// TODO: Define the following tag categories:
// - Execution Scope (smoke, regression, integration, e2e)
// - Priority Levels (critical, high, medium, low)
// - Functional Areas (auth, payment, inventory, reporting)
// - Team Ownership (team-frontend, team-backend, team-qa)
// - Environment Targeting (dev, qa, staging, prod-safe)
// - Development Status (wip, ready, blocked, deprecated)
// - Feature Organization (epic, story, feature-flag)

/**
 * TODO: Create tag taxonomy configuration
 * Should include:
 * - Category definitions
 * - Naming conventions
 * - Validation rules
 * - Usage guidelines
 */

/**
 * TODO: Implement tag validation system
 * Should provide:
 * - Naming convention validation
 * - Category compliance checking
 * - Duplicate detection
 * - Usage analytics
 */
```

**Expected Implementation:**
```typescript
// config/tag-taxonomy.ts - Solution
export interface TagCategory {
    name: string;
    prefix?: string;
    description: string;
    examples: string[];
    rules: string[];
}

export const TAG_TAXONOMY: Record<string, TagCategory> = {
    executionScope: {
        name: 'Execution Scope',
        description: 'Defines the scope and type of test execution',
        examples: ['@smoke', '@regression', '@integration', '@e2e', '@unit'],
        rules: [
            'Each scenario should have at least one scope tag',
            'Scope tags are mutually exclusive for primary classification',
            'Use @smoke for critical path scenarios',
            'Use @regression for comprehensive feature coverage',
            'Use @integration for service integration scenarios',
            'Use @e2e for complete user journey tests'
        ]
    },
    
    priority: {
        name: 'Priority Levels',
        description: 'Indicates business priority and execution urgency',
        examples: ['@critical', '@high', '@medium', '@low'],
        rules: [
            'Priority reflects business impact, not technical complexity',
            '@critical scenarios must run in pre-commit hooks',
            '@high scenarios run in post-commit pipelines',
            '@medium and @low scenarios run in nightly builds',
            'Each scenario must have exactly one priority tag'
        ]
    },
    
    functionalArea: {
        name: 'Functional Areas',
        description: 'Groups tests by business functionality or domain',
        examples: ['@auth', '@payment', '@inventory', '@reporting', '@admin'],
        rules: [
            'Use domain-driven design principles for grouping',
            'Functional areas should align with business capabilities',
            'Multiple functional tags allowed for cross-cutting features',
            'Use kebab-case for multi-word functional areas'
        ]
    },
    
    teamOwnership: {
        name: 'Team Ownership',
        prefix: 'team-',
        description: 'Identifies responsible team for test maintenance',
        examples: ['@team-frontend', '@team-backend', '@team-qa', '@team-devops'],
        rules: [
            'Must use team- prefix for consistency',
            'Team names should match organizational structure',
            'Multiple teams can own cross-functional scenarios',
            'Team tags facilitate focused test execution'
        ]
    },
    
    environment: {
        name: 'Environment Targeting',
        description: 'Specifies appropriate execution environments',
        examples: ['@dev', '@qa', '@staging', '@prod-safe'],
        rules: [
            '@prod-safe indicates scenarios safe for production',
            'Environment tags guide deployment pipeline execution',
            'Use @dev for development-only test scenarios',
            '@qa indicates scenarios requiring QA environment setup'
        ]
    },
    
    developmentStatus: {
        name: 'Development Status',
        description: 'Tracks development and readiness status',
        examples: ['@wip', '@ready', '@blocked', '@deprecated', '@flaky'],
        rules: [
            '@wip scenarios are excluded from CI pipelines',
            '@ready indicates scenarios prepared for execution',
            '@blocked scenarios have external dependencies',
            '@deprecated marks scenarios for removal',
            '@flaky identifies unstable scenarios requiring attention'
        ]
    },
    
    featureOrganization: {
        name: 'Feature Organization',
        description: 'Links tests to development artifacts and features',
        examples: ['@epic-user-onboarding', '@story-123', '@feature-flag-new-ui'],
        rules: [
            'Use epic- prefix for epic-level test organization',
            'Use story- prefix with ticket numbers for traceability',
            'Use feature-flag- prefix for feature toggle scenarios',
            'Maintain alignment with project management tools'
        ]
    }
};

export class TagValidator {
    static validateTag(tag: string): TagValidationResult {
        const cleanTag = tag.startsWith('@') ? tag.slice(1) : tag;
        
        return {
            isValid: this.isValidTagFormat(cleanTag),
            category: this.categorizeTag(cleanTag),
            suggestions: this.generateSuggestions(cleanTag),
            violations: this.checkRuleViolations(cleanTag)
        };
    }
    
    private static isValidTagFormat(tag: string): boolean {
        // Tags should be lowercase, alphanumeric with hyphens
        const validPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
        return validPattern.test(tag) && !tag.includes('--');
    }
    
    private static categorizeTag(tag: string): string {
        for (const [categoryKey, category] of Object.entries(TAG_TAXONOMY)) {
            if (category.prefix && tag.startsWith(category.prefix)) {
                return categoryKey;
            }
            if (category.examples.some(example => example.slice(1) === tag)) {
                return categoryKey;
            }
        }
        return 'uncategorized';
    }
    
    private static generateSuggestions(tag: string): string[] {
        const suggestions: string[] = [];
        
        // Common corrections
        if (tag.includes('_')) {
            suggestions.push(tag.replace(/_/g, '-'));
        }
        if (/[A-Z]/.test(tag)) {
            suggestions.push(tag.toLowerCase());
        }
        if (tag.includes(' ')) {
            suggestions.push(tag.replace(/\s+/g, '-'));
        }
        
        return suggestions;
    }
    
    private static checkRuleViolations(tag: string): string[] {
        const violations: string[] = [];
        
        // Check for common violations
        if (tag.length > 30) {
            violations.push('Tag name too long (max 30 characters)');
        }
        
        if (tag.startsWith('-') || tag.endsWith('-')) {
            violations.push('Tag cannot start or end with hyphen');
        }
        
        return violations;
    }
}

export interface TagValidationResult {
    isValid: boolean;
    category: string;
    suggestions: string[];
    violations: string[];
}
```

### **Task 2: Implement Team Collaboration Strategy (10 minutes)**

Design tag strategies that facilitate effective team collaboration and ownership.

**File**: `config/team-collaboration.ts`

```typescript
// config/team-collaboration.ts
/**
 * TODO: Design team collaboration patterns
 * Requirements:
 * 1. Define team boundaries and responsibilities
 * 2. Create cross-team coordination mechanisms
 * 3. Establish shared ownership patterns
 * 4. Design conflict resolution strategies
 * 5. Plan communication and notification patterns
 */

export interface TeamConfig {
    name: string;
    responsibilities: string[];
    primaryTags: string[];
    secondaryTags: string[];
    crossTeamTags: string[];
    notificationRules: NotificationRule[];
}

export interface NotificationRule {
    condition: string;
    channels: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
}

// TODO: Define team configurations
// Should include:
// - Frontend team configuration
// - Backend team configuration  
// - QA team configuration
// - DevOps team configuration
// - Cross-team collaboration rules

/**
 * TODO: Implement collaboration strategy
 * Should provide:
 * - Team-specific test execution
 * - Cross-team coordination workflows
 * - Conflict resolution mechanisms
 * - Communication automation
 */
```

**Expected Implementation:**
```typescript
// config/team-collaboration.ts - Solution
export interface TeamConfig {
    name: string;
    responsibilities: string[];
    primaryTags: string[];
    secondaryTags: string[];
    crossTeamTags: string[];
    notificationRules: NotificationRule[];
}

export interface NotificationRule {
    condition: string;
    channels: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
}

export const TEAM_CONFIGURATIONS: Record<string, TeamConfig> = {
    frontend: {
        name: 'Frontend Team',
        responsibilities: [
            'UI component testing',
            'User interaction flows',
            'Frontend integration testing',
            'Accessibility testing'
        ],
        primaryTags: ['@team-frontend', '@ui', '@component'],
        secondaryTags: ['@accessibility', '@responsive', '@performance'],
        crossTeamTags: ['@integration', '@e2e', '@cross-team'],
        notificationRules: [
            {
                condition: '@team-frontend and (@critical or @high) and failed',
                channels: ['slack:frontend-alerts', 'email:frontend-leads'],
                urgency: 'high'
            },
            {
                condition: '@ui and @flaky',
                channels: ['slack:frontend-general'],
                urgency: 'medium'
            }
        ]
    },
    
    backend: {
        name: 'Backend Team',
        responsibilities: [
            'API testing',
            'Database operations',
            'Service integration',
            'Performance testing'
        ],
        primaryTags: ['@team-backend', '@api', '@database'],
        secondaryTags: ['@service', '@integration', '@performance'],
        crossTeamTags: ['@e2e', '@cross-team', '@security'],
        notificationRules: [
            {
                condition: '@team-backend and @critical and failed',
                channels: ['pager:backend-oncall', 'slack:backend-alerts'],
                urgency: 'critical'
            },
            {
                condition: '@api and @performance and slow',
                channels: ['slack:backend-performance'],
                urgency: 'medium'
            }
        ]
    },
    
    qa: {
        name: 'QA Team',
        responsibilities: [
            'Test automation framework',
            'Cross-team test coordination',
            'Quality metrics and reporting',
            'Test environment management'
        ],
        primaryTags: ['@team-qa', '@automation', '@framework'],
        secondaryTags: ['@reporting', '@metrics', '@environment'],
        crossTeamTags: ['@cross-team', '@coordination', '@quality'],
        notificationRules: [
            {
                condition: '@automation and @framework and failed',
                channels: ['slack:qa-automation', 'email:qa-leads'],
                urgency: 'high'
            },
            {
                condition: '@flaky and count > 3',
                channels: ['slack:qa-quality'],
                urgency: 'medium'
            }
        ]
    },
    
    devops: {
        name: 'DevOps Team',
        responsibilities: [
            'CI/CD pipeline testing',
            'Infrastructure testing',
            'Security testing',
            'Deployment validation'
        ],
        primaryTags: ['@team-devops', '@infrastructure', '@deployment'],
        secondaryTags: ['@security', '@pipeline', '@monitoring'],
        crossTeamTags: ['@cross-team', '@security', '@performance'],
        notificationRules: [
            {
                condition: '@infrastructure and @critical and failed',
                channels: ['pager:devops-oncall', 'slack:devops-alerts'],
                urgency: 'critical'
            },
            {
                condition: '@security and failed',
                channels: ['slack:security-alerts', 'email:security-team'],
                urgency: 'high'
            }
        ]
    }
};

export class TeamCollaborationManager {
    static getTeamExecutionStrategy(teamName: string): string[] {
        const team = TEAM_CONFIGURATIONS[teamName];
        if (!team) return [];
        
        return [
            ...team.primaryTags,
            ...team.secondaryTags
        ];
    }
    
    static getCrossTeamScenarios(): string {
        return '@cross-team or (@integration and (@team-frontend and @team-backend))';
    }
    
    static getTeamSpecificExecution(teamName: string): string {
        const team = TEAM_CONFIGURATIONS[teamName];
        if (!team) return '';
        
        const primaryTagsExpression = team.primaryTags.join(' or ');
        return `(${primaryTagsExpression}) and not @cross-team`;
    }
    
    static generateNotificationPlan(failedScenarios: Array<{tags: string[], status: string}>): NotificationPlan[] {
        const notifications: NotificationPlan[] = [];
        
        for (const scenario of failedScenarios) {
            for (const [teamKey, team] of Object.entries(TEAM_CONFIGURATIONS)) {
                for (const rule of team.notificationRules) {
                    if (this.matchesCondition(scenario.tags, rule.condition)) {
                        notifications.push({
                            team: team.name,
                            channels: rule.channels,
                            urgency: rule.urgency,
                            scenario: scenario
                        });
                    }
                }
            }
        }
        
        return notifications;
    }
    
    private static matchesCondition(tags: string[], condition: string): boolean {
        // Simplified condition matching - in real implementation, use proper tag expression parser
        return tags.some(tag => condition.includes(tag));
    }
}

export interface NotificationPlan {
    team: string;
    channels: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
    scenario: {tags: string[], status: string};
}
```

### **Task 3: Create Execution Strategies (10 minutes)**

Design intelligent tag-based execution strategies for different contexts.

**File**: `config/execution-strategies.ts`

```typescript
// config/execution-strategies.ts
/**
 * TODO: Design execution strategies
 * Requirements:
 * 1. Create context-aware execution patterns
 * 2. Define CI/CD pipeline integration strategies
 * 3. Implement performance-optimized filtering
 * 4. Design environment-specific strategies
 * 5. Plan for parallel execution optimization
 */

export interface ExecutionStrategy {
    name: string;
    description: string;
    tagExpression: string;
    maxDuration: string;
    parallelization: boolean;
    environments: string[];
    triggers: string[];
}

// TODO: Define execution strategies for:
// - Pre-commit validation
// - Post-commit integration
// - Nightly comprehensive testing
// - Pre-release validation
// - Production smoke testing
// - Performance testing
// - Team-specific execution

/**
 * TODO: Implement strategy selector
 * Should provide:
 * - Context-aware strategy selection
 * - Dynamic tag expression generation
 * - Performance optimization
 * - Resource utilization planning
 */
```

**Expected Implementation:**
```typescript
// config/execution-strategies.ts - Solution
export interface ExecutionStrategy {
    name: string;
    description: string;
    tagExpression: string;
    maxDuration: string;
    parallelization: boolean;
    environments: string[];
    triggers: string[];
    resourceRequirements?: {
        cpu?: string;
        memory?: string;
        browsers?: string[];
    };
}

export const EXECUTION_STRATEGIES: Record<string, ExecutionStrategy> = {
    preCommit: {
        name: 'Pre-Commit Validation',
        description: 'Fast, critical tests that must pass before code commit',
        tagExpression: '@smoke and @fast and not @slow and not @flaky',
        maxDuration: '5 minutes',
        parallelization: true,
        environments: ['local', 'dev'],
        triggers: ['pre-commit-hook', 'pull-request'],
        resourceRequirements: {
            cpu: '2 cores',
            memory: '4GB',
            browsers: ['chromium']
        }
    },
    
    postCommit: {
        name: 'Post-Commit Integration',
        description: 'Comprehensive integration testing after code merge',
        tagExpression: '@regression and not @flaky and not @slow',
        maxDuration: '30 minutes',
        parallelization: true,
        environments: ['dev', 'qa'],
        triggers: ['merge-to-main', 'scheduled-hourly'],
        resourceRequirements: {
            cpu: '4 cores',
            memory: '8GB',
            browsers: ['chromium', 'firefox']
        }
    },
    
    nightly: {
        name: 'Nightly Comprehensive',
        description: 'Complete test suite including slow and comprehensive tests',
        tagExpression: '@comprehensive or @e2e or (@regression and @slow)',
        maxDuration: '2 hours',
        parallelization: true,
        environments: ['qa', 'staging'],
        triggers: ['scheduled-nightly'],
        resourceRequirements: {
            cpu: '8 cores',
            memory: '16GB',
            browsers: ['chromium', 'firefox', 'webkit']
        }
    },
    
    preRelease: {
        name: 'Pre-Release Validation',
        description: 'Critical validation before production deployment',
        tagExpression: '(@critical or @high) and @prod-safe and not @flaky',
        maxDuration: '1 hour',
        parallelization: false,
        environments: ['staging', 'pre-prod'],
        triggers: ['release-candidate', 'deployment-gate'],
        resourceRequirements: {
            cpu: '4 cores',
            memory: '8GB',
            browsers: ['chromium', 'firefox', 'webkit']
        }
    },
    
    productionSmoke: {
        name: 'Production Smoke Testing',
        description: 'Essential health checks in production environment',
        tagExpression: '@smoke and @prod-safe and @critical',
        maxDuration: '10 minutes',
        parallelization: false,
        environments: ['production'],
        triggers: ['post-deployment', 'health-check'],
        resourceRequirements: {
            cpu: '2 cores',
            memory: '4GB',
            browsers: ['chromium']
        }
    },
    
    performance: {
        name: 'Performance Testing',
        description: 'Performance and load testing scenarios',
        tagExpression: '@performance and not @flaky',
        maxDuration: '45 minutes',
        parallelization: false,
        environments: ['performance', 'staging'],
        triggers: ['scheduled-weekly', 'performance-gate'],
        resourceRequirements: {
            cpu: '8 cores',
            memory: '32GB',
            browsers: ['chromium']
        }
    },
    
    teamFrontend: {
        name: 'Frontend Team Focus',
        description: 'Frontend-specific tests for team development',
        tagExpression: '@team-frontend and (@ui or @component) and not @blocked',
        maxDuration: '20 minutes',
        parallelization: true,
        environments: ['dev', 'qa'],
        triggers: ['team-specific', 'feature-branch'],
        resourceRequirements: {
            cpu: '4 cores',
            memory: '8GB',
            browsers: ['chromium', 'firefox', 'webkit']
        }
    },
    
    teamBackend: {
        name: 'Backend Team Focus',
        description: 'Backend-specific tests for API and service development',
        tagExpression: '@team-backend and (@api or @database or @service) and not @blocked',
        maxDuration: '25 minutes',
        parallelization: true,
        environments: ['dev', 'qa'],
        triggers: ['team-specific', 'api-changes'],
        resourceRequirements: {
            cpu: '4 cores',
            memory: '8GB',
            browsers: []  // API tests don't need browsers
        }
    }
};

export class ExecutionStrategySelector {
    static selectStrategy(context: ExecutionContext): ExecutionStrategy {
        const contextKey = this.determineContextKey(context);
        return EXECUTION_STRATEGIES[contextKey] || EXECUTION_STRATEGIES.postCommit;
    }
    
    static generateDynamicExpression(baseStrategy: string, context: ExecutionContext): string {
        let expression = EXECUTION_STRATEGIES[baseStrategy]?.tagExpression || '';
        
        // Add environment-specific filters
        if (context.environment) {
            expression += ` and (@${context.environment} or not @env-specific)`;
        }
        
        // Add team-specific filters
        if (context.team) {
            expression += ` and (@team-${context.team} or @shared)`;
        }
        
        // Add feature-specific filters
        if (context.feature) {
            expression += ` and (@feature-${context.feature} or not @feature-specific)`;
        }
        
        // Exclude problematic scenarios
        expression += ' and not @blocked and not @deprecated';
        
        return expression;
    }
    
    static optimizeForParallelExecution(strategy: ExecutionStrategy, availableResources: ResourceConfig): ExecutionPlan {
        const plan: ExecutionPlan = {
            strategy: strategy.name,
            totalEstimatedDuration: strategy.maxDuration,
            parallelGroups: [],
            resourceAllocation: availableResources
        };
        
        if (strategy.parallelization && availableResources.workers > 1) {
            plan.parallelGroups = this.createParallelGroups(strategy, availableResources);
        } else {
            plan.parallelGroups = [{
                name: 'sequential',
                tagExpression: strategy.tagExpression,
                estimatedDuration: strategy.maxDuration
            }];
        }
        
        return plan;
    }
    
    private static determineContextKey(context: ExecutionContext): string {
        if (context.trigger === 'pre-commit-hook') return 'preCommit';
        if (context.trigger === 'merge-to-main') return 'postCommit';
        if (context.trigger === 'scheduled-nightly') return 'nightly';
        if (context.trigger === 'release-candidate') return 'preRelease';
        if (context.trigger === 'post-deployment') return 'productionSmoke';
        if (context.trigger === 'performance-gate') return 'performance';
        if (context.team === 'frontend') return 'teamFrontend';
        if (context.team === 'backend') return 'teamBackend';
        
        return 'postCommit'; // default
    }
    
    private static createParallelGroups(strategy: ExecutionStrategy, resources: ResourceConfig): ParallelGroup[] {
        // Simplified parallel grouping logic
        const groups: ParallelGroup[] = [];
        const workerCount = Math.min(resources.workers, 4); // Limit to 4 parallel groups
        
        for (let i = 0; i < workerCount; i++) {
            groups.push({
                name: `group-${i + 1}`,
                tagExpression: `${strategy.tagExpression} and @parallel-group-${i + 1}`,
                estimatedDuration: strategy.maxDuration
            });
        }
        
        return groups;
    }
}

export interface ExecutionContext {
    trigger: string;
    environment?: string;
    team?: string;
    feature?: string;
    timeConstraint?: string;
    resourceConstraint?: ResourceConfig;
}

export interface ResourceConfig {
    workers: number;
    cpu: string;
    memory: string;
    browsers: string[];
}

export interface ExecutionPlan {
    strategy: string;
    totalEstimatedDuration: string;
    parallelGroups: ParallelGroup[];
    resourceAllocation: ResourceConfig;
}

export interface ParallelGroup {
    name: string;
    tagExpression: string;
    estimatedDuration: string;
}
```

### **Task 4: Build Governance Framework (5 minutes)**

Create tag governance and maintenance processes.

**File**: `governance/tag-governance.ts`

```typescript
// governance/tag-governance.ts
/**
 * TODO: Create tag governance framework
 * Requirements:
 * 1. Define tag lifecycle management
 * 2. Create maintenance schedules
 * 3. Implement usage analytics
 * 4. Design deprecation processes
 * 5. Plan evolution and updates
 */

export interface GovernanceRule {
    name: string;
    description: string;
    severity: 'warning' | 'error' | 'info';
    checkFunction: (tags: string[]) => GovernanceViolation[];
}

export interface GovernanceViolation {
    rule: string;
    severity: 'warning' | 'error' | 'info';
    message: string;
    suggestion?: string;
}

// TODO: Implement governance rules for:
// - Tag naming conventions
// - Mandatory tag requirements
// - Deprecated tag detection
// - Orphaned tag identification
// - Usage analytics and reporting

/**
 * TODO: Create maintenance scheduler
 * Should provide:
 * - Regular tag audits
 * - Cleanup recommendations
 * - Usage reports
 * - Evolution planning
 */
```

**Expected Implementation:**
```typescript
// governance/tag-governance.ts - Solution
export interface GovernanceRule {
    name: string;
    description: string;
    severity: 'warning' | 'error' | 'info';
    checkFunction: (tags: string[]) => GovernanceViolation[];
}

export interface GovernanceViolation {
    rule: string;
    severity: 'warning' | 'error' | 'info';
    message: string;
    suggestion?: string;
}

export const GOVERNANCE_RULES: GovernanceRule[] = [
    {
        name: 'mandatory-scope-tag',
        description: 'Every scenario must have at least one execution scope tag',
        severity: 'error',
        checkFunction: (tags: string[]) => {
            const scopeTags = ['@smoke', '@regression', '@integration', '@e2e', '@unit'];
            const hasScopeTag = tags.some(tag => scopeTags.includes(tag));
            
            if (!hasScopeTag) {
                return [{
                    rule: 'mandatory-scope-tag',
                    severity: 'error',
                    message: 'Scenario must have at least one scope tag',
                    suggestion: 'Add @smoke, @regression, @integration, @e2e, or @unit'
                }];
            }
            return [];
        }
    },
    
    {
        name: 'mandatory-priority-tag',
        description: 'Every scenario must have exactly one priority tag',
        severity: 'error',
        checkFunction: (tags: string[]) => {
            const priorityTags = ['@critical', '@high', '@medium', '@low'];
            const priorityCount = tags.filter(tag => priorityTags.includes(tag)).length;
            
            if (priorityCount === 0) {
                return [{
                    rule: 'mandatory-priority-tag',
                    severity: 'error',
                    message: 'Scenario must have exactly one priority tag',
                    suggestion: 'Add @critical, @high, @medium, or @low'
                }];
            } else if (priorityCount > 1) {
                return [{
                    rule: 'mandatory-priority-tag',
                    severity: 'error',
                    message: 'Scenario cannot have multiple priority tags',
                    suggestion: 'Keep only one priority tag'
                }];
            }
            return [];
        }
    },
    
    {
        name: 'deprecated-tag-usage',
        description: 'Scenarios should not use deprecated tags',
        severity: 'warning',
        checkFunction: (tags: string[]) => {
            const deprecatedTags = ['@old-ui', '@legacy-api', '@deprecated-feature'];
            const violations: GovernanceViolation[] = [];
            
            for (const tag of tags) {
                if (deprecatedTags.includes(tag)) {
                    violations.push({
                        rule: 'deprecated-tag-usage',
                        severity: 'warning',
                        message: `Tag ${tag} is deprecated`,
                        suggestion: 'Remove deprecated tag or update to current equivalent'
                    });
                }
            }
            return violations;
        }
    },
    
    {
        name: 'team-ownership-clarity',
        description: 'Cross-team scenarios should be clearly marked',
        severity: 'warning',
        checkFunction: (tags: string[]) => {
            const teamTags = tags.filter(tag => tag.startsWith('@team-'));
            
            if (teamTags.length > 1 && !tags.includes('@cross-team')) {
                return [{
                    rule: 'team-ownership-clarity',
                    severity: 'warning',
                    message: 'Multiple team tags detected without @cross-team marker',
                    suggestion: 'Add @cross-team tag for multi-team scenarios'
                }];
            }
            return [];
        }
    },
    
    {
        name: 'wip-production-exclusion',
        description: 'Work-in-progress scenarios must be excluded from production pipelines',
        severity: 'error',
        checkFunction: (tags: string[]) => {
            if (tags.includes('@wip') && tags.includes('@prod-safe')) {
                return [{
                    rule: 'wip-production-exclusion',
                    severity: 'error',
                    message: 'WIP scenarios cannot be marked as production-safe',
                    suggestion: 'Remove @prod-safe tag from WIP scenarios'
                }];
            }
            return [];
        }
    }
];

export class TagGovernanceManager {
    static validateScenarioTags(tags: string[]): GovernanceReport {
        const violations: GovernanceViolation[] = [];
        
        for (const rule of GOVERNANCE_RULES) {
            const ruleViolations = rule.checkFunction(tags);
            violations.push(...ruleViolations);
        }
        
        return {
            tags,
            violations,
            severity: this.calculateOverallSeverity(violations),
            isCompliant: violations.filter(v => v.severity === 'error').length === 0
        };
    }
    
    static generateMaintenanceReport(allScenarioTags: string[][]): MaintenanceReport {
        const tagUsage = this.analyzeTagUsage(allScenarioTags);
        const orphanedTags = this.identifyOrphanedTags(tagUsage);
        const consolidationOpportunities = this.findConsolidationOpportunities(tagUsage);
        
        return {
            totalScenarios: allScenarioTags.length,
            uniqueTags: Object.keys(tagUsage).length,
            tagUsage,
            orphanedTags,
            consolidationOpportunities,
            recommendations: this.generateMaintenanceRecommendations(tagUsage, orphanedTags)
        };
    }
    
    private static calculateOverallSeverity(violations: GovernanceViolation[]): 'error' | 'warning' | 'info' | 'clean' {
        if (violations.some(v => v.severity === 'error')) return 'error';
        if (violations.some(v => v.severity === 'warning')) return 'warning';
        if (violations.some(v => v.severity === 'info')) return 'info';
        return 'clean';
    }
    
    private static analyzeTagUsage(allScenarioTags: string[][]): Record<string, number> {
        const usage: Record<string, number> = {};
        
        for (const scenarioTags of allScenarioTags) {
            for (const tag of scenarioTags) {
                usage[tag] = (usage[tag] || 0) + 1;
            }
        }
        
        return usage;
    }
    
    private static identifyOrphanedTags(tagUsage: Record<string, number>): string[] {
        return Object.entries(tagUsage)
            .filter(([tag, count]) => count <= 1)
            .map(([tag]) => tag);
    }
    
    private static findConsolidationOpportunities(tagUsage: Record<string, number>): ConsolidationOpportunity[] {
        // Simplified consolidation detection
        const opportunities: ConsolidationOpportunity[] = [];
        const tags = Object.keys(tagUsage);
        
        for (let i = 0; i < tags.length; i++) {
            for (let j = i + 1; j < tags.length; j++) {
                const similarity = this.calculateSimilarity(tags[i], tags[j]);
                if (similarity > 0.8) {
                    opportunities.push({
                        primaryTag: tags[i],
                        similarTag: tags[j],
                        similarity,
                        recommendation: 'Consider consolidating similar tags'
                    });
                }
            }
        }
        
        return opportunities;
    }
    
    private static calculateSimilarity(tag1: string, tag2: string): number {
        // Simple similarity calculation based on common characters
        const longer = tag1.length > tag2.length ? tag1 : tag2;
        const shorter = tag1.length > tag2.length ? tag2 : tag1;
        
        if (longer.length === 0) return 1.0;
        
        let commonChars = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (longer.includes(shorter[i])) commonChars++;
        }
        
        return commonChars / longer.length;
    }
    
    private static generateMaintenanceRecommendations(
        tagUsage: Record<string, number>, 
        orphanedTags: string[]
    ): string[] {
        const recommendations: string[] = [];
        
        if (orphanedTags.length > 0) {
            recommendations.push(`Remove ${orphanedTags.length} orphaned tags to reduce clutter`);
        }
        
        const totalTags = Object.keys(tagUsage).length;
        if (totalTags > 50) {
            recommendations.push('Consider tag consolidation - high tag count may impact maintainability');
        }
        
        const highUsageTags = Object.entries(tagUsage)
            .filter(([tag, count]) => count > 20)
            .map(([tag]) => tag);
        
        if (highUsageTags.length > 0) {
            recommendations.push(`Review high-usage tags for potential sub-categorization: ${highUsageTags.join(', ')}`);
        }
        
        return recommendations;
    }
}

export interface GovernanceReport {
    tags: string[];
    violations: GovernanceViolation[];
    severity: 'error' | 'warning' | 'info' | 'clean';
    isCompliant: boolean;
}

export interface MaintenanceReport {
    totalScenarios: number;
    uniqueTags: number;
    tagUsage: Record<string, number>;
    orphanedTags: string[];
    consolidationOpportunities: ConsolidationOpportunity[];
    recommendations: string[];
}

export interface ConsolidationOpportunity {
    primaryTag: string;
    similarTag: string;
    similarity: number;
    recommendation: string;
}
```

## 🧪 Implementation Testing

Create comprehensive feature files to test your tag strategy:

**File**: `features/tag-strategy-validation.feature`

```gherkin
Feature: Tag Strategy Validation
  As a development team
  I want to validate our tag strategy implementation
  So that I can ensure effective test organization and execution

  @smoke @critical @team-qa @tag-validation
  Scenario: Tag taxonomy compliance
    Given I have a comprehensive tag taxonomy
    When I validate scenario tags against the taxonomy
    Then all tags should comply with naming conventions
    And mandatory tags should be present
    And deprecated tags should be identified

  @integration @high @team-qa @governance
  Scenario: Team collaboration validation
    Given I have team-specific tag configurations
    When I analyze cross-team scenarios
    Then team ownership should be clear
    And notification rules should be configured
    And collaboration patterns should be defined

  @regression @medium @team-qa @execution-strategy
  Scenario: Execution strategy optimization
    Given I have multiple execution strategies
    When I select strategies for different contexts
    Then the appropriate strategy should be chosen
    And tag expressions should be optimized
    And resource allocation should be efficient

  @maintenance @low @team-qa @governance
  Scenario: Tag maintenance and cleanup
    Given I have tag usage analytics
    When I run maintenance analysis
    Then orphaned tags should be identified
    And consolidation opportunities should be found
    And maintenance recommendations should be generated
```

## ✅ Validation Checklist

### **Tag Taxonomy (25%)**
- ✅ Comprehensive category definitions
- ✅ Consistent naming conventions
- ✅ Clear usage rules and guidelines
- ✅ Validation and enforcement mechanisms

### **Team Collaboration (25%)**
- ✅ Clear team boundaries and responsibilities
- ✅ Cross-team coordination mechanisms
- ✅ Notification and communication rules
- ✅ Conflict resolution strategies

### **Execution Strategies (25%)**
- ✅ Context-aware strategy selection
- ✅ Performance-optimized filtering
- ✅ Environment-specific considerations
- ✅ Resource allocation planning

### **Governance Framework (25%)**
- ✅ Comprehensive governance rules
- ✅ Maintenance and cleanup processes
- ✅ Usage analytics and reporting
- ✅ Evolution and update planning

## 🎯 Success Criteria

**Minimum Requirements:**
- Complete tag taxonomy with all major categories
- Basic team collaboration patterns defined
- At least 3 execution strategies implemented
- Basic governance rules in place

**Excellence Indicators:**
- Sophisticated multi-dimensional tag organization
- Advanced team collaboration with automation
- Intelligent context-aware execution strategies
- Comprehensive governance with analytics

## 🔗 Next Steps

After completing this exercise:
1. Test your tag strategy with real scenarios
2. Gather feedback from team members
3. Refine and iterate based on usage patterns
4. Move on to [Exercise 03: Advanced Execution Control Project](./03-advanced-execution-control-project.md)

---

**Estimated Completion Time**: 40 minutes  
**Difficulty Level**: Intermediate  
**Skills Developed**: Tag strategy design, team collaboration, governance, execution optimization