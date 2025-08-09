# Exercises: Contract-First Development and Testing

## Exercise 1: Read and Interpret an OpenAPI Specification

**Objective:** Understand how to extract key information from an OpenAPI document.

**Instructions:**

Use the following snippet from an `openapi.yaml` file to answer the questions below.

```yaml
openapi: 3.0.1
info:
  title: Simple To-Do List API
  version: 2.0.0
paths:
  /todos:
    get:
      summary: "List all to-do items"
      operationId: "listTodos"
      tags:
        - "todos"
      parameters:
        - name: "limit"
          in: "query"
          description: "Maximum number of items to return"
          schema:
            type: "integer"
            format: "int32"
      responses:
        "200":
          description: "A list of to-do items."
          content:
            application/json:
              schema:
                type: "array"
                items:
                  $ref: "#/components/schemas/Todo"
  /todos/{todoId}:
    put:
      summary: "Update an existing to-do"
      operationId: "updateTodo"
      parameters:
        - name: "todoId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TodoUpdate"
      responses:
        "200":
          description: "To-do updated successfully."
        "400":
          description: "Invalid input."

components:
  schemas:
    Todo:
      type: "object"
      required:
        - "id"
        - "title"
        - "completed"
      properties:
        id:
          type: "string"
        title:
          type: "string"
        completed:
          type: "boolean"
    TodoUpdate:
      type: "object"
      properties:
        title:
          type: "string"
        completed:
          type: "boolean"
```

**Questions:**

1.  What is the full path for the endpoint that lists all to-do items?
2.  What is the HTTP method used to update a to-do item?
3.  Is the `todoId` parameter for the update endpoint required? Where is it located (path, query, header)?
4.  When listing all to-dos, what is the name of the optional query parameter?
5.  In the `Todo` schema, which fields are mandatory?
6.  What is the data type of the `completed` field in the `Todo` schema?
7.  What is the purpose of the `TodoUpdate` schema and how does it differ from the `Todo` schema?

---

## Exercise 2: Design a Contract Conformance Test

**Objective:** Outline the steps and code for a contract conformance test.

**Instructions:**

Imagine you are testing the `GET /todos/{todoId}` endpoint (not shown in the spec above, but assume it exists and returns a single `Todo` object on success).

You are using a testing framework that has a helper object, `openapiValidator`, with the following method:
`openapiValidator.validate(response, 'get', '/todos/{todoId}', 200)`

This method returns `true` if the response conforms to the spec for a 200 OK response, and `false` otherwise.

Write a pseudocode or a conceptual test script for this scenario. Your script should:
1.  Make a `GET` request to `/todos/some-real-id`.
2.  Perform a basic check on the status code.
3.  Get the JSON body from the response.
4.  Use the `openapiValidator` to perform the contract conformance check.
5.  Assert that the conformance check passes.

---

## Exercise 3: Identify Benefits of Contract-First Workflow

**Objective:** Explain the benefits of the contract-first approach in a practical scenario.

**Instructions:**

A new "Search" feature is being added to the To-Do List API. The frontend team needs to build the search UI, the backend team needs to implement the search logic, and the QA team needs to test it.

Explain how using a contract-first approach would allow all three teams to work in parallel. Describe the specific artifact each team would use and what work they could accomplish before the backend implementation is complete.
