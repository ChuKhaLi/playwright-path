# Exercise: Architecting a Microservices Test Strategy

## Objective

To design a holistic testing strategy for a new feature in a microservices-based application, combining API-level tests and a targeted E2E test.

## Scenario

You are testing a new "Leave a Review" feature on an e-commerce site. The feature involves the following services:
-   **UI Service:** The frontend application.
-   **Authentication Service:** Handles user login.
-   **Products Service:** Provides product information.
-   **Reviews Service:** A new service to create and retrieve reviews.

**The User Flow:**
1.  A logged-in user navigates to a product page.
2.  The user fills out a review form (rating, comment) and submits it.
3.  The review appears on the product page.

## Your Task

### 1. Design the API Test Strategy

For each service, describe one important API-level test you would write. You don't need to write the code, just describe the test's purpose.

-   **Authentication Service:** What would you test to ensure a user can get a valid token?
-   **Products Service:** What would you test to ensure you can retrieve a single product?
-   **Reviews Service:**
    -   What would you test to ensure a review can be created successfully (`POST /api/reviews`)?
    -   What would you test to ensure reviews for a specific product can be retrieved (`GET /api/products/:id/reviews`)?

### 2. Create an API Service Client

-   Write the code for a `ReviewsAPIService.ts` class.
-   It should have two methods:
    -   `createReview(reviewData: ReviewInput): Promise<Review>`
    -   `getReviewsForProduct(productId: string): Promise<Review[]>`
-   Define the necessary `Review` and `ReviewInput` interfaces.

### 3. Create a Test Fixture

-   Create a fixture named `reviewableProduct`.
-   This fixture should use the API to:
    1.  Create a new user via an (assumed) `AuthenticationService`.
    2.  Create a new product via a `ProductsAPIService`.
    3.  `use` an object containing the `authToken`, `userId`, and `productId`.
    4.  Clean up (delete) the user and product in the teardown phase.

### 4. Write a Targeted E2E Test

-   Using your `reviewableProduct` fixture, write a single, targeted E2E test.
-   The test should:
    1.  Use the `authToken` from the fixture to log in programmatically (e.g., by setting cookies or local storage).
    2.  Navigate directly to the created product's page using its `productId`.
    3.  Use the UI to fill out and submit the review form.
    4.  Assert that the new review is visible on the page.
    5.  **(Bonus):** Use the `ReviewsAPIService` to make a `GET` request and assert that the review was saved correctly in the backend.

## Submission

Submit the following:
-   A markdown file with your answers to Part 1.
-   `services/ReviewsAPIService.ts`
-   `fixtures/review.fixture.ts`
-   `tests/e2e/leave-review.spec.ts`

This exercise demonstrates a modern approach to testing, where you use fast, reliable API calls for setup and verification, and reserve slow UI interactions only for the specific feature you are testing.