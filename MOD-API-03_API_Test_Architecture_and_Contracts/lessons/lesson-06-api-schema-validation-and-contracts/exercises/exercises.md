# Exercises: API Schema Validation and Contracts

## Exercise 1: Write a JSON Schema

**Objective:** Create a JSON Schema to define the structure of a given JSON object.

**Instructions:**

You have the following example JSON object representing a `Product`.

```json
{
  "productId": "abc-123-xyz",
  "productName": "Super Widget",
  "price": 19.99,
  "inStock": true,
  "tags": ["gadget", "tech"],
  "dimensions": {
    "length": 5.5,
    "width": 3.0,
    "height": 1.2
  }
}
```

Create a JSON Schema that validates this object. Your schema must enforce the following rules:
1.  `productId`, `productName`, and `price` are required fields.
2.  `productId` and `productName` must be strings.
3.  `price` must be a number.
4.  `inStock` must be a boolean.
5.  `tags` must be an array of strings.
6.  `dimensions` must be an object containing three required number fields: `length`, `width`, and `height`.

---

## Exercise 2: Validate and Report Errors

**Objective:** Analyze API responses against a schema and report clear errors.

**Instructions:**

You are given the `Product` schema you created in Exercise 1. You are also given the following three API responses. For each response, determine if it is **valid** or **invalid** according to the schema.

If a response is **invalid**, identify the specific validation error(s).

**Response A:**
```json
{
  "productId": "def-456",
  "productName": "Mega Gadget",
  "price": 25,
  "inStock": true,
  "tags": ["gadget", "new"]
}
```

**Response B:**
```json
{
  "productId": "ghi-789",
  "productName": "Power Gizmo",
  "price": "49.99",
  "inStock": true,
  "tags": ["gadget", "power"],
  "dimensions": {
    "length": 10,
    "width": 8,
    "height": 4
  }
}
```

**Response C:**
```json
{
  "productId": "jkl-012",
  "productName": "Ultra Device",
  "price": 150.00,
  "inStock": false,
  "tags": "device",
  "dimensions": {
    "length": 12,
    "width": 9,
    "height": 3
  }
}
```

---

## Exercise 3: Connect Schema Validation to OpenAPI

**Objective:** Explain how to use an OpenAPI specification as the source of truth for schema validation.

**Instructions:**

You are working with an OpenAPI specification that contains the following definition for the `GET /products/{id}` endpoint:

```yaml
paths:
  /products/{id}:
    get:
      summary: "Get a product by ID"
      responses:
        '200':
          description: "Successful response"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: "Product not found"

components:
  schemas:
    Product:
      # (Assume the schema from Exercise 1 is here)
```

You are writing a test for this endpoint. Your test framework has an `OpenApiValidator` helper class.

1.  Describe the **workflow** your test would follow to validate the response of `GET /products/abc-123` against the OpenAPI spec.
2.  What are the key pieces of information your test needs to provide to the `OpenApiValidator` to find the correct schema? (Hint: There are at least 4).
3.  Why is this approach more maintainable than keeping your JSON schemas in separate `.json` files?
