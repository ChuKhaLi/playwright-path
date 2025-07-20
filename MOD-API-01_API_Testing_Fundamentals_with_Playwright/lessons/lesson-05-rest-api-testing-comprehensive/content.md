# Lesson 05: REST API Testing Comprehensive - Content

## 📚 Comprehensive Learning Content

### **Section 1: CRUD Operations Mastery**

#### **1.1 CREATE Operations (POST)**

**Understanding POST Requests**
POST requests are used to create new resources. They should be idempotent when possible and return appropriate status codes.

**Example: User Creation API**

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Creation API Tests', () => {
  const baseURL = 'https://api.example.com/v1';
  
  test('should create a new user successfully', async ({ request }) => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user'
    };

    const response = await request.post(`${baseURL}/users`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    // Validate response status
    expect(response.status()).toBe(201);
    
    // Validate response structure
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.name).toBe(userData.name);
    expect(responseBody.email).toBe(userData.email);
    expect(responseBody).toHaveProperty('createdAt');
    
    // Validate response headers
    expect(response.headers()['content-type']).toContain('application/json');
    expect(response.headers()).toHaveProperty('location');
  });

  test('should handle validation errors for invalid data', async ({ request }) => {
    const invalidUserData = {
      name: '', // Empty name should trigger validation error
      email: 'invalid-email', // Invalid email format
      role: 'invalid-role' // Invalid role
    };

    const response = await request.post(`${baseURL}/users`, {
      data: invalidUserData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(400);
    
    const errorResponse = await response.json();
    expect(errorResponse).toHaveProperty('errors');
    expect(errorResponse.errors).toContain('Name is required');
    expect(errorResponse.errors).toContain('Invalid email format');
    expect(errorResponse.errors).toContain('Invalid role specified');
  });

  test('should prevent duplicate user creation', async ({ request }) => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'user'
    };

    // Create user first time
    const firstResponse = await request.post(`${baseURL}/users`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });
    expect(firstResponse.status()).toBe(201);

    // Attempt to create same user again
    const duplicateResponse = await request.post(`${baseURL}/users`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(duplicateResponse.status()).toBe(409); // Conflict
    const errorBody = await duplicateResponse.json();
    expect(errorBody.message).toContain('User with this email already exists');
  });
});
```

#### **1.2 READ Operations (GET)**

**Single Resource Retrieval**

```typescript
test.describe('User Retrieval API Tests', () => {
  let createdUserId: string;

  test.beforeEach(async ({ request }) => {
    // Create a test user for retrieval tests
    const userData = {
      name: 'Test User',
      email: 'test.user@example.com',
      role: 'user'
    };

    const createResponse = await request.post(`${baseURL}/users`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    const createdUser = await createResponse.json();
    createdUserId = createdUser.id;
  });

  test('should retrieve user by ID', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/${createdUserId}`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user.id).toBe(createdUserId);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });

  test('should return 404 for non-existent user', async ({ request }) => {
    const nonExistentId = '999999';
    
    const response = await request.get(`${baseURL}/users/${nonExistentId}`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(404);
    
    const errorBody = await response.json();
    expect(errorBody.message).toContain('User not found');
  });
});
```

**Bulk Resource Retrieval with Pagination**

```typescript
test.describe('User List API Tests', () => {
  test('should retrieve paginated user list', async ({ request }) => {
    const response = await request.get(`${baseURL}/users?page=1&limit=10`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    
    // Validate pagination structure
    expect(responseBody).toHaveProperty('data');
    expect(responseBody).toHaveProperty('pagination');
    expect(responseBody.pagination).toHaveProperty('page');
    expect(responseBody.pagination).toHaveProperty('limit');
    expect(responseBody.pagination).toHaveProperty('total');
    expect(responseBody.pagination).toHaveProperty('totalPages');
    
    // Validate data structure
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeLessThanOrEqual(10);
    
    // Validate individual user structure
    if (responseBody.data.length > 0) {
      const firstUser = responseBody.data[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('email');
    }
  });

  test('should handle filtering and sorting', async ({ request }) => {
    const response = await request.get(`${baseURL}/users?role=admin&sort=name&order=asc`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    
    // Validate filtering
    responseBody.data.forEach(user => {
      expect(user.role).toBe('admin');
    });
    
    // Validate sorting (check if names are in ascending order)
    for (let i = 1; i < responseBody.data.length; i++) {
      expect(responseBody.data[i].name >= responseBody.data[i-1].name).toBe(true);
    }
  });
});
```

#### **1.3 UPDATE Operations (PUT/PATCH)**

**Complete Resource Update (PUT)**

```typescript
test.describe('User Update API Tests', () => {
  let testUserId: string;

  test.beforeEach(async ({ request }) => {
    // Create test user
    const userData = {
      name: 'Original Name',
      email: 'original@example.com',
      role: 'user',
      profile: {
        bio: 'Original bio',
        location: 'Original location'
      }
    };

    const createResponse = await request.post(`${baseURL}/users`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    const createdUser = await createResponse.json();
    testUserId = createdUser.id;
  });

  test('should update user completely with PUT', async ({ request }) => {
    const updatedUserData = {
      name: 'Updated Name',
      email: 'updated@example.com',
      role: 'admin',
      profile: {
        bio: 'Updated bio',
        location: 'Updated location'
      }
    };

    const response = await request.put(`${baseURL}/users/${testUserId}`, {
      data: updatedUserData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(200);
    
    const updatedUser = await response.json();
    expect(updatedUser.id).toBe(testUserId);
    expect(updatedUser.name).toBe(updatedUserData.name);
    expect(updatedUser.email).toBe(updatedUserData.email);
    expect(updatedUser.role).toBe(updatedUserData.role);
    expect(updatedUser.profile.bio).toBe(updatedUserData.profile.bio);
    expect(updatedUser.profile.location).toBe(updatedUserData.profile.location);
    
    // Verify updatedAt timestamp changed
    expect(updatedUser.updatedAt).not.toBe(updatedUser.createdAt);
  });

  test('should partially update user with PATCH', async ({ request }) => {
    const partialUpdate = {
      name: 'Partially Updated Name'
    };

    const response = await request.patch(`${baseURL}/users/${testUserId}`, {
      data: partialUpdate,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(200);
    
    const updatedUser = await response.json();
    expect(updatedUser.name).toBe(partialUpdate.name);
    // Other fields should remain unchanged
    expect(updatedUser.email).toBe('original@example.com');
    expect(updatedUser.role).toBe('user');
  });
});
```

#### **1.4 DELETE Operations**

```typescript
test.describe('User Deletion API Tests', () => {
  let testUserId: string;

  test.beforeEach(async ({ request }) => {
    // Create test user for deletion
    const userData = {
      name: 'User To Delete',
      email: 'delete.me@example.com',
      role: 'user'
    };

    const createResponse = await request.post(`${baseURL}/users`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    const createdUser = await createResponse.json();
    testUserId = createdUser.id;
  });

  test('should delete user successfully', async ({ request }) => {
    const deleteResponse = await request.delete(`${baseURL}/users/${testUserId}`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(deleteResponse.status()).toBe(204); // No Content
    
    // Verify user is actually deleted
    const getResponse = await request.get(`${baseURL}/users/${testUserId}`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(getResponse.status()).toBe(404);
  });

  test('should handle deletion of non-existent user', async ({ request }) => {
    const nonExistentId = '999999';
    
    const response = await request.delete(`${baseURL}/users/${nonExistentId}`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(404);
  });

  test('should prevent deletion of user with dependencies', async ({ request }) => {
    // Assuming this user has related data that prevents deletion
    const protectedUserId = 'user-with-orders';
    
    const response = await request.delete(`${baseURL}/users/${protectedUserId}`, {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(409); // Conflict
    
    const errorBody = await response.json();
    expect(errorBody.message).toContain('Cannot delete user with existing orders');
  });
});
```

### **Section 2: API Versioning Testing**

#### **2.1 URL-Based Versioning**

```typescript
test.describe('API Versioning Tests', () => {
  test('should handle different API versions', async ({ request }) => {
    const userData = {
      name: 'Version Test User',
      email: 'version.test@example.com'
    };

    // Test v1 API
    const v1Response = await request.post('https://api.example.com/v1/users', {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(v1Response.status()).toBe(201);
    const v1User = await v1Response.json();
    
    // Test v2 API (might have additional fields)
    const v2Response = await request.post('https://api.example.com/v2/users', {
      data: {
        ...userData,
        preferences: {
          theme: 'dark',
          notifications: true
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(v2Response.status()).toBe(201);
    const v2User = await v2Response.json();
    
    // Compare version differences
    expect(v1User).toHaveProperty('id');
    expect(v1User).toHaveProperty('name');
    expect(v1User).not.toHaveProperty('preferences');
    
    expect(v2User).toHaveProperty('id');
    expect(v2User).toHaveProperty('name');
    expect(v2User).toHaveProperty('preferences');
  });

  test('should maintain backward compatibility', async ({ request }) => {
    // Test that v1 endpoints still work when v2 is available
    const v1ListResponse = await request.get('https://api.example.com/v1/users', {
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(v1ListResponse.status()).toBe(200);
    
    const v1Data = await v1ListResponse.json();
    expect(v1Data).toHaveProperty('data');
    expect(Array.isArray(v1Data.data)).toBe(true);
    
    // Ensure v1 response structure is maintained
    if (v1Data.data.length > 0) {
      const user = v1Data.data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      // v1 should not include v2-specific fields
      expect(user).not.toHaveProperty('preferences');
    }
  });
});
```

#### **2.2 Header-Based Versioning**

```typescript
test.describe('Header-Based API Versioning', () => {
  test('should handle version through Accept header', async ({ request }) => {
    const userData = {
      name: 'Header Version Test',
      email: 'header.test@example.com'
    };

    // Test with v1 Accept header
    const v1Response = await request.post('https://api.example.com/users', {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.api+json;version=1',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(v1Response.status()).toBe(201);
    
    // Test with v2 Accept header
    const v2Response = await request.post('https://api.example.com/users', {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.api+json;version=2',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(v2Response.status()).toBe(201);
    
    // Validate version-specific responses
    const v1User = await v1Response.json();
    const v2User = await v2Response.json();
    
    // Both should have basic fields
    expect(v1User).toHaveProperty('id');
    expect(v2User).toHaveProperty('id');
    
    // v2 might have additional metadata
    expect(v2User).toHaveProperty('metadata');
    expect(v1User).not.toHaveProperty('metadata');
  });
});
```

### **Section 3: Rate Limiting and Throttling**

#### **3.1 Rate Limit Detection and Handling**

```typescript
test.describe('Rate Limiting Tests', () => {
  test('should handle rate limiting gracefully', async ({ request }) => {
    const requests = [];
    const maxRequests = 100; // Assuming rate limit is 100 requests per minute
    
    // Send multiple requests rapidly
    for (let i = 0; i < maxRequests + 10; i++) {
      requests.push(
        request.get('https://api.example.com/v1/users', {
          headers: {
            'Authorization': 'Bearer your-token-here'
          }
        })
      );
    }

    const responses = await Promise.all(requests);
    
    // Check for rate limiting responses
    const rateLimitedResponses = responses.filter(response => response.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
    
    // Validate rate limit headers
    const firstResponse = responses[0];
    const headers = firstResponse.headers();
    
    expect(headers).toHaveProperty('x-ratelimit-limit');
    expect(headers).toHaveProperty('x-ratelimit-remaining');
    expect(headers).toHaveProperty('x-ratelimit-reset');
    
    // Check rate limited response
    if (rateLimitedResponses.length > 0) {
      const rateLimitedResponse = rateLimitedResponses[0];
      const errorBody = await rateLimitedResponse.json();
      
      expect(errorBody).toHaveProperty('message');
      expect(errorBody.message).toContain('Rate limit exceeded');
      expect(rateLimitedResponse.headers()).toHaveProperty('retry-after');
    }
  });

  test('should implement retry with exponential backoff', async ({ request }) => {
    const makeRequestWithRetry = async (url: string, maxRetries = 3) => {
      let attempt = 0;
      
      while (attempt < maxRetries) {
        try {
          const response = await request.get(url, {
            headers: {
              'Authorization': 'Bearer your-token-here'
            }
          });

          if (response.status() === 429) {
            // Rate limited, calculate backoff
            const retryAfter = response.headers()['retry-after'];
            const backoffTime = retryAfter ? 
              parseInt(retryAfter) * 1000 : 
              Math.pow(2, attempt) * 1000; // Exponential backoff
            
            console.log(`Rate limited. Retrying after ${backoffTime}ms`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            attempt++;
            continue;
          }

          return response;
        } catch (error) {
          attempt++;
          if (attempt >= maxRetries) throw error;
          
          // Exponential backoff for other errors
          const backoffTime = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
      
      throw new Error(`Max retries (${maxRetries}) exceeded`);
    };

    const response = await makeRequestWithRetry('https://api.example.com/v1/users');
    expect(response.status()).toBe(200);
  });
});
```

### **Section 4: Complex Data Handling**

#### **4.1 Nested JSON Structures**

```typescript
test.describe('Complex Data Structure Tests', () => {
  test('should handle deeply nested JSON objects', async ({ request }) => {
    const complexUserData = {
      name: 'Complex User',
      email: 'complex@example.com',
      profile: {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'USA',
            coordinates: {
              latitude: 37.7749,
              longitude: -122.4194
            }
          }
        },
        professional: {
          title: 'Software Engineer',
          company: 'Tech Corp',
          experience: [
            {
              company: 'Previous Corp',
              role: 'Junior Developer',
              startDate: '2018-01-01',
              endDate: '2020-12-31',
              technologies: ['JavaScript', 'React', 'Node.js']
            },
            {
              company: 'Current Corp',
              role: 'Senior Developer',
              startDate: '2021-01-01',
              endDate: null,
              technologies: ['TypeScript', 'React', 'GraphQL', 'AWS']
            }
          ]
        },
        preferences: {
          notifications: {
            email: true,
            sms: false,
            push: true,
            frequency: 'daily'
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false
          }
        }
      }
    };

    const response = await request.post('https://api.example.com/v1/users', {
      data: complexUserData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(response.status()).toBe(201);
    
    const createdUser = await response.json();
    
    // Validate nested structure preservation
    expect(createdUser.profile.personal.address.coordinates.latitude).toBe(37.7749);
    expect(createdUser.profile.professional.experience).toHaveLength(2);
    expect(createdUser.profile.professional.experience[0].technologies).toContain('JavaScript');
    expect(createdUser.profile.preferences.notifications.frequency).toBe('daily');
    
    // Validate array handling
    expect(Array.isArray(createdUser.profile.professional.experience)).toBe(true);
    expect(Array.isArray(createdUser.profile.professional.experience[0].technologies)).toBe(true);
  });

  test('should validate nested object updates', async ({ request }) => {
    // First create a user with complex data
    const userData = {
      name: 'Update Test User',
      email: 'update.test@example.com',
      profile: {
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: false
          }
        }
      }
    };

    const createResponse = await request.post('https://api.example.com/v1/users', {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    const createdUser = await createResponse.json();
    
    // Update nested preferences
    const updateData = {
      profile: {
        preferences: {
          theme: 'dark',
          notifications: {
            email: false,
            push: true,
            sms: true // New field
          }
        }
      }
    };

    const updateResponse = await request.patch(`https://api.example.com/v1/users/${createdUser.id}`, {
      data: updateData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      }
    });

    expect(updateResponse.status()).toBe(200);
    
    const updatedUser = await updateResponse.json();
    
    // Validate nested updates
    expect(updatedUser.profile.preferences.theme).toBe('dark');
    expect(updatedUser.profile.preferences.notifications.email).toBe(false);
    expect(updatedUser.profile.preferences.notifications.push).toBe(true);
    expect(updatedUser.profile.preferences.notifications.sms).toBe(true);
    
    // Ensure non-updated nested fields are preserved
    expect(updatedUser.profile.preferences.language).toBe('en');
  });
});
```

### **Section 5: Error Handling and Edge Cases**

#### **5.1 Comprehensive Error Scenario Testing**

```typescript
test.describe('Error Handling Tests', () => {
  test('should handle various HTTP error codes appropriately', async ({ request }) => {
    const errorScenarios = [
      {
        scenario: 'Unauthorized access',
        endpoint: '/users',
        headers: {}, // No authorization header
        expectedStatus: 401,
        expectedMessage: 'Unauthorized'
      },
      {
        scenario: 'Forbidden access',
        endpoint: '/admin/users',
        headers: { 'Authorization': 'Bearer user-token' }, // User token for admin endpoint
        expectedStatus: 403,
        expectedMessage: 'Forbidden'
      },
      {
        scenario: 'Invalid JSON payload',
        endpoint: '/users',
        headers: { 
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        },
        data: '{"invalid": json}', // Invalid JSON
        expectedStatus: 400,
        expectedMessage: 'Invalid JSON'
      },
      {
        scenario: 'Unsupported media type',
        endpoint: '/users',
        headers: { 
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'text/plain'
        },
        data: 'plain text data',
        expectedStatus: 415,
        expectedMessage: 'Unsupported Media Type'
      }
    ];

    for (const scenario of errorScenarios) {
      console.log(`Testing scenario: ${scenario.scenario}`);
      
      const response = await request.post(`https://api.example.com/v1${scenario.endpoint}`, {
        data: scenario.data || { name: 'Test' },
        headers: scenario.headers
      });

      expect(response.status()).toBe(scenario.expectedStatus);
      
      const errorBody = await response.json();
      expect(errorBody.message).toContain(scenario.expectedMessage);
      
      // Validate error response structure
      expect(errorBody).toHaveProperty('error');
      expect(errorBody).toHaveProperty('timestamp');
      expect(errorBody).toHaveProperty('path');
    }
  });

  test('should handle network timeouts and connection errors', async ({ request }) => {
    // Test with very short timeout
    const shortTimeoutRequest = request.get('https://api.example.com/v1/slow-endpoint', {
      timeout: 100, // 100ms timeout
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    await expect(shortTimeoutRequest).rejects.toThrow();
  });
});
```

This comprehensive content covers the essential patterns for professional REST API testing. The examples demonstrate real-world scenarios that learners will encounter in enterprise environments.

---

> 💡 **Key Takeaway**: This content transforms basic API testing knowledge into professional-level expertise through comprehensive, real-world examples and patterns.