# Example 04: Troubleshooting Common Issues

## Overview

This example provides solutions to the most frequently encountered problems when setting up BDD environments with Cucumber, TypeScript, and Playwright. Each issue includes symptoms, root causes, and step-by-step resolution procedures.

## Target Audience

**Beginner to Intermediate** - Covers common setup problems that developers encounter during initial configuration and ongoing maintenance.

## Issue Categories

### 1. Installation and Dependency Issues

#### Issue 1.1: TypeScript Compilation Errors

**Symptoms:**
```bash
error TS2307: Cannot find module '@cucumber/cucumber' or its corresponding type declarations.
error TS2307: Cannot find module '@playwright/test' or its corresponding type declarations.
```

**Root Cause:** Missing or incorrect TypeScript definitions for BDD libraries.

**Solution:**

1. **Verify TypeScript and type definitions installation:**
```powershell
# Check installed packages
npm list typescript @types/node
npm list @cucumber/cucumber @playwright/test

# Install missing type definitions
npm install --save-dev @types/node
npm install --save-dev typescript ts-node
```

2. **Update tsconfig.json with proper configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": false,
    "outDir": "./dist",
    "rootDir": "./",
    "typeRoots": ["./node_modules/@types", "./types"]
  },
  "include": [
    "features/**/*",
    "src/**/*",
    "types/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "reports"
  ]
}
```

**Verification:**
```powershell
# Test TypeScript compilation
npx tsc --noEmit

# Run type checking
npm run typecheck
```

#### Issue 1.2: Playwright Browser Installation Failures

**Symptoms:**
```bash
browserType.launch: Failed to launch chromium
Error: Browser executable not found
```

**Root Cause:** Playwright browsers not properly installed or corrupted installation.

**Solution:**

1. **Clear existing browser installations:**
```powershell
# Remove existing browsers
npx playwright uninstall

# Clear Playwright cache
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\ms-playwright" -ErrorAction SilentlyContinue
```

2. **Reinstall browsers with system dependencies:**
```powershell
# Install browsers with dependencies
npx playwright install --with-deps

# For CI environments, install specific browsers only
npx playwright install chromium
```

3. **Verify browser installation:**
```powershell
# List installed browsers
npx playwright install --dry-run

# Test browser launch
npx playwright open --browser=chromium https://example.com
```

## Quick Reference Guide

### Common Commands

```powershell
# Environment setup
npm install
npx playwright install
npm run config:validate

# Run tests
npm test                          # All tests
npm run test:dev                  # Development mode
npm run test:headed               # Visible browser
npm run test:debug                # Debug mode

# Troubleshooting
npx tsc --noEmit                  # Check TypeScript
npx cucumber-js --dry-run         # Validate configuration
npx playwright install --dry-run  # Check browsers
```

### Common Error Patterns

| Error Pattern | Likely Cause | Quick Fix |
|---------------|--------------|-----------| 
| `Cannot find module` | Missing dependency | `npm install [package]` |
| `Browser executable not found` | Playwright not installed | `npx playwright install` |
| `No step definitions found` | Wrong file paths | Check `cucumber.json` paths |
| `Page is closed` | Context management | Implement proper World pattern |
| `Timeout exceeded` | Slow operations | Increase timeout values |

## Summary

Troubleshooting BDD setups requires systematic diagnosis of installation issues, configuration problems, execution issues, and debugging challenges. Using diagnostic tools and following systematic approaches helps quickly identify and resolve common setup problems.