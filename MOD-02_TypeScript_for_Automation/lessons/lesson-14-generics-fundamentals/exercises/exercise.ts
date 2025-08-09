/**
 * Exercise: Generics Fundamentals
 *
 * This exercise is designed to help you practice with generics in TypeScript.
 * Your goal is to create reusable functions and classes that can work with different types
 * while maintaining type safety.
 *
 * Follow the instructions in the comments for each section.
 */

// 1. Generic Function:
//    - Create a generic function named 'wrapInArray'.
//    - This function should accept a single argument of a generic type 'T'.
//    - It should return a new array containing only that argument.
//    - Add the correct generic type annotation.

// Implement 'wrapInArray' here

// 2. Generic Interface and Function:
//    - Create a generic interface named 'ApiResponse'.
//    - It should have a 'data' property of a generic type 'T' and a 'status' property of type 'number'.
//    - Create a generic function named 'createApiResponse'.
//    - This function should accept 'data' of a generic type 'T' and a 'status' (number).
//    - It should return an 'ApiResponse' object for that type.

// Implement 'ApiResponse' interface and 'createApiResponse' function here

// 3. Generic Class:
//    - Create a generic class named 'DataStore'.
//    - It should have a private property 'data' which is an array of a generic type 'T'.
//    - It should have a public method 'addItem' that accepts an item of type 'T' and adds it to the 'data' array.
//    - It should have a public method 'getAllItems' that returns the 'data' array.

// Implement 'DataStore' class here

// 4. Instantiate and Use Your Generic Creations:
//    - Call 'wrapInArray' with a string and then with a number, and log the results.
//    - Call 'createApiResponse' to create responses for a user object and for an array of strings. Log the results.
//      (You can define a simple User interface for this).
//    - Create an instance of 'DataStore' for numbers and add some items.
//    - Create another instance of 'DataStore' for user objects and add some items.
//    - Log the contents of both data stores.

// Define a simple User interface
interface User {
  id: number;
  name: string;
}

// Call 'wrapInArray'
const stringArray = wrapInArray("hello");
const numberArray = wrapInArray(123);
console.log(stringArray, numberArray);

// Call 'createApiResponse'
const userResponse = createApiResponse({ id: 1, name: "Alice" }, 200);
const permissionsResponse = createApiResponse(["admin", "editor"], 200);
console.log(userResponse, permissionsResponse);

// Use 'DataStore'
const numberStore = new DataStore();
numberStore.addItem(1);
numberStore.addItem(2);
console.log(numberStore.getAllItems());

const userStore = new DataStore();
userStore.addItem({ id: 1, name: "Bob" });
userStore.addItem({ id: 2, name: "Charlie" });
console.log(userStore.getAllItems());