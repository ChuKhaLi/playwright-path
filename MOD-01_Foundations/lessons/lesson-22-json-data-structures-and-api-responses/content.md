# Lesson 22: JSON Data Structures and API Responses

## Learning Objectives

By the end of this lesson, you will be able to:
-   Define JSON and explain its purpose in web communication.
-   Identify the basic syntax and data types of JSON.
-   Read and understand the structure of a simple or nested JSON object.
-   Differentiate between a JSON object and a JSON array.
-   Analyze a real-world API response formatted in JSON.

## Introduction

**JSON (JavaScript Object Notation)** is a lightweight, text-based format for data interchange. It is easy for humans to read and write and easy for machines to parse and generate. While it originated from JavaScript, it is now a language-independent data format. Today, it is the de facto standard for sending data between web servers and clients in RESTful APIs.

## 1. JSON Syntax and Data Types

JSON is built on two fundamental structures:

1.  **A collection of key/value pairs.** In most languages, this is realized as an *object*, *dictionary*, or *hash map*.
2.  **An ordered list of values.** In most languages, this is realized as an *array* or *list*.

### Key/Value Pairs
-   Keys must be **strings** enclosed in double quotes (`"`).
-   Values can be any of the valid JSON data types.
-   A colon (`:`) separates the key from the value.
-   Comma (`,`) separates key/value pairs within an object.

### JSON Data Types
-   **String:** Text in double quotes (e.g., `"Hello, World!"`).
-   **Number:** An integer or a floating-point number (e.g., `101`, `3.14`).
-   **Boolean:** `true` or `false`.
-   **Null:** Represents an empty or non-existent value, written as `null`.
-   **Object:** An unordered collection of key/value pairs, enclosed in curly braces `{}`.
-   **Array:** An ordered list of values, enclosed in square brackets `[]`.

## 2. JSON Objects

A JSON object starts with `{` and ends with `}`. It contains one or more key/value pairs.

**Example of a simple JSON object:**

```json
{
  "id": 123,
  "username": "testuser",
  "isActive": true,
  "lastLogin": null
}
```

In this example:
-   `"id"` is a key, and `123` (a number) is its value.
-   `"username"` is a key, and `"testuser"` (a string) is its value.
-   `"isActive"` is a key, and `true` (a boolean) is its value.
-   `"lastLogin"` is a key, and `null` is its value.

## 3. JSON Arrays

A JSON array starts with `[` and ends with `]`. It contains an ordered list of values, separated by commas. The values in an array can be of different data types.

**Example of a simple JSON array:**

```json
[ "apple", "banana", "orange" ]
```

**Example of an array with mixed types:**

```json
[ 1, "hello", true, null, { "key": "value" } ]
```

## 4. Nested Structures: The Power of JSON

The real power of JSON comes from its ability to nest objects and arrays within each other. This allows for the representation of complex data structures.

### Object within an Object
An object's value can be another object.

```json
{
  "id": 789,
  "productName": "Laptop Pro",
  "details": {
    "cpu": "M3 Pro",
    "ramGB": 16,
    "storageGB": 512
  }
}
```

### Array within an Object
An object can contain an array.

```json
{
  "id": 456,
  "course": "QA Automation",
  "tags": [ "testing", "playwright", "api" ]
}
```

### Array of Objects
This is one of the most common patterns you'll see in API responses—a list of items, where each item is an object with its own structure.

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  }
]
```
This represents a list of users. The top-level structure is an array `[]`, and each element in the array is a user object `{}`.

## 5. JSON in API Responses

When you make an API call (e.g., `GET /api/users/1`), the server's response body is typically a JSON object representing that user.

**Request:** `GET /api/users/1`

**Response Body (JSON):**
```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```
As a tester, you need to be able to read this structure and verify its contents. For example, you might write a test to assert that the `email` is `"Sincere@april.biz"` or that the `city` inside the `address` object is `"Gwenborough"`.

## Summary

JSON is the language of modern APIs. Your ability to read, understand, and analyze JSON structures is absolutely critical for API testing. You must be comfortable identifying objects, arrays, and nested data to effectively validate that an API is returning the correct information in the correct format.