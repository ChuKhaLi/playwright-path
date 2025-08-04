# Lesson 4: Assessment

## Knowledge Check

1.  **Question:** What is the primary advantage of a "contract-first" approach to API development?
    -   a) It allows developers to write code faster because they don't need to worry about documentation.
    -   b) It enables parallel work across backend, frontend, and QA teams by establishing a formal agreement (the contract) upfront.
    -   c) It is a more secure way to build APIs.
    -   d) It results in smaller API response sizes.

2.  **Question:** In an OpenAPI specification, what is the purpose of the `components/schemas` section?
    -   a) To define the available API endpoints (paths).
    -   b) To list the security requirements for the API.
    -   c) To define reusable data models (schemas) that can be referenced throughout the API specification, promoting DRY principles.
    -   d) To describe the high-level information about the API, like its title and version.

3.  **Question:** What is "contract conformance testing"?
    -   a) Testing the performance of the API against the contract's specified limits.
    -   b) A manual process of reading the contract and comparing it to the application's behavior.
    -   c) An automated process of validating that the actual API implementation's requests and responses adhere to the rules defined in the API contract.
    -   d) Testing that the generated client SDK works correctly.

4.  **Question:** Which of the following is NOT a direct benefit of using a tool like `openapi-generator-cli`?
    -   a) It can generate a fully typed client SDK in various languages.
    -   b) It can automatically write your business logic for the API.
    -   c) It can generate boilerplate server code (stubs).
    -   d) It helps ensure the client and server are aligned with the contract from the start.

## Practical Exercise

### Objective

Read and interpret an OpenAPI specification, and then write a contract conformance test for one of its endpoints.

### Scenario

You are given a snippet of an `openapi.yaml` file for a "ToDo" API. Your task is to write a test that verifies the `GET /todos/{id}` endpoint conforms to this contract.

### Provided OpenAPI Snippet

```yaml
# openapi.yaml
openapi: 3.0.1
info:
  title: Simple ToDo API
  version: '1.0'
paths:
  /todos/{id}:
    get:
      summary: Get a ToDo item by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            format: int64
            example: 1
      responses:
        '200':
          description: A single ToDo item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Todo'
        '404':
          description: ToDo item not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Todo:
      type: object
      properties:
        id:
          type: integer
          format: int64
        title:
          type: string
        completed:
          type: boolean
          default: false
        createdAt:
          type: string
          format: date-time
      required:
        - id
        - title
        - completed
        - createdAt
    Error:
      type: object
      properties:
        code:
          type: integer
        message:
          type: string
      required:
        - code
        - message
```

### Your Task

1.  **Set up the Test:**
    -   Assume you have a test environment where this ToDo API is running.
    -   You will need a library for contract validation. For this exercise, you can use a conceptual validator. If you were implementing this for real, you might use a library like `chai-openapi-response-validator`.

2.  **Write a Test Case for the Success Scenario (`200 OK`):**
    -   The test should be named: `should return a valid ToDo item that conforms to the contract`.
    -   Make a `GET` request to `/todos/1` (assuming an item with ID 1 exists).
    -   Assert that the HTTP status is `200`.
    -   **Perform contract validation:** Validate the response body against the `Todo` schema defined in the OpenAPI spec. Your validation should check:
        -   The response is a valid object.
        -   All required fields (`id`, `title`, `completed`, `createdAt`) are present.
        -   The data types of these fields are correct (e.g., `id` is a number, `title` is a string, `completed` is a boolean).

3.  **Write a Test Case for the Failure Scenario (`404 Not Found`):**
    -   The test should be named: `should return a valid error response for a non-existent ToDo item`.
    -   Make a `GET` request to `/todos/9999` (an ID that is unlikely to exist).
    -   Assert that the HTTP status is `404`.
    -   **Perform contract validation:** Validate the response body against the `Error` schema. Your validation should check for the presence and correct types of the `code` and `message` fields.

### Expected Outcome

Two test cases that not only check the functional behavior of the API (correct status codes) but also programmatically verify that the structure of the API's responses matches the formal contract. This ensures that the API is not just "working" but is "working as specified."