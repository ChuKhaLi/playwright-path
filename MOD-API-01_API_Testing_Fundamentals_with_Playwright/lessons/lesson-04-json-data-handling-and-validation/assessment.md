# Assessment: JSON Data Handling and Validation

This assessment tests your ability to read, understand, and validate JSON structures.

---

## Question 1: JSON Syntax (Multiple Choice)

Which of the following is a syntactically correct JSON object?
A) `{ name: "John Doe" }`
B) `{ "name": 'John Doe' }`
C) `{ "name": "John Doe" }`
D) `( "name": "John Doe" )`

---

## Question 2: Data Types (Multiple Choice)

In the JSON below, what is the data type of the `roles` value?
```json
{
  "user": "test_user",
  "roles": [ "reader", "commenter" ],
  "verified": true
}
```
A) Object
B) String
C) Array
D) Boolean

---

## Question 3: Parsing (Short Answer)

In a Playwright test, you have a response object named `response`. What method would you call to parse the JSON body into a JavaScript object, and what keyword must you use before the call?

---

## Question 4: Validation (Code Assertion)

Given the following JSON response stored in a variable `body`, write a Playwright `expect` assertion to verify that the `city` is "New York".

```json
{
  "id": 123,
  "address": {
    "street": "123 Broadway",
    "city": "New York"
  }
}
```

---

## Question 5: Array Validation (Code Assertion)

Given the following JSON response stored in a variable `body`, write a Playwright `expect` assertion to verify that the `data` array contains exactly two items.

```json
{
  "data": [
    { "id": 1 },
    { "id": 2 }
  ]
}
```

---

## Answer Key

### Question 1
**C) `{ "name": "John Doe" }`**. JSON keys must be strings in double quotes, and string values must also be in double quotes.

### Question 2
**C) Array**. The value of `roles` is enclosed in square brackets `[]`, which denotes an array.

### Question 3
You would call the `.json()` method, and you must use the `await` keyword before it.
**Example**: `const body = await response.json();`

### Question 4
```typescript
expect(body.address.city).toBe("New York");
```

### Question 5
```typescript
expect(body.data).toHaveLength(2);