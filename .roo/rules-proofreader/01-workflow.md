# Proofreader Mode: 01 - Systematic Review Workflow

## 1. Overview

The Proofreader mode operates on a systematic, multi-pass review workflow to ensure comprehensive and consistent quality assessment of all educational content. Each pass has a distinct focus, preventing cognitive overload and ensuring a thorough audit.

## 2. The 4-Pass Review Process

### Pass 1: Initialization and Automated Analysis
- **Objective**: Establish a baseline and catch low-hanging fruit.
- **Actions**:
  1. **Read `session_context.md`**: Understand the immediate task and recent changes.
  2. **Read `module_state.md`**: Get the status of the content being reviewed.
  3. **Run Automated Tooling**:
     - **Spell Check**: Identify and flag all spelling errors.
     - **Grammar Check**: Use a grammar checker (e.g., Grammarly API) to find grammatical mistakes.
     - **Link Checker**: Verify that all hyperlinks are valid and not broken.
- **Output**: A preliminary report of automated findings.

### Pass 2: Structural and Coherence Analysis
- **Objective**: Evaluate the logical flow, structure, and educational coherence of the content.
- **Actions**:
  1. **Review Learning Objectives**: Does the content meet its stated learning objectives? (Cross-reference with `learning_objectives.md`).
  2. **Assess Content Flow**: Is the information presented in a logical sequence? Does it follow the **Progressive Learning** principle?
  3. **Check for Clarity**: Is the language clear, concise, and easy for a beginner to understand? Are there overly complex sentences or jargon?
  4. **Verify Structural Integrity**: Check headings, subheadings, lists, and code blocks for correct formatting and consistency.
- **Output**: A high-level analysis of the content's structure and readability.

### Pass 3: Technical Deep Dive and Best Practices Audit
- **Objective**: Scrutinize all technical content for accuracy, correctness, and adherence to best practices.
- **Actions**:
  1. **Code Review**:
     - **Accuracy**: Does the code work as intended?
     - **Best Practices**: Does it adhere to Playwright and TypeScript best practices (e.g., no `any` type, use of web-first assertions)?
     - **Readability**: Is the code well-commented and easy to understand?
  2. **Command Verification**: Are all terminal commands accurate and executable on the target system (Windows)?
  3. **Configuration Check**: Are all configuration files (`.json`, `.js`, etc.) correct and well-explained?
  4. **Factual Accuracy**: Are all conceptual explanations technically correct and up-to-date? (Use `ddg-search` to verify if necessary).
- **Output**: A detailed report on the technical quality of the content.

### Pass 4: Synthesis and Final Report Generation
- **Objective**: Consolidate all findings into a single, actionable report.
- **Actions**:
  1. **Synthesize Findings**: Combine the reports from all previous passes.
  2. **Apply Quality Framework**: Score the content against the categories in the **Quality Assessment Framework** (`02-quality-framework.md`).
  3. **Generate `qa-review-report.md`**: Create a formal report that includes:
     - **Executive Summary**: A high-level overview of the quality.
     - **Detailed Findings**: A list of all identified issues, categorized by severity (Critical, High, Medium, Low).
     - **Actionable Recommendations**: Clear, specific suggestions for how to fix each issue.
  4. **Update `module_state.md`**: Mark the content as "Reviewed" and link to the `qa-review-report.md`.
- **Output**: The final, comprehensive `qa-review-report.md` stored in the `docs/reviews/` directory.