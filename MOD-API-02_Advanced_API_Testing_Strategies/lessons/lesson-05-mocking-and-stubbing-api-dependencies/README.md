# Lesson 5: Mocking and Stubbing API Dependencies

## Overview

In a complex system, services often depend on other services. Testing a service in isolation, without relying on its real dependencies, is crucial for creating fast, reliable, and independent tests. This lesson covers strategies for mocking and stubbing these API dependencies.

## Learning Objectives

- Understand the difference between mocking and stubbing.
- Learn why and when to replace real dependencies with test doubles.
- Implement API mocking using Playwright's `page.route()` for UI tests.
- Learn strategies for mocking dependencies in pure API-to-API tests.
- Use mocking to simulate various scenarios, such as errors, delays, and empty responses.

## Topics Covered

- Mocks vs. Stubs vs. Fakes.
- The benefits of testing in isolation.
- Advanced `page.route()` for mocking in E2E tests.
- Simulating network latency and failures.
- Service virtualization concepts for API testing.
- Strategies for replacing downstream service calls in API tests.