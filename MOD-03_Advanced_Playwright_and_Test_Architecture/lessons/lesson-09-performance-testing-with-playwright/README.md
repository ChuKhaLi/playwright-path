# Lesson 9: Performance Testing with Playwright

## Overview

While Playwright is primarily a functional testing tool, it provides powerful APIs to measure and assert on key performance metrics of your web application. This lesson introduces how to use Playwright to capture performance data, analyze network requests, and integrate with browser performance tools like the Performance API.

## Learning Objectives

- Understand how Playwright can be used for front-end performance testing.
- Learn to measure page load times and other key performance indicators (KPIs).
- Capture and analyze network requests and responses.
- Use the browser's built-in Performance API within your tests.
- Integrate with other performance tools like Lighthouse (covered in more detail in specialization modules).

## Topics Covered

- Measuring page load performance with `page.goto()`.
- Accessing performance metrics from `window.performance`.
- Intercepting and analyzing network requests with `page.route()`.
- Asserting on network request timings and sizes.
- Capturing and analyzing trace files for performance diagnostics.

## Prerequisites

- Completion of `Lesson 8: Visual Regression and Screenshot Testing`.
- Basic understanding of web performance concepts (e.g., DOMContentLoaded, LCP).