# Lesson 09 Examples: Advanced Gherkin for Complex Scenarios

This directory contains 4 comprehensive examples demonstrating advanced Gherkin patterns and techniques for handling complex business scenarios.

## Examples Overview

### [Example 01: Background and Scenario Outlines](./01-background-and-scenario-outlines.md)
**Focus**: Mastering Background sections and advanced Scenario Outline patterns

**Key Learning Points**:
- Implementing effective Background sections for shared setup
- Advanced Examples table patterns and data parameterization
- Managing state across multiple scenario executions
- Dynamic data generation and cross-browser testing
- Background optimization and performance considerations

**What You'll Build**:
- User authentication scenarios with shared preconditions
- Multi-browser compatibility testing suite
- Data-driven API validation scenarios
- Complex user registration workflows

### [Example 02: Complex Data Tables and Transformations](./02-complex-data-tables-and-transformations.md)
**Focus**: Working with sophisticated data structures and transformations

**Key Learning Points**:
- Multi-dimensional data table handling
- Custom data transformers in step definitions
- JSON and nested data structure validation
- Optional and conditional data processing
- Data validation and assertion patterns

**What You'll Build**:
- E-commerce product catalog management
- Complex form validation scenarios
- API payload transformation and validation
- Database record comparison and verification

### [Example 03: Advanced Tagging and Organization](./03-advanced-tagging-and-organization.md)
**Focus**: Sophisticated tagging strategies for test organization and execution

**Key Learning Points**:
- Hierarchical tagging systems and inheritance
- Environment-specific and risk-based tagging
- Dynamic tag composition and conditional execution
- Integration with CI/CD pipelines and reporting
- Tag-based test suite optimization

**What You'll Build**:
- Multi-environment test execution framework
- Risk-based testing prioritization system
- Feature-based test organization structure
- Automated tag-driven reporting system

### [Example 04: Multi-Step Workflow Scenarios](./04-multi-step-workflow-scenarios.md)
**Focus**: End-to-end business process testing and complex user journeys

**Key Learning Points**:
- Long-running workflow scenario design
- Cross-system integration testing patterns
- State management across multiple steps
- Error handling and recovery scenarios
- Performance optimization for complex workflows

**What You'll Build**:
- Complete e-commerce purchase workflow
- Multi-step user onboarding process
- Complex approval and notification workflows
- Cross-platform data synchronization scenarios

## Progressive Learning Path

These examples are designed to build upon each other:

1. **Foundation**: Start with Background and Scenario Outlines to understand advanced data-driven patterns
2. **Data Mastery**: Learn complex data handling and transformation techniques
3. **Organization**: Master test organization and execution control through advanced tagging
4. **Integration**: Combine all techniques in realistic end-to-end workflow scenarios

## Code Structure

Each example follows this consistent structure:

```
example-name/
├── features/
│   ├── *.feature           # Feature files with advanced Gherkin
│   └── support/
│       ├── world.ts        # Shared context and configuration
│       ├── hooks.ts        # Advanced hooks and setup
│       └── transforms/     # Data transformation utilities
├── step-definitions/
│   ├── *.steps.ts         # Step definition implementations
│   └── support/           # Helper functions and utilities
├── test-data/
│   ├── *.json             # Test data files
│   └── generators/        # Dynamic data generation
├── config/
│   ├── cucumber.js        # Cucumber configuration
│   └── environments/      # Environment-specific settings
└── reports/               # Generated reports and documentation
```

## Prerequisites

Before working with these examples, ensure you have:

- Completed Lessons 01-08 of this module
- Node.js 18+ and npm/yarn installed  
- TypeScript 4.8+ configured
- Playwright and Cucumber.js properly set up
- Understanding of basic BDD principles and Gherkin syntax

## Setup Instructions

1. **Clone or Download**: Get the example code from the repository
2. **Install Dependencies**: Run `npm install` in each example directory
3. **Configure Environment**: Update configuration files for your system
4. **Run Examples**: Execute scenarios using provided npm scripts
5. **Review Reports**: Examine generated reports and documentation

## Execution Commands

Each example includes these npm scripts:

```bash
# Run all scenarios
npm run test

# Run specific tags
npm run test:smoke
npm run test:regression
npm run test:api

# Run with specific reporters
npm run test:report
npm run test:json
npm run test:html

# Run in different environments
npm run test:dev
npm run test:staging
npm run test:prod

# Debug mode
npm run test:debug
```

## Key Files to Review

For each example, pay special attention to:

- **Feature Files**: Study the advanced Gherkin patterns and syntax
- **Step Definitions**: See how complex data is handled and transformed
- **World/Context**: Understand state management across scenarios
- **Hooks**: Learn advanced setup and teardown patterns
- **Configuration**: See how different environments and tags are managed
- **Reports**: Review generated documentation and test results

## Advanced Concepts Demonstrated

### Background Optimization
```gherkin
Background:
  Given the system is in a clean state
  And the following configuration is applied:
    | setting          | value     |
    | api_timeout      | 30        |
    | retry_attempts   | 3         |
    | parallel_threads | 4         |
```

### Complex Scenario Outlines
```gherkin
Scenario Outline: Multi-dimensional user testing
  Given a <user_type> user in <environment>
  When they perform <action> with <data>
  Then the system should respond with <expected_result>
  And the audit log should contain <audit_entry>

Examples: Valid Operations
  | user_type | environment | action        | data                 | expected_result | audit_entry    |
  | admin     | production  | create_user   | {"role":"standard"}  | success         | user_created   |
  | standard  | staging     | update_profile| {"name":"John Doe"}  | success         | profile_updated|

Examples: Invalid Operations
  | user_type | environment | action      | data               | expected_result | audit_entry     |
  | guest     | production  | delete_user | {"id":"12345"}     | unauthorized    | access_denied   |
  | standard  | staging     | create_admin| {"role":"admin"}   | forbidden       | privilege_denied|
```

### Advanced Data Tables
```gherkin
Given the following complex product configuration:
  | category | product     | variants                          | pricing                    | availability          |
  | clothing | t-shirt     | size:S,M,L,XL;color:red,blue     | base:19.99;bulk:15.99     | in_stock:100          |
  | clothing | jeans       | size:28,30,32,34;wash:light,dark | base:49.99;sale:39.99     | limited:25            |
  | tech     | smartphone  | storage:64GB,128GB,256GB         | base:699;premium:899      | pre_order:2024-12-01  |
```

## Common Patterns and Anti-Patterns

### ✅ Good Practices
- Use Background for genuine shared setup only
- Keep Scenario Outlines focused on single concepts
- Structure data tables for readability and maintainability
- Apply tags consistently across feature hierarchies
- Design workflows that reflect real user journeys

### ❌ Anti-Patterns to Avoid
- Overusing Background for unrelated setup
- Creating overly complex Examples tables
- Mixing different data types without clear structure
- Using tags inconsistently or without clear strategy
- Creating workflows that are too long or unfocused

## Integration Points

These examples demonstrate integration with:

- **Playwright**: For web application automation
- **API Testing**: Using axios or fetch for HTTP requests
- **Database**: Working with test databases and data cleanup
- **CI/CD**: Integration with GitHub Actions and other CI systems
- **Reporting**: Advanced HTML and JSON report generation
- **Monitoring**: Real-time test execution monitoring

## Troubleshooting Guide

### Common Issues and Solutions

**Background Not Executing**: Check that Background is properly placed before scenarios and not conflicting with hooks.

**Data Table Parsing Errors**: Verify data table formatting and ensure step definitions handle the expected data structure.

**Tag Execution Problems**: Confirm tag expressions are correctly formatted and tags are applied consistently.

**Complex Workflow Failures**: Break down long scenarios into smaller, testable components for easier debugging.

**Performance Issues**: Review Background optimization, data setup efficiency, and parallel execution configuration.

## Additional Resources

- [Cucumber.js Advanced Features Documentation](https://cucumber.io/docs/cucumber/)
- [Gherkin Reference Guide](https://cucumber.io/docs/gherkin/)
- [BDD Best Practices for Complex Scenarios](https://cucumber.io/blog/)
- [Data-Driven Testing Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)

## Next Steps

After completing these examples:
1. Practice implementing similar patterns in your own projects
2. Experiment with different data structures and transformations
3. Develop your own tagging strategies based on your team's needs
4. Move on to the [exercises](../exercises/) to reinforce your learning
5. Consider how these patterns apply to your specific domain and requirements

Remember: Advanced Gherkin should make complex scenarios clearer, not more complicated. Always prioritize readability and business value.