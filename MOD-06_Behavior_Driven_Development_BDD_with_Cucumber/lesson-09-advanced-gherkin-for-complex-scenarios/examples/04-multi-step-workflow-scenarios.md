# Example 04: Multi-Step Workflow Scenarios

## Overview

This example demonstrates how to model complex, multi-step business workflows using advanced Gherkin patterns. You'll learn to handle end-to-end processes that span multiple systems, involve various user roles, and require sophisticated state management across long-running scenarios.

## Learning Objectives

By completing this example, you will:

- **Model Complex Business Processes**: Break down intricate workflows into manageable Gherkin scenarios
- **Handle Multi-System Integration**: Test processes that span multiple applications and services
- **Manage Long-Running Workflows**: Implement patterns for workflows that extend over time
- **Coordinate Multiple User Roles**: Handle scenarios involving different actors and permissions
- **Implement State Management**: Maintain context across complex multi-step processes
- **Design Rollback and Recovery**: Handle failure scenarios and process recovery

## Key Concepts

### Workflow Patterns
- **Sequential Processes**: Step-by-step linear workflows
- **Parallel Processes**: Concurrent workflow branches
- **Conditional Workflows**: Decision-based process flows
- **Approval Workflows**: Multi-stage approval processes

### Multi-System Coordination
- **Service Orchestration**: Coordinating multiple microservices
- **Data Synchronization**: Ensuring consistency across systems
- **External System Integration**: Handling third-party dependencies
- **Event-Driven Processes**: Asynchronous workflow handling

## Implementation

### Project Structure

```
multi-step-workflows/
├── features/
│   ├── order-fulfillment/
│   │   ├── complete-order-lifecycle.feature
│   │   ├── inventory-allocation.feature
│   │   └── shipping-coordination.feature
│   ├── employee-onboarding/
│   │   ├── new-hire-process.feature
│   │   ├── system-provisioning.feature
│   │   └── compliance-verification.feature
│   ├── loan-application/
│   │   ├── application-processing.feature
│   │   ├── credit-assessment.feature
│   │   └── approval-workflow.feature
│   └── support/
│       ├── world.ts
│       ├── workflow-manager.ts
│       ├── state-manager.ts
│       └── system-coordinator.ts
├── step-definitions/
│   ├── order-workflow.steps.ts
│   ├── hr-workflow.steps.ts
│   ├── financial-workflow.steps.ts
│   └── shared-workflow.steps.ts
├── workflows/
│   ├── order-fulfillment-config.json
│   ├── employee-onboarding-config.json
│   └── loan-processing-config.json
├── config/
│   ├── cucumber.js
│   └── workflow-definitions.json
└── package.json
```

### Complete Order Fulfillment Workflow

```gherkin
# features/order-fulfillment/complete-order-lifecycle.feature
@workflow @order-fulfillment @end-to-end @critical
@systems:order-management,inventory,payment,shipping,notification
@roles:customer,sales,fulfillment,finance @long-running @stateful
Feature: Complete E-commerce Order Lifecycle
  As an e-commerce platform
  I want to process customer orders through the complete fulfillment lifecycle
  So that customers receive their products efficiently and business operations run smoothly

Background:
  Given the following systems are operational:
    | system             | status | version | health_endpoint           |
    | order-management   | active | v2.1.3  | /health/order-service     |
    | inventory-system   | active | v1.8.7  | /health/inventory-service |
    | payment-gateway    | active | v3.2.1  | /api/gateway/health       |
    | shipping-service   | active | v2.5.4  | /health/shipping          |
    | notification-hub   | active | v1.4.2  | /health/notifications     |
  And the following product inventory is available:
    | product_id | name              | stock_quantity | warehouse_locations | price  | category    |
    | PROD001    | Wireless Headphones| 150           | WH01,WH03          | $199.99| Electronics |
    | PROD002    | Gaming Laptop      | 25            | WH02               | $1299.99| Electronics |
    | PROD003    | Coffee Table       | 8             | WH01,WH04          | $299.99| Furniture   |

@workflow @order-creation @customer-facing @fast
@state-transition:anonymous->authenticated->cart->checkout
Scenario: Customer places complex multi-item order
  Given I am a customer browsing the online store
  When I perform the following shopping sequence:
    | step                    | action                                      | expected_state          |
    | browse_catalog         | view product categories and search         | browsing               |
    | add_items_to_cart      | add PROD001 (qty: 2), PROD003 (qty: 1)    | cart_active            |
    | apply_discount         | enter coupon code "SAVE20"                 | discount_applied       |
    | proceed_to_checkout    | initiate checkout process                   | checkout_initiated     |
    | enter_shipping_info    | provide shipping address and preferences   | shipping_configured    |
    | select_payment_method  | choose credit card payment                  | payment_method_selected|
    | review_order           | confirm order details and totals           | order_ready_for_submit |
    | submit_order           | complete order placement                    | order_submitted        |
  Then order should be created with status "pending_payment"
  And order total should be calculated correctly:
    | item              | unit_price | quantity | subtotal |
    | Wireless Headphones| $199.99   | 2        | $399.98  |
    | Coffee Table       | $299.99   | 1        | $299.99  |
    | Discount (SAVE20)  | -$139.99  | 1        | -$139.99 |
    | Tax               | $46.00    | 1        | $46.00   |
    | Shipping          | $12.99    | 1        | $12.99   |
    | Total             | $618.97   | 1        | $618.97  |
  And inventory should be reserved for order items
  And customer should receive order confirmation email
  And order tracking should be initiated

@workflow @payment-processing @financial @critical @medium
@state-transition:pending_payment->payment_processing->payment_confirmed
@external-dependencies:payment-gateway @compliance:pci-dss
Scenario: Multi-stage payment processing with validation
  Given I have a submitted order "ORD-2024-001" with total $618.97
  And payment method is configured as credit card
  When payment processing workflow is initiated:
    | stage                    | action                              | validation_checks                    | timeout  |
    | fraud_screening         | analyze transaction for fraud risk | IP_location,velocity_check,amount   | 30s      |
    | payment_authorization   | authorize payment with card issuer | card_validity,funds_availability    | 45s      |
    | risk_assessment         | evaluate transaction risk score     | customer_history,merchant_category  | 15s      |
    | payment_capture         | capture authorized payment          | authorization_validity,amount_match | 30s      |
    | payment_confirmation    | confirm successful payment          | transaction_id,receipt_generation   | 10s      |
  Then payment should be processed successfully
  And transaction ID should be generated and stored
  And order status should transition to "payment_confirmed"
  And payment confirmation should be sent to customer
  And accounting system should be notified
  And inventory reservations should be converted to allocations
  And fulfillment workflow should be triggered
```

### Employee Onboarding Workflow

```gherkin
# features/employee-onboarding/new-hire-process.feature
@workflow @hr @employee-onboarding @compliance @complex
@systems:hr-management,it-provisioning,security,compliance,payroll
@roles:hr,it-admin,security-admin,manager,buddy @long-running @approval-required
Feature: Comprehensive Employee Onboarding Workflow
  As an HR department
  I want to onboard new employees efficiently and compliantly
  So that they can be productive quickly while meeting all organizational requirements

Background:
  Given the following organizational systems are integrated:
    | system           | purpose                    | integration_status | compliance_level |
    | hr-management    | employee records          | active            | sox_compliant    |
    | it-provisioning  | system access management  | active            | iso27001        |
    | security-system  | identity and access       | active            | security_audited|
    | compliance-hub   | regulatory requirements   | active            | gdpr_compliant  |
    | payroll-system   | compensation management   | active            | tax_compliant   |

@workflow @pre-boarding @preparation @hr-driven @medium
@state-transition:offer_accepted->documentation_sent->paperwork_completed->systems_prepared
Scenario: Pre-boarding preparation and documentation workflow
  Given a new hire "John Smith" has accepted offer for "Senior Software Engineer" position
  And start date is scheduled for "2024-02-15"
  When pre-boarding workflow is initiated 2 weeks before start date:
    | timeline      | responsible_party | activities                                    | deliverables                         |
    | Week -2       | hr_coordinator   | send welcome package and initial documents    | welcome_email,handbook,forms        |
    | Week -2       | it_administrator  | provision hardware and create system accounts| laptop,phone,accounts_created       |
    | Week -1       | security_admin   | configure security access and permissions     | badge_created,vpn_access,mfa_setup  |
    | Week -1       | manager          | prepare workspace and schedule orientation    | desk_assignment,meeting_invites     |
    | Days -3 to -1 | hr_coordinator   | confirm attendance and final preparations     | confirmation_call,buddy_assignment  |
  Then all pre-boarding activities should be completed on schedule
  And new hire should have all necessary access and equipment ready
  And first-day experience should be fully prepared
  And compliance documentation should be processed
```

### Loan Application Processing Workflow

```gherkin
# features/loan-application/application-processing.feature
@workflow @financial-services @loan-processing @regulatory @critical
@systems:application-portal,credit-bureau,underwriting,compliance,document-management
@roles:applicant,loan-officer,underwriter,compliance-officer,manager @approval-workflow @high-risk
Feature: Comprehensive Loan Application Processing Workflow
  As a financial institution
  I want to process loan applications efficiently and compliantly
  So that qualified borrowers receive funding while maintaining regulatory compliance

Background:
  Given the loan processing system is configured with regulatory requirements:
    | regulation    | requirement_type        | compliance_checks                    |
    | TRID          | disclosure_timing       | 3_day_rule,waiting_periods          |
    | Fair_Credit   | non_discrimination      | fair_lending_analysis               |
    | BSA_AML       | anti_money_laundering   | customer_identification,suspicious_activity|
    | Dodd_Frank    | ability_to_repay        | dti_calculation,income_verification |

@workflow @application-intake @customer-facing @data-collection @medium
@state-transition:inquiry->application_started->documentation_submitted->initial_review_complete
Scenario: Multi-channel loan application intake and initial processing
  Given a potential borrower is interested in a home mortgage loan
  When comprehensive application intake workflow is initiated:
    | stage                    | collection_method | required_information                        |
    | initial_inquiry         | online_form       | contact_info,loan_amount,property_address  |
    | application_initiation  | secure_portal     | personal_info,employment,income,assets     |
    | document_collection     | upload_portal     | pay_stubs,tax_returns,bank_statements     |
    | property_information    | mls_integration   | property_details,appraisal_info,insurance |
    | credit_authorization    | digital_consent   | credit_report_authorization,disclosure     |
  Then complete application package should be assembled
  And all required disclosures should be provided within regulatory timeframes
  And application should be queued for underwriting review
```

### Workflow Management Infrastructure

```typescript
// features/support/workflow-manager.ts
import { ICustomWorld } from './world';
import { StateManager } from './state-manager';
import { SystemCoordinator } from './system-coordinator';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'approval';
  prerequisites: string[];
  actions: WorkflowAction[];
  validation: ValidationRule[];
  timeout: number;
  retry: RetryConfig;
  rollback?: RollbackConfig;
}

export interface WorkflowAction {
  system: string;
  operation: string;
  parameters: any;
  expectedOutcome: string;
  successCriteria: string[];
}

export class WorkflowManager {
  private stateManager: StateManager;
  private systemCoordinator: SystemCoordinator;
  private activeWorkflows: Map<string, WorkflowExecution>;
  private workflowDefinitions: Map<string, WorkflowDefinition>;

  constructor() {
    this.stateManager = new StateManager();
    this.systemCoordinator = new SystemCoordinator();
    this.activeWorkflows = new Map();
    this.workflowDefinitions = new Map();
    this.loadWorkflowDefinitions();
  }

  async startWorkflow(workflowType: string, initialData: any, context: ICustomWorld): Promise<string> {
    const workflowId = this.generateWorkflowId();
    const definition = this.workflowDefinitions.get(workflowType);
    
    if (!definition) {
      throw new Error(`Workflow definition not found: ${workflowType}`);
    }

    const execution = new WorkflowExecution(
      workflowId,
      definition,
      initialData,
      this.stateManager,
      this.systemCoordinator
    );

    this.activeWorkflows.set(workflowId, execution);
    
    try {
      await execution.start();
      context.workflowId = workflowId;
      return workflowId;
    } catch (error) {
      await this.handleWorkflowError(workflowId, error);
      throw error;
    }
  }

  async executeWorkflowStep(workflowId: string, stepId: string, stepData: any): Promise<any> {
    const execution = this.activeWorkflows.get(workflowId);
    
    if (!execution) {
      throw new Error(`Active workflow not found: ${workflowId}`);
    }

    return await execution.executeStep(stepId, stepData);
  }

  async getWorkflowStatus(workflowId: string): Promise<WorkflowStatus> {
    const execution = this.activeWorkflows.get(workflowId);
    
    if (!execution) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    return execution.getStatus();
  }

  async completeWorkflow(workflowId: string): Promise<WorkflowResult> {
    const execution = this.activeWorkflows.get(workflowId);
    
    if (!execution) {
      throw new Error(`Active workflow not found: ${workflowId}`);
    }

    try {
      const result = await execution.complete();
      this.activeWorkflows.delete(workflowId);
      return result;
    } catch (error) {
      await this.handleWorkflowError(workflowId, error);
      throw error;
    }
  }

  private generateWorkflowId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadWorkflowDefinitions(): void {
    // Load workflow definitions from configuration files
    const orderFulfillment = require('../../workflows/order-fulfillment-config.json');
    const employeeOnboarding = require('../../workflows/employee-onboarding-config.json');
    const loanProcessing = require('../../workflows/loan-processing-config.json');

    this.workflowDefinitions.set('order-fulfillment', orderFulfillment);
    this.workflowDefinitions.set('employee-onboarding', employeeOnboarding);
    this.workflowDefinitions.set('loan-processing', loanProcessing);
  }

  private async handleWorkflowError(workflowId: string, error: any): Promise<void> {
    const execution = this.activeWorkflows.get(workflowId);
    
    if (execution && execution.definition.rollback?.enabled) {
      try {
        await execution.rollback(`Error: ${error.message}`);
      } catch (rollbackError) {
        console.error(`Rollback failed for workflow ${workflowId}:`, rollbackError);
      }
    }

    await this.stateManager.updateWorkflowState(workflowId, {
      status: 'failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

export class WorkflowExecution {
  private workflowId: string;
  private definition: WorkflowDefinition;
  private data: any;
  private stateManager: StateManager;
  private systemCoordinator: SystemCoordinator;
  private currentState: WorkflowState;
  private executedSteps: Map<string, StepResult>;

  constructor(
    workflowId: string,
    definition: WorkflowDefinition,
    initialData: any,
    stateManager: StateManager,
    systemCoordinator: SystemCoordinator
  ) {
    this.workflowId = workflowId;
    this.definition = definition;
    this.data = initialData;
    this.stateManager = stateManager;
    this.systemCoordinator = systemCoordinator;
    this.executedSteps = new Map();
    this.currentState = {
      status: 'initialized',
      currentStep: null,
      data: initialData,
      timestamp: new Date().toISOString()
    };
  }

  async start(): Promise<void> {
    this.currentState.status = 'running';
    this.currentState.timestamp = new Date().toISOString();
    
    await this.stateManager.createWorkflowState(this.workflowId, this.currentState);
    
    // Execute initial workflow setup
    await this.executeWorkflowSetup();
  }

  async executeStep(stepId: string, stepData: any): Promise<any> {
    const step = this.definition.steps.find(s => s.id === stepId);
    
    if (!step) {
      throw new Error(`Step not found: ${stepId}`);
    }

    // Check prerequisites
    await this.validatePrerequisites(step);

    this.currentState.currentStep = stepId;
    this.currentState.timestamp = new Date().toISOString();
    
    await this.stateManager.updateWorkflowState(this.workflowId, this.currentState);

    try {
      const result = await this.executeStepActions(step, stepData);
      
      this.executedSteps.set(stepId, {
        stepId,
        status: 'completed',
        result,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.executedSteps.set(stepId, {
        stepId,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  async complete(): Promise<WorkflowResult> {
    this.currentState.status = 'completed';
    this.currentState.timestamp = new Date().toISOString();
    
    await this.stateManager.updateWorkflowState(this.workflowId, this.currentState);

    return {
      workflowId: this.workflowId,
      status: 'completed',
      result: this.data,
      executedSteps: Array.from(this.executedSteps.values()),
      completionTime: new Date().toISOString()
    };
  }

  async rollback(reason: string): Promise<void> {
    if (!this.definition.rollback?.enabled) {
      throw new Error('Rollback not supported for this workflow');
    }

    // Execute rollback steps in reverse order
    const executedStepIds = Array.from(this.executedSteps.keys()).reverse();
    
    for (const stepId of executedStepIds) {
      await this.rollbackStep(stepId);
    }

    this.currentState.status = 'rolled_back';
    this.currentState.rollbackReason = reason;
    this.currentState.timestamp = new Date().toISOString();
    
    await this.stateManager.updateWorkflowState(this.workflowId, this.currentState);
  }

  getStatus(): WorkflowStatus {
    return {
      workflowId: this.workflowId,
      status: this.currentState.status,
      currentStep: this.currentState.currentStep,
      completedSteps: Array.from(this.executedSteps.keys()),
      data: this.data,
      lastUpdated: this.currentState.timestamp
    };
  }

  private async executeWorkflowSetup(): Promise<void> {
    // Initialize workflow-specific resources
    await this.systemCoordinator.initializeWorkflowSystems(this.definition.requiredSystems);
    
    // Set up monitoring and logging
    await this.setupWorkflowMonitoring();
  }

  private async validatePrerequisites(step: WorkflowStep): Promise<void> {
    for (const prerequisite of step.prerequisites) {
      if (!this.executedSteps.has(prerequisite)) {
        throw new Error(`Prerequisite step not completed: ${prerequisite}`);
      }
      
      const prerequisiteResult = this.executedSteps.get(prerequisite);
      if (prerequisiteResult?.status !== 'completed') {
        throw new Error(`Prerequisite step failed: ${prerequisite}`);
      }
    }
  }

  private async executeStepActions(step: WorkflowStep, stepData: any): Promise<any> {
    const results = {};

    if (step.type === 'parallel') {
      // Execute actions in parallel
      const promises = step.actions.map(action => 
        this.systemCoordinator.executeAction(action, stepData)
      );
      const parallelResults = await Promise.all(promises);
      
      step.actions.forEach((action, index) => {
        results[action.operation] = parallelResults[index];
      });
    } else {
      // Execute actions sequentially
      for (const action of step.actions) {
        const result = await this.systemCoordinator.executeAction(action, stepData);
        results[action.operation] = result;
      }
    }

    // Validate step results
    await this.validateStepResults(step, results);

    return results;
  }

  private async validateStepResults(step: WorkflowStep, results: any): Promise<void> {
    for (const validation of step.validation) {
      const isValid = await this.validateRule(validation, results);
      
      if (!isValid) {
        throw new Error(`Validation failed: ${validation.errorMessage}`);
      }
    }
  }

  private async validateRule(rule: ValidationRule, data: any): Promise<boolean> {
    // Implement validation logic based on rule type
    switch (rule.rule) {
      case 'required':
        return data[rule.field] !== undefined && data[rule.field] !== null;
      case 'positive':
        return data[rule.field] > 0;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[rule.field]);
      default:
        return true;
    }
  }

  private async rollbackStep(stepId: string): Promise<void> {
    const rollbackActions = this.definition.rollback?.steps.filter(s => s.targetStep === stepId);
    
    if (rollbackActions) {
      for (const rollbackAction of rollbackActions) {
        await this.systemCoordinator.executeRollbackAction(rollbackAction);
      }
    }
  }

  private async setupWorkflowMonitoring(): Promise<void> {
    // Set up workflow-specific monitoring and alerting
    console.log(`Monitoring setup for workflow: ${this.workflowId}`);
  }
}
```

### Step Definitions for Workflow Scenarios

```typescript
// step-definitions/order-workflow.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../features/support/world';
import { WorkflowManager } from '../features/support/workflow-manager';

Given('the following systems are operational:', async function (this: ICustomWorld, dataTable) {
  const systems = dataTable.hashes();
  this.systemStatuses = new Map();
  
  for (const system of systems) {
    // Simulate system health check
    const healthCheck = await this.performHealthCheck(system.system, system.health_endpoint);
    this.systemStatuses.set(system.system, {
      status: healthCheck.healthy ? 'operational' : 'down',
      version: system.version,
      endpoint: system.health_endpoint
    });
  }
  
  // Verify all systems are operational
  for (const [systemName, status] of this.systemStatuses) {
    expect(status.status).toBe('operational');
  }
});

Given('the following product inventory is available:', async function (this: ICustomWorld, dataTable) {
  const products = dataTable.hashes();
  this.inventoryData = new Map();
  
  for (const product of products) {
    this.inventoryData.set(product.product_id, {
      name: product.name,
      stockQuantity: parseInt(product.stock_quantity),
      warehouseLocations: product.warehouse_locations.split(','),
      price: parseFloat(product.price.replace('$', '')),
      category: product.category
    });
  }
});

Given('I am a customer browsing the online store', async function (this: ICustomWorld) {
  this.customerSession = {
    sessionId: this.generateSessionId(),
    status: 'anonymous',
    cart: [],
    currentState: 'browsing'
  };
});

When('I perform the following shopping sequence:', async function (this: ICustomWorld, dataTable) {
  const shoppingSteps = dataTable.hashes();
  this.workflowManager = new WorkflowManager();
  
  const workflowId = await this.workflowManager.startWorkflow('customer-shopping', {
    customerId: this.customerSession.sessionId,
    inventory: Array.from(this.inventoryData.entries())
  }, this);
  
  for (const step of shoppingSteps) {
    const stepResult = await this.workflowManager.executeWorkflowStep(
      workflowId,
      step.step,
      {
        action: step.action,
        expectedState: step.expected_state
      }
    );
    
    // Update customer session state
    this.customerSession.currentState = step.expected_state;
    
    // Verify state transition
    expect(stepResult.newState).toBe(step.expected_state);
  }
  
  this.completedWorkflowId = workflowId;
});

Then('order should be created with status {string}', async function (this: ICustomWorld, expectedStatus: string) {
  const workflowStatus = await this.workflowManager.getWorkflowStatus(this.completedWorkflowId);
  
  expect(workflowStatus.data.order.status).toBe(expectedStatus);
  expect(workflowStatus.data.order.id).toBeDefined();
});

Then('order total should be calculated correctly:', async function (this: ICustomWorld, dataTable) {
  const expectedItems = dataTable.hashes();
  const workflowStatus = await this.workflowManager.getWorkflowStatus(this.completedWorkflowId);
  const order = workflowStatus.data.order;
  
  for (const expectedItem of expectedItems) {
    const orderItem = order.items.find(item => item.name === expectedItem.item);
    
    if (expectedItem.item === 'Total') {
      expect(order.total).toBe(parseFloat(expectedItem.subtotal.replace('$', '')));
    } else {
      expect(orderItem).toBeDefined();
      expect(orderItem.unitPrice).toBe(parseFloat(expectedItem.unit_price.replace('$', '')));
      expect(orderItem.quantity).toBe(parseInt(expectedItem.quantity));
      expect(orderItem.subtotal).toBe(parseFloat(expectedItem.subtotal.replace('$', '')));
    }
  }
});

// Helper methods
private async performHealthCheck(systemName: string, endpoint: string): Promise<any> {
  // Simulate health check - in real implementation, make actual HTTP call
  return { healthy: true, responseTime: Math.random() * 100 };
}

private generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substr(2, 9);
}
```

### Workflow Configuration

```json
// workflows/order-fulfillment-config.json
{
  "name": "order-fulfillment",
  "description": "Complete e-commerce order fulfillment workflow",
  "version": "1.0",
  "requiredSystems": [
    "order-management",
    "inventory-system", 
    "payment-gateway",
    "shipping-service",
    "notification-hub"
  ],
  "steps": [
    {
      "id": "browse_catalog",
      "name": "Browse Product Catalog",
      "type": "sequential",
      "prerequisites": [],
      "actions": [
        {
          "system": "catalog-service",
          "operation": "searchProducts",
          "parameters": {"query": "{{searchQuery}}"},
          "expectedOutcome": "product_list_returned",
          "successCriteria": ["results_count > 0", "response_time < 500ms"]
        }
      ],
      "validation": [
        {
          "field": "results",
          "rule": "required",
          "errorMessage": "Product search must return results",
          "severity": "error"
        }
      ],
      "timeout": 5000,
      "retry": {
        "maxAttempts": 3,
        "backoffStrategy": "exponential",
        "baseDelay": 1000,
        "maxDelay": 5000
      }
    },
    {
      "id": "add_items_to_cart",
      "name": "Add Items to Shopping Cart",
      "type": "sequential",
      "prerequisites": ["browse_catalog"],
      "actions": [
        {
          "system": "cart-service",
          "operation": "addItems",
          "parameters": {"items": "{{selectedItems}}"},
          "expectedOutcome": "items_added_to_cart",
          "successCriteria": ["cart_total_updated", "inventory_reserved"]
        }
      ],
      "validation": [
        {
          "field": "cartTotal",
          "rule": "positive",
          "errorMessage": "Cart total must be positive",
          "severity": "error"
        }
      ],
      "timeout": 10000,
      "retry": {
        "maxAttempts": 2,
        "backoffStrategy": "linear",
        "baseDelay": 2000,
        "maxDelay": 5000
      }
    }
  ],
  "rollback": {
    "enabled": true,
    "steps": [
      {
        "targetStep": "add_items_to_cart",
        "system": "cart-service",
        "operation": "removeAllItems",
        "parameters": {"cartId": "{{cartId}}"}
      }
    ],
    "triggers": ["payment_failure", "inventory_unavailable"]
  },
  "monitoring": {
    "enabled": true,
    "metrics": ["completion_time", "success_rate", "step_failure_rate"],
    "alerts": [
      {
        "condition": "completion_time > 300000",
        "action": "send_alert",
        "recipients": ["ops-team@company.com"]
      }
    ]
  }
}
```

## Key Learning Points

### Complex Workflow Design Patterns

1. **State-Driven Workflows**: Use clear state transitions to track progress
2. **Multi-System Coordination**: Handle dependencies and integration points
3. **Error Handling and Recovery**: Implement comprehensive rollback mechanisms
4. **Long-Running Process Management**: Design for workflows that span extended timeframes

### Gherkin Patterns for Workflows

1. **Structured Data Tables**: Use tables to represent complex workflow steps
2. **State Transition Tracking**: Document expected state changes throughout the process
3. **Multi-Role Scenarios**: Handle different actors and their responsibilities
4. **Timeline-Based Steps**: Organize steps by time progression and dependencies

### Implementation Best Practices

1. **Workflow Manager**: Centralize workflow execution and state management
2. **System Coordination**: Abstract system interactions for reusability
3. **Monitoring and Observability**: Build in comprehensive tracking and alerting
4. **Configuration-Driven**: Use external configuration for workflow definitions

## Common Workflow Patterns

### Sequential Process
```gherkin
When I complete the employee onboarding process:
  | step | responsible_party | deliverables |
  | 1    | hr_coordinator   | welcome_package |
  | 2    | it_administrator | system_access |
  | 3    | manager          | workspace_setup |
```

### Parallel Process
```gherkin
When the following activities happen simultaneously:
  | activity | system | expected_duration |
  | payment_processing | payment-gateway | 30s |
  | inventory_allocation | warehouse-system | 45s |
  | shipping_calculation | logistics-service | 20s |
```

### Approval Workflow
```gherkin
When the loan application goes through approval workflow:
  | approval_level | reviewer | criteria | timeout |
  | level_1 | underwriter | standard_guidelines | 2_days |
  | level_2 | manager | policy_exceptions | 1_day |
  | level_3 | executive | high_value_loans | 3_days |
```

### Conditional Workflow
```gherkin
When order processing continues based on conditions:
  | condition | next_step | responsible_system |
  | amount < $100 | auto_approve | order-system |
  | amount >= $100 | manual_review | fraud-detection |
  | high_risk_customer | security_check | security-system |
```

## Summary

This example demonstrates sophisticated patterns for modeling complex, multi-step business workflows using Gherkin. The combination of structured data tables, state management, and workflow orchestration provides a robust foundation for testing enterprise-level business processes.

Key takeaways:
- Design workflows with clear state transitions and dependencies
- Use structured data tables to represent complex process steps
- Implement comprehensive error handling and rollback capabilities  
- Build monitoring and observability into workflow execution
- Create reusable workflow components and configurations

## Next Steps

- Practice implementing similar workflow patterns for your domain
- Experiment with different workflow orchestration strategies
- Consider how these patterns apply to your specific business processes
- Explore integration with workflow engines and business process management tools

## Exercises

Try creating workflow scenarios for:
1. **Customer Support Ticket Resolution**: Multi-stage support process with escalation
2. **Software Release Pipeline**: CI/CD workflow with multiple approval gates  
3. **Insurance Claims Processing**: Complex claims evaluation and settlement process
4. **Employee Performance Review**: Annual review cycle with multiple stakeholders