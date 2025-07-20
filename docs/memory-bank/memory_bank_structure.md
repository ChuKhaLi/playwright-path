# Memory Bank Structure

The memory bank is designed to provide a persistent, long-term memory for the AI system, enabling it to maintain context, track project progress, and store critical information across multiple sessions. It is organized into a hierarchical structure that separates global concerns from module-specific information.

## Core Directories

The memory bank is divided into two main directories:

- `global/`: Contains project-wide information that is relevant across all modules.
- `modules/`: Contains information specific to individual learning modules.

### `global/` Directory

This directory stores the foundational pillars of the project's memory. The files within it are essential for maintaining a high-level understanding of the project's goals, state, and rules.

- **`project_specification.md`**: Outlines the technical specifications, requirements, and design decisions for the overall project.
- **`project_state.md`**: Tracks the current state of the project, including created content, completed tasks, and overall progress.
- **`changelog.md`**: A log of significant changes made to the project specifications or state, with each entry timestamped.
- **`global_rules.md`**: Defines the overarching rules for how the AI should interact with the memory bank.

## `modules/` Directory

This directory is organized into subdirectories for each learning module. This modular structure allows for a clear separation of concerns and makes it easier to manage the content for each module.

### Module Naming Convention

Each module is identified by a unique, standardized name in the format `MOD-XX_Name`, where:

- `MOD-XX`: A unique identifier for the module (e.g., `MOD-01`, `MOD-02`).
- `Name`: a descriptive name for the module (e.g., `Foundations`, `Playwright_Intro`).

### Module File Structure

Each module directory contains the following files and subdirectories:

- **`learning_objectives.md`**: Defines the specific, measurable learning objectives for the module.
- **`module_spec.md`**: Outlines the technical specifications and requirements for the module's content and exercises.
- **`module_state.md`**: Tracks the development state of the module, including progress on content creation and exercise development.
- **`content/`**: A directory to store the educational content for the module, such as articles, tutorials, and examples.
- **`exercises/`**: A directory to store the hands-on exercises for the module, designed to reinforce the learning objectives.

This structured approach ensures that the AI can efficiently locate and utilize the information it needs to perform its tasks, while also providing a clear and organized repository for all project-related knowledge.