/**
 * Solution: Generics Fundamentals
 *
 * This file contains the solution to the 'Generics Fundamentals' exercise.
 */

// 1. The generic function 'wrapInArray' uses a type parameter 'T'.
//    This allows the function to accept any type and return an array of that same type,
//    preserving type information.
function wrapInArray<T>(item: T): T[] {
  return [item];
}

// 2. The generic interface 'ApiResponse' uses 'T' to represent the type of the 'data' payload.
//    This makes the interface reusable for any kind of API response.
interface ApiResponse<T> {
  data: T;
  status: number;
}

// The generic function 'createApiResponse' also uses 'T'. It takes data of type 'T'
// and returns an 'ApiResponse<T>', ensuring the response object is correctly typed.
function createApiResponse<T>(data: T, status: number): ApiResponse<T> {
  return { data, status };
}

// 3. The generic class 'DataStore' uses 'T' to define the type of items it holds.
//    This allows us to create data stores for any type (e.g., numbers, strings, objects)
//    while ensuring that only items of that specific type can be added.
class DataStore<T> {
  private data: T[] = [];

  public addItem(item: T): void {
    this.data.push(item);
  }

  public getAllItems(): T[] {
    return this.data;
  }
}

// 4. Instantiate and use the generic creations.

// Define a simple User interface for the examples.
interface User {
  id: number;
  name: string;
}

// Call 'wrapInArray'. TypeScript infers the type of 'T' from the argument.
const stringArray = wrapInArray("hello"); // T is inferred as string
const numberArray = wrapInArray(123);   // T is inferred as number
console.log("Wrapped string:", stringArray);
console.log("Wrapped number:", numberArray);

// Call 'createApiResponse'.
const userResponse = createApiResponse<User>({ id: 1, name: "Alice" }, 200);
const permissionsResponse = createApiResponse<string[]>(["admin", "editor"], 200);
console.log("User API Response:", userResponse);
console.log("Permissions API Response:", permissionsResponse);

// Use 'DataStore'. We explicitly set the type for the store upon instantiation.
const numberStore = new DataStore<number>();
numberStore.addItem(1);
numberStore.addItem(2);
// numberStore.addItem("3"); // This would cause a TypeScript error.
console.log("Number Store:", numberStore.getAllItems());

const userStore = new DataStore<User>();
userStore.addItem({ id: 1, name: "Bob" });
userStore.addItem({ id: 2, name: "Charlie" });
console.log("User Store:", userStore.getAllItems());