# Examples: JSON Payloads

This file contains a collection of JSON examples, from simple to complex. Use these to practice reading JSON and identifying its structure and data types.

---

## Example 1: A Simple User Object

This is a flat JSON object representing a single user.

```json
{
  "id": 1,
  "email": "george.bluth@reqres.in",
  "first_name": "George",
  "last_name": "Bluth",
  "avatar": "https://reqres.in/img/faces/1-image.jpg"
}
```

**Analysis:**
-   This is a JSON **object**.
-   It has five **name/value pairs**.
-   `id` is a **number**.
-   `email`, `first_name`, `last_name`, and `avatar` are all **strings**.

---

## Example 2: An Array of Objects

This represents a collection of resources, in this case, a list of users.

```json
[
  {
    "id": 1,
    "name": "cerulean",
    "year": 2000,
    "color": "#98B2D1",
    "pantone_value": "15-4020"
  },
  {
    "id": 2,
    "name": "fuchsia rose",
    "year": 2001,
    "color": "#C74375",
    "pantone_value": "17-2031"
  }
]
```

**Analysis:**
-   The top-level structure is a JSON **array**.
-   The array contains two elements.
-   Each element in the array is a JSON **object**.

---

## Example 3: A Nested Object

This example shows an object that contains another object.

```json
{
  "id": 101,
  "productName": "Laptop Pro",
  "specs": {
    "cpu": "M3 Pro",
    "ram_gb": 16,
    "storage_gb": 512,
    "touchscreen": false
  }
}
```

**Analysis:**
-   The value of the `specs` key is another JSON **object**.
-   To access the `ram_gb`, you would use `payload.specs.ram_gb`.
-   `touchscreen` is a **boolean**.

---

## Example 4: A Complex, Real-World Example

This structure is more typical of what you might see from a real API, combining nested objects and arrays.

```json
{
  "page": 1,
  "per_page": 6,
  "total": 12,
  "total_pages": 2,
  "data": [
    {
      "id": 1,
      "email": "george.bluth@reqres.in",
      "first_name": "George",
      "last_name": "Bluth"
    },
    {
      "id": 2,
      "email": "janet.weaver@reqres.in",
      "first_name": "Janet",
      "last_name": "Weaver"
    }
  ],
  "support": {
    "url": "https://reqres.in/#support-heading",
    "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
  }
}
```

**Analysis:**
-   The top-level structure is an **object** containing metadata (`page`, `total`, etc.) and the actual data.
-   The `data` key holds an **array** of user objects.
-   The `support` key holds a nested **object**.
-   To get the email of the second user, you would access `payload.data[1].email`.
-   To get the support URL, you would access `payload.support.url`.