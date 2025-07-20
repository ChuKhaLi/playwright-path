# Global Rules for Memory Bank Interaction

## 1. Core Principle

The memory bank serves as the central nervous system for the AI, providing the necessary context to develop and maintain the educational platform. All interactions with the memory bank must support this core principle.

## 2. File-Specific Rules

### `project_specification.md`
- **Purpose:** To store the foundational, long-term vision and technical architecture of the project.
- **Rule:** This file should only be modified after a formal architectural decision has been made and recorded in the `changelog.md`. It is considered the "constitution" of the project.

### `project_state.md`
- **Purpose:** To provide a real-time snapshot of the project's development status.
- **Rule:** This file must be updated at the beginning and end of any task that involves content creation or modification. The `Current Focus` section must accurately reflect the active task.

### `session_context.md`
- **Purpose:** To maintain short-term memory for the current development session.
- **Rule:** This file is ephemeral and should be updated frequently throughout a session to track tool usage, key decisions, and temporary notes. It should be cleared at the start of a new session.

### `changelog.md`
- **Purpose:** To create an immutable log of significant project milestones and decisions.
- **Rule:** Every significant change (e.g., architectural updates, module completion, new feature integration) must be recorded here with a timestamp. Entries are append-only.

## 3. General Rules
- **Consistency:** Ensure that the information across all memory bank files is consistent. For example, if `project_state.md` shows a module as `COMPLETED`, there should be a corresponding entry in `changelog.md`.
- **Read Before Write:** Always read the relevant files to gain context before making any changes.
- **Clarity:** All entries should be clear, concise, and written in a way that is easily parsable by the AI.