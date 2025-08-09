/**
 * Solution: Interfaces and Type Aliases
 *
 * This file contains the solution to the 'Interfaces and Type Aliases' exercise.
 */

// 1. 'UserRole' is a type alias that provides a clear and restrictive type for user roles.
type UserRole = 'Admin' | 'Editor' | 'Viewer';

// 2. 'IUser' is an interface that defines a contract for user objects.
//    Using an interface makes it easy to ensure that all user objects have a consistent shape.
//    'lastLogin' is marked as optional with the '?' symbol.
interface IUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  lastLogin?: Date; // Optional property
}

// 3. 'createUser' uses the 'IUser' interface for both its parameter and return type,
//    enforcing type safety and predictability.
function createUser(user: IUser): IUser {
  return user;
}

// 4. 'IApiResponse' defines the structure for API responses. This is extremely useful
//    for typing the data received from API calls in test automation.
interface IApiResponse {
  status: number;
  data: IUser[];
  error?: string; // Optional property
}

// 5. 'processUsers' uses the 'IApiResponse' interface to safely access its properties.
//    It checks for the existence of the optional 'error' property before trying to use it.
function processUsers(response: IApiResponse): void {
  if (response.error) {
    console.error(`API Error: ${response.error}`);
  } else {
    console.log("Processing users:");
    response.data.forEach(user => {
      console.log(`- ${user.username} (${user.role})`);
    });
  }
}

// 6. Sample data is created that conforms to the defined interfaces and type aliases.
const sampleUser: IUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'Admin',
  lastLogin: new Date()
};

const successResponse: IApiResponse = {
  status: 200,
  data: [
    sampleUser,
    { id: 2, username: 'editor_user', email: 'editor@example.com', role: 'Editor' }
  ]
};

const errorResponse: IApiResponse = {
  status: 404,
  data: [],
  error: "Users not found"
};

// Calling the functions with the sample data.
const newUser = createUser(sampleUser);
console.log("Created User:", newUser);

console.log("\n--- Successful Response ---");
processUsers(successResponse);

console.log("\n--- Failed Response ---");
processUsers(errorResponse);