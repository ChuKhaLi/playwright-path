# Changelog

## 2025-07-20T04:43:25Z - ARCHITECTURE - Memory Bank Redesign

- **Change:** Implemented a new memory bank structure to align with project development tracking.
- **Reason:** The previous structure was focused on learner progress, which was incorrect. The new structure provides the AI with the necessary context to manage the development of the educational platform itself.
- **Details:**
    - Replaced `learner_profile.md` with `project_specification.md`.
    - Redefined the schemas for `project_state.md`, `session_context.md`, and `global_rules.md`.
    - Initialized all files with project-specific data.