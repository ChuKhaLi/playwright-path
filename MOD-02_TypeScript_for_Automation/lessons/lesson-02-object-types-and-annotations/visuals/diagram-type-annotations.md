# Type Annotations Visual Examples

## 📝 Visual Guide to TypeScript Type Annotations

This guide provides comprehensive visual examples of TypeScript type annotations, showing how to properly annotate variables, functions, objects, and complex structures used in test automation.

---

## 🏷️ Basic Type Annotations

### Variable Type Annotations

```
┌─────────────────────────────────────────────────────────────┐
│                🏷️ VARIABLE TYPE ANNOTATIONS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Basic Type Annotation Syntax:                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  let variableName: TypeName = value;                │   │
│  │      └─────────┘   └──────┘   └───┘                 │   │
│  │         │            │         │                    │   │
│  │    Variable Name   Type     Initial Value           │   │
│  │                 Annotation                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Visual Examples:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // String annotation                               │   │
│  │  let username: string = "testuser";                 │   │
│  │      └──────┘  └────┘   └────────┘                  │   │
│  │      Variable  Type     Value                       │   │
│  │                                                     │   │
│  │  // Number annotation                               │   │
│  │  let timeout: number = 5000;                        │   │
│  │      └─────┘  └────┘   └──┘                         │   │
│  │      Variable Type    Value                         │   │
│  │                                                     │   │
│  │  // Boolean annotation                              │   │
│  │  let isActive: boolean = true;                      │   │
│  │      └──────┘  └─────┘   └──┘                       │   │
│  │      Variable  Type     Value                       │   │
│  │                                                     │   │
│  │  // Array annotation                                │   │
│  │  let tags: string[] = ["smoke", "regression"];      │   │
│  │      └──┘  └──────┘   └─────────────────────┘       │   │
│  │      Var   Type       Value                         │   │
│  │                                                     │   │
│  │  // Object annotation                               │   │
│  │  let user: { name: string; age: number } = {        │   │
│  │      └──┘  └─────────────────────────┘   └─         │   │
│  │      Var   Object Type Definition       Value       │   │
│  │    name: "John",                                    │   │
│  │    age: 30                                          │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Type Inference vs Explicit Annotation:                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Type Inference (TypeScript guesses)             │   │
│  │  let username = "testuser";        // inferred: string│  │
│  │  let timeout = 5000;               // inferred: number│  │
│  │  let isActive = true;              // inferred: boolean│ │
│  │                                                     │   │
│  │  // Explicit Annotation (you specify)               │   │
│  │  let username: string = "testuser";  // explicit    │   │
│  │  let timeout: number = 5000;        // explicit     │   │
│  │  let isActive: boolean = true;      // explicit     │   │
│  │                                                     │   │
│  │  // When explicit annotation is needed:             │   │
│  │  let data: any;                     // no initial value│ │
│  │  let users: User[];                 // empty array   │   │
│  │  let config: TestConfig | null;     // union type   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Function Type Annotations

### Function Parameter and Return Type Annotations

```
┌─────────────────────────────────────────────────────────────┐
│              🔧 FUNCTION TYPE ANNOTATIONS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Function Annotation Syntax:                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  function name(param: Type): ReturnType {           │   │
│  │           └──┘ └───┘  └──┘   └────────┘             │   │
│  │           Name Param Type   Return Type             │   │
│  │    // function body                                 │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Visual Function Examples:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Simple function with typed parameters           │   │
│  │  function login(username: string, password: string): boolean {│ │
│  │          └───┘ └──────┘  └────┘  └──────┘  └────┘   └─────┘│ │
│  │          Name   Param1   Type1   Param2   Type2   Return │   │
│  │    // implementation                                │   │
│  │    return true;                                     │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Function with object parameter                  │   │
│  │  function createUser(userData: {                    │   │
│  │           └────────┘ └──────┘                       │   │
│  │           Name       Parameter                      │   │
│  │    name: string;                                    │   │
│  │    email: string;                                   │   │
│  │    age: number;                                     │   │
│  │  }): User {                                         │   │
│  │   └─────┘                                           │   │
│  │   Return Type                                       │   │
│  │    // implementation                                │   │
│  │    return { id: "123", ...userData };               │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Async function annotation                       │   │
│  │  async function fetchUser(id: string): Promise<User> {│  │
│  │         └─────┘ └───────┘ └──┘  └────┘   └───────────┘│  │
│  │         Async   Function  Param Type    Return Type  │   │
│  │    // implementation                                │   │
│  │    const response = await fetch(`/users/${id}`);    │   │
│  │    return response.json();                          │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Optional parameters                             │   │
│  │  function setupTest(                                │   │
│  │    config: TestConfig,                              │   │
│  │    options?: { debug: boolean; timeout: number }    │   │
│  │           └─┘                                       │   │
│  │           Optional parameter marker                 │   │
│  │  ): void {                                          │   │
│  │   └──┘                                              │   │
│  │   No return value                                   │   │
│  │    // implementation                                │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Arrow Function Annotations:                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Arrow function with explicit types              │   │
│  │  const validateEmail = (email: string): boolean => {│   │
│  │         └───────────┘   └───┘  └────┘   └─────┘     │   │
│  │         Function Name   Param  Type    Return       │   │
│  │    return email.includes('@');                      │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  │  // Arrow function with object parameter            │   │
│  │  const processFormData = (data: {                   │   │
│  │         └────────────┘   └──┘                       │   │
│  │         Function Name    Parameter                  │   │
│  │    firstName: string;                               │   │
│  │    lastName: string;                                │   │
│  │    email: string;                                   │   │
│  │  }): FormResult => {                                │   │
│  │   └────────┘                                        │   │
│  │   Return Type                                       │   │
│  │    // implementation                                │   │
│  │    return { success: true, data };                  │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  │  // Function type annotation for variables          │   │
│  │  let clickHandler: (event: MouseEvent) => void;     │   │
│  │      └──────────┘  └─────────────────────────┘      │   │
│  │      Variable      Function Type Signature         │   │
│  │                                                     │   │
│  │  clickHandler = (event: MouseEvent) => {            │   │
│  │    console.log('Button clicked');                   │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Object Type Annotations

### Complex Object Annotation Patterns

```
┌─────────────────────────────────────────────────────────────┐
│               📦 OBJECT TYPE ANNOTATIONS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Inline Object Type Annotation:                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  let user: {                                        │   │
│  │      └──┘                                           │   │
│  │      Variable                                       │   │
│  │    id: string;           ← Required property        │   │
│  │    name: string;         ← Required property        │   │
│  │    email: string;        ← Required property        │   │
│  │    age?: number;         ← Optional property        │   │
│  │    readonly role: string; ← Readonly property       │   │
│  │  } = {                                              │   │
│  │    id: "user-123",                                  │   │
│  │    name: "John Doe",                                │   │
│  │    email: "john@test.com",                          │   │
│  │    role: "admin"                                    │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Type Alias Annotation:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Define reusable type                            │   │
│  │  type User = {                                      │   │
│  │       └──┘                                          │   │
│  │       Type Name                                     │   │
│  │    id: string;                                      │   │
│  │    name: string;                                    │   │
│  │    email: string;                                   │   │
│  │    preferences?: {                                  │   │
│  │      theme: 'light' | 'dark';                      │   │
│  │      notifications: boolean;                        │   │
│  │    };                                               │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  │  // Use the type alias                              │   │
│  │  let currentUser: User = {                          │   │
│  │      └─────────┘  └──┘                              │   │
│  │      Variable    Type                               │   │
│  │    id: "user-456",                                  │   │
│  │    name: "Jane Smith",                              │   │
│  │    email: "jane@test.com",                          │   │
│  │    preferences: {                                   │   │
│  │      theme: 'dark',                                 │   │
│  │      notifications: true                            │   │
│  │    }                                                │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Interface Annotation:                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Define interface                                │   │
│  │  interface TestConfig {                             │   │
│  │            └────────┘                               │   │
│  │            Interface Name                           │   │
│  │    baseUrl: string;                                 │   │
│  │    timeout: number;                                 │   │
│  │    retries: number;                                 │   │
│  │    browser: {                                       │   │
│  │      name: string;                                  │   │
│  │      headless: boolean;                             │   │
│  │    };                                               │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Use the interface                               │   │
│  │  let config: TestConfig = {                         │   │
│  │      └────┘  └────────┘                             │   │
│  │      Variable Interface                             │   │
│  │    baseUrl: "https://test.example.com",             │   │
│  │    timeout: 30000,                                  │   │
│  │    retries: 3,                                      │   │
│  │    browser: {                                       │   │
│  │      name: "chromium",                              │   │
│  │      headless: true                                 │   │
│  │    }                                                │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Advanced Type Annotations

### Union Types, Generics, and Complex Patterns

```
┌─────────────────────────────────────────────────────────────┐
│              🔗 ADVANCED TYPE ANNOTATIONS                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Union Type Annotations:                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Union of primitive types                        │   │
│  │  let status: 'pending' | 'success' | 'error';       │   │
│  │      └────┘  └─────────────────────────────┘        │   │
│  │      Variable Union Type Definition                 │   │
│  │                                                     │   │
│  │  status = 'pending';  // ✅ Valid                   │   │
│  │  status = 'success';  // ✅ Valid                   │   │
│  │  status = 'failed';   // ❌ Error: not in union     │   │
│  │                                                     │   │
│  │  // Union of object types                           │   │
│  │  let response: SuccessResponse | ErrorResponse;     │   │
│  │      └──────┘  └─────────────────────────────┘      │   │
│  │      Variable  Union of Complex Types              │   │
│  │                                                     │   │
│  │  type SuccessResponse = {                           │   │
│  │    success: true;                                   │   │
│  │    data: any;                                       │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  │  type ErrorResponse = {                             │   │
│  │    success: false;                                  │   │
│  │    error: string;                                   │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Generic Type Annotations:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Generic function annotation                     │   │
│  │  function processData<T>(data: T): T {               │   │
│  │           └─────────┘└┘      └┘ └┘ └┘               │   │
│  │           Function   │       │  │  │                │   │
│  │           Name       │       │  │  └─ Return Type   │   │
│  │                      │       │  └─ Parameter Type  │   │
│  │                      │       └─ Parameter Name     │   │
│  │                      └─ Generic Type Parameter     │   │
│  │    return data;                                     │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Usage with specific types                       │   │
│  │  let userResult = processData<User>(userData);      │   │
│  │      └────────┘   └─────────┘└──┘ └──────┘          │   │
│  │      Variable    Function   Type  Argument         │   │
│  │                                                     │   │
│  │  let numberResult = processData<number>(42);        │   │
│  │      └──────────┘   └─────────┘└────┘ └┘            │   │
│  │      Variable      Function   Type  Value          │   │
│  │                                                     │   │
│  │  // Generic interface annotation                    │   │
│  │  interface ApiResponse<T> {                         │   │
│  │            └─────────┘└┘                            │   │
│  │            Interface  Generic Parameter            │   │
│  │    success: boolean;                                │   │
│  │    data: T;                                         │   │
│  │    message: string;                                 │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Usage with specific data types                  │   │
│  │  let userResponse: ApiResponse<User[]>;             │   │
│  │      └──────────┘  └─────────────────┘              │   │
│  │      Variable     Generic Interface with Type      │   │
│  │                                                     │   │
│  │  let configResponse: ApiResponse<TestConfig>;       │   │
│  │      └─────────────┘ └──────────────────────┘       │   │
│  │      Variable       Generic Interface with Type    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Array and Object Index Annotations:                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Array type annotations                          │   │
│  │  let usernames: string[] = ["user1", "user2"];      │   │
│  │      └───────┘  └──────┘   └─────────────────┘      │   │
│  │      Variable   Type       Value                    │   │
│  │                                                     │   │
│  │  let users: User[] = [user1, user2];                │   │
│  │      └───┘  └────┘   └─────────────┘                │   │
│  │      Var    Type     Value                          │   │
│  │                                                     │   │
│  │  // Alternative array syntax                        │   │
│  │  let scores: Array<number> = [95, 87, 92];          │   │
│  │      └────┘  └───────────┘   └──────────┘           │   │
│  │      Variable Generic Array  Value                 │   │
│  │                                                     │   │
│  │  // Object with index signature                     │   │
│  │  let testData: { [key: string]: any } = {           │   │
│  │      └──────┘  └─────────────────────┘   └─         │   │
│  │      Variable  Index Signature Type    Value       │   │
│  │    username: "testuser",                            │   │
│  │    password: "password123",                         │   │
│  │    rememberMe: true                                 │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  │  // Record utility type                             │   │
│  │  let config: Record<string, string | number> = {    │   │
│  │      └────┘  └──────────────────────────────┘       │   │
│  │      Variable Record Type (key: string, value: union)│  │
│  │    baseUrl: "https://test.com",                     │   │
│  │    timeout: 5000,                                   │   │
│  │    retries: 3                                       │   │
│  │  };                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Test Automation Specific Annotations

### Page Object and Test Data Annotations

```
┌─────────────────────────────────────────────────────────────┐
│          🎯 TEST AUTOMATION SPECIFIC ANNOTATIONS           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Page Object Method Annotations:                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  class LoginPage {                                  │   │
│  │    // Property annotations                          │   │
│  │    private page: Page;                              │   │
│  │            └──┘  └──┘                               │   │
│  │            Property Type                            │   │
│  │                                                     │   │
│  │    private elements: {                              │   │
│  │            └──────┘                                 │   │
│  │            Property                                 │   │
│  │      usernameInput: string;                         │   │
│  │      passwordInput: string;                         │   │
│  │      submitButton: string;                          │   │
│  │    };                                               │   │
│  │                                                     │   │
│  │    // Constructor annotation                        │   │
│  │    constructor(page: Page) {                        │   │
│  │                └──┘  └──┘                           │   │
│  │                Param Type                           │   │
│  │      this.page = page;                              │   │
│  │      this.elements = {                              │   │
│  │        usernameInput: "#username",                  │   │
│  │        passwordInput: "#password",                  │   │
│  │        submitButton: "[type='submit']"              │   │
│  │      };                                             │   │
│  │    }                                                │   │
│  │                                                     │   │
│  │    // Method annotations                            │   │
│  │    async login(                                     │   │
│  │      username: string,                              │   │
│  │      password: string                               │   │
│  │    ): Promise<void> {                               │   │
│  │     └─────────────┘                                 │   │
│  │     Return Type                                     │   │
│  │      await this.page.fill(this.elements.usernameInput, username);│ │
│  │      await this.page.fill(this.elements.passwordInput, password);│ │
│  │      await this.page.click(this.elements.submitButton);│ │
│  │    }                                                │   │
│  │                                                     │   │
│  │    async getErrorMessage(): Promise<string | null> {│   │
│  │         └─────────────┘     └─────────────────────┘ │   │
│  │         Method Name         Return Type (Union)    │   │
│  │      const errorElement = this.page.locator('.error');│ │
│  │      if (await errorElement.isVisible()) {          │   │
│  │        return await errorElement.textContent();     │   │
│  │      }                                              │   │
│  │      return null;                                   │   │
│  │    }                                                │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Test Data Type Annotations:                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Test case data structure                        │   │
│  │  interface TestCase {                               │   │
│  │    id: string;                                      │   │
│  │    name: string;                                    │   │
│  │    priority: 'low' | 'medium' | 'high';            │   │
│  │    data: {                                          │   │
│  │      input: Record<string, any>;                    │   │
│  │      expected: Record<string, any>;                 │   │
│  │    };                                               │   │
│  │    setup?: () => Promise<void>;                     │   │
│  │    cleanup?: () => Promise<void>;                   │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Test data implementation                        │   │
│  │  const loginTests: TestCase[] = [                   │   │
│  │        └────────┘  └─────────┘                      │   │
│  │        Variable   Array Type                        │   │
│  │    {                                                │   │
│  │      id: "TC-001",                                  │   │
│  │      name: "Valid Login",                           │   │
│  │      priority: "high",                              │   │
│  │      data: {                                        │   │
│  │        input: {                                     │   │
│  │          username: "testuser",                      │   │
│  │          password: "password123"                    │   │
│  │        },                                           │   │
│  │        expected: {                                  │   │
│  │          redirectUrl: "/dashboard",                 │   │
│  │          welcomeMessage: "Welcome back!"            │   │
│  │        }                                            │   │
│  │      }                                              │   │
│  │    },                                               │   │
│  │    {                                                │   │
│  │      id: "TC-002",                                  │   │
│  │      name: "Invalid Login",                         │   │
│  │      priority: "medium",                            │   │
│  │      data: {                                        │   │
│  │        input: {                                     │   │
│  │          username: "wronguser",                     │   │
│  │          password: "wrongpass"                      │   │
│  │        },                                           │   │
│  │        expected: {                                  │   │
│  │          errorMessage: "Invalid credentials",       │   │
│  │          remainOnPage: true                         │   │
│  │        }                                            │   │
│  │      }                                              │   │
│  │    }                                                │   │
│  │  ];                                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  API Response Type Annotations:                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  // Generic API response structure                  │   │
│  │  interface ApiResponse<T> {                         │   │
│  │    success: boolean;                                │   │
│  │    statusCode: number;                              │   │
│  │    message: string;                                 │   │
│  │    data?: T;                                        │   │
│  │    errors?: string[];                               │   │
│  │    timestamp: string;                               │   │
│  │  }                                                  │   │
│  │                                                     │   │
│  │  // Specific response types                         │   │
│  │  type UserResponse = ApiResponse<{                  │   │
│  │       └──────────┘  └─────────────