/**
 * Exercise: Interfaces and Type Aliases
 *
 * This exercise is designed to help you practice with interfaces and type aliases in TypeScript.
 * Your goal is to define and use these to create structured, reusable types for test automation scenarios.
 *
 * Follow the instructions in the comments for each section.
 */

// 1. Type Alias for a User Role:
//    - Create a type alias named 'UserRole' that can be either 'Admin', 'Editor', or 'Viewer'.
//    - This is useful for defining different permission levels in a test application.

// Define 'UserRole' here

// 2. Interface for User Data:
//    - Create an interface named 'IUser' that defines the structure for a user object.
//    - It should have the following properties:
//      - 'id': a number
//      - 'username': a string
//      - 'email': a string
//      - 'role': of type 'UserRole'
//      - 'lastLogin' (optional): a Date object

// Define 'IUser' here

// 3. Function to Create a User:
//    - Create a function named 'createUser' that takes an object conforming to the 'IUser' interface.
//    - The function should return the same user object.
//    - Add the correct type annotations for the parameter and the return type.

// Implement 'createUser' here

// 4. Interface for an API Response:
//    - Create an interface named 'IApiResponse' for a generic API response.
//    - It should have the following properties:
//      - 'status': a number (e.g., 200, 404)
//      - 'data': an array of 'IUser' objects
//      - 'error' (optional): a string for any error messages

// Define 'IApiResponse' here

// 5. Function to Process API Response:
//    - Create a function named 'processUsers' that takes an 'IApiResponse' object.
//    - The function should log the username of each user in the 'data' array.
//    - If there is an error, it should log the error message instead.
//    - Add the correct type annotations.

// Implement 'processUsers' here

// 6. Create Sample Data and Call Functions:
//    - Create a sample user object that conforms to 'IUser'.
//    - Create a sample API response object for a successful request.
//    - Create a sample API response object for a failed request.
//    - Call your functions with the sample data and log the results.

// Create sample user here

// Create successful API response here

// Create failed API response here

// Call functions and log results here