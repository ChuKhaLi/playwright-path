# Memory Bank Integration: 05 - Core Principles

## 1. Overview

The memory bank is a persistent storage system designed to provide continuity and context across sessions. It enables modes to track project development progress, understand project specifications, and maintain a shared understanding of the project's state. All modes must interact with the memory bank according to the rules outlined in this document.

## 2. Core Components

The memory bank is organized into a hierarchical structure within the `docs/memory-bank/` directory, separating global project data from module-specific information.

For a detailed explanation of the structure, see the [Memory Bank Structure Documentation](../../docs/memory-bank/memory_bank_structure.md).

### Global Components (`docs/memory-bank/global/`)
- **`project_specification.md`**: Stores the project's technical specifications, requirements, and design decisions.
- **`project_state.md`**: Tracks the current state of the project, including created content, completed tasks, and overall progress.
- **`changelog.md`**: A log of significant changes made to the project specifications or state.
- **`global_rules.md`**: Defines the overarching rules for memory bank interaction.

### Session Context
- **`docs/memory-bank/session_context.md`**: Holds ephemeral information relevant to the current development session, such as recent changes or areas of focus.

### Modular Components (`docs/memory-bank/modules/`)
This directory contains subdirectories for each learning module, following the `MOD-XX_Name` format. Each module has its own set of memory files, such as `learning_objectives.md`, `module_spec.md`, and `module_state.md`.

## 3. General Interaction Rules

- **Read Before Write:** Before performing any action, a mode must read the relevant memory bank files to gain the necessary context.
- **Atomic Updates:** Writes to the memory bank should be atomic and encapsulate a single logical change.
- **Timestamping:** All entries in `changelog.md` must be timestamped using the ISO 8601 format.
- **Respect Privacy:** Do not store personally identifiable information (PII) in the memory bank.
- **Error Handling:** Modes must be able to handle cases where a memory bank file is missing or corrupted.

## 4. Mode-Specific Workflows

Each mode has a specific role in interacting with the memory bank. These are defined in the individual mode rule files. The general principle is that modes should only read from or write to the files that are directly relevant to their function.