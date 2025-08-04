# Lesson 11: Assessment

## Instructions

Read each question carefully and select the best answer. These questions are designed to test your understanding of industry best practices for test automation.

---

### Question 1

What is the correct order of steps in the "Arrange-Act-Assert" (AAA) pattern?

a) Act, Assert, Arrange
b) Assert, Arrange, Act
c) Arrange, Act, Assert
d) Arrange, Assert, Act

---

### Question 2

Which of the following is the best name for a test case?

a) `test('Test login')`
b) `test('Login functionality test case number 2')`
c) `test('should display an error message when the password field is empty')`
d) `test('TC-001')`

---

### Question 3

Why is it important for automated tests to be independent?

a) So they can share data and variables with each other.
b) So they can be run in any order and in parallel without affecting each other.
c) So they take longer to run.
d) It is not important for tests to be independent.

---

### Question 4

What does it mean for a test to be "atomic"?

a) The test should check many different pieces of functionality at once.
b) The test should be very long and complex.
c) The test should focus on verifying one single, specific behavior or outcome.
d) The test should depend on the result of the previous test.

---

### Question 5

Which of the following is a best practice for handling test data?

a) Hardcode all data directly into the test script for simplicity.
b) Store test data in variables or separate files, away from the test logic.
c) Use the same username and password for every single test.
d) Commit sensitive data like real user passwords to Git for easy access.

---

## Answer Key

1. **c) Arrange, Act, Assert**
   - *Explanation: This logical flow (Set up, Perform action, Check result) makes tests structured and easy to understand.*

2. **c) `test('should display an error message when the password field is empty')`**
   - *Explanation: This name is a full sentence that clearly describes the test's purpose and expected outcome.*

3. **b) So they can be run in any order and in parallel without affecting each other.**
   - *Explanation: Independence is key to a stable, reliable, and fast test suite.*

4. **c) The test should focus on verifying one single, specific behavior or outcome.**
   - *Explanation: Atomicity makes debugging much easier. When an atomic test fails, you know exactly which piece of functionality is broken.*

5. **b) Store test data in variables or separate files, away from the test logic.**
   - *Explanation: This practice makes tests more maintainable, reusable, and powerful, as the same logic can be run with different data inputs.*