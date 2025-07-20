# System Requirements: 02 - Windows Syntax

## 1. Command Line Syntax

All command-line operations must use Windows-compatible syntax. This is to ensure that all commands run correctly on the target system.

### Key Considerations:

- **File Paths:** Use backslashes (`\`) for file paths, and enclose paths with spaces in double quotes.
- **Environment Variables:** Use `%VARIABLE%` syntax for environment variables.
- **Command Chaining:** Use `&&` to chain commands together.

## 2. Shell

The default shell is PowerShell. Ensure all scripts and commands are compatible with PowerShell.

## 3. Examples

- **Good:** `xcopy "C:\My Files" "D:\Backup" /E /H /C /I`
- **Bad:** `cp -r "/c/My Files" "/d/Backup"`