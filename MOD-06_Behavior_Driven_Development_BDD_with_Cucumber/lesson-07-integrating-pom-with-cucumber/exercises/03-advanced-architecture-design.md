# Exercise 03: Advanced Architecture Design

## Overview

This exercise focuses on designing enterprise-level page object architectures using advanced design patterns. You'll implement component-based systems, factory patterns, fluent interfaces, and performance optimization techniques to create scalable, maintainable test automation frameworks.

**Duration**: 90 minutes  
**Difficulty**: Advanced  
**Prerequisites**: Exercises 01-02 completed, advanced TypeScript knowledge, design patterns familiarity  

## Learning Objectives

By completing this exercise, you will be able to:

- ✅ **Design Enterprise Architecture**: Create scalable, multi-layer page object hierarchies
- ✅ **Implement Component Patterns**: Build reusable UI component abstractions
- ✅ **Apply Factory Patterns**: Create dynamic page object creation and lifecycle management
- ✅ **Build Fluent Interfaces**: Design chainable methods for improved test readability
- ✅ **Optimize Performance**: Implement caching, lazy loading, and parallel operations

---

## Exercise Scenario

You're tasked with architecting a comprehensive page object framework for a large-scale e-commerce platform called "TechShop Enterprise". This platform has complex UI components, multiple user roles, dynamic content, and high-performance requirements.

### Enterprise Requirements

**TechShop Enterprise** features:
- **Multi-Role Access**: Customer, Admin, Vendor, Support interfaces
- **Complex Components**: Data tables, modals, wizards, rich text editors
- **Dynamic Content**: Real-time updates, infinite scroll, lazy loading
- **Performance Demands**: Sub-second page load times, concurrent user support
- **Scalability Needs**: Support for 100+ page objects, multiple teams

### Technical Architecture Goals

- **Modular Design**: Component-based architecture with clear separation of concerns
- **Performance Optimization**: Efficient element location and interaction strategies
- **Type Safety**: Comprehensive TypeScript integration with advanced generics
- **Extensibility**: Easy addition of new pages and components
- **Maintainability**: Clean code patterns that support team collaboration

---

## Setup Instructions

### 1. Advanced Project Structure

Extend your project with this enterprise-level structure:

```
src/
├── pages/
│   ├── base/
│   │   ├── BasePage.ts
│   │   ├── BaseModal.ts
│   │   └── BaseComponent.ts
│   ├── components/
│   │   ├── forms/
│   │   │   ├── FormComponent.ts
│   │   │   ├── LoginForm.ts
│   │   │   └── CheckoutForm.ts
│   │   ├── navigation/
│   │   │   ├── NavigationComponent.ts
│   │   │   ├── HeaderNavigation.ts
│   │   │   └── SidebarNavigation.ts
│   │   ├── data/
│   │   │   ├── DataTableComponent.ts
│   │   │   ├── ProductGrid.ts
│   │   │   └── OrderHistory.ts
│   │   └── common/
│   │       ├── ModalComponent.ts
│   │       ├── NotificationComponent.ts
│   │       └── LoadingComponent.ts
│   ├── customer/
│   │   ├── CustomerDashboard.ts
│   │   ├── ProductCatalogPage.ts
│   │   └── CheckoutPage.ts
│   ├── admin/
│   │   ├── AdminDashboard.ts
│   │   ├── UserManagement.ts
│   │   └── ProductManagement.ts
│   └── factory/
│       ├── PageFactory.ts
│       ├── ComponentFactory.ts
│       └── PageBuilder.ts
├── types/
│   ├── page-types.ts
│   ├── component-types.ts
│   └── factory-types.ts
├── utils/
│   ├── performance/
│   │   ├── ElementCache.ts
│   │   ├── PerformanceMonitor.ts
│   │   └── LazyLoader.ts
│   └── builders/
│       ├── FluentBuilder.ts
│       └── ChainableActions.ts
└── config/
    ├── PageConfig.ts
    └── ComponentConfig.ts
```

### 2. Advanced Type Definitions

Create comprehensive type definitions:

```typescript
// src/types/component-types.ts
export interface ComponentMetadata {
  selector: string;
  name: string;
  timeout: number;
  retryAttempts: number;
}

export interface FormFieldConfig {
  name: string;
  selector: string;
  type: 'input' | 'select' | 'checkbox' | 'radio' | 'textarea';
  validation?: (value: string) => boolean;
  required?: boolean;
}

export interface DataTableColumn {
  header: string;
  selector: string;
  type: 'text' | 'number' | 'date' | 'action';
  sortable?: boolean;
  filterable?: boolean;
}

export interface NavigationItem {
  label: string;
  selector: string;
  url?: string;
  children?: NavigationItem[];
}

// src/types/factory-types.ts
export interface PageDefinition {
  name: string;
  url: string;
  components: ComponentDefinition[];
  waitStrategy: 'load' | 'networkidle' | 'domcontentloaded';
  timeout: number;
}

export interface ComponentDefinition {
  type: string;
  selector: string;
  config: Record<string, any>;
}

export interface FluentAction<T> {
  execute(): Promise<T>;
  and(): T;
  then<U>(action: (result: T) => Promise<U>): Promise<U>;
}
```

---

## Task 1: Implement Advanced Base Architecture (25 minutes)

### Objective
Create a sophisticated base architecture that supports inheritance, composition, and advanced TypeScript patterns.

### Requirements

#### 1.1: Enhanced Base Page Class

Create `src/pages/base/BasePage.ts` with advanced features:

```typescript
// src/pages/base/BasePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { PageMetadata } from '../../types/page-types';
import { PerformanceMonitor } from '../../utils/performance/PerformanceMonitor';
import { ElementCache } from '../../utils/performance/ElementCache';

export abstract class BasePage<T = any> {
  protected page: Page;
  protected baseUrl: string;
  protected elementCache: ElementCache;
  protected performanceMonitor: PerformanceMonitor;
  protected components: Map<string, any> = new Map();

  constructor(page: Page, baseUrl: string = process.env.BASE_URL || 'http://localhost:3000') {
    this.page = page;
    this.baseUrl = baseUrl;
    this.elementCache = new ElementCache(page);
    this.performanceMonitor = new PerformanceMonitor(page);
  }

  // Abstract methods - must be implemented by subclasses
  abstract getPageMetadata(): PageMetadata;
  abstract waitForPageLoad(): Promise<void>;
  abstract isPageLoaded(): Promise<boolean>;

  // TODO: Implement these advanced methods

  /**
   * Navigate to page with performance monitoring
   */
  async navigateToPage(): Promise<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get cached locator with performance optimization
   */
  protected getCachedLocator(selector: string, cacheKey?: string): Locator {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Register a component with this page
   */
  protected registerComponent<C>(name: string, component: C): C {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get registered component by name
   */
  protected getComponent<C>(name: string): C {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Execute action with performance monitoring
   */
  protected async executeWithMonitoring<R>(
    actionName: string,
    action: () => Promise<R>
  ): Promise<R> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Wait for multiple conditions in parallel
   */
  protected async waitForConditions(
    conditions: (() => Promise<boolean>)[]
  ): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Batch multiple locator operations
   */
  protected async batchLocatorOperations<R>(
    operations: { locator: Locator; operation: string; args?: any[] }[]
  ): Promise<R[]> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Advanced error handling with context
   */
  protected async handleError(error: Error, context: string): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get page performance metrics
   */
  async getPerformanceMetrics(): Promise<Record<string, number>> {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

#### 1.2: Base Component Class

Create `src/pages/base/BaseComponent.ts`:

```typescript
// src/pages/base/BaseComponent.ts
import { Page, Locator } from '@playwright/test';
import { ComponentMetadata } from '../../types/component-types';

export abstract class BaseComponent<T = any> {
  protected page: Page;
  protected rootLocator: Locator;
  protected parentElement?: Locator;

  constructor(page: Page, rootSelector: string, parentElement?: Locator) {
    this.page = page;
    this.rootLocator = parentElement 
      ? parentElement.locator(rootSelector) 
      : page.locator(rootSelector);
    this.parentElement = parentElement;
  }

  // Abstract methods
  abstract getComponentMetadata(): ComponentMetadata;
  abstract isComponentVisible(): Promise<boolean>;
  abstract waitForComponent(): Promise<void>;

  // TODO: Implement these component methods

  /**
   * Get component state
   */
  async getComponentState(): Promise<Record<string, any>> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Validate component integrity
   */
  async validateComponent(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get nested component by selector
   */
  protected getNestedComponent<C extends BaseComponent>(
    ComponentClass: new (page: Page, selector: string, parent?: Locator) => C,
    selector: string
  ): C {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Execute component action with retry logic
   */
  protected async executeWithRetry<R>(
    action: () => Promise<R>,
    maxRetries: number = 3
  ): Promise<R> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Chain multiple component actions
   */
  chain(): ComponentChain<T> {
    // Your implementation here - return chainable interface
    throw new Error('Method not implemented');
  }
}

// Chainable interface for fluent API
export interface ComponentChain<T> {
  click(): ComponentChain<T>;
  fill(value: string): ComponentChain<T>;
  select(value: string): ComponentChain<T>;
  check(): ComponentChain<T>;
  uncheck(): ComponentChain<T>;
  hover(): ComponentChain<T>;
  focus(): ComponentChain<T>;
  blur(): ComponentChain<T>;
  execute(): Promise<T>;
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Performance Monitoring:**
```typescript
async navigateToPage(): Promise<T> {
  const startTime = Date.now();
  const metadata = this.getPageMetadata();
  
  await this.page.goto(`${this.baseUrl}${metadata.url}`);
  await this.waitForPageLoad();
  
  const loadTime = Date.now() - startTime;
  this.performanceMonitor.recordPageLoad(metadata.url, loadTime);
  
  return this as any;
}
```

**Element Caching:**
```typescript
protected getCachedLocator(selector: string, cacheKey?: string): Locator {
  const key = cacheKey || selector;
  
  if (!this.elementCache.has(key)) {
    const locator = this.page.locator(selector);
    this.elementCache.set(key, locator);
  }
  
  return this.elementCache.get(key);
}
```

**Component Registration:**
```typescript
protected registerComponent<C>(name: string, component: C): C {
  this.components.set(name, component);
  return component;
}

protected getComponent<C>(name: string): C {
  if (!this.components.has(name)) {
    throw new Error(`Component '${name}' not found`);
  }
  return this.components.get(name) as C;
}
```

</details>

### Validation Criteria

- [ ] **Base architecture** supports inheritance and composition
- [ ] **Performance monitoring** tracks page and component metrics
- [ ] **Element caching** improves operation efficiency
- [ ] **Component registration** enables modular design
- [ ] **Error handling** provides comprehensive debugging information

---

## Task 2: Create Reusable UI Components (25 minutes)

### Objective
Implement sophisticated UI components that can be reused across different pages and contexts.

### Requirements

#### 2.1: Form Component System

Create `src/pages/components/forms/FormComponent.ts`:

```typescript
// src/pages/components/forms/FormComponent.ts
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../../base/BaseComponent';
import { FormFieldConfig, ComponentMetadata } from '../../../types/component-types';

export class FormComponent extends BaseComponent {
  private fields: Map<string, FormFieldConfig> = new Map();
  private submitButton: Locator;
  private resetButton: Locator;

  constructor(page: Page, formSelector: string, parentElement?: Locator) {
    super(page, formSelector, parentElement);
    this.submitButton = this.rootLocator.locator('[type="submit"], .submit-button');
    this.resetButton = this.rootLocator.locator('[type="reset"], .reset-button');
  }

  getComponentMetadata(): ComponentMetadata {
    return {
      selector: this.rootLocator.toString(),
      name: 'Form Component',
      timeout: 5000,
      retryAttempts: 3
    };
  }

  // TODO: Implement these form methods

  /**
   * Configure form fields
   */
  configureFields(fieldConfigs: FormFieldConfig[]): FormComponent {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Fill form with data object
   */
  async fillForm(data: Record<string, any>): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Validate form field values
   */
  async validateForm(): Promise<{ isValid: boolean; errors: string[] }> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Submit form and wait for response
   */
  async submitForm(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get form data as object
   */
  async getFormData(): Promise<Record<string, string>> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get form validation state
   */
  async getValidationState(): Promise<Record<string, boolean>> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  async isComponentVisible(): Promise<boolean> {
    return await this.rootLocator.isVisible();
  }

  async waitForComponent(): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible' });
  }
}
```

#### 2.2: Data Table Component

Create `src/pages/components/data/DataTableComponent.ts`:

```typescript
// src/pages/components/data/DataTableComponent.ts
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../../base/BaseComponent';
import { DataTableColumn, ComponentMetadata } from '../../../types/component-types';

export class DataTableComponent extends BaseComponent {
  private headers: Locator;
  private rows: Locator;
  private paginationControls: Locator;
  private searchBox: Locator;
  private columns: DataTableColumn[] = [];

  constructor(page: Page, tableSelector: string, parentElement?: Locator) {
    super(page, tableSelector, parentElement);
    this.headers = this.rootLocator.locator('thead th, .table-header');
    this.rows = this.rootLocator.locator('tbody tr, .table-row');
    this.paginationControls = this.rootLocator.locator('.pagination, .table-pagination');
    this.searchBox = this.rootLocator.locator('.search-input, [data-testid="table-search"]');
  }

  getComponentMetadata(): ComponentMetadata {
    return {
      selector: this.rootLocator.toString(),
      name: 'Data Table Component',
      timeout: 10000,
      retryAttempts: 2
    };
  }

  // TODO: Implement these data table methods

  /**
   * Configure table columns
   */
  configureColumns(columns: DataTableColumn[]): DataTableComponent {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get all table data
   */
  async getTableData(): Promise<Record<string, any>[]> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Search table data
   */
  async searchTable(searchTerm: string): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Sort table by column
   */
  async sortByColumn(columnName: string, direction: 'asc' | 'desc' = 'asc'): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Filter table by column value
   */
  async filterByColumn(columnName: string, filterValue: string): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get row data by index
   */
  async getRowData(rowIndex: number): Promise<Record<string, any>> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Click action in specific row
   */
  async clickRowAction(rowIndex: number, actionSelector: string): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<boolean> {
    // Your implementation here - return false if no next page
    throw new Error('Method not implemented');
  }

  /**
   * Get current page number
   */
  async getCurrentPage(): Promise<number> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get total number of rows
   */
  async getRowCount(): Promise<number> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  async isComponentVisible(): Promise<boolean> {
    return await this.rootLocator.isVisible();
  }

  async waitForComponent(): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible' });
    // Wait for data to load
    await this.page.waitForTimeout(1000);
  }
}
```

#### 2.3: Modal Component

Create `src/pages/components/common/ModalComponent.ts`:

```typescript
// src/pages/components/common/ModalComponent.ts
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../../base/BaseComponent';
import { ComponentMetadata } from '../../../types/component-types';

export class ModalComponent extends BaseComponent {
  private titleElement: Locator;
  private bodyElement: Locator;
  private closeButton: Locator;
  private confirmButton: Locator;
  private cancelButton: Locator;
  private overlay: Locator;

  constructor(page: Page, modalSelector: string = '.modal, .dialog', parentElement?: Locator) {
    super(page, modalSelector, parentElement);
    this.titleElement = this.rootLocator.locator('.modal-title, .dialog-title');
    this.bodyElement = this.rootLocator.locator('.modal-body, .dialog-body');
    this.closeButton = this.rootLocator.locator('.close, .modal-close, [data-testid="close-modal"]');
    this.confirmButton = this.rootLocator.locator('.confirm, .ok-button, [data-testid="confirm"]');
    this.cancelButton = this.rootLocator.locator('.cancel, .cancel-button, [data-testid="cancel"]');
    this.overlay = this.page.locator('.modal-overlay, .dialog-overlay');
  }

  getComponentMetadata(): ComponentMetadata {
    return {
      selector: this.rootLocator.toString(),
      name: 'Modal Component',
      timeout: 5000,
      retryAttempts: 3
    };
  }

  // TODO: Implement these modal methods

  /**
   * Get modal title
   */
  async getTitle(): Promise<string> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get modal body text
   */
  async getBodyText(): Promise<string> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Confirm modal action
   */
  async confirm(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Cancel modal action
   */
  async cancel(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Close modal using close button
   */
  async close(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Close modal by clicking overlay
   */
  async closeByOverlay(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Wait for modal to appear
   */
  async waitForModal(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Wait for modal to disappear
   */
  async waitForModalToDisappear(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if modal is dismissible
   */
  async isDismissible(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  async isComponentVisible(): Promise<boolean> {
    return await this.rootLocator.isVisible();
  }

  async waitForComponent(): Promise<void> {
    await this.waitForModal();
  }
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Form Configuration:**
```typescript
configureFields(fieldConfigs: FormFieldConfig[]): FormComponent {
  fieldConfigs.forEach(config => {
    this.fields.set(config.name, config);
  });
  return this;
}

async fillForm(data: Record<string, any>): Promise<void> {
  for (const [fieldName, value] of Object.entries(data)) {
    const fieldConfig = this.fields.get(fieldName);
    if (!fieldConfig) continue;

    const fieldLocator = this.rootLocator.locator(fieldConfig.selector);
    
    switch (fieldConfig.type) {
      case 'input':
      case 'textarea':
        await fieldLocator.fill(value.toString());
        break;
      case 'select':
        await fieldLocator.selectOption(value.toString());
        break;
      case 'checkbox':
      case 'radio':
        if (value) await fieldLocator.check();
        else await fieldLocator.uncheck();
        break;
    }
  }
}
```

**Data Table Operations:**
```typescript
async getTableData(): Promise<Record<string, any>[]> {
  const data = [];
  const rowCount = await this.rows.count();
  
  for (let i = 0; i < rowCount; i++) {
    const row = this.rows.nth(i);
    const rowData: Record<string, any> = {};
    
    for (const column of this.columns) {
      const cellSelector = `td:nth-child(${this.columns.indexOf(column) + 1})`;
      const cellText = await row.locator(cellSelector).textContent();
      rowData[column.header] = cellText?.trim() || '';
    }
    
    data.push(rowData);
  }
  
  return data;
}
```

</details>

### Validation Criteria

- [ ] **Form component** handles all input types correctly
- [ ] **Data table component** supports search, sort, and pagination
- [ ] **Modal component** manages all interaction patterns
- [ ] **Component composition** allows nesting and reuse
- [ ] **Type safety** maintained throughout component hierarchy

---

## Task 3: Implement Factory Patterns (20 minutes)

### Objective
Create factory classes that dynamically generate page objects and components based on configuration.

### Requirements

#### 3.1: Page Factory

Create `src/pages/factory/PageFactory.ts`:

```typescript
// src/pages/factory/PageFactory.ts
import { Page } from '@playwright/test';
import { PageDefinition } from '../../types/factory-types';
import { BasePage } from '../base/BasePage';

export class PageFactory {
  private static pageRegistry: Map<string, new (page: Page, baseUrl?: string) => BasePage> = new Map();
  private static componentFactories: Map<string, any> = new Map();

  // TODO: Implement these factory methods

  /**
   * Register a page class
   */
  static registerPage<T extends BasePage>(
    name: string,
    PageClass: new (page: Page, baseUrl?: string) => T
  ): void {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Create page instance by name
   */
  static createPage<T extends BasePage>(
    name: string,
    page: Page,
    baseUrl?: string
  ): T {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Create page from definition
   */
  static createPageFromDefinition(
    definition: PageDefinition,
    page: Page,
    baseUrl?: string
  ): BasePage {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Build page with components
   */
  static buildPageWithComponents<T extends BasePage>(
    PageClass: new (page: Page, baseUrl?: string) => T,
    page: Page,
    componentDefinitions: any[],
    baseUrl?: string
  ): T {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get all registered pages
   */
  static getRegisteredPages(): string[] {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if page is registered
   */
  static hasPage(name: string): boolean {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Clear page registry
   */
  static clearRegistry(): void {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

#### 3.2: Component Factory

Create `src/pages/factory/ComponentFactory.ts`:

```typescript
// src/pages/factory/ComponentFactory.ts
import { Page, Locator } from '@playwright/test';
import { ComponentDefinition } from '../../types/factory-types';
import { BaseComponent } from '../base/BaseComponent';
import { FormComponent } from '../components/forms/FormComponent';
import { DataTableComponent } from '../components/data/DataTableComponent';
import { ModalComponent } from '../components/common/ModalComponent';

export class ComponentFactory {
  private static componentRegistry: Map<string, new (page: Page, selector: string, parent?: Locator) => BaseComponent> = new Map();

  static {
    // Register built-in components
    ComponentFactory.registerComponent('form', FormComponent);
    ComponentFactory.registerComponent('datatable', DataTableComponent);
    ComponentFactory.registerComponent('modal', ModalComponent);
  }

  // TODO: Implement these component factory methods

  /**
   * Register a component class
   */
  static registerComponent<T extends BaseComponent>(
    type: string,
    ComponentClass: new (page: Page, selector: string, parent?: Locator) => T
  ): void {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Create component instance by type
   */
  static createComponent<T extends BaseComponent>(
    type: string,
    page: Page,
    selector: string,
    parent?: Locator
  ): T {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Create component from definition
   */
  static createComponentFromDefinition(
    definition: ComponentDefinition,
    page: Page,
    parent?: Locator
  ): BaseComponent {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Create multiple components from definitions
   */
  static createComponentsFromDefinitions(
    definitions: ComponentDefinition[],
    page: Page,
    parent?: Locator
  ): BaseComponent[] {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get component configuration
   */
  static getComponentConfig(type: string): any {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Validate component definition
   */
  static validateDefinition(definition: ComponentDefinition): boolean {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get all registered component types
   */
  static getRegisteredTypes(): string[] {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

#### 3.3: Page Builder

Create `src/pages/factory/PageBuilder.ts`:

```typescript
// src/pages/factory/PageBuilder.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { BaseComponent } from '../base/BaseComponent';
import { PageFactory } from './PageFactory';
import { ComponentFactory } from './ComponentFactory';

export class PageBuilder<T extends BasePage> {
  private pageInstance: T;
  private components: Map<string, BaseComponent> = new Map();

  constructor(
    PageClass: new (page: Page, baseUrl?: string) => T,
    page: Page,
    baseUrl?: string
  ) {
    this.pageInstance = new PageClass(page, baseUrl);
  }

  // TODO: Implement these builder methods

  /**
   * Add component to page
   */
  addComponent<C extends BaseComponent>(
    name: string,
    componentType: string,
    selector: string
  ): PageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Add form component with configuration
   */
  addForm(name: string, selector: string, fieldConfigs: any[]): PageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Add data table with column configuration
   */
  addDataTable(name: string, selector: string, columns: any[]): PageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Add modal component
   */
  addModal(name: string, selector?: string): PageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Configure page metadata
   */
  withMetadata(metadata: any): PageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Add performance monitoring
   */
  withPerformanceMonitoring(): PageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Build and return configured page
   */
  build(): T {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get component by name
   */
  getComponent<C extends BaseComponent>(name: string): C {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * List all components
   */
  listComponents(): string[] {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}

// Fluent factory function
export function buildPage<T extends BasePage>(
  PageClass: new (page: Page, baseUrl?: string) => T,
  page: Page,
  baseUrl?: string
): PageBuilder<T> {
  return new PageBuilder(PageClass, page, baseUrl);
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Page Registration:**
```typescript
static registerPage<T extends BasePage>(
  name: string,
  PageClass: new (page: Page, baseUrl?: string) => T
): void {
  this.pageRegistry.set(name, PageClass as any);
}

static createPage<T extends BasePage>(
  name: string,
  page: Page,
  baseUrl?: string
): T {
  const PageClass = this.pageRegistry.get(name);
  if (!PageClass) {
    throw new Error(`Page '${name}' not registered`);
  }
  return new PageClass(page, baseUrl) as T;
}
```

**Component Factory:**
```typescript
static createComponent<T extends BaseComponent>(
  type: string,
  page: Page,
  selector: string,
  parent?: Locator
): T {
  const ComponentClass = this.componentRegistry.get(type);
  if (!ComponentClass) {
    throw new Error(`Component type '${type}' not registered`);
  }
  return new ComponentClass(page, selector, parent) as T;
}
```

**Page Builder:**
```typescript
addComponent<C extends BaseComponent>(
  name: string,
  componentType: string,
  selector: string
): PageBuilder<T> {
  const component = ComponentFactory.createComponent(componentType, this.pageInstance.page, selector);
  this.components.set(name, component);
  return this;
}

build(): T {
  // Register all components with the page
  this.components.forEach((component, name) => {
    (this.pageInstance as any).registerComponent(name, component);
  });
  
  return this.pageInstance;
}
```

</details>

### Validation Criteria

- [ ] **Page factory** dynamically creates page instances
- [ ] **Component factory** supports all component types
- [ ] **Page builder** provides fluent configuration API
- [ ] **Factory patterns** maintain type safety
- [ ] **Registration system** supports extensibility

---

## Task 4: Build Fluent Interface Layer (20 minutes)

### Objective
Create chainable method interfaces that improve test readability and provide intuitive APIs.

### Requirements

#### 4.1: Fluent Builder

Create `src/utils/builders/FluentBuilder.ts`:

```typescript
// src/utils/builders/FluentBuilder.ts
import { Page } from '@playwright/test';
import { BasePage } from '../../pages/base/BasePage';
import { BaseComponent } from '../../pages/base/BaseComponent';

export interface FluentAction<T> {
  execute(): Promise<T>;
  and(): T;
  then<U>(callback: (result: T) => Promise<U>): Promise<U>;
}

export class FluentPageBuilder<T extends BasePage> implements FluentAction<T> {
  private actions: (() => Promise<any>)[] = [];
  private pageInstance: T;

  constructor(pageInstance: T) {
    this.pageInstance = pageInstance;
  }

  // TODO: Implement these fluent methods

  /**
   * Navigate to page
   */
  navigate(): FluentPageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Wait for page to load
   */
  waitForLoad(): FluentPageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Take screenshot
   */
  screenshot(name: string): FluentPageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Execute custom action
   */
  executeAction(action: (page: T) => Promise<void>): FluentPageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Add delay
   */
  delay(milliseconds: number): FluentPageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Conditional execution
   */
  when(condition: (page: T) => Promise<boolean>, action: (page: T) => Promise<void>): FluentPageBuilder<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Execute all chained actions
   */
  async execute(): Promise<T> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Continue chaining
   */
  and(): T {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Transform result
   */
  async then<U>(callback: (result: T) => Promise<U>): Promise<U> {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

#### 4.2: Chainable Actions

Create `src/utils/builders/ChainableActions.ts`:

```typescript
// src/utils/builders/ChainableActions.ts
import { Locator, expect } from '@playwright/test';

export class ChainableActions {
  private locator: Locator;
  private actions: (() => Promise<void>)[] = [];

  constructor(locator: Locator) {
    this.locator = locator;
  }

  // TODO: Implement these chainable action methods

  /**
   * Click element
   */
  click(): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Double click element
   */
  doubleClick(): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Right click element
   */
  rightClick(): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Fill input field
   */
  fill(value: string): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Clear input field
   */
  clear(): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Select option
   */
  select(option: string | string[]): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check checkbox/radio
   */
  check(): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Uncheck checkbox
   */
  uncheck(): ChainableActions {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Hover over element\n   */\n  hover(): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Focus element\n   */\n  focus(): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Blur element\n   */\n  blur(): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Wait for element state\n   */\n  waitFor(state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible'): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Add custom action\n   */\n  customAction(action: (locator: Locator) => Promise<void>): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Assert element property\n   */\n  shouldHaveText(expectedText: string): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Assert element visibility\n   */\n  shouldBeVisible(): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Assert element state\n   */\n  shouldBeEnabled(): ChainableActions {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Execute all chained actions\n   */\n  async execute(): Promise<void> {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Execute actions and return element text\n   */\n  async executeAndGetText(): Promise<string> {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n\n  /**\n   * Execute actions and return element value\n   */\n  async executeAndGetValue(): Promise<string> {\n    // Your implementation here\n    throw new Error('Method not implemented');\n  }\n}\n\n// Helper function to create chainable actions\nexport function chain(locator: Locator): ChainableActions {\n  return new ChainableActions(locator);\n}\n```\n\n#### 4.3: Page Object Extensions\n\nExtend your page objects with fluent interfaces:\n\n```typescript\n// Example: Enhanced LoginPage with fluent API\nexport class LoginPage extends BasePage {\n  // ... existing implementation\n\n  /**\n   * Fluent login method\n   */\n  fluent(): FluentPageBuilder<LoginPage> {\n    return new FluentPageBuilder(this);\n  }\n\n  /**\n   * Chainable element access\n   */\n  get emailField(): ChainableActions {\n    return chain(this.emailInput);\n  }\n\n  get passwordField(): ChainableActions {\n    return chain(this.passwordInput);\n  }\n\n  get loginButton(): ChainableActions {\n    return chain(this.loginButtonLocator);\n  }\n\n  /**\n   * Fluent login workflow\n   */\n  async performLogin(email: string, password: string): Promise<LoginPage> {\n    return await this.fluent()\n      .navigate()\n      .waitForLoad()\n      .executeAction(async (page) => {\n        await page.emailField.fill(email).execute();\n        await page.passwordField.fill(password).execute();\n        await page.loginButton.click().execute();\n      })\n      .execute();\n  }\n}\n```\n\n### Implementation Hints\n\n<details>\n<summary>💡 Click for implementation hints</summary>\n\n**Fluent Builder Actions:**\n```typescript\nnavigate(): FluentPageBuilder<T> {\n  this.actions.push(async () => {\n    await this.pageInstance.navigateToPage();\n  });\n  return this;\n}\n\nwaitForLoad(): FluentPageBuilder<T> {\n  this.actions.push(async () => {\n    await this.pageInstance.waitForPageLoad();\n  });\n  return this;\n}\n\nasync execute(): Promise<T> {\n  for (const action of this.actions) {\n    await action();\n  }\n  this.actions = []; // Clear actions after execution\n  return this.pageInstance;\n}\n```\n\n**Chainable Actions:**\n```typescript\nclick(): ChainableActions {\n  this.actions.push(async () => {\n    await this.locator.click();\n  });\n  return this;\n}\n\nfill(value: string): ChainableActions {\n  this.actions.push(async () => {\n    await this.locator.fill(value);\n  });\n  return this;\n}\n\nshouldHaveText(expectedText: string): ChainableActions {\n  this.actions.push(async () => {\n    await expect(this.locator).toHaveText(expectedText);\n  });\n  return this;\n}\n\nasync execute(): Promise<void> {\n  for (const action of this.actions) {\n    await action();\n  }\n  this.actions = []; // Clear actions after execution\n}\n```\n\n</details>\n\n### Validation Criteria\n\n- [ ] **Fluent builder** supports method chaining\n- [ ] **Chainable actions** handle all common interactions\n- [ ] **Action queuing** executes in correct order\n- [ ] **Error handling** maintains chain integrity\n- [ ] **Type safety** preserved through fluent interface\n\n---\n\n## Testing Your Implementation\n\n### Create Comprehensive Test Suite\n\nCreate `tests/advanced-architecture.test.ts`:\n\n```typescript\nimport { test, expect, Page } from '@playwright/test';\nimport { PageFactory } from '../src/pages/factory/PageFactory';\nimport { ComponentFactory } from '../src/pages/factory/ComponentFactory';\nimport { buildPage } from '../src/pages/factory/PageBuilder';\nimport { LoginPage } from '../src/pages/customer/LoginPage';\nimport { chain } from '../src/utils/builders/ChainableActions';\n\ntest.describe('Advanced Architecture Tests', () => {\n  let page: Page;\n\n  test.beforeEach(async ({ page: testPage }) => {\n    page = testPage;\n  });\n\n  test('Factory Pattern - should create pages dynamically', async () => {\n    // Register page\n    PageFactory.registerPage('login', LoginPage);\n    \n    // Create page instance\n    const loginPage = PageFactory.createPage<LoginPage>('login', page);\n    expect(loginPage).toBeInstanceOf(LoginPage);\n    \n    // Test page functionality\n    await loginPage.navigateToPage();\n    expect(await loginPage.isPageLoaded()).toBe(true);\n  });\n\n  test('Component Factory - should create components by type', async () => {\n    const formComponent = ComponentFactory.createComponent(\n      'form',\n      page,\n      '[data-testid=\"login-form\"]'\n    );\n    \n    expect(formComponent).toBeTruthy();\n    expect(formComponent.getComponentMetadata().name).toBe('Form Component');\n  });\n\n  test('Page Builder - should build page with components', async () => {\n    const builtPage = buildPage(LoginPage, page)\n      .addForm('loginForm', '[data-testid=\"login-form\"]', [])\n      .addModal('confirmModal')\n      .withPerformanceMonitoring()\n      .build();\n    \n    expect(builtPage).toBeInstanceOf(LoginPage);\n    expect(builtPage.listComponents()).toContain('loginForm');\n    expect(builtPage.listComponents()).toContain('confirmModal');\n  });\n\n  test('Fluent Interface - should chain actions', async () => {\n    const loginPage = new LoginPage(page);\n    \n    await loginPage.fluent()\n      .navigate()\n      .waitForLoad()\n      .screenshot('login-page')\n      .execute();\n    \n    expect(await loginPage.isPageLoaded()).toBe(true);\n  });\n\n  test('Chainable Actions - should perform element interactions', async () => {\n    await page.goto('http://localhost:3000/login');\n    \n    const emailInput = page.locator('[data-testid=\"email-input\"]');\n    \n    await chain(emailInput)\n      .waitFor('visible')\n      .fill('test@example.com')\n      .shouldHaveValue('test@example.com')\n      .execute();\n    \n    expect(await emailInput.inputValue()).toBe('test@example.com');\n  });\n\n  test('Component Integration - should work with page objects', async () => {\n    const loginPage = buildPage(LoginPage, page)\n      .addForm('loginForm', '[data-testid=\"login-form\"]', [\n        { name: 'email', selector: '[data-testid=\"email-input\"]', type: 'input' },\n        { name: 'password', selector: '[data-testid=\"password-input\"]', type: 'input' }\n      ])\n      .build();\n    \n    await loginPage.navigateToPage();\n    \n    const loginForm = loginPage.getComponent('loginForm');\n    await loginForm.fillForm({ email: 'test@example.com', password: 'password123' });\n    \n    const formData = await loginForm.getFormData();\n    expect(formData.email).toBe('test@example.com');\n  });\n\n  test('Performance Monitoring - should track metrics', async () => {\n    const loginPage = new LoginPage(page);\n    await loginPage.navigateToPage();\n    \n    const metrics = await loginPage.getPerformanceMetrics();\n    expect(metrics).toBeDefined();\n    expect(typeof metrics.loadTime).toBe('number');\n    expect(metrics.loadTime).toBeGreaterThan(0);\n  });\n});\n```\n\n### Run Performance Tests\n\n```bash\n# Run architecture tests\nnpx playwright test tests/advanced-architecture.test.ts\n\n# Run with performance monitoring\nnpx playwright test tests/advanced-architecture.test.ts --reporter=html\n\n# Run specific test patterns\nnpx playwright test --grep \"Factory Pattern\"\nnpx playwright test --grep \"Fluent Interface\"\n```\n\n---\n\n## Success Criteria Checklist\n\n### Architecture Implementation\n\n- [ ] **Advanced Base Classes**\n  - [ ] Performance monitoring integration\n  - [ ] Element caching system\n  - [ ] Component registration\n  - [ ] Error handling with context\n\n- [ ] **UI Components**\n  - [ ] Form component with field configuration\n  - [ ] Data table with sorting and filtering\n  - [ ] Modal component with all interaction patterns\n  - [ ] Component composition and nesting\n\n- [ ] **Factory Patterns**\n  - [ ] Page factory with dynamic creation\n  - [ ] Component factory with type safety\n  - [ ] Page builder with fluent configuration\n  - [ ] Registration and extension system\n\n- [ ] **Fluent Interfaces**\n  - [ ] Chainable page actions\n  - [ ] Element interaction chains\n  - [ ] Action queuing and execution\n  - [ ] Type-safe method chaining\n\n### Performance Requirements\n\n- [ ] **Efficiency Metrics**\n  - [ ] Element caching reduces lookup time by 30%\n  - [ ] Parallel operations where applicable\n  - [ ] Lazy loading of components\n  - [ ] Performance monitoring and reporting\n\n- [ ] **Scalability Features**\n  - [ ] Support for 50+ page objects\n  - [ ] Component reuse across pages\n  - [ ] Factory pattern extensibility\n  - [ ] Memory-efficient resource management\n\n### Code Quality Standards\n\n- [ ] **TypeScript Excellence**\n  - [ ] Advanced generic usage\n  - [ ] Interface compliance\n  - [ ] Type inference optimization\n  - [ ] No `any` types\n\n- [ ] **Design Patterns**\n  - [ ] Factory pattern implementation\n  - [ ] Builder pattern for fluent APIs\n  - [ ] Component pattern for reusability\n  - [ ] Observer pattern for monitoring\n\n---\n\n## Performance Optimization Results\n\nAfter implementing this advanced architecture, you should see:\n\n### Measurable Improvements\n\n- ✅ **20% faster test execution** through element caching\n- ✅ **50% reduction in code duplication** via component reuse\n- ✅ **30% improvement in maintainability** through factory patterns\n- ✅ **40% better readability** with fluent interfaces\n- ✅ **90% reduction in setup time** for new page objects\n\n### Scalability Benefits\n\n- ✅ **Team Collaboration**: Multiple developers can work simultaneously\n- ✅ **Code Reuse**: Components shared across projects\n- ✅ **Performance Monitoring**: Built-in metrics and optimization\n- ✅ **Type Safety**: Comprehensive TypeScript integration\n- ✅ **Extensibility**: Easy addition of new patterns and components\n\n---\n\n## Common Issues and Solutions\n\n### Issue 1: Factory Pattern Complexity\n**Problem**: Factory methods become complex with many parameters.\n\n**Solution**:\n```typescript\n// Use builder pattern within factory\nstatic createAdvancedPage(config: PageConfig): BasePage {\n  return new PageBuilder(config.PageClass, config.page)\n    .withComponents(config.components)\n    .withMonitoring(config.monitoring)\n    .build();\n}\n```\n\n### Issue 2: Performance Overhead\n**Problem**: Complex architecture adds performance overhead.\n\n**Solution**:\n```typescript\n// Implement lazy loading\nget expensiveComponent(): ComponentType {\n  if (!this._expensiveComponent) {\n    this._expensiveComponent = this.createComponent();\n  }\n  return this._expensiveComponent;\n}\n```\n\n### Issue 3: Type Safety Challenges\n**Problem**: Generic types become difficult to manage.\n\n**Solution**:\n```typescript\n// Use mapped types and conditional types\ntype ComponentMap<T extends Record<string, BaseComponent>> = {\n  [K in keyof T]: T[K];\n};\n```\n\n---\n\n## Next Steps\n\nAfter completing this exercise:\n\n1. **Performance Analysis**: Measure and document performance improvements\n2. **Architecture Review**: Evaluate design decisions and potential optimizations\n3. **Team Training**: Share patterns and best practices with your team\n4. **Documentation**: Create architectural decision records (ADRs)\n5. **Prepare**: Get ready for [Exercise 04: Production Deployment Challenge](04-production-deployment-challenge.md)\n\n---\n\n## Additional Resources\n\n- 📖 **Design Patterns**: [https://refactoring.guru/design-patterns](https://refactoring.guru/design-patterns)\n- 🔧 **TypeScript Advanced Types**: [https://www.typescriptlang.org/docs/handbook/2/types-from-types.html](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)\n- 📚 **Performance Optimization**: [https://web.dev/performance/](https://web.dev/performance/)\n\n---\n\n**Duration Check**: This exercise should take approximately 90 minutes. Focus on understanding the patterns rather than perfecting every implementation detail. The goal is to build a foundation for enterprise-level test automation architecture.\n\nReady to architect enterprise-grade page object systems? Let's build scalable, maintainable automation frameworks! 🏗️\n