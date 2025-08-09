# Lesson 12: TypeScript for API Testing Patterns - Content

## 🚀 Introduction

Welcome to the most practical lesson in our TypeScript journey! This lesson focuses specifically on applying TypeScript to API testing scenarios. You'll learn to create robust, type-safe API clients, handle complex response structures, and build reusable patterns that make API testing more reliable and maintainable.

### Why TypeScript for API Testing?

API testing involves handling dynamic data structures, various response formats, and complex error scenarios. TypeScript provides several key benefits:

**1. Contract Enforcement**
```typescript
// API contract is enforced at compile time
interface UserResponse {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

// This will catch errors before runtime
function processUser(user: UserResponse) {
    return user.name.toUpperCase(); // TypeScript ensures 'name' exists and is a string
}
```

**2. Better Error Handling**
```typescript
// Type-safe error responses
interface ApiError {
    code: string;
    message: string;
    details?: string[];
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}
```

**3. IDE Support for API Development**
- Autocomplete for API response properties
- Immediate feedback on type mismatches
- Refactoring support across API client code

## 🏗️ Part 1: API Interface Design (45 minutes)

### Designing Comprehensive API Interfaces

The foundation of type-safe API testing is well-designed interfaces that accurately represent your API contracts.

#### Basic API Response Structure

```typescript
// Generic API response wrapper
interface ApiResponse<T = any> {
    status: number;
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
    requestId: string;
}

// Success response example
interface SuccessResponse<T> extends ApiResponse<T> {
    success: true;
    data: T;
}

// Error response example
interface ErrorResponse extends ApiResponse<null> {
    success: false;
    data: null;
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
}
```

#### User Management API Interfaces

```typescript
// User entity interface
interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
    profile?: UserProfile;
}

// User profile interface
interface UserProfile {
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };
}

// User creation request
interface CreateUserRequest {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roles?: string[];
}

// User update request (partial update)
interface UpdateUserRequest {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    roles?: string[];
}

// User list response with pagination
interface UserListResponse {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    filters?: {
        isActive?: boolean;
        roles?: string[];
        search?: string;
    };
}
```

#### Authentication API Interfaces

```typescript
// Login request
interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

// Login response
interface LoginResponse {
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
    };
    permissions: string[];
}

// Token refresh request
interface RefreshTokenRequest {
    refreshToken: string;
}

// Password reset request
interface PasswordResetRequest {
    email: string;
    callbackUrl?: string;
}

// Password reset confirmation
interface PasswordResetConfirmRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
```

#### E-commerce API Interfaces

```typescript
// Product interface
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    currency: string;
    category: ProductCategory;
    images: ProductImage[];
    inventory: {
        quantity: number;
        reserved: number;
        available: number;
    };
    attributes: Record<string, any>;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Product category
interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    parentId?: number;
    level: number;
}

// Product image
interface ProductImage {
    id: number;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
}

// Order interface
interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    status: OrderStatus;
    items: OrderItem[];
    totals: OrderTotals;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: PaymentMethod;
    createdAt: string;
    updatedAt: string;
}

// Order status enum
type OrderStatus = 
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

// Order item
interface OrderItem {
    id: number;
    productId: number;
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discounts?: Discount[];
}

// Order totals
interface OrderTotals {
    subtotal: number;
    tax: number;
    shipping: number;
    discounts: number;
    total: number;
    currency: string;
}
```

### Advanced Interface Patterns

#### Discriminated Unions for Different Response Types

```typescript
// Different types of API responses
type ApiResult<T> = 
    | { success: true; data: T; error: null }
    | { success: false; data: null; error: ApiError };

// Usage with type guards
function handleApiResult<T>(result: ApiResult<T>): T {
    if (result.success) {
        // TypeScript knows this is the success case
        return result.data;
    } else {
        // TypeScript knows this is the error case
        throw new Error(result.error.message);
    }
}
```

#### Generic Interfaces for Different Endpoints

```typescript
// Generic CRUD operations interface
interface CrudOperations<T, CreateRequest, UpdateRequest> {
    getAll(params?: QueryParams): Promise<ApiResponse<T[]>>;
    getById(id: number): Promise<ApiResponse<T>>;
    create(data: CreateRequest): Promise<ApiResponse<T>>;
    update(id: number, data: UpdateRequest): Promise<ApiResponse<T>>;
    delete(id: number): Promise<ApiResponse<void>>;
}

// Query parameters interface
interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
}
```

## 🔧 Part 2: Type-Safe API Client Implementation (60 minutes)

### Building a Comprehensive API Client

Let's build a complete, type-safe API client that demonstrates all the concepts we've learned.

#### Base API Client Class

```typescript
// HTTP methods type
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration interface
interface RequestConfig {
    method: HttpMethod;
    url: string;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
}

// API client configuration
interface ApiClientConfig {
    baseURL: string;
    timeout: number;
    defaultHeaders: Record<string, string>;
    retryAttempts: number;
    retryDelay: number;
}

// Base API client class
class ApiClient {
    private config: ApiClientConfig;
    private authToken?: string;

    constructor(config: ApiClientConfig) {
        this.config = config;
    }

    // Set authentication token
    setAuthToken(token: string): void {
        this.authToken = token;
    }

    // Clear authentication token
    clearAuthToken(): void {
        this.authToken = undefined;
    }

    // Generic request method
    async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
        const url = `${this.config.baseURL}${config.url}`;
        const headers = this.buildHeaders(config.headers);

        try {
            const response = await this.executeRequest<T>({
                ...config,
                url,
                headers
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Build request headers
    private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
        const headers = {
            ...this.config.defaultHeaders,
            ...customHeaders
        };

        if (this.authToken) {
            headers.Authorization = `Bearer ${this.authToken}`;
        }

        return headers;
    }

    // Execute HTTP request with retry logic
    private async executeRequest<T>(config: RequestConfig): Promise<Response> {
        let lastError: Error;

        for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const response = await fetch(config.url, {
                    method: config.method,
                    headers: config.headers,
                    body: config.data ? JSON.stringify(config.data) : undefined,
                    signal: AbortSignal.timeout(config.timeout || this.config.timeout)
                });

                if (response.ok || attempt === this.config.retryAttempts) {
                    return response;
                }

                // Retry on server errors (5xx)
                if (response.status >= 500) {
                    await this.delay(this.config.retryDelay * (attempt + 1));
                    continue;
                }

                return response;
            } catch (error) {
                lastError = error as Error;
                if (attempt < this.config.retryAttempts) {
                    await this.delay(this.config.retryDelay * (attempt + 1));
                } else {
                    throw lastError;
                }
            }
        }

        throw lastError!;
    }

    // Handle successful responses
    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            return {
                status: response.status,
                success: response.ok,
                data: response.ok ? data : null,
                message: data.message || response.statusText,
                timestamp: new Date().toISOString(),
                requestId: response.headers.get('x-request-id') || ''
            };
        }

        return {
            status: response.status,
            success: response.ok,
            data: null as T,
            message: response.statusText,
            timestamp: new Date().toISOString(),
            requestId: response.headers.get('x-request-id') || ''
        };
    }

    // Handle request errors
    private handleError(error: Error): ApiResponse<any> {
        return {
            status: 0,
            success: false,
            data: null,
            message: error.message,
            timestamp: new Date().toISOString(),
            requestId: ''
        };
    }

    // Utility delay function
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Convenience methods for different HTTP verbs
    async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'GET',
            url: this.buildUrlWithParams(url, params)
        });
    }

    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'POST',
            url,
            data,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'PUT',
            url,
            data,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'PATCH',
            url,
            data,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: 'DELETE',
            url
        });
    }

    // Build URL with query parameters
    private buildUrlWithParams(url: string, params?: Record<string, any>): string {
        if (!params) return url;

        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `${url}?${queryString}` : url;
    }
}
```

#### Specialized API Service Classes

```typescript
// User service class
class UserService {
    constructor(private apiClient: ApiClient) {}

    async getAllUsers(params?: QueryParams): Promise<ApiResponse<UserListResponse>> {
        return this.apiClient.get<UserListResponse>('/users', params);
    }

    async getUserById(id: number): Promise<ApiResponse<User>> {
        return this.apiClient.get<User>(`/users/${id}`);
    }

    async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
        return this.apiClient.post<User>('/users', userData);
    }

    async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
        return this.apiClient.patch<User>(`/users/${id}`, userData);
    }

    async deleteUser(id: number): Promise<ApiResponse<void>> {
        return this.apiClient.delete<void>(`/users/${id}`);
    }

    async searchUsers(query: string, filters?: Record<string, any>): Promise<ApiResponse<UserListResponse>> {
        return this.apiClient.get<UserListResponse>('/users/search', {
            q: query,
            ...filters
        });
    }
}

// Authentication service class
class AuthService {
    constructor(private apiClient: ApiClient) {}

    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await this.apiClient.post<LoginResponse>('/auth/login', credentials);
        
        // Automatically set auth token on successful login
        if (response.success && response.data) {
            this.apiClient.setAuthToken(response.data.tokens.accessToken);
        }
        
        return response;
    }

    async logout(): Promise<ApiResponse<void>> {
        const response = await this.apiClient.post<void>('/auth/logout');
        
        // Clear auth token on logout
        this.apiClient.clearAuthToken();
        
        return response;
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
        return this.apiClient.post<LoginResponse>('/auth/refresh', { refreshToken });
    }

    async resetPassword(email: string): Promise<ApiResponse<void>> {
        return this.apiClient.post<void>('/auth/reset-password', { email });
    }

    async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<ApiResponse<void>> {
        return this.apiClient.post<void>('/auth/reset-password/confirm', data);
    }
}

// Product service class
class ProductService {
    constructor(private apiClient: ApiClient) {}

    async getAllProducts(params?: QueryParams): Promise<ApiResponse<Product[]>> {
        return this.apiClient.get<Product[]>('/products', params);
    }

    async getProductById(id: number): Promise<ApiResponse<Product>> {
        return this.apiClient.get<Product>(`/products/${id}`);
    }

    async getProductsByCategory(categoryId: number, params?: QueryParams): Promise<ApiResponse<Product[]>> {
        return this.apiClient.get<Product[]>(`/categories/${categoryId}/products`, params);
    }

    async searchProducts(query: string, filters?: Record<string, any>): Promise<ApiResponse<Product[]>> {
        return this.apiClient.get<Product[]>('/products/search', {
            q: query,
            ...filters
        });
    }
}
```

### API Client Factory and Configuration

```typescript
// API client factory
class ApiClientFactory {
    private static instances: Map<string, ApiClient> = new Map();

    static create(name: string, config: ApiClientConfig): ApiClient {
        if (this.instances.has(name)) {
            return this.instances.get(name)!;
        }

        const client = new ApiClient(config);
        this.instances.set(name, client);
        return client;
    }

    static get(name: string): ApiClient {
        const client = this.instances.get(name);
        if (!client) {
            throw new Error(`API client '${name}' not found. Create it first using ApiClientFactory.create()`);
        }
        return client;
    }
}

// Environment-specific configurations
const configs = {
    development: {
        baseURL: 'http://localhost:3000/api',
        timeout: 10000,
        defaultHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        retryAttempts: 2,
        retryDelay: 1000
    },
    staging: {
        baseURL: 'https://staging-api.example.com/api',
        timeout: 15000,
        defaultHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        retryAttempts: 3,
        retryDelay: 2000
    },
    production: {
        baseURL: 'https://api.example.com/api',
        timeout: 20000,
        defaultHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        retryAttempts: 3,
        retryDelay: 2000
    }
};

// Service factory
class ServiceFactory {
    private userService?: UserService;
    private authService?: AuthService;
    private productService?: ProductService;

    constructor(private apiClient: ApiClient) {}

    getUserService(): UserService {
        if (!this.userService) {
            this.userService = new UserService(this.apiClient);
        }
        return this.userService;
    }

    getAuthService(): AuthService {
        if (!this.authService) {
            this.authService = new AuthService(this.apiClient);
        }
        return this.authService;
    }

    getProductService(): ProductService {
        if (!this.productService) {
            this.productService = new ProductService(this.apiClient);
        }
        return this.productService;
    }
}
```

## 🔍 Part 3: Advanced API Testing Patterns (45 minutes)

### Type-Safe Request Builders

```typescript
// Request builder pattern for complex API calls
class UserRequestBuilder {
    private params: QueryParams = {};
    private filters: Record<string, any> = {};

    page(page: number): this {
        this.params.page = page;
        return this;
    }

    limit(limit: number): this {
        this.params.limit = limit;
        return this;
    }

    sortBy(field: keyof User, order: 'asc' | 'desc' = 'asc'): this {
        this.params.sort = field;
        this.params.order = order;
        return this;
    }

    search(query: string): this {
        this.params.search = query;
        return this;
    }

    filterByRole(roles: string[]): this {
        this.filters.roles = roles;
        return this;
    }

    filterByStatus(isActive: boolean): this {
        this.filters.isActive = isActive;
        return this;
    }

    filterByDateRange(startDate: string, endDate: string): this {
        this.filters.createdAt = {
            gte: startDate,
            lte: endDate
        };
        return this;
    }

    build(): QueryParams {
        return {
            ...this.params,
            filters: Object.keys(this.filters).length > 0 ? this.filters : undefined
        };
    }
}

// Usage example
const userQuery = new UserRequestBuilder()
    .page(1)
    .limit(20)
    .sortBy('createdAt', 'desc')
    .filterByStatus(true)
    .filterByRole(['admin', 'user'])
    .build();
```

### Response Validation and Type Guards

```typescript
// Type guard functions
function isUser(obj: any): obj is User {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.username === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.isActive === 'boolean' &&
        Array.isArray(obj.roles)
    );
}

function isApiResponse<T>(obj: any, dataValidator: (data: any) => data is T): obj is ApiResponse<T> {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.status === 'number' &&
        typeof obj.success === 'boolean' &&
        typeof obj.message === 'string' &&
        (obj.success ? dataValidator(obj.data) : obj.data === null)
    );
}

// Response validator class
class ResponseValidator {
    static validateUserResponse(response: any): ApiResponse<User> {
        if (!isApiResponse(response, isUser)) {
            throw new Error('Invalid user response format');
        }
        return response;
    }

    static validateUserListResponse(response: any): ApiResponse<UserListResponse> {
        if (!isApiResponse(response, (data): data is UserListResponse => {
            return (
                typeof data === 'object' &&
                data !== null &&
                Array.isArray(data.users) &&
                data.users.every(isUser) &&
                typeof data.pagination === 'object'
            );
        })) {
            throw new Error('Invalid user list response format');
        }
        return response;
    }
}
```

### Error Handling Patterns

```typescript
// Custom error classes
class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

class ValidationError extends ApiError {
    constructor(message: string, public validationErrors: Record<string, string[]>) {
        super(400, 'VALIDATION_ERROR', message, validationErrors);
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends ApiError {
    constructor(message: string = 'Authentication required') {
        super(401, 'AUTHENTICATION_ERROR', message);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends ApiError {
    constructor(message: string = 'Insufficient permissions') {
        super(403, 'AUTHORIZATION_ERROR', message);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends ApiError {
    constructor(resource: string, id?: string | number) {
        const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
        super(404, 'NOT_FOUND', message);
        this.name = 'NotFoundError';
    }
}

// Error handler utility
class ErrorHandler {
    static handleApiError(response: ApiResponse<any>): never {
        if (response.success) {
            return;
        }

        switch (response.status) {
            case 400:
                if (response.data?.error?.code === 'VALIDATION_ERROR') {
                    throw new ValidationError(response.message, response.data.error.details);
                }
                throw new ApiError(response.status, 'BAD_REQUEST', response.message);
            
            case 401:
                throw new AuthenticationError(response.message);
            
            case 403:
                throw new AuthorizationError(response.message);
            
            case 404:
                throw new NotFoundError('Resource');
            
            case 500:
                throw new ApiError(response.status, 'INTERNAL_SERVER_ERROR', response.message);
            
            default:
                throw new ApiError(response.status, 'UNKNOWN_ERROR', response.message);
        }
    }

    static async safeApiCall<T>(apiCall: () => Promise<ApiResponse<T>>): Promise<T> {
        try {
            const response = await apiCall();
            
            if (!response.success) {
                this.handleApiError(response);
            }
            
            return response.data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            // Handle network errors, timeouts, etc.
            throw new ApiError(0, 'NETWORK_ERROR', error.message);
        }
    }
}
```

### Testing Utilities and Helpers

```typescript
// Test data factory
class TestDataFactory {
    static createUser(overrides: Partial<User> = {}): User {
        return {
            id: Math.floor(Math.random() * 10000),
            username: `testuser${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            firstName: 'Test',
            lastName: 'User',
            isActive: true,
            roles: ['user'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...overrides
        };
    }

    static createCreateUserRequest(overrides: Partial<CreateUserRequest> = {}): CreateUserRequest {
        return {
            username: `testuser${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            firstName: 'Test',
            lastName: 'User',
            password: 'TestPassword123!',
            roles: ['user'],
            ...overrides
        };
    }

    static createProduct(overrides: Partial<Product> = {}): Product {
        return {
            id: Math.floor(Math.random() * 10000),
            name: `Test Product ${Date.now()}`,
            description: 'A test product for API testing',
            price: 99.99,
            currency: 'USD',
            category: {
                id: 1,
                name: 'Test Category',
                slug: 'test-category',
                level: 1
            },
            images: [],
            inventory: {
                quantity: 100,
                reserved: 0,
                available: 100
            },
            attributes: {},
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...overrides
        };
    }
}

// API test utilities
class ApiTestUtils {
    static async waitForCondition<T>(
        apiCall: () => Promise<ApiResponse<T>>,
        condition: (data: T) => boolean,
        timeout: number = 10000,
        interval: number = 1000
    ): Promise<T> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                const response = await apiCall();
                if (response.success && condition(response.data)) {
                    return response.data;
                }
            } catch (error) {
                // Continue polling on error
            }
            
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        throw new Error(`Condition not met within ${timeout}ms`);
    }

    static async retryApiCall<T>(
        apiCall: () => Promise<ApiResponse<T>>,
        maxRetries: number = 3,
        delay: number = 1000
    ): Promise<ApiResponse<T>> {
        let lastError: Error;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                lastError = error as Error;
                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
                }
            }
        }
        
        throw lastError!;
    }

    static generateUniqueEmail(prefix: string = 'test'): string {
        return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;
    }

    static generateRandomString(length: number = 10): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
```

## 🎯 Part 4: Practical Examples and Integration (30 minutes)

### Complete API Testing Example

```typescript
// Complete example: User management API testing
class UserApiTests {
    private serviceFactory: ServiceFactory;
    private userService: UserService;
    private authService: AuthService;

    constructor() {
        // Initialize API client
        const apiClient = ApiClientFactory.create('test', configs.development);
        this.serviceFactory = new ServiceFactory(apiClient);
        this.userService = this.serviceFactory.getUserService();
        this.authService = this.serviceFactory.getAuthService();
    }

    async runTests(): Promise<void> {
        console.log('Starting API tests...');

        try {
            // Test authentication
            await this.testAuthentication();
            
            // Test user CRUD operations
            await this.testUserCrud();
            
            // Test user search and filtering
            await this.testUserSearch();
            
            // Test error handling
            await this.testErrorHandling();
            
            console.log('All tests passed!');
        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    }

    private async testAuthentication(): Promise<void> {
        console.log('Testing authentication...');

        // Test login
        const loginResponse = await this.authService.login({
            email: 'admin@example.com',
            password: 'admin123'
        });

        if (!login