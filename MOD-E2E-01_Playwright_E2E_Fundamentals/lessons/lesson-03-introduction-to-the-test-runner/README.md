# Lesson 03: Introduction to the Test Runner

## Overview

This lesson introduces learners to Playwright's test runner structure and organization. You'll learn how to structure tests, use hooks for setup and teardown, and understand the execution flow of test suites.

## Learning Objectives

By the end of this lesson, you will be able to:

- Understand the structure of Playwright tests using the [`test()`](./examples/test-runner-demo.spec.ts:5) function
- Organize tests into logical groups using [`describe()`](./examples/test-runner-demo.spec.ts:3) blocks
- Implement test hooks ([`beforeEach`](./examples/test-runner-demo.spec.ts:8), [`afterEach`](./examples/test-runner-demo.spec.ts:12), [`beforeAll`](./examples/test-runner-demo.spec.ts:16), [`afterAll`](./examples/test-runner-demo.spec.ts:20)) for setup and cleanup
- Understand the execution order of hooks and tests
- Use test modifiers like [`.skip`](./content.md:85) and [`.only`](./content.md:89) for test control

## What You'll Learn

1. **Test Function Basics**: How to write individual tests using the [`test()`](./content.md:15) function
2. **Test Organization**: Grouping related tests with [`describe()`](./content.md:35) blocks
3. **Test Hooks**: Setting up and cleaning up test environments
4. **Execution Flow**: Understanding when and how hooks run in relation to tests
5. **Test Modifiers**: Controlling which tests run during development

## Prerequisites

- Completion of Lesson 01 (Playwright Installation and Setup)
- Completion of Lesson 02 (Project Structure and Configuration)
- Basic understanding of JavaScript/TypeScript functions

## Lesson Structure

- **Content**: Detailed explanation of test runner concepts
- **Examples**: Working code demonstration in [`test-runner-demo.spec.ts`](./examples/test-runner-demo.spec.ts)
- **Exercise**: Hands-on practice creating test files with hooks
- **Assessment**: Quiz to test understanding of test runner concepts

## Time Estimate

- **Reading**: 20 minutes
- **Examples**: 15 minutes
- **Exercise**: 20 minutes
- **Assessment**: 5 minutes
- **Total**: ~60 minutes

## Files in This Lesson

- [`content.md`](./content.md) - Main lesson content
- [`examples/test-runner-demo.spec.ts`](./examples/test-runner-demo.spec.ts) - Code demonstration
- [`exercises/hands-on-practice.md`](./exercises/hands-on-practice.md) - Practice exercise
- [`assessment.md`](./assessment.md) - Knowledge check quiz

## Next Steps

After completing this lesson, you'll be ready to move on to more advanced Playwright concepts like locators and interactions in the following lessons.