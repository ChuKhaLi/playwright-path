# Lesson 4: Assessment

## Knowledge Check

Test your understanding of Lighthouse integration with Playwright.

### Question 1

What is the main advantage of integrating Lighthouse with Playwright?

a) It makes Playwright tests run faster.
b) It allows you to automate comprehensive quality audits (performance, accessibility, etc.) as part of your test suite.
c) It replaces the need for functional testing.
d) It is the only way to measure performance with Playwright.

**Answer:** b) It allows you to automate comprehensive quality audits (performance, accessibility, etc.) as part of your test suite.

### Question 2

In the `playwright-lighthouse` configuration, what is the purpose of the `thresholds` object?

a) To define the screen size for the audit.
b) To set the maximum time the audit is allowed to run.
c) To specify the minimum acceptable Lighthouse scores for different categories, which will be asserted on.
d) To configure the number of reports to generate.

**Answer:** c) To specify the minimum acceptable Lighthouse scores for different categories, which will be asserted on.

### Question 3

Which of the following is NOT a category audited by Lighthouse?

a) Performance
b) Accessibility
c) Visual Regression
d) SEO

**Answer:** c) Visual Regression

### Question 4

What is required in the `playAudit` configuration for Lighthouse to communicate with the browser instance controlled by Playwright?

a) The `page` object.
b) The `port` number for the Chrome DevTools Protocol.
c) The `url` of the page to be audited.
d) A `browser` context.

**Answer:** b) The `port` number for the Chrome DevTools Protocol.

### Question 5

How can you use Lighthouse results to prevent deploying a slow application?

a) By manually checking the HTML report after each deployment.
b) By setting score thresholds in the `playAudit` function, which will fail the CI/CD pipeline if not met.
c) By emailing the report to the development team.
d) Lighthouse cannot be used to gate deployments.

**Answer:** b) By setting score thresholds in the `playAudit` function, which will fail the CI/CD pipeline if not met.