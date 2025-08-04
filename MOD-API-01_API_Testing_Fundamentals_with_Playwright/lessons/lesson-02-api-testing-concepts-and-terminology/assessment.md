# Assessment: API Testing Concepts

This assessment tests your understanding of the core concepts and terminology of API testing.

---

## Question 1: The Role of an API (Multiple Choice)

What is the primary role of an API in a software application?
A) To define the visual style and layout of the user interface.
B) To allow different software systems to communicate with each other using a set of rules.
C) To store data in a database.
D) To run unit tests on the application's source code.

---

## Question 2: Benefits of API Testing (Multiple Choice)

Which of the following is **NOT** a primary benefit of API testing?
A) It is generally faster than UI testing.
B) It allows for testing business logic before a UI is developed.
C) It is the best way to test visual layout and user experience.
D) It provides more stable tests that are less prone to breaking from UI changes.

---

## Question 3: Identifying Components (Short Answer)

Given the following request, identify the **Endpoint** and the **Request Payload**.

`POST https://api.inventory.com/items`
```json
{
  "sku": "XYZ-123",
  "quantity": 100
}
```

---

## Question 4: Terminology (Matching)

Match the term with its correct definition.

| Term | Definition |
|---|---|
| 1. API Contract | A) Data sent to or received from the API in the body. |
| 2. Endpoint | B) A specific URL where an API can be accessed. |
| 3. Payload | C) The documentation that defines how an API works. |

---

## Question 5: The Testing Pyramid (Short Answer)

Where does API testing fit within the Testing Pyramid, and why is it positioned there?

---

## Answer Key

### Question 1
**B) To allow different software systems to communicate with each other using a set of rules.** An API acts as an interface, enabling interaction without exposing internal complexity.

### Question 2
**C) It is the best way to test visual layout and user experience.** This is the primary purpose of UI/E2E testing, not API testing.

### Question 3
-   **Endpoint**: `https://api.inventory.com/items`
-   **Request Payload**: The JSON object `{ "sku": "XYZ-123", "quantity": 100 }`

### Question 4
1.  → C
2.  → B
3.  → A

### Question 5
API testing is in the **middle layer** of the Testing Pyramid, above Unit Tests and below UI Tests. It's positioned there because it offers a balance: it's faster and more stable than UI testing but provides more integrated, end-to-end coverage than unit tests.