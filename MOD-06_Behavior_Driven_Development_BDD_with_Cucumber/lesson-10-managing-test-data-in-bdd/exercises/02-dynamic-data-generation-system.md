# Exercise 02: Dynamic Data Generation System

## 📋 Problem Statement

Building on your foundational data factory system, you now need to implement sophisticated dynamic data generation capabilities for a healthcare management platform. The system must generate realistic, compliant test data that follows complex business rules, supports multiple data personas, and integrates seamlessly with external data validation systems.

**Business Context**: Your healthcare platform handles sensitive patient data, insurance claims, and medical records. Test scenarios require realistic data that maintains referential integrity, follows healthcare industry standards (HL7 FHIR), and supports complex workflows like patient admission, treatment planning, and insurance processing.

## 🎯 Learning Objectives

By completing this exercise, you will:

1. **Master Advanced Factory Patterns**: Implement sophisticated factory hierarchies with traits and mixins
2. **Integrate Faker.js Effectively**: Generate realistic healthcare data with proper constraints and relationships
3. **Apply Fluent Builder Patterns**: Create intuitive, readable data construction APIs
4. **Implement Business Rule Validation**: Ensure data compliance with healthcare regulations and business logic
5. **Design Data Personas**: Create consistent character profiles for comprehensive testing scenarios
6. **Handle Complex Data Relationships**: Manage intricate dependencies between multiple entity types

## 📚 Prerequisites

### Required Knowledge
- Completion of Exercise 01 (Basic Data Factory Implementation)
- Understanding of healthcare data concepts (patients, providers, insurance)
- Familiarity with validation frameworks and business rules
- Knowledge of design patterns (Builder, Factory, Strategy)

### Required Setup
```bash
# Create exercise directory
mkdir 02-dynamic-data-generation-system
cd 02-dynamic-data-generation-system

# Initialize the project
npm init -y

# Install core dependencies
npm install @cucumber/cucumber @playwright/test
npm install @faker-js/faker uuid sqlite3 ajv ajv-formats
npm install moment validator lodash
npm install --save-dev typescript @types/node @types/uuid @types/validator @types/lodash ts-node

# Create directory structure
mkdir -p features step-definitions support/factories support/builders support/personas support/validators support/database test-data
```

### Enhanced Database Schema
Extend your database with healthcare-specific entities:

```sql
-- healthcare-schema.sql

-- Existing tables from Exercise 01 (users, categories, products, orders, order_items)

-- Healthcare-specific tables
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    patient_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK(gender IN ('male', 'female', 'other', 'unknown')),
    ssn TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    address_street TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    npi_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    license_number TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    practice_name TEXT,
    practice_address TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    appointment_date DATETIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    appointment_id INTEGER,
    record_type TEXT NOT NULL,
    diagnosis_code TEXT,
    diagnosis_description TEXT,
    treatment_notes TEXT,
    medications TEXT,
    follow_up_required BOOLEAN DEFAULT 0,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE IF NOT EXISTS insurance_claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    claim_number TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    appointment_id INTEGER,
    claim_amount DECIMAL(10,2) NOT NULL,
    submitted_date DATE NOT NULL,
    processed_date DATE,
    status TEXT DEFAULT 'submitted',
    denial_reason TEXT,
    payment_amount DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);
```

## 🔧 Implementation Tasks

### Task 1: Healthcare Data Personas

Create realistic healthcare personas with consistent characteristics.

**File**: `support/personas/healthcare-personas.ts`

```typescript
export interface PatientPersona {
  demographics: {
    ageRange: [number, number];
    gender: 'male' | 'female' | 'other';
    ethnicity?: string;
    preferredLanguage?: string;
  };
  contact: {
    phonePattern?: string;
    emailDomain?: string;
    addressRegion?: string;
  };
  medical: {
    commonConditions?: string[];
    riskFactors?: string[];
    allergyLikelihood?: number;
    medicationCompliance?: 'high' | 'medium' | 'low';
  };
  insurance: {
    providerTypes?: string[];
    coverageLevel?: 'basic' | 'standard' | 'premium';
    deductibleRange?: [number, number];
  };
  behavioral: {
    appointmentCompliance?: 'excellent' | 'good' | 'poor';
    communicationStyle?: 'detailed' | 'brief' | 'anxious';
    techSavviness?: 'high' | 'medium' | 'low';
  };
}

export class HealthcarePersonas {
  static readonly ELDERLY_PATIENT: PatientPersona = {
    // TODO: Define elderly patient persona
    // - Age range 65-95
    // - Common age-related conditions
    // - Medicare insurance preferences
    // - Lower tech savviness
    // - Higher appointment compliance
  };

  static readonly YOUNG_PROFESSIONAL: PatientPersona = {
    // TODO: Define young professional persona
    // - Age range 25-40
    // - Stress-related conditions
    // - Employer insurance
    // - High tech savviness
    // - Variable appointment compliance due to work
  };

  static readonly PEDIATRIC_PATIENT: PatientPersona = {
    // TODO: Define pediatric patient persona
    // - Age range 0-17
    // - Childhood conditions and vaccinations
    // - Parent/guardian contact information
    // - Specific appointment types
  };

  static readonly CHRONIC_CONDITION_PATIENT: PatientPersona = {
    // TODO: Define chronic condition patient persona
    // - Various age ranges
    // - Multiple ongoing conditions
    // - Regular medication regimens
    // - Frequent appointments
    // - High healthcare utilization
  };

  static readonly UNINSURED_PATIENT: PatientPersona = {
    // TODO: Define uninsured patient persona
    // - Financial constraints
    // - Limited healthcare access
    // - Emergency-focused care
    // - Payment plan arrangements
  };

  static getRandomPersona(): PatientPersona {
    // TODO: Return random persona from available options
  }

  static getPersonaByName(name: string): PatientPersona {
    // TODO: Return specific persona by name
  }
}
```

### Task 2: Fluent Builder for Complex Entities

Implement fluent builders for creating complex healthcare entities.

**File**: `support/builders/patient-builder.ts`

```typescript
import { faker } from '@faker-js/faker';
import { PatientPersona, HealthcarePersonas } from '../personas/healthcare-personas';
import { DatabaseConnectionManager } from '../database/connection-manager';

export interface Patient {
  id?: number;
  uuid: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  ssn?: string;
  phone?: string;
  email?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export class PatientBuilder {
  private patient: Partial<Patient> = {};
  private persona?: PatientPersona;
  private dbManager: DatabaseConnectionManager;

  constructor(dbManager: DatabaseConnectionManager) {
    this.dbManager = dbManager;
    this.reset();
  }

  reset(): PatientBuilder {
    this.patient = {
      uuid: faker.string.uuid(),
      patient_id: this.generatePatientId(),
      status: 'active'
    };
    return this;
  }

  withPersona(persona: PatientPersona | string): PatientBuilder {
    // TODO: Apply persona characteristics
    // - Set persona from parameter or get by name
    // - Apply demographic characteristics
    // - Generate appropriate contact information
    // - Set medical and insurance defaults
    return this;
  }

  withDemographics(
    firstName?: string,
    lastName?: string,
    dateOfBirth?: string,
    gender?: Patient['gender']
  ): PatientBuilder {
    // TODO: Set demographic information
    // - Use provided values or generate based on persona
    // - Ensure consistency with persona if set
    // - Generate appropriate names for ethnicity/culture
    return this;
  }

  withAge(age: number): PatientBuilder {
    // TODO: Set patient age
    // - Calculate date of birth from age
    // - Consider current date for accuracy
    return this;
  }

  withAgeRange(minAge: number, maxAge: number): PatientBuilder {
    // TODO: Set patient age within range
    // - Generate random age within range
    // - Apply withAge method
    return this;
  }

  withContact(
    phone?: string,
    email?: string,
    street?: string,
    city?: string,
    state?: string,
    zip?: string
  ): PatientBuilder {
    // TODO: Set contact information
    // - Use provided values or generate based on persona
    // - Ensure realistic phone number formats
    // - Generate consistent address information
    return this;
  }

  withEmergencyContact(name?: string, phone?: string): PatientBuilder {
    // TODO: Set emergency contact information
    // - Generate realistic emergency contact
    // - Consider relationship patterns (spouse, parent, child)
    return this;
  }

  withInsurance(provider?: string, policyNumber?: string): PatientBuilder {
    // TODO: Set insurance information
    // - Use provided values or generate based on persona
    // - Generate realistic policy numbers
    // - Select appropriate insurance providers
    return this;
  }

  withMedicalHistory(conditions?: string[]): PatientBuilder {
    // TODO: Apply medical history
    // - Set conditions based on persona
    // - Ensure age-appropriate conditions
    // - Consider comorbidity patterns
    return this;
  }

  withStatus(status: string): PatientBuilder {
    this.patient.status = status;
    return this;
  }

  asInactive(): PatientBuilder {
    return this.withStatus('inactive');
  }

  asDeceased(): PatientBuilder {
    return this.withStatus('deceased');
  }

  build(): Patient {
    // TODO: Build final patient object
    // - Apply any missing persona characteristics
    // - Validate business rules
    // - Ensure data consistency
    // - Return complete patient object
  }

  async create(): Promise<Patient> {
    // TODO: Build and persist patient
    // - Build patient object
    // - Validate before persistence
    // - Save to database
    // - Return persisted patient with ID
  }

  private generatePatientId(): string {
    // TODO: Generate realistic patient ID
    // - Use format like "PAT-" + 8 digits
    // - Ensure uniqueness
    return `PAT-${faker.string.numeric(8)}`;
  }

  private generateRealisticSSN(): string {
    // TODO: Generate realistic SSN format
    // - Use valid SSN format (XXX-XX-XXXX)
    // - Avoid invalid ranges (000, 666, 900-999)
    // - Consider partial masking for compliance
  }

  private applyPersonaCharacteristics(): void {
    // TODO: Apply persona-specific characteristics
    // - Generate age within persona range
    // - Set gender based on persona
    // - Apply medical characteristics
    // - Set insurance preferences
  }

  private validatePatientData(): string[] {
    // TODO: Validate patient data
    // - Check required fields
    // - Validate data formats (email, phone, SSN)
    // - Check business rules
    // - Return list of validation errors
  }
}
```

### Task 3: Advanced Provider Factory with Specialties

Create a sophisticated provider factory with medical specialties and realistic professional data.

**File**: `support/factories/provider-factory.ts`

```typescript
import { faker } from '@faker-js/faker';
import { EnhancedBaseFactory, FactoryOptions, TraitDefinition } from './enhanced-base-factory';

export interface Provider {
  id?: number;
  uuid: string;
  npi_number: string;
  first_name: string;
  last_name: string;
  specialty: string;
  license_number: string;
  phone?: string;
  email?: string;
  practice_name?: string;
  practice_address?: string;
  status: string;
  created_at?: string;
}

export class ProviderFactory extends EnhancedBaseFactory<Provider> {
  private static readonly MEDICAL_SPECIALTIES = [
    'Internal Medicine', 'Family Medicine', 'Pediatrics', 'Cardiology',
    'Dermatology', 'Orthopedics', 'Psychiatry', 'Emergency Medicine',
    'Radiology', 'Anesthesiology', 'Surgery', 'Neurology', 'Oncology'
  ];

  private static readonly PRACTICE_TYPES = [
    'Medical Center', 'Clinic', 'Hospital', 'Urgent Care',
    'Specialty Practice', 'Health System', 'Medical Group'
  ];

  getDefaults(): Partial<Provider> {
    // TODO: Generate provider defaults
    // - Generate realistic provider names
    // - Generate unique NPI number (10 digits)
    // - Select appropriate medical specialty
    // - Generate professional license number
    // - Create practice information
    // - Set professional email and phone
  }

  getTableName(): string {
    return 'providers';
  }

  registerTraits(): void {
    // TODO: Register provider-specific traits
    
    this.addTrait({
      name: 'primary_care',
      apply: (data: Provider) => {
        // Set primary care specialties
        // Generate appropriate practice names
        // Set longer appointment durations
      }
    });

    this.addTrait({
      name: 'specialist',
      apply: (data: Provider) => {
        // Set specialist medical fields
        // Generate specialty practice names
        // Set higher billing rates
      }
    });

    this.addTrait({
      name: 'hospital_based',
      apply: (data: Provider) => {
        // Set hospital-based specialties
        // Generate hospital affiliations
        // Set appropriate practice addresses
      }
    });

    this.addTrait({
      name: 'telemedicine',
      apply: (data: Provider) => {
        // Enable telemedicine capabilities
        // Set virtual practice information
        // Generate appropriate contact methods
      }
    });
  }

  async build(options?: FactoryOptions): Promise<Provider> {
    // TODO: Build provider with traits
    return this.buildWithTraits(options);
  }

  async create(options?: FactoryOptions): Promise<Provider> {
    // TODO: Create and persist provider
  }

  async createWithSpecialty(specialty: string, options?: FactoryOptions): Promise<Provider> {
    // TODO: Create provider with specific specialty
    // - Override specialty in options
    // - Generate specialty-appropriate practice information
    // - Apply relevant traits
  }

  async createPrimaryCare(options?: FactoryOptions): Promise<Provider> {
    // TODO: Create primary care provider
    // - Apply primary_care trait
    // - Set appropriate specialty
  }

  async createSpecialist(specialty: string, options?: FactoryOptions): Promise<Provider> {
    // TODO: Create specialist provider
    // - Apply specialist trait
    // - Set specific specialty
  }

  async validateBusinessRules(provider: Partial<Provider>): Promise<string[]> {
    // TODO: Validate provider business rules
    // - Check NPI number format and uniqueness
    // - Validate license number format
    // - Ensure specialty is valid
    // - Check email format if provided
    // - Validate phone number format
  }

  async sanitizeForCompliance(provider: Partial<Provider>): Partial<Provider> {
    // TODO: Sanitize provider data for compliance
    // - Mask sensitive information if needed
    // - Ensure HIPAA compliance
    // - Remove or anonymize personal information for test environments
  }

  private generateNPINumber(): string {
    // TODO: Generate realistic NPI number
    // - Use proper 10-digit format
    // - Ensure Luhn algorithm compliance
    // - Check for uniqueness
  }

  private generateLicenseNumber(state: string = 'CA'): string {
    // TODO: Generate realistic medical license number
    // - Use state-appropriate format
    // - Include state prefix if applicable
    // - Generate check digits if required
  }

  private generatePracticeName(specialty: string, practiceType: string): string {
    // TODO: Generate realistic practice name
    // - Combine specialty with practice type
    // - Use realistic medical practice naming patterns
    // - Consider geographic naming conventions
  }
}
```

### Task 4: Comprehensive Feature File

Create a comprehensive feature file that tests all advanced data generation capabilities.

**File**: `features/dynamic-data-generation.feature`

```gherkin
@dynamic-data-generation @advanced-factories
Feature: Dynamic Data Generation System
  As a test automation engineer
  I want to generate realistic healthcare test data dynamically
  So that I can create comprehensive test scenarios that reflect real-world complexity

Background: Advanced Factory Setup
  Given the healthcare database is initialized
  And advanced factories are configured with personas and traits
  And data validation rules are active

@patient-personas @realistic-data
Scenario: Generating patients with different personas
  When I create patients using the following personas:
    | persona | count | expected_characteristics |
    | elderly_patient | 5 | age_65_plus,medicare_insurance,chronic_conditions |
    | young_professional | 3 | age_25_40,employer_insurance,stress_related |
    | pediatric_patient | 4 | age_0_17,parent_contact,vaccination_schedule |
    | chronic_condition_patient | 2 | multiple_conditions,frequent_visits,medication_compliance |
  Then patients should be created with persona-appropriate characteristics
  And each patient should have realistic, consistent data
  And all generated data should pass validation rules
  And demographic distributions should match persona expectations

@fluent-builders @complex-construction
Scenario: Using fluent builders for complex patient creation
  When I use the patient builder to create a patient:
    """
    PatientBuilder()
      .withPersona('elderly_patient')
      .withAge(72)
      .withDemographics('Margaret', 'Johnson', null, 'female')
      .withContact(null, null, '123 Oak Street', 'Springfield', 'IL', '62701')
      .withEmergencyContact('Robert Johnson', '555-0123')
      .withInsurance('Medicare', 'MEDICARE-789456123')
      .withMedicalHistory(['Diabetes Type 2', 'Hypertension', 'Arthritis'])
      .create()
    """
  Then the patient should be created with the specified characteristics
  And the patient should have consistent persona-based defaults for unspecified fields
  And all medical history should be age-appropriate
  And insurance information should match elderly patient patterns

@provider-specialties @professional-data
Scenario: Generating healthcare providers with realistic professional data
  Given I need providers for different medical specialties
  When I create providers with the following configurations:
    | specialty | count | traits | practice_type |
    | Internal Medicine | 3 | primary_care | Medical Center |
    | Cardiology | 2 | specialist,hospital_based | Hospital |
    | Pediatrics | 2 | primary_care | Clinic |
    | Emergency Medicine | 1 | hospital_based | Hospital |
    | Telemedicine | 2 | telemedicine | Virtual Practice |
  Then providers should be created with appropriate professional credentials
  And each provider should have valid NPI numbers and license numbers
  And practice information should match specialty and traits
  And contact information should be professional and realistic

@appointment-scheduling @business-rules
Scenario: Creating appointments with complex scheduling constraints
  Given I have patients with different personas
  And I have providers with various specialties
  When I create appointments with the following requirements:
    | patient_persona | provider_specialty | appointment_type | scheduling_constraints |
    | elderly_patient | Internal Medicine | Annual Physical | morning_preferred,routine |
    | young_professional | Cardiology | Consultation | evening_available,urgent |
    | pediatric_patient | Pediatrics | Vaccination | school_hours_avoided,routine |
    | chronic_condition_patient | Internal Medicine | Follow-up | regular_interval,telemedicine |
  Then appointments should be scheduled within business hours
  And appointment types should be appropriate for provider specialties
  And scheduling should respect patient persona preferences
  And no double-booking conflicts should occur
  And appointment durations should match appointment types

@data-relationships @referential-integrity
Scenario: Managing complex data relationships and dependencies
  Given I need a complete healthcare workflow scenario
  When I create the following interconnected data:
    | step | entity | relationships | validation_rules |
    | 1 | Patient | persona=young_professional | valid_demographics,insurance_required |
    | 2 | Provider | specialty=Internal_Medicine,traits=primary_care | valid_credentials,practice_info |
    | 3 | Appointment | patient+provider,type=Annual_Physical | business_hours,no_conflicts |
    | 4 | Medical_Record | patient+provider+appointment | diagnosis_codes,treatment_notes |
    | 5 | Insurance_Claim | patient+provider+appointment,amount=$350 | valid_claim_data,processing_rules |
  Then all entities should be created in the correct dependency order
  And referential integrity should be maintained throughout
  And each entity should contain appropriate cross-references
  And business rules should be validated at each step
  And the complete workflow should be realistic and consistent

@bulk-generation @performance-optimization
Scenario: Generating large datasets efficiently with realistic constraints
  When I generate a large healthcare dataset:
    | entity_type | count | constraints | performance_target |
    | patients | 1000 | diverse_personas,realistic_demographics | <30_seconds |
    | providers | 200 | all_specialties,geographic_distribution | <10_seconds |
    | appointments | 5000 | business_hours,no_conflicts,6_month_range | <60_seconds |
    | medical_records | 3000 | diagnosis_codes,appropriate_treatments | <45_seconds |
    | insurance_claims | 2000 | valid_amounts,processing_statuses | <30_seconds |
  Then all entities should be generated within performance targets
  And data should maintain realistic distribution patterns
  And referential integrity should be preserved across all entities
  And no business rule violations should occur
  And memory usage should remain within acceptable limits

@data-validation @compliance-checking
Scenario: Validating generated data against healthcare standards
  Given I have generated healthcare data using various personas and traits
  When I run comprehensive data validation:
    | validation_type | scope | compliance_standard | error_tolerance |
    | format_validation | all_entities | internal_standards | 0% |
    | business_rules | all_relationships | healthcare_workflow | 0% |
    | compliance_check | patient_data | hipaa_requirements | 0% |
    | data_quality | demographic_distributions | statistical_realism | 5% |
    | referential_integrity | cross_entity_references | database_constraints | 0% |
  Then all format validations should pass without errors
  And business rule violations should be within tolerance
  And HIPAA compliance should be maintained for all patient data
  And demographic distributions should reflect realistic population patterns
  And all cross-references should maintain referential integrity

@error-handling @edge-cases
Scenario: Handling data generation errors and edge cases gracefully
  When I attempt to create problematic healthcare data scenarios:
    | error_scenario | expected_behavior | recovery_strategy |
    | invalid_appointment_conflict | validation_error | suggest_alternative_times |
    | provider_specialty_mismatch | business_rule_violation | recommend_appropriate_provider |
    | patient_age_inconsistency | persona_validation_error | adjust_age_or_persona |
    | insurance_policy_format_error | format_validation_error | regenerate_valid_policy_number |
    | duplicate_npi_number | uniqueness_constraint_violation | generate_new_npi |
  Then each error scenario should be handled gracefully
  And descriptive error messages should be provided
  And recovery strategies should be offered when possible
  And the system should remain stable after error conditions
  And no partial or corrupted data should be persisted

@data-cleanup @advanced-teardown
Scenario: Cleaning up complex healthcare data with proper dependency management
  Given I have created a complex healthcare dataset with multiple relationships
  When I execute the advanced cleanup procedure
  Then data should be cleaned up in reverse dependency order
  And all foreign key constraints should be respected
  And no orphaned records should remain in any table
  And database sequences should be reset appropriately
  And cleanup should complete without constraint violations
  And the database should return to a completely clean state
```

## ✅ Acceptance Criteria

Your implementation must meet these comprehensive criteria:

### Functional Requirements
- [ ] Advanced factory patterns with traits and personas implemented
- [ ] Fluent builder API provides intuitive data construction
- [ ] Healthcare personas generate appropriate, consistent data
- [ ] Provider factory creates realistic professional credentials
- [ ] Appointment scheduling respects business rules and constraints
- [ ] Complex data relationships maintained with referential integrity
- [ ] All feature scenarios pass with realistic data generation

### Quality Requirements
- [ ] Generated data passes healthcare industry validation standards
- [ ] Performance targets met for bulk data generation operations
- [ ] Memory usage remains efficient during large dataset creation
- [ ] Error handling provides meaningful feedback and recovery options
- [ ] Code maintains strict TypeScript compliance with comprehensive typing
- [ ] Business rule validation prevents invalid data combinations

### Healthcare Compliance
- [ ] Patient data generation follows HIPAA privacy requirements
- [ ] Medical professional credentials use realistic formats and validation
- [ ] Appointment scheduling follows healthcare industry standards
- [ ] Diagnosis codes and medical terminology are appropriate and valid
- [ ] Insurance information follows industry standards and formats

## 🧪 Testing Instructions

### Running the Tests

```bash
# Run all dynamic data generation tests
npx cucumber-js features/dynamic-data-generation.feature

# Run specific test categories
npx cucumber-js --tags "@patient-personas"
npx cucumber-js --tags "@appointment-scheduling"
npx cucumber-js --tags "@bulk-generation"

# Run with performance monitoring
npx cucumber-js --tags "@performance-optimization" --format progress-bar
```

### Expected Performance Benchmarks

```
Dynamic Data Generation Performance Results:
- Patient generation: 0.02s per patient (1000 patients in <20s)
- Provider generation: 0.03s per provider (200 providers in <6s)
- Appointment scheduling: 0.01s per appointment (5000 appointments in <50s)
- Complex relationship creation: 0.05s per relationship set
- Bulk operations: 95% faster than individual entity creation
```

## 💡 Extension Challenges

### Challenge 1: Advanced Persona System
- Implement persona inheritance and composition
- Add geographic and cultural persona variations
- Create persona-driven test scenario generation

### Challenge 2: Machine Learning Integration
- Use ML models to generate more realistic medical data
- Implement predictive appointment scheduling patterns
- Add anomaly detection for unrealistic data combinations

### Challenge 3: Real-time Data Synchronization
- Implement real-time healthcare data feed simulation
- Add streaming data generation capabilities
- Create data evolution and lifecycle management

## Next Steps

After completing this exercise:

1. **Performance Analysis** - Benchmark your implementation with production-scale datasets
2. **Compliance Review** - Verify healthcare data standards compliance
3. **Integration Testing** - Test with real healthcare system APIs
4. **Proceed to Exercise 03** - Implement database integration and transaction management

Congratulations on building a sophisticated dynamic data generation system! You've created a powerful foundation for realistic healthcare testing scenarios.