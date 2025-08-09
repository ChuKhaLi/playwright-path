# Exercises: Monitoring and Observability

## Exercise 1: Analyze Your Test Reports

**Objective:** Use your test reports to identify key metrics.

**Instructions:**
1. Run your full test suite.
2. Using your HTML or Allure report, answer the following questions:
   - What was the pass/fail rate?
   - What was the total execution time?
   - Which test took the longest to run?
   - Were there any flaky tests (i.e., tests that passed on retry)?

## Exercise 2: Correlate a Test Failure with Logs

**Objective:** Use application logs to debug a test failure.

**Instructions:**
1. You will be given a test that is failing due to a backend error.
2. Run the test and observe the failure.
3. You will be given access to the application's logs.
4. Find the error in the logs that corresponds to the test failure.
5. Use the information from the logs to file a detailed bug report.

## Exercise 3: Team Discussion: A Monitoring Dashboard

**Objective:** Design a dashboard to monitor the health of your test suite.

**Instructions:**
1. As a team, brainstorm the key metrics you would want to see on a test automation dashboard.
2. Sketch out a design for the dashboard.
3. Consider the following questions:
   - Who is the audience for this dashboard?
   - What are the most important pieces of information?
   - How would you use this dashboard to make decisions?
4. If you have a tool like ReportPortal or Allure, try to build a simple version of this dashboard.