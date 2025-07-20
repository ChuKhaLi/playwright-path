# Proofreader Mode: 02 - Quality Assessment Framework

## 1. Purpose

This document defines the quality assessment framework used by the Proofreader mode. It provides a structured, multi-dimensional rubric for evaluating educational content, ensuring that all reviews are consistent, fair, and aligned with the project's global educational standards.

## 2. The 10-Category Quality Framework

Each piece of content is evaluated against the following 10 categories. Each category is scored on a scale of 1-5, where 1 is "Poor" and 5 is "Excellent".

### Category 1: Educational Content Philosophy
- **Alignment**: Does the content adhere to the **Beginner-First**, **Progressive Learning**, and **Context is Key** principles?
- **Practicality**: Is the focus on practical, real-world application?

### Category 2: Writing Style and Tone
- **Clarity and Simplicity**: Is the language clear, simple, and free of jargon?
- **Tone**: Is the tone encouraging, patient, and supportive?
- **Voice**: Is the active voice used effectively?

### Category 3: Code Examples and Best Practices
- **Readability**: Are code examples well-commented and easy to understand?
- **TypeScript Best Practices**: Is strong typing used? Is `any` avoided?
- **Playwright Best Practices**: Are web-first assertions and robust locators used?

### Category 4: Structural Integrity
- **Learning Objectives**: Does the content meet its stated objectives?
- **Logical Flow**: Is the structure logical and easy to follow?
- **Formatting**: Is markdown formatting (headings, lists, etc.) used correctly and consistently?

### Category 5: Technical Accuracy
- **Code Correctness**: Does the code execute without errors and produce the intended output?
- **Command Accuracy**: Are all CLI commands correct for the specified (Windows) environment?
- **Factual Correctness**: Are all technical concepts and explanations accurate?

### Category 6: Completeness and Depth
- **Topic Coverage**: Does the content cover the topic adequately for the target audience?
- **Handling Edge Cases**: Does the content address potential errors or edge cases?

### Category 7: Engagement and Practicality
- **Real-World Relevance**: Are the examples and exercises practical and relevant?
- **Engagement**: Is the content engaging and likely to hold the learner's interest?

### Category 8: Adherence to System Requirements
- **Windows Syntax**: Do all commands and file paths use Windows-compatible syntax?
- **Shell Compatibility**: Are scripts compatible with PowerShell?

### Category 9: Visual Aids and Presentation
- **Use of Visuals**: Are diagrams, screenshots, or other visuals used effectively to support the text?
- **Overall Presentation**: Is the content well-presented and visually appealing?

### Category 10: Memory Bank Integration
- **Contextual Awareness**: Does the content reflect an understanding of the project state as defined in the memory bank?
- **Specification Adherence**: Does it align with the `project_specification.md`?

## 3. Scoring and Reporting

The scores from each category are aggregated to produce an overall quality score. This score, along with detailed feedback for each category, forms the core of the `qa-review-report.md`.