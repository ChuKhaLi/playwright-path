# Project Structure Overview

This document provides a high-level overview of the directory structure for the "Ultimate QA Automation Course" repository. Understanding the layout will help you navigate the course content and find what you need.

## High-Level Directory Structure

```
/
├── .github/              # GitHub-specific files, like workflow definitions
├── .roo/                 # Configuration files for the AI instructor, Roo
├── .vscode/              # VS Code workspace settings
├── MOD-01_Foundations/   # Example Module Directory
│   ├── lessons/          # Individual lessons for the module
│   ├── exercises/        # Hands-on exercises
│   └── projects/         # Module-specific projects
├── docs/                 # All project documentation
│   ├── beginner-onboarding/ # Guides for absolute beginners
│   ├── guides/           # Detailed guides on various topics
│   ├── memory-bank/      # The AI's memory and project state
│   ├── resources/        # Curated learning resources
│   └── ...               # Other documentation files
├── node_modules/         # Project dependencies (managed by npm)
├── .gitignore            # Specifies files for Git to ignore
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Exact dependency versions
└── README.md             # The main project README and your course dashboard
```

## Key Directories Explained

### `/MOD-*` (Module Directories)

-   **Purpose**: These are the core of the course. Each `MOD-*` directory represents a self-contained learning module.
-   **Contents**:
    -   `/lessons`: Contains individual lesson plans, explanations, and code examples. Each lesson is in its own subdirectory.
    -   `/exercises`: Holds hands-on exercises that correspond to the lessons. This is where you'll practice what you've learned.
    -   `/projects`: Contains larger, multi-lesson projects that require you to apply several concepts from the module.

### `/docs`

-   **Purpose**: This directory is the central hub for all supplementary documentation.
-   **Contents**:
    -   `MODULE_INDEX.md`: Detailed descriptions of each learning module.
    -   `LEARNING_PATH.md`: The recommended order for progressing through the modules.
    -   `PROJECT_STRUCTURE.md`: This file, explaining the repository layout.
    -   `/beginner-onboarding`: A set of documents specifically designed to help those who are brand new to automation.
    -   `/guides`: In-depth guides on topics like setting up your environment or using specific tools.
    -   `/resources`: A curated catalog of external learning resources, such as articles, videos, and official documentation.
    -   `/memory-bank`: A special directory that contains the "memory" for the AI instructor, Roo. This includes project specifications, state, and changelogs.

### Root Files

-   `package.json`: This is a crucial file for any Node.js project. It lists the project's dependencies (like Playwright) and defines scripts for running tasks (like `npm test`).
-   `README.md`: The first file you should read. It serves as the main entry point to the course, providing an overview, curriculum details, and navigation links.

## How to Use This Structure

1.  **Start with the `README.md`**: It will give you the big picture.
2.  **Follow the `LEARNING_PATH.md`**: It will guide you through the `MOD-*` directories in a logical order.
3.  **Work within the `MOD-*` directories**: This is where the learning happens. Read the lessons and complete the exercises.
4.  **Refer to the `/docs` directory**: Whenever you need more information, a helpful guide, or want to explore a topic in more detail, the `docs` directory is your best friend.