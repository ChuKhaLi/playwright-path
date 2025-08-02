# Assessment: Passing Data from Feature Files to Step Definitions

## Assessment Overview

This comprehensive assessment evaluates your mastery of data passing techniques in Cucumber, covering all learning objectives from basic parameter extraction to advanced content processing and enterprise-grade integration patterns. The assessment combines theoretical knowledge validation with practical implementation challenges to ensure comprehensive understanding.

### **Assessment Structure**

| Section | Topic | Questions | Points | Time Limit |
|---------|-------|-----------|---------|------------|
| [A](#section-a-theoretical-foundation) | Theoretical Foundation | 15 | 30 | 20 minutes |
| [B](#section-b-practical-implementation) | Practical Implementation | 10 | 40 | 45 minutes |
| [C](#section-c-advanced-scenarios) | Advanced Scenarios | 8 | 30 | 35 minutes |
| **Total** | **All Topics** | **33** | **100** | **100 minutes** |

### **Learning Objectives Assessment Matrix**

| Learning Objective | Assessment Method | Success Criteria |
|-------------------|-------------------|------------------|
| **LO1**: Parameter Extraction | Code implementation + Multiple choice | 80% accuracy |
| **LO2**: Data Table Processing | Practical exercises + Problem solving | 85% functionality |
| **LO3**: Content Processing | Complex scenarios + Code review | 75% completeness |
| **LO4**: Type Safety & Validation | Implementation + Error handling | 90% robustness |
| **LO5**: Error Recovery** | Scenario analysis + Best practices | 80% coverage |
| **LO6**: Integration Patterns | Architecture design + Implementation | 85% quality |

---

## Section A: Theoretical Foundation
**(30 points, 20 minutes)**

### **A1. Multiple Choice Questions (20 points)**

**Question 1** (2 points): Which Cucumber data passing mechanism is most appropriate for handling a single user profile configuration with multiple attributes?

a) String parameters with regex capture groups
b) Horizontal data tables with multiple rows
c) Vertical data tables with key-value pairs
d) Doc strings with JSON content
e) Both c and d are equally appropriate

**Question 2** (2 points): In TypeScript step definitions, what is the correct approach for handling optional parameters?

```typescript
// Given the step: "When I create a user with email {string} and age {int}"
```

a) `When('I create a user with email {string} and age {int}', (email: string, age?: number) => {})`
b) `When('I create a user with email {string} and age {int}', (email: string, age: number | undefined) => {})`
c) `When('I create a user with email {string} and age {int}', (email: string, age: number) => {})`
d) `When('I create a user with email {string} and age {int}', (email?: string, age?: number) => {})`

**Question 3** (2 points): Which data validation approach provides the best balance of robustness and maintainability for enterprise applications?

a) Client-side validation only
b) Step definition validation with hard failures
c) Multi-layered validation with graceful error recovery
d) Database constraint validation only
e) No validation (trust the test data)

**Question 4** (2 points): When processing data tables with `DataTable.hashes()`, what type of data structure is returned?

a) `string[][]` - Array of string arrays
b) `Record<string, string>[]` - Array of string-to-string record objects
c) `Map<string, string>[]` - Array of string maps
d) `Object[]` - Array of generic objects
e) `any[]` - Array of any type

**Question 5** (2 points): For processing complex JSON configurations in doc strings, which parsing approach is most resilient?

a) `JSON.parse()` with no error handling
b) `JSON.parse()` with try-catch and generic error messages
c) `JSON.parse()` with comprehensive error handling and schema validation
d) Manual string parsing without JSON methods
e) Regular expression parsing of JSON content

**Question 6** (2 points): In the context of BDD testing, when should you use doc strings versus data tables?

a) Always use doc strings for structured data
b) Always use data tables for any tabular data
c) Use doc strings for complex content and data tables for structured records
d) Use data tables only for single-row data
e) The choice doesn't impact test readability or maintainability

**Question 7** (2 points): What is the primary advantage of implementing custom parameter types in Cucumber?

a) Improved test execution performance
b) Reduced code duplication and enhanced type safety
c) Better integration with CI/CD pipelines
d) Easier debugging of test failures
e) Automatic test data generation

**Question 8** (2 points): Which approach best handles environment variable substitution in configuration processing?

a) Direct replacement in the original content string
b) Pre-processing replacement before parsing
c) Post-processing replacement after object creation
d) Runtime replacement during test execution
e) Both b and c depending on the use case

**Question 9** (2 points): For error recovery in data processing pipelines, what strategy provides the best user experience?

a) Fail fast on any validation error
b) Log errors and continue with default values
c) Categorized error handling with appropriate recovery strategies
d) Skip validation entirely to avoid errors
e) Manual intervention for all error cases

**Question 10** (2 points): In enterprise integration testing, which pattern best supports data consistency across multiple services?

a) Independent service testing only
b) Mock all external dependencies
c) End-to-end transaction validation with rollback capabilities
d) Eventual consistency acceptance
e) Database-level validation only

### **A2. Short Answer Questions (10 points)**

**Question 11** (3 points): Explain the difference between horizontal and vertical data table processing. Provide one example scenario where each approach would be most appropriate.

*Expected Answer Elements:*
- Horizontal tables process multiple similar records (arrays)
- Vertical tables process single configurations (key-value pairs)
- Example scenarios with justification
- Understanding of data structure implications

**Question 12** (3 points): Describe three different error recovery strategies that can be implemented in data processing pipelines, and explain when each strategy is most appropriate.

*Expected Answer Elements:*
- Three distinct recovery strategies (e.g., auto-correction, default values, graceful degradation)
- Appropriate use cases for each strategy
- Impact on test reliability and maintainability

**Question 13** (4 points): Design a data validation strategy for processing user profile information that includes email, age, preferences, and address data. Your strategy should address type safety, business rules, and error handling.

*Expected Answer Elements:*
- Multi-layered validation approach
- Type safety considerations
- Business rule validation
- Error handling and recovery
- Maintainability and extensibility

---

## Section B: Practical Implementation
**(40 points, 45 minutes)**

### **B1. Parameter Extraction Implementation (15 points)**

**Scenario**: Implement step definitions for a product management system that handles various product attributes with comprehensive validation.

**Task**: Create TypeScript step definitions for the following Gherkin steps:

```gherkin
Given I have a product with name "Premium Headphones" and price $199.99
When I set the product category to "Electronics" with discount 15%
And I configure inventory with minimum stock 10 and maximum stock 500
Then the product should be created with valid configuration
```

**Requirements**:
1. Implement type-safe parameter extraction (5 points)
2. Add comprehensive input validation (5 points)
3. Include proper error handling with descriptive messages (5 points)

**Implementation Template**:
```typescript
// Your implementation here
// Must include proper TypeScript types
// Must include validation logic
// Must include error handling
```

**Evaluation Criteria**:
- ✅ Correct parameter extraction syntax
- ✅ Appropriate TypeScript type annotations
- ✅ Comprehensive input validation
- ✅ Meaningful error messages
- ✅ Code organization and readability

### **B2. Data Table Processing Challenge (15 points)**

**Scenario**: Implement processing for both horizontal and vertical data tables in a user management system.

**Task**: Create step definitions that handle the following data scenarios:

```gherkin
# Horizontal Data Table Scenario
When I register multiple users with the following information:
  | email               | firstName | lastName | age | accountType | active |
  | john.doe@email.com  | John      | Doe      | 28  | Premium     | true   |
  | jane.smith@email.com| Jane      | Smith    | 35  | Standard    | true   |
  | bob.wilson@email.com| Bob       | Wilson   | 42  | Premium     | false  |

# Vertical Data Table Scenario  
When I configure the user profile with the following settings:
  | Field                | Value                    |
  | Email               | admin@company.com         |
  | Role                | Administrator            |
  | Permissions         | read,write,delete,admin  |
  | Department          | IT Security              |
  | Multi-Factor Auth   | Enabled                  |
  | Session Timeout     | 30 minutes               |
```

**Requirements**:
1. Process horizontal data table with validation (8 points)
2. Process vertical data table with type conversion (7 points)

**Implementation Template**:  
```typescript
// Horizontal data table processing
When('I register multiple users with the following information:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    // Your implementation here
  }
);

// Vertical data table processing
When('I configure the user profile with the following settings:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    // Your implementation here
  }
);
```

**Evaluation Criteria**:
- ✅ Correct data table parsing methods
- ✅ Appropriate data structure creation
- ✅ Type conversion and validation
- ✅ Error handling for invalid data
- ✅ Efficient processing algorithms

### **B3. Content Processing Implementation (10 points)**

**Scenario**: Implement doc string processing for configuration management.

**Task**: Create a step definition that processes the following JSON configuration:

```gherkin
When I provide the following service configuration:
  """
  {
    "service": {
      "name": "user-authentication-service",
      "port": 8080,
      "environment": "production"
    },
    "database": {
      "host": "${DB_HOST}",
      "port": 5432,
      "credentials": {
        "username": "${DB_USERNAME}",
        "password": "${DB_PASSWORD}"
      }
    },
    "features": {
      "rate_limiting": true,
      "caching": false,
      "monitoring": true
    }
  }
  """
```

**Requirements**:
1. Parse JSON content with error handling (4 points)
2. Handle environment variable substitution (3 points)
3. Validate configuration schema (3 points)

**Implementation Template**:
```typescript
When('I provide the following service configuration:', 
  async function (this: CustomWorld, configContent: string) {
    // Your implementation here
  }
);
```

**Evaluation Criteria**:
- ✅ Robust JSON parsing with error handling
- ✅ Environment variable processing
- ✅ Schema validation implementation
- ✅ Proper error reporting
- ✅ Clean code structure

---

## Section C: Advanced Scenarios
**(30 points, 35 minutes)**

### **C1. Integration Architecture Design (10 points)**

**Scenario**: Design a comprehensive data processing architecture for a multi-service e-commerce platform.

**Task**: Create an architectural design that addresses the following requirements:

1. **Data Flow Management**: Handle data passing between 5 microservices
2. **Error Recovery**: Implement graceful degradation for service failures  
3. **Performance Optimization**: Support concurrent processing of 1000+ requests
4. **Data Consistency**: Ensure ACID properties across distributed transactions
5. **Monitoring & Observability**: Provide comprehensive logging and metrics

**Deliverables**:
1. Architecture diagram with component relationships (4 points)
2. Data flow specification with error handling (3 points)  
3. Performance optimization strategy (3 points)

**Evaluation Criteria**:
- ✅ Comprehensive system design
- ✅ Proper component interaction modeling
- ✅ Scalability considerations
- ✅ Error handling strategy
- ✅ Performance optimization approach

### **C2. Complex Error Handling Scenario (10 points)**

**Scenario**: Implement advanced error handling for a critical data processing pipeline.

**Task**: Design and implement error handling for the following failure scenarios:

1. **Network Timeouts**: Service unavailability during data processing
2. **Data Corruption**: Invalid or malformed data in processing pipeline
3. **Resource Exhaustion**: Memory or CPU limits exceeded during processing
4. **Business Rule Violations**: Data that violates domain-specific constraints
5. **Security Violations**: Unauthorized access or data breach attempts

**Requirements**:
1. Categorize errors by type and severity (3 points)
2. Implement appropriate recovery strategies (4 points)
3. Design escalation procedures for unrecoverable errors (3 points)

**Implementation Template**:
```typescript
// Error handling framework
class DataProcessingErrorHandler {
  // Your implementation here
}

// Usage in step definitions
When('I process data with potential failures:', 
  async function (this: CustomWorld, dataContent: string) {
    // Your implementation here using the error handler
  }
);
```

**Evaluation Criteria**:
- ✅ Comprehensive error categorization
- ✅ Appropriate recovery strategies
- ✅ Proper escalation procedures
- ✅ Code maintainability
- ✅ Documentation quality

### **C3. Performance Optimization Challenge (10 points)**

**Scenario**: Optimize data processing performance for high-volume scenarios.

**Task**: Implement performance optimizations for processing 10,000 records with the following constraints:

- Maximum processing time: 30 seconds
- Memory usage limit: 512MB
- Concurrent processing allowed
- Error rate must remain below 0.1%
- All data must be validated

**Requirements**:
1. Design efficient data processing algorithms (4 points)
2. Implement concurrent processing with proper synchronization (3 points)
3. Add performance monitoring and metrics collection (3 points)

**Implementation Template**:
```typescript
// Performance optimization framework
class HighVolumeDataProcessor {
  // Your implementation here
}

// Performance metrics collection
class PerformanceMonitor {
  // Your implementation here
}

// Usage in step definitions
When('I process {int} records with performance targets:', 
  async function (this: CustomWorld, recordCount: number, dataTable: DataTable) {
    // Your implementation here
  }
);
```

**Evaluation Criteria**:
- ✅ Efficient algorithm design
- ✅ Proper concurrency implementation
- ✅ Performance monitoring integration
- ✅ Resource management
- ✅ Scalability considerations

---

## Assessment Grading

### **Grading Scale**

| Score Range | Grade | Performance Level | Recommendations |
|-------------|-------|-------------------|-----------------|
| 90-100 | A+ | Exceptional | Ready for advanced topics |
| 85-89  | A  | Excellent | Minor refinements needed |
| 80-84  | A- | Very Good | Review specific weak areas |
| 75-79  | B+ | Good | Additional practice recommended |
| 70-74  | B  | Satisfactory | Review core concepts |
| 65-69  | B- | Needs Improvement | Significant review needed |
| <65    | C  | Unsatisfactory | Repeat lesson content |

### **Detailed Rubric**

#### **Knowledge Demonstration (40%)**
- **Exceptional (36-40 points)**: Demonstrates comprehensive understanding with nuanced insights
- **Proficient (32-35 points)**: Shows solid grasp of concepts with minor gaps
- **Developing (28-31 points)**: Basic understanding with some misconceptions
- **Beginning (0-27 points)**: Limited understanding requiring significant development

#### **Implementation Quality (40%)**
- **Exceptional (36-40 points)**: Production-ready code with excellent practices
- **Proficient (32-35 points)**: Functional code with good practices
- **Developing (28-31 points)**: Working code with improvement opportunities
- **Beginning (0-27 points)**: Non-functional or significantly flawed implementation

#### **Problem-Solving Approach (20%)**
- **Exceptional (18-20 points)**: Creative solutions with comprehensive error handling
- **Proficient (16-17 points)**: Effective solutions with adequate error handling
- **Developing (14-15 points)**: Basic solutions with limited error handling
- **Beginning (0-13 points)**: Ineffective or incomplete problem-solving approach

---

## Remediation Guidelines

### **For Scores Below 75%**

**Immediate Actions**:
1. **Review Core Concepts**: Return to lesson fundamentals
2. **Practice Exercises**: Complete all exercises with detailed solutions
3. **Code Review**: Analyze provided solutions and implementation patterns
4. **Additional Resources**: Study supplementary materials and documentation

**Remediation Plan**:
- **Week 1**: Review theoretical foundations and basic implementations
- **Week 2**: Practice intermediate scenarios with guided solutions
- **Week 3**: Attempt advanced challenges with instructor feedback
- **Week 4**: Retake assessment with focus on improved areas

### **For Scores 75-84%**

**Enhancement Actions**:
1. **Identify Weak Areas**: Focus on specific topics with lower scores
2. **Advanced Practice**: Work through extension challenges
3. **Code Optimization**: Refine implementation quality and efficiency
4. **Best Practices**: Study enterprise patterns and industry standards

### **For Scores 85%+**

**Advancement Opportunities**:
1. **Mentoring**: Help other learners with assessment preparation
2. **Advanced Topics**: Explore next lesson content early
3. **Contribution**: Suggest improvements to assessment content
4. **Leadership**: Lead study groups or technical discussions

---

## Assessment Resources

### **Reference Materials**
- [Lesson 05 Core Content](./README.md)
- [Code Examples Directory](./examples/)
- [Practical Exercises](./exercises/)
- [Visual Learning Aids](./visuals/)
- [Cucumber.js Official Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Code Templates and Utilities**
- Parameter extraction patterns
- Data table processing utilities
- Content parsing frameworks
- Error handling templates
- Performance monitoring tools

### **Assessment Support**
- **Technical Support**: Available during assessment period
- **Clarification Requests**: Submit questions about requirements
- **Extension Requests**: Available for documented accessibility needs
- **Feedback Sessions**: Scheduled after assessment completion

---

## Submission Guidelines

### **Submission Requirements**
1. **Code Files**: All implementation files in TypeScript
2. **Documentation**: Comprehensive README with explanation
3. **Test Results**: Evidence of testing and validation
4. **Performance Metrics**: Where applicable, include performance data
5. **Reflection**: Brief analysis of approach and lessons learned

### **Submission Format**
- **File Structure**: Organized project directory
- **Code Quality**: Properly formatted and commented
- **Documentation**: Clear explanations and justifications
- **Testing**: Include unit tests and validation examples

### **Deadline and Late Policy**
- **Submission Deadline**: As specified by instructor
- **Late Submissions**: Penalty as per course policy
- **Technical Issues**: Report immediately for consideration
- **Resubmission**: Available with instructor approval

---

**Good luck with your assessment!** This comprehensive evaluation will validate your mastery of data passing techniques in Cucumber and prepare you for advanced BDD testing scenarios.

---

**Navigation**: [Return to Lesson 05](./README.md) | **Next Lesson**: [Lesson 06 - Using Cucumber Hooks and Tags](../lesson-06-using-cucumber-hooks-and-tags/README.md)