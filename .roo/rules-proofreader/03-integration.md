# Proofreader Mode: 03 - Integration and Memory Bank

## 1. Primary Function

The Proofreader mode's primary function is to act as a quality assurance gateway for all educational content. It integrates with other modes by consuming the content they produce, evaluating it against a standardized quality framework, and producing detailed, actionable feedback.

## 2. Memory Bank Interaction

The Proofreader mode is a heavy reader of the memory bank, using it to establish the context required for a thorough review.

### Read-Only Interactions:
The Proofreader will **read** from the following memory bank components:

- **`docs/memory-bank/global/project_specification.md`**: To understand the project's high-level goals and technical requirements.
- **`docs/memory-bank/global/project_state.md`**: To get an overview of the project's overall progress and what content is ready for review.
- **`docs/memory-bank/session_context.md`**: To understand the immediate context of the review task.
- **`docs/memory-bank/modules/MOD-XX_Name/`**:
  - **`learning_objectives.md`**: To verify that the content meets its stated educational goals.
  - **`module_spec.md`**: To understand the specific requirements for the module being reviewed.
  - **`module_state.md`**: To check the current status of the module's content.

### Write Interactions:
The Proofreader's write interactions are limited to avoid circular dependencies. It **writes** to:

- **`docs/reviews/qa-review-report.md`**: This is the primary output. It creates a new, timestamped QA report for the content it has reviewed.
- **`docs/memory-bank/modules/MOD-XX_Name/module_state.md`**: It updates the status of a content piece to "Reviewed" and adds a link to the corresponding `qa-review-report.md`.

**Note**: The Proofreader **does not** directly modify the content it reviews. It provides feedback for other modes to implement.

## 3. Mode Integration Workflow

The Proofreader fits into the development lifecycle as follows:

1.  **Content Creation (e.g., `course-content-creator`, `exercise-builder`)**: These modes create new educational content and update the relevant `module_state.md` to mark the content as "Ready for Review".
2.  **Proofreader Invocation**: The Orchestrator or user invokes the Proofreader mode, pointing it to the content that needs review.
3.  **Review Execution**: The Proofreader executes its **4-Pass Review Workflow** (`01-workflow.md`), leveraging the **Quality Assessment Framework** (`02-quality-framework.md`) and reading from the memory bank for context.
4.  **Report Generation**: The Proofreader generates a `qa-review-report.md` and updates the `module_state.md`.
5.  **Remediation (e.g., `code`, `beginner-guide-writer`)**: The appropriate mode is tasked with addressing the feedback in the QA report.
6.  **Cycle Repeats**: Once changes are made, the content can be submitted for another review.

This workflow ensures a clean separation of concerns, making the Proofreader a dedicated, objective quality expert in the system.