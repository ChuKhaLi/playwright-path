# Assessment: Introduction to REST APIs

This assessment tests your understanding of the core principles of REST architecture.

---

## Question 1: Defining REST (Multiple Choice)

What is REST?
A) A programming language for building APIs.
B) A strict protocol, similar to HTTP.
C) An architectural style for designing networked applications.
D) A type of database.

---

## Question 2: The Stateless Constraint (Multiple Choice)

What does it mean for a RESTful API to be "stateless"?
A) The API cannot store any data in a database.
B) The server does not store any client session information between requests.
C) The client does not need to send an authentication token.
D) The API can only be used for read-only operations.

---

## Question 3: Uniform Interface (Short Answer)

The "Uniform Interface" is a central constraint of REST. Name two of its four sub-constraints.

---

## Question 4: RESTful Endpoint Design (Multiple Choice)

Which of the following endpoints is the MOST RESTful way to retrieve the user with an ID of 42?
A) `POST /getUser` with a body of `{ "id": 42 }`
B) `GET /users/42`
C) `GET /users?user_id=42`
D) `GET /User42`

---

## Question 5: HTTP Methods (Matching)

Match the HTTP method with the corresponding RESTful action (CRUD operation).

| Method | Action |
|---|---|
| 1. GET | A) Create |
| 2. POST | B) Read |
| 3. PUT | C) Update |
| 4. DELETE | D) Delete |

---

## Answer Key

### Question 1
**C) An architectural style for designing networked applications.** REST provides a set of guidelines, not a strict protocol.

### Question 2
**B) The server does not store any client session information between requests.** Each request from the client must contain all the information needed to be understood and processed.

### Question 3
Any two of the following:
-   Identification of resources (e.g., using URLs).
-   Manipulation of resources through representations (e.g., JSON).
-   Self-descriptive messages.
-   Hypermedia as the Engine of Application State (HATEOAS).

### Question 4
**B) `GET /users/42`**. This is the most conventional RESTful approach. It clearly identifies the resource (`users`) and the specific instance (`42`) in the path and uses the correct HTTP method (`GET`) for retrieval.

### Question 5
1.  → B (Read)
2.  → A (Create)
3.  → C (Update)
4.  → D (Delete)