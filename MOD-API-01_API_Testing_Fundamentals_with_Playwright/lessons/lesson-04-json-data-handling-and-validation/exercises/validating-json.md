# Exercises: Validating JSON

These exercises will help you practice parsing and asserting on JSON data, a core skill for API testing.

---

## Exercise 1: Basic JSON Assertions

You receive the following JSON response after requesting a user profile.

**JSON Response:**
```json
{
  "id": 7,
  "email": "michael.lawson@reqres.in",
  "first_name": "Michael",
  "status": "active",
  "login_attempts": 0,
  "is_verified": true
}
```

**Your Task:**
Write down the `expect` assertions you would use in a Playwright test to validate the following:
1.  The user's ID is 7.
2.  The user's status is "active".
3.  The `is_verified` flag is true.
4.  The user's email address is correct.

---

## Exercise 2: Navigating Nested Objects

You receive this JSON response containing a product and its manufacturer details.

**JSON Response:**
```json
{
  "productId": "A-45-Z",
  "productName": "Wireless Headphones",
  "inventory": {
    "inStock": true,
    "stockCount": 87
  },
  "manufacturer": {
    "name": "AudioPhile Inc.",
    "country": "Germany"
  }
}
```

**Your Task:**
Write the `expect` assertions to validate:
1.  The stock count is 87.
2.  The manufacturer's name is "AudioPhile Inc.".

---

## Exercise 3: Working with Arrays

This response contains a list of tags for an article.

**JSON Response:**
```json
{
  "articleId": "post-101",
  "tags": [
    "tech",
    "reviews",
    "audio",
    "gadgets"
  ]
}
```

**Your Task:**
Write `expect` assertions to validate:
1.  There are exactly 4 tags.
2.  The first tag in the array is "tech".
3.  The array of tags includes "audio".

---

## Exercise 4: Complex Validation

This response contains a list of users.

**JSON Response:**
```json
{
  "page": 1,
  "data": [
    { "id": 1, "first_name": "George", "last_name": "Bluth" },
    { "id": 2, "first_name": "Janet", "last_name": "Weaver" },
    { "id": 3, "first_name": "Emma", "last_name": "Wong" }
  ]
}
```

**Your Task:**
Write `expect` assertions to validate:
1.  The `page` number is 1.
2.  The `data` array contains 3 user objects.
3.  The second user in the list has the first name "Janet".
4.  The list of users contains a user with the last name "Wong". (Hint: Use `toContainEqual` and `expect.objectContaining`).

---

## Answer Key

### Exercise 1 Answers
```typescript
expect(responseBody.id).toBe(7);
expect(responseBody.status).toBe('active');
expect(responseBody.is_verified).toBe(true);
expect(responseBody.email).toBe('michael.lawson@reqres.in');
```

### Exercise 2 Answers
```typescript
expect(responseBody.inventory.stockCount).toBe(87);
expect(responseBody.manufacturer.name).toBe('AudioPhile Inc.');
```

### Exercise 3 Answers
```typescript
expect(responseBody.tags).toHaveLength(4);
expect(responseBody.tags[0]).toBe('tech');
expect(responseBody.tags).toContain('audio');
```

### Exercise 4 Answers
```typescript
expect(responseBody.page).toBe(1);
expect(responseBody.data).toHaveLength(3);
expect(responseBody.data[1].first_name).toBe('Janet');
expect(responseBody.data).toContainEqual(
  expect.objectContaining({
    last_name: 'Wong'
  })
);