# Exercise 01: Basic Data Factory Implementation

## 📋 Problem Statement

You are tasked with implementing a foundational test data management system for an e-commerce platform. The system needs to support basic data factory patterns, proper lifecycle management, and cleanup strategies to ensure reliable and maintainable BDD tests.

**Business Context**: Your e-commerce platform needs to test user registration, product catalog management, and order processing workflows. Each test requires clean, consistent data that can be created, used, and cleaned up efficiently without affecting other tests.

## 🎯 Learning Objectives

By completing this exercise, you will:

1. **Master Basic Data Factory Patterns**: Implement factory classes for creating test entities with sensible defaults
2. **Understand Data Lifecycle Management**: Design proper setup, execution, and teardown procedures
3. **Implement Cleanup Strategies**: Ensure tests leave no trace and don't interfere with each other
4. **Apply Data Seeding Techniques**: Pre-populate databases with necessary reference data
5. **Handle Data Dependencies**: Manage relationships between different entity types
6. **Practice Error Handling**: Implement robust error handling for data operations

## 📚 Prerequisites

### Required Knowledge
- Basic TypeScript/JavaScript understanding
- Familiarity with Cucumber.js and Gherkin syntax
- Understanding of database concepts (tables, relationships, transactions)
- Basic knowledge of testing principles (setup, execution, teardown)

### Required Setup
```bash
# Create exercise directory
mkdir 01-basic-data-factory-implementation
cd 01-basic-data-factory-implementation

# Initialize the project
npm init -y

# Install core dependencies
npm install @cucumber/cucumber @playwright/test
npm install uuid sqlite3 @faker-js/faker
npm install --save-dev typescript @types/node @types/uuid ts-node

# Create directory structure
mkdir -p features step-definitions support/factories support/database test-data
```

### Database Schema
Create the following SQLite database schema:

```sql
-- schema.sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 🔧 Implementation Tasks

### Task 1: Database Connection Manager

Create a database connection manager with proper connection handling and transaction support.

**File**: `support/database/connection-manager.ts`

```typescript
import { Database } from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export class DatabaseConnectionManager {
  private db: Database | null = null;
  private dbPath: string;

  constructor(dbPath: string = './test-data/exercise.db') {
    this.dbPath = dbPath;
  }

  async connect(): Promise<void> {
    // TODO: Implement database connection
    // - Create database file if it doesn't exist
    // - Open connection to SQLite database
    // - Set up connection options (foreign keys, etc.)
  }

  async initializeSchema(): Promise<void> {
    // TODO: Initialize database schema
    // - Read schema.sql file
    // - Execute schema creation statements
    // - Handle errors appropriately
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    // TODO: Execute database query
    // - Prepare and execute query with parameters
    // - Return results for SELECT queries
    // - Return metadata for INSERT/UPDATE/DELETE
    // - Handle SQL errors appropriately
  }

  async beginTransaction(): Promise<void> {
    // TODO: Begin database transaction
  }

  async commitTransaction(): Promise<void> {
    // TODO: Commit database transaction
  }

  async rollbackTransaction(): Promise<void> {
    // TODO: Rollback database transaction
  }

  async cleanup(): Promise<void> {
    // TODO: Clean up database
    // - Close database connection
    // - Optionally remove test database file
  }

  getConnection(): Database {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }
}
```

### Task 2: Base Factory Class

Create a base factory class that provides common functionality for all entity factories.

**File**: `support/factories/base-factory.ts`

```typescript
import { v4 as uuidv4 } from 'uuid';
import { DatabaseConnectionManager } from '../database/connection-manager';

export interface FactoryOptions {
  overrides?: Record<string, any>;
  persist?: boolean;
  count?: number;
}

export abstract class BaseFactory<T> {
  protected dbManager: DatabaseConnectionManager;
  protected createdEntities: T[] = [];

  constructor(dbManager: DatabaseConnectionManager) {
    this.dbManager = dbManager;
  }

  abstract build(options?: FactoryOptions): Promise<T>;
  abstract create(options?: FactoryOptions): Promise<T>;
  abstract getDefaults(): Partial<T>;
  abstract getTableName(): string;

  protected generateUuid(): string {
    return uuidv4();
  }

  protected mergeWithDefaults(overrides: Record<string, any> = {}): Partial<T> {
    // TODO: Merge factory defaults with provided overrides
    // - Get default values from getDefaults()
    // - Override with provided values
    // - Return merged object
  }

  protected async persistEntity(entity: Partial<T>): Promise<T> {
    // TODO: Persist entity to database
    // - Build INSERT query for the entity
    // - Execute query with entity data
    // - Return entity with generated ID
    // - Track created entity for cleanup
  }

  async createMultiple(count: number, options?: Omit<FactoryOptions, 'count'>): Promise<T[]> {
    // TODO: Create multiple entities
    // - Loop through count and create entities
    // - Return array of created entities
  }

  async cleanup(): Promise<void> {
    // TODO: Clean up created entities
    // - Delete all entities created by this factory
    // - Clear the createdEntities array
    // - Handle foreign key constraints properly
  }
}
```

### Task 3: User Factory Implementation

Implement a concrete factory for creating user entities.

**File**: `support/factories/user-factory.ts`

```typescript
import { faker } from '@faker-js/faker';
import { BaseFactory, FactoryOptions } from './base-factory';

export interface User {
  id?: number;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export class UserFactory extends BaseFactory<User> {
  getDefaults(): Partial<User> {
    // TODO: Return default user attributes
    // - Generate realistic fake data using Faker.js
    // - Ensure uniqueness for username and email
    // - Set appropriate default status
    // - Generate UUID
  }

  getTableName(): string {
    return 'users';
  }

  async build(options?: FactoryOptions): Promise<User> {
    // TODO: Build user object without persisting
    // - Merge defaults with overrides
    // - Return user object
  }

  async create(options?: FactoryOptions): Promise<User> {
    // TODO: Create and persist user
    // - Build user object
    // - Persist to database if persist option is true (default)
    // - Return persisted user with ID
  }

  async createWithStatus(status: User['status'], options?: FactoryOptions): Promise<User> {
    // TODO: Create user with specific status
    // - Override status in options
    // - Call create method
  }

  async createInactive(options?: FactoryOptions): Promise<User> {
    return this.createWithStatus('inactive', options);
  }

  async createSuspended(options?: FactoryOptions): Promise<User> {
    return this.createWithStatus('suspended', options);
  }
}
```

### Task 4: Product and Category Factories

Implement factories for categories and products with proper relationships.

**File**: `support/factories/category-factory.ts`

```typescript
import { faker } from '@faker-js/faker';
import { BaseFactory, FactoryOptions } from './base-factory';

export interface Category {
  id?: number;
  uuid: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export class CategoryFactory extends BaseFactory<Category> {
  getDefaults(): Partial<Category> {
    // TODO: Implement category defaults
    // - Generate category name (e.g., Electronics, Clothing, Books)
    // - Generate appropriate description
    // - Set default status as active
  }

  getTableName(): string {
    return 'categories';
  }

  async build(options?: FactoryOptions): Promise<Category> {
    // TODO: Build category without persisting
  }

  async create(options?: FactoryOptions): Promise<Category> {
    // TODO: Create and persist category
  }
}
```

**File**: `support/factories/product-factory.ts`

```typescript
import { faker } from '@faker-js/faker';
import { BaseFactory, FactoryOptions } from './base-factory';
import { Category, CategoryFactory } from './category-factory';

export interface Product {
  id?: number;
  uuid: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category_id?: number;
  status: 'active' | 'inactive' | 'discontinued';
  created_at?: string;
}

export class ProductFactory extends BaseFactory<Product> {
  private categoryFactory: CategoryFactory;

  constructor(dbManager: any) {
    super(dbManager);
    this.categoryFactory = new CategoryFactory(dbManager);
  }

  getDefaults(): Partial<Product> {
    // TODO: Implement product defaults
    // - Generate product name and description
    // - Set realistic price (between $1-$1000)
    // - Set stock quantity (0-100)
    // - Set default status as active
  }

  getTableName(): string {
    return 'products';
  }

  async build(options?: FactoryOptions): Promise<Product> {
    // TODO: Build product without persisting
  }

  async create(options?: FactoryOptions): Promise<Product> {
    // TODO: Create and persist product
  }

  async createWithCategory(category?: Category, options?: FactoryOptions): Promise<Product> {
    // TODO: Create product with specific category
    // - Create category if not provided
    // - Set category_id in product
    // - Create and return product
  }

  async createOutOfStock(options?: FactoryOptions): Promise<Product> {
    // TODO: Create product with zero stock
  }

  async createDiscontinued(options?: FactoryOptions): Promise<Product> {
    // TODO: Create discontinued product
  }
}
```

### Task 5: Order Factory with Complex Relationships

Implement order factory that handles complex relationships with users and products.

**File**: `support/factories/order-factory.ts`

```typescript
import { faker } from '@faker-js/faker';
import { BaseFactory, FactoryOptions } from './base-factory';
import { User, UserFactory } from './user-factory';
import { Product, ProductFactory } from './product-factory';

export interface Order {
  id?: number;
  uuid: string;
  user_id: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface OrderWithItems extends Order {
  items?: OrderItem[];
  user?: User;
}

export class OrderFactory extends BaseFactory<Order> {
  private userFactory: UserFactory;
  private productFactory: ProductFactory;

  constructor(dbManager: any) {
    super(dbManager);
    this.userFactory = new UserFactory(dbManager);
    this.productFactory = new ProductFactory(dbManager);
  }

  getDefaults(): Partial<Order> {
    // TODO: Implement order defaults
    // - Generate UUID
    // - Set default status as pending
    // - Calculate total amount (will be updated when items are added)
  }

  getTableName(): string {
    return 'orders';
  }

  async build(options?: FactoryOptions): Promise<Order> {
    // TODO: Build order without persisting
  }

  async create(options?: FactoryOptions): Promise<Order> {
    // TODO: Create and persist order
  }

  async createWithUser(user?: User, options?: FactoryOptions): Promise<Order> {
    // TODO: Create order for specific user
    // - Create user if not provided
    // - Set user_id in order
    // - Create and return order
  }

  async createWithItems(itemsData?: Array<{product?: Product, quantity?: number}>, options?: FactoryOptions): Promise<OrderWithItems> {
    // TODO: Create order with items
    // - Create order
    // - Create products if not provided
    // - Create order items
    // - Calculate and update total amount
    // - Return order with items
  }

  async addItemToOrder(order: Order, product: Product, quantity: number = 1): Promise<OrderItem> {
    // TODO: Add item to existing order
    // - Create order item record
    // - Update order total amount
    // - Return created order item
  }

  private async createOrderItem(orderId: number, productId: number, quantity: number, unitPrice: number): Promise<OrderItem> {
    // TODO: Create order item in database
  }

  private async updateOrderTotal(orderId: number): Promise<void> {
    // TODO: Recalculate and update order total
    // - Sum all order items
    // - Update order total_amount
  }
}
```

### Task 6: Data Manager Integration

Create a central data manager that coordinates all factories and provides cleanup functionality.

**File**: `support/data-manager.ts`

```typescript
import { DatabaseConnectionManager } from './database/connection-manager';
import { UserFactory } from './factories/user-factory';
import { CategoryFactory } from './factories/category-factory';
import { ProductFactory } from './factories/product-factory';
import { OrderFactory } from './factories/order-factory';

export class DataManager {
  private dbManager: DatabaseConnectionManager;
  public users: UserFactory;
  public categories: CategoryFactory;
  public products: ProductFactory;
  public orders: OrderFactory;

  constructor(dbPath?: string) {
    this.dbManager = new DatabaseConnectionManager(dbPath);
    this.users = new UserFactory(this.dbManager);
    this.categories = new CategoryFactory(this.dbManager);
    this.products = new ProductFactory(this.dbManager);
    this.orders = new OrderFactory(this.dbManager);
  }

  async initialize(): Promise<void> {
    // TODO: Initialize data manager
    // - Connect to database
    // - Initialize schema
    // - Set up any required seed data
  }

  async cleanupAll(): Promise<void> {
    // TODO: Clean up all test data
    // - Clean up in reverse dependency order (orders, products, categories, users)
    // - Handle foreign key constraints
    // - Reset any sequences/auto-increment values
  }

  async beginTransaction(): Promise<void> {
    await this.dbManager.beginTransaction();
  }

  async commitTransaction(): Promise<void> {
    await this.dbManager.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    await this.dbManager.rollbackTransaction();
  }

  getDbManager(): DatabaseConnectionManager {
    return this.dbManager;
  }

  async shutdown(): Promise<void> {
    // TODO: Shutdown data manager
    // - Clean up all data
    // - Close database connections
    // - Remove test database file if needed
  }
}
```

### Task 7: Cucumber Feature Implementation

Create comprehensive feature files to test your implementation.

**File**: `features/basic-data-factory.feature`

```gherkin
@basic-data-factory @data-management
Feature: Basic Data Factory Implementation
  As a test automation engineer
  I want to use data factories to create test data
  So that I can write reliable and maintainable BDD tests

Background: Database Setup
  Given the test database is initialized
  And all factories are configured

@user-factory @data-creation
Scenario: Creating users with factory defaults
  When I create 3 users using the user factory
  Then 3 users should be created in the database
  And each user should have:
    | field | validation |
    | uuid | unique_not_null |
    | username | unique_not_null |
    | email | valid_email_format |
    | first_name | not_empty |
    | last_name | not_empty |
    | status | default_active |
    | created_at | valid_timestamp |

@user-factory @data-customization
Scenario: Creating users with custom attributes
  When I create a user with the following attributes:
    | field | value |
    | username | testuser123 |
    | email | test@example.com |
    | first_name | John |
    | last_name | Doe |
    | status | inactive |
  Then the user should be created with the specified attributes
  And the user should have a unique UUID and timestamp

@category-product-relationship @data-relationships
Scenario: Creating products with category relationships
  Given I have created a category "Electronics"
  When I create 5 products in the "Electronics" category
  Then 5 products should be created
  And all products should be linked to the "Electronics" category
  And each product should have:
    | field | validation |
    | name | not_empty |
    | price | positive_number |
    | stock_quantity | non_negative_integer |
    | category_id | valid_category_reference |

@order-complex-relationships @data-dependencies
Scenario: Creating orders with multiple relationships
  Given I have created a user "john@example.com"
  And I have created 3 products with stock
  When I create an order for the user with the following items:
    | product_index | quantity |
    | 1 | 2 |
    | 2 | 1 |
    | 3 | 3 |
  Then the order should be created successfully
  And the order should contain 3 order items
  And the total amount should equal the sum of (quantity × unit_price) for all items
  And the order should be linked to the correct user

@data-cleanup @test-isolation
Scenario: Cleaning up test data after tests
  Given I have created the following test data:
    | entity | count |
    | users | 5 |
    | categories | 3 |
    | products | 10 |
    | orders | 7 |
  When I execute the cleanup procedure
  Then all test data should be removed from the database
  And the database should be in a clean state
  And no orphaned records should remain

@error-handling @data-validation
Scenario: Handling data creation errors gracefully
  Given the user factory is configured
  When I attempt to create a user with an invalid email format:
    | field | value |
    | email | invalid-email |
  Then the factory should raise a validation error
  And no user should be created in the database
  And the error message should indicate the validation issue

@performance-testing @bulk-operations
Scenario: Creating large datasets efficiently
  When I create 100 users using bulk operations
  And I create 50 categories using bulk operations
  And I create 500 products using bulk operations
  Then the operations should complete within acceptable time limits:
    | operation | max_time_seconds |
    | 100_users | 5 |
    | 50_categories | 2 |
    | 500_products | 10 |
  And all entities should be properly persisted
  And data integrity should be maintained
```

### Task 8: Step Definitions Implementation

Implement comprehensive step definitions for your feature file.

**File**: `step-definitions/basic-data-factory.steps.ts`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { DataManager } from '../support/data-manager';

// TODO: Implement all step definitions
// Reference the examples in the lesson for implementation patterns

// Background Steps
Given('the test database is initialized', async function() {
  // TODO: Initialize DataManager and database
});

Given('all factories are configured', async function() {
  // TODO: Verify factories are properly configured
});

// User Factory Steps
When('I create {int} users using the user factory', async function(count: number) {
  // TODO: Create specified number of users
});

Then('{int} users should be created in the database', async function(count: number) {
  // TODO: Verify user count in database
});

// Add all other step definitions following this pattern...
```

## ✅ Acceptance Criteria

Your implementation must meet the following criteria:

### Functional Requirements
- [ ] All factory classes inherit from BaseFactory and implement required methods
- [ ] Database connection manager handles connections, transactions, and cleanup properly
- [ ] User factory creates users with realistic, unique data
- [ ] Category and product factories handle relationships correctly
- [ ] Order factory manages complex multi-entity relationships
- [ ] All feature scenarios pass successfully
- [ ] Proper error handling for invalid data and database errors

### Quality Requirements
- [ ] Code is well-structured with clear separation of concerns
- [ ] All public methods have comprehensive JSDoc documentation
- [ ] TypeScript strict mode compliance with proper typing
- [ ] Comprehensive error handling with descriptive messages
- [ ] Resource cleanup prevents test interference
- [ ] Performance requirements met for bulk operations

### Testing Requirements
- [ ] All scenarios cover both positive and negative cases
- [ ] Data validation ensures integrity and uniqueness
- [ ] Cleanup procedures verified to prevent test pollution
- [ ] Performance benchmarks documented and met
- [ ] Error scenarios properly tested and handled

## 🧪 Testing Instructions

### Running the Tests

```bash
# Run all scenarios
npx cucumber-js

# Run specific scenarios
npx cucumber-js --name "Creating users with factory defaults"

# Run with specific tags
npx cucumber-js --tags "@user-factory"
npx cucumber-js --tags "@data-cleanup"

# Run with verbose output
npx cucumber-js --format progress-bar
```

### Expected Output

```
Feature: Basic Data Factory Implementation

  ✓ Creating users with factory defaults
  ✓ Creating users with custom attributes
  ✓ Creating products with category relationships
  ✓ Creating orders with multiple relationships
  ✓ Cleaning up test data after tests
  ✓ Handling data creation errors gracefully
  ✓ Creating large datasets efficiently

7 scenarios (7 passed)
21 steps (21 passed)

Performance Metrics:
- User creation: 0.05s per user
- Product creation: 0.03s per product
- Order creation: 0.12s per order (with items)
- Bulk operations: 0.001s per entity
```

### Manual Verification

```bash
# Check database contents
sqlite3 test-data/exercise.db ".tables"
sqlite3 test-data/exercise.db "SELECT COUNT(*) FROM users;"

# Verify cleanup
sqlite3 test-data/exercise.db "SELECT * FROM users LIMIT 5;"
```

## 💡 Extension Challenges

Once you complete the basic requirements, try these advanced challenges:

### Challenge 1: Advanced Factory Features
- Implement factory traits (mixins) for common behaviors
- Add factory callbacks (before_create, after_create)
- Implement factory inheritance for specialized entities

### Challenge 2: Data Relationships
- Add support for polymorphic associations
- Implement cascade deletion strategies
- Add foreign key constraint validation

### Challenge 3: Performance Optimization
- Implement connection pooling
- Add bulk insert optimizations
- Create database indexing strategies

### Challenge 4: Advanced Cleanup
- Implement selective cleanup (by tags or patterns)
- Add cleanup verification and reporting
- Create rollback strategies for failed operations

## 🔍 Review Checklist

Before submitting your implementation, verify:

### Code Quality
- [ ] All TypeScript code compiles without errors or warnings
- [ ] ESLint passes with no violations
- [ ] All methods have proper JSDoc documentation
- [ ] Code follows established naming conventions
- [ ] Error handling is comprehensive and meaningful

### Functionality
- [ ] All factories create valid, realistic test data
- [ ] Database relationships are properly maintained
- [ ] Cleanup procedures remove all test data
- [ ] Error scenarios are handled gracefully
- [ ] Performance requirements are met

### Testing
- [ ] All Cucumber scenarios pass consistently
- [ ] Test data doesn't interfere between scenarios
- [ ] Both positive and negative cases are covered
- [ ] Performance benchmarks are documented
- [ ] Manual verification steps work correctly

### Documentation
- [ ] README includes clear setup instructions
- [ ] Code is self-documenting with clear comments
- [ ] Architecture decisions are documented
- [ ] Performance benchmarks are recorded
- [ ] Troubleshooting guide is comprehensive

## Next Steps

After completing this exercise:

1. **Review Implementation** - Conduct a thorough code review
2. **Performance Testing** - Benchmark your implementation with larger datasets
3. **Documentation** - Create comprehensive usage documentation
4. **Proceed to Exercise 02** - Begin implementing dynamic data generation patterns

Congratulations on building your first comprehensive data factory system! This foundation will serve you well as you tackle more advanced data management challenges.