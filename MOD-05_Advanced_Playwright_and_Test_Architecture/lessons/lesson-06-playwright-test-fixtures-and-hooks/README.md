# Lesson 6: Playwright Test Fixtures and Hooks

## Overview

Playwright's test runner (`@playwright/test`) provides powerful tools for setting up and tearing down test environments, managing test data, and reducing boilerplate code. This lesson covers test hooks (`beforeEach`, `afterAll`, etc.) and the concept of fixtures, which are a cornerstone of building a clean and maintainable test framework.

## Learning Objectives

- Understand and use test hooks for setup and teardown logic.
- Grasp the concept of fixtures and how they provide context to tests.
- Learn how to create custom fixtures to encapsulate setup logic and data.
- Use fixtures to manage Page Objects and other helper classes.
- Differentiate between hooks and fixtures and know when to use each.

## Topics Covered

- Test hooks: `beforeEach`, `afterEach`, `beforeAll`, `afterAll`.
- Built-in fixtures: `page`, `context`, `browser`, `request`.
- Creating custom fixtures with `test.extend()`.
- Using fixtures to initialize Page Objects automatically.
- Worker-scoped vs. test-scoped fixtures.
- Passing data from fixtures to tests.

## Prerequisites

- Completion of `Lesson 5: Handling Complex UI Interactions`.
- Solid understanding of POM and TypeScript.