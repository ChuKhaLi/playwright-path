# Claude Code Agents for Learning Playwright Project

This directory contains Claude Code sub-agents that replicate the functionality of the roo code custom modes. These agents provide specialized AI assistance for different aspects of educational content creation and QA automation learning.

## Overview

These agents were converted from the original roo code custom modes (`.roomodes`) to Claude Code sub-agents format. Each agent is designed to handle specific tasks related to educational content creation, with appropriate tool access and specialized system prompts.

## Available Agents

### 📚 Content Creation Agents
- **[learning-module-creator](./agents/learning-module-creator.md)** - Creates structured, high-quality learning modules
- **[course-content-creator](./agents/course-content-creator.md)** - Generates comprehensive course materials
- **[beginner-guide-writer](./agents/beginner-guide-writer.md)** - Writes clear, beginner-friendly guides
- **[exercise-builder](./agents/exercise-builder.md)** - Creates hands-on coding exercises
- **[quiz-generator](./agents/quiz-generator.md)** - Designs comprehensive quizzes and assessments

### 🎓 Educational Support Agents
- **[coding-teacher](./agents/coding-teacher.md)** - Provides guided programming instruction
- **[resource-curator](./agents/resource-curator.md)** - Finds and curates learning resources
- **[document-research](./agents/document-research.md)** - Researches technical documentation

### 🔧 Utility Agents
- **[git-commit-assistant](./agents/git-commit-assistant.md)** - Analyzes changes and generates commit messages
- **[proofreader](./agents/proofreader.md)** - Reviews content for quality assurance

## Usage

### Automatic Delegation
Claude Code will automatically delegate tasks to appropriate agents based on:
- Task description in your request
- Agent descriptions and expertise areas
- Current context and available tools

### Explicit Invocation
You can explicitly request a specific agent:
```
> Use the learning-module-creator agent to create a new lesson on TypeScript interfaces
> Have the proofreader agent review my recent content changes
> Ask the coding-teacher agent to help me understand async/await patterns
```

### Proactive Usage
Many agents are designed for proactive use. Include phrases like "use proactively" in your requests to encourage immediate action.

## Agent Architecture

### Tool Mapping
Each agent has specific tool access based on their function:

| Tool Category | Claude Code Tools | Used By |
|---------------|-------------------|---------|
| **File Operations** | `read_file`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace` | Most agents |
| **Search & Discovery** | `search_files`, `list_files`, `list_code_definition_names` | Most agents |
| **Command Execution** | `execute_command` | `git-commit-assistant`, `coding-teacher` |
| **External Resources** | `use_mcp_tool`, `access_mcp_resource` | Content creation agents |

### System Prompt Structure
Each agent follows a consistent structure:
- **Core Expertise**: Specialized knowledge area
- **Key Responsibilities**: Specific tasks and workflows
- **Quality Standards**: Educational and technical standards compliance
- **Process Guidelines**: Step-by-step workflows and best practices

## Educational Standards Integration

All agents are designed to comply with the project's educational standards:
- **Beginner-First**: Assume zero prior knowledge
- **Progressive Learning**: Build concepts incrementally
- **Context is Key**: Always explain why concepts matter
- **Practicality Over Theory**: Focus on real-world application

## Conversion Notes

### From Roo Modes to Claude Agents
The conversion process involved:
1. **YAML to Markdown**: Converted `.roomodes` YAML to individual Markdown files
2. **Tool Mapping**: Mapped roo "groups" to specific Claude Code tools
3. **System Prompt Integration**: Combined `roleDefinition` and `customInstructions`
4. **Description Conversion**: Used `whenToUse` content for agent descriptions

### Key Differences
| Aspect | Roo Modes | Claude Agents |
|--------|-----------|---------------|
| **File Format** | Single YAML file | Individual Markdown files |
| **Tool Access** | Group-based (read, edit, mcp) | Specific tool lists |
| **Location** | `.roomodes` | `.claude/agents/` |
| **Invocation** | Mode switching | Direct agent delegation |

## Best Practices

### Agent Selection
- Use content creation agents for developing new materials
- Use educational support agents for learning and guidance
- Use utility agents for project maintenance tasks

### Quality Assurance
- Always use the proofreader agent for final content review
- Combine multiple agents for complex tasks (e.g., content creator + proofreader)
- Leverage the coding-teacher for learning-focused interactions

### Project Integration
- Agents understand the project's educational standards
- All agents are configured for the QA automation learning context
- Use git-commit-assistant for maintaining clean version history

## Troubleshooting

### Agent Not Responding
- Verify the agent name matches the file name (without `.md`)
- Check that you're using the correct invocation syntax
- Ensure your task aligns with the agent's description

### Tool Access Issues
- Each agent has specific tool permissions
- If an operation fails, try a different agent with broader tool access
- Check the tool mapping table above for reference

### Content Quality Issues
- Use the proofreader agent to identify and fix quality problems
- Ensure content follows the project's educational standards
- Cross-reference with the original `.roomodes` for expected behavior

## Contributing

When modifying agents:
1. Maintain the YAML frontmatter structure
2. Keep system prompts aligned with educational standards
3. Test agent functionality after changes
4. Update this documentation if adding new agents

## Migration from Roo Modes

If you were previously using roo modes, here's how they map to Claude agents:

| Roo Mode | Claude Agent | Key Changes |
|----------|--------------|-------------|
| `learning-module-creator` | `learning-module-creator` | Same functionality, different invocation |
| `exercise-builder` | `exercise-builder` | Enhanced tool access |
| `quiz-generator` | `quiz-generator` | Improved assessment framework |
| `beginner-guide-writer` | `beginner-guide-writer` | Better structure templates |
| `coding-teacher` | `coding-teacher` | Enhanced interactive features |
| `course-content-creator` | `course-content-creator` | More comprehensive framework |
| `resource-curator` | `resource-curator` | Better evaluation criteria |
| `document-research` | `document-research` | Enhanced research methodology |
| `git-commit-assistant` | `git-commit-assistant` | Improved commit analysis |
| `proofreader` | `proofreader` | Comprehensive review framework |

The functionality remains the same, but Claude Code agents provide better context isolation and more flexible tool access control.