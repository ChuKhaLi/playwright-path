# Example 02: Complex Data Tables and Transformations

## Overview

This example demonstrates advanced techniques for working with complex data structures in Gherkin scenarios. You'll learn how to handle multi-dimensional data tables, implement custom data transformers, and validate sophisticated data structures in your step definitions.

## Learning Objectives

By completing this example, you will:

- **Master Multi-Dimensional Data Tables**: Work with complex nested data structures in Gherkin
- **Implement Custom Data Transformers**: Create reusable data transformation utilities
- **Handle JSON and Nested Data**: Process complex data formats in step definitions
- **Validate Data Structures**: Implement comprehensive data validation patterns
- **Manage Optional and Conditional Data**: Handle variable data structures effectively
- **Transform API Payloads**: Convert Gherkin tables to API request/response formats

## Key Concepts

### Data Table Types
- **Simple Tables**: Basic key-value pairs
- **Multi-Row Tables**: Lists of similar objects
- **Complex Tables**: Nested structures with multiple data types
- **Conditional Tables**: Data that varies based on context

### Data Transformation Patterns
- **Table to Object**: Converting data tables to JavaScript objects
- **Nested Structure Building**: Creating hierarchical data from flat tables
- **Type Conversion**: Handling different data types (strings, numbers, booleans, arrays)
- **Validation and Sanitization**: Ensuring data integrity

## Implementation

### Project Structure

```
complex-data-tables/
├── features/
│   ├── e-commerce-catalog.feature
│   ├── form-validation.feature
│   ├── api-payload-transformation.feature
│   └── support/
│       ├── world.ts
│       ├── hooks.ts
│       ├── data-transformers.ts
│       └── validators.ts
├── step-definitions/
│   ├── catalog.steps.ts
│   ├── forms.steps.ts
│   ├── api.steps.ts
│   └── shared.steps.ts
├── test-data/
│   ├── product-schemas.json
│   ├── form-schemas.json
│   └── api-schemas.json
├── config/
│   ├── cucumber.js
│   └── data-types.js
└── package.json
```

### Feature Files

#### E-commerce Catalog Feature

```gherkin
# features/e-commerce-catalog.feature
Feature: E-commerce Product Catalog Management
  As a catalog manager
  I want to manage complex product data structures
  So that customers can find and purchase products effectively

Background:
  Given the catalog system is initialized
  And the following product categories are configured:
    | category | subcategory | attributes                    | validation_rules           |
    | clothing | shirts      | size,color,material,fit      | size:required,color:required |
    | clothing | pants       | size,color,material,waist    | size:required,waist:numeric  |
    | tech     | phones      | storage,color,carrier        | storage:numeric,color:required|
    | tech     | laptops     | ram,storage,processor,screen | ram:numeric,storage:numeric  |

@catalog @smoke
Scenario: Create products with complex variant structures
  When I create the following products:
    | name          | category | base_price | variants                                                    | inventory                        | metadata                           |
    | Cotton T-Shirt| clothing | 19.99      | size:S,M,L,XL;color:red,blue,green;material:cotton         | S-red:50,M-blue:30,L-green:25   | brand:EcoWear,sustainable:true     |
    | Denim Jeans   | clothing | 59.99      | size:28,30,32,34;color:blue,black;waist:slim,regular,loose | 30-blue-slim:15,32-black-regular:20| brand:DenimCo,premium:true      |
    | Smartphone X  | tech     | 699.99     | storage:64GB,128GB,256GB;color:black,white,blue           | 128GB-black:100,256GB-white:50  | brand:TechCorp,warranty:2years     |
  Then the products should be created successfully
  And the variant combinations should be calculated correctly
  And the inventory should be allocated properly
  And the search indices should be updated

@catalog @data-validation
Scenario: Product data validation with complex rules
  When I attempt to create products with the following data:
    | name        | category | price_data                           | validation_expected | error_fields              |
    | Test Shirt  | clothing | base:19.99,sale:15.99,bulk:12.99    | success            |                          |
    | Bad Product | invalid  | base:invalid,sale:-10,bulk:text     | failure            | category,base_price,sale_price|
    | Phone Model | tech     | base:599,sale:549,discontinued:true | success            |                          |
  Then the validation results should match expectations
  And appropriate error messages should be generated

@catalog @complex-queries
Scenario: Complex product search with multiple criteria
  Given the catalog contains the following products with detailed attributes:
    | product_id | name         | category | attributes                                          | pricing                    | availability              |
    | P001       | Summer Dress | clothing | size:S,M,L;color:red,blue;material:cotton;style:casual| base:39.99,sale:29.99    | in_stock:50,reserved:5   |
    | P002       | Work Laptop  | tech     | ram:16GB;storage:512GB;processor:Intel-i7;screen:15"| base:1299,bulk:1099      | available:25,backorder:10|
    | P003       | Running Shoes| clothing | size:8,9,10,11;color:black,white;type:athletic       | base:89.99,member:79.99  | in_stock:30              |
  When I search with the following complex criteria:
    """
    {
      "filters": {
        "category": ["clothing"],
        "price_range": {"min": 20, "max": 100},
        "attributes": {
          "size": ["M", "L"],
          "color": ["red", "blue"]
        },
        "availability": "in_stock"
      },
      "sort": [
        {"field": "price", "direction": "asc"},
        {"field": "name", "direction": "asc"}
      ],
      "pagination": {
        "page": 1,
        "size": 10
      }
    }
    """
  Then the search should return filtered results
  And the results should be sorted correctly
  And pagination metadata should be included
```

#### Form Validation Feature

```gherkin
# features/form-validation.feature
Feature: Advanced Form Validation
  As a web application
  I want to validate complex form data structures
  So that data integrity is maintained

Background:
  Given the form validation service is initialized
  And the following validation rules are configured:
    | field_type | rule_name      | parameters                    | error_message                    |
    | email      | format         | pattern:email                 | Invalid email format             |
    | password   | complexity     | min:8,upper:1,lower:1,digit:1 | Password does not meet requirements|
    | phone      | format         | pattern:international         | Invalid phone number format      |
    | date       | range          | min:today,max:+1year         | Date must be within valid range  |

@forms @validation
Scenario: Multi-section form validation
  When I submit a form with the following sections:
    | section      | fields                                                                              |
    | personal     | first_name:John,last_name:Doe,email:john@example.com,phone:+1-555-123-4567       |
    | address      | street:123 Main St,city:Anytown,state:CA,zip:12345,country:USA                   |
    | preferences  | newsletter:true,marketing:false,theme:dark,language:en-US                        |
    | payment      | type:credit_card,number:****-****-****-1234,expiry:12/25,cvv:***                |
  Then all sections should validate successfully
  And the form should be processed correctly
  And confirmation should be sent to the user

@forms @conditional-validation
Scenario Outline: Conditional validation based on form type
  Given I am filling out a <form_type> form
  When I provide the following data:
    | field_group | data                                                          | required_if     |
    | basic       | name:<name>,email:<email>,phone:<phone>                      | always          |
    | address     | street:<street>,city:<city>,state:<state>,zip:<zip>         | shipping_needed |
    | payment     | method:<payment_method>,details:<payment_details>            | paid_service    |
    | company     | name:<company_name>,tax_id:<tax_id>,contact:<contact_person>| business_type   |
  Then the validation should <result>
  And the required fields should be <required_validation>
  And the conditional fields should be <conditional_validation>

Examples: Form Types and Validation Rules
  | form_type | name     | email           | phone        | street    | city    | state | zip   | payment_method | payment_details | company_name | tax_id | contact_person | result  | required_validation | conditional_validation |
  | personal  | John Doe | john@email.com  | 555-123-4567 |           |         |       |       |                |                 |              |        |                | succeed | pass               | skip                   |
  | business  | Jane Doe | jane@company.com| 555-987-6543 | 123 Main  | Boston  | MA    | 02101 | credit_card    | ****1234        | TechCorp Inc | 12345  | Jane Doe       | succeed | pass               | pass                   |
  | shipping  | Bob User | bob@user.com    | 555-456-7890 | 456 Oak   | Seattle | WA    | 98101 |                |                 |              |        |                | succeed | pass               | pass                   |
```

#### API Payload Transformation Feature

```gherkin
# features/api-payload-transformation.feature
Feature: API Payload Transformation
  As an API client
  I want to transform complex data structures for API requests
  So that data can be properly sent and received

Background:
  Given the API transformation service is configured
  And the following transformation mappings are defined:
    | source_format | target_format | transformation_rules                                    |
    | gherkin_table | json_api      | flatten_nested:true,convert_types:true,add_metadata:true|
    | json_api      | database      | normalize_relations:true,validate_constraints:true      |
    | database      | response      | serialize_dates:true,hide_sensitive:true,add_links:true |

@api @transformation
Scenario: Transform user registration data
  Given I have user registration data in the following format:
    | user_data    | profile_data                          | preferences                      | permissions                    |
    | name:John Doe| bio:Software Engineer,location:Seattle| theme:dark,notifications:email  | read:true,write:false,admin:false|
    | email:john@example.com,age:30        | avatar:avatar.jpg,website:john.dev| language:en,timezone:PST        | features:basic,api_access:true |
  When I transform this data for user creation API
  Then the transformed payload should match:
    """
    {
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30,
        "profile": {
          "bio": "Software Engineer",
          "location": "Seattle",
          "avatar": "avatar.jpg",
          "website": "john.dev"
        },
        "preferences": {
          "theme": "dark",
          "notifications": "email",
          "language": "en",
          "timezone": "PST"
        },
        "permissions": {
          "read": true,
          "write": false,
          "admin": false,
          "features": "basic",
          "api_access": true
        }
      },
      "metadata": {
        "created_at": "@timestamp",
        "source": "registration_form",
        "version": "1.0"
      }
    }
    """
  And the payload should validate against the user schema

@api @complex-nesting
Scenario: Transform hierarchical organizational data
  When I process the following organizational structure:
    | department | teams                                    | employees                                           | projects                                    |
    | Engineering| backend:5,frontend:4,devops:2           | backend:Alice-senior,Bob-junior;frontend:Carol-lead| backend:api-v2,database-migration;frontend:ui-redesign|
    | Marketing  | digital:3,content:2,analytics:2         | digital:Dave-manager,Eve-specialist             | digital:campaign-2024,seo-optimization            |
    | Sales      | enterprise:4,smb:3,inside:6             | enterprise:Frank-director,Grace-rep             | enterprise:expansion-q4,smb:automation             |
  Then the transformed structure should create proper hierarchy
  And relationships between entities should be established
  And the data should be suitable for organization chart rendering

@api @data-aggregation
Scenario: Transform and aggregate e-commerce analytics data
  Given I have the following sales data to transform:
    | time_period | product_sales                                          | customer_metrics                    | financial_data                        |
    | 2024-Q1     | laptops:150@1200,phones:300@800,accessories:500@50   | new:45,returning:55,vip:15         | revenue:495000,costs:350000,profit:145000|
    | 2024-Q2     | laptops:180@1150,phones:250@850,accessories:600@45   | new:40,returning:60,vip:20         | revenue:458500,costs:320000,profit:138500|
    | 2024-Q3     | laptops:200@1100,phones:280@900,accessories:700@40   | new:35,returning:65,vip:25         | revenue:507000,costs:340000,profit:167000|
  When I transform this data for analytics dashboard API
  Then the output should include aggregated metrics
  And time-series data should be properly formatted
  And percentage calculations should be accurate
  And trend analysis data should be included
```

### Step Definitions

#### Catalog Step Definitions

```typescript
// step-definitions/catalog.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../features/support/world';
import { ProductTransformer, VariantCalculator } from '../features/support/data-transformers';

Given('the catalog system is initialized', async function (this: ICustomWorld) {
  this.catalogService = {
    products: new Map(),
    categories: new Map(),
    searchIndex: new Map()
  };
  
  // Initialize product transformer
  this.productTransformer = new ProductTransformer();
  this.variantCalculator = new VariantCalculator();
});

Given('the following product categories are configured:', async function (this: ICustomWorld, dataTable) {
  const categories = dataTable.hashes();
  
  for (const category of categories) {
    const categoryConfig = {
      name: category.category,
      subcategory: category.subcategory,
      attributes: category.attributes.split(','),
      validationRules: this.parseValidationRules(category.validation_rules)
    };
    
    this.catalogService.categories.set(
      `${category.category}-${category.subcategory}`, 
      categoryConfig
    );
  }
});

When('I create the following products:', async function (this: ICustomWorld, dataTable) {
  const products = dataTable.hashes();
  this.createdProducts = [];
  
  for (const productData of products) {
    try {
      // Transform the complex product data
      const transformedProduct = await this.productTransformer.transform({
        name: productData.name,
        category: productData.category,
        basePrice: parseFloat(productData.base_price),
        variants: this.parseVariants(productData.variants),
        inventory: this.parseInventory(productData.inventory),
        metadata: this.parseMetadata(productData.metadata)
      });
      
      // Calculate variant combinations
      transformedProduct.variantCombinations = this.variantCalculator.calculate(
        transformedProduct.variants
      );
      
      // Create the product
      const createdProduct = await this.catalogService.createProduct(transformedProduct);
      this.createdProducts.push(createdProduct);
      
    } catch (error) {
      this.productCreationErrors = this.productCreationErrors || [];
      this.productCreationErrors.push({
        product: productData.name,
        error: error.message
      });
    }
  }
});

Then('the products should be created successfully', function (this: ICustomWorld) {
  expect(this.productCreationErrors).toBeUndefined();
  expect(this.createdProducts).toHaveLength(3);
  
  for (const product of this.createdProducts) {
    expect(product.id).toBeDefined();
    expect(product.status).toBe('active');
  }
});

Then('the variant combinations should be calculated correctly', function (this: ICustomWorld) {
  const tshirt = this.createdProducts.find(p => p.name === 'Cotton T-Shirt');
  expect(tshirt.variantCombinations).toHaveLength(12); // 4 sizes × 3 colors
  
  const jeans = this.createdProducts.find(p => p.name === 'Denim Jeans');
  expect(jeans.variantCombinations).toHaveLength(24); // 4 sizes × 2 colors × 3 waist types
  
  const phone = this.createdProducts.find(p => p.name === 'Smartphone X');
  expect(phone.variantCombinations).toHaveLength(9); // 3 storage × 3 colors
});

Then('the inventory should be allocated properly', function (this: ICustomWorld) {
  for (const product of this.createdProducts) {
    for (const [variantKey, quantity] of Object.entries(product.inventory)) {
      expect(quantity).toBeGreaterThanOrEqual(0);
      expect(product.variantCombinations).toContainEqual(
        expect.objectContaining({ key: variantKey })
      );
    }
  }
});

When('I attempt to create products with the following data:', async function (this: ICustomWorld, dataTable) {
  const products = dataTable.hashes();
  this.validationResults = [];
  
  for (const productData of products) {
    try {
      const priceData = this.parsePriceData(productData.price_data);
      
      const validationResult = await this.catalogService.validateProduct({
        name: productData.name,
        category: productData.category,
        pricing: priceData
      });
      
      this.validationResults.push({
        product: productData.name,
        expected: productData.validation_expected,
        actual: validationResult.isValid ? 'success' : 'failure',
        errors: validationResult.errors || [],
        expectedErrors: productData.error_fields ? productData.error_fields.split(',') : []
      });
      
    } catch (error) {
      this.validationResults.push({
        product: productData.name,
        expected: productData.validation_expected,
        actual: 'failure',
        errors: [error.message],
        expectedErrors: productData.error_fields ? productData.error_fields.split(',') : []
      });
    }
  }
});

Then('the validation results should match expectations', function (this: ICustomWorld) {
  for (const result of this.validationResults) {
    expect(result.actual).toBe(result.expected);
    
    if (result.expected === 'failure') {
      for (const expectedError of result.expectedErrors) {
        expect(result.errors.some(error => 
          error.toLowerCase().includes(expectedError.toLowerCase())
        )).toBe(true);
      }
    }
  }
});

Given('the catalog contains the following products with detailed attributes:', async function (this: ICustomWorld, dataTable) {
  const products = dataTable.hashes();
  
  for (const productData of products) {
    const product = {
      id: productData.product_id,
      name: productData.name,
      category: productData.category,
      attributes: this.parseKeyValuePairs(productData.attributes),
      pricing: this.parseKeyValuePairs(productData.pricing),
      availability: this.parseKeyValuePairs(productData.availability)
    };
    
    await this.catalogService.addProduct(product);
  }
});

When('I search with the following complex criteria:', async function (this: ICustomWorld, docString) {
  const searchCriteria = JSON.parse(docString);
  this.searchResults = await this.catalogService.search(searchCriteria);
});

Then('the search should return filtered results', function (this: ICustomWorld) {
  expect(this.searchResults.items).toBeDefined();
  expect(this.searchResults.items.length).toBeGreaterThan(0);
  
  // Verify filtering criteria are applied
  for (const item of this.searchResults.items) {
    expect(item.category).toBe('clothing');
    expect(item.price).toBeGreaterThanOrEqual(20);
    expect(item.price).toBeLessThanOrEqual(100);
  }
});

Then('the results should be sorted correctly', function (this: ICustomWorld) {
  const items = this.searchResults.items;
  
  for (let i = 1; i < items.length; i++) {
    // First sort by price ascending
    if (items[i].price !== items[i-1].price) {
      expect(items[i].price).toBeGreaterThanOrEqual(items[i-1].price);
    } else {
      // Then by name ascending
      expect(items[i].name.localeCompare(items[i-1].name)).toBeGreaterThanOrEqual(0);
    }
  }
});

// Helper methods
parseVariants(variantString: string): any {
  const variants = {};
  const pairs = variantString.split(';');
  
  for (const pair of pairs) {
    const [key, values] = pair.split(':');
    variants[key] = values.split(',');
  }
  
  return variants;
}

parseInventory(inventoryString: string): any {
  const inventory = {};
  const pairs = inventoryString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    inventory[key] = parseInt(value);
  }
  
  return inventory;
}

parseMetadata(metadataString: string): any {
  const metadata = {};
  const pairs = metadataString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    metadata[key] = value === 'true' ? true : value === 'false' ? false : value;
  }
  
  return metadata;
}

parsePriceData(priceString: string): any {
  const pricing = {};
  const pairs = priceString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    pricing[key] = isNaN(Number(value)) ? value : parseFloat(value);
  }
  
  return pricing;
}

parseValidationRules(rulesString: string): any {
  const rules = {};
  const pairs = rulesString.split(',');
  
  for (const pair of pairs) {
    const [field, rule] = pair.split(':');
    rules[field] = rule;
  }
  
  return rules;
}

parseKeyValuePairs(pairString: string): any {
  const result = {};
  const pairs = pairString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    // Try to parse as number, boolean, or keep as string
    let parsedValue = value;
    if (!isNaN(Number(value))) {
      parsedValue = parseFloat(value);
    } else if (value === 'true' || value === 'false') {
      parsedValue = value === 'true';
    }
    result[key] = parsedValue;
  }
  
  return result;
}
```

#### Forms Step Definitions

```typescript
// step-definitions/forms.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../features/support/world';
import { FormValidator, ConditionalRuleEngine } from '../features/support/data-transformers';

Given('the form validation service is initialized', async function (this: ICustomWorld) {
  this.formValidator = new FormValidator();
  this.conditionalRuleEngine = new ConditionalRuleEngine();
  this.validationRules = new Map();
});

Given('the following validation rules are configured:', async function (this: ICustomWorld, dataTable) {
  const rules = dataTable.hashes();
  
  for (const rule of rules) {
    const ruleConfig = {
      fieldType: rule.field_type,
      ruleName: rule.rule_name,
      parameters: this.parseParameters(rule.parameters),
      errorMessage: rule.error_message
    };
    
    this.validationRules.set(`${rule.field_type}-${rule.rule_name}`, ruleConfig);
  }
  
  // Configure the validator with rules
  this.formValidator.setRules(Array.from(this.validationRules.values()));
});

When('I submit a form with the following sections:', async function (this: ICustomWorld, dataTable) {
  const sections = dataTable.hashes();
  this.formData = {};
  
  for (const section of sections) {
    this.formData[section.section] = this.parseFieldData(section.fields);
  }
  
  // Validate the complete form
  this.formValidationResult = await this.formValidator.validateForm(this.formData);
});

Then('all sections should validate successfully', function (this: ICustomWorld) {
  expect(this.formValidationResult.isValid).toBe(true);
  expect(this.formValidationResult.errors).toHaveLength(0);
  
  for (const [sectionName, sectionResult] of Object.entries(this.formValidationResult.sectionResults)) {
    expect(sectionResult.isValid).toBe(true);
  }
});

Then('the form should be processed correctly', async function (this: ICustomWorld) {
  // Simulate form processing
  this.processingResult = await this.formValidator.processForm(this.formData);
  expect(this.processingResult.success).toBe(true);
  expect(this.processingResult.id).toBeDefined();
});

Given('I am filling out a {word} form', function (this: ICustomWorld, formType: string) {
  this.currentFormType = formType;
  this.conditionalRules = this.getConditionalRules(formType);
});

When('I provide the following data:', async function (this: ICustomWorld, dataTable) {
  const fieldGroups = dataTable.hashes();
  this.formData = {};
  this.conditionalFields = [];
  
  for (const group of fieldGroups) {
    const groupData = this.parseFieldData(group.data);
    this.formData[group.field_group] = groupData;
    
    // Check if this group should be conditionally validated
    if (group.required_if !== 'always') {
      this.conditionalFields.push({
        group: group.field_group,
        condition: group.required_if,
        data: groupData
      });
    }
  }
  
  // Apply conditional validation logic
  this.conditionalValidation = await this.conditionalRuleEngine.evaluate(
    this.formData,
    this.conditionalFields,
    this.currentFormType
  );
});

Then('the validation should {word}', function (this: ICustomWorld, expectedResult: string) {
  if (expectedResult === 'succeed') {
    expect(this.conditionalValidation.isValid).toBe(true);
  } else {
    expect(this.conditionalValidation.isValid).toBe(false);
  }
});

Then('the required fields should be {word}', function (this: ICustomWorld, expectedValidation: string) {
  const requiredValidation = this.conditionalValidation.requiredFieldsValidation;
  
  if (expectedValidation === 'pass') {
    expect(requiredValidation.isValid).toBe(true);
  } else {
    expect(requiredValidation.isValid).toBe(false);
  }
});

Then('the conditional fields should be {word}', function (this: ICustomWorld, expectedValidation: string) {
  const conditionalValidation = this.conditionalValidation.conditionalFieldsValidation;
  
  if (expectedValidation === 'pass') {
    expect(conditionalValidation.isValid).toBe(true);
  } else if (expectedValidation === 'skip') {
    expect(conditionalValidation.skipped).toBe(true);
  } else {
    expect(conditionalValidation.isValid).toBe(false);
  }
});

// Helper methods
parseParameters(paramString: string): any {
  const params = {};
  const pairs = paramString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    params[key] = isNaN(Number(value)) ? value : parseInt(value);
  }
  
  return params;
}

parseFieldData(fieldsString: string): any {
  const fields = {};
  const pairs = fieldsString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    // Handle different data types
    let parsedValue = value;
    if (value === 'true' || value === 'false') {
      parsedValue = value === 'true';
    } else if (!isNaN(Number(value))) {
      parsedValue = parseFloat(value);
    }
    fields[key] = parsedValue;
  }
  
  return fields;
}

getConditionalRules(formType: string): any {
  const ruleMap = {
    personal: {
      shipping_needed: false,
      paid_service: false,
      business_type: false
    },
    business: {
      shipping_needed: true,
      paid_service: true,
      business_type: true
    },
    shipping: {
      shipping_needed: true,
      paid_service: false,
      business_type: false
    }
  };
  
  return ruleMap[formType] || {};
}
```

#### API Step Definitions

```typescript
// step-definitions/api.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../features/support/world';
import { ApiTransformer, SchemaValidator } from '../features/support/data-transformers';

Given('the API transformation service is configured', async function (this: ICustomWorld) {
  this.apiTransformer = new ApiTransformer();
  this.schemaValidator = new SchemaValidator();
  this.transformationMappings = new Map();
});

Given('the following transformation mappings are defined:', async function (this: ICustomWorld, dataTable) {
  const mappings = dataTable.hashes();
  
  for (const mapping of mappings) {
    const mappingConfig = {
      sourceFormat: mapping.source_format,
      targetFormat: mapping.target_format,
      rules: this.parseTransformationRules(mapping.transformation_rules)
    };
    
    this.transformationMappings.set(
      `${mapping.source_format}-${mapping.target_format}`,
      mappingConfig
    );
  }
  
  this.apiTransformer.setMappings(Array.from(this.transformationMappings.values()));
});

Given('I have user registration data in the following format:', async function (this: ICustomWorld, dataTable) {
  const userData = dataTable.hashes()[0];
  
  this.sourceData = {
    userData: this.parseComplexData(userData.user_data),
    profileData: this.parseComplexData(userData.profile_data),
    preferences: this.parseComplexData(userData.preferences),
    permissions: this.parseComplexData(userData.permissions)
  };
});

When('I transform this data for user creation API', async function (this: ICustomWorld) {
  this.transformedPayload = await this.apiTransformer.transform(
    this.sourceData,
    'gherkin_table',
    'json_api'
  );
});

Then('the transformed payload should match:', async function (this: ICustomWorld, docString) {
  const expectedPayload = JSON.parse(docString);
  
  // Handle dynamic values like timestamps
  this.normalizePayload(this.transformedPayload);
  this.normalizePayload(expectedPayload);
  
  expect(this.transformedPayload).toMatchObject(expectedPayload);
});

Then('the payload should validate against the user schema', async function (this: ICustomWorld) {
  const userSchema = require('../test-data/user-schema.json');
  const validationResult = await this.schemaValidator.validate(
    this.transformedPayload,
    userSchema
  );
  
  expect(validationResult.isValid).toBe(true);
  if (!validationResult.isValid) {
    console.log('Validation errors:', validationResult.errors);
  }
});

When('I process the following organizational structure:', async function (this: ICustomWorld, dataTable) {
  const orgData = dataTable.hashes();
  this.organizationalData = [];
  
  for (const dept of orgData) {
    const deptStructure = {
      department: dept.department,
      teams: this.parseTeamData(dept.teams),
      employees: this.parseEmployeeData(dept.employees),
      projects: this.parseProjectData(dept.projects)
    };
    
    this.organizationalData.push(deptStructure);
  }
  
  this.transformedOrgStructure = await this.apiTransformer.transformOrganization(
    this.organizationalData
  );
});

Then('the transformed structure should create proper hierarchy', function (this: ICustomWorld) {
  expect(this.transformedOrgStructure.departments).toBeDefined();
  expect(this.transformedOrgStructure.departments).toHaveLength(3);
  
  for (const dept of this.transformedOrgStructure.departments) {
    expect(dept.teams).toBeDefined();
    expect(dept.employees).toBeDefined();
    expect(dept.projects).toBeDefined();
  }
});

Then('relationships between entities should be established', function (this: ICustomWorld) {
  for (const dept of this.transformedOrgStructure.departments) {
    for (const employee of dept.employees) {
      expect(employee.departmentId).toBe(dept.id);
      expect(employee.teamId).toBeDefined();
    }
    
    for (const project of dept.projects) {
      expect(project.departmentId).toBe(dept.id);
      expect(project.assignedTeamIds).toBeDefined();
    }
  }
});

Given('I have the following sales data to transform:', async function (this: ICustomWorld, dataTable) {
  const salesData = dataTable.hashes();
  this.rawSalesData = [];
  
  for (const period of salesData) {
    const periodData = {
      timePeriod: period.time_period,
      productSales: this.parseProductSales(period.product_sales),
      customerMetrics: this.parseCustomerMetrics(period.customer_metrics),
      financialData: this.parseFinancialData(period.financial_data)
    };
    
    this.rawSalesData.push(periodData);
  }
});

When('I transform this data for analytics dashboard API', async function (this: ICustomWorld) {
  this.analyticsPayload = await this.apiTransformer.transformAnalytics(
    this.rawSalesData
  );
});

Then('the output should include aggregated metrics', function (this: ICustomWorld) {
  expect(this.analyticsPayload.aggregatedMetrics).toBeDefined();
  expect(this.analyticsPayload.aggregatedMetrics.totalRevenue).toBeDefined();
  expect(this.analyticsPayload.aggregatedMetrics.totalUnits).toBeDefined();
  expect(this.analyticsPayload.aggregatedMetrics.averageOrderValue).toBeDefined();
});

Then('time-series data should be properly formatted', function (this: ICustomWorld) {
  expect(this.analyticsPayload.timeSeries).toBeDefined();
  expect(this.analyticsPayload.timeSeries).toHaveLength(3);
  
  for (const dataPoint of this.analyticsPayload.timeSeries) {
    expect(dataPoint.timestamp).toBeDefined();
    expect(dataPoint.metrics).toBeDefined();
  }
});

// Helper methods for complex data parsing
parseComplexData(dataString: string): any {
  const result = {};
  const pairs = dataString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    result[key] = this.parseValue(value);
  }
  
  return result;
}

parseValue(value: string): any {
  // Try to parse as number
  if (!isNaN(Number(value))) {
    return parseFloat(value);
  }
  
  // Try to parse as boolean
  if (value === 'true' || value === 'false') {
    return value === 'true';
  }
  
  // Return as string
  return value;
}

parseTransformationRules(rulesString: string): any {
  const rules = {};
  const pairs = rulesString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    rules[key] = value === 'true';
  }
  
  return rules;
}

parseTeamData(teamsString: string): any {
  const teams = {};
  const pairs = teamsString.split(',');
  
  for (const pair of pairs) {
    const [teamName, size] = pair.split(':');
    teams[teamName] = parseInt(size);
  }
  
  return teams;
}

parseEmployeeData(employeesString: string): any {
  const employees = {};
  const departments = employeesString.split(';');
  
  for (const dept of departments) {
    const [teamName, employeeList] = dept.split(':');
    employees[teamName] = employeeList.split(',');
  }
  
  return employees;
}

parseProjectData(projectsString: string): any {
  const projects = {};
  const departments = projectsString.split(';');
  
  for (const dept of departments) {
    const [teamName, projectList] = dept.split(':');
    projects[teamName] = projectList.split(',');
  }
  
  return projects;
}

parseProductSales(salesString: string): any {
  const sales = {};
  const products = salesString.split(',');
  
  for (const product of products) {
    const [name, details] = product.split(':');
    const [quantity, price] = details.split('@');
    sales[name] = {
      quantity: parseInt(quantity),
      price: parseFloat(price)
    };
  }
  
  return sales;
}

parseCustomerMetrics(metricsString: string): any {
  const metrics = {};
  const pairs = metricsString.split(',');
  
  for (const pair of pairs) {
    const [type, percentage] = pair.split(':');
    metrics[type] = parseInt(percentage);
  }
  
  return metrics;
}

parseFinancialData(financialString: string): any {
  const financial = {};
  const pairs = financialString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split(':');
    financial[key] = parseFloat(value);
  }
  
  return financial;
}

normalizePayload(payload: any): void {
  // Replace dynamic values for comparison
  if (payload.metadata && payload.metadata.created_at === '@timestamp') {
    payload.metadata.created_at = '2024-01-01T00:00:00Z';
  }
}
```

### Data Transformers

```typescript
// features/support/data-transformers.ts
export class ProductTransformer {
  async transform(productData: any): Promise<any> {
    return {
      id: this.generateId(),
      name: productData.name,
      category: productData.category,
      basePrice: productData.basePrice,
      variants: productData.variants,
      inventory: productData.inventory,
      metadata: {
        ...productData.metadata,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    };
  }
  
  private generateId(): string {
    return 'prod_' + Math.random().toString(36).substr(2, 9);
  }
}

export class VariantCalculator {
  calculate(variants: any): any[] {
    const combinations = [];
    const keys = Object.keys(variants);
    
    this.generateCombinations(variants, keys, 0, {}, combinations);
    
    return combinations;
  }
  
  private generateCombinations(variants: any, keys: string[], index: number, current: any, combinations: any[]): void {
    if (index === keys.length) {
      combinations.push({
        key: Object.values(current).join('-'),
        attributes: { ...current }
      });
      return;
    }
    
    const key = keys[index];
    for (const value of variants[key]) {
      current[key] = value;
      this.generateCombinations(variants, keys, index + 1, current, combinations);
    }
  }
}

export class FormValidator {
  private rules: any[] = [];
  
  setRules(rules: any[]): void {
    this.rules = rules;
  }
  
  async validateForm(formData: any): Promise<any> {
    const sectionResults = {};
    let isValid = true;
    const errors = [];
    
    for (const [sectionName, sectionData] of Object.entries(formData)) {
      const sectionResult = await this.validateSection(sectionName, sectionData);
      sectionResults[sectionName] = sectionResult;
      
      if (!sectionResult.isValid) {
        isValid = false;
        errors.push(...sectionResult.errors);
      }
    }
    
    return {
      isValid,
      errors,
      sectionResults
    };
  }
  
  async processForm(formData: any): Promise<any> {
    // Simulate form processing
    return {
      success: true,
      id: 'form_' + Date.now(),
      data: formData
    };
  }
  
  private async validateSection(sectionName: string, sectionData: any): Promise<any> {
    const errors = [];
    
    for (const [fieldName, fieldValue] of Object.entries(sectionData)) {
      const fieldErrors = await this.validateField(fieldName, fieldValue);
      errors.push(...fieldErrors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  private async validateField(fieldName: string, fieldValue: any): Promise<string[]> {
    const errors = [];
    
    // Apply relevant validation rules
    for (const rule of this.rules) {
      if (this.fieldMatchesRule(fieldName, rule)) {
        const isValid = await this.applyRule(fieldValue, rule);
        if (!isValid) {
          errors.push(rule.errorMessage);
        }
      }
    }
    
    return errors;
  }
  
  private fieldMatchesRule(fieldName: string, rule: any): boolean {
    // Simple field type matching logic
    if (fieldName.includes('email')) return rule.fieldType === 'email';
    if (fieldName.includes('password')) return rule.fieldType === 'password';
    if (fieldName.includes('phone')) return rule.fieldType === 'phone';
    if (fieldName.includes('date')) return rule.fieldType === 'date';
    
    return false;
  }
  
  private async applyRule(value: any, rule: any): Promise<boolean> {
    switch (rule.ruleName) {
      case 'format':
        return this.validateFormat(value, rule.parameters);
      case 'complexity':
        return this.validateComplexity(value, rule.parameters);
      case 'range':
        return this.validateRange(value, rule.parameters);
      default:
        return true;
    }
  }
  
  private validateFormat(value: string, params: any): boolean {
    switch (params.pattern) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'international':
        return /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/.test(value);
      default:
        return true;
    }
  }
  
  private validateComplexity(value: string, params: any): boolean {
    if (value.length < params.min) return false;
    if (params.upper && !/[A-Z]/.test(value)) return false;
    if (params.lower && !/[a-z]/.test(value)) return false;
    if (params.digit && !/\d/.test(value)) return false;
    
    return true;
  }
  
  private validateRange(value: any, params: any): boolean {
    const date = new Date(value);
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    return date >= today && date <= maxDate;
  }
}

export class ConditionalRuleEngine {
  async evaluate(formData: any, conditionalFields: any[], formType: string): Promise<any> {
    const requiredValidation = await this.validateRequiredFields(formData);
    const conditionalValidation = await this.validateConditionalFields(
      formData, 
      conditionalFields, 
      formType
    );
    
    return {
      isValid: requiredValidation.isValid && conditionalValidation.isValid,
      requiredFieldsValidation: requiredValidation,
      conditionalFieldsValidation: conditionalValidation
    };
  }
  
  private async validateRequiredFields(formData: any): Promise<any> {
    // Validate always-required fields
    const requiredFields = ['name', 'email', 'phone'];
    const errors = [];
    
    for (const section of Object.values(formData)) {
      for (const fieldName of requiredFields) {
        if (section[fieldName] === undefined || section[fieldName] === '') {
          errors.push(`${fieldName} is required`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  private async validateConditionalFields(formData: any, conditionalFields: any[], formType: string): Promise<any> {
    if (conditionalFields.length === 0) {
      return { skipped: true, isValid: true };
    }
    
    const errors = [];
    
    for (const field of conditionalFields) {
      const shouldValidate = this.shouldValidateField(field.condition, formType);
      
      if (shouldValidate) {
        const fieldErrors = await this.validateFieldGroup(field.data);
        errors.push(...fieldErrors);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  private shouldValidateField(condition: string, formType: string): boolean {
    const conditionMap = {
      shipping_needed: ['business', 'shipping'].includes(formType),
      paid_service: ['business'].includes(formType),
      business_type: ['business'].includes(formType)
    };
    
    return conditionMap[condition] || false;
  }
  
  private async validateFieldGroup(data: any): Promise<string[]> {
    const errors = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === '') {
        errors.push(`${key} is required for this form type`);
      }
    }
    
    return errors;
  }
}

export class ApiTransformer {
  private mappings: any[] = [];
  
  setMappings(mappings: any[]): void {
    this.mappings = mappings;
  }
  
  async transform(data: any, sourceFormat: string, targetFormat: string): Promise<any> {
    const mapping = this.mappings.find(m => 
      m.sourceFormat === sourceFormat && m.targetFormat === targetFormat
    );
    
    if (!mapping) {
      throw new Error(`No mapping found for ${sourceFormat} to ${targetFormat}`);
    }
    
    return this.applyTransformation(data, mapping.rules);
  }
  
  async transformOrganization(orgData: any[]): Promise<any> {
    const departments = [];
    
    for (const dept of orgData) {
      const transformedDept = {
        id: this.generateId(),
        name: dept.department,
        teams: this.transformTeams(dept.teams, dept.department),
        employees: this.transformEmployees(dept.employees, dept.department),
        projects: this.transformProjects(dept.projects, dept.department)
      };
      
      departments.push(transformedDept);
    }
    
    return { departments };
  }
  
  async transformAnalytics(salesData: any[]): Promise<any> {
    const aggregatedMetrics = this.calculateAggregatedMetrics(salesData);
    const timeSeries = this.createTimeSeries(salesData);
    
    return {
      aggregatedMetrics,
      timeSeries,
      trends: this.calculateTrends(timeSeries)
    };
  }
  
  private applyTransformation(data: any, rules: any): any {
    const transformed = {
      user: {
        name: data.userData.name,
        email: data.userData.email,
        age: data.userData.age,
        profile: data.profileData,
        preferences: data.preferences,
        permissions: data.permissions
      },
      metadata: {
        created_at: new Date().toISOString(),
        source: 'registration_form',
        version: '1.0'
      }
    };
    
    return transformed;
  }
  
  private transformTeams(teams: any, departmentName: string): any[] {
    return Object.entries(teams).map(([teamName, size]) => ({
      id: this.generateId(),
      name: teamName,
      department: departmentName,
      size: size
    }));
  }
  
  private transformEmployees(employees: any, departmentName: string): any[] {
    const result = [];
    
    for (const [teamName, employeeList] of Object.entries(employees)) {
      for (const employee of employeeList) {
        result.push({
          id: this.generateId(),
          name: employee,
          departmentId: this.generateId(),
          teamId: this.generateId(),
          department: departmentName,
          team: teamName
        });
      }
    }
    
    return result;
  }
  
  private transformProjects(projects: any, departmentName: string): any[] {
    const result = [];
    
    for (const [teamName, projectList] of Object.entries(projects)) {
      for (const project of projectList) {
        result.push({
          id: this.generateId(),
          name: project,
          departmentId: this.generateId(),
          assignedTeamIds: [this.generateId()],
          department: departmentName,
          team: teamName
        });
      }
    }
    
    return result;
  }
  
  private calculateAggregatedMetrics(salesData: any[]): any {
    let totalRevenue = 0;
    let totalUnits = 0;
    
    for (const period of salesData) {
      for (const [product, sales] of Object.entries(period.productSales)) {
        totalRevenue += sales.quantity * sales.price;
        totalUnits += sales.quantity;
      }
    }
    
    return {
      totalRevenue,
      totalUnits,
      averageOrderValue: totalRevenue / totalUnits
    };
  }
  
  private createTimeSeries(salesData: any[]): any[] {
    return salesData.map(period => ({
      timestamp: this.parseTimePeriod(period.timePeriod),
      metrics: {
        revenue: this.calculatePeriodRevenue(period.productSales),
        units: this.calculatePeriodUnits(period.productSales),
        customers: period.customerMetrics
      }
    }));
  }
  
  private calculateTrends(timeSeries: any[]): any {
    // Simple trend calculation
    return {
      revenue: 'increasing',
      units: 'stable',
      customers: 'improving'
    };
  }
  
  private parseTimePeriod(period: string): string {
    const [year, quarter] = period.split('-');
    const quarterMap = { Q1: '01-01', Q2: '04-01', Q3: '07-01', Q4: '10-01' };
    return `${year}-${quarterMap[quarter]}T00:00:00Z`;
  }
  
  private calculatePeriodRevenue(productSales: any): number {
    let revenue = 0;
    for (const [product, sales] of Object.entries(productSales)) {
      revenue += sales.quantity * sales.price;
    }
    return revenue;
  }
  
  private calculatePeriodUnits(productSales: any): number {
    let units = 0;
    for (const [product, sales] of Object.entries(productSales)) {
      units += sales.quantity;
    }
    return units;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class SchemaValidator {
  async validate(data: any, schema: any): Promise<any> {
    // Simple schema validation - in real implementation, use ajv or similar
    const errors = [];
    
    if (schema.required) {
      for (const field of schema.required) {
        if (data[field] === undefined) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

## Key Learning Points

### Complex Data Table Patterns

1. **Multi-Dimensional Structure**: Use semicolons and colons to separate nested data levels
2. **Type-Aware Parsing**: Implement parsers that handle different data types automatically
3. **Conditional Data**: Handle optional fields and conditional requirements
4. **Validation Integration**: Combine data transformation with validation rules

### Data Transformation Best Practices

1. **Separation of Concerns**: Keep parsing, transformation, and validation separate
2. **Reusable Utilities**: Create shared transformation functions
3. **Error Handling**: Provide clear error messages for data issues
4. **Type Safety**: Use TypeScript interfaces for complex data structures

### Advanced Table Techniques

1. **Nested Objects**: Represent hierarchical data in flat table format
2. **Array Handling**: Use delimiters to represent array values
3. **JSON Integration**: Mix table data with JSON for complex structures
4. **Dynamic Fields**: Handle variable field structures

## Common Patterns and Solutions

### Complex Product Variants
```gherkin
| variants                                  |
| size:S,M,L;color:red,blue;material:cotton |
```

### Nested Configuration
```gherkin
| field_group | data                                    |
| personal    | name:John,email:john@test.com,age:30   |
| address     | street:123 Main,city:Boston,state:MA   |
```

### Conditional Validation
```gherkin
| required_if     | data                    |
| shipping_needed | address:123 Main St     |
| paid_service    | payment:credit_card     |
```

## Summary

This example demonstrates sophisticated data handling techniques that enable you to work with complex business scenarios while maintaining clean, readable Gherkin syntax. The patterns shown here scale well for enterprise applications and provide the foundation for comprehensive test automation.

Key takeaways:
- Structure complex data using consistent delimiter patterns
- Implement robust data transformation utilities
- Combine table data with JSON for maximum flexibility
- Use validation schemas to ensure data integrity
- Design reusable transformation components

## Next Steps

- Explore [Example 03: Advanced Tagging and Organization](./03-advanced-tagging-and-organization.md)
- Practice implementing similar data transformation patterns
- Experiment with different table structures and formats
- Consider how these techniques apply to your domain-specific data requirements