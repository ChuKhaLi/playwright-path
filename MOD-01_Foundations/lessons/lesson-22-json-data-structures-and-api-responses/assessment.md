# Lesson 22: JSON Data Structures - Assessment

## Multiple Choice Questions

1.  **What does JSON stand for?**
    a.  Java Standard Object Notation
    b.  JavaScript Object Notation
    c.  JavaScript Standard Object Naming
    d.  Java Source Object Naming

2.  **Which character is used to enclose a JSON object?**
    a.  `[]` (Square Brackets)
    b.  `()` (Parentheses)
    c.  `{}` (Curly Braces)
    d.  `<>` (Angle Brackets)

3.  **In a JSON key/value pair, the key must always be what data type?**
    a.  A number
    b.  A boolean
    c.  A string in double quotes
    d.  Any valid JSON type

4.  **Which of the following is NOT a valid JSON data type?**
    a.  `null`
    b.  `array`
    c.  `undefined`
    d.  `boolean`

5.  **What does the structure `[ { "id": 1 }, { "id": 2 } ]` represent in JSON?**
    a.  An object containing two arrays.
    b.  An array containing two objects.
    c.  An object with a key of "id".
    d.  A string.

## Short Answer Questions

1.  **What are the two fundamental structures that JSON is built on?**
2.  **Explain the difference between a JSON object and a JSON array.**
3.  **Why is JSON the preferred data format for most modern REST APIs? Name at least two reasons.**

## Practical Application

**Given the following JSON data representing a user's profile:**

```json
{
  "userId": 5,
  "username": "api_tester",
  "isVerified": true,
  "profile": {
    "firstName": "Alex",
    "lastName": "Ray",
    "location": "New York"
  },
  "roles": [
    "editor",
    "contributor"
  ],
  "lastActivity": null
}
```

1.  **Task:** What is the data type of the `isVerified` field?
2.  **Task:** How would you access the user's `lastName`? (Describe the path, e.g., "start at the root object, go to the...").
3.  **Task:** What is the value of the second element in the `roles` array?
4.  **Task:** Is the following statement true or false based on the JSON above: "The user has logged in at least once." Explain your reasoning.