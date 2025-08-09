# Lesson 4: Assessment - Advanced POM Strategies

## Knowledge Check

### Question 1

What is the main benefit of using method chaining (a fluent interface) in a Page Object?

a) It improves test execution speed.
b) It makes the test code more readable and expressive by allowing chained method calls.
c) It automatically adds waits before each action.
d) It reduces the number of locators needed.

**Answer:** b

---

### Question 2

When implementing method chaining, what should an action method typically return to allow for chaining?

a) `void`
b) A boolean indicating success.
c) The `Page` object.
d) The instance of the Page Object itself (`this`).

**Answer:** d

---

### Question 3

What is a "Component-Based Page Object"?

a) A Page Object that is built using a specific JavaScript framework like React or Vue.
b) A strategy where a complex page is broken down into smaller objects representing reusable UI components (e.g., a navbar or a search widget).
c) A Page Object that can only be used for a single component.
d) A design pattern where all components are stored in a single, global object.

**Answer:** b

---

### Question 4

According to best practices, where should test assertions be located?

a) Inside the Page Object's action methods.
b) In the test file (`*.spec.ts`), separate from the Page Object logic.
c) In a dedicated `assertions.ts` file, imported by the Page Object.
d) In the constructor of the Page Object.

**Answer:** b

---

### Question 5

What is the purpose of a static factory method (e.g., `public static async create(page: Page)`) in a Page Object?

a) To ensure only one instance of the Page Object can be created.
b) To combine navigation and instantiation into a single, convenient step.
c) To create a "read-only" version of the Page Object.
d) To connect the Page Object to a database.

**Answer:** b