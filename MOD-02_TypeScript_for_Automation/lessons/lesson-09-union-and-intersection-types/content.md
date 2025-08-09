# Lesson 9: Union and Intersection Types

## Learning Objectives
- Understand and use union types to allow a variable to have more than one type.
- Understand and use intersection types to combine multiple types into one.
- Apply union and intersection types to create flexible and robust test automation models.
- Learn how to use type guards to work with union types.

## Introduction
Union and intersection types are advanced features in TypeScript that allow you to create more flexible and powerful types by combining existing ones. Union types allow a value to be one of several types, while intersection types merge multiple types into a single one.

## Union Types (`|`)
A union type is formed by using the pipe (`|`) symbol between two or more types. It allows a variable or parameter to hold a value of any of the specified types.

```typescript
// This variable can be a string or a number
let userId: string | number;

userId = 12345; // Correct
console.log(userId);

userId = "user-abc-123"; // Also correct
console.log(userId);

// userId = true; // Error: Type 'boolean' is not assignable to type 'string | number'.
```

### Use Case: Handling Different Response Formats
In testing, you might encounter API endpoints that return data in different shapes. Union types are perfect for this.

```typescript
type SuccessResponse = {
  status: "success";
  data: any;
};

type ErrorResponse = {
  status: "error";
  errorCode: number;
  errorMessage: string;
};

// The API response can be one of these two types
type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    // TypeScript knows 'response' is a SuccessResponse here
    console.log("Data received:", response.data);
  } else {
    // TypeScript knows 'response' is an ErrorResponse here
    console.error(`Error ${response.errorCode}: ${response.errorMessage}`);
  }
}
```
This technique is called a **type guard**. By checking the `status` property, we help TypeScript narrow down the type within the `if/else` blocks.

## Intersection Types (`&`)
An intersection type is formed by using the ampersand (`&`) symbol. It combines the properties of all the types in the intersection into a single new type.

```typescript
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

// A User has both an id and a name
type User = HasId & HasName;

const user: User = {
  id: 1,
  name: "John Doe"
};
```

### Use Case: Building Extensible Test Objects
Intersection types are great for building up complex object types from smaller, reusable pieces. This is a common pattern in test automation for creating page objects or test data models.

```typescript
// A basic page component with a locator
interface PageComponent {
  readonly locator: string;
}

// A component that can be clicked
interface Clickable {
  click(): void;
}

// A component that can have text entered into it
interface Typeable {
  type(text: string): void;
}

// An input field is a page component that is both clickable and typeable
type InputField = PageComponent & Clickable & Typeable;

// Implementation of an InputField
const usernameInput: InputField = {
  locator: "#username",
  click() {
    console.log(`Clicking on ${this.locator}`);
  },
  type(text: string) {
    console.log(`Typing "${text}" into ${this.locator}`);
  }
};

usernameInput.click();
usernameInput.type("testuser");
```

## Combining Union and Intersection Types
You can combine these two concepts to create very expressive and flexible types for your test automation framework.

```typescript
// A type for a user's contact information
type ContactInfo = {
  email: string;
  phone?: string; // Optional phone number
};

// A type for a system entity
type SystemEntity = {
  id: number;
  createdAt: Date;
};

// A full user profile combines a system entity and contact info
type UserProfile = SystemEntity & ContactInfo;

// A guest profile only has contact info
type GuestProfile = ContactInfo;

// A profile can be either a user or a guest
type Profile = UserProfile | GuestProfile;
```

## Summary
- **Union types (`|`)** allow a value to be one of several types. They are useful for handling variability.
- **Intersection types (`&`)** combine multiple types into a single type with all the properties of the combined types. They are great for building complex types from smaller parts.
- **Type guards** are used to narrow down a union type to a specific type within a block of code.
- Combining union and intersection types allows for the creation of highly flexible and descriptive data models, which is a cornerstone of a well-designed test automation framework.