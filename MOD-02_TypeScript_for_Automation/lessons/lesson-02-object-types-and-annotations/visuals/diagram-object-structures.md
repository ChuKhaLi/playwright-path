# Object Structure Diagrams

## 🏗️ Visual Guide to Object Hierarchies and Relationships

This guide provides comprehensive visual diagrams of object structures commonly used in test automation, helping learners understand complex type relationships and hierarchies.

---

## 🎯 Simple Object Structure

### Basic User Object

```
┌─────────────────────────────────────────────────────────────┐
│                🎯 BASIC OBJECT STRUCTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TypeScript Definition:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type User = {                                       │   │
│  │   id: string;                                       │   │
│  │   name: string;                                     │   │
│  │   email: string;                                    │   │
│  │   age: number;                                      │   │
│  │   isActive: boolean;                                │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Object Structure Diagram:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                    User                             │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │                                             │     │   │
│  │  │  ┌─────────────┐  ┌─────────────┐           │     │   │
│  │  │  │     id      │  │    name     │           │     │   │
│  │  │  │   string    │  │   string    │           │     │   │
│  │  │  └─────────────┘  └─────────────┘           │     │   │
│  │  │                                             │     │   │
│  │  │  ┌─────────────┐  ┌─────────────┐           │     │   │
│  │  │  │    email    │  │     age     │           │     │   │
│  │  │  │   string    │  │   number    │           │     │   │
│  │  │  └─────────────┘  └─────────────┘           │     │   │
│  │  │                                             │     │   │
│  │  │         ┌─────────────┐                     │     │   │
│  │  │         │  isActive   │                     │     │   │
│  │  │         │   boolean   │                     │     │   │
│  │  │         └─────────────┘                     │     │   │
│  │  │                                             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Memory Layout Visualization:                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  const user: User = {                               │   │
│  │    id: "user-123",        ← string (12 chars)       │   │
│  │    name: "John Doe",      ← string (8 chars)        │   │
│  │    email: "john@test.com", ← string (13 chars)      │   │
│  │    age: 30,               ← number (integer)        │   │
│  │    isActive: true         ← boolean (true/false)    │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  │  Property Access:                                   │   │
│  │  user.id        → "user-123"                        │   │
│  │  user.name      → "John Doe"                        │   │
│  │  user.email     → "john@test.com"                   │   │
│  │  user.age       → 30                                │   │
│  │  user.isActive  → true                              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌳 Nested Object Hierarchies

### Complex User Profile Structure

```
┌─────────────────────────────────────────────────────────────┐
│               🌳 NESTED OBJECT HIERARCHIES                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TypeScript Definition:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type UserProfile = {                                │   │
│  │   id: string;                                       │   │
│  │   personalInfo: {                                   │   │
│  │     firstName: string;                              │   │
│  │     lastName: string;                               │   │
│  │     email: string;                                  │   │
│  │     phone?: string;                                 │   │
│  │   };                                                │   │
│  │   address: {                                        │   │
│  │     street: string;                                 │   │
│  │     city: string;                                   │   │
│  │     state: string;                                  │   │
│  │     zipCode: string;                                │   │
│  │   };                                                │   │
│  │   preferences: {                                    │   │
│  │     notifications: {                                │   │
│  │       email: boolean;                               │   │
│  │       sms: boolean;                                 │   │
│  │     };                                              │   │
│  │     privacy: {                                      │   │
│  │       profileVisible: boolean;                      │   │
│  │       shareData: boolean;                           │   │
│  │     };                                              │   │
│  │   };                                                │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Hierarchical Structure Diagram:                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                  UserProfile                        │   │
│  │                      │                              │   │
│  │         ┌────────────┼────────────┐                 │   │
│  │         │            │            │                 │   │
│  │        id      personalInfo    address              │   │
│  │      string         │            │                  │   │
│  │                     │            │                  │   │
│  │              ┌──────┼──────┐     │                  │   │
│  │              │      │      │     │                  │   │
│  │         firstName lastName email │                  │   │
│  │          string   string string  │                  │   │
│  │              │      │      │     │                  │   │
│  │              │      │   phone?   │                  │   │
│  │              │      │   string   │                  │   │
│  │              │      │            │                  │   │
│  │              │      │      ┌─────┼─────┐            │   │
│  │              │      │      │     │     │            │   │
│  │              │      │    street city state          │   │
│  │              │      │    string string string       │   │
│  │              │      │            │                  │   │
│  │              │      │         zipCode               │   │
│  │              │      │         string                │   │
│  │              │      │                               │   │
│  │              │      │      preferences              │   │
│  │              │      │           │                   │   │
│  │              │      │    ┌──────┴──────┐            │   │
│  │              │      │    │             │            │   │
│  │              │      │ notifications  privacy        │   │
│  │              │      │    │             │            │   │
│  │              │      │ ┌──┴──┐       ┌──┴──┐         │   │
│  │              │      │ │     │       │     │         │   │
│  │              │      │email sms  profileVisible shareData│ │
│  │              │      │bool bool    boolean   boolean │   │
│  │              │      │                               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Access Path Visualization:                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Level 1: user.id                                   │   │
│  │           user.personalInfo                         │   │
│  │           user.address                              │   │
│  │           user.preferences                          │   │
│  │                                                     │   │
│  │  Level 2: user.personalInfo.firstName               │   │
│  │           user.address.city                         │   │
│  │           user.preferences.notifications            │   │
│  │                                                     │   │
│  │  Level 3: user.preferences.notifications.email     │   │
│  │           user.preferences.privacy.profileVisible   │   │
│  │                                                     │   │
│  │  Optional: user.personalInfo.phone                  │   │
│  │           (may be undefined)                        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Page Object Model Structure

### Login Page Object Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│              🧪 PAGE OBJECT MODEL STRUCTURE                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TypeScript Definition:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type LoginPage = {                                  │   │
│  │   url: string;                                      │   │
│  │   elements: {                                       │   │
│  │     form: {                                         │   │
│  │       container: string;                            │   │
│  │       usernameInput: string;                        │   │
│  │       passwordInput: string;                        │   │
│  │       rememberMeCheckbox: string;                   │   │
│  │       submitButton: string;                         │   │
│  │       forgotPasswordLink: string;                   │   │
│  │     };                                              │   │
│  │     messages: {                                     │   │
│  │       errorContainer: string;                       │   │
│  │       successContainer: string;                     │   │
│  │       loadingSpinner: string;                       │   │
│  │     };                                              │   │
│  │     navigation: {                                   │   │
│  │       homeLink: string;                             │   │
│  │       signUpLink: string;                           │   │
│  │     };                                              │   │
│  │   };                                                │   │
│  │   actions: {                                        │   │
│  │     login: (user: string, pass: string) => Promise<void>;│ │
│  │     forgotPassword: () => Promise<void>;            │   │
│  │     toggleRememberMe: () => Promise<void>;          │   │
│  │     getErrorMessage: () => Promise<string>;         │   │
│  │   };                                                │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Page Object Structure Diagram:                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                   LoginPage                         │   │
│  │                       │                             │   │
│  │         ┌─────────────┼─────────────┐               │   │
│  │         │             │             │               │   │
│  │       url         elements       actions            │   │
│  │      string          │             │                │   │
│  │                      │             │                │   │
│  │              ┌───────┼───────┐     │                │   │
│  │              │       │       │     │                │   │
│  │            form   messages navigation               │   │
│  │              │       │       │     │                │   │
│  │    ┌─────────┼───────┐       │     │                │   │
│  │    │         │       │       │     │                │   │
│  │ container username password  │     │                │   │
│  │  string    string   string   │     │                │   │
│  │    │         │       │       │     │                │   │
│  │ rememberMe submit  forgot    │     │                │   │
│  │  string    string  string    │     │                │   │
│  │                              │     │                │   │
│  │                      ┌───────┼───────┐              │   │
│  │                      │       │       │              │   │
│  │                   error   success loading           │   │
│  │                   string  string  string            │   │
│  │                              │                      │   │
│  │                      ┌───────┼───────┐              │   │
│  │                      │       │       │              │   │
│  │                    home    signUp    │              │   │
│  │                   string  string     │              │   │
│  │                                      │              │   │
│  │                              ┌───────┼───────┐      │   │
│  │                              │       │       │      │   │
│  │                            login  forgot  toggle    │   │
│  │                          function function function │   │
│  │                              │       │       │      │   │
│  │                          getError                   │   │
│  │                          function                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Implementation Structure:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  const loginPage: LoginPage = {                     │   │
│  │    url: "/login",                                   │   │
│  │    elements: {                                      │   │
│  │      form: {                                        │   │
│  │        container: "[data-testid='login-form']",     │   │
│  │        usernameInput: "#username",                  │   │
│  │        passwordInput: "#password",                  │   │
│  │        rememberMeCheckbox: "#remember-me",          │   │
│  │        submitButton: "[type='submit']",             │   │
│  │        forgotPasswordLink: ".forgot-password"       │   │
│  │      },                                             │   │
│  │      messages: {                                    │   │
│  │        errorContainer: ".error-message",            │   │
│  │        successContainer: ".success-message",        │   │
│  │        loadingSpinner: ".loading-spinner"           │   │
│  │      },                                             │   │
│  │      navigation: {                                  │   │
│  │        homeLink: ".nav-home",                       │   │
│  │        signUpLink: ".nav-signup"                    │   │
│  │      }                                              │   │
│  │    },                                               │   │
│  │    actions: {                                       │   │
│  │      login: async (user, pass) => { /* impl */ },  │   │
│  │      forgotPassword: async () => { /* impl */ },   │   │
│  │      toggleRememberMe: async () => { /* impl */ }, │   │
│  │      getErrorMessage: async () => { /* impl */ }   │   │
│  │    }                                                │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Test Data Structure Hierarchy

### Test Case Object Model

```
┌─────────────────────────────────────────────────────────────┐
│              📊 TEST DATA STRUCTURE HIERARCHY              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TypeScript Definition:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type TestCase = {                                   │   │
│  │   id: string;                                       │   │
│  │   metadata: {                                       │   │
│  │     name: string;                                   │   │
│  │     description: string;                            │   │
│  │     priority: 'low' | 'medium' | 'high' | 'critical';│  │
│  │     tags: string[];                                 │   │
│  │     author: string;                                 │   │
│  │     createdDate: Date;                              │   │
│  │   };                                                │   │
│  │   execution: {                                      │   │
│  │     steps: {                                        │   │
│  │       stepNumber: number;                           │   │
│  │       action: string;                               │   │
│  │       expectedResult: string;                       │   │
│  │       data?: Record<string, any>;                   │   │
│  │     }[];                                            │   │
│  │     preconditions: string[];                        │   │
│  │     postconditions: string[];                       │   │
│  │   };                                                │   │
│  │   testData: {                                       │   │
│  │     valid: Record<string, any>;                     │   │
│  │     invalid?: Record<string, any>;                  │   │
│  │     boundary?: Record<string, any>;                 │   │
│  │   };                                                │   │
│  │   environment: {                                    │   │
│  │     browsers: string[];                             │   │
│  │     devices: string[];                              │   │
│  │     os: string[];                                   │   │
│  │   };                                                │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Test Case Structure Diagram:                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                    TestCase                         │   │
│  │                        │                            │   │
│  │         ┌──────────────┼──────────────┐             │   │
│  │         │              │              │             │   │
│  │        id          metadata       execution         │   │
│  │      string           │              │             │   │
│  │                       │              │             │   │
│  │              ┌────────┼────────┐     │             │   │
│  │              │        │        │     │             │   │
│  │            name   description priority              │   │
│  │           string    string    union                 │   │
│  │              │        │        │     │             │   │
│  │            tags    author   createdDate             │   │
│  │           array    string     Date                  │   │
│  │                              │                     │   │
│  │                      ┌───────┼───────┐             │   │
│  │                      │       │       │             │   │
│  │                    steps  precond  postcond         │   │
│  │                    array   array    array           │   │
│  │                      │                             │   │
│  │              ┌───────┼───────┐                     │   │
│  │              │       │       │                     │   │
│  │          stepNumber action expected                 │   │
│  │           number   string  string                   │   │
│  │              │       │       │                     │   │
│  │              │    data?                            │   │
│  │              │   Record                            │   │
│  │                                                     │   │
│  │                    testData                         │   │
│  │                        │                            │   │
│  │              ┌─────────┼─────────┐                  │   │
│  │              │         │         │                  │   │
│  │            valid    invalid?  boundary?             │   │
│  │           Record    Record    Record                │   │
│  │                                                     │   │
│  │                   environment                       │   │
│  │                        │                            │   │
│  │              ┌─────────┼─────────┐                  │   │
│  │              │         │         │                  │   │
│  │           browsers   devices     os                 │   │
│  │            array     array    array                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Data Flow Visualization:                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Test Execution Flow:                               │   │
│  │                                                     │   │
│  │  1. Read testCase.metadata                          │   │
│  │     ↓                                               │   │
│  │  2. Check testCase.environment                      │   │
│  │     ↓                                               │   │
│  │  3. Setup testCase.execution.preconditions          │   │
│  │     ↓                                               │   │
│  │  4. Execute testCase.execution.steps[]              │   │
│  │     ↓                                               │   │
│  │  5. Use testCase.testData.valid                     │   │
│  │     ↓                                               │   │
│  │  6. Verify testCase.execution.postconditions        │   │
│  │                                                     │   │
│  │  Error Scenarios:                                   │   │
│  │  - Use testCase.testData.invalid                    │   │
│  │  - Use testCase.testData.boundary                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Object Structure

### Test Environment Configuration

```
┌─────────────────────────────────────────────────────────────┐
│            🔧 CONFIGURATION OBJECT STRUCTURE               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TypeScript Definition:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type TestConfig = {                                 │   │
│  │   environment: {                                    │   │
│  │     name: string;                                   │   │
│  │     baseUrl: string;                                │   │
│  │     apiUrl: string;                                 │   │
│  │   };                                                │   │
│  │   browser: {                                        │   │
│  │     name: 'chromium' | 'firefox' | 'webkit';       │   │
│  │     headless: boolean;                              │   │
│  │     viewport: {                                     │   │
│  │       width: number;                                │   │
│  │       height: number;                               │   │
│  │     };                                              │   │
│  │     options: {                                      │   │
│  │       slowMo?: number;                              │   │
│  │       devtools?: boolean;                           │   │
│  │       timeout?: number;                             │   │
│  │     };                                              │   │
│  │   };                                                │   │
│  │   execution: {                                      │   │
│  │     parallel: boolean;                              │   │
│  │     workers: number;                                │   │
│  │     retries: number;                                │   │
│  │     timeout: {                                      │   │
│  │       test: number;                                 │   │
│  │       expect: number;                               │   │
│  │       navigation: number;                           │   │
│  │     };                                              │   │
│  │   };                                                │   │
│  │   reporting: {                                      │   │
│  │     enabled: boolean;                               │   │
│  │     formats: ('html' | 'json' | 'junit')[];        │   │
│  │     outputDir: string;                              │   │
│  │     screenshots: {                                  │   │
│  │       mode: 'off' | 'on-failure' | 'always';       │   │
│  │       quality: number;                              │   │
│  │     };                                              │   │
│  │   };                                                │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Configuration Structure Diagram:                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                   TestConfig                        │   │
│  │                       │                             │   │
│  │         ┌─────────────┼─────────────┐               │   │
│  │         │             │             │               │   │
│  │    environment     browser      execution           │   │
│  │         │             │             │               │   │
│  │    ┌────┼────┐        │        ┌────┼────┐          │   │
│  │    │    │    │        │        │    │    │          │   │
│  │  name baseUrl apiUrl  │     parallel workers retries│   │
│  │ string string string  │      bool   number  number  │   │
│  │                       │             │               │   │
│  │              ┌────────┼────────┐    │               │   │
│  │              │        │        │    │               │   │
│  │            name    headless viewport │               │   │
│  │           union     boolean    │     │               │   │
│  │                               │     │               │   │
│  │                        ┌──────┼──────┐              │   │
│  │                        │      │      │              │   │
│  │                      width  height options          │   │
│  │                     number number   │              │   │
│  │                                     │              │   │
│  │                              ┌──────┼──────┐        │   │
│  │                              │      │      │        │   │
│  │                           slowMo devtools timeout   │   │
│  │                          number? boolean? number?   │   │
│  │                                                     │   │
│  │                              timeout                │   │
│  │                                 │                   │   │
│  │                        ┌────────┼────────┐          │   │
│  │                        │        │        │          │   │
│  │                      test    expect  navigation     │   │
│  │                     number   number   number        │   │
│  │                                                     │   │
│  │                            reporting                │   │
│  │                                │                    │   │
│  │                    ┌───────────┼───────────┐        │   │
│  │                    │           │           │        │   │
│  │                 enabled     formats    outputDir    │   │
│  │                 boolean      array      string      │   │
│  │                                │                    │   │
│  │                          screenshots                │   │
│  │                                │                    │   │
│  │                        ┌───────┼───────┐            │   │
│  │                        │       │       │            │   │
│  │                      mode   quality                 │   │
│  │                     union   number                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Configuration Usage Pattern:                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  const config: TestConfig = {                       │   │
│  │    environment: {                                   │   │
│  │      name: "staging",                               │   │
│  │      baseUrl: "https://staging.example.com",       │   │
│  │      apiUrl: "https://api-staging.example.com"     │   │
│  │    },                                               │   │
│  │    browser: {                                       │   │
│  │      name: "chromium",                              │   │
│  │      headless: true,                                │   │
│  │      viewport: { width: 1920, height: 1080 },      │   │
│  │      options: {                                     │   │
│  │        slowMo: 100,                                 │   │
│  │        timeout: 30000                               │   │
│  │      }                                              │   │
│  │    },                                               │   │
│  │    execution: {                                     │   │
│  │      parallel: true,                                │   │
│  │      workers: 4,                                    │   │
│  │      retries: 2,                                    │   │
│  │      timeout: {                                     │   │
│  │        test: 30000,                                 │   │
│  │        expect: 5000,