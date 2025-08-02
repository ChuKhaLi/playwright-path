# Exercise 02: Parameter Handling Mastery

## Overview

This advanced exercise focuses on mastering parameter handling in TypeScript step definitions. You'll work with complex parameter types, data tables, doc strings, and custom parameter transformations. This exercise prepares you for handling sophisticated data scenarios in real-world BDD automation.

## Learning Objectives

By completing this exercise, you will be able to:

### **Primary Objectives**
- Handle all Cucumber parameter types with proper TypeScript typing
- Process data tables and doc strings efficiently
- Create custom parameter types for domain-specific data
- Implement parameter validation and transformation logic
- Use advanced parameter patterns for flexible step definitions

### **Secondary Objectives**
- Optimize parameter processing for performance
- Handle edge cases and invalid parameter data
- Implement parameter caching and reuse strategies
- Create reusable parameter processing utilities
- Debug parameter-related issues effectively

## Exercise Scenario

**Context**: You're extending the task management application with advanced features including project management, team collaboration, and reporting. These features require complex data input and processing through your BDD tests.

**Business Value**: Ensuring complex data scenarios work correctly builds confidence in the application's ability to handle real-world usage patterns.

**Your Role**: Senior QA Automation Engineer implementing sophisticated parameter handling for complex business scenarios.

## Prerequisites

- Completed Exercise 01 (Basic Step Definition Workshop)
- Understanding of TypeScript interfaces and generic types
- Familiarity with regular expressions
- Knowledge of JSON data structures

## Task 1: Advanced Parameter Types (20 minutes)

### **Objective**: Implement custom parameter types for complex domain data

### **Implementation**: Create `support/parameter-types.ts`

```typescript
import { defineParameterType } from '@cucumber/cucumber';

// Complex date parameter with multiple format support
defineParameterType({
  name: 'flexible_date',
  regexp: /(?:today|tomorrow|yesterday|next week|last week|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/,
  transformer: (dateString: string): Date => {
    const today = new Date();
    
    switch (dateString.toLowerCase()) {
      case 'today':
        return today;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday;
      case 'next week':
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return nextWeek;
      case 'last week':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return lastWeek;
      default:
        // Handle ISO format (YYYY-MM-DD) or US format (MM/DD/YYYY)
        if (dateString.includes('-')) {
          return new Date(dateString);
        } else {
          const [month, day, year] = dateString.split('/').map(Number);
          return new Date(year, month - 1, day);
        }
    }
  }
});

// Priority level parameter with validation
defineParameterType({
  name: 'priority',
  regexp: /(?:low|medium|high|critical|urgent)/,
  transformer: (priority: string): TaskPriority => {
    const priorityValue = priority.toLowerCase() as keyof typeof PriorityLevels;
    
    if (!PriorityLevels[priorityValue]) {
      throw new Error(`Invalid priority level: ${priority}`);
    }
    
    return {
      level: priorityValue,
      value: PriorityLevels[priorityValue],
      color: PriorityColors[priorityValue]
    };
  }
});

// User specification with attributes
defineParameterType({
  name: 'user_with_attributes',
  regexp: /(?:admin|manager|developer|tester|viewer)(?:\s+with\s+([\w\s,]+))?/,
  transformer: (userSpec: string): UserSpecification => {
    const parts = userSpec.split(' with ');
    const role = parts[0].trim().toLowerCase();
    const attributesString = parts[1] || '';
    
    const attributes = attributesString
      .split(',')
      .map(attr => attr.trim().toLowerCase())
      .filter(attr => attr.length > 0);
    
    return {
      role: role as UserRole,
      attributes,
      permissions: getPermissionsForRole(role as UserRole),
      capabilities: getCapabilitiesForRole(role as UserRole),
      createdAt: new Date()
    };
  }
});

// Time duration parameter with multiple units
defineParameterType({
  name: 'duration',
  regexp: /\d+(?:\.\d+)?\s*(?:seconds?|minutes?|hours?|days?|weeks?|months?)/,
  transformer: (durationString: string): Duration => {
    const match = durationString.match(/(\d+(?:\.\d+)?)\s*(\w+)/);
    if (!match) {
      throw new Error(`Invalid duration format: ${durationString}`);
    }
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase().replace(/s$/, '') as DurationUnit;
    
    return {
      value,
      unit,
      milliseconds: convertToMilliseconds(value, unit),
      humanReadable: durationString
    };
  }
});

// Supporting interfaces and enums
export interface TaskPriority {
  level: keyof typeof PriorityLevels;
  value: number;
  color: string;
}

export interface UserSpecification {
  role: UserRole;
  attributes: string[];
  permissions: string[];
  capabilities: string[];
  createdAt: Date;
}

export interface Duration {
  value: number;
  unit: DurationUnit;
  milliseconds: number;
  humanReadable: string;
}

export type UserRole = 'admin' | 'manager' | 'developer' | 'tester' | 'viewer';
export type DurationUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';

const PriorityLevels = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
  urgent: 5
};

const PriorityColors = {
  low: '#28a745',
  medium: '#ffc107',
  high: '#fd7e14',
  critical: '#dc3545',
  urgent: '#6f42c1'
};

function getPermissionsForRole(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_system'],
    manager: ['read', 'write', 'delete', 'manage_team'],
    developer: ['read', 'write', 'create_tasks'],
    tester: ['read', 'write', 'create_bugs'],
    viewer: ['read']
  };
  
  return permissions[role] || [];
}

function getCapabilitiesForRole(role: UserRole): string[] {
  const capabilities: Record<UserRole, string[]> = {
    admin: ['all'],
    manager: ['team_management', 'project_oversight'],
    developer: ['code_development', 'technical_tasks'],
    tester: ['quality_assurance', 'bug_reporting'],
    viewer: ['read_only_access']
  };
  
  return capabilities[role] || [];
}

function convertToMilliseconds(value: number, unit: DurationUnit): number {
  const conversions: Record<DurationUnit, number> = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000 // Approximate
  };
  
  return value * conversions[unit];
}
```

### **Validation Criteria**
- ✅ All parameter types are properly defined with TypeScript interfaces
- ✅ Complex transformations work correctly
- ✅ Validation logic prevents invalid data
- ✅ Error messages are clear and helpful

## Task 2: Data Table Processing (25 minutes)

### **Objective**: Master complex data table handling with validation and transformation

### **Feature File**: Create `features/project-management.feature`

```gherkin
Feature: Project Management
  As a project manager
  I want to manage projects and tasks
  So that I can track team productivity and project progress

  Background:
    Given I am logged in as a manager with project_management
    And I am on the project management page

  Scenario: Create project with team members
    When I create a new project with the following details:
      | field       | value                    |
      | name        | E-commerce Platform      |
      | description | Online shopping platform |
      | start_date  | today                    |
      | end_date    | next week               |
      | priority    | high                     |
      | budget      | $50000                   |
    And I assign the following team members:
      | name        | role      | email                  | start_date | allocation |
      | John Smith  | developer | john@example.com       | today      | 100%       |
      | Jane Doe    | tester    | jane@example.com       | tomorrow   | 80%        |
      | Bob Johnson | developer | bob@example.com        | today      | 75%        |
    Then the project should be created successfully
    And the team should have 3 members assigned

  Scenario: Create multiple tasks with different priorities
    Given I have a project named "Website Redesign"
    When I create the following tasks:
      | title              | description           | priority | assignee         | due_date  | estimated_hours |
      | Design Homepage    | Create new homepage   | high     | jane@example.com | tomorrow  | 16              |
      | Setup Database     | Configure database    | critical | bob@example.com  | today     | 8               |
      | Write Tests        | Create unit tests     | medium   | jane@example.com | next week | 12              |
      | Deploy to Staging  | Deploy for testing    | high     | john@example.com | next week | 4               |
    Then all 4 tasks should be created
    And 2 tasks should have high priority
    And 1 task should have critical priority
    And the total estimated effort should be 40 hours

  Scenario: Update project timeline with milestones
    Given I have a project named "Mobile App Development"
    When I set the following milestones:
      | milestone           | due_date  | deliverables                    | responsible_team |
      | Requirements Done   | next week | Requirements document, wireframes | Business Analysts |
      | Design Complete     | 2 weeks   | UI/UX designs, prototypes       | Designers        |
      | Development Phase 1 | 1 month   | Core features, basic UI         | Developers       |
      | Testing Phase       | 6 weeks   | Test results, bug reports       | QA Team          |
      | Production Release  | 2 months  | Live application, documentation | DevOps Team      |
    Then the project should have 5 milestones
    And the milestones should be properly scheduled
```

### **Implementation**: Create step definitions for data table processing

```typescript
// step-definitions/project-management.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TaskPriority, Duration, UserSpecification } from '../support/parameter-types';

interface ProjectDetails {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  priority: TaskPriority;
  budget: number;
}

interface TeamMember {
  name: string;
  role: string;
  email: string;
  startDate: Date;
  allocation: number;
}

interface Task {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  dueDate: Date;
  estimatedHours: number;
}

interface Milestone {
  milestone: string;
  dueDate: Date;
  deliverables: string[];
  responsibleTeam: string;
}

When('I create a new project with the following details:', async function (this: CustomWorld, dataTable) {
  const projectData = dataTable.rowsHash();
  
  // Transform and validate project data
  const project: ProjectDetails = {
    name: projectData.name,
    description: projectData.description,
    startDate: this.parseFlexibleDate(projectData.start_date),
    endDate: this.parseFlexibleDate(projectData.end_date),
    priority: this.parsePriority(projectData.priority),
    budget: this.parseCurrency(projectData.budget)
  };
  
  // Validate business rules
  if (project.endDate <= project.startDate) {
    throw new Error('Project end date must be after start date');
  }
  
  if (project.budget <= 0) {
    throw new Error('Project budget must be positive');
  }
  
  // Fill project form
  await this.page!.getByLabel('Project Name').fill(project.name);
  await this.page!.getByLabel('Description').fill(project.description);
  await this.page!.getByLabel('Start Date').fill(this.formatDate(project.startDate));
  await this.page!.getByLabel('End Date').fill(this.formatDate(project.endDate));
  await this.page!.selectOption('select[name="priority"]', project.priority.level);
  await this.page!.getByLabel('Budget').fill(project.budget.toString());
  
  console.log(`✅ Created project: ${project.name} (${project.priority.level} priority, $${project.budget})`);
  
  // Store project data for later verification
  this.testData.currentProject = project;
});

When('I assign the following team members:', async function (this: CustomWorld, dataTable) {
  const teamData = dataTable.hashes();
  const teamMembers: TeamMember[] = [];
  
  for (const memberData of teamData) {
    // Validate and transform team member data
    const member: TeamMember = {
      name: memberData.name.trim(),
      role: memberData.role.toLowerCase(),
      email: this.validateEmail(memberData.email),
      startDate: this.parseFlexibleDate(memberData.start_date),
      allocation: this.parsePercentage(memberData.allocation)
    };
    
    // Validate allocation is reasonable
    if (member.allocation < 0 || member.allocation > 100) {
      throw new Error(`Invalid allocation for ${member.name}: ${member.allocation}%`);
    }
    
    // Add team member to project
    await this.page!.getByRole('button', { name: 'Add Team Member' }).click();
    await this.page!.getByLabel('Member Name').fill(member.name);
    await this.page!.getByLabel('Email').fill(member.email);
    await this.page!.selectOption('select[name="role"]', member.role);
    await this.page!.getByLabel('Start Date').fill(this.formatDate(member.startDate));
    await this.page!.getByLabel('Allocation').fill(member.allocation.toString());
    await this.page!.getByRole('button', { name: 'Add Member' }).click();
    
    teamMembers.push(member);
    console.log(`✅ Added team member: ${member.name} (${member.role}, ${member.allocation}%)`);
  }
  
  // Store team data
  this.testData.currentTeam = teamMembers;
});

When('I create the following tasks:', async function (this: CustomWorld, dataTable) {
  const taskData = dataTable.hashes();
  const tasks: Task[] = [];
  
  for (const taskInfo of taskData) {
    // Transform and validate task data
    const task: Task = {
      title: taskInfo.title.trim(),
      description: taskInfo.description.trim(),
      priority: this.parsePriority(taskInfo.priority),
      assignee: this.validateEmail(taskInfo.assignee),
      dueDate: this.parseFlexibleDate(taskInfo.due_date),
      estimatedHours: parseInt(taskInfo.estimated_hours)
    };
    
    // Validate estimated hours
    if (task.estimatedHours <= 0) {
      throw new Error(`Invalid estimated hours for task "${task.title}": ${task.estimatedHours}`);
    }
    
    // Create task in UI
    await this.page!.getByRole('button', { name: 'New Task' }).click();
    await this.page!.getByLabel('Task Title').fill(task.title);
    await this.page!.getByLabel('Description').fill(task.description);
    await this.page!.selectOption('select[name="priority"]', task.priority.level);
    await this.page!.selectOption('select[name="assignee"]', task.assignee);
    await this.page!.getByLabel('Due Date').fill(this.formatDate(task.dueDate));
    await this.page!.getByLabel('Estimated Hours').fill(task.estimatedHours.toString());
    await this.page!.getByRole('button', { name: 'Create Task' }).click();
    
    tasks.push(task);
    console.log(`✅ Created task: ${task.title} (${task.priority.level} priority, ${task.estimatedHours}h)`);
  }
  
  // Store tasks for verification
  this.testData.currentTasks = tasks;
});

When('I set the following milestones:', async function (this: CustomWorld, dataTable) {
  const milestoneData = dataTable.hashes();
  const milestones: Milestone[] = [];
  
  for (const milestoneInfo of milestoneData) {
    // Process milestone data
    const milestone: Milestone = {
      milestone: milestoneInfo.milestone.trim(),
      dueDate: this.parseFlexibleDate(milestoneInfo.due_date),
      deliverables: milestoneInfo.deliverables.split(',').map(d => d.trim()),
      responsibleTeam: milestoneInfo.responsible_team.trim()
    };
    
    // Validate deliverables
    if (milestone.deliverables.length === 0) {
      throw new Error(`Milestone "${milestone.milestone}" must have at least one deliverable`);
    }
    
    // Add milestone to project
    await this.page!.getByRole('button', { name: 'Add Milestone' }).click();
    await this.page!.getByLabel('Milestone Name').fill(milestone.milestone);
    await this.page!.getByLabel('Due Date').fill(this.formatDate(milestone.dueDate));
    await this.page!.getByLabel('Responsible Team').fill(milestone.responsibleTeam);
    
    // Add deliverables
    for (const deliverable of milestone.deliverables) {
      await this.page!.getByLabel('Deliverable').fill(deliverable);
      await this.page!.getByRole('button', { name: 'Add Deliverable' }).click();
    }
    
    await this.page!.getByRole('button', { name: 'Save Milestone' }).click();
    
    milestones.push(milestone);
    console.log(`✅ Added milestone: ${milestone.milestone} (${milestone.deliverables.length} deliverables)`);
  }
  
  // Store milestones
  this.testData.currentMilestones = milestones;
});

// Helper methods for the World class
declare module '../support/world' {
  interface CustomWorld {
    parseFlexibleDate(dateString: string): Date;
    parsePriority(priorityString: string): TaskPriority;
    parseCurrency(currencyString: string): number;
    parsePercentage(percentageString: string): number;
    validateEmail(email: string): string;
    formatDate(date: Date): string;
  }
}

// Implementation of helper methods
CustomWorld.prototype.parseFlexibleDate = function(dateString: string): Date {
  // Use the custom parameter type transformer
  const transformer = require('../support/parameter-types');
  return transformer.transformFlexibleDate(dateString);
};

CustomWorld.prototype.parsePriority = function(priorityString: string): TaskPriority {
  const levels: Record<string, TaskPriority> = {
    low: { level: 'low', value: 1, color: '#28a745' },
    medium: { level: 'medium', value: 2, color: '#ffc107' },
    high: { level: 'high', value: 3, color: '#fd7e14' },
    critical: { level: 'critical', value: 4, color: '#dc3545' },
    urgent: { level: 'urgent', value: 5, color: '#6f42c1' }
  };
  
  const priority = levels[priorityString.toLowerCase()];
  if (!priority) {
    throw new Error(`Invalid priority: ${priorityString}`);
  }
  
  return priority;
};

CustomWorld.prototype.parseCurrency = function(currencyString: string): number {
  const amount = parseFloat(currencyString.replace(/[$,]/g, ''));
  if (isNaN(amount)) {
    throw new Error(`Invalid currency format: ${currencyString}`);
  }
  return amount;
};

CustomWorld.prototype.parsePercentage = function(percentageString: string): number {
  const percentage = parseFloat(percentageString.replace('%', ''));
  if (isNaN(percentage)) {
    throw new Error(`Invalid percentage format: ${percentageString}`);
  }
  return percentage;
};

CustomWorld.prototype.validateEmail = function(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }
  return email.toLowerCase();
};

CustomWorld.prototype.formatDate = function(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};
```

### **Validation Criteria**
- ✅ Data tables are processed with proper validation
- ✅ Complex transformations maintain data integrity
- ✅ Business rules are enforced during processing
- ✅ Error handling provides clear feedback for invalid data

## Task 3: Doc String Processing (15 minutes)

### **Objective**: Handle multi-line content with formatting and validation

### **Feature Enhancement**: Add doc string scenarios

```gherkin
  Scenario: Create project documentation
    Given I have a project named "API Development"
    When I add the following project description:
      """
      This project involves developing a RESTful API for the e-commerce platform.
      
      Key Features:
      - User authentication and authorization
      - Product catalog management
      - Order processing and payment integration
      - Inventory management
      - Reporting and analytics
      
      Technical Requirements:
      - Node.js with Express framework
      - MongoDB database
      - JWT for authentication
      - Redis for caching
      - Docker containerization
      
      Timeline: 3 months
      Team Size: 5 developers, 2 testers
      """
    And I add implementation notes:
      """
      # Implementation Guidelines
      
      ## Phase 1: Authentication (Week 1-2)
      - Set up JWT authentication
      - Implement user registration/login
      - Create role-based access control
      
      ## Phase 2: Core API (Week 3-6)
      - Product catalog endpoints
      - Order management APIs
      - Payment processing integration
      
      ## Phase 3: Advanced Features (Week 7-10)
      - Inventory management
      - Reporting endpoints
      - Performance optimization
      
      ## Phase 4: Testing & Deployment (Week 11-12)
      - Comprehensive testing
      - Production deployment
      - Documentation finalization
      """
    Then the project documentation should be saved
    And the description should contain "RESTful API"
    And the notes should contain "4 phases"
```

### **Implementation**: Doc string processing steps

```typescript
When('I add the following project description:', async function (this: CustomWorld, docString: string) {
  // Process and validate the description
  const processedDescription = this.processDocString(docString, {
    removeExtraWhitespace: true,
    validateLength: { min: 50, max: 2000 },
    extractMetadata: true
  });
  
  // Fill the description field
  await this.page!.getByLabel('Project Description').fill(processedDescription.content);
  
  // Store processed description
  this.testData.projectDescription = processedDescription;
  
  console.log(`✅ Added project description (${processedDescription.content.length} characters)`);
  console.log(`   Metadata: ${JSON.stringify(processedDescription.metadata)}`);
});

When('I add implementation notes:', async function (this: CustomWorld, docString: string) {
  // Process markdown-formatted notes
  const processedNotes = this.processDocString(docString, {
    preserveFormatting: true,
    extractHeaders: true,
    validateMarkdown: true
  });
  
  // Fill the notes field
  await this.page!.getByLabel('Implementation Notes').fill(processedNotes.content);
  
  // Store processed notes
  this.testData.implementationNotes = processedNotes;
  
  console.log(`✅ Added implementation notes with ${processedNotes.metadata.headerCount} sections`);
});

// Enhanced doc string processing utility
declare module '../support/world' {
  interface CustomWorld {
    processDocString(content: string, options?: DocStringOptions): ProcessedDocString;
  }
}

interface DocStringOptions {
  removeExtraWhitespace?: boolean;
  validateLength?: { min: number; max: number };
  extractMetadata?: boolean;
  preserveFormatting?: boolean;
  extractHeaders?: boolean;
  validateMarkdown?: boolean;
}

interface ProcessedDocString {
  content: string;
  originalLength: number;
  processedLength: number;
  metadata: {
    wordCount?: number;
    lineCount?: number;
    headerCount?: number;
    bulletPoints?: number;
    codeBlocks?: number;
    links?: string[];
    keyPhrases?: string[];
  };
}

CustomWorld.prototype.processDocString = function(content: string, options: DocStringOptions = {}): ProcessedDocString {
  let processedContent = content;
  const metadata: any = {};
  
  // Remove extra whitespace if requested
  if (options.removeExtraWhitespace) {
    processedContent = processedContent
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple empty lines to double
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single
      .trim();
  }
  
  // Validate length if specified
  if (options.validateLength) {
    if (processedContent.length < options.validateLength.min) {
      throw new Error(`Content too short: ${processedContent.length} < ${options.validateLength.min} characters`);
    }
    if (processedContent.length > options.validateLength.max) {
      throw new Error(`Content too long: ${processedContent.length} > ${options.validateLength.max} characters`);
    }
  }
  
  // Extract metadata if requested
  if (options.extractMetadata) {
    metadata.wordCount = processedContent.split(/\s+/).length;
    metadata.lineCount = processedContent.split('\n').length;
    metadata.bulletPoints = (processedContent.match(/^\s*[-*+]/gm) || []).length;
    metadata.keyPhrases = this.extractKeyPhrases(processedContent);
  }
  
  // Extract headers if processing markdown
  if (options.extractHeaders) {
    const headers = processedContent.match(/^#+\s+.+$/gm) || [];
    metadata.headerCount = headers.length;
    metadata.headers = headers.map(h => h.replace(/^#+\s+/, ''));
  }
  
  // Validate markdown syntax if requested
  if (options.validateMarkdown) {
    this.validateMarkdownSyntax(processedContent);
  }
  
  // Extract code blocks
  const codeBlocks = processedContent.match(/```[\s\S]*?```/g) || [];
  metadata.codeBlocks = codeBlocks.length;
  
  // Extract links
  const links = processedContent.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  metadata.links = links.map(link => {
    const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
    return match ? { text: match[1], url: match[2] } : null;
  }).filter(Boolean);
  
  return {
    content: processedContent,
    originalLength: content.length,
    processedLength: processedContent.length,
    metadata
  };
};

CustomWorld.prototype.extractKeyPhrases = function(content: string): string[] {
  // Simple key phrase extraction (in real implementation, you might use NLP libraries)
  const phrases = content
    .toLowerCase()
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 20)
    .slice(0, 5); // Top 5 sentences as key phrases
  
  return phrases;
};

CustomWorld.prototype.validateMarkdownSyntax = function(content: string): void {
  // Basic markdown validation
  const issues: string[] = [];
  
  // Check for unmatched backticks
  const backtickMatches = content.match(/`/g);
  if (backtickMatches && backtickMatches.length % 2 !== 0) {
    issues.push('Unmatched backticks found');
  }
  
  // Check for unmatched code blocks
  const codeBlockMatches = content.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    issues.push('Unmatched code block markers found');
  }
  
  // Check for broken links
  const brokenLinks = content.match(/\[[^\]]*\]\([^)]*$/gm);
  if (brokenLinks) {
    issues.push(`Broken link syntax found: ${brokenLinks.length} instances`);
  }
  
  if (issues.length > 0) {
    throw new Error(`Markdown validation failed: ${issues.join(', ')}`);
  }
};
```

### **Validation Criteria**
- ✅ Doc strings are processed with appropriate formatting
- ✅ Metadata extraction provides useful information
- ✅ Markdown validation catches syntax errors
- ✅ Content length validation prevents issues

## Task 4: Advanced Validation and Error Handling (10 minutes)

### **Objective**: Implement comprehensive parameter validation with recovery strategies

### **Implementation**: Enhanced validation utilities

```typescript
// support/parameter-validation.ts
export class ParameterValidator {
  static validateAndTransform<T>(
    value: any,
    validator: (val: any) => T,
    fieldName: string,
    options: ValidationOptions = {}
  ): T {
    try {
      // Apply transformation/validation
      const result = validator(value);
      
      // Apply additional constraints if specified
      if (options.required && (result === null || result === undefined)) {
        throw new Error(`${fieldName} is required`);
      }
      
      if (options.customValidator) {
        const customResult = options.customValidator(result);
        if (customResult !== true) {
          throw new Error(typeof customResult === 'string' ? customResult : `${fieldName} failed custom validation`);
        }
      }
      
      return result;
      
    } catch (error) {
      // Enhanced error with context
      const enhancedError = new ParameterValidationError(
        `Parameter validation failed for ${fieldName}: ${error.message}`,
        fieldName,
        value,
        error
      );
      
      // Apply fallback if available
      if (options.fallback !== undefined) {
        console.warn(`Using fallback value for ${fieldName}: ${options.fallback}`);
        return options.fallback;
      }
      
      throw enhancedError;
    }
  }
  
  static validateBatch(validations: BatchValidation[]): any[] {
    const results: any[] = [];
    const errors: ParameterValidationError[] = [];
    
    for (const validation of validations) {
      try {
        const result = this.validateAndTransform(
          validation.value,
          validation.validator,
          validation.fieldName,
          validation.options
        );
        results.push(result);
      } catch (error) {
        if (validation.options?.required !== false) {
          errors.push(error as ParameterValidationError);
        } else {
          results.push(validation.options?.fallback || null);
        }
      }
    }
    
    if (errors.length > 0) {
      throw new BatchValidationError('Multiple validation errors occurred', errors);
    }
    
    return results;
  }
}

export interface ValidationOptions {
  required?: boolean;
  fallback?: any;
  customValidator?: (value: any) => boolean | string;
}

export interface BatchValidation {
  value: any;
  validator: (val: any) => any;
  fieldName: string;
  options?: ValidationOptions;
}

export class ParameterValidationError extends Error {
  constructor(
    message: string,
    public fieldName: string,
    public originalValue: any,
    public originalError: Error
  ) {
    super(message);
    this.name = 'ParameterValidationError';
  }
}

export class BatchValidationError extends Error {
  constructor(
    message: string,
    public validationErrors: ParameterValidationError[]
  ) {
    super(message);
    this.name = 'BatchValidationError';
  }
  
  getErrorSummary(): Record<string, string> {
    const summary: Record<string, string> = {};
    for (const error of this.validationErrors) {
      summary[error.fieldName] = error.message;
    }
    return summary;
  }
}

// Usage in step definitions
When('I create a validated project with complex data:', async function (this: CustomWorld, dataTable) {
  const projectData = dataTable.rowsHash();
  
  try {
    // Batch validation with comprehensive error handling
    const [name, budget, startDate, endDate, priority] = ParameterValidator.validateBatch([
      {
        value: projectData.name,
        validator: (val) => {
          if (typeof val !== 'string' || val.trim().length === 0) {
            throw new Error('Project name must be a non-empty string');
          }
          return val.trim();
        },
        fieldName: 'name',
        options: { required: true }
      },
      {
        value: projectData.budget,
        validator: (val) => this.parseCurrency(val),
        fieldName: 'budget',
        options: {
          required: true,
          customValidator: (budget) => budget > 0 || 'Budget must be positive'
        }
      },
      {
        value: projectData.start_date,
        validator: (val) => this.parseFlexibleDate(val),
        fieldName: 'start_date',
        options: { required: true }
      },
      {
        value: projectData.end_date,
        validator: (val) => this.parseFlexibleDate(val),
        fieldName: 'end_date',
        options: { required: true }
      },
      {
        value: projectData.priority,
        validator: (val) => this.parsePriority(val),
        fieldName: 'priority',
        options: { 
          required: false, 
          fallback: this.parsePriority('medium') 
        }
      }
    ]);
    
    // Cross-field validation
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }
    
    // Create project with validated data
    const project = { name, budget, startDate, endDate, priority };
    await this.createProjectInUI(project);
    
    console.log('✅ Project created with validated parameters');
    
  } catch (error) {
    if (error instanceof BatchValidationError) {
      console.error('❌ Multiple validation errors:');
      const summary = error.getErrorSummary();
      for (const [field, message] of Object.entries(summary)) {
        console.error(`   ${field}: ${message}`);
      }
    }
    
    // Take screenshot for debugging
    await this.page!.screenshot({
      path: `screenshots/validation-error-${Date.now()}.png`,
      fullPage: true
    });
    
    throw error;
  }
});
```

### **Validation Criteria**
- ✅ Validation errors are caught and handled gracefully
- ✅ Batch validation processes multiple parameters efficiently
- ✅ Error messages provide actionable feedback
- ✅ Fallback values are used when appropriate

## Extension Challenges

### **Challenge 1: Dynamic Parameter Types** (Optional - 15 minutes)
Create parameter types that adapt based on context:

```typescript
// Context-aware user parameter that changes validation based on current page
defineParameterType({
  name: 'contextual_user',
  regexp: /[\w\s]+/,
  transformer: function(userName: string): ContextualUser {
    const context = this.getCurrentContext(); // Access World context
    
    if (context.currentPage === 'admin') {
      return validateAdminUser(userName);
    } else if (context.currentPage === 'project') {
      return validateProjectUser(userName);
    } else {
      return validateGeneralUser(userName);
    }
  }
});
```

### **Challenge 2: Performance Optimization** (Optional - 10 minutes)
Implement parameter processing caching:

```typescript
class ParameterCache {
  private static cache = new Map<string, any>();
  
  static get<T>(key: string, transformer: () => T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const result = transformer();
    this.cache.set(key, result);
    return result;
  }
  
  static clear(): void {
    this.cache.clear();
  }
}
```

### **Challenge 3: Internationalization** (Optional - 20 minutes)
Add support for multiple languages in parameter processing:

```typescript
defineParameterType({
  name: 'localized_date',
  regexp: /[\w\s,]+/,
  transformer: (dateString: string): Date => {
    const locale = process.env.LOCALE || 'en-US';
    return parseLocalizedDate(dateString, locale);
  }
});
```

## Success Validation

### **Completion Checklist**
- [ ] Custom parameter types are implemented and tested
- [ ] Data table processing handles complex scenarios
- [ ] Doc string processing maintains formatting
- [ ] Validation provides comprehensive error handling
- [ ] All feature scenarios pass successfully
- [ ] Extension challenges attempted (optional)

### **Quality Metrics**
- [ ] Parameter validation catches 100% of invalid inputs
- [ ] Error messages are helpful and actionable
- [ ] Processing performance is acceptable (< 100ms per parameter)
- [ ] Memory usage remains stable during processing
- [ ] Code coverage exceeds 90% for parameter handling

## Running Your Implementation

```bash
# Run parameter handling tests
npx cucumber-js features/project-management.feature

# Run with debug output
DEBUG_PARAMS=true npx cucumber-js

# Performance testing
PERFORMANCE_MODE=true npx cucumber-js

# Run specific scenarios
npx cucumber-js --name "Create project with team members"
```

---

## Summary

This exercise has mastered:

- ✅ **Advanced Parameter Types**: Custom transformations for complex domain data
- ✅ **Data Table Mastery**: Sophisticated table processing with validation
- ✅ **Doc String Processing**: Multi-line content with formatting preservation
- ✅ **Comprehensive Validation**: Robust error handling and recovery strategies
- ✅ **Performance Optimization**: Efficient parameter processing techniques

You now have the skills to handle any parameter scenario in professional BDD automation, from simple string extraction to complex business data transformations.

*Time to complete: 60-80 minutes*  
*Difficulty: Intermediate to Advanced*  
*Skills gained: Complex parameter handling, data validation, error recovery*