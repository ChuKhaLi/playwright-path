# Type Checking Process Flowcharts

## ⚙️ Visual Guide to TypeScript's Type Checking Logic

This guide provides visual flowcharts that explain how TypeScript's type checking process works for objects, helping learners understand how type compatibility is determined.

---

## 🔄 Basic Object Type Checking Flow

### Structural Typing Explained

```
┌─────────────────────────────────────────────────────────────┐
│              🔄 BASIC TYPE CHECKING PROCESS                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  START: Assigning an object to a typed variable             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ let user: User = {                                  │   │
│  │   id: "123",                                        │   │
│  │   name: "John",                                     │   │
│  │   email: "john@test.com"                           │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  TypeScript Compiler Analysis:                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  1. Does the object have ALL required properties   │   │
│  │     of the `User` type?                             │   │
│  │     (id, name, email)                               │   │
│  │                                                     │   │
│  │  2. Are the types of these properties compatible?  │   │
│  │     (id: string, name: string, email: string)       │   │
│  │                                                     │   │
│  │  3. Does the object have any EXTRA properties?     │   │
│  │     (Object literal check)                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Decision Flow:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ All required     │── YES ──▶┌──────────────────┐   │   │
│  │  │ properties exist?│         │ Property types   │   │   │
│  │  └──────────────────┘         │ compatible?      │   │   │
│  │          │                    └──────────────────┘   │   │
│  │          NO                          │               │   │
│  │          │                          YES              │   │
│  │          ▼                          │               │   │
│  │  ┌──────────────────┐              ▼               │   │
│  │  │ COMPILATION      │      ┌──────────────────┐      │   │
│  │  │ ERROR            │◀── NO ─│ Any extra        │      │   │
│  │  │ (Missing prop)   │      │ properties?      │      │   │
│  │  └──────────────────┘      └──────────────────┘      │   │
│  │                                  │                  │   │
│  │                                 YES                 │   │
│  │                                  │                  │   │
│  │                                  ▼                  │   │
│  │                          ┌──────────────────┐       │   │
│  │                          │ COMPILATION      │       │   │
│  │                          │ ERROR            │       │   │
│  │                          │ (Excess prop)    │       │   │
│  │                          └──────────────────┘       │   │
│  │                                                     │   │
│  │                                  │                  │   │
│  │                                  NO                 │   │
│  │                                  │                  │   │
│  │                                  ▼                  │   │
│  │                          ┌──────────────────┐       │   │
│  │                          │ ✅ ASSIGNMENT    │       │   │
│  │                          │    SUCCESSFUL    │       │   │
│  │                          └──────────────────┘       │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Structural Subtyping Flowchart

### How TypeScript Determines Type Compatibility

```
┌─────────────────────────────────────────────────────────────┐
│             🧩 STRUCTURAL SUBTYPING PROCESS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scenario: Assigning an object of one type to another       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type Source = {                                     │   │
│  │   id: string;                                       │   │
│  │   name: string;                                     │   │
│  │   email: string;                                    │   │
│  │   age: number;                                      │   │
│  │ };                                                  │   │
│  │                                                     │   │
│  │ type Target = {                                     │   │
│  │   id: string;                                       │   │
│  │   name: string;                                     │   │
│  │ };                                                  │   │
│  │                                                     │   │
│  │ let sourceObj: Source = { /* ... */ };              │   │
│  │ let targetVar: Target = sourceObj;                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Type Compatibility Check:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Is `Source` assignable to `Target`?                 │   │
│  │                                                     │   │
│  │  1. Does `Source` have at least all the properties │   │
│  │     of `Target`?                                    │   │
│  │     (Target has `id`, `name`. Source has `id`,      │   │
│  │      `name`, `email`, `age`.)                        │   │
│  │                                                     │   │
│  │  2. Are the types of these shared properties       │   │
│  │     compatible?                                     │   │
│  │     (id: string, name: string)                      │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Decision Flow:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ `Source` has all │── YES ──▶┌──────────────────┐   │   │
│  │  │ props of `Target`?│         │ Shared prop types│   │   │
│  │  └──────────────────┘         │ compatible?      │   │   │
│  │          │                    └──────────────────┘   │   │
│  │          NO                          │               │   │
│  │          │                          YES              │   │
│  │          ▼                          │               │   │
│  │  ┌──────────────────┐              ▼               │   │
│  │  │ COMPILATION      │      ┌──────────────────┐      │   │
│  │  │ ERROR            │◀── NO ─│ ✅ ASSIGNMENT    │      │   │
│  │  │ (Missing prop)   │      │    SUCCESSFUL    │      │   │
│  │  └──────────────────┘      └──────────────────┘      │   │
│  │                                                     │   │
│  │  "Duck Typing": If it walks like a duck and quacks │   │
│  │  like a duck, it's a duck.                         │   │
│  │                                                     │   │
│  │  `Source` has everything `Target` needs, so it's   │   │
│  │  compatible. The extra properties are ignored.     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ❓ Optional and Readonly Properties Checking

### Flowchart for Modifiers

```
┌─────────────────────────────────────────────────────────────┐
│           ❓ OPTIONAL & READONLY TYPE CHECKING             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scenario: Working with optional and readonly properties    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type Config = {                                     │   │
│  │   readonly baseUrl: string;                         │   │
│  │   timeout?: number;                                 │   │
│  │   retries?: number;                                 │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Object Creation Check:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  let config: Config = {                             │   │
│  │    baseUrl: "https://test.com", // ✅ Required      │   │
│  │    timeout: 10000             // ⚪ Optional         │   │
│  │    // retries is omitted      // ⚪ Optional         │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  │  1. Is `baseUrl` present? YES.                       │   │
│  │  2. Is `timeout` present? YES. Type is number. OK.   │   │
│  │  3. Is `retries` present? NO. It's optional. OK.     │   │
│  │                                                     │   │
│  │  Result: ✅ Valid Object Creation                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Property Access and Modification Check:                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Reading properties                              │   │
│  │  console.log(config.baseUrl); // ✅ Allowed         │   │
│  │  console.log(config.timeout); // ✅ Allowed         │   │
│  │  console.log(config.retries); // ✅ Allowed (is undefined)│ │
│  │                                                     │   │
│  │  // Modifying properties                            │   │
│  │  config.timeout = 20000;      // ✅ Allowed (mutable)│   │
│  │  config.retries = 3;          // ✅ Allowed (mutable)│   │
│  │  config.baseUrl = "new-url";  // ❌ ERROR (readonly) │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Decision Flow for Modification:                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ Is property      │── YES ──▶┌──────────────────┐   │   │
│  │  │ `readonly`?      │         │ COMPILATION      │   │   │
│  │  └──────────────────┘         │ ERROR            │   │   │
│  │          │                    └──────────────────┘   │   │
│  │          NO                                          │   │
│  │          │                                           │   │
│  │          ▼                                           │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ ✅ MODIFICATION  │                                │   │
│  │  │    ALLOWED       │                                │   │
│  │  └──────────────────┘                                │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Index Signature Type Checking

### Flowchart for Dynamic Properties

```
┌─────────────────────────────────────────────────────────────┐
│             🔍 INDEX SIGNATURE TYPE CHECKING               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scenario: Using an object with an index signature          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ type DynamicConfig = {                              │   │
│  │   environment: string;                              │   │
│  │   [key: string]: string | boolean;                  │   │
│  │ };                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Object Creation Check:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  let config: DynamicConfig = {                      │   │
│  │    environment: "staging",   // ✅ Known property   │   │
│  │    debug: true,             // ✅ Dynamic property │   │
│  │    featureFlag: "on",      // ✅ Dynamic property │   │
│  │    // timeout: 5000,        // ❌ ERROR (number)   │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Decision Flow for Property Assignment:                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ Is property a    │── YES ──▶┌──────────────────┐   │   │
│  │  │ known property?  │         │ Is type of value │   │   │
│  │  └──────────────────┘         │ compatible with  │   │   │
│  │          │                    │ known prop type? │   │   │
│  │          NO                   └──────────────────┘   │   │
│  │          │                          │               │   │
│  │          ▼                          YES              │   │
│  │  ┌──────────────────┐              │               │   │
│  │  │ Is property key  │              ▼               │   │
│  │  │ compatible with  │      ┌──────────────────┐      │   │
│  │  │ index signature  │◀── NO ─│ ✅ ASSIGNMENT    │      │   │
│  │  │ key type?        │      │    SUCCESSFUL    │      │   │
│  │  └──────────────────┘      └──────────────────┘      │   │
│  │          │                                          │   │
│  │          YES                                         │   │
│  │          │                                          │   │
│  │          ▼                                          │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ Is property value│── YES ──▶┌──────────────────┐   │   │
│  │  │ compatible with  │         │ ✅ ASSIGNMENT    │   │   │
│  │  │ index signature  │         │    SUCCESSFUL    │   │   │
│  │  │ value type?      │         └──────────────────┘   │   │
│  │  └──────────────────┘                                │   │
│  │          │                                          │   │
│  │          NO                                          │   │
│  │          │                                          │   │
│  │          ▼                                          │   │
│  │  ┌──────────────────┐                                │   │
│  │  │ COMPILATION      │                                │   │
│  │  │ ERROR            │                                │   │
│  │  └──────────────────┘                                │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘