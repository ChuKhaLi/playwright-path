# Roo Modes to Claude Code Agents Conversion Guide

This document provides a detailed mapping of how each roo code custom mode was converted to a Claude Code sub-agent.

## Conversion Methodology

### 1. File Structure Transformation
```
Before (Roo):                   After (Claude):
.roomodes (single YAML file) → .claude/agents/ (multiple MD files)
```

### 2. Tool Access Mapping
| Roo Group | Claude Code Tools |
|-----------|-------------------|
| `read` | `read_file`, `search_files`, `list_files`, `list_code_definition_names` |
| `edit` | `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace` |
| `mcp` | `use_mcp_tool`, `access_mcp_resource` |
| `command` | `execute_command` |
| `browser` | Browser tools (if available) |

### 3. Content Structure Mapping
| Roo Field | Claude Field | Notes |
|-----------|--------------|--------|
| `slug` | `name` | Agent identifier |
| `whenToUse` | `description` | When to invoke the agent |
| `groups` | `tools` | Mapped to specific tool names |
| `roleDefinition` + `customInstructions` | Markdown body | Combined system prompt |

## Individual Agent Conversions

### 1. Learning Module Creator
**Roo Mode:** `learning-module-creator`
**Claude Agent:** [`learning-module-creator.md`](./agents/learning-module-creator.md)

**Key Changes:**
- Enhanced educational standards section
- Added code quality standards
- Improved pedagogical framework

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

### 2. Exercise Builder
**Roo Mode:** `exercise-builder`
**Claude Agent:** [`exercise-builder.md`](./agents/exercise-builder.md)

**Key Changes:**
- Added exercise design principles
- Enhanced learning progression framework
- Improved code quality standards

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

### 3. Quiz Generator
**Roo Mode:** `quiz-generator`
**Claude Agent:** [`quiz-generator.md`](./agents/quiz-generator.md)

**Key Changes:**
- Added question design framework
- Enhanced difficulty progression guidelines
- Improved feedback quality standards

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

### 4. Beginner Guide Writer
**Roo Mode:** `beginner-guide-writer`
**Claude Agent:** [`beginner-guide-writer.md`](./agents/beginner-guide-writer.md)

**Key Changes:**
- Added writing principles section
- Enhanced structural approach guidelines
- Improved content structure template

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

### 5. Coding Teacher
**Roo Mode:** `coding-teacher`
**Claude Agent:** [`coding-teacher.md`](./agents/coding-teacher.md)

**Key Changes:**
- Preserved comprehensive teaching methodology
- Enhanced workflow structure
- Added execution command capability

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `execute_command`, `use_mcp_tool`, `access_mcp_resource`

### 6. Course Content Creator
**Roo Mode:** `course-content-creator`
**Claude Agent:** [`course-content-creator.md`](./agents/course-content-creator.md)

**Key Changes:**
- Added content creation framework
- Enhanced lesson design pattern
- Improved quality assurance checklist

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

### 7. Resource Curator
**Roo Mode:** `resource-curator`
**Claude Agent:** [`resource-curator.md`](./agents/resource-curator.md)

**Key Changes:**
- Added resource evaluation framework
- Enhanced curation process
- Improved documentation standards

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

### 8. Document Research
**Roo Mode:** `document-research`
**Claude Agent:** [`document-research.md`](./agents/document-research.md)

**Key Changes:**
- Added research methodology
- Enhanced information validation process
- Improved quality assurance framework

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

### 9. Git Commit Assistant
**Roo Mode:** `git-commit-assistant`
**Claude Agent:** [`git-commit-assistant.md`](./agents/git-commit-assistant.md)

**Key Changes:**
- Enhanced conventional commit format section
- Added educational context types
- Improved analysis workflow

**Tools:** `execute_command`, `read_file`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`

### 10. Proofreader
**Roo Mode:** `proofreader`
**Claude Agent:** [`proofreader.md`](./agents/proofreader.md)

**Key Changes:**
- Added comprehensive quality review framework
- Enhanced review process
- Improved report template

**Tools:** `read_file`, `search_files`, `list_files`, `list_code_definition_names`, `write_to_file`, `apply_diff`, `insert_content`, `search_and_replace`, `use_mcp_tool`, `access_mcp_resource`

## Benefits of the Conversion

### 1. Context Isolation
Each agent operates in its own context window, preventing conversation pollution and maintaining focus on specific tasks.

### 2. Granular Tool Access
Instead of broad group-based permissions, each agent has access to specific tools needed for its function.

### 3. Specialized Expertise
Enhanced system prompts provide more detailed guidance and best practices for each agent's domain.

### 4. Better Reusability
Agents can be easily shared and used across different projects and teams.

### 5. Flexible Invocation
Supports both automatic delegation and explicit invocation based on task context.

## Migration Checklist

When migrating from roo modes to Claude agents:

- [ ] Verify all 10 agents are created in `.claude/agents/`
- [ ] Test each agent's functionality with sample tasks
- [ ] Update any documentation references from roo modes to Claude agents
- [ ] Train team members on new invocation syntax
- [ ] Consider keeping `.roomodes` as backup during transition period

## Usage Examples

### Before (Roo):
```
/mode learning-module-creator
Create a lesson on TypeScript interfaces
```

### After (Claude):
```
Use the learning-module-creator agent to create a lesson on TypeScript interfaces
```

or simply:
```
Create a lesson on TypeScript interfaces
```
(Claude will automatically delegate to the appropriate agent)

## Troubleshooting

### Common Issues and Solutions

1. **Agent not found**: Ensure file names match exactly (no typos)
2. **Tool access denied**: Check agent's tool list in YAML frontmatter
3. **Unexpected behavior**: Compare agent prompt with original roo mode definition
4. **Missing functionality**: Verify all custom instructions were properly converted

## Future Enhancements

Potential improvements to consider:
- Add more specialized agents for specific QA domains
- Enhance tool access based on usage patterns
- Create agent composition patterns for complex workflows
- Add performance metrics and usage analytics