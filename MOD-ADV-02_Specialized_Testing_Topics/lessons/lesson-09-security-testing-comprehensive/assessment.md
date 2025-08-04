# Lesson 9: Assessment

## Knowledge Check

Test your understanding of comprehensive security testing.

### Question 1

What is the primary role of Playwright in a web application security strategy?

a) To perform full penetration testing and find unknown vulnerabilities.
b) To automatically fix security holes in the code.
c) To automate "black-box" checks for known, common vulnerabilities from a user's perspective.
d) To scan for viruses and malware.

**Answer:** c) To automate "black-box" checks for known, common vulnerabilities from a user's perspective.

### Question 2

Which type of vulnerability occurs when a user can access data or pages they are not supposed to?

a) Cross-Site Scripting (XSS)
b) Injection
c) Broken Access Control
d) Cryptographic Failure

**Answer:** c) Broken Access Control

### Question 3

How can you use Playwright to test for a broken access control vulnerability?

a) By logging in as a regular user and then attempting to navigate directly to an admin-only URL.
b) By running a Lighthouse audit.
c) By checking for JavaScript errors in the console.
d) By using the `page.hack()` method.

**Answer:** a) By logging in as a regular user and then attempting to navigate directly to an admin-only URL.

### Question 4

What is a good way to check for insecure data exposure in an API response using Playwright?

a) Visually inspect the page to see if sensitive data is displayed.
b) Use `page.waitForResponse()`, get the JSON body, and assert that sensitive properties are not present.
c) Take a screenshot of the network tab in DevTools.
d) It is not possible to inspect API responses with Playwright.

**Answer:** b) Use `page.waitForResponse()`, get the JSON body, and assert that sensitive properties are not present.

### Question 5

Does using Playwright for basic security checks replace the need for professional penetration testing?

a) Yes, it covers all necessary security testing.
b) Only if you have 100% test coverage.
c) No, it is a complementary practice but does not replace the need for specialized tools and expert analysis.
d) Yes, because Playwright is more secure than other tools.

**Answer:** c) No, it is a complementary practice but does not replace the need for specialized tools and expert analysis.