# Project Specification

## 1. Project Vision

To build a comprehensive, AI-driven educational platform for learning QA automation with Playwright and TypeScript. The platform will leverage a suite of specialized AI modes to provide a dynamic and interactive learning experience, from generating course content to creating hands-on exercises and providing targeted feedback.

## 2. Core Modules

The platform is built around a series of interconnected educational modules that cover the full spectrum of QA automation.

| Module ID | Module Name | Description |
|---|---|---|
| MOD-01 | Foundations of Web Automation | Introduces core concepts of web automation, HTML, and CSS selectors. |
| MOD-02 | Introduction to Playwright | Covers setting up Playwright, basic commands, and the concept of locators. |
| MOD-03 | Advanced Playwright Techniques | Dives into advanced topics like handling authentication, file uploads, and network interception. |
| MOD-04 | Test Design and architecture | Teaches best practices for structuring a test suite, including Page Object Model (POM). |
| MOD-05 | CI/CD Integration | Explains how to integrate automated tests into a CI/CD pipeline. |

## 3. Technical Architecture

The system is designed with a modular architecture to ensure scalability and maintainability.

- **Frontend:** Not yet defined. The initial focus is on the backend and content generation capabilities.
- **Backend:** The core logic is managed by Roo, an AI agent with access to a filesystem and a suite of specialized modes.
- **AI Modes:** 8 specialized AI modes (`.roomodes`) are responsible for content creation, an educational framework, and more.
- **Rule System:** A hierarchical rule system (`.roo/rules/`) governs the behavior of the AI, ensuring consistency and adherence to educational standards.
- **Memory Bank:** A persistent storage system (`docs/memory-bank/`) that provides context to the AI about the project's state, specifications, and history.
- **Language:** TypeScript is the primary language for all code examples and test scripts.
