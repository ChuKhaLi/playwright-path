# Lesson 12: Capstone Specialization Project

## 1. Project Overview

The goal of this capstone project is to create a comprehensive, specialized test suite for a real-world application of your choice. You will select one of the specialization tracks below and implement a series of tests that demonstrate your mastery of the concepts from this module.

This project is designed to be a showcase piece for your portfolio.

## 2. Choosing Your Application

Select a public website or application that is complex enough to test meaningful scenarios. Good choices include:
-   An e-commerce site (e.g., a smaller, independent online store).
-   A news or media website.
-   A social media platform.
-   A SaaS application with a free tier.

**Avoid:**
-   Sites with aggressive anti-bot measures (like Google or Facebook), as they can be difficult to automate.
-   Simple, static websites with little interactivity.

## 3. Specialization Tracks

Choose **one** of the following tracks for your project.

### Track A: The Visual Quality Expert

-   **Focus:** Visual Regression and Responsive Testing.
-   **Tasks:**
    1.  Create a new Playwright project.
    2.  Configure it to run on at least one desktop and one mobile device.
    3.  Identify 3-5 key pages or components of the application.
    4.  Write visual regression tests (`toHaveScreenshot`) for each of these components on both desktop and mobile.
    5.  Implement strategies for handling dynamic content or animations (`mask`, `animations: 'disabled'`).
    6.  Write a `README.md` for your project that explains your test strategy and showcases the baseline images you generated.

### Track B: The Performance and Accessibility Advocate

-   **Focus:** Performance and Accessibility Auditing.
-   **Tasks:**
    1.  Create a new Playwright project.
    2.  Integrate `playwright-lighthouse` and `axe-playwright`.
    3.  Identify a critical user journey (e.g., searching for an item, adding it to a cart, and starting the checkout process).
    4.  Write a Playwright test that simulates this user journey.
    5.  At each key step of the journey, perform an accessibility scan with Axe and assert that there are no critical violations.
    6.  At the end of the journey, run a Lighthouse audit and assert that the performance and accessibility scores meet a reasonable threshold (e.g., 70 for performance, 90 for accessibility).
    7.  Write a `README.md` that explains your findings, including any performance or accessibility issues you discovered.

### Track C: The Security-Minded Tester

-   **Focus:** Authentication, Authorization, and API Security.
-   **Tasks:**
    1.  Choose an application that has user authentication.
    2.  Create a new Playwright project.
    3.  Write a test that attempts to access an authenticated route without being logged in and asserts that access is denied.
    4.  If the application has different user roles (e.g., user vs. admin), write a test that logs in as a low-privileged user and attempts to access a high-privileged area.
    5.  Write a test that inspects the network response after logging in (e.g., for a `/api/me` or `/api/user` call) and asserts that no sensitive data (like a password hash) is being sent to the client.
    6.  Write a `README.md` that documents the security checks you implemented and why they are important.

## 4. Project Submission and Review

To complete the project:
1.  Create a new public repository on GitHub for your project.
2.  Push your completed Playwright project to the repository.
3.  Ensure your `README.md` is well-written and clearly explains your project.
4.  (Optional but recommended) Create a short video or a series of GIFs demonstrating your tests running and explaining your findings.

This project serves as tangible proof of your advanced automation skills. It demonstrates not just that you can write tests, but that you can think strategically about different facets of quality.