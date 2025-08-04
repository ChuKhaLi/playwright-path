# Lesson 6: Assessment

## Knowledge Check

1.  **Question:** What is the primary purpose of API schema validation?
    -   a) To check if the API server is online.
    -   b) To verify that the API response's structure, data types, and format match a predefined contract.
    -   c) To measure the performance and response time of an API endpoint.
    -   d) To assert that a specific field in the response has a specific value (e.g., `id` is 123).

2.  **Question:** In a JSON Schema definition, what does the `required` keyword specify?
    -   a) The total number of properties the object must have.
    -   b) A list of property names that must be present in the object.
    -   c) The data type of the object.
    -   d) A list of properties that must have non-null values.

3.  **Question:** Why is it beneficial to use an OpenAPI specification as the source for schema validation?
    -   a) It's the only way to perform schema validation.
    -   b) It guarantees the API has no bugs.
    -   c) It ensures that the API's implementation, documentation, and tests are all aligned with the same single source of truth.
    -   d) It makes the tests run faster.

4.  **Question:** You are testing an API. A developer adds a new, optional field to a response object. Assuming your tests are using proper schema validation, what is the expected outcome?
    -   a) The tests will fail because the response has changed.
    -   b) The tests will pass, because adding a new optional field is a backward-compatible change and does not violate the existing schema rules for required fields.
    -   c) The tests will throw an error and stop execution.
    -   d) The tests will automatically update the schema to include the new field.

## Practical Exercise

### Objective

Implement a schema validation test for a given API response using Ajv and a JSON Schema. Then, refactor the test to use an OpenAPI specification as the source of truth.

### Scenario

You are testing a `POST /products` endpoint that creates a new product. The API response for a successful creation should look like this:

```json
{
  "id": 101,
  "name": "Wireless Mouse",
  "price": 25.99,
  "tags": ["electronics", "computer"],
  "stock": {
    "warehouse": 50,
    "retail": 20
  },
  "status": "active"
}
```

### Part 1: Validation with a Standalone JSON Schema

1.  **Create the JSON Schema:**
    -   Create a file named `product.schema.json`.
    -   Write a JSON Schema that defines the structure of the product response. It should include:
        -   `id` (integer)
        -   `name` (string)
        -   `price` (number)
        -   `tags` (array of strings)
        -   `stock` (an object with `warehouse` and `retail` properties, both integers)
        -   `status` (a string that must be either "active" or "discontinued")
    -   Make `id`, `name`, and `price` required fields.

2.  **Write the Test:**
    -   Create a test file `product-creation.spec.ts`.
    -   Write a test named `should return a valid product object after creation`.
    -   In the test, simulate an API call that returns the sample response above.
    -   Use the `SchemaValidator` class (from the lesson content) and the `product.schema.json` you created to validate the response.
    -   Assert that the validation is successful.
    -   Write a second test to show what happens with an invalid response (e.g., `price` is a string instead of a number) and assert that the validation fails with a meaningful error message.

### Part 2: Refactoring to Use an OpenAPI Specification

1.  **Create an OpenAPI Snippet:**
    -   Create a file named `ecommerce-api.yaml`.
    -   Write a small OpenAPI specification for the `POST /products` endpoint.
    -   Define the `201 Created` response.
    -   Instead of defining the schema inline, put the product schema inside the `components/schemas/Product` section and reference it using `$ref`.

2.  **Refactor the Test:**
    -   Modify your `product-creation.spec.ts` test.
    -   Use the `OpenApiValidator` class from the lesson.
    -   Load the `ecommerce-api.yaml` spec.
    -   Remove the direct import of `product.schema.json`.
    -   Call the `openApiValidator.validateResponse()` method to validate the API response against the schema defined in the OpenAPI spec.
    -   Assert that the validation is successful.

### Expected Outcome

-   A `product.schema.json` file with a correct schema definition.
-   An `ecommerce-api.yaml` file with a valid OpenAPI snippet.
-   A test file demonstrating both direct schema validation and OpenAPI-driven validation. This shows you understand both methods and can refactor from one to the other, proving you can integrate schema validation into a mature, specification-driven testing workflow.