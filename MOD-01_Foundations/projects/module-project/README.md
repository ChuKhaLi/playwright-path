# Module 1 Project: E-commerce Website Analysis & Test Plan

## Project Overview

This project is the capstone for Module 1. You will apply all the foundational concepts you've learned to analyze a real-world e-commerce website and create a comprehensive test plan. This project focuses on the *analysis and planning* phase that comes before writing a single line of automation code.

**Your chosen E-commerce site:** [https://www.saucedemo.com/](https://www.saucedemo.com/)
*(This is a well-known demo site specifically for practicing automation.)*

## Phases & Deliverables

### Phase 1: Initial Analysis & User Workflows

**Task:** Familiarize yourself with the Sauce Demo site and document its key user workflows.

**Deliverable:** A document (`workflows.md`) that outlines at least three key user journeys. For each journey, describe the steps a user would take.

**Example Workflow:**
-   **Workflow:** Successful Purchase
-   **Steps:**
    1.  User navigates to the login page.
    2.  User enters valid credentials ("standard_user", "secret_sauce") and clicks "Login".
    3.  User adds the "Sauce Labs Backpack" to the cart.
    4.  User clicks the shopping cart icon.
    5.  User clicks "Checkout".
    6.  User fills in their information (First Name, Last Name, Zip Code).
    7.  User clicks "Continue".
    8.  User clicks "Finish".
    9.  User sees the "Thank you for your order!" confirmation message.

### Phase 2: Selector and Element Investigation

**Task:** For the "Successful Purchase" workflow, identify robust selectors for each key element a user interacts with. Use your browser's DevTools.

**Deliverable:** A document (`selectors.md`) that lists the elements, a reliable CSS selector, and a reliable XPath selector for each.

**Example Entry:**
-   **Element:** Username Input Field
-   **CSS Selector:** `#user-name`
-   **XPath Selector:** `//input[@id='user-name']`

### Phase 3: API and Network Analysis

**Task:** Use the Network tab in your DevTools to observe the API calls made during the login process.

**Deliverable:** A document (`api_analysis.md`) that details the login API call.

**Information to Capture:**
-   **Request URL:**
-   **Request Method:**
-   **Request Payload (Body):** What data is sent to the server?
-   **Response Status Code (for a successful login):**
-   **Response Body (for a successful login):**

### Phase 4: High-Level Test Plan

**Task:** Based on your analysis, create a high-level test plan for the login feature.

**Deliverable:** A document (`test_plan.md`) that includes:
-   **UI Test Cases:**
    -   Test case for a successful login.
    -   Test case for a login with an incorrect password.
    -   Test case for a login with a locked-out user.
-   **API Test Cases:**
    -   Test case for a successful API login request.
    -   Test case for an API login request with a missing password.

## Final Submission

Your final submission will be this `module-project` folder containing your four analysis documents:
-   `workflows.md`
-   `selectors.md`
-   `api_analysis.md`
-   `test_plan.md`