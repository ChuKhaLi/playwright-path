# Exercise 03: Content Processing Challenge

## Objective

Master advanced doc string and multi-line content processing techniques in Cucumber by implementing sophisticated step definitions that handle JSON configuration, XML documents, email templates, and complex configuration files with dynamic variable substitution. This challenge focuses on building enterprise-grade content processing capabilities for real-world testing scenarios.

### **Learning Goals**
- Process complex JSON configuration data with schema validation
- Handle XML document parsing and manipulation with namespace support
- Implement email template processing with dynamic variable substitution
- Create configuration file processing with environment variable integration
- Develop content validation and transformation pipelines
- Build reusable content processing utilities for enterprise testing environments

---

## Challenge Scenario: Multi-System Integration Platform

You're testing a comprehensive enterprise integration platform that processes various content formats including JSON configurations, XML documents, email templates, and system configuration files. The platform must handle complex content validation, transformation, and dynamic variable substitution across multiple environments.

---

## Part A: JSON Configuration Processing

### **Feature File: JSON Configuration Management**

Create advanced scenarios demonstrating JSON content processing:

```gherkin
# features/content-processing-challenge.feature
Feature: Content Processing Challenge
  As a test automation engineer
  I want to master content processing techniques
  So that I can handle complex content scenarios effectively in BDD testing

  Background:
    Given the integration platform is running
    And I have access to the content processing system
    And the configuration management interface is available
    And the template engine is operational

  Scenario: JSON Configuration Processing with Schema Validation
    Given I am configuring a new microservice deployment
    When I provide the following JSON configuration:
      """
      {
        "service": {
          "name": "user-authentication-service",
          "version": "2.1.0",
          "description": "Handles user authentication and authorization",
          "environment": "production",
          "port": 8080,
          "health_check_endpoint": "/health",
          "metrics_endpoint": "/metrics"
        },
        "database": {
          "type": "postgresql",
          "host": "db.production.company.com",
          "port": 5432,
          "database": "auth_service_db",
          "username": "${DB_USERNAME}",
          "password": "${DB_PASSWORD}",
          "connection_pool": {
            "min_connections": 5,
            "max_connections": 20,
            "connection_timeout": 30000,
            "idle_timeout": 600000
          },
          "ssl": {
            "enabled": true,
            "certificate_path": "/etc/ssl/certs/db-cert.pem",
            "verify_ca": true
          }
        },
        "redis": {
          "host": "redis.production.company.com",
          "port": 6379,
          "password": "${REDIS_PASSWORD}",
          "database": 0,
          "connection_timeout": 5000,
          "retry_attempts": 3,
          "cluster": {
            "enabled": true,
            "nodes": [
              "redis-1.production.company.com:6379",
              "redis-2.production.company.com:6379",
              "redis-3.production.company.com:6379"
            ]
          }
        },
        "logging": {
          "level": "info",
          "format": "json",
          "outputs": ["stdout", "file"],
          "file": {
            "path": "/var/log/auth-service/app.log",
            "max_size": "100MB",
            "max_files": 10,
            "compress": true
          },
          "structured_logging": {
            "enabled": true,
            "correlation_id": true,
            "request_id": true,
            "user_context": true
          }
        },
        "security": {
          "jwt": {
            "secret": "${JWT_SECRET}",
            "expiration": 3600,
            "refresh_expiration": 86400,
            "algorithm": "HS256"
          },
          "rate_limiting": {
            "enabled": true,
            "requests_per_minute": 100,
            "burst_size": 20,
            "block_duration": 300
          },
          "cors": {
            "enabled": true,
            "allowed_origins": [
              "https://app.company.com",
              "https://admin.company.com"
            ],
            "allowed_methods": ["GET", "POST", "PUT", "DELETE"],
            "allowed_headers": ["Authorization", "Content-Type"],
            "max_age": 3600
          }
        },
        "monitoring": {
          "metrics": {
            "enabled": true,
            "interval": 30,
            "custom_metrics": [
              "auth_requests_total",
              "auth_failures_total",
              "token_generation_time",
              "database_connection_time"
            ]
          },
          "health_checks": {
            "database": {
              "enabled": true,
              "timeout": 5000,
              "interval": 30
            },
            "redis": {
              "enabled": true,
              "timeout": 3000,
              "interval": 15
            },
            "external_services": {
              "user_profile_service": {
                "url": "https://profiles.company.com/health",
                "timeout": 5000,
                "interval": 60
              }
            }
          }
        },
        "feature_flags": {
          "new_password_policy": true,
          "multi_factor_auth": true,
          "social_login": false,
          "account_lockout": true,
          "password_history": 5
        }
      }
      """
    Then the JSON configuration should be parsed successfully
    And all required fields should be validated
    And environment variables should be identified for substitution
    And the configuration schema should be validated
    And security settings should be verified
    And monitoring configuration should be enabled
    And feature flags should be processed correctly

  Scenario: JSON Configuration with Complex Nested Structures
    Given I am setting up a complex integration configuration
    When I provide the following nested JSON configuration:
      """
      {
        "integration_config": {
          "name": "enterprise-data-sync",
          "version": "3.0.0",
          "environments": {
            "development": {
              "api_base_url": "https://api-dev.company.com",
              "timeout": 30000,
              "retry_count": 3,
              "debug_mode": true
            },
            "staging": {
              "api_base_url": "https://api-staging.company.com",
              "timeout": 20000,
              "retry_count": 5,
              "debug_mode": false
            },
            "production": {
              "api_base_url": "https://api.company.com",
              "timeout": 10000,
              "retry_count": 10,
              "debug_mode": false
            }
          },
          "data_sources": [
            {
              "id": "crm_system",
              "type": "rest_api",
              "name": "Customer Relationship Management",
              "config": {
                "base_url": "${CRM_API_URL}",
                "auth": {
                  "type": "oauth2",
                  "client_id": "${CRM_CLIENT_ID}",
                  "client_secret": "${CRM_CLIENT_SECRET}",
                  "scope": "read:customers write:customers"
                },
                "endpoints": {
                  "customers": "/api/v2/customers",
                  "orders": "/api/v2/orders",
                  "products": "/api/v2/products"
                },
                "rate_limit": {
                  "requests_per_second": 10,
                  "burst_allowance": 20
                }
              }
            },
            {
              "id": "inventory_db",
              "type": "database",
              "name": "Inventory Management Database",
              "config": {
                "connection_string": "${INVENTORY_DB_CONNECTION}",
                "pool_size": 15,
                "query_timeout": 30000,
                "tables": {
                  "products": {
                    "primary_key": "product_id",
                    "indexed_fields": ["sku", "category", "brand"],
                    "sync_frequency": "real-time"
                  },
                  "inventory": {
                    "primary_key": "inventory_id",
                    "indexed_fields": ["product_id", "location", "quantity"],
                    "sync_frequency": "hourly"
                  }
                }
              }
            }
          ],
          "transformation_rules": {
            "customer_mapping": {
              "source_field": "customer_data.personal_info",
              "target_field": "unified_customer.profile",
              "transformations": [
                {
                  "type": "field_rename",
                  "mappings": {
                    "first_name": "firstName",
                    "last_name": "lastName",
                    "email_address": "email"
                  }
                },
                {
                  "type": "data_validation",
                  "rules": {
                    "email": {
                      "required": true,
                      "format": "email"
                    },
                    "firstName": {
                      "required": true,
                      "min_length": 1,
                      "max_length": 50
                    },
                    "lastName": {
                      "required": true,
                      "min_length": 1,
                      "max_length": 50
                    }
                  }
                }
              ]
            }
          }
        }
      }
      """
    Then the nested JSON configuration should be processed correctly
    And environment-specific settings should be extracted
    And data source configurations should be validated
    And transformation rules should be parsed successfully
    And all nested structures should maintain referential integrity
```

### **Task A1: Implement JSON Configuration Processing**

Create comprehensive step definitions for JSON content processing:

```typescript
// support/step-definitions/content-processing-challenge.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world';

// Interfaces for JSON processing
interface ServiceConfiguration {
  service: ServiceInfo;
  database: DatabaseConfig;
  redis: RedisConfig;
  logging: LoggingConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  feature_flags: Record<string, boolean | number>;
}

interface ServiceInfo {
  name: string;
  version: string;
  description: string;
  environment: string;
  port: number;
  health_check_endpoint: string;
  metrics_endpoint: string;
}

interface IntegrationConfiguration {
  integration_config: {
    name: string;
    version: string;
    environments: Record<string, EnvironmentConfig>;
    data_sources: DataSourceConfig[];
    transformation_rules: Record<string, TransformationRule>;
  };
}

// JSON Configuration Processing
When('I provide the following JSON configuration:', 
  async function (this: CustomWorld, jsonContent: string) {
    // TODO: Implement JSON configuration processing
    // Requirements:
    // 1. Parse JSON content with error handling
    // 2. Validate JSON schema structure
    // 3. Extract environment variables for substitution
    // 4. Validate required fields and data types
    // 5. Store parsed configuration for verification
    
    try {
      const configuration: ServiceConfiguration = JSON.parse(jsonContent);
      
      // Validate configuration structure
      this.validateServiceConfiguration(configuration);
      
      // Extract environment variables
      const envVariables = this.extractEnvironmentVariables(jsonContent);
      
      // Store for verification
      this.testData.jsonConfiguration = configuration;
      this.testData.environmentVariables = envVariables;
      
      console.log(`✓ JSON configuration parsed successfully`);
      console.log(`✓ Found ${envVariables.length} environment variables`);
      
    } catch (error) {
      throw new Error(`Failed to process JSON configuration: ${error.message}`);
    }
  }
);

When('I provide the following nested JSON configuration:', 
  async function (this: CustomWorld, jsonContent: string) {
    // TODO: Implement nested JSON configuration processing
    // Requirements:
    // 1. Handle complex nested structures
    // 2. Validate nested object schemas
    // 3. Process arrays of configuration objects
    // 4. Maintain referential integrity
    // 5. Extract and validate transformation rules
    
    try {
      const configuration: IntegrationConfiguration = JSON.parse(jsonContent);
      
      // Validate nested structure
      this.validateIntegrationConfiguration(configuration);
      
      // Process nested components
      this.processNestedConfiguration(configuration);
      
      // Store for verification
      this.testData.integrationConfiguration = configuration;
      
      console.log(`✓ Nested JSON configuration processed successfully`);
      
    } catch (error) {
      throw new Error(`Failed to process nested JSON configuration: ${error.message}`);
    }
  }
);
```

---

## Part B: XML Document Processing

### **Feature File: XML Document Handling**

```gherkin
  Scenario: XML Document Processing with Namespace Support
    Given I am processing system integration documents
    When I provide the following XML configuration document:
      """
      <?xml version="1.0" encoding="UTF-8"?>
      <config:SystemConfiguration xmlns:config="http://company.com/config/v1"
                                   xmlns:security="http://company.com/security/v1"
                                   xmlns:monitoring="http://company.com/monitoring/v1"
                                   version="2.0">
        
        <config:ApplicationSettings>
          <config:Name>Enterprise Integration Hub</config:Name>
          <config:Version>4.2.1</config:Version>
          <config:Environment>production</config:Environment>
          <config:Region>us-east-1</config:Region>
          <config:DeploymentDate>2024-01-15T10:30:00Z</config:DeploymentDate>
        </config:ApplicationSettings>
        
        <config:NetworkConfiguration>
          <config:LoadBalancer>
            <config:Enabled>true</config:Enabled>
            <config:Algorithm>round-robin</config:Algorithm>
            <config:HealthCheck>
              <config:Interval>30</config:Interval>
              <config:Timeout>5</config:Timeout>
              <config:HealthyThreshold>2</config:HealthyThreshold>
              <config:UnhealthyThreshold>3</config:UnhealthyThreshold>
            </config:HealthCheck>
            <config:Servers>
              <config:Server id="server-1">
                <config:Host>app-server-1.company.com</config:Host>
                <config:Port>8080</config:Port>
                <config:Weight>100</config:Weight>
                <config:Status>active</config:Status>
              </config:Server>
              <config:Server id="server-2">
                <config:Host>app-server-2.company.com</config:Host>
                <config:Port>8080</config:Port>
                <config:Weight>100</config:Weight>
                <config:Status>active</config:Status>
              </config:Server>
              <config:Server id="server-3">
                <config:Host>app-server-3.company.com</config:Host>
                <config:Port>8080</config:Port>
                <config:Weight>50</config:Weight>
                <config:Status>maintenance</config:Status>
              </config:Server>
            </config:Servers>
          </config:LoadBalancer>
        </config:NetworkConfiguration>
        
        <security:SecurityConfiguration>
          <security:Authentication>
            <security:Provider>LDAP</security:Provider>
            <security:Server>ldap://auth.company.com:389</security:Server>
            <security:BaseDN>ou=users,dc=company,dc=com</security:BaseDN>
            <security:BindDN>${LDAP_BIND_DN}</security:BindDN>
            <security:BindPassword>${LDAP_BIND_PASSWORD}</security:BindPassword>
            <security:UserSearchFilter>(uid={0})</security:UserSearchFilter>
            <security:GroupSearchBase>ou=groups,dc=company,dc=com</security:GroupSearchBase>
          </security:Authentication>
          
          <security:Authorization>
            <security:Roles>
              <security:Role name="admin">
                <security:Permissions>
                  <security:Permission>system:read</security:Permission>
                  <security:Permission>system:write</security:Permission>
                  <security:Permission>user:manage</security:Permission>
                  <security:Permission>config:modify</security:Permission>
                </security:Permissions>
              </security:Role>
              <security:Role name="operator">
                <security:Permissions>
                  <security:Permission>system:read</security:Permission>
                  <security:Permission>monitor:view</security:Permission>
                  <security:Permission>alerts:acknowledge</security:Permission>
                </security:Permissions>
              </security:Role>
              <security:Role name="viewer">
                <security:Permissions>
                  <security:Permission>system:read</security:Permission>
                  <security:Permission>monitor:view</security:Permission>
                </security:Permissions>
              </security:Role>
            </security:Roles>
          </security:Authorization>
        </security:SecurityConfiguration>
        
        <monitoring:MonitoringConfiguration>
          <monitoring:Metrics>
            <monitoring:Enabled>true</monitoring:Enabled>
            <monitoring:CollectionInterval>30</monitoring:CollectionInterval>
            <monitoring:RetentionPeriod>30d</monitoring:RetentionPeriod>
            <monitoring:Exporters>
              <monitoring:Exporter type="prometheus">
                <monitoring:Endpoint>/metrics</monitoring:Endpoint>
                <monitoring:Port>9090</monitoring:Port>
              </monitoring:Exporter>
              <monitoring:Exporter type="grafana">
                <monitoring:Endpoint>https://grafana.company.com</monitoring:Endpoint>
                <monitoring:APIKey>${GRAFANA_API_KEY}</monitoring:APIKey>
              </monitoring:Exporter>
            </monitoring:Exporters>
          </monitoring:Metrics>
          
          <monitoring:AlertRules>
            <monitoring:AlertRule name="high-cpu-usage">
              <monitoring:Condition>cpu_usage > 80</monitoring:Condition>
              <monitoring:Duration>5m</monitoring:Duration>
              <monitoring:Severity>warning</monitoring:Severity>
              <monitoring:NotificationChannels>
                <monitoring:Channel>email</monitoring:Channel>
                <monitoring:Channel>slack</monitoring:Channel>
              </monitoring:NotificationChannels>
            </monitoring:AlertRule>
            <monitoring:AlertRule name="service-down">
              <monitoring:Condition>up == 0</monitoring:Condition>
              <monitoring:Duration>1m</monitoring:Duration>
              <monitoring:Severity>critical</monitoring:Severity>
              <monitoring:NotificationChannels>
                <monitoring:Channel>email</monitoring:Channel>
                <monitoring:Channel>slack</monitoring:Channel>
                <monitoring:Channel>pagerduty</monitoring:Channel>
              </monitoring:NotificationChannels>
            </monitoring:AlertRule>
          </monitoring:AlertRules>
        </monitoring:MonitoringConfiguration>
        
      </config:SystemConfiguration>
      """
    Then the XML document should be parsed successfully
    And all namespaces should be processed correctly
    And system configuration should be extracted
    And security settings should be validated
    And monitoring configuration should be processed
    And environment variables should be identified
    And nested structures should maintain hierarchy

  Scenario: XML Document Transformation and Validation
    Given I am validating XML configuration schemas
    When I provide the following complex XML document with validation rules:
      """
      <?xml version="1.0" encoding="UTF-8"?>
      <workflow:ProcessDefinition xmlns:workflow="http://company.com/workflow/v2"
                                  xmlns:task="http://company.com/task/v2"
                                  xmlns:condition="http://company.com/condition/v2"
                                  id="customer-onboarding-process"
                                  version="3.1.0">
        
        <workflow:Metadata>
          <workflow:Name>Customer Onboarding Process</workflow:Name>
          <workflow:Description>Comprehensive customer onboarding workflow with approval stages</workflow:Description>
          <workflow:Category>Customer Management</workflow:Category>
          <workflow:CreatedBy>workflow-admin@company.com</workflow:CreatedBy>
          <workflow:CreatedDate>2024-01-10T14:20:00Z</workflow:CreatedDate>
          <workflow:LastModified>2024-01-20T09:15:00Z</workflow:LastModified>
          <workflow:Status>active</workflow:Status>
        </workflow:Metadata>
        
        <workflow:Variables>
          <workflow:Variable name="customerData" type="object" required="true">
            <workflow:Description>Customer information from registration form</workflow:Description>
            <workflow:Schema>
              <workflow:Property name="email" type="string" format="email" required="true"/>
              <workflow:Property name="firstName" type="string" minLength="1" maxLength="50" required="true"/>
              <workflow:Property name="lastName" type="string" minLength="1" maxLength="50" required="true"/>
              <workflow:Property name="company" type="string" minLength="1" maxLength="100"/>
              <workflow:Property name="phoneNumber" type="string" pattern="^\+?[1-9]\d{1,14}$"/>
            </workflow:Schema>
          </workflow:Variable>
          <workflow:Variable name="approvalLevel" type="string" enum="basic,premium,enterprise" required="true"/>
          <workflow:Variable name="riskScore" type="number" min="0" max="100" required="true"/>
        </workflow:Variables>
        
        <workflow:Process>
          <task:StartEvent id="start-onboarding">
            <task:Name>Start Customer Onboarding</task:Name>
            <task:Trigger type="api" endpoint="/workflow/customer-onboarding/start"/>
          </task:StartEvent>
          
          <task:UserTask id="data-verification" assignee="data-verification-team">
            <task:Name>Verify Customer Data</task:Name>
            <task:Description>Verify and validate customer provided information</task:Description>
            <task:FormFields>
              <task:Field name="dataAccurate" type="boolean" required="true" label="Data is accurate"/>
              <task:Field name="documentsProvided" type="boolean" required="true" label="Required documents provided"/>
              <task:Field name="verificationNotes" type="text" maxLength="500" label="Verification notes"/>
            </task:FormFields>
            <task:DueDate>P2D</task:DueDate>
          </task:UserTask>
          
          <condition:ExclusiveGateway id="risk-assessment-gateway">
            <condition:Name>Risk Assessment Decision</condition:Name>
            <condition:Conditions>
              <condition:Condition id="low-risk" expression="${riskScore &lt; 30}">
                <condition:Target>auto-approval</condition:Target>
              </condition:Condition>
              <condition:Condition id="medium-risk" expression="${riskScore >= 30 && riskScore &lt; 70}">
                <condition:Target>manager-approval</condition:Target>
              </condition:Condition>
              <condition:Condition id="high-risk" expression="${riskScore >= 70}">
                <condition:Target>senior-approval</condition:Target>
              </condition:Condition>
            </condition:Conditions>
          </condition:ExclusiveGateway>
          
          <task:ServiceTask id="auto-approval" class="AutoApprovalService">
            <task:Name>Automatic Approval</task:Name>
            <task:Parameters>
              <task:Parameter name="approvalType">automatic</task:Parameter>
              <task:Parameter name="customerData">${customerData}</task:Parameter>
            </task:Parameters>
          </task:ServiceTask>
          
          <task:UserTask id="manager-approval" assignee="approval-managers">
            <task:Name>Manager Approval Required</task:Name>
            <task:CandidateGroups>approval-managers,regional-managers</task:CandidateGroups>
            <task:FormFields>
              <task:Field name="approvalDecision" type="enum" values="approved,rejected,requires-review" required="true"/>
              <task:Field name="approvalComments" type="text" maxLength="1000" label="Approval comments"/>
            </task:FormFields>
            <task:DueDate>P1D</task:DueDate>
          </task:UserTask>
          
          <task:UserTask id="senior-approval" assignee="senior-managers">
            <task:Name>Senior Manager Approval Required</task:Name>
            <task:CandidateGroups>senior-managers,c-level</task:CandidateGroups>
            <task:FormFields>
              <task:Field name="approvalDecision" type="enum" values="approved,rejected,requires-legal-review" required="true"/>
              <task:Field name="riskMitigation" type="text" maxLength="2000" label="Risk mitigation strategy"/>
              <task:Field name="approvalComments" type="text" maxLength="1000" label="Approval comments"/>
            </task:FormFields>
            <task:DueDate>P3D</task:DueDate>
          </task:UserTask>
          
          <task:ServiceTask id="account-creation" class="AccountCreationService">
            <task:Name>Create Customer Account</task:Name>
            <task:Parameters>
              <task:Parameter name="customerData">${customerData}</task:Parameter>
              <task:Parameter name="approvalLevel">${approvalLevel}</task:Parameter>
              <task:Parameter name="createWelcomeEmail">true</task:Parameter>
            </task:Parameters>
          </task:ServiceTask>
          
          <task:EndEvent id="onboarding-complete">
            <task:Name>Customer Onboarding Complete</task:Name>
            <task:CompletionActions>
              <task:Action type="notification" target="customer-success-team"/>
              <task:Action type="metrics" event="customer-onboarded"/>
            </task:CompletionActions>
          </task:EndEvent>
        </workflow:Process>
        
      </workflow:ProcessDefinition>
      """
    Then the XML workflow document should be processed successfully
    And all workflow elements should be validated
    And namespace hierarchies should be maintained
    And variable schemas should be validated
    And task dependencies should be verified
    And condition expressions should be parsed correctly
```

### **Task B1: Implement XML Document Processing**

Create step definitions for XML content processing:

```typescript
// XML Processing Interfaces
interface SystemConfiguration {
  version: string;
  applicationSettings: ApplicationSettings;
  networkConfiguration: NetworkConfiguration;
  securityConfiguration: SecurityConfiguration;
  monitoringConfiguration: MonitoringConfiguration;
}

interface WorkflowDefinition {
  id: string;
  version: string;
  metadata: WorkflowMetadata;
  variables: WorkflowVariable[];
  process: WorkflowProcess;
}

// XML Document Processing
When('I provide the following XML configuration document:', 
  async function (this: CustomWorld, xmlContent: string) {
    // TODO: Implement XML document processing
    // Requirements:
    // 1. Parse XML with namespace support
    // 2. Extract configuration elements
    // 3. Validate XML schema structure
    // 4. Handle nested elements and attributes
    // 5. Process environment variables
    
    try {
      const xmlConfig = this.parseXMLConfiguration(xmlContent);
      
      // Validate XML structure
      this.validateXMLConfiguration(xmlConfig);
      
      // Extract environment variables
      const envVars = this.extractXMLEnvironmentVariables(xmlContent);
      
      // Store for verification
      this.testData.xmlConfiguration = xmlConfig;
      this.testData.xmlEnvironmentVariables = envVars;
      
      console.log(`✓ XML configuration parsed successfully`);
      console.log(`✓ Found ${envVars.length} environment variables`);
      
    } catch (error) {
      throw new Error(`Failed to process XML configuration: ${error.message}`);
    }
  }
);

When('I provide the following complex XML document with validation rules:', 
  async function (this: CustomWorld, xmlContent: string) {
    // TODO: Implement complex XML workflow processing
    // Requirements:
    // 1. Parse workflow definition XML
    // 2. Validate workflow schema
    // 3. Process task definitions and dependencies
    // 4. Validate condition expressions
    // 5. Extract variable schemas
    
    try {
      const workflowConfig = this.parseWorkflowXML(xmlContent);
      
      // Validate workflow structure
      this.validateWorkflowConfiguration(workflowConfig);
      
      // Store for verification
      this.testData.workflowConfiguration = workflowConfig;
      
      console.log(`✓ XML workflow document processed successfully`);
      
    } catch (error) {
      throw new Error(`Failed to process XML workflow document: ${error.message}`);
    }
  }
);
```

---

## Part C: Email Template Processing

### **Feature File: Email Template Processing**

```gherkin
  Scenario: Email Template Processing with Dynamic Variables
    Given I am configuring email notification templates
    When I provide the following email template with dynamic content:
      """
      Subject: Welcome to {{company_name}}, {{customer.firstName}}! Your account is ready.
      
      From: {{sender.name}} <{{sender.email}}>
      To: {{customer.firstName}} {{customer.lastName}} <{{customer.email}}>
      Reply-To: support@{{company_domain}}
      
      Dear {{customer.firstName}} {{customer.lastName}},
      
      Welcome to {{company_name}}! We're excited to have you as part of our growing community.
      
      Your account has been successfully created with the following details:
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Account Information
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      Account ID: {{account.id}}
      Email Address: {{customer.email}}
      Account Type: {{account.type}}
      Registration Date: {{account.createdDate | date('MMMM d, yyyy')}}
      Account Status: {{account.status | title_case}}
      
      {{#if account.isPremium}}
      🌟 Premium Features Included:
      • Priority customer support
      • Advanced analytics dashboard
      • Extended storage ({{account.storage}} GB)
      • API access with {{account.apiLimit}} requests/month
      • Custom branding options
      {{/if}}
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Getting Started
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      To get started with your new account, please follow these steps:
      
      1. 🔐 Secure Your Account
         Set up two-factor authentication: {{urls.setup_2fa}}
         
      2. 📋 Complete Your Profile
         Add additional information: {{urls.profile_setup}}
         
      3. 🎯 Explore Features
         Take our interactive tour: {{urls.product_tour}}
         
      4. 📞 Connect With Support
         Join our community forum: {{urls.community}}
         Contact support: {{urls.support}}
      
      {{#if onboarding.hasScheduledCall}}
      ┌─────────────────────────────────────────────────────────────────────────────────┐
      │ 📅 Your Onboarding Call is Scheduled                                            │
      │                                                                                 │
      │ Date: {{onboarding.callDate | date('EEEE, MMMM d, yyyy')}}                    │
      │ Time: {{onboarding.callTime}} {{onboarding.timezone}}                         │
      │ Duration: {{onboarding.duration}} minutes                                      │
      │ Meeting Link: {{onboarding.meetingUrl}}                                        │
      │                                                                                 │
      │ Your onboarding specialist: {{onboarding.specialist.name}}                     │
      │ Email: {{onboarding.specialist.email}}                                         │
      └─────────────────────────────────────────────────────────────────────────────────┘
      {{/if}}
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Important Security Information
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      🔒 Account Security:
      • Your password should be unique and secure
      • Enable two-factor authentication for enhanced security
      • Never share your login credentials with anyone
      • Log out of shared or public computers
      
      🚨 Important: We will never ask for your password via email or phone.
      If you receive suspicious communications, please report them to: security@{{company_domain}}
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Support & Resources
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      📚 Documentation: {{urls.documentation}}
      🎓 Learning Center: {{urls.learning_center}}
      💬 Community Forum: {{urls.community}}
      📧 Email Support: {{support.email}}
      📞 Phone Support: {{support.phone}} ({{support.hours}})
      
      {{#if customer.preferredLanguage != 'en'}}
      🌍 Multi-language Support Available
      View this email in {{customer.preferredLanguage | language_name}}: {{urls.translated_email}}
      {{/if}}
      
      Thank you for choosing {{company_name}}. We're here to help you succeed!
      
      Best regards,
      {{sender.name}}
      {{sender.title}}
      {{company_name}}
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      {{footer.companyAddress}}
      {{footer.unsubscribeText}}: {{urls.unsubscribe}}
      
      This email was sent to {{customer.email}} because you created an account at {{company_name}}.
      
      © {{current_year}} {{company_name}}. All rights reserved.
      """
    Then the email template should be parsed successfully
    And all template variables should be identified
    And conditional logic should be processed correctly
    And date formatting filters should be applied
    And dynamic content sections should be handled
    And template syntax should be validated
```

### **Task C1: Implement Email Template Processing**

Create step definitions for email template processing:

```typescript
// Email Template Processing
When('I provide the following email template with dynamic content:', 
  async function (this: CustomWorld, templateContent: string) {
    // TODO: Implement email template processing
    // Requirements:
    // 1. Parse template variables and placeholders
    // 2. Handle conditional logic (if/else statements)
    // 3. Process template filters and formatting
    // 4. Validate template syntax
    // 5. Extract all dynamic content references
    
    try {
      const templateVariables = this.extractTemplateVariables(templateContent);
      const conditionalBlocks = this.extractConditionalBlocks(templateContent);
      const templateFilters = this.extractTemplateFilters(templateContent);
      
      // Validate template syntax
      this.validateEmailTemplateSyntax(templateContent);
      
      // Store for verification
      this.testData.emailTemplate = {
        content: templateContent,
        variables: templateVariables,
        conditionalBlocks: conditionalBlocks,
        filters: templateFilters
      };
      
      console.log(`✓ Email template parsed successfully`);
      console.log(`✓ Found ${templateVariables.length} template variables`);
      console.log(`✓ Found ${conditionalBlocks.length} conditional blocks`);
      
    } catch (error) {
      throw new Error(`Failed to process email template: ${error.message}`);
    }
  }
);
```

---

## Part D: Advanced Utility Functions

### **Task D1: Implement Content Processing Utilities**

Create comprehensive utility functions for content processing:

```typescript
// Add to CustomWorld class
declare module './world' {
  interface CustomWorld {
    validateServiceConfiguration(config: ServiceConfiguration): void;
    validateIntegrationConfiguration(config: IntegrationConfiguration): void;
    processNestedConfiguration(config: IntegrationConfiguration): void;
    extractEnvironmentVariables(content: string): string[];
    parseXMLConfiguration(xmlContent: string): SystemConfiguration;
    validateXMLConfiguration(config: SystemConfiguration): void;
    extractXMLEnvironmentVariables(xmlContent: string): string[];
    parseWorkflowXML(xmlContent: string): WorkflowDefinition;
    validateWorkflowConfiguration(workflow: WorkflowDefinition): void;
    extractTemplateVariables(template: string): string[];
    extractConditionalBlocks(template: string): ConditionalBlock[];
    extractTemplateFilters(template: string): TemplateFilter[];
    validateEmailTemplateSyntax(template: string): void;
    processConfigurationWithEnvironment(content: string, envVars: Record<string, string>): string;
  }
}

// Implementation of advanced content processing utilities
CustomWorld.prototype.validateServiceConfiguration = function(config: ServiceConfiguration): void {
  // TODO: Implement service configuration validation
  // Requirements:
  // 1. Validate required service information
  // 2. Check database configuration completeness
  // 3. Validate security settings
  // 4. Verify monitoring configuration
  
  if (!config.service?.name || !config.service?.version) {
    throw new Error('Service name and version are required');
  }
  
  if (!config.database?.type || !config.database?.host) {
    throw new Error('Database type and host are required');
  }
  
  if (config.service.port < 1 || config.service.port > 65535) {
    throw new Error('Invalid service port number');
  }
  
  console.log('✓ Service configuration validated successfully');
};

CustomWorld.prototype.extractEnvironmentVariables = function(content: string): string[] {
  const envVarRegex = /\$\{([^}]+)\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = envVarRegex.exec(content)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
};

CustomWorld.prototype.parseXMLConfiguration = function(xmlContent: string): SystemConfiguration {
  // TODO: Implement XML parsing with namespace support
  // This is a simplified implementation - in production, use a proper XML parser
  
  // Extract basic information from XML content
  const config: Partial<SystemConfiguration> = {};
  
  // Parse version
  const versionMatch = xmlContent.match(/version="([^"]+)"/);
  if (versionMatch) {
    config.version = versionMatch[1];
  }
  
  // In a real implementation, you would use a proper XML parser like xml2js
  return config as SystemConfiguration;
};

CustomWorld.prototype.extractTemplateVariables = function(template: string): string[] {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(template)) !== null) {
    const variable = match[1].trim();
    if (!variable.startsWith('#') && !variable.startsWith('/') && !variables.includes(variable)) {
      variables.push(variable);
    }
  }
  
  return variables;
};

CustomWorld.prototype.extractConditionalBlocks = function(template: string): ConditionalBlock[] {
  const conditionalRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  const blocks: ConditionalBlock[] = [];
  let match;
  
  while ((match = conditionalRegex.exec(template)) !== null) {
    blocks.push({
      condition: match[1].trim(),
      content: match[2].trim()
    });
  }
  
  return blocks;
};

CustomWorld.prototype.validateEmailTemplateSyntax = function(template: string): void {
  // TODO: Implement template syntax validation
  // Requirements:
  // 1. Check for balanced template tags
  // 2. Validate conditional syntax
  // 3. Check for valid filter syntax
  // 4. Ensure proper nesting
  
  const openTags = (template.match(/\{\{#/g) || []).length;
  const closeTags = (template.match(/\{\{\//g) || []).length;
  
  if (openTags !== closeTags) {
    throw new Error('Unbalanced template tags found');
  }
  
  console.log('✓ Email template syntax validated successfully');
};
```

---

## Success Criteria

### **Completion Requirements**

To successfully complete this challenge, your implementation must:

1. **JSON Configuration Processing**:
   ✅ Parse complex nested JSON structures accurately
   ✅ Extract and validate environment variables
   ✅ Implement schema validation for configuration objects
   ✅ Handle type conversion and validation

2. **XML Document Processing**:
   ✅ Parse XML with namespace support
   ✅ Handle nested elements and attributes
   ✅ Extract configuration data from XML structures
   ✅ Validate XML schema compliance

3. **Email Template Processing**:
   ✅ Parse template variables and placeholders
   ✅ Handle conditional logic and template filters
   ✅ Validate template syntax
   ✅ Process dynamic content sections

4. **Advanced Utilities**:
   ✅ Implement comprehensive content validation
   ✅ Create reusable processing functions
   ✅ Handle error cases gracefully
   ✅ Support environment variable substitution

---

## Extension Challenges

### **Advanced Tasks** (Optional)

1. **Schema Generation**: Automatically generate schemas from content examples
2. **Content Transformation Pipelines**: Create configurable transformation workflows
3. **Multi-format Content Processing**: Support additional formats (YAML, TOML, etc.)
4. **Template Inheritance**: Implement template extension and inheritance
5. **Performance Optimization**: Optimize for large content processing

---

**Next Exercise**: [Real-World Integration Project](./04-real-world-integration-project.md) - End-to-end data flow implementation.