# Lesson 5 Assessment: Objects and Interfaces for Test Data

## Multiple Choice Questions

1.  **What is the primary purpose of an `interface` in TypeScript?**
    a)  To create an instance of an object.
    b)  To define a "blueprint" or "contract" for an object's structure.
    c)  To store a collection of values.
    d)  To perform an action.

2.  **How do you define an optional property in an interface?**
    a)  By adding `optional` before the property name.
    b)  By adding a `*` after the property name.
    c)  By adding a `?` after the property name.
    d)  By assigning it a default value of `null`.

3.  **Which of the following objects would cause a TypeScript error if its type was set to the `TestConfig` interface below?**
    ```typescript
    interface TestConfig {
      browser: string;
      timeout: number;
      headless: boolean;
    }
    ```
    a)  `const config = { browser: "Chrome", timeout: 30000, headless: true };`
    b)  `const config = { browser: "Firefox", timeout: 10000 };`
    c)  `const config = { browser: "Edge", timeout: 60000, headless: false, retries: 2 };`
    d)  Both b and c.

4.  **Why are interfaces particularly useful for test automation?**
    a)  They make the test execution faster.
    b)  They help structure complex test data and API responses, ensuring consistency.
    c)  They are the only way to create objects in TypeScript.
    d)  They automatically generate test data.

5.  **What is the main benefit of using an interface as a type for a function parameter?**
    a)  It allows the function to accept any type of object.
    b)  It guarantees that any object passed to the function will have the correct properties and types.
    c)  It makes the function return a value.
    d)  It automatically logs the object's properties to the console.

## Practical Exercise

1.  **Define an Interface for API Responses:**
    -   Imagine you are testing an API that returns product information. Define an `interface` named `ApiResponseProduct`.
    -   It should have the following properties and types:
        -   `id` (number)
        -   `title` (string)
        -   `price` (number)
        -   `description` (string)
        -   `category` (string)
        -   `inStock` (boolean)
        -   `rating` (an object with two properties: `rate` (number) and `count` (number))
        -   `promoCode` (string, but it's not always present)

2.  **Create Mock API Data:**
    -   Create a `const` variable named `mockProductResponse`.
    -   Assign it an object that conforms to the `ApiResponseProduct` interface. Use your own example data. Make sure to include the optional `promoCode`.
    -   Create a second `const` variable named `mockProductWithoutPromo` that also conforms to the interface but *omits* the optional `promoCode`.

3.  **Create a Verification Function:**
    -   Write a function named `verifyProductPrice`.
    -   It should accept two parameters:
        -   `product` (with the type `ApiResponseProduct`).
        -   `maxPrice` (a `number`).
    -   The function should return a `boolean`.
    -   Inside the function, return `true` if the `product.price` is less than or equal to `maxPrice`, and `false` otherwise.

4.  **Use the Function:**
    -   Call `verifyProductPrice` with your `mockProductResponse` and a `maxPrice` of `100`. Log the result to the console with a descriptive message.
    -   Call `verifyProductPrice` with your `mockProductWithoutPromo` and a `maxPrice` of `20`. Log the result to the console.

## Answer Key

### Multiple Choice
1.  b) To define a "blueprint" or "contract" for an object's structure.
2.  c) By adding a `?` after the property name.
3.  b) `const config = { browser: "Firefox", timeout: 10000 };` (Error: `headless` property is missing). Note: `c` would also cause an error in some strict configurations because of the extra `retries` property, but `b` is definitively an error.
4.  b) They help structure complex test data and API responses, ensuring consistency.
5.  b) It guarantees that any object passed to the function will have the correct properties and types.

### Practical Exercise (Example Solution)
```typescript
// 1. Define an Interface
interface ApiResponseProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  rating: {
    rate: number;
    count: number;
  };
  promoCode?: string; // Optional property
}

// 2. Create Mock API Data
const mockProductResponse: ApiResponseProduct = {
  id: 1,
  title: "Gaming Mouse",
  price: 75.50,
  description: "A high-performance gaming mouse.",
  category: "electronics",
  inStock: true,
  rating: {
    rate: 4.8,
    count: 250
  },
  promoCode: "GAMER20"
};

const mockProductWithoutPromo: ApiResponseProduct = {
  id: 2,
  title: "Coffee Mug",
  price: 15.00,
  description: "A sturdy ceramic coffee mug.",
  category: "kitchenware",
  inStock: true,
  rating: {
    rate: 4.5,
    count: 500
  }
};

// 3. Create a Verification Function
function verifyProductPrice(product: ApiResponseProduct, maxPrice: number): boolean {
  return product.price <= maxPrice;
}

// 4. Use the Function
const isGamingMouseInBudget = verifyProductPrice(mockProductResponse, 100);
console.log(`Is the Gaming Mouse within the $100 budget? ${isGamingMouseInBudget}`); // true

const isMugInBudget = verifyProductPrice(mockProductWithoutPromo, 20);
console.log(`Is the Coffee Mug within the $20 budget? ${isMugInBudget}`); // true