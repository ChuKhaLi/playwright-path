# Lesson 05: Hands-On Practice Exercises ⭐ **API FOCUS**

## 🎯 Exercise Overview

These hands-on exercises will help you master Playwright's request fixture for API testing. You'll practice making HTTP requests, handling responses, and understanding when to use API testing vs E2E testing.

## 📋 Prerequisites

- Completed Lessons 01-04 (Playwright setup and basic concepts)
- Working Playwright installation with TypeScript
- Internet connection for API testing
- Understanding of HTTP methods and JSON

## 🏋️ Exercise 1: Basic API Request Operations

### **Objective**
Master the fundamentals of making API requests using Playwright's request fixture.

### **Tasks**

#### **Task 1.1: Setup API Testing Project Structure**

Create a dedicated API testing structure:

```powershell
# Navigate to your Playwright project
cd your-playwright-project

# Create API test directories
mkdir tests\api
mkdir tests\api\exercises
mkdir tests\api\utils

# Create configuration for API testing
```

Create [`tests/api/api-config.ts`](tests/api/api-config.ts:1):
```typescript
export const API_CONFIG = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Playwright-API-Exercise'
  }
};

export const TEST_DATA = {
  validUserId: 1,
  invalidUserId: 999999,
  validPostId: 1,
  invalidPostId: 999999
};
```

#### **Task 1.2: Basic GET Requests**

Create [`tests/api/exercises/basic-get-requests.spec.ts`](tests/api/exercises/basic-get-requests.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG, TEST_DATA } from '../api-config';

test.describe('Exercise 1.2: Basic GET Requests', () => {
  test('should fetch a single user successfully', async ({ request }) => {
    // TODO: Make a GET request to fetch user with ID 1
    // Verify response status is 200
    // Verify response contains user data with correct structure
    // Validate that user has id, name, email, and username properties
    
    const response = await request.get(`${API_CONFIG.baseURL}/users/${TEST_DATA.validUserId}`);
    
    // Your validation code here
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user).toHaveProperty('id', TEST_DATA.validUserId);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('username');
    
    // Additional validations - complete these
    expect(typeof user.name).toBe('string');
    // TODO: Add more type validations
    // TODO: Validate email format using regex
    // TODO: Log user information to console
  });

  test('should fetch all users and validate collection', async ({ request }) => {
    // TODO: Fetch all users from /users endpoint
    // Verify response status
    // Verify response is an array
    // Verify array has more than 0 items
    // Verify each user has required properties
    
    const response = await request.get(`${API_CONFIG.baseURL}/users`);
    
    // Your implementation here
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    // TODO: Complete the validation
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // TODO: Validate each user in the array
    users.forEach(user => {
      // Add your validations here
    });
  });

  test('should handle query parameters correctly', async ({ request }) => {
    // TODO: Fetch posts with query parameters
    // Use userId=1 and _limit=3 as query parameters
    // Verify all returned posts belong to userId 1
    // Verify no more than 3 posts are returned
    
    const response = await request.get(`${API_CONFIG.baseURL}/posts`, {
      params: {
        // TODO: Add your query parameters here
      }
    });
    
    // Your validation code here
  });

  test('should handle 404 errors gracefully', async ({ request }) => {
    // TODO: Request a non-existent user (use TEST_DATA.invalidUserId)
    // Verify response status is 404
    // Handle the error response appropriately
    
    // Your implementation here
  });
});
```

#### **Task 1.3: Response Analysis and Validation**

Create [`tests/api/exercises/response-validation.spec.ts`](tests/api/exercises/response-validation.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG } from '../api-config';

test.describe('Exercise 1.3: Response Analysis', () => {
  test('should analyze response headers thoroughly', async ({ request }) => {
    const response = await request.get(`${API_CONFIG.baseURL}/users/1`);
    
    // TODO: Get response headers
    const headers = response.headers();
    
    // TODO: Validate common headers exist
    expect(headers).toHaveProperty('content-type');
    // TODO: Verify content-type contains 'application/json'
    // TODO: Check for other common headers (server, cache-control, etc.)
    // TODO: Log all headers to console for analysis
    
    console.log('Response Headers:', JSON.stringify(headers, null, 2));
  });

  test('should measure and validate response timing', async ({ request }) => {
    // TODO: Record start time
    const startTime = Date.now();
    
    const response = await request.get(`${API_CONFIG.baseURL}/posts`);
    
    // TODO: Record end time and calculate response time
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // TODO: Validate response was successful
    expect(response.status()).toBe(200);
    
    // TODO: Validate response time is reasonable (under 5 seconds)
    expect(responseTime).toBeLessThan(5000);
    
    console.log(`Response time: ${responseTime}ms`);
    
    // TODO: Add warning if response is slow (over 1 second)
    if (responseTime > 1000) {
      console.warn(`Slow response detected: ${responseTime}ms`);
    }
  });

  test('should parse different response formats', async ({ request }) => {
    const response = await request.get(`${API_CONFIG.baseURL}/users/1`);
    
    // TODO: Parse response as JSON
    const jsonData = await response.json();
    
    // TODO: Get response as text
    const textData = await response.text();
    
    // TODO: Get response as buffer
    const bufferData = await response.body();
    
    // TODO: Validate all formats contain the same data
    expect(jsonData).toHaveProperty('id', 1);
    expect(textData).toContain('"id": 1');
    expect(bufferData.length).toBeGreaterThan(0);
    
    // TODO: Verify consistency between formats
    const parsedFromText = JSON.parse(textData);
    expect(parsedFromText.id).toBe(jsonData.id);
  });
});
```

### **Deliverables**
- [ ] API testing project structure created
- [ ] Configuration file with base URL and test data
- [ ] Basic GET request tests implemented and passing
- [ ] Response validation tests completed
- [ ] All TODO items in the code completed
- [ ] Console logs showing response analysis

---

## 🏋️ Exercise 2: POST Requests and Data Creation

### **Objective**
Learn to create data using POST requests and validate the creation process.

### **Tasks**

#### **Task 2.1: Basic POST Operations**

Create [`tests/api/exercises/post-requests.spec.ts`](tests/api/exercises/post-requests.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG } from '../api-config';

test.describe('Exercise 2.1: POST Request Operations', () => {
  test('should create a new post successfully', async ({ request }) => {
    // TODO: Create test data for a new post
    const newPost = {
      title: 'My Exercise Post',
      body: 'This post was created during API testing exercises.',
      userId: 1
    };

    // TODO: Make POST request to create the post
    const response = await request.post(`${API_CONFIG.baseURL}/posts`, {
      data: newPost,
      headers: API_CONFIG.headers
    });

    // TODO: Validate response status is 201 (Created)
    expect(response.status()).toBe(201);

    // TODO: Parse response and validate created post
    const createdPost = await response.json();
    
    // TODO: Verify the post was created with correct data
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    
    // TODO: Verify an ID was assigned
    expect(createdPost).toHaveProperty('id');
    expect(typeof createdPost.id).toBe('number');
    expect(createdPost.id).toBeGreaterThan(0);
    
    console.log(`Created post with ID: ${createdPost.id}`);
  });

  test('should create a user with complex nested data', async ({ request }) => {
    // TODO: Create comprehensive user data with nested objects
    const newUser = {
      name: 'Exercise Test User',
      username: 'exerciseuser',
      email: 'exercise@test.com',
      address: {
        street: '123 Exercise Street',
        suite: 'Apt. 456',
        city: 'Test City',
        zipcode: '12345-6789',
        geo: {
          lat: '40.7128',
          lng: '-74.0060'
        }
      },
      phone: '1-555-EXERCISE',
      website: 'exercise.test.com',
      company: {
        name: 'Exercise Testing Co.',
        catchPhrase: 'Testing with confidence',
        bs: 'automated quality assurance'
      }
    };

    // TODO: Make POST request to create user
    const response = await request.post(`${API_CONFIG.baseURL}/users`, {
      data: newUser
    });

    // TODO: Validate response and created user
    expect(response.status()).toBe(201);
    
    const createdUser = await response.json();
    
    // TODO: Validate top-level properties
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
    
    // TODO: Validate nested address object
    expect(createdUser.address.city).toBe(newUser.address.city);
    expect(createdUser.address.geo.lat).toBe(newUser.address.geo.lat);
    
    // TODO: Validate nested company object
    expect(createdUser.company.name).toBe(newUser.company.name);
  });

  test('should handle different content types', async ({ request }) => {
    // TODO: Test JSON content type
    const jsonData = {
      title: 'JSON Content Type Test',
      body: 'Testing with explicit JSON content type',
      userId: 1
    };

    const jsonResponse = await request.post(`${API_CONFIG.baseURL}/posts`, {
      data: jsonData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(jsonResponse.status()).toBe(201);

    // TODO: Test form data content type
    const formData = {
      title: 'Form Data Test',
      body: 'Testing with form data',
      userId: 2
    };

    const formResponse = await request.post(`${API_CONFIG.baseURL}/posts`, {
      form: formData
    });

    expect(formResponse.status()).toBe(201);

    // TODO: Compare both responses
    const jsonPost = await jsonResponse.json();
    const formPost = await formResponse.json();

    expect(jsonPost.title).toBe('JSON Content Type Test');
    expect(formPost.title).toBe('Form Data Test');
  });
});
```

#### **Task 2.2: Data Validation and Error Handling**

Create [`tests/api/exercises/data-validation.spec.ts`](tests/api/exercises/data-validation.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG } from '../api-config';

test.describe('Exercise 2.2: Data Validation', () => {
  test('should validate required fields in POST requests', async ({ request }) => {
    // TODO: Test with missing required fields
    const incompletePost = {
      title: 'Incomplete Post'
      // Missing body and userId
    };

    const response = await request.post(`${API_CONFIG.baseURL}/posts`, {
      data: incompletePost
    });

    // TODO: Handle the response appropriately
    // Note: JSONPlaceholder is lenient, but in real APIs this might return 400
    console.log(`Response status for incomplete data: ${response.status()}`);
    
    if (response.status() === 201) {
      const createdPost = await response.json();
      console.log('Created post despite missing fields:', createdPost);
    }
  });

  test('should validate data types and formats', async ({ request }) => {
    // TODO: Create test data with various data types
    const testPost = {
      title: 'Data Type Validation Test',
      body: 'Testing different data types and formats',
      userId: 1,
      metadata: {
        tags: ['test', 'validation', 'api'],
        priority: 'high',
        timestamp: new Date().toISOString(),
        isPublished: false,
        viewCount: 0
      }
    };

    const response = await request.post(`${API_CONFIG.baseURL}/posts`, {
      data: testPost
    });

    expect(response.status()).toBe(201);

    const createdPost = await response.json();
    
    // TODO: Validate the data types were preserved
    expect(createdPost.title).toBe(testPost.title);
    expect(createdPost.userId).toBe(testPost.userId);
    
    // TODO: Check if nested metadata was preserved
    if (createdPost.metadata) {
      expect(Array.isArray(createdPost.metadata.tags)).toBe(true);
      expect(typeof createdPost.metadata.isPublished).toBe('boolean');
    }
  });
});
```

### **Deliverables**
- [ ] POST request tests implemented and passing
- [ ] Complex nested data creation tested
- [ ] Different content types handled correctly
- [ ] Data validation tests completed
- [ ] Error handling scenarios tested

---

## 🏋️ Exercise 3: API vs E2E Testing Comparison

### **Objective**
Understand the practical differences between API and E2E testing approaches.

### **Tasks**

#### **Task 3.1: Performance Comparison**

Create [`tests/api/exercises/api-vs-e2e-comparison.spec.ts`](tests/api/exercises/api-vs-e2e-comparison.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG } from '../api-config';

test.describe('Exercise 3.1: API vs E2E Performance', () => {
  test('should compare API vs E2E response times', async ({ request, page }) => {
    console.log('=== Performance Comparison: API vs E2E ===');

    // TODO: Test API approach
    console.log('\n--- API Approach ---');
    const apiStartTime = Date.now();
    
    const apiResponse = await request.get(`${API_CONFIG.baseURL}/users/1`);
    const apiUser = await apiResponse.json();
    
    const apiEndTime = Date.now();
    const apiTime = apiEndTime - apiStartTime;

    expect(apiResponse.status()).toBe(200);
    expect(apiUser).toHaveProperty('name');

    console.log(`API Response Time: ${apiTime}ms`);
    console.log(`API User Name: ${apiUser.name}`);

    // TODO: Test E2E approach
    console.log('\n--- E2E Approach ---');
    const e2eStartTime = Date.now();
    
    await page.goto(`${API_CONFIG.baseURL}/users/1`);
    const pageContent = await page.locator('pre').textContent();
    const e2eUser = JSON.parse(pageContent);
    
    const e2eEndTime = Date.now();
    const e2eTime = e2eEndTime - e2eStartTime;

    expect(e2eUser.name).toBe(apiUser.name);

    console.log(`E2E Response Time: ${e2eTime}ms`);
    console.log(`E2E User Name: ${e2eUser.name}`);

    // TODO: Compare and analyze results
    console.log('\n--- Comparison Results ---');
    const speedDifference = Math.round(e2eTime / apiTime);
    console.log(`E2E is ${speedDifference}x slower than API`);
    console.log(`Time difference: ${e2eTime - apiTime}ms`);

    // TODO: Validate API is faster
    expect(apiTime).toBeLessThan(e2eTime);
    
    // TODO: Document findings
    console.log('\n--- Analysis ---');
    console.log('API Testing Benefits:');
    console.log('- Faster execution');
    console.log('- Direct data access');
    console.log('- No browser overhead');
    console.log('- More reliable');
    
    console.log('\nE2E Testing Benefits:');
    console.log('- Tests complete user experience');
    console.log('- Validates UI rendering');
    console.log('- Tests browser compatibility');
    console.log('- Catches visual issues');
  });

  test('should demonstrate data validation differences', async ({ request, page }) => {
    console.log('=== Data Validation Comparison ===');

    // TODO: API data validation
    console.log('\n--- API Data Validation ---');
    const apiResponse = await request.get(`${API_CONFIG.baseURL}/users/1`);
    const apiUser = await apiResponse.json();

    // Direct access to all data properties
    expect(apiUser.id).toBe(1);
    expect(apiUser.name).toBe('Leanne Graham');
    expect(apiUser.email).toBe('Sincere@april.biz');
    expect(apiUser.address.city).toBe('Gwenborough');
    expect(apiUser.address.geo.lat).toBe('-37.3159');

    console.log('API validation: Direct access to nested properties');
    console.log(`User city: ${apiUser.address.city}`);
    console.log(`User coordinates: ${apiUser.address.geo.lat}, ${apiUser.address.geo.lng}`);

    // TODO: E2E data validation
    console.log('\n--- E2E Data Validation ---');
    await page.goto(`${API_CONFIG.baseURL}/users/1`);
    const e2eContent = await page.locator('pre').textContent();
    const e2eUser = JSON.parse(e2eContent);

    // Same validations through UI
    expect(e2eUser.id).toBe(1);
    expect(e2eUser.name).toBe('Leanne Graham');

    console.log('E2E validation: Data accessed through UI rendering');
    console.log('Both approaches validate the same data, but:');
    console.log('- API: Direct backend validation');
    console.log('- E2E: Validates data presentation in UI');
  });
});
```

#### **Task 3.2: Use Case Analysis**

Create [`tests/api/exercises/use-case-analysis.spec.ts`](tests/api/exercises/use-case-analysis.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG } from '../api-config';

test.describe('Exercise 3.2: Use Case Analysis', () => {
  test('should demonstrate API testing use cases', async ({ request }) => {
    console.log('=== API Testing Use Cases ===');

    // TODO: Use Case 1 - Data Setup for E2E Tests
    console.log('\n1. Data Setup for E2E Tests');
    const testUser = {
      name: 'E2E Test User',
      username: 'e2etestuser',
      email: 'e2etest@example.com'
    };

    const createResponse = await request.post(`${API_CONFIG.baseURL}/users`, {
      data: testUser
    });

    expect(createResponse.status()).toBe(201);
    const createdUser = await createResponse.json();
    
    console.log(`Created test user with ID: ${createdUser.id}`);
    console.log('Benefit: Fast test data creation without UI interaction');

    // TODO: Use Case 2 - Business Logic Validation
    console.log('\n2. Business Logic Validation');
    const posts = await request.get(`${API_CONFIG.baseURL}/posts`, {
      params: { userId: 1 }
    });

    const userPosts = await posts.json();
    console.log(`User 1 has ${userPosts.length} posts`);
    console.log('Benefit: Direct validation of business rules and data relationships');

    // TODO: Use Case 3 - Error Condition Testing
    console.log('\n3. Error Condition Testing');
    const errorResponse = await request.get(`${API_CONFIG.baseURL}/users/999999`);
    expect(errorResponse.status()).toBe(404);
    console.log('Tested 404 error condition');
    console.log('Benefit: Easy testing of error scenarios and edge cases');

    // TODO: Use Case 4 - Performance Testing
    console.log('\n4. Performance Testing');
    const performanceTests = [];
    
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      await request.get(`${API_CONFIG.baseURL}/posts/${i + 1}`);
      const endTime = Date.now();
      performanceTests.push(endTime - startTime);
    }

    const avgResponseTime = performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length;
    console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
    console.log('Benefit: Easy performance benchmarking and load testing');
  });

  test('should demonstrate E2E testing use cases', async ({ page }) => {
    console.log('=== E2E Testing Use Cases ===');

    // TODO: Use Case 1 - User Experience Validation
    console.log('\n1. User Experience Validation');
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Validate UI elements are present and functional
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
    
    console.log('Validated login form UI elements');
    console.log('Benefit: Ensures user interface works as expected');

    // TODO: Use Case 2 - Complete User Journey
    console.log('\n2. Complete User Journey Testing');
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    console.log('Completed full login journey');
    console.log('Benefit: Tests complete user workflows end-to-end');

    // TODO: Use Case 3 - Visual Validation
    console.log('\n3. Visual and Layout Validation');
    await page.screenshot({ path: 'test-results/login-success.png' });
    console.log('Captured screenshot for visual validation');
    console.log('Benefit: Catches visual regressions and layout issues');

    // TODO: Use Case 4 - Browser Compatibility
    console.log('\n4. Browser Compatibility Testing');
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`Testing in browser: ${userAgent}`);
    console.log('Benefit: Ensures compatibility across different browsers');
  });
});
```

### **Deliverables**
- [ ] Performance comparison tests implemented
- [ ] Data validation differences demonstrated
- [ ] API testing use cases documented with examples
- [ ] E2E testing use cases documented with examples
- [ ] Analysis of when to use each approach

---

## 🏋️ Exercise 4: Advanced Request Patterns

### **Objective**
Implement advanced request patterns and error handling strategies.

### **Tasks**

#### **Task 4.1: Request Configuration and Headers**

Create [`tests/api/exercises/advanced-requests.spec.ts`](tests/api/exercises/advanced-requests.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG } from '../api-config';

test.describe('Exercise 4.1: Advanced Request Patterns', () => {
  test('should use custom headers and configuration', async ({ request }) => {
    // TODO: Create request with custom headers
    const customHeaders = {
      'User-Agent': 'Playwright-Exercise-Bot/1.0',
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Custom-Header': 'exercise-value',
      'X-Request-ID': `req-${Date.now()}`,
      'X-Client-Version': '1.0.0'
    };

    const response = await request.get(`${API_CONFIG.baseURL}/users/1`, {
      headers: customHeaders
    });

    expect(response.status()).toBe(200);

    // TODO: Log request details
    console.log('Request sent with custom headers:');
    console.log(JSON.stringify(customHeaders, null, 2));
    
    // TODO: Analyze response headers
    const responseHeaders = response.headers();
    console.log('Response headers received:');
    console.log(JSON.stringify(responseHeaders, null, 2));
  });

  test('should handle request timeouts', async ({ request }) => {
    console.log('Testing request timeout handling...');

    try {
      // TODO: Set a very short timeout to test timeout handling
      const response = await request.get(`${API_CONFIG.baseURL}/posts`, {
        timeout: 1 // 1ms - will likely timeout
      });

      // If we reach here, the request was very fast
      expect(response.status()).toBe(200);
      console.log('Request completed faster than timeout');
    } catch (error) {
      // TODO: Handle timeout error
      console.log('Timeout error caught (expected):');
      console.log(error.message);
      expect(error.message).toContain('timeout');
    }

    // TODO: Test with reasonable timeout
    const normalResponse = await request.get(`${API_CONFIG.baseURL}/posts`, {
      timeout: 10000 // 10 seconds
    });

    expect(normalResponse.status()).toBe(200);
    console.log('Request with normal timeout succeeded');
  });

  test('should implement retry logic', async ({ request }) => {
    console.log('Testing retry logic implementation...');

    let attemptCount = 0;
    const maxRetries = 3;
    let finalResponse;

    // TODO: Implement retry logic
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        attemptCount++;
        console.log(`Attempt ${attemptCount}/${maxRetries}`);

        // Simulate intermittent failures for first 2 attempts
        if (attemptCount < 3) {
          // In real scenarios, this would be actual network issues
          console.log('Simulating network issue...');
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        finalResponse = await request.get(`${API_CONFIG.baseURL}/users/1`);
        
        if (finalResponse.status() === 200) {
          console.log(`Success on attempt ${attemptCount}`);
          break;
        }
      } catch (error) {
        console.log(`Attempt ${attemptCount} failed: ${error.message}`);
        
        if (attempt === maxRetries - 1) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    expect(finalResponse.status()).toBe(200);
    expect(attemptCount).toBeLessThanOrEqual(maxRetries);
    console.log(`Request succeeded after ${attemptCount} attempts`);
  });
});
```

#### **Task 4.2: Error Handling and Edge Cases**

Create [`tests/api/exercises/error-handling.spec.ts`](tests/api/exercises/error-handling.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';
import { API_CONFIG } from '../api-config';

test.describe('Exercise 4.2: Error Handling', () => {
  test('should handle various HTTP error codes', async ({ request }) => {
    console.log('=== HTTP Error Code Handling ===');

    // TODO: Test different error scenarios
    const errorScenarios = [
      {
        url: '/users/999999',
        expectedStatus: 404,
        description: 'User Not Found'
      },
      {
        url: '/invalid-endpoint',
        expectedStatus: 404,
        description: 'Invalid Endpoint'
      }
    ];

    for (const scenario of errorScenarios) {
      console.log(`\nTesting: ${scenario.description}`);
      
      const response = await request.get(`${API_CONFIG.baseURL}${scenario.url}`);
      
      expect(response.status()).toBe(scenario.expectedStatus);
      expect(response.ok()).toBe(false);
      
      console.log(`✓ Status: ${response.status()} ${response.statusText()}`);
      
      // TODO: Handle error response data
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
      } catch (e) {
        console.log('No JSON error data available');
      }
    }
  });

  test('should handle network errors gracefully', async ({ request }) => {
    console.log('Testing network error handling...');

    // TODO: Test with invalid domain
    try {
      const response = await request.get('https://invalid-domain-that-does-not-exist-12345.com/api');
      
      // If we somehow get a response, check it's an error
      expect(response.status()).toBeGreaterThanOrEqual(400);
    } catch (error) {
      // Network error is expected
      console.log('Network error caught (expected):');
      console.log(`Error type: ${error.constructor.name}`);
      console.log(`Error message: ${error.message}`);
      expect(error).toBeDefined();
    }
  });

  test('should validate error response structures', async ({ request }) => {
    // TODO: Test error response from a service that returns structured errors
    const response = await request.get(`${API_CONFIG.baseURL}/posts/999999`);
    
    expect(response.status()).toBe(404);
    
    // TODO: Handle different types of error responses
    const contentType = response.headers()['content-type'];
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      console.log('Structured error response:', errorData);
      
      // TODO: Validate error structure if it exists
      if (errorData && typeof errorData === 'object') {
        