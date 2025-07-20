# Lesson 01: Assessment - Playwright Installation and Setup

## 🎯 Assessment Overview

This assessment evaluates your understanding of Playwright installation, setup, and basic configuration. It combines theoretical knowledge with practical implementation skills.

**Total Points**: 100  
**Passing Score**: 80%  
**Time Limit**: 90 minutes  
**Assessment Type**: Mixed (Knowledge Check + Practical Implementation)

## 📚 Part A: Knowledge Check (40 points)

### **Question 1: Multiple Choice (10 points)**

**Which Node.js version is the minimum requirement for Playwright?**

A) Node.js 14  
B) Node.js 16  
C) Node.js 18  
D) Node.js 20  

**Correct Answer**: C) Node.js 18

---

### **Question 2: Multiple Choice (10 points)**

**What command initializes a new Playwright project with TypeScript support?**

A) `npm install playwright`  
B) `npx playwright init`  
C) `npm init playwright@latest`  
D) `yarn create playwright`  

**Correct Answer**: C) `npm init playwright@latest`

---

### **Question 3: Multiple Choice (10 points)**

**Which browsers does Playwright support out of the box?**

A) Chrome and Firefox only  
B) Chromium, Firefox, and Safari  
C) Chromium, Firefox, and WebKit  
D) All major browsers including Internet Explorer  

**Correct Answer**: C) Chromium, Firefox, and WebKit

---

### **Question 4: Short Answer (10 points)**

**Explain the difference between Playwright's E2E testing and API testing capabilities. Provide one example use case for each.**

**Sample Answer**:
- **E2E Testing**: Tests the complete user journey through the browser interface, simulating real user interactions like clicking, typing, and navigation. Example: Testing a login flow by filling username/password fields and clicking the login button.
- **API Testing**: Tests backend services directly through HTTP requests without a browser interface. Example: Testing user authentication by sending POST requests to `/api/login` endpoint and validating the response.

**Scoring Criteria**:
- Clear distinction between E2E and API testing (5 points)
- Relevant examples for each type (5 points)

---

## 🛠️ Part B: Practical Implementation (60 points)

### **Task 1: Project Setup (20 points)**

**Objective**: Create a new Playwright project with proper configuration.

**Requirements**:
1. Create a new directory called `assessment-project`
2. Initialize a Playwright project with TypeScript
3. Verify all browsers are installed
4. Create a custom [`playwright.config.ts`](playwright.config.ts:1) with the following specifications:
   - Support for Chromium, Firefox, and WebKit
   - HTML and JSON reporters
   - Screenshots on failure only
   - Video recording on failure only
   - Base URL set to `https://playwright.dev`
   - Timeout of 30 seconds

**Deliverables**:
- [ ] Project directory created and initialized
- [ ] Custom configuration file with all requirements
- [ ] Screenshot showing successful browser installation
- [ ] Output of `npx playwright --version` command

**Scoring Rubric**:
- Project initialization (5 points)
- Configuration completeness (10 points)
- Browser installation verification (5 points)

---

### **Task 2: Basic E2E Test Creation (20 points)**

**Objective**: Create a comprehensive E2E test that demonstrates core Playwright functionality.

**Requirements**:
Create [`tests/assessment-e2e.spec.ts`](tests/assessment-e2e.spec.ts:1) with the following tests:

1. **Navigation Test**: Navigate to Playwright homepage and verify title
2. **Element Interaction Test**: Find and click on "Get started" link
3. **Form Interaction Test**: Use the search functionality (if available)
4. **Assertion Test**: Verify at least 3 different types of assertions

**Expected Test Structure**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Assessment E2E Tests', () => {
  test('should navigate and verify homepage', async ({ page }) => {
    // Your implementation here
  });

  test('should interact with page elements', async ({ page }) => {
    // Your implementation here
  });

  test('should demonstrate various assertions', async ({ page }) => {
    // Your implementation here
  });
});
```

**Deliverables**:
- [ ] Complete test file with all required tests
- [ ] Tests pass in at least 2 different browsers
- [ ] HTML report showing test results
- [ ] Screenshots captured during test execution

**Scoring Rubric**:
- Test structure and organization (5 points)
- Navigation and basic interactions (5 points)
- Assertion variety and correctness (5 points)
- Test execution and reporting (5 points)

---

### **Task 3: Basic API Test Creation (20 points)**

**Objective**: Create API tests using Playwright's request fixture.

**Requirements**:
Create [`tests/assessment-api.spec.ts`](tests/assessment-api.spec.ts:1) with the following tests:

1. **GET Request Test**: Fetch data from JSONPlaceholder API
2. **POST Request Test**: Create a new resource
3. **Error Handling Test**: Test 404 error response
4. **Response Validation Test**: Validate response structure and data types

**Expected Test Structure**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Assessment API Tests', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should fetch data with GET request', async ({ request }) => {
    // Your implementation here
  });

  test('should create resource with POST request', async ({ request }) => {
    // Your implementation here
  });

  test('should handle API errors correctly', async ({ request }) => {
    // Your implementation here
  });

  test('should validate response structure', async ({ request }) => {
    // Your implementation here
  });
});
```

**Deliverables**:
- [ ] Complete API test file with all required tests
- [ ] Tests demonstrate different HTTP methods
- [ ] Proper response validation and error handling
- [ ] Test execution results and logs

**Scoring Rubric**:
- API test structure and HTTP methods (5 points)
- Response validation techniques (5 points)
- Error handling implementation (5 points)
- Test execution and documentation (5 points)

---

## 🔍 Part C: Troubleshooting Scenario (Bonus - 10 points)

### **Scenario**: Installation Issues

**Problem Description**:
A student is trying to install Playwright on their Windows machine but encounters the following error:

```
Error: Failed to download browser binaries
EACCES: permission denied, mkdir 'C:\Users\Student\AppData\Local\ms-playwright'
```

**Your Task**:
1. Identify the root cause of this error
2. Provide step-by-step solution instructions
3. Suggest preventive measures for future installations

**Expected Answer Format**:
```markdown
## Root Cause Analysis
[Your analysis here]

## Solution Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Prevention Measures
- [Measure 1]
- [Measure 2]
```

**Scoring Criteria**:
- Correct root cause identification (3 points)
- Accurate solution steps (5 points)
- Practical prevention measures (2 points)

---

## 📊 Assessment Submission Guidelines

### **Submission Requirements**

1. **Project Files**:
   - Complete project directory with all files
   - Configuration files with proper settings
   - Test files with working implementations

2. **Documentation**:
   - README.md explaining your setup process
   - Screenshots of successful test execution
   - HTML test reports

3. **Evidence of Execution**:
   - Console output showing successful test runs
   - Browser screenshots from E2E tests
   - API response logs from API tests

### **Submission Format**

Create a ZIP file named `lastname-firstname-lesson01-assessment.zip` containing:

```
assessment-project/
├── README.md
├── playwright.config.ts
├── package.json
├── tests/
│   ├── assessment-e2e.spec.ts
│   └── assessment-api.spec.ts
├── test-results/
├── playwright-report/
└── screenshots/
```

### **Submission Checklist**

- [ ] All knowledge check questions answered
- [ ] Project setup completed successfully
- [ ] E2E tests created and passing
- [ ] API tests created and passing
- [ ] HTML reports generated
- [ ] Screenshots and documentation included
- [ ] Troubleshooting scenario completed (bonus)
- [ ] ZIP file properly named and organized

---

## 🎯 Grading Rubric

### **Grade Scale**

| Score Range | Grade | Description |
|-------------|-------|-------------|
| 90-100 | A | Excellent - All requirements met with high quality |
| 80-89 | B | Good - Most requirements met with good quality |
| 70-79 | C | Satisfactory - Basic requirements met |
| 60-69 | D | Needs Improvement - Some requirements missing |
| Below 60 | F | Unsatisfactory - Major requirements not met |

### **Detailed Scoring**

#### **Knowledge Check (40 points)**
- Multiple choice questions: 30 points (10 each)
- Short answer question: 10 points

#### **Practical Implementation (60 points)**
- Project setup: 20 points
- E2E test creation: 20 points
- API test creation: 20 points

#### **Bonus Points (10 points)**
- Troubleshooting scenario: 10 points

### **Quality Indicators**

**Excellent Work (A)**:
- Clean, well-organized code structure
- Comprehensive test coverage
- Proper error handling
- Clear documentation
- Creative problem-solving

**Good Work (B)**:
- Functional implementation
- Most requirements met
- Basic documentation
- Tests pass consistently

**Satisfactory Work (C)**:
- Basic functionality working
- Minimum requirements met
- Some documentation present
- Tests mostly pass

---

## 🚀 Post-Assessment Activities

### **Self-Reflection Questions**

After completing the assessment, reflect on these questions:

1. **What was the most challenging part of the installation process?**
2. **How comfortable do you feel with Playwright configuration?**
3. **What differences did you notice between E2E and API testing?**
4. **What would you do differently if you started over?**
5. **What additional features would you like to explore?**

### **Next Steps Preparation**

To prepare for Lesson 02, ensure you:
- [ ] Have a working Playwright installation
- [ ] Understand basic project structure
- [ ] Can run both E2E and API tests
- [ ] Are familiar with configuration options
- [ ] Have VS Code with Playwright extension installed

### **Additional Practice Suggestions**

1. **Explore Different Websites**: Create tests for various websites to practice different scenarios
2. **Try Mobile Testing**: Experiment with mobile device emulation
3. **API Exploration**: Test different public APIs to understand various response formats
4. **Configuration Experimentation**: Try different configuration options and observe their effects

---

## 📚 Assessment Resources

### **Allowed Resources During Assessment**
- Playwright official documentation
- TypeScript documentation
- Your lesson notes and examples
- VS Code IntelliSense and autocomplete

### **Prohibited Resources**
- Direct copying from online tutorials
- Collaboration with other students
- AI-generated code without understanding

### **Technical Support**
If you encounter technical issues during the assessment:
1. Document the error message and steps taken
2. Try basic troubleshooting (restart, reinstall, etc.)
3. Contact instructor with specific error details
4. Continue with other parts of the assessment if possible

---

**🎭 Good luck with your assessment! This evaluation will demonstrate your mastery of Playwright installation and setup fundamentals, preparing you for more advanced topics in upcoming lessons.**