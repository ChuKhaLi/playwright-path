# Example 03: Doc Strings and Content Processing

## Overview

This example demonstrates advanced content processing techniques using Cucumber doc strings. You'll learn to handle multi-line content, process JSON payloads, implement template processing with variable substitution, and create robust content validation strategies for complex BDD scenarios.

### **Learning Focus**
- Handle multi-line content through doc strings effectively
- Process JSON payloads within BDD scenarios with type safety
- Implement template processing with variable substitution patterns
- Create robust content validation and error handling strategies
- Apply content-type specific processing for different data formats

---

## Scenario: API Testing and Content Management

### **Feature File: Doc String Processing**

```gherkin
# features/doc-strings-content-processing.feature
Feature: Doc Strings and Content Processing
  As a test automation engineer
  I want to handle complex multi-line content through doc strings
  So that I can test APIs, templates, and content management systems effectively

  Background:
    Given the content management system is running
    And I have API access credentials
    And the email service is available
    And the template engine is initialized

  Scenario: API Request with JSON Payload
    Given I am testing the user creation API
    When I send a POST request to "/api/users" with the following payload:
      """
      {
        "user": {
          "personalInfo": {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "dateOfBirth": "1990-05-15"
          },
          "accountSettings": {
            "username": "johndoe",
            "preferredLanguage": "en-US",
            "timezone": "America/New_York",
            "notifications": {
              "email": true,
              "sms": false,
              "push": true
            }
          },
          "permissions": ["read", "write"],
          "metadata": {
            "source": "automated_test",
            "createdBy": "test_suite",
            "tags": ["new_user", "premium"]
          }
        }
      }
      """
    Then the response status should be 201
    And the response should contain the created user information
    And the user should be stored in the database correctly

  Scenario: Email Template Processing
    Given I am testing the email template system
    When I create an email template with the following content:
      """
      Subject: Welcome to {{companyName}}, {{customerFirstName}}!
      
      Dear {{customerFirstName}} {{customerLastName}},
      
      Thank you for joining {{companyName}}! We're excited to have you as our newest {{membershipLevel}} member.
      
      Here are your account details:
      - Username: {{username}}
      - Account ID: {{accountId}}
      - Membership Level: {{membershipLevel}}
      - Registration Date: {{registrationDate}}
      
      Your benefits include:
      {{#benefits}}
      - {{name}}: {{description}}
      {{/benefits}}
      
      Next Steps:
      1. Complete your profile at {{profileUrl}}
      2. Download our mobile app: {{appDownloadUrl}}
      3. Join our community forum: {{forumUrl}}
      
      If you have any questions, please don't hesitate to contact our support team at {{supportEmail}} or call {{supportPhone}}.
      
      Welcome aboard!
      
      Best regards,
      The {{companyName}} Team
      
      ---
      This email was sent to {{customerEmail}}. If you didn't create this account, please contact us immediately.
      Unsubscribe: {{unsubscribeUrl}}
      """
    And I populate the template with the following customer data:
      | Field              | Value                                    |
      | customerFirstName  | Sarah                                    |
      | customerLastName   | Johnson                                  |
      | customerEmail      | sarah.johnson@example.com                |
      | companyName        | TechCorp Solutions                       |
      | username           | sarah.johnson                            |
      | accountId          | ACC-2024-001234                          |
      | membershipLevel    | Premium                                  |
      | registrationDate   | January 15, 2024                         |
      | profileUrl         | https://app.techcorp.com/profile         |
      | appDownloadUrl     | https://app.techcorp.com/download        |
      | forumUrl           | https://community.techcorp.com           |
      | supportEmail       | support@techcorp.com                     |
      | supportPhone       | 1-800-TECH-HELP                         |
      | unsubscribeUrl     | https://app.techcorp.com/unsubscribe/123 |
    Then the email should be generated with all variables populated
    And the email should be ready for delivery
    And the template should be stored for reuse

  Scenario: HTML Content Validation
    Given I am testing the content management system
    When I create a blog post with the following HTML content:
      """
      <article class="blog-post">
        <header>
          <h1>Getting Started with Test Automation</h1>
          <div class="meta">
            <span class="author">By John Smith</span>
            <time datetime="2024-01-15T10:00:00Z">January 15, 2024</time>
            <div class="tags">
              <span class="tag">automation</span>
              <span class="tag">testing</span>
              <span class="tag">best-practices</span>
            </div>
          </div>
        </header>
        
        <section class="content">
          <p>Test automation is a critical component of modern software development. It enables teams to:</p>
          
          <ul>
            <li><strong>Increase Efficiency:</strong> Automated tests run faster than manual tests</li>
            <li><strong>Improve Coverage:</strong> More scenarios can be tested consistently</li>
            <li><strong>Reduce Errors:</strong> Eliminates human error from repetitive testing</li>
            <li><strong>Enable CI/CD:</strong> Supports continuous integration and deployment</li>
          </ul>
          
          <blockquote>
            "The best time to start test automation was yesterday. The second best time is now."
            <cite>— Anonymous QA Engineer</cite>
          </blockquote>
          
          <h2>Key Principles</h2>
          <ol>
            <li>Start with clear requirements</li>
            <li>Design maintainable test architectures</li>
            <li>Implement proper error handling</li>
            <li>Monitor and optimize performance</li>
          </ol>
          
          <div class="code-example">
            <pre><code class="language-typescript">
      // Example test automation code
      describe('User Authentication', () => {
        it('should login successfully with valid credentials', async () => {
          await loginPage.login('user@example.com', 'password123');
          expect(await dashboardPage.isVisible()).toBe(true);
        });
      });
            </code></pre>
          </div>
        </section>
        
        <footer>
          <div class="social-share">
            <a href="#" class="share-twitter">Share on Twitter</a>
            <a href="#" class="share-linkedin">Share on LinkedIn</a>
          </div>
        </footer>
      </article>
      """
    Then the HTML content should be validated for proper structure
    And all required meta tags should be present
    And the content should be safe for publication
    And SEO optimization should be verified

  Scenario: Configuration File Processing
    Given I am testing the system configuration
    When I update the application configuration with the following YAML content:
      """
      application:
        name: "E-commerce Platform"
        version: "2.1.0"
        environment: "production"
        
      server:
        host: "0.0.0.0"
        port: 8080
        ssl:
          enabled: true
          certificate: "/path/to/cert.pem"
          privateKey: "/path/to/private.key"
          
      database:
        primary:
          host: "db-primary.example.com"
          port: 5432
          name: "ecommerce_prod"
          username: "app_user"
          password: "${DB_PASSWORD}"
          ssl: true
          maxConnections: 100
        replica:
          host: "db-replica.example.com"
          port: 5432
          name: "ecommerce_prod"
          username: "readonly_user"
          password: "${DB_REPLICA_PASSWORD}"
          ssl: true
          maxConnections: 50
          
      cache:
        redis:
          host: "redis.example.com"
          port: 6379
          password: "${REDIS_PASSWORD}"
          database: 0
          ttl: 3600
          
      logging:
        level: "info"
        outputs:
          - type: "file"
            path: "/var/log/app.log"
            maxSize: "100MB"
            maxBackups: 10
          - type: "console"
            format: "json"
            
      features:
        paymentGateway: true
        realTimeNotifications: true
        advancedAnalytics: false
        betaFeatures: false
        
      monitoring:
        metrics:
          enabled: true
          endpoint: "/metrics"
        healthCheck:
          enabled: true
          endpoint: "/health"
          interval: 30
          
      security:
        jwt:
          secret: "${JWT_SECRET}"
          expirationTime: "24h"
        cors:
          allowedOrigins:
            - "https://app.example.com"
            - "https://admin.example.com"
          allowedMethods: ["GET", "POST", "PUT", "DELETE"]
          allowCredentials: true
      """
    Then the configuration should be parsed successfully
    And all environment variables should be resolved
    And the configuration should be validated against the schema
    And security settings should be verified

  Scenario: SQL Query Generation and Validation
    Given I am testing the database query builder
    When I generate a complex SQL query with the following structure:
      """
      WITH recent_orders AS (
        SELECT 
          o.order_id,
          o.customer_id,
          o.order_date,
          o.total_amount,
          o.status,
          ROW_NUMBER() OVER (PARTITION BY o.customer_id ORDER BY o.order_date DESC) as rn
        FROM orders o
        WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
          AND o.status IN ('completed', 'processing', 'shipped')
      ),
      customer_stats AS (
        SELECT 
          c.customer_id,
          c.first_name,
          c.last_name,
          c.email,
          c.registration_date,
          COUNT(ro.order_id) as recent_order_count,
          SUM(ro.total_amount) as recent_total_spent,
          AVG(ro.total_amount) as avg_order_value,
          MAX(ro.order_date) as last_order_date
        FROM customers c
        LEFT JOIN recent_orders ro ON c.customer_id = ro.customer_id
        WHERE c.status = 'active'
          AND c.registration_date >= CURRENT_DATE - INTERVAL '1 year'
        GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.registration_date
      )
      SELECT 
        cs.customer_id,
        cs.first_name,
        cs.last_name,
        cs.email,
        cs.registration_date,
        cs.recent_order_count,
        cs.recent_total_spent,
        cs.avg_order_value,
        cs.last_order_date,
        CASE 
          WHEN cs.recent_total_spent >= 1000 THEN 'Premium'
          WHEN cs.recent_total_spent >= 500 THEN 'Gold'
          WHEN cs.recent_total_spent >= 100 THEN 'Silver'
          ELSE 'Bronze'
        END as customer_tier,
        EXTRACT(DAYS FROM (CURRENT_DATE - cs.last_order_date)) as days_since_last_order
      FROM customer_stats cs
      WHERE cs.recent_order_count > 0
      ORDER BY cs.recent_total_spent DESC, cs.last_order_date DESC
      LIMIT 100;
      """
    Then the SQL query should be syntactically correct
    And the query should be optimized for performance
    And all referenced tables and columns should exist
    And the query execution plan should be analyzed

  Scenario: Multi-language Content Processing
    Given I am testing the internationalization system
    When I create content translations with the following JSON structure:
      """
      {
        "content": {
          "welcome_message": {
            "en": "Welcome to our platform! We're excited to have you here.",
            "es": "¡Bienvenido a nuestra plataforma! Estamos emocionados de tenerte aquí.",
            "fr": "Bienvenue sur notre plateforme ! Nous sommes ravis de vous avoir ici.",
            "de": "Willkommen auf unserer Plattform! Wir freuen uns, Sie hier zu haben.",
            "ja": "私たちのプラットフォームへようこそ！あなたがここにいることを嬉しく思います。",
            "zh": "欢迎来到我们的平台！我们很高兴您能来到这里。"
          },
          "navigation": {
            "home": {
              "en": "Home",
              "es": "Inicio",
              "fr": "Accueil",
              "de": "Startseite",
              "ja": "ホーム",
              "zh": "首页"
            },
            "products": {
              "en": "Products",
              "es": "Productos",
              "fr": "Produits",
              "de": "Produkte",
              "ja": "製品",
              "zh": "产品"
            },
            "about": {
              "en": "About Us",
              "es": "Acerca de Nosotros",
              "fr": "À Propos",
              "de": "Über Uns",
              "ja": "会社概要",
              "zh": "关于我们"
            },
            "contact": {
              "en": "Contact",
              "es": "Contacto",
              "fr": "Contact",
              "de": "Kontakt",
              "ja": "お問い合わせ",
              "zh": "联系我们"
            }
          },
          "errors": {
            "validation_required": {
              "en": "This field is required",
              "es": "Este campo es obligatorio",
              "fr": "Ce champ est obligatoire",
              "de": "Dieses Feld ist erforderlich",
              "ja": "この項目は必須です",
              "zh": "此字段为必填项"
            },
            "email_invalid": {
              "en": "Please enter a valid email address",
              "es": "Por favor ingrese una dirección de correo válida",
              "fr": "Veuillez saisir une adresse e-mail valide",
              "de": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
              "ja": "有効なメールアドレスを入力してください",
              "zh": "请输入有效的电子邮件地址"
            }
          }
        },
        "metadata": {
          "version": "1.2.0",
          "lastUpdated": "2024-01-15T10:30:00Z",
          "supportedLanguages": ["en", "es", "fr", "de", "ja", "zh"],
          "defaultLanguage": "en"
        }
      }
      """
    Then all language translations should be processed correctly
    And each language should have complete translations
    And missing translations should be identified
    And the content should be ready for deployment
```

---

## Step Definitions: Advanced Content Processing

### **JSON Payload Processing**

```typescript
// support/step-definitions/doc-strings.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world';

// User creation payload interface
interface UserCreationPayload {
  user: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth: string;
    };
    accountSettings: {
      username: string;
      preferredLanguage: string;
      timezone: string;
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
    };
    permissions: string[];
    metadata: {
      source: string;
      createdBy: string;
      tags: string[];
    };
  };
}

// API request with JSON payload
When('I send a POST request to {string} with the following payload:', 
  async function (this: CustomWorld, endpoint: string, jsonPayload: string) {
    try {
      // Parse and validate JSON structure
      const payload: UserCreationPayload = JSON.parse(jsonPayload);
      
      // Comprehensive validation
      this.validateUserPayload(payload);
      
      // Send API request
      const response = await this.apiService.post(endpoint, payload);
      
      // Store response for later verification
      this.lastApiResponse = response;
      this.testData.sentPayload = payload;
      
      console.log(`✓ POST request sent to ${endpoint}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response size: ${JSON.stringify(response.data).length} bytes`);
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON payload: ${error.message}`);
      }
      throw new Error(`Failed to send API request: ${error.message}`);
    }
  }
);

// JSON validation helper method
CustomWorld.prototype.validateUserPayload = function(payload: UserCreationPayload): void {
  const errors: string[] = [];
  
  // Personal info validation
  if (!payload.user?.personalInfo?.firstName?.trim()) {
    errors.push('First name is required');
  }
  
  if (!payload.user?.personalInfo?.lastName?.trim()) {
    errors.push('Last name is required');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.user?.personalInfo?.email || '')) {
    errors.push(`Invalid email format: ${payload.user?.personalInfo?.email}`);
  }
  
  // Date validation
  const birthDate = new Date(payload.user?.personalInfo?.dateOfBirth);
  if (isNaN(birthDate.getTime())) {
    errors.push(`Invalid date of birth: ${payload.user?.personalInfo?.dateOfBirth}`);
  }
  
  // Username validation
  if (!payload.user?.accountSettings?.username?.trim()) {
    errors.push('Username is required');
  }
  
  // Language validation
  const supportedLanguages = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'];
  if (!supportedLanguages.includes(payload.user?.accountSettings?.preferredLanguage)) {
    errors.push(`Unsupported language: ${payload.user?.accountSettings?.preferredLanguage}`);
  }
  
  // Permissions validation
  if (!Array.isArray(payload.user?.permissions) || payload.user.permissions.length === 0) {
    errors.push('At least one permission is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Payload validation failed:\n${errors.join('\n')}`);
  }
};

// Response verification
Then('the response status should be {int}', function (this: CustomWorld, expectedStatus: number) {
  expect(this.lastApiResponse.status).toBe(expectedStatus);
  console.log(`✓ Response status verified: ${expectedStatus}`);
});

Then('the response should contain the created user information', async function (this: CustomWorld) {
  const response = this.lastApiResponse;
  const sentPayload = this.testData.sentPayload as UserCreationPayload;
  
  // Verify response contains expected user data
  expect(response.data.user.personalInfo.firstName).toBe(sentPayload.user.personalInfo.firstName);
  expect(response.data.user.personalInfo.lastName).toBe(sentPayload.user.personalInfo.lastName);
  expect(response.data.user.personalInfo.email).toBe(sentPayload.user.personalInfo.email);
  expect(response.data.user.accountSettings.username).toBe(sentPayload.user.accountSettings.username);
  
  // Verify generated fields are present
  expect(response.data.user.id).toBeDefined();
  expect(response.data.user.createdAt).toBeDefined();
  expect(response.data.user.updatedAt).toBeDefined();
  
  console.log(`✓ User information verified in response`);
  console.log(`   User ID: ${response.data.user.id}`);
  console.log(`   Created: ${response.data.user.createdAt}`);
});
```

### **Email Template Processing**

```typescript
// Email template interface
interface EmailTemplate {
  subject: string;
  body: string;
  variables: string[];
  processedContent?: string;
}

interface CustomerData {
  [key: string]: string | string[];
}

// Template creation
When('I create an email template with the following content:', 
  async function (this: CustomWorld, templateContent: string) {
    try {
      // Parse template structure
      const lines = templateContent.split('\n');
      const subjectLine = lines.find(line => line.startsWith('Subject:'));
      
      if (!subjectLine) {
        throw new Error('Email template must include a Subject line');
      }
      
      const subject = subjectLine.replace('Subject:', '').trim();
      const bodyStartIndex = lines.findIndex(line => line.startsWith('Subject:')) + 1;
      const body = lines.slice(bodyStartIndex).join('\n').trim();
      
      // Extract template variables
      const variableMatches = templateContent.match(/\{\{(\w+)\}\}/g) || [];
      const variables = [...new Set(variableMatches.map(match => match.replace(/[{}]/g, '')))];
      
      // Extract conditional sections
      const conditionalMatches = templateContent.match(/\{\{#(\w+)\}\}(.*?)\{\{\/\1\}\}/gs) || [];
      const conditionals = conditionalMatches.map(match => {
        const sectionMatch = match.match(/\{\{#(\w+)\}\}(.*?)\{\{\/\1\}\}/s);
        return {
          variable: sectionMatch![1],
          content: sectionMatch![2]
        };
      });
      
      const emailTemplate: EmailTemplate = {
        subject,
        body,
        variables,
      };
      
      // Store template for processing
      this.testData.emailTemplate = emailTemplate;
      this.testData.templateConditionals = conditionals;
      
      console.log(`✓ Email template created`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Variables found: ${variables.length}`);
      console.log(`   Conditional sections: ${conditionals.length}`);
      
    } catch (error) {
      throw new Error(`Failed to create email template: ${error.message}`);
    }
  }
);

// Template population
When('I populate the template with the following customer data:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    const customerData = dataTable.rowsHash() as CustomerData;
    const emailTemplate = this.testData.emailTemplate as EmailTemplate;
    
    try {
      let populatedSubject = emailTemplate.subject;
      let populatedBody = emailTemplate.body;
      
      // Replace simple variables
      for (const [key, value] of Object.entries(customerData)) {
        const placeholder = `{{${key}}}`;
        const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
        
        populatedSubject = populatedSubject.replace(new RegExp(placeholder, 'g'), stringValue);
        populatedBody = populatedBody.replace(new RegExp(placeholder, 'g'), stringValue);
      }
      
      // Process conditional sections
      const conditionals = this.testData.templateConditionals || [];
      for (const conditional of conditionals) {
        const conditionData = customerData[conditional.variable];
        const fullCondition = `{{#${conditional.variable}}}${conditional.content}{{/${conditional.variable}}}`;
        
        if (conditionData) {
          // If data exists, render the conditional content
          let renderedContent = conditional.content;
          
          if (Array.isArray(conditionData)) {
            // Handle array data (e.g., benefits list)
            renderedContent = conditionData.map(item => {
              if (typeof item === 'object') {
                let itemContent = conditional.content;
                for (const [itemKey, itemValue] of Object.entries(item)) {
                  itemContent = itemContent.replace(new RegExp(`{{${itemKey}}}`, 'g'), String(itemValue));
                }
                return itemContent;
              }
              return conditional.content.replace(/\{\{\w+\}\}/g, String(item));
            }).join('');
          }
          
          populatedBody = populatedBody.replace(fullCondition, renderedContent);
        } else {
          // Remove conditional section if no data
          populatedBody = populatedBody.replace(fullCondition, '');
        }
      }
      
      // Validate all variables were replaced
      const remainingVariables = populatedBody.match(/\{\{\w+\}\}/g) || [];
      if (remainingVariables.length > 0) {
        console.warn(`Warning: Unreplaced variables found: ${remainingVariables.join(', ')}`);
      }
      
      // Store processed content
      emailTemplate.processedContent = populatedBody;
      this.testData.populatedEmailSubject = populatedSubject;
      this.testData.customerData = customerData;
      
      console.log(`✓ Template populated with customer data`);
      console.log(`   Customer: ${customerData.customerFirstName} ${customerData.customerLastName}`);
      console.log(`   Email: ${customerData.customerEmail}`);
      console.log(`   Unreplaced variables: ${remainingVariables.length}`);
      
    } catch (error) {
      throw new Error(`Failed to populate email template: ${error.message}`);
    }
  }
);

// Template verification
Then('the email should be generated with all variables populated', 
  async function (this: CustomWorld) {
    const emailTemplate = this.testData.emailTemplate as EmailTemplate;
    const populatedSubject = this.testData.populatedEmailSubject as string;
    const customerData = this.testData.customerData as CustomerData;
    
    // Verify subject is populated
    expect(populatedSubject).toBeDefined();
    expect(populatedSubject).not.toContain('{{');
    expect(populatedSubject).toContain(customerData.customerFirstName as string);
    expect(populatedSubject).toContain(customerData.companyName as string);
    
    // Verify body is populated
    expect(emailTemplate.processedContent).toBeDefined();
    expect(emailTemplate.processedContent).not.toContain('{{');
    expect(emailTemplate.processedContent).toContain(customerData.customerFirstName as string);
    expect(emailTemplate.processedContent).toContain(customerData.customerEmail as string);
    
    console.log(`✓ Email template fully populated and validated`);
  }
);

Then('the template should be stored for reuse', async function (this: CustomWorld) {
  const emailTemplate = this.testData.emailTemplate as EmailTemplate;
  
  // Store template in template service
  const templateId = await this.templateService.saveTemplate({
    name: 'user_welcome_email',
    subject: emailTemplate.subject,
    body: emailTemplate.body,
    variables: emailTemplate.variables,
    category: 'user_onboarding'
  });
  
  expect(templateId).toBeDefined();
  this.testData.savedTemplateId = templateId;
  
  console.log(`✓ Template saved with ID: ${templateId}`);
});
```

### **HTML Content Validation**

```typescript
// HTML content processing
When('I create a blog post with the following HTML content:', 
  async function (this: CustomWorld, htmlContent: string) {
    try {
      // Basic HTML structure validation
      const htmlValidator = new HTMLValidator();
      const validationResult = htmlValidator.validate(htmlContent);
      
      if (!validationResult.isValid) {
        throw new Error(`HTML validation failed: ${validationResult.errors.join(', ')}`);
      }
      
      // Extract metadata from HTML
      const metadata = this.extractHTMLMetadata(htmlContent);
      
      // Store content and metadata
      this.testData.htmlContent = htmlContent;
      this.testData.htmlMetadata = metadata;
      
      // Create blog post via API
      const blogPost = await this.contentService.createBlogPost({
        title: metadata.title,
        content: htmlContent,
        author: metadata.author,
        publishDate: metadata.publishDate,
        tags: metadata.tags
      });
      
      this.testData.createdBlogPost = blogPost;
      
      console.log(`✓ Blog post created: "${metadata.title}"`);
      console.log(`   Author: ${metadata.author}`);
      console.log(`   Tags: ${metadata.tags.join(', ')}`);
      console.log(`   Content length: ${htmlContent.length} characters`);
      
    } catch (error) {
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
  }
);

// HTML metadata extraction helper
CustomWorld.prototype.extractHTMLMetadata = function(htmlContent: string) {
  const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const authorMatch = htmlContent.match(/<span class="author"[^>]*>By ([^<]+)<\/span>/i);
  const timeMatch = htmlContent.match(/<time datetime="([^"]+)"[^>]*>/i);
  const tagMatches = htmlContent.match(/<span class="tag"[^>]*>([^<]+)<\/span>/gi) || [];
  
  return {
    title: titleMatch ? titleMatch[1].trim() : 'Untitled',
    author: authorMatch ? authorMatch[1].trim() : 'Anonymous',
    publishDate: timeMatch ? new Date(timeMatch[1]) : new Date(),
    tags: tagMatches.map(tag => tag.replace(/<[^>]+>/g, '').trim())
  };
};

// HTML validation class
class HTMLValidator {
  validate(htmlContent: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for required elements
    if (!htmlContent.includes('<article')) {
      errors.push('Article element is required');
    }
    
    if (!htmlContent.includes('<h1')) {
      errors.push('H1 heading is required');
    }
    
    if (!htmlContent.includes('class="meta"')) {
      errors.push('Meta information section is required');
    }
    
    // Check for balanced tags
    const tagRegex = /<(\/?[\w-]+)[^>]*>/g;
    const tags: string[] = [];
    let match;
    
    while ((match = tagRegex.exec(htmlContent)) !== null) {
      const tagName = match[1].toLowerCase();
      if (tagName.startsWith('/')) {
        const openTag = tagName.substring(1);
        const lastOpenIndex = tags.lastIndexOf(openTag);
        if (lastOpenIndex === -1) {
          errors.push(`Unmatched closing tag: ${tagName}`);
        } else {
          tags.splice(lastOpenIndex, 1);
        }
      } else if (!['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName)) {
        tags.push(tagName);
      }
    }
    
    if (tags.length > 0) {
      errors.push(`Unclosed tags: ${tags.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// HTML content verification
Then('the HTML content should be validated for proper structure', 
  function (this: CustomWorld) {
    const htmlContent = this.testData.htmlContent as string;
    const validator = new HTMLValidator();
    const result = validator.validate(htmlContent);
    
    expect(result.isValid).toBe(true);
    
    if (!result.isValid) {
      throw new Error(`HTML validation failed: ${result.errors.join(', ')}`);
    }
    
    console.log(`✓ HTML content structure validated successfully`);
  }
);

Then('all required meta tags should be present', function (this: CustomWorld) {
  const metadata = this.testData.htmlMetadata;
  
  expect(metadata.title).toBeTruthy();
  expect(metadata.author).toBeTruthy();
  expect(metadata.publishDate).toBeInstanceOf(Date);
  expect(metadata.tags.length).toBeGreaterThan(0);
  
  console.log(`✓ All required meta tags present`);
  console.log(`   Title: ${metadata.title}`);
  console.log(`   Author: ${metadata.author}`);
  console.log(`   Tags: ${metadata.tags.join(', ')}`);
});
```

### **Configuration File Processing**

```typescript
import * as yaml from 'js-yaml';

// Configuration interface
interface ApplicationConfig {
  application: {
    name: string;
    version: string;
    environment: string;
  };
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      certificate: string;
      privateKey: string;
    };
  };
  database: {
    primary: DatabaseConfig;
    replica: DatabaseConfig;
  };
  cache: {
    redis: RedisConfig;
  };
  logging: LoggingConfig;
  features: Record<string, boolean>;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
}

interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
}

// YAML configuration processing
When('I update the application configuration with the following YAML content:', 
  async function (this: CustomWorld, yamlContent: string) {
    try {
      // Parse YAML content
      const config = yaml.load(yamlContent) as ApplicationConfig;
      
      // Validate configuration structure
      this.validateApplicationConfig(config);
      
      // Resolve environment variables
      const resolvedConfig = this.resolveEnvironmentVariables(config);
      
      // Apply configuration
      await this.configService.updateConfiguration(resolvedConfig);
      
      // Store for verification
      this.testData.applicationConfig = resolvedConfig;
      this.testData.originalYaml = yamlContent;
      
      console.log(`✓ Configuration updated successfully`);
      console.log(`   Application: ${config.application.name} v${config.application.version}`);
      console.log(`   Environment: ${config.application.environment}`);
      console.log(`   Features enabled: ${Object.entries(config.features).filter(([_, enabled]) => enabled).length}`);
      
    } catch (error) {
      if (error instanceof yaml.YAMLException) {
        throw new Error(`YAML parsing failed: ${error.message}`);
      }
      throw new Error(`Configuration update failed: ${error.message}`);
    }
  }
);

// Configuration validation helper
CustomWorld.prototype.validateApplicationConfig = function(config: ApplicationConfig): void {
  const errors: string[] = [];
  
  // Application validation
  if (!config.application?.name?.trim()) {
    errors.push('Application name is required');
  }
  
  if (!config.application?.version?.trim()) {
    errors.push('Application version is required');
  }
  
  // Server validation
  if (!config.server?.host?.trim()) {
    errors.push('Server host is required');
  }
  
  if (!config.server?.port || config.server.port < 1 || config.server.port > 65535) {
    errors.push('Valid server port (1-65535) is required');
  }
  
  // Database validation
  if (!config.database?.primary?.host?.trim()) {
    errors.push('Primary database host is required');
  }
  
  if (!config.database?.primary?.name?.trim()) {
    errors.push('Primary database name is required');
  }
  
  // Security validation
  if (!config.security?.jwt?.secret?.trim()) {
    errors.push('JWT secret is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
};

// Environment variables resolution
CustomWorld.prototype.resolveEnvironmentVariables = function(config: any): any {
  const resolved = JSON.parse(JSON.stringify(config));
  const envVarRegex = /\$\{([^}]+)\}/g;
  
  const resolveValue = (value: any): any => {
    if (typeof value === 'string') {
      return value.replace(envVarRegex, (match, envVar) => {
        const envValue = process.env[envVar];
        if (envValue === undefined) {
          console.warn(`Environment variable ${envVar} not found, keeping placeholder`);
          return match;
        }
        return envValue;
      });
    } else if (typeof value === 'object' && value !== null) {
      const resolvedObj: any = Array.isArray(value) ? [] : {};
      for (const [key, val] of Object.entries(value)) {
        resolvedObj[key] = resolveValue(val);
      }
      return resolvedObj;
    }
    return value;
  };
  
  return resolveValue(resolved);
};

// Configuration verification
Then('the configuration should be parsed successfully', function (this: CustomWorld) {
  const config = this.testData.applicationConfig as ApplicationConfig;
  
  expect(config).toBeDefined();
  expect(config.application).toBeDefined();
  expect(config.server).toBeDefined();
  expect(config.database).toBeDefined();
  
  console.log(`✓ Configuration parsed and structured correctly`);
});

Then('all environment variables should be resolved', function (this: CustomWorld) {
  const config = this.testData.applicationConfig as ApplicationConfig;
  const configString = JSON.stringify(config);
  
  // Check for unresolved environment variables
  const unresolvedVars = configString.match(/\$\{[^}]+\}/g) || [];
  
  if (unresolvedVars.length > 0) {
    console.warn(`Warning: Unresolved environment variables: ${unresolvedVars.join(', ')}`);
  }
  
  // Verify critical variables are resolved (those that should have test values)
  expect(config.database.primary.password).not.toContain('${');
  expect(config.security.jwt.secret).not.toContain('${');
  
  console.log(`✓ Environment variables resolved (${unresolvedVars.length} warnings)`);
});

Then('security settings should be verified', function (this: CustomWorld) {
  const config = this.testData.applicationConfig as ApplicationConfig;
  
  // Verify SSL is enabled in production
  if (config.application.environment === 'production') {
    expect(config.server.ssl.enabled).toBe(true);
  }
  
  // Verify CORS settings
  expect(config.security.cors.allowedOrigins).toBeDefined();
  expect(config.security.cors.allowedOrigins.length).toBeGreaterThan(0);
  
  // Verify JWT configuration
  expect(config.security.jwt.secret).toBeTruthy();
  expect(config.security.jwt.expirationTime).toBeTruthy();
  
  console.log(`✓ Security settings verified`);
});
```

---

## Advanced Content Processing Patterns

### **Multi-language Content Processing**

```typescript
// Translation content interface
interface TranslationContent {
  content: Record<string, Record<string, string>>;
  metadata: {
    version: string;
    lastUpdated: string;
    supportedLanguages: string[];
    defaultLanguage: string;
  };
}

// Multi-language content processing
When('I create content translations with the following JSON structure:', 
  async function (this: CustomWorld, jsonContent: string) {
    try {
      const translations: TranslationContent = JSON.parse(jsonContent);
      
      // Validate translation structure
      this.validateTranslations(translations);
      
      // Process translations
      await this.translationService.updateTranslations(translations);
      
      // Store for verification
      this.testData.translations = translations;
      
      const totalKeys = Object.keys(translations.content).length;
      const languages = translations.metadata.supportedLanguages;
      
      console.log(`✓ Translations processed successfully`);
      console.log(`   Translation keys: ${totalKeys}`);
      console.log(`   Supported languages: ${languages.join(', ')}`);
      
    } catch (error) {
      throw new Error(`Translation processing failed: ${error.message}`);
    }
  }
);

// Translation validation helper
CustomWorld.prototype.validateTranslations = function(translations: TranslationContent): void {
  const errors: string[] = [];
  const supportedLanguages = translations.metadata.supportedLanguages;
  
  // Validate each content section
  for (const [sectionKey, section] of Object.entries(translations.content)) {
    if (typeof section !== 'object') {
      errors.push(`Section ${sectionKey} must be an object`);
      continue;
    }
    
    // Check each translation key
    for (const [translationKey, translations] of Object.entries(section)) {
      if (typeof translations !== 'object') {
        errors.push(`Translation ${sectionKey}.${translationKey} must be an object`);
        continue;
      }
      
      // Verify all supported languages have translations
      for (const language of supportedLanguages) {
        if (!translations[language]) {
          errors.push(`Missing ${language} translation for ${sectionKey}.${translationKey}`);
        }
      }
      
      // Check for extra languages not in supported list
      for (const language of Object.keys(translations)) {
        if (!supportedLanguages.includes(language)) {
          errors.push(`Unsupported language ${language} found in ${sectionKey}.${translationKey}`);
        }
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Translation validation failed:\n${errors.join('\n')}`);
  }
};

// Translation verification
Then('all language translations should be processed correctly', 
  function (this: CustomWorld) {
    const translations = this.testData.translations as TranslationContent;
    
    expect(translations.content).toBeDefined();
    expect(Object.keys(translations.content).length).toBeGreaterThan(0);
    
    console.log(`✓ All translations processed correctly`);
  }
);

Then('each language should have complete translations', function (this: CustomWorld) {
  const translations = this.testData.translations as TranslationContent;
  const supportedLanguages = translations.metadata.supportedLanguages;
  
  let missingTranslations = 0;
  
  for (const [sectionKey, section] of Object.entries(translations.content)) {
    for (const [translationKey, translationData] of Object.entries(section)) {
      for (const language of supportedLanguages) {
        if (!translationData[language]) {
          missingTranslations++;
          console.warn(`Missing ${language} translation: ${sectionKey}.${translationKey}`);
        }
      }
    }
  }
  
  expect(missingTranslations).toBe(0);
  
  console.log(`✓ Complete translations verified for all ${supportedLanguages.length} languages`);
});

Then('missing translations should be identified', async function (this: CustomWorld) {
  const translations = this.testData.translations as TranslationContent;
  
  // Generate translation coverage report
  const coverageReport = await this.translationService.generateCoverageReport(translations);
  
  this.testData.translationCoverage = coverageReport;
  
  console.log(`✓ Translation coverage report generated`);
  console.log(`   Overall coverage: ${coverageReport.overallCoverage}%`);
  console.log(`   Missing translations: ${coverageReport.missingCount}`);
});
```

---

## Summary

This example demonstrates sophisticated content processing techniques using Cucumber doc strings:

**Key Techniques Mastered:**
- **JSON Payload Processing**: Complex API request/response handling with type safety
- **Template Processing**: Email template creation with variable substitution and conditional logic
- **HTML Content Validation**: Structure validation, metadata extraction, and SEO optimization
- **Configuration Management**: YAML parsing, environment variable resolution, and validation
- **Multi-language Content**: Translation processing with completeness verification

**Professional Patterns Applied:**
- Comprehensive validation strategies for different content types
- Error handling with detailed context and recovery mechanisms
- Type-safe processing with TypeScript interfaces
- Content-specific validation rules and business logic
- Template processing with conditional rendering capabilities

**Real-world Applications:**
- API testing with complex JSON payloads and nested data structures
- Email marketing systems with dynamic template processing
- Content management systems with rich HTML validation
- Configuration management for enterprise applications
- Internationalization systems with multi-language support

These doc string processing patterns enable sophisticated content handling while maintaining the business-readable nature of BDD scenarios, providing powerful capabilities for testing complex content-driven applications.

**Next Example**: [Custom Parameters and External Data](./04-custom-parameters-and-external-data.md) - Learn advanced custom parameter types and external data source integration.