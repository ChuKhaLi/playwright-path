# Memory Bank Integration: 05 - Core Principles

## 1. Overview

The memory bank is a persistent storage system designed to provide continuity and context across sessions. It enables modes to track project development progress, understand project specifications, and maintain a shared understanding of the project's state. All modes must interact with the memory bank according to the rules outlined in this document.

## 2. Core Components

The memory bank consists of five core files located in `docs/memory-bank/`:

- **`project_specification.md`**: Stores the project's technical specifications, requirements, and design decisions.
- **`project_state.md`**: Tracks the current state of the project, including created content, completed tasks, and overall progress.
- **`session_context.md`**: Holds ephemeral information relevant to the current development session, such as recent changes or areas of focus.
- **`changelog.md`**: A log of significant changes made to the project specifications or state.
- **`global_rules.md`**: Defines the overarching rules for memory bank interaction (this file).

## 3. General Interaction Rules

- **Read Before Write:** Before performing any action, a mode must read the relevant memory bank files to gain the necessary context.
- **Atomic Updates:** Writes to the memory bank should be atomic and encapsulate a single logical change.
- **Timestamping:** All entries in `changelog.md` must be timestamped using the ISO 8601 format.
- **Respect Privacy:** Do not store personally identifiable information (PII) in the memory bank.
- **Error Handling:** Modes must be able to handle cases where a memory bank file is missing or corrupted.

## 4. Mode-Specific Workflows

Each mode has a specific role in interacting with the memory bank. These are defined in the individual mode rule files. The general principle is that modes should only read from or write to the files that are directly relevant to their function.