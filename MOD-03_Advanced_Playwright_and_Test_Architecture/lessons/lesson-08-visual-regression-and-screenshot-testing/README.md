# Lesson 8: Visual Regression and Screenshot Testing

## Overview

Functional tests are great at verifying *what* an application does, but they can't easily tell you *how* it looks. Visual regression testing fills this gap by comparing screenshots of your application over time to catch unintended visual changes. Playwright has powerful, built-in support for screenshot testing.

## Learning Objectives

- Understand the purpose and value of visual regression testing.
- Learn how to take and compare screenshots using `toHaveScreenshot()`.
- Manage and update "golden" snapshot files.
- Configure screenshot testing options like thresholds and masking.
- Apply visual testing to pages, elements, and components.

## Topics Covered

- What is visual regression testing?
- Taking your first screenshot assertion with `expect(page).toHaveScreenshot()`.
- The snapshot workflow: running, reviewing, and updating.
- Configuring `toHaveScreenshot` with options (`maxDiffPixels`, `threshold`).
- Masking dynamic elements to avoid flaky tests.
- Best practices for stable visual tests.

## Prerequisites

- Completion of `Lesson 7: Data-Driven Testing and Parameterization`.
- Understanding of how to run Playwright tests from the command line.