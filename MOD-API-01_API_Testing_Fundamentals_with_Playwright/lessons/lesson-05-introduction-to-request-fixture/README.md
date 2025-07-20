# Lesson 05: Introduction to Request Fixture ⭐ **API FOCUS**

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:

- **LO-29**: Use Playwright's [`request`](request:1) fixture for API testing
- **LO-30**: Understand the relationship between browser context and API requests
- **LO-31**: Configure base URLs and default headers for API tests
- **LO-32**: Manage cookies and session state in API tests
- **LO-33**: Implement basic CRUD operations using GET and POST methods
- **LO-34**: Handle different data formats (JSON, form data) in API requests
- **LO-35**: Parse and validate basic API responses
- **LO-36**: Understand when to use API testing vs E2E testing

## 📚 Lesson Overview

**Duration**: 1-2 hours  
**Type**: API Foundation  
**Prerequisites**: Lessons 01-04 (Playwright Setup and Basic E2E Concepts)

This lesson introduces you to Playwright's powerful API testing capabilities through the request fixture. You'll learn how to make HTTP requests, handle responses, and understand when API testing complements E2E testing in your automation strategy.

## 🌐 What is API Testing?

API (Application Programming Interface) testing involves testing the communication between different software components directly at the API level, without going through the user interface.

### **API Testing vs E2E Testing**

| Aspect | API Testing | E2E Testing |
|--------|-------------|-------------|
| **Speed** | Very fast (milliseconds) | Slower (seconds) |
| **Scope** | Backend logic and data | Full user journey |
| **Reliability** | Highly stable | Can be flaky |
| **Maintenance** | Low maintenance | Higher maintenance |
| **User Experience** | No UI validation | Complete UX validation |
| **Data Setup** | Excellent for test data | Limited data control |

### **When to Use Each Approach**

**Use API Testing For**:
- Data validation and business logic
- Authentication and authorization
- Performance and load testing
- Test data setup and teardown
- Integration between services
- Regression testing of backend changes

**Use E2E Testing For**:
- User workflow validation
- UI/UX verification
- Cross-browser compatibility
- Visual regression testing
- Complete user journey testing

## 🎭 Playwright's Request Fixture

Playwright's [`request`](request:1) fixture provides a powerful way to make HTTP requests without launching a browser. It's built on the same network stack as Playwright's browser automation, ensuring consistency.

### **Key Features**

- **Shared Context**: Can share cookies and authentication with browser tests
- **Built-in Retry Logic**: Automatic retries for failed requests
- **Rich Response Handling**: Easy parsing of JSON, text, and binary responses
- **Request Interception**: Can intercept and modify requests
- **TypeScript Support**: Full type safety for requests and responses

## 🚀 Getting Started with Request Fixture

### **Basic Request Structure**

```typescript
import { test, expect } from '@playwright/test';

test('basic API request', async ({ request }) => {
  // Make a GET request
  const response = await request.get('https://api.example.com/users');
  
  // Verify response
  expect(response.status()).toBe(200);
  
  // Parse response data
  const users = await response.json();
  console.log(users);
});
```

### **Request Fixture Methods**

The request fixture provides methods for all HTTP verbs:

- **[`request.get()`](request.get():1)**: GET requests
- **[`request.post()`](request.post():1)**: POST requests  
- **[`request.put()`](request.put():1)**: PUT requests
- **[`request.patch()`](request.patch():1)**: PATCH requests
- **[`request.delete()`](request.delete():1)**: DELETE requests
- **[`request.head()`](request.head():1)**: HEAD requests

## 📝 Basic API Operations

### **GET Requests - Reading Data**

```typescript
import { test, expect } from '@playwright/test';

test.describe('GET Requests', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should fetch a single user', async ({ request }) => {
    // Make GET request
    const response = await request.get(`${baseURL}/users/1`);
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Verify response headers
    expect(response.headers()['content-type']).toContain('application/json');
    
    // Parse and verify response data
    const user = await response.json();
    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('username');
    
    // Verify data types
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
  });

  test('should fetch multiple users', async ({ request }) => {
    const response = await request.get(`${baseURL}/users`);
    
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // Verify each user has required properties
    users.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });
  });

  test('should handle query parameters', async ({ request }) => {
    // Request with query parameters
    const response = await request.get(`${baseURL}/posts`, {
      params: {
        userId: 1,
        _limit: 5
      }
    });
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeLessThanOrEqual(5);
    
    // Verify all posts belong to userId 1
    posts.forEach(post => {
      expect(post.userId).toBe(1);
    });
  });
});
```

### **POST Requests - Creating Data**

```typescript
test.describe('POST Requests', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should create a new post', async ({ request }) => {
    // Prepare test data
    const newPost = {
      title: 'My New Post',
      body: 'This is the content of my new post.',
      userId: 1
    };

    // Make POST request
    const response = await request.post(`${baseURL}/posts`, {
      data: newPost,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Verify response status (201 = Created)
    expect(response.status()).toBe(201);
    
    // Parse and verify response data
    const createdPost = await response.json();
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    
    // Verify the ID was assigned
    expect(typeof createdPost.id).toBe('number');
    expect(createdPost.id).toBeGreaterThan(0);
  });

  test('should create a user with nested data', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        zipcode: '12345'
      },
      phone: '555-1234',
      website: 'johndoe.com'
    };

    const response = await request.post(`${baseURL}/users`, {
      data: newUser
    });
    
    expect(response.status()).toBe(201);
    
    const createdUser = await response.json();
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.address.city).toBe(newUser.address.city);
  });
});
```

## 🔧 Request Configuration

### **Setting Base URL and Default Headers**

```typescript
// In playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      },
    },
  ],
});
```

### **Using Base URL in Tests**

```typescript
test('should use configured base URL', async ({ request }) => {
  // Uses baseURL from config, so '/users' becomes 'https://jsonplaceholder.typicode.com/users'
  const response = await request.get('/users/1');
  expect(response.status()).toBe(200);
});
```

### **Custom Headers for Individual Requests**

```typescript
test('should send custom headers', async ({ request }) => {
  const response = await request.get('/users/1', {
    headers: {
      'User-Agent': 'Playwright-Test-Runner',
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Custom-Header': 'test-value'
    }
  });
  
  expect(response.status()).toBe(200);
});
```

## 📊 Response Handling

### **Different Response Types**

```typescript
test.describe('Response Handling', () => {
  test('should handle JSON responses', async ({ request }) => {
    const response = await request.get('/users/1');
    
    // Parse as JSON
    const user = await response.json();
    expect(user).toHaveProperty('name');
  });

  test('should handle text responses', async ({ request }) => {
    const response = await request.get('/posts/1');
    
    // Get response as text
    const text = await response.text();
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  test('should handle response headers', async ({ request }) => {
    const response = await request.get('/users/1');
    
    // Access response headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    expect(headers).toHaveProperty('server');
    
    // Check specific header
    const contentType = response.headers()['content-type'];
    expect(contentType).toBeDefined();
  });

  test('should handle response status and timing', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/users');
    const endTime = Date.now();
    
    // Check response status
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);
    
    // Check response timing
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    
    console.log(`Response time: ${responseTime}ms`);
  });
});
```

### **Error Handling**

```typescript
test.describe('Error Handling', () => {
  test('should handle 404 errors', async ({ request }) => {
    const response = await request.get('/users/999999');
    
    expect(response.status()).toBe(404);
    expect(response.ok()).toBe(false);
  });

  test('should handle network errors gracefully', async ({ request }) => {
    // Test with invalid URL
    try {
      const response = await request.get('https://invalid-domain-that-does-not-exist.com/api');
      // If we get here, the request somehow succeeded (unexpected)
      expect(response.status()).toBeGreaterThanOrEqual(400);
    } catch (error) {
      // Network error is expected
      expect(error).toBeDefined();
    }
  });

  test('should validate error response structure', async ({ request }) => {
    const response = await request.get('/posts/999999');
    
    if (response.status() === 404) {
      // Some APIs return empty object for 404
      const errorData = await response.json();
      expect(errorData).toBeDefined();
    }
  });
});
```

## 🔄 Comparing API and E2E Approaches

### **Same Functionality, Different Approaches**

Let's compare testing user creation through both API and E2E:

#### **API Approach**
```typescript
test('should create user via API', async ({ request }) => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser'
  };

  const response = await request.post('/users', { data: userData });
  expect(response.status()).toBe(201);
  
  const createdUser = await response.json();
  expect(createdUser.name).toBe(userData.name);
  expect(createdUser.email).toBe(userData.email);
  
  // Fast, reliable, focuses on data validation
});
```

#### **E2E Approach**
```typescript
test('should create user via UI', async ({ page }) => {
  await page.goto('/register');
  
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Username').fill('testuser');
  await page.getByRole('button', { name: 'Register' }).click();
  
  await expect(page.getByText('User created successfully')).toBeVisible();
  
  // Slower, tests complete user experience
});
```

### **When to Use Each Approach**

**Use API Testing When**:
- Testing business logic and data validation
- Setting up test data quickly
- Testing error conditions and edge cases
- Validating backend integrations
- Performance testing

**Use E2E Testing When**:
- Testing user workflows and experience
- Validating UI behavior and appearance
- Testing cross-browser compatibility
- Ensuring accessibility compliance
- Testing visual elements and layouts

## 🎯 Best Practices

### **Test Organization**
```typescript
// Organize API tests by resource/endpoint
test.describe('Users API', () => {
  test.describe('GET /users', () => {
    // GET tests here
  });
  
  test.describe('POST /users', () => {
    // POST tests here
  });
});
```

### **Data Management**
```typescript
// Use test data factories
const createTestUser = () => ({
  name: `Test User ${Date.now()}`,
  email: `test-${Date.now()}@example.com`,
  username: `testuser${Date.now()}`
});

test('should create unique users', async ({ request }) => {
  const userData = createTestUser();
  const response = await request.post('/users', { data: userData });
  expect(response.status()).toBe(201);
});
```

### **Response Validation**
```typescript
// Create reusable validation functions
const validateUser = (user: any) => {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

test('should return valid user data', async ({ request }) => {
  const response = await request.get('/users/1');
  const user = await response.json();
  validateUser(user);
});
```

## 📚 Additional Resources

### **Official Documentation**
- [Playwright API Testing](https://playwright.dev/docs/api-testing) ⭐⭐⭐⭐⭐
- [Request Fixture Documentation](https://playwright.dev/docs/api/class-apirequestcontext) ⭐⭐⭐⭐⭐
- [HTTP Methods Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) ⭐⭐⭐⭐

### **Practice APIs**
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) ⭐⭐⭐⭐⭐
- [ReqRes](https://reqres.in/) ⭐⭐⭐⭐
- [HTTPBin](https://httpbin.org/) ⭐⭐⭐⭐

### **Tools and Extensions**
- [Postman](https://www.postman.com/) ⭐⭐⭐⭐
- [Insomnia](https://insomnia.rest/) ⭐⭐⭐⭐
- [REST Client VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) ⭐⭐⭐

## ✅ Lesson Completion Checklist

- [ ] Understand the difference between API and E2E testing
- [ ] Can use Playwright's request fixture for basic operations
- [ ] Successfully make GET and POST requests
- [ ] Can handle different response types (JSON, text)
- [ ] Understand how to configure base URLs and headers
- [ ] Can validate API responses and handle errors
- [ ] Know when to choose API testing vs E2E testing

## 🚀 Next Steps

In **Lesson 06: Basic Locators and Selectors**, you'll return to E2E testing and learn:
- Built-in locator strategies
- Test-id patterns for stable element identification
- CSS and XPath selectors
- Locator best practices

Then in **Lesson 10: API Request Methods and Data Handling**, you'll expand your API testing skills with:
- PUT, PATCH, and DELETE operations
- Advanced data handling techniques
- Complex request scenarios
- Response validation patterns

---

**🎭 Congratulations! You've taken your first steps into API testing with Playwright. You now understand how API testing complements E2E testing and can make basic HTTP requests to validate backend functionality!**