# Lesson 10: Assessment

## Knowledge Check

Test your understanding of load testing and scalability.

### Question 1

What is the primary reason Playwright is NOT suitable for generating high levels of user load?

a) It cannot run in a headless mode.
b) It is too slow to execute single tests.
c) Each browser instance it launches is resource-intensive (CPU/memory), making it inefficient for large-scale simulation.
d) It does not have network mocking capabilities.

**Answer:** c) Each browser instance it launches is resource-intensive (CPU/memory), making it inefficient for large-scale simulation.

### Question 2

Which type of performance testing is designed to find the breaking point of a system by pushing it beyond its expected capacity?

a) Load Testing
b) Stress Testing
c) Scalability Testing
d) Soak Testing

**Answer:** b) Stress Testing

### Question 3

Load testing tools like k6 or JMeter primarily operate at which level?

a) The browser UI level
b) The protocol level (e.g., making direct HTTP requests)
c) The database level
d) The operating system level

**Answer:** b) The protocol level (e.g., making direct HTTP requests)

### Question 4

What is the most effective way to use Playwright in the context of creating a load test?

a) Run the Playwright script with thousands of parallel workers.
b) Use Playwright's codegen to record a user journey and identify the underlying API calls to replicate in a load testing tool.
c) Take screenshots during the load test to check for visual bugs.
d) Playwright cannot be used in any capacity for load testing.

**Answer:** b) Use Playwright's codegen to record a user journey and identify the underlying API calls to replicate in a load testing tool.

### Question 5

Which of the following is a key metric to monitor during a load test?

a) The number of locators used in the test script.
b) The test execution time on the runner machine.
c) The application's throughput (requests per second) and error rate.
d) The size of the test report.

**Answer:** c) The application's throughput (requests per second) and error rate.