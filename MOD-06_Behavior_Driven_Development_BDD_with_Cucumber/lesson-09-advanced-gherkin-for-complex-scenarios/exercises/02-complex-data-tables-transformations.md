# Exercise 02: Complex Data Tables and Transformations

## Overview

In this exercise, you'll implement sophisticated data handling patterns for an enterprise inventory management system. You'll work with multi-dimensional data tables, custom data transformers, complex validation patterns, and API payload transformation for a comprehensive supply chain management platform.

## Business Context

**SupplyChain Pro** is an enterprise inventory management system that handles:
- Multi-location inventory tracking with complex product hierarchies
- Dynamic pricing with bulk discounts and regional variations
- Supplier integration with automated purchase order generation
- Quality control workflows with batch tracking and compliance validation
- Real-time reporting with cross-dimensional data analysis

## Learning Objectives

By completing this exercise, you will:
- Master complex data table patterns for multi-dimensional business data
- Implement custom data transformers for business logic validation
- Handle nested data structures and hierarchical relationships
- Create dynamic data generation patterns for realistic test scenarios
- Integrate API testing with complex payload transformation
- Manage state across complex business workflow scenarios

## Requirements

### Functional Requirements

1. **Product Management**
   - Multi-level product categories with attributes and variants
   - Dynamic pricing structures with time-based rules
   - Inventory tracking across multiple warehouses and locations
   - Product bundling and kit management capabilities

2. **Supplier Integration**
   - Multiple supplier relationships with different terms
   - Automated purchase order generation based on inventory levels
   - Quality control workflows with batch tracking
   - Compliance validation for regulatory requirements

3. **Pricing and Promotions**
   - Complex pricing matrices with volume discounts
   - Regional pricing variations and currency conversion
   - Time-limited promotions with eligibility rules
   - Customer-specific pricing and contract terms

4. **Reporting and Analytics**
   - Multi-dimensional data analysis across products, locations, and time
   - Performance metrics with configurable thresholds
   - Trend analysis with predictive capabilities
   - Export capabilities in multiple formats

### Technical Requirements

1. **Data Table Complexity**
   - Multi-dimensional tables with nested relationships
   - Dynamic data generation based on business rules
   - Custom validation patterns for business constraints
   - Hierarchical data structures with parent-child relationships

2. **Transformation Patterns**
   - Custom data transformers for business entities
   - API payload transformation and validation
   - Data normalization and format conversion
   - Complex business rule implementation

3. **Integration Testing**
   - Database state validation with complex queries
   - API endpoint testing with multi-step workflows
   - External service integration and mock management
   - Performance testing with realistic data volumes

## Implementation Tasks

### Task 1: Multi-Dimensional Product Catalog

Create complex data tables that represent sophisticated product hierarchies and relationships.

**Implementation Guide:**

1. **Product Hierarchy Data Structure**
```gherkin
@inventory @product-management @data-intensive
Scenario: Complex product catalog management with hierarchical data
  Given the following product categories are configured in the system:
    | category_id | name | parent_category | attributes | tax_category | compliance_required |
    | CAT001 | Electronics | null | brand,model,warranty | electronics | true |
    | CAT002 | Computers | CAT001 | processor,memory,storage | electronics | true |
    | CAT003 | Laptops | CAT002 | screen_size,weight,battery_life | electronics | true |
    | CAT004 | Gaming_Laptops | CAT003 | graphics_card,cooling_system,rgb_lighting | electronics | true |
    | CAT005 | Home_Appliances | null | energy_rating,dimensions,color | appliances | false |
    | CAT006 | Kitchen | CAT005 | capacity,power_consumption,material | appliances | true |
  
  And the following products exist with complex variant structures:
    | product_id | name | category_id | base_price | cost | variants | attributes | supplier_ids |
    | PROD001 | Gaming Laptop Pro | CAT004 | 1999.99 | 1400.00 | size:15inch,17inch;color:black,silver;storage:512GB,1TB | processor:Intel_i7,graphics:RTX_4070,memory:16GB | SUP001,SUP002 |
    | PROD002 | Coffee Machine Deluxe | CAT006 | 399.99 | 280.00 | capacity:8cup,12cup;color:black,white,steel | power:1200W,material:stainless_steel,features:programmable | SUP003 |
    | PROD003 | Smartphone Elite | CAT001 | 899.99 | 630.00 | storage:128GB,256GB,512GB;color:blue,black,gold | screen:6.5inch,battery:4000mAh,camera:108MP | SUP001,SUP004 |

  And complex pricing rules are defined:
    | rule_id | product_id | rule_type | conditions | adjustments | validity_period | customer_segments |
    | RULE001 | PROD001 | volume_discount | quantity>=5 | discount:10%;quantity>=10:15% | 2024-01-01:2024-12-31 | business,education |
    | RULE002 | PROD002 | seasonal_promotion | season:holiday | discount:20%;free_shipping:true | 2024-11-01:2024-12-31 | all |
    | RULE003 | PROD003 | bundle_offer | bundle_with:PROD001 | discount:5%;warranty_extension:1year | 2024-06-01:2024-08-31 | premium |

  When I request product information with pricing for <customer_segment> customer
  And I specify quantity of <quantity> for product <product_id>
  And I request delivery to <region> during <time_period>
  Then the system should return complete product details with variant options
  And pricing should be calculated with applicable discounts and regional adjustments
  And inventory availability should be validated across all relevant warehouses
  And compliance requirements should be verified for the target region

Examples: Product Catalog Queries
  | customer_segment | quantity | product_id | region | time_period |
  | business | 8 | PROD001 | US_West | 2024-07-15 |
  | education | 12 | PROD001 | EU_Central | 2024-09-01 |
  | retail | 1 | PROD002 | US_East | 2024-11-15 |
  | premium | 2 | PROD003 | Asia_Pacific | 2024-06-30 |
```

2. **Multi-Location Inventory Data**
```gherkin
@inventory @multi-location @warehouse-management
Scenario: Complex inventory tracking across multiple locations
  Given the following warehouse locations are configured:
    | warehouse_id | name | region | capabilities | capacity_limits | operating_hours |
    | WH001 | West_Coast_Main | US_West | standard_storage,climate_controlled,hazmat | electronics:10000,appliances:5000 | 24x7 |
    | WH002 | East_Coast_Hub | US_East | standard_storage,expedited_shipping | electronics:8000,appliances:3000 | 6am-10pm |
    | WH003 | European_Center | EU_Central | standard_storage,customs_handling,multi_currency | electronics:12000,appliances:6000 | 8am-8pm |
    | WH004 | Asia_Pacific_Hub | Asia_Pacific | standard_storage,climate_controlled,local_compliance | electronics:15000,appliances:8000 | 24x7 |

  And current inventory levels are:
    | warehouse_id | product_id | variant | quantity_available | quantity_reserved | quantity_incoming | reorder_point | max_stock_level |
    | WH001 | PROD001 | 15inch_black_512GB | 45 | 12 | 20 | 25 | 100 |
    | WH001 | PROD001 | 17inch_silver_1TB | 23 | 8 | 15 | 15 | 75 |
    | WH002 | PROD002 | 8cup_black | 156 | 23 | 50 | 50 | 300 |
    | WH003 | PROD003 | 256GB_blue | 89 | 15 | 30 | 40 | 200 |
    | WH004 | PROD001 | 15inch_black_512GB | 67 | 20 | 25 | 30 | 120 |

  And the following supplier relationships exist:
    | supplier_id | name | lead_time_days | minimum_order | payment_terms | quality_rating | compliance_certified |
    | SUP001 | TechSupply Global | 14 | 10000 | NET_30 | 4.8 | ISO9001,RoHS |
    | SUP002 | Component Direct | 21 | 5000 | NET_45 | 4.5 | ISO9001 |
    | SUP003 | Appliance Wholesale | 10 | 15000 | NET_15 | 4.9 | ISO9001,Energy_Star |
    | SUP004 | Mobile Tech Partners | 18 | 8000 | NET_30 | 4.7 | ISO9001,FCC |

  When I process an order for <order_details>
  And delivery is required to <delivery_region> by <required_date>
  And customer payment terms are <payment_terms>
  Then inventory should be allocated from optimal warehouse locations
  And supplier purchase orders should be generated if stock levels require replenishment
  And compliance requirements should be validated for target region
  And delivery timeline should be calculated considering all constraints

Examples: Complex Order Processing
  | order_details | delivery_region | required_date | payment_terms |
  | PROD001:15inch_black_512GB:30,PROD003:256GB_blue:15 | US_West | 2024-07-30 | NET_30 |
  | PROD002:12cup_steel:50 | EU_Central | 2024-08-15 | NET_15 |
  | PROD001:17inch_silver_1TB:100 | Asia_Pacific | 2024-09-01 | NET_45 |
```

### Task 2: Custom Data Transformers

Implement sophisticated data transformation patterns for business logic validation.

**Implementation Guide:**

1. **Price Calculation Transformer**
```typescript
// features/support/transformers/price-transformer.ts
export class PriceTransformer {
  async transformPricingData(productData: any, context: PricingContext): Promise<PricingResult> {
    // Complex pricing transformation logic
    const basePrice = this.calculateBasePrice(productData);
    const volumeDiscounts = this.applyVolumeDiscounts(basePrice, context.quantity);
    const regionalAdjustments = this.applyRegionalPricing(volumeDiscounts, context.region);
    const seasonalPromotions = this.applyPromotions(regionalAdjustments, context.timeframe);
    
    return {
      finalPrice: seasonalPromotions.price,
      discounts: seasonalPromotions.discounts,
      taxes: this.calculateTaxes(seasonalPromotions.price, context.region),
      breakdown: seasonalPromotions.breakdown
    };
  }
}
```

2. **Inventory Allocation Transformer**
```gherkin
@inventory @allocation @complex-transformation
Scenario: Complex inventory allocation with business rules
  Given the following allocation rules are configured:
    | rule_id | priority | conditions | allocation_strategy | constraints |
    | ALLOC001 | 1 | customer_segment:premium | closest_warehouse_first | max_split:2 |
    | ALLOC002 | 2 | order_value>10000 | cost_optimal | allow_backorder:false |
    | ALLOC003 | 3 | delivery_urgency:expedited | fastest_fulfillment | ignore_cost |
    | ALLOC004 | 4 | product_category:electronics | climate_controlled_preferred | quality_rating>4.5 |

  And current warehouse performance metrics:
    | warehouse_id | avg_processing_time | shipping_cost_factor | quality_score | current_capacity_utilization |
    | WH001 | 2.5_hours | 1.0 | 4.8 | 75% |
    | WH002 | 3.2_hours | 1.2 | 4.6 | 60% |
    | WH003 | 4.1_hours | 1.8 | 4.9 | 85% |
    | WH004 | 1.8_hours | 2.2 | 4.7 | 45% |

  When I transform the order allocation for <order_profile>
  And apply business rules for <customer_context>
  Then inventory should be allocated using <expected_strategy>
  And allocation should respect <business_constraints>
  And cost optimization should achieve <cost_target>
  And delivery timeline should meet <service_level>

Examples: Allocation Transformation Rules
  | order_profile | customer_context | expected_strategy | business_constraints | cost_target | service_level |
  | high_value_electronics | premium_customer | closest_warehouse_with_climate_control | max_2_locations | within_10%_optimal | next_day_capable |
  | bulk_appliances | business_customer | cost_optimal_single_location | single_warehouse_preferred | minimize_shipping | standard_delivery |
  | urgent_replacement | service_contract | fastest_available | ignore_cost_constraints | accept_premium | same_day_required |
```

### Task 3: API Integration with Complex Payloads

Create scenarios that test complex API interactions with sophisticated data transformation.

```gherkin
@api-integration @complex-payloads @purchase-orders
Scenario: Automated purchase order generation with complex business logic
  Given the following supplier integration configurations:
    | supplier_id | api_endpoint | auth_method | payload_format | business_rules | sla_requirements |
    | SUP001 | https://api.techsupply.com/v2/orders | api_key | json_structured | min_order:10000,lead_time:14days | response_time:30s |
    | SUP002 | https://partner.componentdirect.com/purchase | oauth2 | xml_formatted | min_order:5000,batch_required:true | response_time:60s |
    | SUP003 | https://wholesale.appliance.net/orders | basic_auth | json_flat | payment_terms:NET_15,quality_cert_required:true | response_time:45s |

  And current inventory triggers require replenishment:
    | product_id | current_stock | reorder_point | optimal_order_qty | preferred_supplier | alternative_suppliers |
    | PROD001 | 15 | 25 | 75 | SUP001 | SUP002 |
    | PROD002 | 35 | 50 | 100 | SUP003 | none |
    | PROD003 | 20 | 40 | 60 | SUP001 | SUP004 |

  When the system generates purchase orders for <replenishment_scenario>
  And applies business rules for <optimization_criteria>
  And formats payloads according to <supplier_requirements>
  Then API calls should be made with properly transformed data
  And supplier responses should be validated and processed
  And inventory forecasting should be updated with expected delivery dates
  And purchase order tracking should be initiated with milestone monitoring

Examples: Purchase Order Generation
  | replenishment_scenario | optimization_criteria | supplier_requirements |
  | automated_low_stock_trigger | cost_optimization_primary | SUP001:json_structured,SUP003:json_flat |
  | demand_forecast_based | availability_speed_priority | SUP001:json_structured,SUP002:xml_formatted |
  | emergency_stock_replenishment | fastest_delivery_critical | all_available_suppliers |
```

### Task 4: Performance and Load Testing Integration

Implement data-driven performance testing scenarios.

```gherkin
@performance @load-testing @data-intensive
Scenario: System performance under complex data load scenarios
  Given the following performance test configurations:
    | test_scenario | concurrent_users | data_complexity | operation_mix | duration | success_criteria |
    | normal_load | 50 | medium | read:70%,write:20%,complex:10% | 300s | response_time<2s,error_rate<1% |
    | peak_load | 200 | high | read:60%,write:25%,complex:15% | 600s | response_time<5s,error_rate<3% |
    | stress_test | 500 | very_high | read:50%,write:30%,complex:20% | 900s | system_stable,error_rate<10% |

  And complex data generation patterns:
    | data_type | generation_pattern | relationship_complexity | update_frequency | validation_rules |
    | product_catalog | hierarchical_tree | 5_levels_deep | every_10s | referential_integrity |
    | inventory_updates | time_series_realistic | multi_location_sync | every_5s | stock_level_consistency |
    | pricing_calculations | rule_based_dynamic | conditional_matrix | every_30s | business_rule_compliance |
    | order_processing | workflow_simulation | multi_step_approval | continuous | end_to_end_validation |

  When I execute performance tests with <load_pattern>
  And monitor system behavior under <data_complexity>
  And validate <business_constraints> are maintained
  Then response times should meet <performance_targets>
  And data consistency should be maintained across <complexity_dimensions>
  And system should recover gracefully from <stress_conditions>

Examples: Performance Testing Scenarios
  | load_pattern | data_complexity | business_constraints | performance_targets | complexity_dimensions | stress_conditions |
  | gradual_ramp_up | realistic_production_data | pricing_accuracy_maintained | 95th_percentile<3s | multi_location,multi_currency | database_connection_limits |
  | spike_testing | synthetic_high_volume | inventory_consistency_required | average<2s,max<10s | hierarchical_products,complex_pricing | memory_pressure |
  | sustained_load | mixed_realistic_synthetic | compliance_validation_active | steady_state<1.5s | cross_warehouse,multi_supplier | cpu_intensive_operations |
```

### Task 5: Implementation Requirements

**Step Definition Patterns:**

```typescript
// Key implementation patterns for features/step-definitions/

Given('the following product categories are configured in the system:', async function(dataTable) {
  const categories = dataTable.hashes();
  for (const category of categories) {
    await this.catalogService.createCategory({
      id: category.category_id,
      name: category.name,
      parentId: category.parent_category === 'null' ? null : category.parent_category,
      attributes: category.attributes.split(','),
      taxCategory: category.tax_category,
      complianceRequired: category.compliance_required === 'true'
    });
  }
});

When('I transform the order allocation for {string}', async function(orderProfile) {
  const transformer = new InventoryAllocationTransformer();
  this.allocationResult = await transformer.allocateInventory(
    this.orderData,
    this.allocationRules,
    this.warehouseMetrics
  );
});

Then('inventory should be allocated using {string}', async function(expectedStrategy) {
  expect(this.allocationResult.strategy).to.equal(expectedStrategy);
  expect(this.allocationResult.allocations).to.have.length.greaterThan(0);
});
```

## Verification Steps

### Test Execution
1. **Complex Data Processing**
   ```bash
   npm run test -- --tags "@data-intensive"
   ```

2. **API Integration Testing**
   ```bash
   npm run test:api -- --tags "@api-integration"
   ```

3. **Performance Validation**
   ```bash
   npm run test:performance -- --tags "@performance"
   ```

### Success Criteria
- [ ] Multi-dimensional data tables process correctly with proper relationships
- [ ] Custom transformers handle complex business logic accurately
- [ ] API integrations work with sophisticated payload transformations
- [ ] Performance tests validate system behavior under realistic data loads
- [ ] Data consistency maintained across complex operations
- [ ] Business rules properly implemented and validated

## Extension Challenges

### Challenge 1: Real-time Data Synchronization
Implement scenarios that test real-time data synchronization across multiple warehouses with conflict resolution.

### Challenge 2: Advanced Analytics Integration
Add complex reporting scenarios that validate multi-dimensional data analysis and trend calculations.

### Challenge 3: Machine Learning Integration
Implement scenarios that test demand forecasting and automated replenishment based on ML predictions.

### Challenge 4: Blockchain Integration
Add scenarios for supply chain transparency and traceability using blockchain-based verification.

## Common Issues and Solutions

### Issue: Complex Data Table Performance
**Problem:** Large data tables cause scenario execution to be slow  
**Solution:** Implement data setup optimization with bulk operations and database fixtures

### Issue: Data Transformation Complexity
**Problem:** Complex business rules are difficult to test and maintain  
**Solution:** Create modular transformation utilities with unit test coverage

### Issue: API Payload Complexity
**Problem:** Different supplier APIs require different payload formats  
**Solution:** Implement adapter pattern with configurable transformation rules

### Issue: State Management Across Complex Workflows
**Problem:** Managing state across multi-step business processes  
**Solution:** Implement workflow state management with proper cleanup and rollback capabilities

## Assessment Rubric

| Criteria | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|----------|---------------|----------|------------------|---------------------|
| Data Table Complexity | Sophisticated multi-dimensional tables with proper relationships | Good use of complex data with minor gaps | Basic complex data handling | Limited or incorrect data table usage |
| Transformation Logic | Comprehensive custom transformers with robust business logic | Good transformation patterns with most scenarios covered | Basic transformation with some limitations | Missing or inadequate transformation logic |
| API Integration | Seamless API testing with complex payload handling | Good API integration with minor issues | Basic API testing with some gaps | Limited or problematic API integration |
| Performance Testing | Comprehensive performance validation with realistic scenarios | Good performance testing with most aspects covered | Basic performance validation | Missing or inadequate performance testing |
| Code Architecture | Excellent modular design with maintainable patterns | Good structure with minor improvements needed | Adequate architecture with some issues | Poor structure or maintainability concerns |

## Submission Requirements

1. **Complete Implementation**
   - Feature files with sophisticated data table patterns
   - Custom transformer implementations with business logic
   - API integration scenarios with payload transformation
   - Performance testing scenarios with realistic data loads

2. **Supporting Code**
   - Custom data transformers and utilities
   - API client implementations with proper error handling
   - Performance testing configuration and monitoring
   - Database setup and cleanup utilities

3. **Documentation**
   - Implementation approach explanation
   - Business logic documentation
   - Performance testing results and analysis
   - Lessons learned and optimization recommendations

## Next Steps

After completing this exercise:
1. Analyze performance characteristics of your data transformation patterns
2. Consider how complex data scenarios apply to your current business domain
3. Evaluate opportunities for optimizing data handling in existing test suites
4. Prepare for Exercise 03 by reviewing advanced tagging and organization concepts

Remember: Focus on creating maintainable, scalable patterns that can handle the complexity of real-world business data while maintaining test reliability and performance.