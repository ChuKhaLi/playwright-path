# Exercises: Designing APIs for Testability

## Exercise 1: Critique an API Design

**Objective:** Analyze an API endpoint design and identify testability issues.

**Instructions:**

You are on a team that is designing a new API for managing user profiles. A developer proposes the following endpoint.

**Endpoint:** `POST /updateUser`
**Request Body:**
```json
{
  "userId": 123,
  "fieldToUpdate": "email",
  "newValue": "new.email@example.com"
}
```
**Success Response:**
-   **Status:** `200 OK`
-   **Body:** `"Update successful"`

**Failure Response (e.g., user not found):**
-   **Status:** `200 OK`
-   **Body:** `"Error"`

Critique this API design from a testability perspective. Identify at least **four** specific problems and for each one, explain:
1.  **Why** it is a problem for testing.
2.  **How** you would suggest improving it (e.g., suggest a better status code, a different endpoint structure, or a more informative response body).

---

## Exercise 2: Design a Testable Error Response

**Objective:** Design a structured and informative error response.

**Instructions:**

An API for creating a new product (`POST /products`) can fail for several reasons:
1.  The `productName` field is missing.
2.  The `price` field is not a positive number.
3.  The `sku` (Stock Keeping Unit) provided already exists in the database.

Design a single, consistent error response structure that can clearly communicate all of these failure scenarios.
1.  Provide an example of the JSON error body for each of the three scenarios.
2.  Explain which HTTP status code you would use for each scenario and why.
3.  Explain how your proposed error structure makes it easier to write specific and reliable negative tests.

---

## Exercise 3: Advocate for Test Data Management

**Objective:** Formulate questions to advocate for better test data management features in an API.

**Instructions:**

You are in an API design review meeting for a new "Promotions" service. This service allows creating special discount promotions that can be applied to products.

The proposed endpoints are:
-   `POST /promotions` (Creates a new promotion)
-   `GET /promotions/{id}` (Retrieves a promotion)
-   `PUT /promotions/{id}` (Updates a promotion)

The promotions have a `startDate` and `endDate`. You need to write tests for various scenarios, including:
-   Testing an active promotion.
-   Testing an expired promotion.
-   Testing a promotion that starts in the future.

Formulate **three** specific questions you would ask the development team during the design review. Your questions should be aimed at ensuring you can reliably create and manage the test data needed for these scenarios. For each question, briefly explain the testing challenge you are trying to solve.
