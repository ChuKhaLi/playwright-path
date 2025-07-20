# Module Specification: MOD-03 Playwright Fundamentals

## 1. Overview

This module introduces learners to the core concepts of Playwright with a balanced approach integrating both E2E and API testing from the beginning. It covers everything from installation to writing comprehensive tests, with emphasis on best practices and modern testing approaches.

## 2. Enhanced Scope

### **Core E2E Testing Concepts**
- **Installation and Setup**: Setting up a new Playwright project with TypeScript
- **Configuration**: Understanding the [`playwright.config.ts`](playwright.config.ts:1) file and project structure
- **Core Concepts**: Browsers, contexts, and pages in Playwright architecture
- **Locators**: The primary way to identify elements, and why they are preferred over traditional selectors
- **Actions**: Performing user actions like [`click()`](page.click():1), [`fill()`](page.fill():1), and [`press()`](page.press():1)
- **Assertions**: Using web-first assertions with [`expect()`](expect():1)
- **Trace Viewer**: A detailed look at this powerful debugging tool

### **API Testing Integration** ⭐ **NEW ENHANCED FOCUS**
- **Request Fixture**: Introduction to Playwright's [`request`](request:1) fixture for API testing
- **HTTP Methods**: Comprehensive coverage of GET, POST, PUT, PATCH, DELETE operations
- **Authentication**: Bearer tokens, API keys, and session-based authentication
- **Data Handling**: JSON, form data, and various request/response formats
- **Response Validation**: Status codes, headers, and response body validation
- **Schema Testing**: JSON schema validation and contract testing concepts

### **Integration Approaches** ⭐ **NEW ENHANCED FOCUS**
- **Hybrid Testing**: Combining API and E2E testing in single workflows
- **Data Setup**: Using API calls to prepare test data for E2E scenarios
- **Cross-Validation**: Validating the same data through both API and UI
- **Debugging Integration**: Using debugging tools for both testing approaches

## 3. Enhanced Learning Objectives

By the end of this module, learners will be able to:

### **E2E Testing Mastery**
- Set up a Playwright project from scratch with proper TypeScript configuration
- Write basic tests that perform common user interactions
- Use locators effectively to create stable and maintainable tests
- Use the Trace Viewer to debug and analyze test runs
- Implement comprehensive assertions for UI validation

### **API Testing Proficiency** ⭐ **NEW**
- Use Playwright's request fixture for API testing
- Implement CRUD operations using different HTTP methods
- Handle various authentication methods in API tests
- Validate API responses including schema testing
- Parse and manipulate different data formats

### **Integration Skills** ⭐ **NEW**
- Combine API and E2E testing approaches effectively
- Use API calls to set up test data for E2E scenarios
- Validate data consistency across API and UI layers
- Debug issues in both API and E2E contexts
- Design hybrid testing strategies

## 4. Prerequisites

- **MOD-01**: Foundations of Web Technologies
- **MOD-02**: TypeScript for Automation
- Understanding of HTTP protocols and REST principles
- Familiarity with JSON data structures
- Basic knowledge of asynchronous programming concepts

## 5. Enhanced Lesson Structure (16 Lessons)

### **Week 1: Foundation and Setup (Lessons 1-4)**
1. **Lesson 01**: Playwright Installation and Setup
2. **Lesson 02**: Project Structure and Configuration  
3. **Lesson 03**: Browser Context and Page Concepts
4. **Lesson 04**: First E2E Test Creation

### **Week 2: API Introduction and Core E2E (Lessons 5-8)**
5. **Lesson 05**: Introduction to Request Fixture ⭐ **API FOCUS**
6. **Lesson 06**: Basic Locators and Selectors
7. **Lesson 07**: Advanced Locator Strategies
8. **Lesson 08**: User Actions and Interactions

### **Week 3: Assertions and API Fundamentals (Lessons 9-12)**
9. **Lesson 09**: Assertions and Expectations
10. **Lesson 10**: API Request Methods and Data Handling ⭐ **API FOCUS**
11. **Lesson 11**: API Authentication and Headers ⭐ **API FOCUS**
12. **Lesson 12**: API Response Validation ⭐ **API FOCUS**

### **Week 4: Advanced Integration (Lessons 13-16)**
13. **Lesson 13**: API Schema Testing ⭐ **API FOCUS**
14. **Lesson 14**: Combining API and E2E Testing ⭐ **INTEGRATION FOCUS**
15. **Lesson 15**: Debugging and Trace Viewer
16. **Lesson 16**: Test Organization and Structure

## 6. Enhanced Resource Mapping

### **Primary Resources**
- **Playwright Official Documentation**: The "Getting Started", "Core Concepts", and "API Testing" sections ⭐⭐⭐⭐⭐
- **Microsoft Learn - Playwright**: For structured, hands-on introduction ⭐⭐⭐⭐⭐
- **Official Playwright YouTube Channel**: For visual learners ⭐⭐⭐⭐
- **Try Playwright**: For quick, browser-based experimentation ⭐⭐⭐⭐

### **API Testing Resources** ⭐ **NEW**
- **Playwright API Testing Guide**: Official documentation for request fixture
- **REST API Testing Patterns**: Best practices for API automation
- **JSON Schema Validation**: Tools and techniques for schema testing
- **Authentication Patterns**: Common API authentication methods

### **Integration Resources** ⭐ **NEW**
- **Hybrid Testing Strategies**: Combining API and E2E approaches
- **Test Data Management**: Using APIs for test setup and teardown
- **Cross-Layer Validation**: Ensuring consistency between API and UI

## 7. Enhanced Hands-on Exercises

### **E2E Exercises**
- A series of exercises to practice each core E2E concept on demo websites
- Progressive complexity from basic interactions to complex workflows
- Real-world scenarios using practice sites

### **API Testing Exercises** ⭐ **NEW**
- CRUD operations using different HTTP methods
- Authentication workflow implementation
- Response validation and schema testing
- Error handling and edge case testing

### **Integration Exercises** ⭐ **NEW**
- Hybrid test scenarios combining API and E2E approaches
- Data setup using API calls for E2E test preparation
- Cross-validation of data through both API and UI
- Performance comparison between API and E2E approaches

### **Final Project** ⭐ **ENHANCED**
- Comprehensive test suite for a web application including:
  - Complete E2E user journey testing
  - Full API test coverage for backend services
  - Integrated workflows demonstrating hybrid approaches
  - Proper test organization and structure

## 8. Enhanced Assessment Methods

### **Knowledge Assessment**
- Quizzes on Playwright's core concepts and API
- Understanding of locator strategies and best practices
- API testing concepts and HTTP protocol knowledge

### **Practical Assessment** ⭐ **ENHANCED**
- **E2E Assessment**: Write a comprehensive E2E test suite for a given web application
- **API Assessment**: Create a complete API test suite with authentication and validation
- **Integration Assessment**: Develop hybrid tests that combine API and E2E approaches
- **Code Review**: Peer assessment focusing on test quality, maintainability, and best practices

### **Portfolio Development**
- Document test strategies and approaches used
- Create reusable test utilities and patterns
- Demonstrate understanding of when to use API vs E2E testing

## 9. Enhanced Dependencies

### **Technical Dependencies**
- **MOD-01**: Foundations of Web Technologies (HTML, CSS, HTTP, REST APIs)
- **MOD-02**: TypeScript for Automation (Types, interfaces, async/await)
- **Node.js**: Version 18+ for optimal Playwright compatibility
- **TypeScript**: Latest stable version for type safety

### **Knowledge Dependencies**
- Understanding of web application architecture
- Familiarity with REST API principles
- Basic knowledge of authentication methods
- Understanding of JSON data structures and manipulation

## 10. Success Metrics

### **Technical Proficiency**
- Ability to set up and configure Playwright projects independently
- Proficiency in writing both E2E and API tests
- Understanding of when to use different testing approaches
- Capability to debug and troubleshoot test issues

### **Best Practices Adoption**
- Use of appropriate locator strategies
- Implementation of proper assertion patterns
- Following test organization and structure guidelines
- Application of DRY principles in test code

### **Integration Understanding**
- Ability to design hybrid testing strategies
- Understanding of test data management across layers
- Knowledge of performance implications of different approaches
- Capability to validate data consistency across API and UI

## 11. Preparation for Advanced Modules

This module prepares learners for:
- **MOD-04**: Advanced Playwright Techniques (Authentication, Network Interception, Performance)
- **MOD-05**: Test Design and Architecture (Page Object Model, Test Patterns)
- **MOD-06**: CI/CD and DevOps Integration (Pipeline Integration, Reporting)
- **MOD-07**: Advanced Topics and Specialization (Visual Testing, Performance Testing)

The balanced approach ensures learners have a solid foundation in both E2E and API testing, enabling them to make informed decisions about testing strategies in advanced scenarios.