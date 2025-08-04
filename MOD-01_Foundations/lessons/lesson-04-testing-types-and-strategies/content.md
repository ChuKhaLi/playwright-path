# Lesson 4: Testing Types and Strategies

## Learning Objectives

- Differentiate between functional and non-functional testing.
- Identify and define key functional testing types (e.g., Smoke, Sanity, Regression).
- Identify and define key non-functional testing types (e.g., Performance, Usability, Security).
- Understand the concept of the Test Pyramid and its strategic implications.
- Learn about Black Box, White Box, and Grey Box testing methodologies.

---

## 1. Functional vs. Non-Functional Testing

All testing activities can be broadly classified into two main categories.

### Functional Testing
This type of testing verifies that the software performs its specified functions correctly. It's all about **what the system does**.

- **Focus:** Validating business requirements.
- **Example:** Does the "Add to Cart" button add the correct item to the shopping cart? Does the login form work with a valid username and password?

### Non-Functional Testing
This type of testing checks the non-functional aspects of the software, such as performance, usability, and reliability. It's all about **how the system works**.

- **Focus:** Validating the quality and performance characteristics of the application.
- **Example:** How fast does the page load? Can 1,000 users log in at the same time? Is the application secure from common threats?

## 2. Common Functional Testing Types

- **Smoke Testing:**
  - A quick, shallow test of the major functionalities of the software. It's done to ensure the build is stable enough for further testing.
  - *Analogy:* When a plumber fixes a pipe, they let a little water through to see if there are any major, obvious leaks before turning the pressure all the way up.
  - **Goal:** To reject a badly broken build early.

- **Sanity Testing:**
  - A brief test of specific functionality after a minor change (like a bug fix) to ensure the change works and hasn't broken closely related functionality. It's a subset of regression testing.
  - **Goal:** To verify that a small change is working as expected.

- **Regression Testing:**
  - The process of re-running tests to ensure that previously developed and tested software still performs the same way after a change.
  - **Goal:** To ensure new code hasn't broken existing features. This is a prime candidate for automation.

- **User Interface (UI) Testing:**
  - Verifies that the graphical user interface meets its requirements. It checks for things like button placement, text alignment, and visual consistency.

## 3. Common Non-Functional Testing Types

- **Performance Testing:**
  - Evaluates how a system performs in terms of responsiveness and stability under a particular workload. This includes:
    - **Load Testing:** Checking the application's ability to perform under anticipated user loads.
    - **Stress Testing:** Evaluating the upper limits of the system's capacity.

- **Usability Testing:**
  - Evaluates how easy and intuitive the software is to use from an end-user's perspective. This is almost always a manual testing activity.

- **Security Testing:**
  - Uncovers vulnerabilities in the system and determines that its data and resources are protected from possible intruders.

- **Compatibility Testing:**
  - Checks how well the software works across different browsers, operating systems, and devices.

## 4. The Test Automation Pyramid

The Test Automation Pyramid is a strategic model that helps teams think about how to balance different types of tests in their automation suite. It was created by Mike Cohn.

The pyramid is divided into three layers:

1.  **Unit Tests (Base of the pyramid):**
    - These form the largest part of your test suite. They are fast, reliable, and cheap to write. They test individual components in isolation.

2.  **Integration/Service Tests (Middle of the pyramid):**
    - These test how different parts of the system work together. They are slower and more complex than unit tests. This layer might include API tests.

3.  **UI/End-to-End (E2E) Tests (Top of the pyramid):**
    - These are the slowest and most brittle tests. They test the entire application flow from the user's perspective. You should have the fewest of these.

**Key takeaway:** Write lots of fast unit tests, a good number of integration tests, and a small number of broad E2E tests. Relying too heavily on E2E tests (an "ice-cream cone" anti-pattern) makes your test suite slow, brittle, and expensive to maintain.

## 5. Testing Methodologies: Black Box, White Box, and Grey Box

This describes the level of knowledge a tester has about the internal workings of the system.

- **Black Box Testing:**
  - The tester has **no knowledge** of the internal code or structure of the system. They only know what the system is supposed to do, not how it does it. They test from the user's point of view.
  - *Analogy:* Using a microwave. You know that if you press the "Popcorn" button, you should get popcorn. You don't need to know how the microwaves are generated.

- **White Box Testing:**
  - The tester has **full knowledge** of the internal code and structure. They can see the code and use that knowledge to design their tests. Unit testing is a form of white-box testing.
  - *Analogy:* The engineer who designed the microwave, testing the internal circuitry.

- **Grey Box Testing:**
  - The tester has **partial knowledge** of the system. They might know about the database structure or the APIs the system uses, but not the detailed internal workings of every component.
  - *Analogy:* A repair technician who has the schematics for the microwave but didn't design it from scratch.

As a QA Automation Engineer focusing on E2E testing, you will primarily be doing **Black Box testing**.