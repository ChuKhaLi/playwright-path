# Exercise 04: Multi-Step Workflow Creation

## Overview

In this exercise, you'll design and implement complex multi-step business workflows for a comprehensive enterprise resource planning (ERP) system. You'll work with sophisticated state management, cross-system integrations, approval workflows, and end-to-end business process automation spanning multiple departments and systems.

## Business Context

**GlobalCorp ERP** is an integrated enterprise system managing:
- Human Resources with employee lifecycle management and performance tracking
- Finance and Accounting with multi-currency transactions and regulatory reporting
- Supply Chain Management with vendor relationships and procurement workflows
- Customer Relationship Management with sales pipelines and service management
- Project Management with resource allocation and milestone tracking

## Learning Objectives

By completing this exercise, you will:
- Master complex multi-step workflow design with proper state management
- Implement cross-system integration patterns with error handling and rollback
- Create sophisticated approval workflows with role-based authorization
- Handle complex business rules and conditional logic in workflow scenarios
- Design fault-tolerant workflows with proper error recovery and compensation
- Integrate real-time monitoring and reporting throughout workflow execution

## Requirements

### Business Process Requirements

1. **Employee Onboarding Workflow**
   - Multi-department coordination with HR, IT, Finance, and Facilities
   - Document collection and verification with legal compliance
   - System access provisioning with security clearance validation
   - Equipment allocation and workspace assignment
   - Training program enrollment and progress tracking

2. **Purchase Requisition to Payment Workflow**
   - Multi-level approval process based on amount and category thresholds
   - Vendor selection and contract negotiation management
   - Goods receipt validation and quality control integration
   - Invoice processing with three-way matching
   - Payment processing with fraud detection and compliance validation

3. **Customer Order Fulfillment Workflow**
   - Order validation with credit checking and inventory allocation
   - Manufacturing or procurement coordination for custom orders
   - Quality assurance and testing for regulated products
   - Logistics coordination with multiple shipping providers
   - Customer communication and satisfaction tracking

### Technical Requirements

1. **Workflow State Management**
   - Complex state transitions with proper validation
   - State persistence across system failures and restarts
   - Parallel workflow execution with synchronization points
   - Rollback and compensation patterns for error scenarios

2. **Integration Patterns**
   - API orchestration across multiple systems
   - Message queue integration for asynchronous processing
   - Database transaction management across distributed systems
   - External service integration with timeout and retry patterns

3. **Monitoring and Reporting**
   - Real-time workflow progress tracking
   - Performance metrics and SLA monitoring
   - Exception handling and alerting
   - Audit trail maintenance for compliance

## Implementation Tasks

### Task 1: Employee Onboarding Multi-Step Workflow

Design a comprehensive employee onboarding workflow that coordinates multiple departments and systems.

**Implementation Guide:**

```gherkin
@workflow:onboarding @process:human-resources @complexity:high @duration:long
Feature: Employee Onboarding Workflow
  As an HR manager
  I want to automate the employee onboarding process
  So that new employees can be efficiently integrated into the organization

Background: Onboarding System Initialization
  Given the employee onboarding system is operational
  And the following departments are available for coordination:
    | department | contact_person | sla_response_time | approval_required |
    | HR | sarah.smith@company.com | 4_hours | true |
    | IT | tech.support@company.com | 2_hours | false |
    | Finance | accounting@company.com | 8_hours | true |
    | Facilities | facilities@company.com | 24_hours | false |
    | Legal | legal@company.com | 24_hours | true |
    | Security | security@company.com | 8_hours | true |
  And approval workflow rules are configured:
    | approval_type | required_roles | escalation_time | auto_approve_conditions |
    | security_clearance | security_manager,hr_director | 48_hours | employee_level:standard |
    | equipment_allocation | it_manager | 24_hours | cost<1000 |
    | workspace_assignment | facilities_manager | 24_hours | standard_cubicle |
    | system_access | it_security,department_head | 12_hours | standard_permissions |

@workflow:onboarding @step:initiation @priority:critical
Scenario: Employee onboarding workflow initiation and validation
  Given a new employee record has been created with the following details:
    | field | value |
    | employee_id | EMP2024001 |
    | full_name | John Smith |
    | department | Engineering |
    | position | Senior Software Engineer |
    | start_date | 2024-08-15 |
    | security_level | Standard |
    | equipment_needs | laptop:high-performance,monitor:dual,phone:mobile |
    | workspace_type | open_office |
    | manager | jane.doe@company.com |
  When the onboarding workflow is initiated
  Then the workflow should be assigned a unique tracking ID
  And initial validation should confirm all required information is present
  And workflow status should be set to "initiated"
  And notifications should be sent to all relevant departments
  And SLA timers should be started for each department's tasks

@workflow:onboarding @step:documentation @department:hr @parallel:true
Scenario: Document collection and verification step
  Given the onboarding workflow is in "initiated" status
  And HR department has received the onboarding notification
  When HR begins the document collection process
  Then the following documents should be requested from the employee:
    | document_type | required | verification_method | retention_period |
    | government_id | true | manual_review | permanent |
    | tax_forms | true | automated_validation | 7_years |
    | emergency_contacts | true | manual_review | employment_duration |
    | direct_deposit | true | bank_verification | employment_duration |
    | background_check_consent | true | legal_review | permanent |
  And document upload portal should be activated for the employee
  And document verification workflow should be initiated in parallel
  And workflow status should be updated to "documents_pending"

@workflow:onboarding @step:workflow-completion @orchestration:final @validation:comprehensive
Scenario: Onboarding workflow completion and validation
  Given all parallel workflow steps have completed successfully:
    | step_name | completion_status | validation_method |
    | documentation | completed | all_documents_verified |
    | security_clearance | approved | background_check_passed |
    | system_provisioning | completed | all_accounts_active |
    | financial_setup | completed | payroll_system_updated |
    | training_enrollment | scheduled | programs_assigned |
  When final workflow validation is performed
  Then comprehensive onboarding checklist should be generated
  And manager should be notified of employee readiness
  And first-day schedule should be automatically created
  And follow-up tasks should be scheduled:
    | follow_up_task | timing | responsible_party |
    | 30_day_check_in | 30_days | hr_representative |
    | 90_day_review | 90_days | direct_manager |
    | training_completion_validation | 90_days | hr_training |
  And workflow should be marked as "completed"
  And audit trail should be finalized and archived
```

### Task 2: Purchase Requisition to Payment Workflow

Implement a complex procurement workflow with multi-level approvals and three-way matching.

```gherkin
@workflow:procurement @process:purchase-to-pay @complexity:very-high @integration:multiple-systems
Feature: Purchase Requisition to Payment Workflow
  As a procurement manager
  I want to automate the complete purchase-to-pay process
  So that purchases are properly authorized, validated, and paid efficiently

Background: Procurement System Configuration
  Given the procurement system is fully operational
  And approval hierarchies are configured:
    | approval_level | amount_threshold | required_approvers | escalation_time |
    | department_manager | 0-5000 | department_head | 24_hours |
    | director_approval | 5001-25000 | director,finance_manager | 48_hours |  
    | executive_approval | 25001-100000 | vp,cfo | 72_hours |
    | board_approval | 100000+ | board_committee | 1_week |
  And vendor management system contains:
    | vendor_id | name | category | payment_terms | quality_rating | compliance_status |
    | VEN001 | Office Supplies Plus | office_supplies | NET_30 | 4.5 | compliant |
    | VEN002 | TechEquipment Corp | technology | NET_45 | 4.8 | compliant |
    | VEN003 | Professional Services LLC | consulting | NET_15 | 4.2 | pending_review |

@workflow:procurement @step:requisition @validation:business-rules
Scenario: Purchase requisition creation and initial validation
  Given an employee needs to purchase items for their department
  When they create a purchase requisition with the following details:
    | field | value |
    | requisition_id | REQ2024001 |
    | requestor | john.smith@company.com |
    | department | Engineering |
    | cost_center | ENG001 |
    | total_amount | 15000.00 |
    | currency | USD |
    | required_by_date | 2024-09-15 |
    | items | laptop:3:4000.00,software_licenses:10:300.00 |
    | business_justification | team_expansion_q3 |
  Then the system should validate:
    | validation_rule | expected_result |
    | budget_availability | sufficient_budget_confirmed |
    | requestor_authorization | authorized_for_cost_center |
    | vendor_compliance | approved_vendors_only |
    | item_specifications | meets_company_standards |
  And approval workflow should be determined based on total amount
  And requisition should be assigned to appropriate approval queue
  And requestor should receive confirmation with tracking information

@workflow:procurement @step:approval @orchestration:sequential @escalation:automatic
Scenario: Multi-level approval workflow with escalation
  Given purchase requisition REQ2024001 requires director-level approval
  And the approval hierarchy is properly configured
  When the approval process is initiated
  Then approval request should be sent to department head first
  And approval timeout timer should be started (24 hours)
  And if department head approval is received within SLA:
    | next_step | responsible_party | timeout |
    | director_approval | engineering_director | 48_hours |
    | finance_approval | finance_manager | 48_hours |
  And if any approval times out:
    | escalation_action | responsible_party | notification_method |
    | escalate_to_next_level | next_approval_level | email,slack |
    | notify_requestor | original_requestor | email |
    | flag_for_review | procurement_manager | dashboard_alert |
  And approval decisions should include:
    | decision_data | required_fields |
    | approval_status | approved,rejected,conditional |
    | approver_comments | free_text |
    | conditions | if_conditional_approval |
    | budget_impact | updated_budget_allocation |

@workflow:procurement @step:workflow-completion @reporting:comprehensive @audit:compliance
Scenario: Procurement workflow completion and reporting
  Given payment has been successfully processed
  And all workflow steps have completed without exceptions
  When workflow completion validation is performed
  Then comprehensive audit trail should be generated:
    | audit_element | data_captured | retention_period |
    | approval_chain | all_approvers_decisions | 7_years |
    | vendor_selection | evaluation_criteria_scoring | 5_years |
    | financial_transactions | all_monetary_movements | permanent |
    | compliance_validations | all_compliance_checks | regulatory_requirement |
  And performance metrics should be calculated:
    | metric | calculation_method | reporting_frequency |
    | cycle_time | requisition_to_payment | monthly |
    | approval_efficiency | average_approval_time | weekly |
    | vendor_performance | delivery_quality_metrics | quarterly |
    | cost_savings | budget_vs_actual | monthly |
  And workflow should be marked as completed
  And lessons learned should be captured for process improvement
```

### Task 3: Customer Order Fulfillment Workflow

Design end-to-end order fulfillment with manufacturing coordination and quality assurance.

```gherkin
@workflow:order-fulfillment @process:order-to-cash @complexity:very-high @manufacturing:integrated
Feature: Customer Order Fulfillment Workflow
  As a sales operations manager
  I want to automate the complete order fulfillment process
  So that customer orders are efficiently processed from receipt to delivery

Background: Order Management System Setup
  Given the order management system is operational
  And manufacturing capabilities are configured:
    | product_line | manufacturing_location | capacity | lead_time | quality_requirements |
    | electronics | factory_north | 1000_units_day | 5_days | iso9001,rohs |
    | custom_solutions | factory_south | 50_units_day | 15_days | custom_testing |
    | software_licenses | digital_delivery | unlimited | immediate | automated_validation |
  And quality control processes are defined:
    | product_category | inspection_type | sample_size | criteria | escalation |
    | regulated_devices | full_inspection | 100% | zero_defects | quality_manager |
    | standard_products | statistical_sampling | 5% | 99.5%_pass_rate | production_supervisor |
    | software_products | automated_testing | 100% | all_tests_pass | dev_team |

@workflow:order-fulfillment @step:order-validation @integration:crm @validation:comprehensive
Scenario: Customer order receipt and comprehensive validation
  Given a customer has submitted an order through the sales system
  When order validation process is initiated for order ORD2024001:
    | order_field | value |
    | customer_id | CUST001 |
    | order_total | 45000.00 |
    | currency | USD |
    | requested_delivery | 2024-09-30 |
    | products | PROD_A:10:3000.00,PROD_B:5:3000.00 |
    | shipping_address | 123_Business_Park,City,State |
    | payment_terms | NET_30 |
    | special_requirements | custom_configuration,expedited_shipping |
  Then comprehensive validation should be performed:
    | validation_type | check_performed | action_if_failed |
    | customer_credit | credit_limit_vs_outstanding | credit_hold |
    | product_availability | inventory_vs_manufacturing | backorder_processing |
    | pricing_accuracy | current_pricing_vs_quoted | pricing_review |
    | configuration_validity | technical_specifications | engineering_review |
    | compliance_requirements | regulatory_for_destination | compliance_check |
  And order should be assigned priority based on:
    | priority_factor | weight | calculation_method |
    | customer_tier | 30% | premium_enterprise_standard |
    | order_value | 25% | revenue_impact |
    | delivery_urgency | 25% | requested_vs_standard |
    | strategic_importance | 20% | account_manager_input |

@workflow:order-fulfillment @step:delivery-confirmation @customer:communication @satisfaction:tracking
Scenario: Delivery confirmation and customer satisfaction tracking
  Given shipment has been dispatched with tracking information
  When delivery confirmation is received
  Then delivery validation should be performed:
    | validation_check | data_source | action_if_failed |
    | recipient_confirmation | signature_capture | investigation_required |
    | delivery_location | gps_coordinates | address_verification |
    | condition_upon_delivery | delivery_photos | damage_claim |
    | complete_shipment | item_verification | missing_item_investigation |
  And customer communication should be automated:
    | communication_type | timing | content_personalization |
    | delivery_notification | immediate | tracking_details |
    | satisfaction_survey | 24_hours_post_delivery | order_specific |
    | support_information | with_notification | product_specific |
    | upsell_opportunities | 1_week_post_delivery | purchase_history_based |
  And satisfaction metrics should be tracked:
    | satisfaction_metric | measurement_method | target_threshold |
    | delivery_time_satisfaction | customer_survey | above_4.0_of_5 |
    | product_quality_rating | customer_feedback | above_4.5_of_5 |
    | overall_experience | nps_score | above_50 |
    | likelihood_to_reorder | survey_question | above_70% |
```

## Implementation Requirements

### Step Definition Patterns

```typescript
// Complex workflow step definitions with state management

Given('the {string} workflow is in {string} status', async function(workflowType, status) {
  this.workflowContext = await this.workflowService.getWorkflowStatus(workflowType, status);
  expect(this.workflowContext.currentStatus).to.equal(status);
});

When('the {string} process is initiated', async function(processName) {
  this.processResult = await this.workflowOrchestrator.initiateProcess(
    processName,
    this.workflowContext,
    this.processData
  );
});

Then('workflow should be assigned to {string} queue', async function(queueName) {
  expect(this.processResult.assignedQueue).to.equal(queueName);
  const queueStatus = await this.queueService.getQueueStatus(queueName);
  expect(queueStatus.pendingItems).to.include(this.processResult.workflowId);
});
```

### Configuration Examples

```yaml
# Workflow orchestration configuration
workflows:
  employee_onboarding:
    timeout: 30_days
    parallel_steps: 
      - documentation
      - it_provisioning
      - training_enrollment
    sequential_dependencies:
      - security_clearance_after: documentation
      - system_access_after: security_clearance
    
  procurement:
    timeout: 60_days
    approval_required: true
    three_way_matching: true
    fraud_detection: enabled
    
  order_fulfillment:
    timeout: 45_days
    manufacturing_integration: true
    quality_gates: mandatory
    customer_communication: automated
```

## Verification Steps

### Workflow Execution
1. **End-to-End Workflow Testing**
   ```bash
   npm run test:workflow -- --tags "@workflow:onboarding"
   ```

2. **Parallel Process Validation**
   ```bash
   npm run test:parallel -- --tags "@parallel:true"
   ```

3. **Error Recovery Testing**
   ```bash
   npm run test:resilience -- --tags "@error-recovery"
   ```

### Success Criteria
- [ ] Multi-step workflows execute in correct sequence with proper state management
- [ ] Parallel processes coordinate effectively with synchronization points
- [ ] Error scenarios trigger appropriate rollback and compensation actions
- [ ] Cross-system integrations maintain data consistency throughout workflow
- [ ] Performance targets are met for workflow execution times
- [ ] Audit trails capture all workflow decisions and state transitions

## Extension Challenges

### Challenge 1: Workflow Versioning and Migration
Implement system that supports workflow versioning with in-flight workflow migration capabilities.

### Challenge 2: Machine Learning Integration
Add predictive analytics that optimize workflow routing and resource allocation based on historical data.

### Challenge 3: Real-time Collaboration
Implement real-time collaboration features that allow multiple stakeholders to work on workflow steps simultaneously.

### Challenge 4: Blockchain Integration
Add blockchain-based audit trails for workflows requiring immutable compliance records.

## Assessment Rubric

| Criteria | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|----------|---------------|----------|------------------|---------------------|
| Workflow Complexity | Sophisticated multi-step workflows with proper orchestration | Good workflow design with minor coordination issues | Basic workflow implementation with some gaps | Simple or poorly designed workflow patterns |
| State Management | Robust state management with proper persistence and recovery | Good state handling with minor issues | Basic state management with some limitations | Poor or missing state management |
| Error Handling | Comprehensive error recovery with rollback and compensation | Good error handling with most scenarios covered | Basic error handling with some gaps | Missing or inadequate error handling |
| Integration Patterns | Seamless cross-system integration with proper transaction management | Good integration with minor issues | Basic integration with some limitations | Poor or missing system integration |
| Performance Optimization | Excellent performance with optimized execution paths | Good performance with minor bottlenecks | Adequate performance with some issues | Poor performance or significant bottlenecks |

## Submission Requirements

1. **Complete Workflow Implementation**
   - Multi-step workflow scenarios with comprehensive business logic
   - State management and persistence mechanisms
   - Error handling and recovery patterns
   - Cross-system integration implementations

2. **Supporting Infrastructure**
   - Workflow orchestration utilities
   - State management and persistence layers
   - Integration adapters and API clients
   - Monitoring and reporting capabilities

3. **Documentation and Analysis**
   - Workflow design documentation and decision rationale
   - Performance analysis and optimization recommendations
   - Error scenario analysis and recovery procedures
   - Integration architecture and data flow documentation

## Next Steps

After completing this exercise:
1. Evaluate how multi-step workflow patterns can improve your current business processes
2. Consider implementing workflow orchestration in your existing systems
3. Assess opportunities for automating complex business processes in your organization
4. Apply these patterns to real-world scenarios in your current projects

Remember: The goal is to create maintainable, scalable workflow patterns that can handle the complexity of real-world business processes while ensuring reliability, performance, and proper error handling.