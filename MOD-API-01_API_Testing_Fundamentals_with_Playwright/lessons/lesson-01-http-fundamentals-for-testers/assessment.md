# Assessment: HTTP Fundamentals for Testers

This assessment tests your understanding of HTTP concepts essential for API testing. Complete all questions to validate your knowledge before moving to the next lesson.

## Instructions

- Read each question carefully
- Select the best answer for multiple choice questions
- Provide complete explanations for open-ended questions
- Check your answers against the answer key at the end

---

## Question 1: HTTP Methods (Multiple Choice)

Which HTTP method should you use when testing an API endpoint that creates a new user account?

A) GET  
B) POST  
C) PUT  
D) DELETE  

**Explanation**: Briefly explain why this method is most appropriate for creating new resources.

---

## Question 2: Status Code Categories (Multiple Choice)

Your API test receives a response with status code 404. What category does this belong to, and what does it generally indicate?

A) 2xx - Success, the request was processed successfully  
B) 3xx - Redirection, additional action is needed  
C) 4xx - Client Error, there was a problem with the request  
D) 5xx - Server Error, the server failed to process the request  

---

## Question 3: HTTP Request Analysis (Short Answer)

Examine this HTTP request and identify what's missing that would likely cause an API test to fail:

```http
POST /api/products HTTP/1.1
Host: api.store.com
Content-Type: application/json
Content-Length: 87

{
  "name": "Test Product",
  "price": 29.99,
  "category": "Electronics"
}
```

**What's missing?** ________________________________

**Why is this important for API testing?** ________________________________

---

## Question 4: Status Code Meanings (Matching)

Match each HTTP status code with its correct meaning:

**Status Codes:**
1. 200
2. 201
3. 400
4. 401
5. 500

**Meanings:**
A) Internal Server Error  
B) Bad Request  
C) OK  
D) Created  
E) Unauthorized  

**Your Answers:**
- 1 → ___
- 2 → ___
- 3 → ___
- 4 → ___
- 5 → ___

---

## Question 5: Response Analysis (Multiple Choice)

You're testing a DELETE endpoint and receive this response:

```http
HTTP/1.1 204 No Content
Date: Sun, 20 Jul 2025 16:45:00 GMT
```

What should your API test validate about this response?

A) The response body contains confirmation data  
B) The status code indicates successful deletion with no content returned  
C) The response should have included the deleted resource data  
D) This indicates an error because there's no response body  

---

## Question 6: HTTP Headers (Short Answer)

Your API test needs to send a JSON payload to create a new resource. List three essential headers your request should include and explain why each is important:

1. **Header:** _________________ **Why:** _________________________________
2. **Header:** _________________ **Why:** _________________________________
3. **Header:** _________________ **Why:** _________________________________

---

## Question 7: Error Response Evaluation (Analysis)

Analyze this error response and answer the questions:

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  }
}
```

**Questions:**
a) Is this a client error or server error? How do you know?
b) What specific validation issue does this response indicate?
c) What test scenario would likely produce this response?

---

## Question 8: API Testing Strategy (Short Answer)

You're designing tests for a user management API with this endpoint:
`PUT /api/users/{id}` - Update user information

List four different test scenarios you should include (two happy path, two error path) and the expected status code for each:

**Happy Path Scenarios:**
1. _________________________________ (Expected: ___)
2. _________________________________ (Expected: ___)

**Error Path Scenarios:**
1. _________________________________ (Expected: ___)
2. _________________________________ (Expected: ___)

---

## Question 9: HTTP vs API Testing (Explanation)

Explain in 2-3 sentences how understanding HTTP helps you become a better API tester. What specific HTTP concepts are most important for API testing?

**Your Answer:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## Question 10: Practical Application (Multiple Choice)

You're writing an API test that needs to verify a user was successfully created. The API returns this response:

```http
HTTP/1.1 201 Created
Location: /api/users/456
Content-Type: application/json

{
  "id": 456,
  "name": "Test User",
  "email": "test@example.com"
}
```

Which validation is MOST important for confirming the user was created successfully?

A) Verify the response body contains the user data  
B) Verify the status code is 201 Created  
C) Verify the Location header points to the new resource  
D) All of the above are equally important  

---

## Answer Key

### Question 1: B) POST
**Explanation**: POST is used to create new resources. It sends data to the server to create a new entity, which is exactly what happens when creating a new user account.

### Question 2: C) 4xx - Client Error
404 specifically means "Not Found" - the requested resource doesn't exist. This is a client error because the client requested something that isn't available.

### Question 3: 
**What's missing?** Authorization header (e.g., `Authorization: Bearer <token>`)
**Why is this important?** Most APIs require authentication to prevent unauthorized access. Without proper authentication, the request will likely return 401 Unauthorized.

### Question 4:
- 1 → C (200 = OK)
- 2 → D (201 = Created)
- 3 → B (400 = Bad Request)
- 4 → E (401 = Unauthorized)
- 5 → A (500 = Internal Server Error)

### Question 5: B) The status code indicates successful deletion with no content returned
204 No Content is the standard response for successful DELETE operations where no response body is needed.

### Question 6: Sample answers:
1. **Header:** Content-Type **Why:** Tells the server what format the request body is in (e.g., application/json)
2. **Header:** Authorization **Why:** Provides authentication credentials to access protected endpoints
3. **Header:** Accept **Why:** Specifies what response format the client expects from the server

### Question 7:
a) **Client error** - 422 is in the 4xx range, indicating the client sent invalid data
b) **Invalid email format** - the email field doesn't meet the expected format requirements
c) **Sending a user creation request with an improperly formatted email address**

### Question 8: Sample answers:
**Happy Path:**
1. Update existing user with valid data (Expected: 200)
2. Update user with partial valid data (Expected: 200)

**Error Path:**
1. Update non-existent user ID (Expected: 404)
2. Update with invalid data format (Expected: 400)

### Question 9: Sample answer:
Understanding HTTP helps API testers because every API interaction uses HTTP requests and responses. The most important concepts are HTTP methods (knowing when to use GET vs POST vs PUT), status codes (understanding what 200, 400, 404 mean for test validation), and request/response structure (headers, body, authentication). This knowledge enables testers to design comprehensive test scenarios and properly validate API behavior.

### Question 10: D) All of the above are equally important
For thorough API testing, you should validate the status code (confirms operation type), the Location header (confirms resource location), and the response body (confirms data integrity). Each provides different but essential information about the success of the operation.

---

## Scoring Guide

**Excellent (9-10 correct)**: You have a strong understanding of HTTP fundamentals for API testing. You're ready to move on to the next lesson.

**Good (7-8 correct)**: You understand most concepts but should review the areas you missed before proceeding.

**Needs Improvement (5-6 correct)**: Review the lesson content and retake the assessment. Focus on HTTP methods, status codes, and request/response structure.

**Requires Review (0-4 correct)**: Please review the entire lesson content thoroughly before retaking this assessment. Consider additional practice with HTTP concepts.

---

## Next Steps

After completing this assessment:

1. **Check your answers** against the answer key
2. **Review any concepts** you missed in the lesson content
3. **Practice with real APIs** using browser DevTools or API testing tools
4. **Proceed to Lesson 2** if you scored 7 or higher
5. **Retake the assessment** if you need additional practice

Remember: HTTP fundamentals are the foundation of all API testing. Ensure you're comfortable with these concepts before moving to more advanced topics.