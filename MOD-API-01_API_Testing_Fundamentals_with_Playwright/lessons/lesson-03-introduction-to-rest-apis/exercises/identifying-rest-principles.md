# Exercises: Identifying REST Principles

These exercises will help you apply your knowledge of REST principles to real-world examples.

---

## Exercise 1: RESTful or Not?

For each of the following API endpoints, decide if it follows RESTful principles. If not, explain why and suggest a more RESTful alternative.

1.  `POST /api/v1/updateUserEmail`
2.  `GET /api/v1/products/45/details`
3.  `GET /api/v1/orders`
4.  `DELETE /api/v1/delete_item/99`
5.  `POST /api/v1/users/123`

---

## Exercise 2: The Stateless Constraint

Imagine you are testing an e-commerce API. You have a test that adds an item to a shopping cart, and then a separate test that checks out the cart.

**Test 1: Add Item**
`POST /api/cart/add`
Payload: `{ "itemId": "abc", "quantity": 1 }`

**Test 2: Checkout**
`POST /api/cart/checkout`

According to the **stateless** constraint of REST, what critical piece of information is missing from the second request (`/api/cart/checkout`) for it to work reliably?

---

## Exercise 3: Designing RESTful Endpoints

You need to design a set of endpoints for managing "comments" on a blog post. The blog posts themselves are found at `/posts/{postId}`.

**Your Task**: Design the RESTful endpoints for the following actions:
1.  Get all comments for a specific post.
2.  Add a new comment to a specific post.
3.  Get a single, specific comment.
4.  Delete a specific comment.

---

## Answer Key

### Exercise 1 Answers

1.  **Not RESTful**. It uses a verb ("update") in the URL.
    -   **Reason**: The action should be defined by the HTTP method.
    -   **RESTful Alternative**: `PATCH /api/v1/users/{userId}` with a payload of `{ "email": "new@email.com" }`.

2.  **RESTful**. This is a good way to get a specific aspect (details) of a resource. It treats "details" as a nested resource of the product.

3.  **RESTful**. This is the standard, predictable way to retrieve a collection of resources.

4.  **Not RESTful**. It uses a verb ("delete_item") in the URL.
    -   **Reason**: The action should be defined by the HTTP method.
    -   **RESTful Alternative**: `DELETE /api/v1/items/99`.

5.  **Ambiguous, but likely Not RESTful**. Using `POST` on a specific resource URL is not a standard REST pattern. If the goal is to update, it should be `PUT` or `PATCH`. If the goal is to perform some other action, the endpoint is poorly designed.

### Exercise 2 Answer

The `checkout` request is missing information that identifies **which cart** to check out. Because of the stateless constraint, the server doesn't remember that the same client just added an item. The request must be self-contained.

A more RESTful, stateless approach would require the client to manage the cart ID.

**Test 1 Response might include a cart ID:**
`{ "cartId": "xyz-789", ... }`

**Test 2 would then use that ID:**
`POST /api/carts/xyz-789/checkout`

This way, the server doesn't have to maintain any session state.

### Exercise 3 Sample Answer

1.  **Get all comments for a post**: `GET /posts/{postId}/comments`
2.  **Add a new comment**: `POST /posts/{postId}/comments`
3.  **Get a single comment**: `GET /comments/{commentId}` (assuming comments have a globally unique ID) or `GET /posts/{postId}/comments/{commentId}`.
4.  **Delete a specific comment**: `DELETE /comments/{commentId}` or `DELETE /posts/{postId}/comments/{commentId}`.