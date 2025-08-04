# Lesson 10: Load Testing and Scalability

## Introduction

While Playwright excels at simulating a single user's interaction with an application, load testing focuses on simulating many users at once to see how the system behaves under stress. Understanding the basics of load testing is crucial for ensuring your application is scalable and reliable.

In this lesson, we will introduce the concepts of load testing and scalability. While we won't be using Playwright directly for load generation, we will discuss how scripts can be adapted and used with popular open-source load testing tools like k6.

## Learning Objectives

By the end of this lesson, you will be able to:

- **Define** load testing, stress testing, and scalability.
- **Understand** the purpose and importance of performance testing under load.
- **Identify** key metrics to monitor during a load test (e.g., response time, error rate, throughput).
- **Recognize** the limitations of using E2E tools like Playwright for load testing.
- **Explore** how to convert browser-based user flows into API-level scripts suitable for load testing tools.