# Lesson 6: Arrays and Iteration for Automation

## Learning Objectives
After completing this lesson, you will be able to:
- Declare and initialize typed arrays in TypeScript.
- Access and modify elements in an array.
- Use common array properties and methods like `.length` and `.push()`.
- Iterate over arrays using `for...of` loops and the `.forEach()` method.
- Transform arrays using the `.map()` method.

## Introduction
In test automation, we often work with collections of items. For example:
- A list of products on a search results page.
- A set of usernames for data-driven testing.
- The text content of all `<h2>` tags on a page.
- A list of items in a shopping cart.

Arrays are the perfect data structure for handling these ordered lists. TypeScript enhances standard JavaScript arrays by allowing us to specify the type of elements that the array can hold, preventing us from accidentally adding the wrong kind of data.

## What is a Typed Array?
An array is an ordered list of values. A typed array is an array where all the values must be of the same type.

The syntax for declaring a typed array is `type[]`.

```typescript
// An array that can only hold strings
const browserNames: string[] = ["Chrome", "Firefox", "Edge", "Safari"];

// An array that can only hold numbers
const testDurationsInSeconds: number[] = [12.5, 30.1, 22.7];

// An array that can only hold booleans
const testResults: boolean[] = [true, true, false, true];
```
If you try to add an element of the wrong type, TypeScript will stop you.

```typescript
// browserNames.push(123); // ERROR: Argument of type 'number' is not assignable to parameter of type 'string'.
```

## Accessing Array Elements
Array elements are accessed by their **index**, which is their position in the list. **Array indices start at 0.**

```typescript
const browsers: string[] = ["Chrome", "Firefox", "Edge"];

console.log(browsers[0]); // Output: Chrome
console.log(browsers[1]); // Output: Firefox
console.log(browsers[2]); // Output: Edge

// You can also modify elements by their index
browsers[2] = "Safari";
console.log(browsers); // Output: [ 'Chrome', 'Firefox', 'Safari' ]
```

## Common Array Properties and Methods

### `.length`
The `.length` property tells you how many elements are in the array. This is extremely useful for assertions.

**Automation Example:** Verify the number of items in a shopping cart.
```typescript
const itemsInCart: string[] = ["T-Shirt", "Backpack", "Cap"];
const itemCount = itemsInCart.length;

console.log(`There are ${itemCount} items in the cart.`); // Output: 3

// A simple assertion
if (itemCount !== 3) {
  console.error("Assertion Failed: Expected 3 items in cart, but found " + itemCount);
}
```

### `.push()`
The `.push()` method adds one or more elements to the **end** of an array.

```typescript
const testSteps: string[] = ["Navigate to login page", "Enter username"];
testSteps.push("Enter password", "Click login button");

console.log(testSteps);
// Output: [ 'Navigate to login page', 'Enter username', 'Enter password', 'Click login button' ]
```

## Iterating Over Arrays
"Iterating" just means performing an action for each item in a list. This is a core task in automation, like checking every link on a page or verifying every price in a search result.

### The `for...of` Loop
This is a simple and readable way to loop over the elements of an array.

**Automation Example:** Log every test case name from a list.
```typescript
const testCasesToRun: string[] = ["Login Test", "Search Test", "Checkout Test"];

for (const testCase of testCasesToRun) {
  console.log(`Preparing to run: ${testCase}`);
}
```

### The `.forEach()` Method
The `.forEach()` method is another common way to iterate. It takes a function as an argument and calls that function for each element in the array.

```typescript
const testCasesToRun: string[] = ["Login Test", "Search Test", "Checkout Test"];

testCasesToRun.forEach(testCase => {
  console.log(`Preparing to run: ${testCase}`);
});
```
Both `for...of` and `.forEach()` achieve the same result here. The choice between them is often a matter of style.

## Transforming Arrays with `.map()`
The `.map()` method is incredibly powerful. It creates a **new** array by taking each element from an original array and applying a function to it.

**Automation Example:** You have an array of product prices as numbers, and you want to create a new array of formatted price strings.

```typescript
const prices: number[] = [19.99, 10, 5.50];

// The map method takes a function that transforms each element.
// Here, it transforms each 'price' (a number) into a formatted string.
const formattedPrices: string[] = prices.map(price => {
  return `$${price.toFixed(2)}`;
});

console.log(prices);           // Output: [ 19.99, 10, 5.5 ] (The original array is unchanged)
console.log(formattedPrices);  // Output: [ '$19.99', '$10.00', '$5.50' ] (This is the new array)
```

## Arrays of Objects
You can, and often will, create arrays of objects. This is where combining arrays with interfaces becomes essential.

```typescript
interface Product {
  name: string;
  price: number;
}

const products: Product[] = [
  { name: "Laptop", price: 1200 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 75 }
];

// Now we can iterate and access properties in a type-safe way.
products.forEach(product => {
  console.log(`The price of the ${product.name} is $${product.price}`);
  // console.log(product.id); // ERROR: Property 'id' does not exist on type 'Product'.
});
```

## Summary
- Arrays are ordered lists of values, perfect for handling collections of test data.
- In TypeScript, we use typed arrays (`type[]`) to ensure all elements are of the same type.
- Use the index (`[0]`) to access elements and `.length` to get the size.
- Iterate over arrays using `for...of` or `.forEach()` to perform actions on each element.
- Use `.map()` to transform an array into a new array.
- Combining arrays with interfaces (`MyInterface[]`) is a powerful pattern for managing complex, structured data in your tests.