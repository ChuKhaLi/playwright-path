# Example 01: Basic Data Management Patterns

## Overview

This example demonstrates fundamental test data management patterns that form the foundation of reliable BDD testing. You'll learn how to create clean, isolated test environments with proper data setup and teardown procedures.

## Learning Objectives

By completing this example, you will understand:
- Core principles of test data isolation and cleanup
- Basic data factory patterns for consistent test data creation
- Simple database seeding strategies with referential integrity
- File-based data management for static reference data
- Fundamental data validation and verification techniques

## Implementation

### Feature File: User Management with Basic Data Patterns

```gherkin
@data-management @basic @user-management
Feature: User Management with Basic Data Patterns
  As a test automation engineer
  I want to demonstrate basic data management patterns
  So that I can build reliable and maintainable tests

Background: Clean Test Environment Setup
  Given the test database is clean
  And no residual test data exists
  And reference data is loaded from fixtures
  And data validation rules are active

@data-creation @basic-patterns
Scenario: Basic user creation with data factory
  Given I create a test user using basic factory patterns:
    | field | value | generation_method |
    | username | auto_generated | sequential_pattern |
    | email | auto_generated | unique_email_pattern |
    | firstName | predefined | static_value |
    | lastName | predefined | static_value |
    | role | standard_user | default_value |
  When I save the user to the test database
  Then the user should be successfully created
  And the user data should match the factory specifications
  And the user should have a unique identifier
  And creation timestamp should be automatically set

@data-validation @referential-integrity
Scenario: User profile creation with reference data validation
  Given reference data is loaded from the following sources:
    | data_type | source_file | validation_method |
    | countries | countries.json | schema_validation |
    | states | states.json | referential_check |
    | roles | user_roles.json | business_rule_validation |
  And a test user exists in the system
  When I create a user profile with the following data:
    | field | value | validation_rule |
    | country | United States | must_exist_in_reference |
    | state | California | must_match_country |
    | role | premium_user | must_be_valid_role |
    | age | 25 | must_be_positive_integer |
    | email | test.user@example.com | must_be_unique_and_valid |
  Then the profile should be created successfully
  And all reference data relationships should be valid
  And business rules should be enforced
  And audit trail should capture the creation

@data-cleanup @isolation
Scenario: Test data cleanup and isolation verification
  Given multiple test users have been created:
    | user_sequence | username_pattern | email_pattern |
    | 1 | testuser_001 | test001@example.com |
    | 2 | testuser_002 | test002@example.com |
    | 3 | testuser_003 | test003@example.com |
  And user profiles have been associated with each user
  And some users have been assigned to groups
  When test cleanup is performed
  Then all test-created users should be removed
  And all associated profiles should be deleted
  And group memberships should be cleaned up
  And no orphaned data should remain
  And database constraints should be maintained
```

### Step Definitions

```typescript
// basic-data-management.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BasicUserFactory } from '../support/factories/basic-user-factory';
import { DatabaseManager } from '../support/database/database-manager';
import { ReferenceDataLoader } from '../support/data/reference-data-loader';
import { DataValidator } from '../support/validation/data-validator';

// Background Steps
Given('the test database is clean', async function() {
  await DatabaseManager.clearTestData();
  this.cleanupTracker = new Set<string>();
});

Given('no residual test data exists', async function() {
  const residualData = await DatabaseManager.findResidualTestData();
  expect(residualData.length).toBe(0);
});

Given('reference data is loaded from fixtures', async function() {
  this.referenceDataLoader = new ReferenceDataLoader();
  await this.referenceDataLoader.loadFixtures();
});

Given('data validation rules are active', async function() {
  this.dataValidator = new DataValidator();
  await this.dataValidator.initialize();
});

// Data Creation Steps
Given('I create a test user using basic factory patterns:', async function(dataTable) {
  const userSpecs = dataTable.hashes()[0];
  
  this.testUserFactory = new BasicUserFactory();
  this.testUser = this.testUserFactory.createUser({
    usernamePattern: userSpecs.generation_method === 'sequential_pattern' ? 'sequential' : 'random',
    emailPattern: userSpecs.generation_method === 'unique_email_pattern' ? 'unique' : 'standard',
    firstName: userSpecs.firstName === 'predefined' ? 'Test' : null,
    lastName: userSpecs.lastName === 'predefined' ? 'User' : null,
    role: userSpecs.role || 'standard_user'
  });
  
  // Validate generated data
  const validationResult = await this.dataValidator.validateUser(this.testUser);
  expect(validationResult.isValid).toBe(true);
});

When('I save the user to the test database', async function() {
  this.savedUser = await DatabaseManager.saveUser(this.testUser);
  this.cleanupTracker.add(`user:${this.savedUser.id}`);
});

Then('the user should be successfully created', async function() {
  expect(this.savedUser).toBeDefined();
  expect(this.savedUser.id).toBeDefined();
  
  // Verify user exists in database
  const dbUser = await DatabaseManager.findUserById(this.savedUser.id);
  expect(dbUser).toBeDefined();
});

Then('the user data should match the factory specifications', async function() {
  expect(this.savedUser.username).toMatch(/^testuser_\d+$/);
  expect(this.savedUser.email).toMatch(/^test\d+@example\.com$/);
  expect(this.savedUser.firstName).toBe('Test');
  expect(this.savedUser.lastName).toBe('User');
  expect(this.savedUser.role).toBe('standard_user');
});
```

### Supporting Infrastructure

#### Basic User Factory

```typescript
// support/factories/basic-user-factory.ts
export class BasicUserFactory {
  private static sequenceCounter = 1;
  
  createUser(options: UserCreationOptions = {}): TestUser {
    const sequence = BasicUserFactory.sequenceCounter++;
    
    return {
      id: this.generateId(),
      username: options.username || this.generateUsername(sequence),
      email: options.email || this.generateEmail(sequence),
      firstName: options.firstName || 'Test',
      lastName: options.lastName || 'User',
      role: options.role || 'standard_user',
      createdAt: new Date().toISOString(),
      isTestData: true
    };
  }
  
  createMultipleUsers(count: number, options: UserCreationOptions = {}): TestUser[] {
    return Array.from({ length: count }, () => this.createUser(options));
  }
  
  private generateId(): string {
    return `TEST_USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateUsername(sequence: number): string {
    return `testuser_${sequence.toString().padStart(3, '0')}`;
  }
  
  private generateEmail(sequence: number): string {
    return `test${sequence.toString().padStart(3, '0')}@example.com`;
  }
}

export interface UserCreationOptions {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface TestUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  isTestData: boolean;
}
```

#### Database Manager

```typescript
// support/database/database-manager.ts
import { Pool } from 'pg';

export class DatabaseManager {
  private static pool: Pool;
  private static testDataTracker = new Set<string>();
  
  static async initialize(): Promise<void> {
    this.pool = new Pool({
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT || '5432'),
      database: process.env.TEST_DB_NAME || 'test_db',
      user: process.env.TEST_DB_USER || 'test_user',
      password: process.env.TEST_DB_PASS || 'test_pass'
    });
  }
  
  static async clearTestData(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      // Delete in correct order to maintain referential integrity
      await client.query('DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM users WHERE is_test_data = true)');
      await client.query('DELETE FROM user_group_memberships WHERE user_id IN (SELECT id FROM users WHERE is_test_data = true)');
      await client.query('DELETE FROM users WHERE is_test_data = true');
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async saveUser(user: TestUser): Promise<TestUser> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO users (id, username, email, first_name, last_name, role, created_at, is_test_data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const values = [
        user.id,
        user.username,
        user.email,
        user.firstName,
        user.lastName,
        user.role,
        user.createdAt,
        user.isTestData
      ];
      
      const result = await client.query(query, values);
      const savedUser = result.rows[0];
      
      this.testDataTracker.add(`user:${savedUser.id}`);
      return savedUser;
    } finally {
      client.release();
    }
  }
  
  static async findUserById(id: string): Promise<TestUser | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}
```

## Key Learning Points

### 1. Data Isolation Strategies
- Use unique identifiers for test data to avoid conflicts
- Implement proper cleanup mechanisms to prevent data pollution
- Track created data for reliable teardown procedures

### 2. Factory Patterns
- Create consistent test data with controlled variation
- Use sequence numbers to ensure uniqueness
- Provide sensible defaults while allowing customization

### 3. Reference Data Management
- Load reference data before test execution
- Validate data integrity and relationships
- Support multiple file formats (JSON, CSV, etc.)

### 4. Database Integration
- Use transactions for atomic operations
- Maintain referential integrity during cleanup
- Implement proper error handling and rollback procedures

### 5. Validation Framework
- Apply consistent validation rules across all test data
- Provide clear error messages for validation failures
- Support different validation strategies based on context

## Execution Examples

### Running the Tests

```bash
# Run basic data management tests
npm run test -- --grep "Basic Data Management"

# Run with specific tags
npm run test -- --tags "@data-creation"
npm run test -- --tags "@data-cleanup"

# Run with detailed logging
npm run test -- --grep "Basic Data Management" --verbose
```

### Expected Output

```
Feature: User Management with Basic Data Patterns

  ✓ Basic user creation with data factory
  ✓ User profile creation with reference data validation  
  ✓ Test data cleanup and isolation verification

3 scenarios (3 passed)
9 steps (9 passed)
```

## Next Steps

This example establishes the foundation for test data management. In the next example, we'll explore more sophisticated data generation patterns using dynamic factories and realistic data creation strategies.

The patterns shown here should be adapted to your specific domain and requirements, but the core principles of isolation, validation, and proper cleanup remain consistent across all BDD implementations.