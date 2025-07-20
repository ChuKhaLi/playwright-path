# Lesson 05: Introduction to Request Fixture - Detailed Content ⭐ **API FOCUS**

## 🎯 Deep Dive into API Testing with Playwright

This lesson provides comprehensive coverage of Playwright's request fixture, establishing a solid foundation for API testing that complements your E2E testing skills.

## 🌐 Understanding the API Testing Landscape

### **The Modern Testing Pyramid**

```
    /\     E2E Tests (Few)
   /  \    - Complete user journeys
  /____\   - UI validation
 /      \  
/________\  API Tests (Many)
           - Business logic
           - Data validation
           - Integration testing

Unit Tests (Most)
- Individual functions
- Isolated components
```

### **Why API Testing Matters**

**Speed and Efficiency**:
- API tests run 10-100x faster than E2E tests
- No browser overhead or UI rendering delays
- Direct communication with backend services

**Reliability and Stability**:
- No UI changes breaking tests
- Consistent test environment
- Reduced flakiness from timing issues

**Early Feedback**:
- Test business logic before UI is ready
- Catch integration issues early
- Validate data contracts between services

## 🎭 Playwright Request Fixture Architecture

### **How Request Fixture Works**

```typescript
// The request fixture provides a context for making HTTP requests
test('understanding request context', async ({ request }) => {
  // request is an APIRequestContext instance
  // It shares the same network stack as Playwright browsers
  // Can inherit cookies, headers, and authentication from browser context
  
  const response = await request.get('/api/users');
  // Response is an APIResponse instance with rich methods
});
```

### **Request Fixture vs Other Tools**

| Feature | Playwright Request | Axios/Fetch | Postman |
|---------|-------------------|-------------|---------|
| **Browser Integration** | ✅ Seamless | ❌ Separate | ❌ Separate |
| **Cookie Sharing** | ✅ Automatic | ❌ Manual | ❌ Manual |
| **TypeScript Support** | ✅ Built-in | ✅ Good | ❌ Limited |
| **Test Framework Integration** | ✅ Native | ❌ Requires setup | ❌ External |
| **Debugging Tools** | ✅ Trace viewer | ❌ Limited | ✅ Good |

## 🚀 Comprehensive Request Examples

### **GET Requests - Data Retrieval Patterns**

```typescript
import { test, expect } from '@playwright/test';

test.describe('GET Request Patterns', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should fetch single resource with validation', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/1`);
    
    // Status validation
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);
    expect(response.statusText()).toBe('OK');
    
    // Header validation
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    expect(headers['cache-control']).toBeDefined();
    
    // Response timing
    console.log(`Response URL: ${response.url()}`);
    
    // Data validation
    const user = await response.json();
    
    // Structure validation
    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('address');
    expect(user).toHaveProperty('phone');
    expect(user).toHaveProperty('website');
    expect(user).toHaveProperty('company');
    
    // Type validation
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    
    // Format validation
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(user.website).toMatch(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    
    // Nested object validation
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');
    expect(user.address).toHaveProperty('geo');
    
    // Geo coordinates validation
    expect(user.address.geo).toHaveProperty('lat');
    expect(user.address.geo).toHaveProperty('lng');
    expect(typeof parseFloat(user.address.geo.lat)).toBe('number');
    expect(typeof parseFloat(user.address.geo.lng)).toBe('number');
  });

  test('should fetch collection with filtering', async ({ request }) => {
    // Test collection endpoint
    const response = await request.get(`${baseURL}/posts`);
    expect(response.status()).toBe(200);
    
    const allPosts = await response.json();
    expect(Array.isArray(allPosts)).toBe(true);
    expect(allPosts.length).toBeGreaterThan(0);
    
    // Test with query parameters
    const filteredResponse = await request.get(`${baseURL}/posts`, {
      params: {
        userId: 1,
        _limit: 5
      }
    });
    
    expect(filteredResponse.status()).toBe(200);
    const filteredPosts = await filteredResponse.json();
    
    // Validate filtering worked
    expect(filteredPosts.length).toBeLessThanOrEqual(5);
    filteredPosts.forEach(post => {
      expect(post.userId).toBe(1);
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
    });
  });

  test('should handle complex query parameters', async ({ request }) => {
    // Multiple query parameters
    const response = await request.get(`${baseURL}/comments`, {
      params: {
        postId: 1,
        _sort: 'id',
        _order: 'desc',
        _limit: 3
      }
    });
    
    expect(response.status()).toBe(200);
    const comments = await response.json();
    
    // Validate sorting and limiting
    expect(comments.length).toBeLessThanOrEqual(3);
    comments.forEach(comment => {
      expect(comment.postId).toBe(1);
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('name');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');
    });
    
    // Validate descending order (if multiple results)
    if (comments.length > 1) {
      for (let i = 0; i < comments.length - 1; i++) {
        expect(comments[i].id).toBeGreaterThan(comments[i + 1].id);
      }
    }
  });

  test('should handle nested resource relationships', async ({ request }) => {
    // Get user
    const userResponse = await request.get(`${baseURL}/users/1`);
    const user = await userResponse.json();
    
    // Get user's posts
    const postsResponse = await request.get(`${baseURL}/posts`, {
      params: { userId: user.id }
    });
    const posts = await postsResponse.json();
    
    // Get comments for first post
    if (posts.length > 0) {
      const commentsResponse = await request.get(`${baseURL}/comments`, {
        params: { postId: posts[0].id }
      });
      const comments = await commentsResponse.json();
      
      // Validate relationship chain
      expect(posts.every(post => post.userId === user.id)).toBe(true);
      expect(comments.every(comment => comment.postId === posts[0].id)).toBe(true);
      
      console.log(`User ${user.name} has ${posts.length} posts`);
      console.log(`First post has ${comments.length} comments`);
    }
  });
});
```

### **POST Requests - Data Creation Patterns**

```typescript
test.describe('POST Request Patterns', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should create resource with JSON data', async ({ request }) => {
    const newPost = {
      title: 'My API Test Post',
      body: 'This post was created through API testing with Playwright.',
      userId: 1
    };

    const response = await request.post(`${baseURL}/posts`, {
      data: newPost,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Verify creation response
    expect(response.status()).toBe(201);
    expect(response.statusText()).toBe('Created');
    
    const createdPost = await response.json();
    
    // Verify response structure
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    
    // Verify ID assignment
    expect(typeof createdPost.id).toBe('number');
    expect(createdPost.id).toBeGreaterThan(0);
    
    console.log(`Created post with ID: ${createdPost.id}`);
  });

  test('should create resource with complex nested data', async ({ request }) => {
    const newUser = {
      name: 'API Test User',
      username: 'apitestuser',
      email: 'apitest@example.com',
      address: {
        street: '123 API Street',
        suite: 'Apt. 456',
        city: 'Test City',
        zipcode: '12345-6789',
        geo: {
          lat: '40.7128',
          lng: '-74.0060'
        }
      },
      phone: '1-555-API-TEST',
      website: 'apitest.example.com',
      company: {
        name: 'API Testing Inc.',
        catchPhrase: 'Testing APIs with confidence',
        bs: 'automated quality assurance'
      }
    };

    const response = await request.post(`${baseURL}/users`, {
      data: newUser
    });
    
    expect(response.status()).toBe(201);
    const createdUser = await response.json();
    
    // Verify top-level properties
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.email).toBe(newUser.email);
    
    // Verify nested address
    expect(createdUser.address.street).toBe(newUser.address.street);
    expect(createdUser.address.city).toBe(newUser.address.city);
    expect(createdUser.address.geo.lat).toBe(newUser.address.geo.lat);
    
    // Verify nested company
    expect(createdUser.company.name).toBe(newUser.company.name);
    expect(createdUser.company.catchPhrase).toBe(newUser.company.catchPhrase);
  });

  test('should handle different content types', async ({ request }) => {
    // Test with explicit JSON content type
    const jsonData = { title: 'JSON Post', body: 'JSON content', userId: 1 };
    const jsonResponse = await request.post(`${baseURL}/posts`, {
      data: jsonData,
      headers: { 'Content-Type': 'application/json' }
    });
    expect(jsonResponse.status()).toBe(201);
    
    // Test with form data (simulated)
    const formData = {
      title: 'Form Post',
      body: 'Form content',
      userId: 2
    };
    const formResponse = await request.post(`${baseURL}/posts`, {
      form: formData
    });
    expect(formResponse.status()).toBe(201);
    
    // Verify both created successfully
    const jsonPost = await jsonResponse.json();
    const formPost = await formResponse.json();
    
    expect(jsonPost.title).toBe('JSON Post');
    expect(formPost.title).toBe('Form Post');
  });

  test('should validate request/response timing', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.post(`${baseURL}/posts`, {
      data: {
        title: 'Performance Test Post',
        body: 'Testing response time',
        userId: 1
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(201);
    expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    
    console.log(`POST request completed in ${responseTime}ms`);
    
    // Log performance metrics
    if (responseTime > 1000) {
      console.warn(`Slow response detected: ${responseTime}ms`);
    }
  });
});
```

### **Advanced Response Handling**

```typescript
test.describe('Advanced Response Handling', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should handle different response formats', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/1`);
    
    // Get response as different formats
    const jsonData = await response.json();
    const textData = await response.text();
    const bodyBuffer = await response.body();
    
    // Validate JSON parsing
    expect(jsonData).toHaveProperty('id', 1);
    expect(typeof jsonData).toBe('object');
    
    // Validate text format
    expect(typeof textData).toBe('string');
    expect(textData.length).toBeGreaterThan(0);
    expect(textData).toContain('"id": 1');
    
    // Validate buffer
    expect(bodyBuffer).toBeInstanceOf(Buffer);
    expect(bodyBuffer.length).toBeGreaterThan(0);
    
    // Verify consistency between formats
    const parsedFromText = JSON.parse(textData);
    expect(parsedFromText.id).toBe(jsonData.id);
    expect(parsedFromText.title).toBe(jsonData.title);
  });

  test('should extract and validate response headers', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts`);
    
    const headers = response.headers();
    
    // Common HTTP headers validation
    expect(headers).toHaveProperty('content-type');
    expect(headers).toHaveProperty('server');
    expect(headers).toHaveProperty('cache-control');
    
    // Content type validation
    expect(headers['content-type']).toContain('application/json');
    
    // Server information
    console.log(`Server: ${headers.server}`);
    console.log(`Content-Type: ${headers['content-type']}`);
    console.log(`Cache-Control: ${headers['cache-control']}`);
    
    // Check for security headers (if present)
    if (headers['x-frame-options']) {
      console.log(`X-Frame-Options: ${headers['x-frame-options']}`);
    }
    
    // Validate content length if present
    if (headers['content-length']) {
      const contentLength = parseInt(headers['content-length']);
      expect(contentLength).toBeGreaterThan(0);
      
      const body = await response.body();
      expect(body.length).toBeLessThanOrEqual(contentLength);
    }
  });

  test('should handle response status codes comprehensively', async ({ request }) => {
    // Test successful response
    const successResponse = await request.get(`${baseURL}/posts/1`);
    expect(successResponse.status()).toBe(200);
    expect(successResponse.ok()).toBe(true);
    expect(successResponse.statusText()).toBe('OK');
    
    // Test not found
    const notFoundResponse = await request.get(`${baseURL}/posts/999999`);
    expect(notFoundResponse.status()).toBe(404);
    expect(notFoundResponse.ok()).toBe(false);
    expect(notFoundResponse.statusText()).toBe('Not Found');
    
    // Test different success codes
    const createResponse = await request.post(`${baseURL}/posts`, {
      data: { title: 'Test', body: 'Test', userId: 1 }
    });
    expect(createResponse.status()).toBe(201);
    expect(createResponse.ok()).toBe(true);
    expect(createResponse.statusText()).toBe('Created');
    
    // Log status information
    console.log(`GET /posts/1: ${successResponse.status()} ${successResponse.statusText()}`);
    console.log(`GET /posts/999999: ${notFoundResponse.status()} ${notFoundResponse.statusText()}`);
    console.log(`POST /posts: ${createResponse.status()} ${createResponse.statusText()}`);
  });
});
```

## 🔧 Configuration and Context Management

### **Request Context Configuration**

```typescript
// In playwright.config.ts - API-specific project configuration
export default defineConfig({
  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        // Base URL for all API requests
        baseURL: 'https://jsonplaceholder.typicode.com',
        
        // Default headers for all requests
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Playwright-API-Tests/1.0'
        },
        
        // Ignore HTTPS errors (for testing environments)
        ignoreHTTPSErrors: true,
        
        // Request timeout
        timeout: 30000
      }
    }
  ]
});
```

### **Dynamic Configuration in Tests**

```typescript
test.describe('Dynamic Configuration', () => {
  test('should use environment-specific configuration', async ({ request }) => {
    // Get base URL from environment or config
    const apiBaseUrl = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
    const apiKey = process.env.API_KEY || 'test-key';
    
    const response = await request.get(`${apiBaseUrl}/posts/1`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Environment': process.env.NODE_ENV || 'test'
      }
    });
    
    expect(response.status()).toBe(200);
    console.log(`Using API base URL: ${apiBaseUrl}`);
  });

  test('should handle request timeouts', async ({ request }) => {
    try {
      // Set a very short timeout to test timeout handling
      const response = await request.get('/posts', {
        timeout: 1 // 1ms - will likely timeout
      });
      
      // If we get here, the request was very fast
      expect(response.status()).toBe(200);
    } catch (error) {
      // Timeout error is expected with such a short timeout
      expect(error.message).toContain('timeout');
      console.log('Request timeout handled correctly');
    }
  });

  test('should configure retry logic', async ({ request }) => {
    let attemptCount = 0;
    
    const makeRequest = async () => {
      attemptCount++;
      console.log(`Attempt ${attemptCount}`);
      
      // Simulate intermittent failures
      if (attemptCount < 3) {
        throw new Error('Simulated network error');
      }
      
      return await request.get('/posts/1');
    };
    
    // Implement retry logic
    let response;
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        response = await makeRequest();
        break;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        console.log(`Retry ${i + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      }
    }
    
    expect(response.status()).toBe(200);
    expect(attemptCount).toBe(3);
  });
});
```

## 🔄 API vs E2E Testing Comparison

### **Performance Comparison**

```typescript
test.describe('Performance Comparison', () => {
  test('API vs E2E: User Data Retrieval', async ({ request, page }) => {
    // API approach
    const apiStartTime = Date.now();
    const apiResponse = await request.get('/users/1');
    const apiUser = await apiResponse.json();
    const apiEndTime = Date.now();
    const apiTime = apiEndTime - apiStartTime;
    
    // E2E approach (simulated)
    const e2eStartTime = Date.now();
    await page.goto('https://jsonplaceholder.typicode.com/users/1');
    const e2eUser = await page.locator('pre').textContent();
    const e2eEndTime = Date.now();
    const e2eTime = e2eEndTime - e2eStartTime;
    
    // Compare results
    expect(apiResponse.status()).toBe(200);
    expect(apiUser).toHaveProperty('name');
    
    const parsedE2eUser = JSON.parse(e2eUser);
    expect(parsedE2eUser.name).toBe(apiUser.name);
    
    // Performance comparison
    console.log(`API request time: ${apiTime}ms`);
    console.log(`E2E request time: ${e2eTime}ms`);
    console.log(`E2E is ${Math.round(e2eTime / apiTime)}x slower than API`);
    
    // API should be significantly faster
    expect(apiTime).toBeLessThan(e2eTime);
  });
});
```

### **Data Validation Comparison**

```typescript
test.describe('Data Validation Approaches', () => {
  test('API: Direct data validation', async ({ request }) => {
    const response = await request.get('/users/1');
    const user = await response.json();
    
    // Direct validation of data structure
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    expect(user.email).toBe('Sincere@april.biz');
    expect(user.address.city).toBe('Gwenborough');
    
    // Validate data types
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    
    // Validate data formats
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    console.log('API validation: Direct access to all data properties');
  });

  test('E2E: UI-based validation', async ({ page }) => {
    // This would be how you'd validate the same data through UI
    await page.goto('https://jsonplaceholder.typicode.com/users/1');
    
    // Parse JSON from page content
    const jsonContent = await page.locator('pre').textContent();
    const user = JSON.parse(jsonContent);
    
    // Same validations, but through UI layer
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    
    console.log('E2E validation: Data accessed through UI rendering');
  });
});
```

## 🎯 Best Practices and Patterns

### **Test Data Management**

```typescript
// Test data factory pattern
class TestDataFactory {
  static createUser(overrides = {}) {
    return {
      name: `Test User ${Date.now()}`,
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      phone: '555-0123',
      website: 'test.example.com',
      ...overrides
    };
  }
  
  static createPost(userId = 1, overrides = {}) {
    return {
      title: `Test Post ${Date.now()}`,
      body: `This is a test post created at ${new Date().toISOString()}`,
      userId,
      ...overrides
    };
  }
}

test.describe('Test Data Management', () => {
  test('should use test data factory', async ({ request }) => {
    const userData = TestDataFactory.createUser({
      name: 'Specific Test User'
    });
    
    const response = await request.post('/users', { data: userData });
    expect(response.status()).toBe(201);
    
    const createdUser = await response.json();
    expect(createdUser.name).toBe('Specific Test User');
    expect(createdUser.email).toContain('@example.com');
  });
});
```

### **Response Validation Helpers**

```typescript
// Validation helper functions
class ApiValidators {
  static validateUser(user: any) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('username');
    
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
  
  static validatePost(post: any) {
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
    
    expect(typeof post.id).toBe('number');
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
    expect(typeof post.userId).toBe('number');
  }
  
  static validateResponseTiming(startTime: number, endTime: number, maxTime: number = 5000) {
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(maxTime);
    return responseTime;
  }
}

test.describe('Validation Helpers', () => {
  test('should use validation helpers', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/users/1');
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    ApiValidators.validateUser(user);
    
    const responseTime = ApiValidators.validateResponseTiming(startTime, endTime);
    console.log(`Validated response in ${responseTime}ms`);
  });
});
```

## 📊 Debugging and Troubleshooting

### **Request/Response Logging**

```typescript
test.describe('Debugging Techniques', () => {
  test('should log detailed request/response information', async ({ request }) => {
    console.log('=== API Request Debug Info ===');
    
    const requestData = {
      title: 'Debug Test Post',
      body: 'Testing debug capabilities',
      userId: 1
    };
    
    console.log('Request URL:', '/posts');
    console.log('Request Method:', 'POST');
    console.log('Request Data:', JSON.stringify(requestData, null, 2));
    
    const response = await request.post('/posts', {
      data: requestData,
      headers: {
        'X-Debug': 'true',
        'X-Test-ID': `test-${Date.now()}`
      }
    });
    
    console.log('Response Status:', response.status());
    console.log('Response Status Text:', response.statusText());
    console.log('Response URL:', response.url());
    console.log('Response Headers:', JSON.stringify(response.headers(), null, 2));
    
    const responseData = await response.json();
    console.log('Response Data:', JSON.stringify(responseData, null, 2));
    
    expect(response.status()).toBe(201);
  });

  test('should handle and debug error responses', async ({ request }) => {
    console.log('=== Error Handling Debug ===');
    
    // Test various error scenarios
    const errorTests = [
      { url: '/posts/999999', expectedStatus: 404, description: 'Not Found' },
      { url: '/invalid-endpoint', expectedStatus: 404, description: 'Invalid Endpoint' }
    ];
    
    for (const errorTest of errorTests) {
      console.log(`\nTesting: ${errorTest.description}`);
      console.log(`URL: ${errorTest.url}`);
      
      const response = await request.get(errorTest.url);
      
      console.log(`Status: ${response.status()}`);
      console.log(`Status Text: ${response.statusText()}`);
      
      expect(response.status()).toBe(errorTest.expectedStatus);
      
      try {
        const errorData = await response.json();
        console.log('Error Response Data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('No JSON error data available');
      }
    }
  });
});
```

## ✅ Practical Exercises

### **Exercise 1: Basic CRUD Operations**

```typescript
test.describe('Exercise: Basic CRUD Operations', () => {
  let createdPostId: number;
  
  test('should create a post (CREATE)', async ({ request }) => {
    const postData = {
      title: 'Exercise Post',
      body: 'This post is created for exercise purposes',
      userId: 1
    };
    
    const response = await request.post('/posts', { data: postData });
    expect(response.status()).toBe(201);
    
    const createdPost = await response.json();
    createdPostId = createdPost.id;
    
    expect(createdPost.title).toBe(postData.title);
    expect(createdPost.body).toBe(postData.body);
    expect(createdPost.userId).toBe(postData.userId);
  });
  
  test('should read the created post (READ)', async ({ request }) => {
    // This would normally use the createdPostId from the previous test
    // For demo purposes, we'll use a known ID
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);
    
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
  });
});
```

## 🚀 Next Steps and Integration

This lesson has established your foundation in API testing with Playwright. In upcoming lessons, you'll learn:

- **Lesson 10**: Advanced HTTP methods (PUT, PATCH, DELETE)
- **Lesson 11**: Authentication patterns and security testing
- **Lesson 12**: Response validation and schema testing
- **Lesson 14**: Combining API and E2E testing strategies

The skills you've learned here will be essential for creating comprehensive test suites that validate both your application's backend logic and user experience.

---

**🎭 Excellent progress! You now understand how to use Playwright's request fixture for API testing and can see how it complements your E2E testing skills. This balanced approach will make you a more effective automation engineer!**