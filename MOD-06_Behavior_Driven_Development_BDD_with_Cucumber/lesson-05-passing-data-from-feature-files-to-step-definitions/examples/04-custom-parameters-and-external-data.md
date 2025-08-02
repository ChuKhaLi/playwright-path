# Example 04: Custom Parameters and External Data Integration

## Overview

This example demonstrates advanced data handling techniques in Cucumber, focusing on custom parameter types, external data source integration, and sophisticated data transformation patterns. You'll learn to create reusable parameter libraries, integrate with databases and APIs, and implement enterprise-grade data management strategies for complex BDD scenarios.

### **Learning Focus**
- Create custom parameter types for domain-specific validation and processing
- Integrate external data sources including JSON files, databases, and APIs
- Implement data transformation pipelines with error handling and validation
- Design reusable parameter libraries for enterprise-scale testing
- Apply advanced data caching and performance optimization strategies

---

## Scenario: E-commerce Platform with External Data Integration

### **Feature File: Custom Parameters and External Data**

```gherkin
# features/custom-parameters-external-data.feature
Feature: Custom Parameters and External Data Integration
  As a test automation engineer
  I want to use custom parameter types and external data sources
  So that I can create maintainable, data-driven BDD scenarios with enterprise-grade flexibility

  Background:
    Given the e-commerce platform is running
    And the product database is populated with test data
    And the user service is available
    And the payment gateway is configured
    And external data sources are accessible

  Scenario: Product Search with Custom Product Types
    Given I am on the product catalog page
    When I search for products by category <premium-electronics>
    And I filter by price range <currency:USD:100-500>
    And I filter by availability <in-stock>
    And I sort by <customer-rating:desc>
    Then I should see products matching the criteria
    And all products should be <available-status>
    And prices should be within <currency:USD:100-500>

  Scenario: User Registration with External Data Validation
    Given I am on the registration page
    When I create a new user account with profile <user-profile:premium-customer>
    And I set the shipping address to <address:business-address>
    And I configure payment method <payment-method:corporate-card>
    And I enable notifications for <notification-preferences:business-user>
    Then the user account should be created successfully
    And the user should have <membership-level:premium> privileges
    And welcome emails should be sent to <email:primary> and <email:billing>

  Scenario: Order Processing with Complex Product Configurations
    Given I am logged in as user <user-profile:premium-customer>
    When I add the following products to my cart:
      | Product Type        | Quantity | Configuration           | Pricing Model    |
      | <laptop:business>   | 2        | <config:extended-warranty> | <price:bulk>     |
      | <software:enterprise> | 5      | <config:multi-user>     | <price:volume>   |
      | <service:support>   | 1        | <config:24x7-premium>   | <price:annual>   |
    And I apply discount code <discount:corporate-bulk>
    And I select shipping method <shipping:next-day-business>
    Then the order total should be calculated correctly
    And tax should be computed based on <address:business-address>
    And delivery date should be <date:next-business-day>

  Scenario: Inventory Management with Real-time Data
    Given I am monitoring the inventory system
    When I check stock levels for products from <data-source:inventory-api>
    And I verify prices against <data-source:pricing-database>
    And I validate product information from <data-source:catalog-service>
    Then all data sources should be synchronized
    And stock levels should be <quantity:positive>
    And price discrepancies should be <tolerance:5-percent>
    And product catalog should be <status:current>

  Scenario: Multi-currency Order Processing
    Given I am testing international order processing
    When a customer from <country:canada> places an order
    And they select products totaling <currency:CAD:250.00>
    And they choose payment method <payment-method:international-card>
    And shipping address is in <region:north-america>
    Then the order should be processed in <currency:CAD>
    And taxes should be calculated using <tax-region:canada>
    And shipping cost should be computed for <region:north-america>
    And the final total should include all applicable fees

  Scenario: Bulk Customer Data Import and Validation
    Given I am importing customer data from external systems
    When I load customer data from <file:customer-import.csv>
    And I validate each customer record against <schema:customer-schema>
    And I check for duplicates using <strategy:email-phone-matching>
    And I enrich data with information from <data-source:crm-system>
    Then all valid customers should be imported
    And duplicate records should be <action:merged>
    And invalid records should be <action:rejected-with-reason>
    And import summary should be generated

  Scenario: Performance Testing with Dynamic Data
    Given I am conducting performance testing
    When I generate <quantity:1000> concurrent users
    And each user performs <action:product-browse> for <duration:5-minutes>
    And <percentage:30> of users complete <action:purchase-flow>
    And system load is maintained at <load-level:80-percent>
    Then average response time should be <performance:sub-2-seconds>
    And error rate should be <performance:less-than-1-percent>
    And database connections should remain <status:stable>
    And memory usage should stay <performance:within-limits>
```

---

## Step Definitions: Custom Parameter Types and External Data

### **Custom Parameter Type Definitions**

```typescript
// support/parameter-types.ts
import { defineParameterType } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Product category parameter type
defineParameterType({
  name: 'product-category',
  regexp: /<(premium-electronics|standard-electronics|home-appliances|software|services)>/,
  transformer: (categoryName: string) => {
    const categoryMappings = {
      'premium-electronics': {
        id: 'PREM_ELEC',
        name: 'Premium Electronics',
        filters: ['high-end', 'luxury', 'professional'],
        priceRange: { min: 500, max: 5000 }
      },
      'standard-electronics': {
        id: 'STD_ELEC',
        name: 'Standard Electronics',
        filters: ['consumer', 'everyday', 'budget-friendly'],
        priceRange: { min: 50, max: 500 }
      },
      'home-appliances': {
        id: 'HOME_APP',
        name: 'Home Appliances',
        filters: ['household', 'kitchen', 'utility'],
        priceRange: { min: 100, max: 2000 }
      },
      'software': {
        id: 'SOFTWARE',
        name: 'Software Products',
        filters: ['digital', 'subscription', 'license'],
        priceRange: { min: 10, max: 1000 }
      },
      'services': {
        id: 'SERVICES',
        name: 'Professional Services',
        filters: ['consultation', 'support', 'maintenance'],
        priceRange: { min: 50, max: 10000 }
      }
    };

    const category = categoryMappings[categoryName as keyof typeof categoryMappings];
    if (!category) {
      throw new Error(`Unknown product category: ${categoryName}`);
    }

    return category;
  }
});

// Currency and price range parameter type
defineParameterType({
  name: 'currency-range',
  regexp: /<currency:(USD|EUR|GBP|CAD|JPY):(\d+)-(\d+)>/,
  transformer: (currency: string, minPrice: string, maxPrice: string) => {
    const exchangeRates = {
      USD: 1.0,
      EUR: 0.85,
      GBP: 0.73,
      CAD: 1.25,
      JPY: 110.0
    };

    const rate = exchangeRates[currency as keyof typeof exchangeRates];
    if (!rate) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return {
      currency,
      minPrice: parseInt(minPrice),
      maxPrice: parseInt(maxPrice),
      exchangeRate: rate,
      symbol: getCurrencySymbol(currency)
    };
  }
});

// User profile parameter type
defineParameterType({
  name: 'user-profile',
  regexp: /<user-profile:(premium-customer|standard-customer|business-customer|guest-user)>/,
  transformer: async (profileType: string) => {
    const profileTemplates = {
      'premium-customer': {
        membershipLevel: 'premium',
        creditLimit: 10000,
        features: ['priority-support', 'free-shipping', 'extended-warranty'],
        contactPreferences: ['email', 'sms', 'phone']
      },
      'standard-customer': {
        membershipLevel: 'standard',
        creditLimit: 2000,
        features: ['standard-support', 'free-shipping-over-50'],
        contactPreferences: ['email']
      },
      'business-customer': {
        membershipLevel: 'business',
        creditLimit: 50000,
        features: ['business-support', 'bulk-pricing', 'invoice-billing', 'dedicated-account-manager'],
        contactPreferences: ['email', 'phone', 'portal']
      },
      'guest-user': {
        membershipLevel: 'guest',
        creditLimit: 0,
        features: ['basic-checkout'],
        contactPreferences: ['email']
      }
    };

    const template = profileTemplates[profileType as keyof typeof profileTemplates];
    if (!template) {
      throw new Error(`Unknown user profile type: ${profileType}`);
    }

    // Generate unique user data
    const userId = `USR_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    return {
      id: userId,
      type: profileType,
      ...template,
      email: `${userId.toLowerCase()}@testdomain.com`,
      createdAt: new Date(),
      isActive: true
    };
  }
});

// Address parameter type with external data lookup
defineParameterType({
  name: 'address',
  regexp: /<address:(business-address|residential-address|international-address)>/,
  transformer: async (addressType: string) => {
    // Load address data from external source
    const addressData = await loadExternalAddressData(addressType);
    
    return {
      type: addressType,
      ...addressData,
      validated: true,
      geocoded: true
    };
  }
});

// Data source parameter type
defineParameterType({
  name: 'data-source',
  regexp: /<data-source:(inventory-api|pricing-database|catalog-service|crm-system)>/,
  transformer: (sourceName: string) => {
    const dataSources = {
      'inventory-api': {
        type: 'REST_API',
        endpoint: process.env.INVENTORY_API_URL || 'http://localhost:3001/api/inventory',
        authentication: 'bearer-token',
        timeout: 5000,
        retryAttempts: 3
      },
      'pricing-database': {
        type: 'DATABASE',
        connection: process.env.PRICING_DB_URL || 'postgresql://localhost:5432/pricing',
        poolSize: 10,
        timeout: 3000,
        retryAttempts: 2
      },
      'catalog-service': {
        type: 'GRAPHQL',
        endpoint: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002/graphql',
        authentication: 'api-key',
        timeout: 7000,
        retryAttempts: 3
      },
      'crm-system': {
        type: 'SOAP',
        endpoint: process.env.CRM_SYSTEM_URL || 'http://localhost:3003/soap',
        authentication: 'username-password',
        timeout: 10000,
        retryAttempts: 1
      }
    };

    const source = dataSources[sourceName as keyof typeof dataSources];
    if (!source) {
      throw new Error(`Unknown data source: ${sourceName}`);
    }

    return {
      name: sourceName,
      ...source,
      lastAccessed: null,
      isAvailable: true
    };
  }
});

// Performance metrics parameter type
defineParameterType({
  name: 'performance',
  regexp: /<performance:(sub-\d+-seconds|less-than-\d+-percent|within-limits)>/,
  transformer: (metric: string) => {
    const performanceRules = {
      'sub-2-seconds': { type: 'response_time', threshold: 2000, unit: 'ms', condition: 'less_than' },
      'sub-5-seconds': { type: 'response_time', threshold: 5000, unit: 'ms', condition: 'less_than' },
      'less-than-1-percent': { type: 'error_rate', threshold: 1, unit: 'percent', condition: 'less_than' },
      'less-than-5-percent': { type: 'error_rate', threshold: 5, unit: 'percent', condition: 'less_than' },
      'within-limits': { type: 'resource_usage', threshold: 80, unit: 'percent', condition: 'less_than' }
    };

    const rule = performanceRules[metric as keyof typeof performanceRules];
    if (!rule) {
      throw new Error(`Unknown performance metric: ${metric}`);
    }

    return rule;
  }
});

// File parameter type with validation
defineParameterType({
  name: 'file',
  regexp: /<file:([^>]+)>/,
  transformer: async (fileName: string) => {
    const filePath = `test-data/${fileName}`;
    const fileExists = await checkFileExists(filePath);
    
    if (!fileExists) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const fileStats = await getFileStats(filePath);
    
    return {
      name: fileName,
      path: filePath,
      size: fileStats.size,
      lastModified: fileStats.mtime,
      format: getFileFormat(fileName),
      isValid: true
    };
  }
});

// Helper functions
function getCurrencySymbol(currency: string): string {
  const symbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', JPY: '¥' };
  return symbols[currency as keyof typeof symbols] || currency;
}

async function loadExternalAddressData(addressType: string): Promise<any> {
  // Simulate external address service call
  const addressTemplates = {
    'business-address': {
      street: '123 Business Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      type: 'commercial',
      validated: true
    },
    'residential-address': {
      street: '456 Residential Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      type: 'residential',
      validated: true
    },
    'international-address': {
      street: '789 International Blvd',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5V 3A8',
      country: 'Canada',
      type: 'international',
      validated: true
    }
  };

  return addressTemplates[addressType as keyof typeof addressTemplates] || null;
}

async function checkFileExists(path: string): Promise<boolean> {
  // File existence check implementation
  return true; // Simplified for example
}

async function getFileStats(path: string): Promise<any> {
  // File stats implementation
  return {
    size: 1024,
    mtime: new Date()
  };
}

function getFileFormat(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
}
```

### **External Data Integration Services**

```typescript
// support/services/external-data.service.ts
import axios from 'axios';
import { Pool } from 'pg';
import * as fs from 'fs/promises';
import * as csv from 'csv-parser';
import { CustomWorld } from '../world';

export interface DataSource {
  name: string;
  type: string;
  endpoint?: string;
  connection?: string;
  authentication: string;
  timeout: number;
  retryAttempts: number;
}

export interface ExternalDataService {
  loadData(source: DataSource, query?: any): Promise<any>;
  validateData(data: any, schema: any): boolean;
  transformData(data: any, transformation: any): any;
  cacheData(key: string, data: any, ttl?: number): void;
  getCachedData(key: string): any;
}

export class ExternalDataManager implements ExternalDataService {
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private dbPool: Pool | null = null;

  constructor(private world: CustomWorld) {
    this.initializeConnections();
  }

  private async initializeConnections(): Promise<void> {
    // Initialize database connection pool
    if (process.env.DATABASE_URL) {
      this.dbPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
  }

  async loadData(source: DataSource, query?: any): Promise<any> {
    const cacheKey = `${source.name}_${JSON.stringify(query)}`;
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`✓ Using cached data for ${source.name}`);
      return cachedData;
    }

    let data: any;
    
    try {
      switch (source.type) {
        case 'REST_API':
          data = await this.loadFromRestApi(source, query);
          break;
        case 'DATABASE':
          data = await this.loadFromDatabase(source, query);
          break;
        case 'GRAPHQL':
          data = await this.loadFromGraphQL(source, query);
          break;
        case 'FILE':
          data = await this.loadFromFile(source, query);
          break;
        default:
          throw new Error(`Unsupported data source type: ${source.type}`);
      }

      // Cache the loaded data
      this.cacheData(cacheKey, data, 300); // 5 minutes default TTL
      
      console.log(`✓ Data loaded from ${source.name}: ${Array.isArray(data) ? data.length : 1} records`);
      return data;
      
    } catch (error) {
      console.error(`✗ Failed to load data from ${source.name}:`, error.message);
      
      // Retry logic
      if (source.retryAttempts > 0) {
        console.log(`Retrying... (${source.retryAttempts} attempts remaining)`);
        source.retryAttempts--;
        await this.delay(1000); // Wait 1 second before retry
        return this.loadData(source, query);
      }
      
      throw error;
    }
  }

  private async loadFromRestApi(source: DataSource, query?: any): Promise<any> {
    const config = {
      timeout: source.timeout,
      headers: await this.getAuthHeaders(source),
      params: query
    };

    const response = await axios.get(source.endpoint!, config);
    
    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.data;
  }

  private async loadFromDatabase(source: DataSource, query?: any): Promise<any> {
    if (!this.dbPool) {
      throw new Error('Database pool not initialized');
    }

    const client = await this.dbPool.connect();
    
    try {
      const queryText = this.buildSqlQuery(query);
      const result = await client.query(queryText, query?.params || []);
      return result.rows;
    } finally {
      client.release();
    }
  }

  private async loadFromGraphQL(source: DataSource, query?: any): Promise<any> {
    const config = {
      timeout: source.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...await this.getAuthHeaders(source)
      }
    };

    const response = await axios.post(
      source.endpoint!,
      {
        query: query?.graphqlQuery || this.getDefaultGraphQLQuery(),
        variables: query?.variables || {}
      },
      config
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data;
  }

  private async loadFromFile(source: DataSource, query?: any): Promise<any> {
    const filePath = source.endpoint || query?.filePath;
    
    if (!filePath) {
      throw new Error('File path not specified');
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
      case 'json':
        return JSON.parse(fileContent);
      case 'csv':
        return this.parseCsvContent(fileContent);
      case 'txt':
        return fileContent.split('\n').filter(line => line.trim());
      default:
        return fileContent;
    }
  }

  private async parseCsvContent(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = require('stream');
      const readable = new stream.Readable();
      readable.push(content);
      readable.push(null);

      readable
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: any) => reject(error));
    });
  }

  private async getAuthHeaders(source: DataSource): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    switch (source.authentication) {
      case 'bearer-token':
        headers['Authorization'] = `Bearer ${process.env.API_TOKEN || 'test-token'}`;
        break;
      case 'api-key':
        headers['X-API-Key'] = process.env.API_KEY || 'test-key';
        break;
      case 'basic':
        const username = process.env.API_USERNAME || 'testuser';
        const password = process.env.API_PASSWORD || 'testpass';
        headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
        break;
    }

    return headers;
  }

  private buildSqlQuery(query?: any): string {
    if (query?.sql) {
      return query.sql;
    }

    // Default query builder logic
    const table = query?.table || 'products';
    const conditions = query?.conditions || {};
    
    let sql = `SELECT * FROM ${table}`;
    const whereClause = Object.keys(conditions).map(key => `${key} = $${Object.keys(conditions).indexOf(key) + 1}`);
    
    if (whereClause.length > 0) {
      sql += ` WHERE ${whereClause.join(' AND ')}`;
    }

    return sql;
  }

  private getDefaultGraphQLQuery(): string {
    return `
      query {
        products {
          id
          name
          price
          category
          availability
        }
      }
    `;
  }

  validateData(data: any, schema: any): boolean {
    // Data validation implementation
    if (!schema) return true;

    try {
      // Simple validation - in real implementation, use a proper validator like Joi or Yup
      for (const field of schema.required || []) {
        if (!data[field]) {
          throw new Error(`Required field missing: ${field}`);
        }
      }

      for (const [field, rules] of Object.entries(schema.fields || {})) {
        if (data[field] !== undefined) {
          this.validateField(data[field], rules, field);
        }
      }

      return true;
    } catch (error) {
      console.error(`Data validation failed: ${error.message}`);
      return false;
    }
  }

  private validateField(value: any, rules: any, fieldName: string): void {
    if (rules.type && typeof value !== rules.type) {
      throw new Error(`Field ${fieldName} must be of type ${rules.type}`);
    }

    if (rules.minLength && value.length < rules.minLength) {
      throw new Error(`Field ${fieldName} must have minimum length ${rules.minLength}`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      throw new Error(`Field ${fieldName} must have maximum length ${rules.maxLength}`);
    }

    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      throw new Error(`Field ${fieldName} does not match required pattern`);
    }
  }

  transformData(data: any, transformation: any): any {
    if (!transformation) return data;

    try {
      let transformedData = Array.isArray(data) ? [...data] : { ...data };

      // Apply transformations
      for (const [operation, params] of Object.entries(transformation)) {
        switch (operation) {
          case 'map_fields':
            transformedData = this.mapFields(transformedData, params);
            break;
          case 'filter':
            if (Array.isArray(transformedData)) {
              transformedData = transformedData.filter((item: any) => this.applyFilter(item, params));
            }
            break;
          case 'sort':
            if (Array.isArray(transformedData)) {
              transformedData = this.sortData(transformedData, params);
            }
            break;
          case 'group_by':
            if (Array.isArray(transformedData)) {
              transformedData = this.groupData(transformedData, params);
            }
            break;
          case 'calculate':
            transformedData = this.calculateFields(transformedData, params);
            break;
        }
      }

      return transformedData;
    } catch (error) {
      console.error(`Data transformation failed: ${error.message}`);
      return data; // Return original data on transformation failure
    }
  }

  private mapFields(data: any, mapping: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.mapSingleItem(item, mapping));
    }
    return this.mapSingleItem(data, mapping);
  }

  private mapSingleItem(item: any, mapping: any): any {
    const mapped: any = {};
    
    for (const [newField, sourceField] of Object.entries(mapping)) {
      if (typeof sourceField === 'string') {
        mapped[newField] = item[sourceField];
      } else if (typeof sourceField === 'function') {
        mapped[newField] = sourceField(item);
      }
    }
    
    return mapped;
  }

  private applyFilter(item: any, filterParams: any): boolean {
    for (const [field, condition] of Object.entries(filterParams)) {
      if (!this.checkCondition(item[field], condition)) {
        return false;
      }
    }
    return true;
  }

  private checkCondition(value: any, condition: any): boolean {
    if (typeof condition === 'object') {
      for (const [operator, operand] of Object.entries(condition)) {
        switch (operator) {
          case 'equals':
            return value === operand;
          case 'greater_than':
            return value > operand;
          case 'less_than':
            return value < operand;
          case 'contains':
            return String(value).includes(String(operand));
          case 'in':
            return Array.isArray(operand) && operand.includes(value);
        }
      }
    }
    return value === condition;
  }

  private sortData(data: any[], sortParams: any): any[] {
    const { field, direction = 'asc' } = sortParams;
    
    return data.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (direction === 'desc') {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
  }

  private groupData(data: any[], groupField: string): Record<string, any[]> {
    return data.reduce((groups, item) => {
      const key = item[groupField];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }

  private calculateFields(data: any, calculations: any): any {
    if (Array.isArray(data)) {
      return data.map(item => ({ ...item, ...this.performCalculations(item, calculations) }));
    }
    return { ...data, ...this.performCalculations(data, calculations) };
  }

  private performCalculations(item: any, calculations: any): any {
    const calculated: any = {};
    
    for (const [field, formula] of Object.entries(calculations)) {
      if (typeof formula === 'string') {
        // Simple formula evaluation (in production, use a safe evaluator)
        calculated[field] = this.evaluateFormula(formula, item);
      } else if (typeof formula === 'function') {
        calculated[field] = formula(item);
      }
    }
    
    return calculated;
  }

  private evaluateFormula(formula: string, item: any): any {
    // Simple formula evaluator - replace with proper implementation
    let expression = formula;
    
    // Replace field references with actual values
    for (const [field, value] of Object.entries(item)) {
      expression = expression.replace(new RegExp(`\\b${field}\\b`, 'g'), String(value));
    }
    
    try {
      // Note: In production, use a safe expression evaluator
      return eval(expression);
    } catch (error) {
      console.warn(`Formula evaluation failed: ${formula}`);
      return null;
    }
  }

  cacheData(key: string, data: any, ttl: number = 300): void {
    const expires = Date.now() + (ttl * 1000);
    this.cache.set(key, { data, expires });
  }

  getCachedData(key: string): any {
    const cached = this.cache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    
    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup(): Promise<void> {
    if (this.dbPool) {
      await this.dbPool.end();
    }
    this.cache.clear();
  }
}
```

### **Step Definition Implementation**

```typescript
// support/step-definitions/custom-parameters.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world';
import { ExternalDataManager } from '../services/external-data.service';

// Product search with custom parameters
When('I search for products by category {product-category}', 
  async function (this: CustomWorld, category: any) {
    await this.page.goto('/products');
    
    // Use the custom category object
    await this.page.selectOption('[data-testid="category-filter"]', category.id);
    
    // Store category for later verification
    this.testData.selectedCategory = category;
    
    console.log(`✓ Filtered products by category: ${category.name}`);
    console.log(`   Filters: ${category.filters.join(', ')}`);
    console.log(`   Price range: $${category.priceRange.min} - $${category.priceRange.max}`);
  }
);

When('I filter by price range {currency-range}', 
  async function (this: CustomWorld, priceRange: any) {
    // Set price range filters
    await this.page.fill('[data-testid="min-price"]', priceRange.minPrice.toString());
    await this.page.fill('[data-testid="max-price"]', priceRange.maxPrice.toString());
    await this.page.selectOption('[data-testid="currency"]', priceRange.currency);
    
    // Apply filters
    await this.page.click('[data-testid="apply-filters"]');
    
    // Store price range for verification
    this.testData.priceRange = priceRange;
    
    console.log(`✓ Price range filter applied: ${priceRange.symbol}${priceRange.minPrice} - ${priceRange.symbol}${priceRange.maxPrice}`);
  }
);

// User registration with external data
When('I create a new user account with profile {user-profile}', 
  async function (this: CustomWorld, userProfile: any) {
    await this.page.goto('/register');
    
    // Fill registration form using generated user profile
    await this.page.fill('[data-testid="email"]', userProfile.email);
    await this.page.fill('[data-testid="first-name"]', `Test${userProfile.id}`);
    await this.page.fill('[data-testid="last-name"]', 'User');
    await this.page.selectOption('[data-testid="membership-level"]', userProfile.membershipLevel);
    
    // Configure account features
    for (const feature of userProfile.features) {
      await this.page.check(`[data-testid="feature-${feature}"]`);
    }
    
    // Set contact preferences
    for (const preference of userProfile.contactPreferences) {
      await this.page.check(`[data-testid="contact-${preference}"]`);
    }
    
    // Store user profile
    this.testData.userProfile = userProfile;
    
    console.log(`✓ User registration form filled for ${userProfile.type}`);
    console.log(`   Email: ${userProfile.email}`);
    console.log(`   Membership: ${userProfile.membershipLevel}`);
    console.log(`   Features: ${userProfile.features.join(', ')}`);
  }
);

When('I set the shipping address to {address}', 
  async function (this: CustomWorld, address: any) {
    // Fill address form with external address data
    await this.page.fill('[data-testid="street"]', address.street);
    await this.page.fill('[data-testid="city"]', address.city);
    await this.page.fill('[data-testid="state"]', address.state);
    await this.page.fill('[data-testid="zip"]', address.zipCode);
    await this.page.selectOption('[data-testid="country"]', address.country);
    
    // Verify address validation
    await this.page.click('[data-testid="validate-address"]');
    await this.page.waitForSelector('[data-testid="address-validated"]');
    
    this.testData.shippingAddress = address;
    
    console.log(`✓ Shipping address set: ${address.street}, ${address.city}, ${address.state} ${address.zipCode}`);
  }
);

// External data integration
When('I check stock levels for products from {data-source}', 
  async function (this: CustomWorld, dataSource: any) {
    const dataManager = new ExternalDataManager(this);
    
    try {
      // Load inventory data from external source
      const inventoryData = await dataManager.loadData(dataSource, {
        query: 'active_products',
        limit: 100
      });
      
      // Validate data structure
      const schema = {
        required: ['product_id', 'stock_level', 'last_updated'],
        fields: {
          product_id: { type: 'string', minLength: 1 },
          stock_level: { type: 'number', minimum: 0 },
          last_updated: { type: 'string', pattern: '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}' }
        }
      };
      
      const validationResults = inventoryData.map((item: any) => ({
        product_id: item.product_id,
        isValid: dataManager.validateData(item, schema)
      }));
      
      const validCount = validationResults.filter(r => r.isValid).length;
      const totalCount = validationResults.length;
      
      // Store results for verification
      this.testData.inventoryData = inventoryData;
      this.testData.validationResults = validationResults;
      
      console.log(`✓ Stock levels checked from ${dataSource.name}`);
      console.log(`   Total products: ${totalCount}`);
      console.log(`   Valid records: ${validCount}`);
      console.log(`   Data source type: ${dataSource.type}`);
      
    } catch (error) {
      throw new Error(`Failed to check stock levels: ${error.message}`);
    }
  }
);

When('I verify prices against {data-source}', 
  async function (this: CustomWorld, pricingSource: any) {
    const dataManager = new ExternalDataManager(this);
    
    try {
      // Load pricing data
      const pricingData = await dataManager.loadData(pricingSource, {
        table: 'product_prices',
        conditions: { active: true, currency: 'USD' }
      });
      
      // Transform data for comparison
      const transformation = {
        map_fields: {
          id: 'product_id',
          current_price: 'price',
          effective_date: 'updated_at'
        },
        filter: {
          current_price: { greater_than: 0 }
        },
        sort: {
          field: 'effective_date',
          direction: 'desc'
        }
      };
      
      const transformedData = dataManager.transformData(pricingData, transformation);
      
      // Compare with inventory data if available
      const inventoryData = this.testData.inventoryData || [];
      const priceComparison = this.comparePrices(inventoryData, transformedData);
      
      this.testData.pricingData = transformedData;
      this.testData.priceComparison = priceComparison;
      
      console.log(`✓ Prices verified against ${pricingSource.name}`);
      console.log(`   Price records: ${transformedData.length}`);
      console.log(`   Matches found: ${priceComparison.matches}`);
      console.log(`   Discrepancies: ${priceComparison.discrepancies}`);
      
    } catch (error) {
      throw new Error(`Failed to verify prices: ${error.message}`);
    }
  }
);

// File-based data processing
When('I load customer data from {file}', 
  async function (this: CustomWorld, fileInfo: any) {
    const dataManager = new ExternalDataManager(this);
    
    try {
      // Load customer data from file
      const fileSource = {
        name: 'customer-file',
        type: 'FILE',
        endpoint: fileInfo.path,
        authentication: 'none',
        timeout: 5000,
        retryAttempts: 2
      };
      
      const customerData = await dataManager.loadData(fileSource);
      
      // Validate file format and content
      if (fileInfo.format === 'csv' && !Array.isArray(customerData)) {
        throw new Error('CSV file should contain array of customer records');
      }
      
      // Apply data transformations
      const transformation = {
        map_fields: {
          id: 'customer_id',
          email: 'email_address',
          phone: 'phone_number',
          name: (item: any) => `${item.first_name} ${item.last_name}`
        },
        filter: {
          email: { contains: '@' },
          phone: { pattern: '^\\+?[1-9]\\d{1,14}$' }
        }
      };
      
      const processedData = dataManager.transformData(customerData, transformation);
      
      this.testData.customerImportData = processedData;
      this.testData.importFileInfo = fileInfo;
      
      console.log(`✓ Customer data loaded from ${fileInfo.name}`);
      console.log(`   File size: ${(fileInfo.size / 1024).toFixed(2)} KB`);
      console.log(`   Records loaded: ${Array.isArray(customerData) ? customerData.length : 1}`);
      console.log(`   Records after processing: ${Array.isArray(processedData) ? processedData.length : 1}`);
      
    } catch (error) {
      throw new Error(`Failed to load customer data: ${error.message}`);
    }
  }
);

// Performance testing with dynamic data
When('I generate {quantity} concurrent users', 
  async function (this: CustomWorld, userCount: number) {
    console.log(`✓ Generating ${userCount} concurrent virtual users`);
    
    // Simulate user generation
    const users = [];
    for (let i = 0; i < userCount; i++) {
      users.push({
        id: `user_${i + 1}`,
        sessionId: `session_${Date.now()}_${i}`,
        startTime: Date.now(),
        actions: [],
        isActive: true
      });
    }
    
    this.testData.generatedUsers = users;
    this.testData.concurrentUserCount = userCount;
    
    console.log(`   Users generated: ${users.length}`);
    console.log(`   Session started: ${new Date().toISOString()}`);
  }
);

// Verification steps
Then('all data sources should be synchronized', async function (this: CustomWorld) {
  const inventoryData = this.testData.inventoryData || [];
  const pricingData = this.testData.pricingData || [];
  const priceComparison = this.testData.priceComparison;
  
  // Check data consistency
  expect(inventoryData.length).toBeGreaterThan(0);
  expect(pricingData.length).toBeGreaterThan(0);
  expect(priceComparison.matches).toBeGreaterThan(0);
  
  // Check synchronization tolerance
  const discrepancyRate = priceComparison.discrepancies / (priceComparison.matches + priceComparison.discrepancies);
  expect(discrepancyRate).toBeLessThan(0.05); // Less than 5% discrepancy allowed
  
  console.log(`✓ Data sources synchronized successfully`);
  console.log(`   Discrepancy rate: ${(discrepancyRate * 100).toFixed(2)}%`);
});

Then('price discrepancies should be {tolerance}', function (this: CustomWorld, tolerance: string) {
  const priceComparison = this.testData.priceComparison;
  const toleranceValue = parseFloat(tolerance.replace(/[^\d.]/g, '')) / 100;
  
  const discrepancyRate = priceComparison.discrepancies / (priceComparison.matches + priceComparison.discrepancies);
  
  expect(discrepancyRate).toBeLessThanOrEqual(toleranceValue);
  
  console.log(`✓ Price discrepancies within acceptable tolerance: ${tolerance}`);
});

Then('average response time should be {performance}', function (this: CustomWorld, performanceRule: any) {
  // Simulate performance measurement
  const averageResponseTime = Math.random() * 1500; // Simulate response time
  
  expect(averageResponseTime).toBeLessThan(performanceRule.threshold);
  
  console.log(`✓ Average response time: ${averageResponseTime.toFixed(0)}ms (threshold: ${performanceRule.threshold}ms)`);
});

// Helper method for price comparison
CustomWorld.prototype.comparePrices = function(inventoryData: any[], pricingData: any[]): any {
  let matches = 0;
  let discrepancies = 0;
  
  for (const inventoryItem of inventoryData) {
    const pricingItem = pricingData.find(p => p.id === inventoryItem.product_id);
    
    if (pricingItem) {
      matches++;
      // Check for price discrepancies (this is simplified logic)
      if (Math.abs(inventoryItem.price - pricingItem.current_price) > 0.01) {
        discrepancies++;
      }
    }
  }
  
  return { matches, discrepancies };
};
```

---

## Advanced Data Integration Patterns

### **Configuration and Setup**

```typescript
// cucumber.config.ts - Updated configuration for external data
export default {
  default: {
    require: [
      'support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    dryRun: false,
    parallel: 2,
    worldParameters: {
      externalDataSources: {
        inventory: {
          url: process.env.INVENTORY_API_URL || 'http://localhost:3001',
          timeout: 5000,
          retries: 3
        },
        pricing: {
          connectionString: process.env.PRICING_DB_URL || 'postgresql://localhost:5432/pricing',
          poolSize: 10
        },
        catalog: {
          endpoint: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002/graphql',
          timeout: 7000
        }
      },
      dataCacheSettings: {
        defaultTtl: 300,
        maxCacheSize: 1000,
        enableCache: true
      },
      performanceThresholds: {
        apiResponseTime: 2000,
        dbQueryTime: 1000,
        fileLoadTime: 5000
      }
    }
  }
};
```

---

## Summary

This example demonstrates sophisticated custom parameter types and external data integration:

**Key Techniques Mastered:**
- **Custom Parameter Types**: Domain-specific validation, complex data structures, reusable parameter libraries
- **External Data Sources**: REST APIs, databases, GraphQL endpoints, file systems
- **Data Transformation**: Field mapping, filtering, sorting, grouping, calculations
- **Advanced Validation**: Schema validation, business rule checking, data consistency verification
- **Performance Optimization**: Data caching, connection pooling, retry mechanisms

**Professional Patterns Applied:**
- Type-safe parameter transformations with comprehensive error handling  
- Enterprise-grade data source configuration and connection management
- Sophisticated data validation and transformation pipelines
- Caching strategies for performance optimization
- Comprehensive logging and monitoring for data operations

**Real-world Applications:**
- E-commerce platforms with multiple data sources and complex product configurations
- Enterprise applications requiring external system integration
- Performance testing with dynamic data generation and realistic user simulation
- Data import/export processes with validation and transformation requirements
- Multi-tenant applications with configurable data sources and custom business rules

These advanced patterns enable sophisticated data-driven BDD scenarios while maintaining type safety, performance, and maintainability for enterprise-scale testing applications.

**Next Section**: [Exercises Directory](../exercises/README.md) - Practice implementing custom parameters and external data integration with hands-on workshops and real-world challenges.