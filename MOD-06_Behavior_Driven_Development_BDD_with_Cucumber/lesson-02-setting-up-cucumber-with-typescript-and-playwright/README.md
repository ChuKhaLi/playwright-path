# Lesson 02: Setting up Cucumber with TypeScript and Playwright

## Overview

This lesson focuses on the practical implementation of a BDD testing environment by setting up Cucumber.js with TypeScript and Playwright. Students will learn to configure a complete BDD testing stack, understand project structure best practices, and create their first automated BDD test setup.

## Learning Objectives

By the end of this lesson, you will be able to:

- **Install and configure** Cucumber.js with TypeScript in a Windows environment
- **Set up** Playwright integration for BDD web automation testing
- **Organize** project structure following BDD best practices and conventions
- **Configure** TypeScript settings for optimal Cucumber development experience
- **Create** basic configuration files for Cucumber execution and reporting
- **Validate** your BDD environment setup through test execution
- **Troubleshoot** common setup issues and environment configuration problems

## Prerequisites

- Completion of MOD-01 (TypeScript Fundamentals)
- Completion of MOD-E2E-01 (Playwright Basics)
- Basic understanding of BDD concepts from Lesson 01
- Node.js and npm installed on Windows system
- Visual Studio Code or similar IDE configured for TypeScript

## Lesson Structure

### 1. Content Sections
- **Environment Setup Requirements** - Understanding the technology stack
- **Project Initialization** - Creating and configuring a new BDD project
- **Cucumber.js Installation** - Installing and configuring the BDD framework
- **TypeScript Integration** - Setting up TypeScript compilation and configuration
- **Playwright Integration** - Connecting Playwright for web automation
- **Project Structure Organization** - Best practices for BDD project layout
- **Configuration Files** - Creating cucumber.json, tsconfig.json, and other configs
- **First Test Execution** - Validating the complete setup

### 2. Practical Examples
- **Complete project setup walkthrough** with Windows PowerShell commands
- **Configuration file examples** with detailed explanations
- **Project structure templates** following industry best practices
- **Integration patterns** demonstrating Cucumber + TypeScript + Playwright synergy

### 3. Hands-on Exercises
- **Environment setup exercise** - Creating your own BDD project from scratch
- **Configuration customization** - Adapting settings for different project needs
- **Troubleshooting scenarios** - Resolving common setup issues
- **Integration validation** - Confirming all components work together correctly

### 4. Visual Learning Aids
- **Setup process flowchart** showing step-by-step installation process
- **Project structure diagram** illustrating file organization
- **Configuration dependency map** showing how files relate to each other
- **Technology stack diagram** visualizing component relationships

### 5. Assessment Components
- **Knowledge check questions** on setup procedures and configuration
- **Practical setup task** requiring students to create a working environment
- **Troubleshooting scenarios** testing problem-solving skills
- **Configuration analysis** evaluating understanding of setup choices

## Key Technologies Covered

- **@cucumber/cucumber** - Core BDD testing framework
- **@types/node** - TypeScript definitions for Node.js
- **ts-node** - TypeScript execution environment
- **@playwright/test** - Web automation testing framework
- **typescript** - Type-safe JavaScript development
- **cucumber-html-reporter** - BDD test reporting (optional)

## Success Criteria

Students successfully complete this lesson when they:
- ✅ Can create a new BDD project with proper structure
- ✅ Successfully install and configure all required dependencies
- ✅ Execute a basic BDD test scenario using the configured environment
- ✅ Understand the role of each configuration file in the setup
- ✅ Can troubleshoot common installation and configuration issues
- ✅ Demonstrate integration between Cucumber, TypeScript, and Playwright

## Time Estimation

- **Reading and Understanding:** 45 minutes
- **Hands-on Practice:** 90 minutes
- **Exercises and Assessment:** 60 minutes
- **Total Lesson Time:** 3 hours and 15 minutes

## Files and Resources

| Component | File | Purpose | Lines |
|-----------|------|---------|-------|
| **Documentation** | `content.md` | Detailed lesson content and explanations | ~400 |
| **Examples** | `examples/` | 4 practical implementation examples | ~1200 |
| **Exercises** | `exercises/` | 4 hands-on practice exercises | ~1000 |
| **Assessment** | `assessment.md` | Knowledge check and practical evaluation | ~300 |
| **Visuals** | `visuals/` | 6 diagrams and visual learning aids | ~1000 |

## Integration Notes

This lesson builds directly on:
- **Lesson 01** BDD concepts and collaborative methodology
- **MOD-01** TypeScript fundamentals and async programming
- **MOD-E2E-01** Basic Playwright installation and usage

This lesson prepares students for:
- **Lesson 03** Writing feature files with Gherkin syntax
- **Lesson 04** Implementing step definitions in TypeScript
- **All subsequent lessons** requiring a configured BDD environment

## Common Challenges

Students often encounter these challenges in this lesson:
1. **Windows-specific path and permission issues** during installation
2. **TypeScript configuration complexity** with multiple config files
3. **Version compatibility** between Cucumber, TypeScript, and Playwright
4. **Project structure confusion** when organizing BDD files
5. **Environment variable setup** for different execution contexts

## Support Resources

- Official Cucumber.js documentation and setup guides
- Playwright TypeScript integration documentation
- Windows PowerShell command reference
- Troubleshooting guide for common setup issues
- Community best practices for BDD project organization

---

**Previous Lesson:** [01 - Introduction to BDD and Cucumber](../lesson-01-introduction-to-bdd-and-cucumber/README.md)  
**Next Lesson:** [03 - Writing Feature Files with Gherkin](../lesson-03-writing-feature-files-with-gherkin/README.md)  
**Module Home:** [MOD-06 BDD with Cucumber](../../README.md)