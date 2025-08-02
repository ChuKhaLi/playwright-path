# Lesson 05: Passing Data from Feature Files to Step Definitions

## Lesson Overview

This lesson focuses on the critical skill of effectively passing data from Gherkin feature files to TypeScript step definitions. You'll master various data transfer techniques, from simple parameters to complex data tables and doc strings, enabling sophisticated test scenarios with rich, maintainable data structures.

### **Learning Objectives**

By the end of this lesson, you will be able to:

**Core Data Transfer Skills:**
- Implement parameter extraction from Gherkin steps using Cucumber expressions
- Create and utilize data tables for structured test data
- Handle multi-line strings (doc strings) for complex content testing
- Build custom parameter types for domain-specific data validation

**Advanced Data Management:**
- Design reusable data transformation patterns
- Implement type-safe data validation and conversion
- Create dynamic test data generation within step definitions
- Handle edge cases and data validation errors gracefully

**Professional Integration:**
- Integrate external data sources (JSON, CSV, databases) with BDD scenarios
- Implement data isolation strategies for parallel test execution
- Create maintainable data fixtures and test data management systems
- Design scalable approaches for large-scale data-driven testing

### **Lesson Structure**

This lesson is organized into progressive sections that build upon each other:

| **Section** | **Duration** | **Focus** | **Outcome** |
|-------------|--------------|-----------|-------------|
| **Introduction** | 15 minutes | Data flow concepts | Understanding of data transfer mechanisms |
| **Core Concepts** | 45 minutes | Basic parameter handling | Solid foundation in parameter extraction |
| **Advanced Techniques** | 60 minutes | Data tables and doc strings | Mastery of complex data structures |
| **Professional Patterns** | 45 minutes | Custom types and validation | Enterprise-ready data handling |
| **Hands-on Practice** | 90 minutes | Comprehensive exercises | Practical implementation skills |

**Total Lesson Time: 4 hours 15 minutes**

### **Prerequisites**

Before starting this lesson, ensure you have completed:

- ✅ **MOD-06 Lesson 01**: Introduction to BDD and Cucumber
- ✅ **MOD-06 Lesson 02**: Setting up Cucumber with TypeScript and Playwright  
- ✅ **MOD-06 Lesson 03**: Writing Feature Files with Gherkin
- ✅ **MOD-06 Lesson 04**: Implementing Step Definitions in TypeScript

**Technical Requirements:**
- Node.js 18+ with TypeScript support
- Cucumber.js 9+ configured with Playwright
- Understanding of TypeScript interfaces and types
- Familiarity with basic step definition patterns

### **Key Topics Covered**

#### **1. Parameter Extraction Fundamentals**
- Cucumber expression syntax and patterns
- String, number, and boolean parameter extraction
- Optional parameters and default values
- Regular expression patterns for complex parsing

#### **2. Data Tables Mastery**
- Raw data table access and manipulation
- Objects array transformation for structured data
- Horizontal and vertical data table patterns
- Dynamic data table processing techniques

#### **3. Doc Strings and Multi-line Content**
- Multi-line string handling for complex content
- JSON and XML content processing within doc strings
- Template processing and variable substitution
- Content validation and transformation patterns

#### **4. Custom Parameter Types**
- Creating domain-specific parameter extractors
- Complex data validation and transformation
- Type-safe parameter handling with TypeScript
- Reusable parameter type libraries

#### **5. External Data Integration**
- JSON file data loading and processing
- CSV data integration for bulk scenarios
- Database connectivity for dynamic test data
- Environment-specific data configuration

### **Learning Resources**

#### **Lesson Components**
- **[`content.md`](./content.md)**: Comprehensive lesson content with detailed explanations
- **[`examples/`](./examples/README.md)**: Four progressive examples demonstrating key concepts
- **[`exercises/`](./exercises/README.md)**: Four hands-on exercises for practical skill development
- **[`visuals/`](./visuals/README.md)**: Visual learning aids and diagrams
- **[`assessment.md`](./assessment.md)**: Comprehensive assessment to validate learning

#### **Example Projects**
Each example builds complexity progressively:
1. **Basic Parameter Handling**: Simple string, number, and boolean extraction
2. **Data Table Processing**: Complex structured data scenarios
3. **Doc String Integration**: Multi-line content and JSON processing
4. **Advanced Data Patterns**: Custom types and external data sources

#### **Practice Exercises**
Hands-on workshops designed for practical skill development:
1. **Parameter Extraction Workshop**: Master basic to advanced parameter patterns
2. **Data Table Mastery Lab**: Comprehensive data table processing
3. **Content Processing Challenge**: Doc strings and complex content handling
4. **Real-world Integration Project**: End-to-end data flow implementation

### **Success Criteria**

#### **Knowledge Validation**
- Demonstrate understanding of Cucumber expression syntax
- Explain data table vs. doc string use cases
- Describe custom parameter type creation process
- Articulate data validation and error handling strategies

#### **Practical Skills**
- Extract and validate parameters from Gherkin steps
- Process data tables into usable TypeScript objects
- Handle multi-line content within step definitions
- Create reusable custom parameter types
- Integrate external data sources effectively

#### **Professional Readiness**
- Design maintainable data-driven test architectures
- Implement type-safe data handling patterns
- Create scalable approaches for complex test scenarios
- Apply enterprise-grade data validation and error handling

### **Real-world Applications**

This lesson prepares you for common professional scenarios:

**E-commerce Testing:**
- Product catalog validation with complex product data
- Order processing scenarios with detailed transaction information
- User account management with comprehensive profile data

**Financial Services:**
- Transaction processing with detailed financial data
- Compliance testing with regulatory data requirements
- Risk assessment scenarios with complex calculation parameters

**Healthcare Systems:**
- Patient data management with privacy considerations
- Medical record processing with structured clinical data
- Regulatory compliance testing with detailed audit trails

**API Testing Integration:**
- Request payload validation with structured JSON data
- Response processing with complex nested data structures
- Data transformation testing between different system formats

### **Getting Started**

#### **Quick Start Checklist**
1. **Environment Setup**: Ensure your Cucumber + TypeScript + Playwright environment is ready
2. **Review Prerequisites**: Confirm understanding of previous lesson concepts
3. **Clone Practice Repository**: Set up the lesson's practice project
4. **Run Initial Tests**: Verify your setup with provided baseline tests

#### **Recommended Learning Path**
1. **Start with Content**: Read through [`content.md`](./content.md) for conceptual understanding
2. **Study Examples**: Work through [`examples/`](./examples/README.md) progressively
3. **Practice Implementation**: Complete [`exercises/`](./exercises/README.md) hands-on workshops
4. **Validate Learning**: Take the [`assessment.md`](./assessment.md) to confirm mastery

#### **Time Management Suggestions**
- **First Session (2 hours)**: Content review and first two examples
- **Second Session (2 hours)**: Advanced examples and first two exercises  
- **Third Session (1 hour)**: Final exercises and assessment preparation

### **Support and Resources**

#### **Getting Help**
- **Concept Questions**: Review the examples and visual aids
- **Implementation Issues**: Check the exercise solution guides
- **Advanced Patterns**: Explore the professional integration examples
- **Assessment Preparation**: Use the practice questions and rubrics

#### **Additional Learning Materials**
- [Cucumber.js Parameter Types Documentation](https://cucumber.io/docs/cucumber/cucumber-expressions/#parameter-types)
- [TypeScript Interface Design Patterns](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Data-Driven Testing Best Practices](https://testautomationu.applitools.com/data-driven-testing/)

#### **Community Resources**
- Cucumber.js GitHub discussions for advanced parameter type patterns
- TypeScript community forums for type-safe data handling approaches
- QA automation communities for real-world data integration patterns

---

## Next Steps

Upon successful completion of this lesson:

1. **Immediate Next**: Proceed to **MOD-06 Lesson 06: Using Cucumber Hooks and Tags**
2. **Skill Integration**: Apply data passing techniques in upcoming Page Object Model integration
3. **Project Application**: Implement learned patterns in your current test automation projects
4. **Knowledge Sharing**: Share insights with your team on effective data-driven BDD approaches

This lesson provides the essential foundation for sophisticated data-driven BDD testing, enabling you to create maintainable, scalable test automation solutions that handle complex real-world scenarios effectively.