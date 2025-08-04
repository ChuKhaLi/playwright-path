# Examples: Terminology in Action

This file illustrates the key API testing terms from the lesson using a hypothetical "Product Management" API.

---

## Scenario: A Simple Product API

Imagine we are testing an API for managing a product catalog. The base URL for our API is `https://api.ecommerce.com/v1`.

### Example 1: Deconstructing a `GET` Request

Let's analyze a request to get a specific product.

**The Request:**
`GET https://api.ecommerce.com/v1/products/987`

-   **Endpoint**: The full URL, `https://api.ecommerce.com/v1/products/987`, is the endpoint. It's the specific "address" we are contacting.
-   **Resource**: The request is asking for the "product" resource. Specifically, it's targeting the product with the ID `987`.
-   **Path Parameter**: The value `987` in the URL is a path parameter, used to identify the unique resource we want.

**The Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 987,
  "name": "Wireless Mouse",
  "price": 24.99,
  "inStock": true
}
```

-   **Response Payload**: The JSON object `{ "id": 987, ... }` is the response payload. It contains the data for the requested resource.

---

### Example 2: Deconstructing a `POST` Request

Now, let's look at a request to create a new product.

**The Request:**
```http
POST https://api.ecommerce.com/v1/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Mechanical Keyboard",
  "price": 129.99,
  "category": "Peripherals"
}
```

-   **Endpoint**: `https://api.ecommerce.com/v1/products`. Notice we are targeting the general "products" collection, not a specific one.
-   **Request Payload**: The JSON object `{ "name": "Mechanical Keyboard", ... }` is the request payload. This is the data we are sending to the server to create the new resource.

---

### Example 3: Using Query Parameters

Let's find all products that are in the "Peripherals" category and sort them by price.

**The Request:**
`GET https://api.ecommerce.com/v1/products?category=Peripherals&sortBy=price`

-   **Query Parameters**:
    -   `category=Peripherals`: This parameter filters the results to only include products in the "Peripherals" category.
    -   `sortBy=price`: This parameter tells the server to sort the results by price.

---

### Example 4: The API Contract

The "rulebook" for our Product API might look something like this (a simplified version of what you'd find in OpenAPI/Swagger documentation):

**Endpoint**: `GET /products/{productId}`
-   **Description**: Retrieves a single product by its ID.
-   **Path Parameter**: `productId` (integer, required) - The unique ID of the product.
-   **Success Response (200 OK)**:
    -   **Payload**: A JSON object with `id`, `name`, `price`, and `inStock`.
-   **Error Response (404 Not Found)**:
    -   **Payload**: A JSON object with an `error` message.

**Endpoint**: `POST /products`
-   **Description**: Creates a new product.
-   **Request Payload**: A JSON object with `name` (string, required), `price` (number, required), and `category` (string, optional).
-   **Success Response (201 Created)**:
    -   **Payload**: The newly created product object, including its server-generated `id`.

**How a tester uses this contract**:
-   Your test for `GET /products/{productId}` would verify that the response payload contains the four specified fields.
-   Your test for `POST /products` would try sending a request *without* the required `name` field and assert that the API returns a `400 Bad Request` error, as dictated by the contract.