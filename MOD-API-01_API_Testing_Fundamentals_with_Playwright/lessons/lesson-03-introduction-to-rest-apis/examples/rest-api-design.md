# Examples: REST API Design in Practice

This file provides examples of good (RESTful) and bad (non-RESTful) API design. Analyzing these will help you develop an intuition for what to expect from a well-structured API.

---

## Scenario: Managing a Collection of "Articles"

### Good RESTful Design

A well-designed RESTful API for managing articles would use HTTP methods and plural nouns for its endpoints.

| Action | HTTP Method | Endpoint | Description |
|---|---|---|---|
| Get all articles | `GET` | `/articles` | Retrieves a list of all articles. |
| Get one article | `GET` | `/articles/123` | Retrieves the specific article with ID 123. |
| Create an article | `POST` | `/articles` | Creates a new article. |
| Update an article | `PUT` | `/articles/123` | Replaces the entire article with ID 123. |
| Partially update | `PATCH` | `/articles/123` | Partially updates the article with ID 123. |
| Delete an article | `DELETE` | `/articles/123` | Deletes the article with ID 123. |

**Key Characteristics of this Good Design:**
-   **Resource-Oriented**: The URL focuses on the noun (`/articles`), not the verb.
-   **Uses HTTP Methods Semantically**: The action is determined by the HTTP method, not the URL.
-   **Predictable**: The structure is consistent and easy to understand.

### Bad (Non-RESTful) Design

A poorly designed, non-RESTful API often puts the action (the verb) into the URL itself.

| Action | HTTP Method | Endpoint | Description |
|---|---|---|---|
| Get all articles | `GET` | `/getAllArticles` | The action "getAll" is in the URL. |
| Get one article | `GET` | `/getArticleById?id=123` | Uses query params instead of path params. |
| Create an article | `POST` | `/createNewArticle` | Redundant verb in the URL. |
| Update an article | `POST` | `/updateArticle` | Uses `POST` for an update action. |
| Delete an article | `GET` | `/deleteArticle?id=123` | **Very bad practice**: Uses `GET` for a destructive action. |

**Why this design is bad:**
-   **Not Intuitive**: The URLs are inconsistent and harder to predict.
-   **Violates HTTP Semantics**: Using `GET` for a delete operation is dangerous because `GET` requests can be cached or pre-fetched by browsers, leading to accidental deletions.
-   **Verbose**: The URLs are longer and less clean.

---

## Scenario: Statelessness in Action

### Good RESTful Design (Stateless)

Every request contains the necessary authentication token.

**Request 1:**
```http
GET /articles/123
Authorization: Bearer <token>
```

**Request 2 (seconds later):**
```http
GET /articles/456
Authorization: Bearer <token>
```
The server doesn't need to remember who the client is between requests.

### Bad Design (Stateful)

The client logs in once, and the server has to maintain that session.

**Request 1 (Login):**
```http
POST /login
{ "user": "test", "pass": "pwd" }
```
**Response:**
`Set-Cookie: session_id=xyz;`

**Request 2 (Get Article):**
```http
GET /getArticle?id=123
Cookie: session_id=xyz
```
This is not RESTful because the server must maintain the state (`session_id=xyz` belongs to a logged-in user). The second request is not self-contained.

---

## Testing Implications

-   When testing a **good RESTful API**, you can write clean, predictable tests. You know that to check if a `DELETE` worked, you can just run a `GET` to the same endpoint and expect a `404`.
-   When testing a **badly designed API**, your tests will be more complex. You might have to test a `GET /deleteArticle` endpoint and then test a `GET /getAllArticles` endpoint to see if the item is truly gone. Your test logic becomes less intuitive.