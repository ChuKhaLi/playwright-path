# Lesson 17: Understanding Test Automation Tools - Hands-On Practice

## Objective

This exercise is a research and critical thinking task. Instead of coding, you will investigate different types of testing tools to understand their purpose and how they fit into the larger QA ecosystem.

## Setup

You will need a web browser to research the tools mentioned.

---

## Task 1: Comparing E2E Web Testing Tools

You are learning Playwright, but it's important to know about its main competitors.

1.  **Research:** Open three tabs in your browser and go to the official websites for:
    -   **Playwright:** [https://playwright.dev/](https://playwright.dev/)
    -   **Cypress:** [https://www.cypress.io/](https://www.cypress.io/)
    -   **Selenium:** [https://www.selenium.dev/](https://www.selenium.dev/)

2.  **Analysis:** For each tool, try to find the answer to the following questions. Create a simple table or list to compare them.
    -   **Who created it?** (e.g., Microsoft, Google, a company, an open-source community).
    -   **What is its primary programming language?** (The language the tool itself is written in or most commonly used with).
    -   **What are its key selling points?** (Look at the headlines on their homepages. What do they emphasize? e.g., speed, cross-browser support, ease of use, etc.).
    -   **Does it support testing in multiple browser engines** (e.g., Chromium, Firefox, WebKit) out of the box?

---

## Task 2: Exploring Different Categories of Testing Tools

QA automation is more than just E2E testing. Research what each of the following tools is primarily used for and place it into one of these categories: **API Testing**, **Performance Testing**, or **Visual Regression Testing**.

1.  **Postman:**
    -   **Research:** Visit [https://www.postman.com/](https://www.postman.com/)
    -   **Primary Category:** \_\_\_\_\_
    -   **One-Sentence Description:** \_\_\_\_\_

2.  **JMeter:**
    -   **Research:** Visit [https://jmeter.apache.org/](https://jmeter.apache.org/)
    -   **Primary Category:** \_\_\_\_\_
    -   **One-Sentence Description:** \_\_\_\_\_

3.  **Applitools:**
    -   **Research:** Visit [https://applitools.com/](https://applitools.com/)
    -   **Primary Category:** \_\_\_\_\_
    -   **One-Sentence Description:** \_\_\_\_\_

4.  **k6:**
    -   **Research:** Visit [https://k6.io/](https://k6.io/)
    -   **Primary Category:** \_\_\_\_\_
    -   **One-Sentence Description:** \_\_\_\_\_

---

## Task 3: Critical Thinking - Choosing the Right Tool

Read the following scenarios and decide which *type* of testing tool would be the most appropriate first choice.

1.  **Scenario:** A developer has just finished building the `/login` API endpoint. The UI for the login page has not been created yet. You need to verify that the endpoint correctly authenticates users and returns an auth token.
    -   **Which tool/type of tool would you use and why?**

2.  **Scenario:** Your company is about to launch a major marketing campaign. You expect traffic to your website to increase by 500%. You need to make sure the website won't crash under the load.
    -   **Which tool/type of tool would you use and why?**

3.  **Scenario:** Your team has just updated the company's branding, changing the color of all the buttons and the font size of all the headers across 50 pages. You need to verify that none of the visual layouts were broken by this change.
    -   **Which tool/type of tool would you use and why?**

## Solutions

<details>
<summary>Click to view solutions</summary>

### Task 2 Solutions
1.  **Postman:** API Testing. A collaborative platform for building, using, and testing APIs.
2.  **JMeter:** Performance Testing. An open-source tool designed to load test functional behavior and measure performance.
3.  **Applitools:** Visual Regression Testing. A platform that uses AI to automatically catch visual bugs and manage visual testing.
4.  **k6:** Performance Testing. A modern, open-source load testing tool for engineering teams.

### Task 3 Solutions
1.  **Tool:** An API testing tool like **Postman** or **Insomnia**. **Why:** The UI doesn't exist yet, so you can't use a tool like Playwright. You need to interact directly with the API endpoint.
2.  **Tool:** A performance testing tool like **JMeter** or **k6**. **Why:** These tools are specifically designed to simulate thousands of users accessing the site at once to measure its performance under load.
3.  **Tool:** A visual regression testing tool like **Applitools** (or Percy, Chromatic, etc.). **Why:** These tools specialize in taking screenshots of pages and comparing them to a baseline to automatically detect visual changes, which is much more efficient than manually checking 50 pages.

</details>