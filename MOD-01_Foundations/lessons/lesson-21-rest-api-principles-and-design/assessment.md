# Lesson 21: REST API Principles and Design - Assessment

## Multiple Choice Questions

1.  **Which of the following is NOT one of the six guiding constraints of REST?**
    a.  Stateless
    b.  Client-Server
    c.  Encrypted
    d.  Uniform Interface

2.  **What is the primary purpose of using nouns (e.g., `/users`) in RESTful API URIs?**
    a.  To perform an action.
    b.  To identify a resource.
    c.  To specify the data format.
    d.  To make the URI shorter.

3.  **A client sends a request, and the server has no memory of previous requests from that same client. This principle is known as:**
    a.  Layered System
    b.  Cacheable
    c.  Stateless
    d.  Code on Demand

4.  **Which HTTP method should be used to completely replace an existing resource at a specific URI?**
    a.  `POST`
    b.  `GET`
    c.  `PATCH`
    d.  `PUT`

5.  **The concept of HATEOAS (Hypermedia as the Engine of Application State) suggests that a server's response should include what?**
    a.  The status of the server.
    b.  The time the request was processed.
    c.  Links to other related actions or resources.
    d.  The client's IP address.

## Short Answer Questions

1.  **Why is it considered bad practice to use verbs in a RESTful URI (e.g., `/getUserById/123`)? What should be used instead?**
2.  **Explain the "Client-Server" constraint. Why is this separation important for modern application development?**
3.  **What does it mean for a response to be "cacheable" in the context of REST? How does this improve an application?**

## Practical Application

**Scenario:** You are designing a REST API for managing a blog. The primary resource is a "post".

1.  **Task:** Write the ideal RESTful URIs for the following actions:
    -   Get a list of all posts.
    -   Get a single post with an ID of `42`.
    -   Get all comments for the post with an ID of `42`.

2.  **Task:** For each of the following actions, state the correct HTTP method and the URI you would use:
    -   Create a new post.
    -   Delete the post with an ID of `42`.
    -   Update only the title of the post with an ID of `42`.

3.  **Task:** A `GET` request to `/posts/999` (for a post that doesn't exist) returns a `200 OK` status with an empty body `[]`. Is this good RESTful design? Why or why not? What status code would be better?