# Lesson 10 Examples: Managing Test Data in BDD

## Overview

This directory contains four progressive examples demonstrating comprehensive test data management strategies for BDD scenarios. Each example builds upon the previous one, introducing increasingly sophisticated data management patterns and techniques.

## Example Structure

### [Example 01: Basic Data Management Patterns](./01-basic-data-management-patterns.md)
**Focus**: Fundamental test data creation, cleanup, and isolation strategies
**Key Concepts**: 
- Simple data factories and builders
- Basic database seeding patterns
- Test data isolation techniques
- Clean environment setup and teardown
- Static data management with JSON/CSV files

**Learning Outcomes**:
- Understand core principles of test data management
- Implement basic data generation and cleanup patterns
- Create reliable test data isolation strategies
- Apply fundamental data validation techniques

### [Example 02: Dynamic Data Generation and Factories](./02-dynamic-data-generation-and-factories.md)
**Focus**: Advanced data generation using factories, builders, and realistic data patterns
**Key Concepts**:
- Sophisticated data factories with inheritance
- Dynamic data generation with Faker.js integration
- Template-based data creation patterns
- Relationship management between entities
- Data variation and randomization strategies

**Learning Outcomes**:
- Master advanced data factory patterns
- Implement realistic data generation strategies
- Handle complex data relationships and dependencies
- Create maintainable and scalable data generation systems

### [Example 03: Database Integration and State Management](./03-database-integration-and-state-management.md)
**Focus**: Complex database interactions, transaction management, and state persistence
**Key Concepts**:
- Database transaction management and rollback patterns
- Advanced seeding strategies with referential integrity
- State management across test scenarios
- Data migration and versioning patterns
- Performance optimization for large datasets

**Learning Outcomes**:
- Implement sophisticated database integration patterns
- Master transaction management and rollback strategies
- Handle complex state management across scenarios
- Optimize database performance for test execution

### [Example 04: External Data Sources and Validation](./04-external-data-sources-and-validation.md)
**Focus**: Integration with external data sources, comprehensive validation, and data quality assurance
**Key Concepts**:
- External data source integration (APIs, files, databases)
- Advanced data validation and schema enforcement
- Data quality monitoring and reporting
- Cross-system data consistency verification
- Real-time data synchronization patterns

**Learning Outcomes**:
- Integrate multiple external data sources effectively
- Implement comprehensive data validation frameworks
- Ensure data quality and consistency across systems
- Handle real-time data synchronization challenges

## Getting Started

### Prerequisites

Before running these examples, ensure you have:

```bash
# Install required dependencies
npm install @faker-js/faker ajv csv-parser xlsx
npm install --save-dev @types/faker

# Database setup (using PostgreSQL example)
npm install pg @types/pg
# or for SQLite
npm install sqlite3 @types/sqlite3

# Additional data utilities
npm install lodash date-fns uuid
npm install --save-dev @types/lodash @types/uuid
```

### Database Setup

```sql
-- Create test database schema
CREATE SCHEMA IF NOT EXISTS test_data_management;

-- Create test tables
CREATE TABLE test_data_management.users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_data_management.orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES test_data_management.users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_data_management.order_items (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES test_data_management.orders(id),
    product_sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Configuration

```typescript
// test-data-config.ts
export const testDataConfig = {
  database: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    database: process.env.TEST_DB_NAME || 'test_automation',
    username: process.env.TEST_DB_USER || 'test_user',
    password: process.env.TEST_DB_PASS || 'test_password',
    schema: 'test_data_management'
  },
  
  dataGeneration: {
    locale: 'en',
    seed: 12345, // For reproducible random data
    defaultCounts: {
      users: 10,
      orders: 50,
      orderItems: 200
    }
  },
  
  files: {
    dataDirectory: './test-data',
    schemas: './test-data/schemas',
    fixtures: './test-data/fixtures'
  }
};
```

## Common Utilities

### Base Data Manager

```typescript
// base-data-manager.ts
export abstract class BaseDataManager {
  protected abstract tableName: string;
  protected abstract schema: string;

  async createRecord(data: any): Promise<string> {
    const id = this.generateId();
    await this.database.insert(this.getFullTableName(), { id, ...data });
    this.trackCreatedRecord(id);
    return id;
  }

  async cleanup(): Promise<void> {
    const createdIds = this.getTrackedRecords();
    if (createdIds.length > 0) {
      await this.database.delete(this.getFullTableName(), 'id IN (?)', [createdIds]);
    }
    this.clearTrackedRecords();
  }

  protected generateId(): string {
    return `${this.tableName.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected getFullTableName(): string {
    return `${this.schema}.${this.tableName}`;
  }

  protected abstract trackCreatedRecord(id: string): void;
  protected abstract getTrackedRecords(): string[];
  protected abstract clearTrackedRecords(): void;
}
```

### Data Validation Framework

```typescript
// validation-framework.ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export class DataValidationFramework {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
  }

  async validateData(data: any, schemaName: string): Promise<ValidationResult> {
    const schema = await this.loadSchema(schemaName);
    const validate = this.ajv.compile(schema);
    const isValid = validate(data);

    return {
      isValid,
      errors: validate.errors || [],
      data,
      schemaName
    };
  }

  async validateDataSet(dataSet: any[], schemaName: string): Promise<ValidationResult[]> {
    return Promise.all(
      dataSet.map(data => this.validateData(data, schemaName))
    );
  }

  private async loadSchema(schemaName: string): Promise<any> {
    const schemaPath = `${testDataConfig.files.schemas}/${schemaName}.json`;
    return require(schemaPath);
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: any[];
  data: any;
  schemaName: string;
}
```

## Running the Examples

### Execute Individual Examples

```bash
# Run specific example
npm run test -- --grep "Example 01"
npm run test -- --grep "Example 02" 
npm run test -- --grep "Example 03"
npm run test -- --grep "Example 04"

# Run with specific tags
npm run test -- --tags "@data-management"
npm run test -- --tags "@database-integration"
npm run test -- --tags "@external-data"
```

### Run All Examples in Sequence

```bash
# Run complete test data management examples
npm run test:data-management

# Run with detailed logging
npm run test:data-management -- --verbose

# Run with performance monitoring
npm run test:data-management -- --performance
```

## Data Management Patterns

### Pattern 1: Factory with Builder
```typescript
const user = TestDataFactory
  .createUser()
  .withRole('admin')
  .withEmail('specific@email.com')
  .withRandomAttributes()
  .build();
```

### Pattern 2: Seeded Environment
```typescript
await TestEnvironment
  .seed()
  .withUsers(10)
  .withOrders(50)
  .withProducts(100)
  .execute();
```

### Pattern 3: External Integration
```typescript
const customerData = await ExternalDataSource
  .connect('customer-api')
  .fetch({ limit: 100, filter: 'active' })
  .validate()
  .transform();
```

### Pattern 4: State Management
```typescript
await StateManager
  .beginTransaction()
  .createUser(userData)
  .createOrder(orderData)
  .validateConsistency()
  .commit();
```

## Performance Considerations

- **Lazy Loading**: Load data only when needed to reduce startup time
- **Connection Pooling**: Reuse database connections across scenarios
- **Parallel Execution**: Design data management for concurrent test execution
- **Cleanup Optimization**: Batch cleanup operations for efficiency
- **Memory Management**: Clear large datasets from memory after use

## Debugging Tips

- **Data Lineage**: Track data creation and modification for debugging
- **Verbose Logging**: Enable detailed logging for data operations
- **State Inspection**: Implement state inspection utilities
- **Consistency Checks**: Regular validation of data consistency
- **Performance Monitoring**: Track data operation performance

## Next Steps

After completing these examples:
1. Practice implementing data management in real applications
2. Experiment with different data generation strategies
3. Explore advanced database optimization techniques
4. Consider data security and privacy implications
5. Apply patterns to your specific domain requirements

Each example is designed to be self-contained while building upon previous concepts, providing a comprehensive foundation for effective test data management in BDD scenarios.