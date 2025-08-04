# Exercises: Concept Check

These exercises will help you solidify your understanding of the core API testing concepts and terminology covered in this lesson.

---

## Exercise 1: Identifying Components

Analyze the following HTTP request and identify each labeled component.

**The Request:**
`POST https://api.shipping.com/v2/shipments?expedite=true`

```json
{
  "recipient": "Jane Doe",
  "address": "123 Main St",
  "weight_kg": 2.5
}
```

**Your Task:**
1.  **Endpoint**: What is the full endpoint?
2.  **Path Parameter**: Are there any path parameters? If so, what are they?
3.  **Query Parameter**: What is the query parameter and its value?
4.  **Request Payload**: Describe the request payload.

---

## Exercise 2: Why API Testing?

In your own words, list and briefly explain the top three benefits of API testing compared to relying only on UI testing.

---

## Exercise 3: Matching Terminology

Match the term on the left with the best description on the right.

| Term | Description |
|---|---|
| 1. API Contract | A) The data sent in the body of a request or response. |
| 2. Resource | B) The "address" of an API, a specific URL. |
| 3. Endpoint | C) An object or entity that the API provides information about. |
| 4. Payload | D) The documentation or "rulebook" for an API. |

---

## Exercise 4: The Testing Pyramid

Draw a simple diagram of the Testing Pyramid and label the three main layers. For each layer, briefly state what kind of tests are performed there.

---

## Answer Key

### Exercise 1 Answers
1.  **Endpoint**: `https://api.shipping.com/v2/shipments?expedite=true`
2.  **Path Parameter**: There are no path parameters in this example.
3.  **Query Parameter**: The query parameter is `expedite` with a value of `true`.
4.  **Request Payload**: The request payload is a JSON object containing the recipient's name, address, and the shipment's weight.

### Exercise 2 Sample Answer
1.  **Speed**: API tests are much faster because they don't need to load a browser or render a UI.
2.  **Stability**: APIs are generally more stable than UIs, so tests are less likely to break from cosmetic changes.
3.  **Early Feedback**: API tests can be written and run before the UI is complete, allowing developers to find bugs earlier.

### Exercise 3 Answers
1.  → D
2.  → C
3.  → B
4.  → A

### Exercise 4 Sample Answer
```
      /_\
     / UI \   <-- End-to-End tests that simulate a real user journey.
    /_______\
   /   API   \  <-- Service-level tests that check business logic without a UI.
  /___________\
 / Unit Tests  \ <-- Code-level tests that check individual functions or components.
/_______________\