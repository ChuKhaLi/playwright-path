# Lesson 22: JSON Data Structures - Hands-On Practice

## Objective

This exercise will test your ability to read, interpret, and analyze JSON data structures. You will work with sample JSON responses to extract specific information, which is a core skill for API testing.

## Setup

No special setup is needed. All tasks are based on analyzing the provided JSON snippets. You can use a text editor or an online JSON viewer (like [JSONLint](https://jsonlint.com/)) to format the JSON for better readability if you wish.

---

### Task 1: Simple Object Analysis

**JSON Data:**
```json
{
  "productId": "A-45-Z",
  "productName": "Wireless Mouse",
  "inStock": true,
  "price": 29.99,
  "color": null
}
```

**Questions:**
1.  What is the data type of the `price` value?
2.  What is the value of the `inStock` key?
3.  Does this product have a color specified? How do you know?

---

### Task 2: Nested Object Analysis

**JSON Data:**
```json
{
  "orderId": "ORD-2024-03-15-001",
  "customer": {
    "id": "CUST-1138",
    "name": "Ben Kenobi",
    "address": {
      "street": "123 Desert Way",
      "city": "Tatooine",
      "country": "Outer Rim"
    }
  },
  "itemCount": 1
}
```

**Questions:**
1.  How would you access the customer's name?
2.  What is the value of the `city`?
3.  What is the data type of the `customer` field?

---

### Task 3: Array of Objects Analysis

**JSON Data:**
```json
[
  {
    "id": 10,
    "title": "Fix login button",
    "status": "completed",
    "assignee": "alice"
  },
  {
    "id": 11,
    "title": "Update documentation",
    "status": "in-progress",
    "assignee": "bob"
  },
  {
    "id": 12,
    "title": "Deploy to production",
    "status": "pending",
    "assignee": null
  }
]
```

**Questions:**
1.  What is the top-level structure of this JSON data (object or array)?
2.  How many items are in this list?
3.  What is the `title` of the second item in the list?
4.  Who is assigned to the task with `id` 11?
5.  Is anyone assigned to the task with `id` 12?

---

### Task 4: Complex Structure Analysis

**JSON Data:**
```json
{
  "quizId": "QZ-MATH-101",
  "title": "Basic Algebra Quiz",
  "questions": [
    {
      "id": "q1",
      "text": "What is 2 + 2?",
      "options": [ "3", "4", "5" ],
      "answer": "4"
    },
    {
      "id": "q2",
      "text": "What is 5 * 3?",
      "options": [ "15", "20", "25" ],
      "answer": "15"
    }
  ],
  "config": {
    "timeLimitMinutes": 10,
    "shuffleQuestions": true
  }
}
```

**Questions:**
1.  How would you access the text of the first question?
2.  What is the data type of the `questions` field?
3.  What is the third option for the question with `id` "q2"?
4.  What is the value of the `shuffleQuestions` setting?

## Solutions
<details>
<summary>Click to view solutions</summary>

### Task 1
1.  Number
2.  `true`
3.  No, the value for the `color` key is `null`.

### Task 2
1.  `customer` -> `name`
2.  "Tatooine"
3.  Object

### Task 3
1.  Array
2.  3
3.  "Update documentation"
4.  "bob"
5.  No, the `assignee` is `null`.

### Task 4
1.  `questions` -> (first element of the array) -> `text`
2.  Array (of objects)
3.  "25"
4.  `true`

</details>