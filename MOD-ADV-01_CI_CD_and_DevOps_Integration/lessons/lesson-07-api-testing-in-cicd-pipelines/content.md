# Lesson 07: API Testing in CI/CD Pipelines

## Learning Objectives

By the end of this lesson, you will be able to:

- Design and implement comprehensive API testing strategies within CI/CD pipelines
- Integrate contract testing patterns using Pact and OpenAPI specifications
- Implement service virtualization and mock strategies for complex microservices architectures
- Build automated API security testing with OWASP compliance
- Create performance testing suites for API endpoints with load testing integration
- Design API versioning strategies and backward compatibility testing
- Implement chaos engineering practices for API resilience testing
- Integrate API testing with observability and monitoring systems

## Introduction

Modern software architectures increasingly rely on APIs as the primary integration points between services, making API testing a critical component of enterprise CI/CD pipelines. This lesson covers advanced API testing patterns that go beyond simple functional validation to include contract testing, security validation, performance testing, and resilience engineering.

In enterprise environments, API testing must handle complex dependency graphs, multiple service versions, and varying deployment schedules across teams. We'll explore how to build robust API testing frameworks that can validate service interactions, ensure backward compatibility, and maintain system reliability even as individual components evolve independently.

The focus will be on scalable testing patterns that integrate seamlessly with CI/CD workflows while providing comprehensive coverage of functional, security, performance, and reliability concerns across distributed systems.

## 1. Enterprise API Testing Architecture

### Multi-Layer Testing Strategy

```yaml
# .github/workflows/api-testing-pipeline.yml
name: Comprehensive API Testing Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  TEST_ENVIRONMENT: ${{ github.ref == 'refs/heads/main' && 'staging' || 'dev' }}
  API_BASE_URL: ${{ secrets.API_BASE_URL }}
  CONTRACT_BROKER_URL: ${{ secrets.PACT_BROKER_URL }}

jobs:
  api-unit-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run API Unit Tests
        run: npm run test:api:unit
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/testdb

      - name: Generate Coverage Report
        run: npm run coverage:api

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/api-coverage.xml
          flags: api-tests

  contract-testing:
    runs-on: ubuntu-latest
    needs: api-unit-tests
    strategy:
      matrix:
        consumer: [web-client, mobile-app, internal-service]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Contract Tests - ${{ matrix.consumer }}
        run: |
          npm run test:contract:consumer -- --consumer=${{ matrix.consumer }}
          npm run test:contract:provider -- --consumer=${{ matrix.consumer }}

      - name: Publish Contracts to Broker
        run: |
          npx pact-broker publish pacts \
            --broker-base-url=$CONTRACT_BROKER_URL \
            --broker-token=${{ secrets.PACT_BROKER_TOKEN }} \
            --consumer-app-version=${{ github.sha }} \
            --branch=${{ github.ref_name }}

      - name: Verify Contract Compatibility
        run: |
          npx pact-broker can-i-deploy \
            --broker-base-url=$CONTRACT_BROKER_URL \
            --broker-token=${{ secrets.PACT_BROKER_TOKEN }} \
            --pacticipant=api-service \
            --version=${{ github.sha }}

  integration-testing:
    runs-on: ubuntu-latest
    needs: contract-testing
    services:
      api-service:
        image: myorg/api-service:${{ github.sha }}
        ports:
          - 3000:3000
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:testpass@postgres:5432/testdb
      
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Wait for Services
        run: |
          timeout 300 bash -c 'until curl -f http://localhost:3000/health; do sleep 5; done'

      - name: Run Integration Tests
        run: npm run test:api:integration
        env:
          API_URL: http://localhost:3000
          REDIS_URL: redis://localhost:6379

      - name: Run Security Tests
        run: npm run test:api:security
        env:
          API_URL: http://localhost:3000
          OWASP_ZAP_URL: http://localhost:8080

      - name: Generate Test Reports
        if: always()
        run: |
          npm run test:report:integration
          npm run test:report:security

  performance-testing:
    runs-on: ubuntu-latest
    needs: integration-testing
    if: github.ref == 'refs/heads/main' || contains(github.event.pull_request.labels.*.name, 'performance-test')
    
    steps:
      - uses: actions/checkout@v4

      - name: Setup K6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run Load Tests
        run: |
          k6 run tests/performance/load-test.js \
            --env API_BASE_URL=$API_BASE_URL \
            --env TEST_DURATION=5m \
            --env VUS=50

      - name: Run Stress Tests
        run: |
          k6 run tests/performance/stress-test.js \
            --env API_BASE_URL=$API_BASE_URL \
            --env TEST_DURATION=10m \
            --env VUS_MAX=200

      - name: Analyze Performance Results
        run: npm run analyze:performance

      - name: Upload Performance Reports
        uses: actions/upload-artifact@v4
        with:
          name: performance-reports
          path: reports/performance/
```

### Advanced API Test Framework

```typescript
// src/testing/api-test-framework.ts
interface APITestConfig {
  baseURL: string;
  authentication: AuthConfig;
  timeout: number;
  retries: number;
  environment: string;
  contracts: ContractConfig[];
  security: SecurityTestConfig;
  performance: PerformanceTestConfig;
}

class APITestFramework {
  private client: APIClient;
  private contractTester: ContractTester;
  private securityTester: SecurityTester;
  private performanceTester: PerformanceTester;

  constructor(private config: APITestConfig) {
    this.client = new APIClient(config);
    this.contractTester = new ContractTester(config.contracts);
    this.securityTester = new SecurityTester(config.security);
    this.performanceTester = new PerformanceTester(config.performance);
  }

  async runComprehensiveTests(): Promise<TestSuiteResults> {
    const results: TestSuiteResults = {
      functional: await this.runFunctionalTests(),
      contract: await this.runContractTests(),
      security: await this.runSecurityTests(),
      performance: await this.runPerformanceTests(),
      integration: await this.runIntegrationTests()
    };

    return results;
  }

  private async runFunctionalTests(): Promise<FunctionalTestResults> {
    const testSuites = [
      new CRUDTestSuite(this.client),
      new ValidationTestSuite(this.client),
      new ErrorHandlingTestSuite(this.client),
      new BusinessLogicTestSuite(this.client)
    ];

    const results: FunctionalTestResults = {
      suites: [],
      summary: { total: 0, passed: 0, failed: 0, skipped: 0 }
    };

    for (const suite of testSuites) {
      const suiteResult = await suite.run();
      results.suites.push(suiteResult);
      
      results.summary.total += suiteResult.tests.length;
      results.summary.passed += suiteResult.tests.filter(t => t.status === 'passed').length;
      results.summary.failed += suiteResult.tests.filter(t => t.status === 'failed').length;
      results.summary.skipped += suiteResult.tests.filter(t => t.status === 'skipped').length;
    }

    return results;
  }

  private async runContractTests(): Promise<ContractTestResults> {
    return await this.contractTester.runAllContracts();
  }

  private async runSecurityTests(): Promise<SecurityTestResults> {
    return await this.securityTester.runSecuritySuite();
  }

  private async runPerformanceTests(): Promise<PerformanceTestResults> {
    return await this.performanceTester.runPerformanceSuite();
  }
}

class APIClient {
  private httpClient: HTTPClient;
  private authManager: AuthenticationManager;

  constructor(private config: APITestConfig) {
    this.httpClient = new HTTPClient({
      baseURL: config.baseURL,
      timeout: config.timeout,
      retries: config.retries
    });
    this.authManager = new AuthenticationManager(config.authentication);
  }

  async request<T>(options: RequestOptions): Promise<APIResponse<T>> {
    const authHeaders = await this.authManager.getAuthHeaders();
    
    const response = await this.httpClient.request<T>({
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return this.processResponse<T>(response);
  }

  private processResponse<T>(response: HTTPResponse): APIResponse<T> {
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      timing: response.timing,
      metadata: this.extractMetadata(response)
    };
  }

  private extractMetadata(response: HTTPResponse): ResponseMetadata {
    return {
      requestId: response.headers['x-request-id'],
      traceId: response.headers['x-trace-id'],
      rateLimit: {
        limit: parseInt(response.headers['x-ratelimit-limit'] || '0'),
        remaining: parseInt(response.headers['x-ratelimit-remaining'] || '0'),
        reset: parseInt(response.headers['x-ratelimit-reset'] || '0')
      },
      cacheInfo: {
        hit: response.headers['x-cache'] === 'HIT',
        age: parseInt(response.headers['age'] || '0')
      }
    };
  }
}
```

## 2. Contract Testing Implementation

### Pact Consumer Testing

```typescript
// tests/contract/consumer/user-service.pact.test.ts
import { Pact, Interaction, Matchers } from '@pact-foundation/pact';
import { UserService } from '../../../src/services/user-service';

const { like, eachLike, term } = Matchers;

describe('User Service Contract Tests', () => {
  const provider = new Pact({
    consumer: 'web-client',
    provider: 'user-service',
    port: 1234,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO'
  });

  const userService = new UserService('http://localhost:1234');

  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.verify();
  });

  describe('GET /users/{id}', () => {
    const getUserInteraction: Interaction = {
      state: 'user with ID 123 exists',
      uponReceiving: 'a request for user with ID 123',
      withRequest: {
        method: 'GET',
        path: '/users/123',
        headers: {
          'Authorization': term({
            matcher: 'Bearer [A-Za-z0-9\\-_]+\\.[A-Za-z0-9\\-_]+\\.[A-Za-z0-9\\-_]+',
            generate: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
          }),
          'Accept': 'application/json'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': like('req-123456')
        },
        body: {
          id: like(123),
          email: like('user@example.com'),
          name: like('John Doe'),
          roles: eachLike('user'),
          profile: {
            avatar: term({
              matcher: 'https?://.*\\.(jpg|jpeg|png|gif)',
              generate: 'https://example.com/avatar.jpg'
            }),
            createdAt: like('2023-01-01T00:00:00Z'),
            lastLoginAt: like('2023-01-01T00:00:00Z')
          },
          preferences: like({
            theme: 'light',
            notifications: true,
            language: 'en'
          })
        }
      }
    };

    beforeEach(async () => {
      await provider.addInteraction(getUserInteraction);
    });

    it('should return user details when user exists', async () => {
      const user = await userService.getUserById(123, 'valid-token');

      expect(user).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        name: expect.any(String),
        roles: expect.any(Array),
        profile: expect.objectContaining({
          avatar: expect.any(String),
          createdAt: expect.any(String),
          lastLoginAt: expect.any(String)
        }),
        preferences: expect.any(Object)
      });
    });
  });

  describe('POST /users', () => {
    const createUserInteraction: Interaction = {
      state: 'system is ready to accept new users',
      uponReceiving: 'a request to create a new user',
      withRequest: {
        method: 'POST',
        path: '/users',
        headers: {
          'Authorization': term({
            matcher: 'Bearer [A-Za-z0-9\\-_]+\\.[A-Za-z0-9\\-_]+\\.[A-Za-z0-9\\-_]+',
            generate: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
          }),
          'Content-Type': 'application/json'
        },
        body: {
          email: term({
            matcher: '^[\\w\\.-]+@[\\w\\.-]+\\.[A-Za-z]{2,}$',
            generate: 'newuser@example.com'
          }),
          name: like('Jane Smith'),
          password: term({
            matcher: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
            generate: 'SecurePass123!'
          }),
          roles: eachLike('user')
        }
      },
      willRespondWith: {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Location': term({
            matcher: '/users/\\d+',
            generate: '/users/456'
          })
        },
        body: {
          id: like(456),
          email: like('newuser@example.com'),
          name: like('Jane Smith'),
          roles: eachLike('user'),
          createdAt: like('2023-01-01T00:00:00Z'),
          status: like('active')
        }
      }
    };

    beforeEach(async () => {
      await provider.addInteraction(createUserInteraction);
    });

    it('should create user and return user details', async () => {
      const newUser = {
        email: 'newuser@example.com',
        name: 'Jane Smith',
        password: 'SecurePass123!',
        roles: ['user']
      };

      const createdUser = await userService.createUser(newUser, 'valid-token');

      expect(createdUser).toMatchObject({
        id: expect.any(Number),
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles,
        createdAt: expect.any(String),
        status: 'active'
      });
    });
  });
});
```

### Provider Verification

```typescript
// tests/contract/provider/user-service.verification.test.ts
import { Verifier, VerifierOptions } from '@pact-foundation/pact';
import { Server } from '../../../src/server';
import { DatabaseSeeder } from '../../../src/testing/database-seeder';

describe('User Service Provider Verification', () => {
  let server: Server;
  let seeder: DatabaseSeeder;

  const opts: VerifierOptions = {
    provider: 'user-service',
    providerBaseUrl: 'http://localhost:3000',
    pactBrokerUrl: process.env.PACT_BROKER_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    publishVerificationResult: true,
    providerVersion: process.env.GIT_COMMIT,
    providerVersionBranch: process.env.GIT_BRANCH,
    
    // State handlers for managing test data
    stateHandlers: {
      'user with ID 123 exists': async () => {
        await seeder.createUser({
          id: 123,
          email: 'user@example.com',
          name: 'John Doe',
          roles: ['user'],
          status: 'active'
        });
      },
      
      'system is ready to accept new users': async () => {
        await seeder.clearUsers();
        await seeder.setupBasicData();
      },
      
      'user with ID 123 does not exist': async () => {
        await seeder.removeUser(123);
      }
    },

    // Request filters for authentication
    requestFilter: (req, res, next) => {
      if (req.headers.authorization) {
        // Mock authentication for contract tests
        req.user = { id: 1, roles: ['admin'] };
      }
      next();
    },

    // Custom verification logic
    beforeEach: async () => {
      await seeder.resetDatabase();
    },

    timeout: 30000
  };

  beforeAll(async () => {
    server = new Server({ port: 3000, env: 'test' });
    await server.start();
    
    seeder = new DatabaseSeeder();
    await seeder.initialize();
  });

  afterAll(async () => {
    await server.stop();
    await seeder.cleanup();
  });

  it('should verify all consumer contracts', async () => {
    const verifier = new Verifier(opts);
    await verifier.verifyProvider();
  });
});
```

### Contract Evolution Management

```typescript
// src/testing/contract-evolution-manager.ts
class ContractEvolutionManager {
  private broker: PactBroker;
  private versionManager: VersionManager;

  constructor(
    private brokerUrl: string,
    private brokerToken: string
  ) {
    this.broker = new PactBroker(brokerUrl, brokerToken);
    this.versionManager = new VersionManager();
  }

  async validateBackwardCompatibility(
    provider: string,
    version: string
  ): Promise<CompatibilityReport> {
    const allConsumers = await this.broker.getConsumers(provider);
    const compatibilityResults: CompatibilityResult[] = [];

    for (const consumer of allConsumers) {
      const result = await this.checkConsumerCompatibility(
        provider,
        version,
        consumer
      );
      compatibilityResults.push(result);
    }

    return {
      provider,
      version,
      timestamp: new Date().toISOString(),
      results: compatibilityResults,
      overallCompatible: compatibilityResults.every(r => r.compatible),
      breakingChanges: compatibilityResults
        .filter(r => !r.compatible)
        .flatMap(r => r.breakingChanges)
    };
  }

  private async checkConsumerCompatibility(
    provider: string,
    providerVersion: string,
    consumer: ConsumerInfo
  ): Promise<CompatibilityResult> {
    try {
      const canDeploy = await this.broker.canIDeploy({
        pacticipant: provider,
        version: providerVersion,
        to: consumer.environment
      });

      if (canDeploy.success) {
        return {
          consumer: consumer.name,
          compatible: true,
          breakingChanges: []
        };
      }

      const breakingChanges = await this.analyzeBreakingChanges(
        provider,
        providerVersion,
        consumer
      );

      return {
        consumer: consumer.name,
        compatible: false,
        breakingChanges: breakingChanges,
        migrationPath: this.generateMigrationPath(breakingChanges)
      };

    } catch (error) {
      return {
        consumer: consumer.name,
        compatible: false,
        error: error.message,
        breakingChanges: []
      };
    }
  }

  private async analyzeBreakingChanges(
    provider: string,
    version: string,
    consumer: ConsumerInfo
  ): Promise<BreakingChange[]> {
    const currentContract = await this.broker.getLatestContract(
      consumer.name,
      provider
    );
    
    const newContract = await this.broker.getContract(
      consumer.name,
      provider,
      version
    );

    return this.compareContracts(currentContract, newContract);
  }

  private compareContracts(
    current: Contract,
    updated: Contract
  ): BreakingChange[] {
    const changes: BreakingChange[] = [];

    // Check for removed endpoints
    const removedEndpoints = current.interactions.filter(
      interaction => !updated.interactions.some(
        newInteraction => this.interactionsMatch(interaction, newInteraction)
      )
    );

    changes.push(...removedEndpoints.map(endpoint => ({
      type: 'REMOVED_ENDPOINT',
      endpoint: `${endpoint.request.method} ${endpoint.request.path}`,
      impact: 'HIGH',
      description: `Endpoint ${endpoint.request.method} ${endpoint.request.path} has been removed`
    })));

    // Check for response format changes
    for (const interaction of current.interactions) {
      const matchingNew = updated.interactions.find(
        newInteraction => this.interactionsMatch(interaction, newInteraction)
      );

      if (matchingNew) {
        const responseChanges = this.compareResponses(
          interaction.response,
          matchingNew.response
        );
        changes.push(...responseChanges);
      }
    }

    return changes;
  }

  private generateMigrationPath(changes: BreakingChange[]): MigrationStep[] {
    const steps: MigrationStep[] = [];

    for (const change of changes) {
      switch (change.type) {
        case 'REMOVED_ENDPOINT':
          steps.push({
            step: 'UPDATE_CLIENT',
            description: `Remove usage of ${change.endpoint}`,
            automation: `// TODO: Remove calls to ${change.endpoint}`,
            priority: 'HIGH'
          });
          break;

        case 'RESPONSE_FORMAT_CHANGE':
          steps.push({
            step: 'UPDATE_PARSING',
            description: `Update response parsing for ${change.endpoint}`,
            automation: this.generateParsingUpdate(change),
            priority: 'MEDIUM'
          });
          break;
      }
    }

    return steps;
  }
}
```

## 3. Service Virtualization and Mocking

### Advanced Mock Server Architecture

```typescript
// src/testing/mock-server-orchestrator.ts
class MockServerOrchestrator {
  private mockServers: Map<string, MockServer> = new Map();
  private configManager: MockConfigManager;
  private behaviorEngine: MockBehaviorEngine;

  constructor() {
    this.configManager = new MockConfigManager();
    this.behaviorEngine = new MockBehaviorEngine();
  }

  async startMockEnvironment(config: MockEnvironmentConfig): Promise<MockEnvironment> {
    const environment: MockEnvironment = {
      id: this.generateEnvironmentId(),
      services: [],
      networkConfig: config.networkConfig,
      status: 'starting'
    };

    // Start individual mock services
    for (const serviceConfig of config.services) {
      const mockServer = await this.createMockServer(serviceConfig);
      await mockServer.start();
      
      this.mockServers.set(serviceConfig.name, mockServer);
      environment.services.push({
        name: serviceConfig.name,
        url: mockServer.getUrl(),
        status: 'running'
      });
    }

    // Configure service interactions
    await this.configureServiceInteractions(config.interactions);

    environment.status = 'running';
    return environment;
  }

  private async createMockServer(config: MockServiceConfig): Promise<MockServer> {
    const mockServer = new MockServer({
      name: config.name,
      port: config.port,
      behaviors: await this.behaviorEngine.loadBehaviors(config.behaviors),
      middleware: this.createMiddleware(config)
    });

    return mockServer;
  }

  private createMiddleware(config: MockServiceConfig): Middleware[] {
    const middleware: Middleware[] = [];

    // Request logging middleware
    middleware.push(new RequestLoggingMiddleware());

    // Authentication middleware
    if (config.authentication) {
      middleware.push(new AuthenticationMiddleware(config.authentication));
    }

    // Rate limiting middleware
    if (config.rateLimit) {
      middleware.push(new RateLimitMiddleware(config.rateLimit));
    }

    // Chaos engineering middleware
    if (config.chaos) {
      middleware.push(new ChaosMiddleware(config.chaos));
    }

    return middleware;
  }

  private async configureServiceInteractions(
    interactions: ServiceInteraction[]
  ): Promise<void> {
    for (const interaction of interactions) {
      const sourceServer = this.mockServers.get(interaction.source);
      const targetServer = this.mockServers.get(interaction.target);

      if (sourceServer && targetServer) {
        await sourceServer.configureDownstreamService(
          interaction.target,
          targetServer.getUrl(),
          interaction.config
        );
      }
    }
  }
}

class MockServer {
  private app: Express;
  private server: http.Server;
  private behaviors: MockBehavior[];
  private requestHistory: Request[] = [];

  constructor(private config: MockServerConfig) {
    this.app = express();
    this.behaviors = config.behaviors;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Dynamic route handling based on behaviors
    this.app.all('*', async (req, res) => {
      this.requestHistory.push({
        timestamp: new Date(),
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body,
        query: req.query
      });

      const behavior = this.findMatchingBehavior(req);
      
      if (behavior) {
        await behavior.execute(req, res);
      } else {
        res.status(404).json({
          error: 'No matching behavior found',
          path: req.path,
          method: req.method
        });
      }
    });

    // Management endpoints
    this.app.get('/_mock/health', (req, res) => {
      res.json({ status: 'healthy', uptime: process.uptime() });
    });

    this.app.get('/_mock/requests', (req, res) => {
      res.json(this.requestHistory);
    });

    this.app.post('/_mock/reset', (req, res) => {
      this.requestHistory = [];
      res.json({ message: 'Request history cleared' });
    });

    this.app.post('/_mock/behaviors', (req, res) => {
      const newBehavior = MockBehavior.fromConfig(req.body);
      this.behaviors.push(newBehavior);
      res.json({ message: 'Behavior added', id: newBehavior.id });
    });
  }

  private findMatchingBehavior(req: express.Request): MockBehavior | null {
    return this.behaviors.find(behavior => behavior.matches(req)) || null;
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, (err?: Error) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Mock server ${this.config.name} started on port ${this.config.port}`);
          resolve();
        }
      });
    });
  }

  getUrl(): string {
    return `http://localhost:${this.config.port}`;
  }

  async configureDownstreamService(
    serviceName: string,
    serviceUrl: string,
    config: DownstreamConfig
  ): Promise<void> {
    // Configure proxy behavior for downstream service calls
    const proxyBehavior = new ProxyBehavior({
      name: `proxy-to-${serviceName}`,
      matcher: { path: config.pathPrefix },
      target: serviceUrl,
      config: config
    });

    this.behaviors.push(proxyBehavior);
  }
}

class MockBehavior {
  constructor(
    public id: string,
    public name: string,
    public matcher: RequestMatcher,
    public response: ResponseGenerator,
    public conditions: Condition[] = []
  ) {}

  matches(req: express.Request): boolean {
    return this.matcher.matches(req) && 
           this.conditions.every(condition => condition.evaluate(req));
  }

  async execute(req: express.Request, res: express.Response): Promise<void> {
    try {
      const response = await this.response.generate(req);
      
      // Apply delay if configured
      if (response.delay) {
        await this.delay(response.delay);
      }

      res.status(response.status || 200)
         .set(response.headers || {})
         .json(response.body);

    } catch (error) {
      res.status(500).json({
        error: 'Mock behavior execution failed',
        details: error.message
      });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static fromConfig(config: BehaviorConfig): MockBehavior {
    return new MockBehavior(
      config.id || this.generateId(),
      config.name,
      new RequestMatcher(config.matcher),
      new ResponseGenerator(config.response),
      (config.conditions || []).map(c => new Condition(c))
    );
  }

  private static generateId(): string {
    return `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Intelligent Service Virtualization

```typescript
// src/testing/intelligent-virtualization.ts
class IntelligentVirtualizationEngine {
  private trafficRecorder: TrafficRecorder;
  private behaviorGenerator: BehaviorGenerator;
  private realityGapAnalyzer: RealityGapAnalyzer;

  constructor() {
    this.trafficRecorder = new TrafficRecorder();
    this.behaviorGenerator = new BehaviorGenerator();
    this.realityGapAnalyzer = new RealityGapAnalyzer();
  }

  async createVirtualService(
    serviceName: string,
    productionTraffic: TrafficCapture[]
  ): Promise<VirtualService> {
    // Analyze production traffic patterns
    const trafficAnalysis = await this.analyzeTrafficPatterns(productionTraffic);
    
    // Generate behaviors from observed patterns
    const behaviors = await this.behaviorGenerator.generateFromTraffic(trafficAnalysis);
    
    // Create virtual service with intelligent behaviors
    const virtualService = new VirtualService({
      name: serviceName,
      behaviors: behaviors,
      adaptiveMode: true,
      learningEnabled: true
    });

    return virtualService;
  }

  private async analyzeTrafficPatterns(
    traffic: TrafficCapture[]
  ): Promise<TrafficAnalysis> {
    const patterns: TrafficPattern[] = [];

    // Analyze request patterns
    const requestGroups = this.groupRequestsByPattern(traffic);
    
    for (const [pattern, requests] of requestGroups) {
      const analysis = {
        pattern: pattern,
        frequency: requests.length,
        responsePatterns: this.analyzeResponsePatterns(requests),
        errorPatterns: this.analyzeErrorPatterns(requests),
        performancePatterns: this.analyzePerformancePatterns(requests),
        dependencies: this.analyzeDependencies(requests)
      };

      patterns.push(analysis);
    }

    return {
      totalRequests: traffic.length,
      patterns: patterns,
      endpoints: this.extractEndpoints(traffic),
      errorRates: this.calculateErrorRates(traffic),
      performanceMetrics: this.calculatePerformanceMetrics(traffic)
    };
  }

  private groupRequestsByPattern(
    traffic: TrafficCapture[]
  ): Map<string, TrafficCapture[]> {
    const groups = new Map<string, TrafficCapture[]>();

    for (const capture of traffic) {
      const pattern = this.extractPattern(capture.request);
      
      if (!groups.has(pattern)) {
        groups.set(pattern, []);
      }
      
      groups.get(pattern)!.push(capture);
    }

    return groups;
  }

  private extractPattern(request: CapturedRequest): string {
    // Normalize path by replacing IDs with placeholders
    const normalizedPath = request.path.replace(/\/\d+/g, '/{id}');
    return `${request.method} ${normalizedPath}`;
  }

  async validateVirtualization(
    virtualService: VirtualService,
    realService: ServiceEndpoint
  ): Promise<VirtualizationReport> {
    const testCases = await this.generateValidationTests(virtualService);
    const results: ValidationResult[] = [];

    for (const testCase of testCases) {
      const virtualResponse = await virtualService.processRequest(testCase.request);
      const realResponse = await realService.processRequest(testCase.request);
      
      const comparison = this.compareResponses(virtualResponse, realResponse);
      results.push({
        testCase: testCase.id,
        virtualResponse: virtualResponse,
        realResponse: realResponse,
        comparison: comparison,
        fidelity: this.calculateFidelity(comparison)
      });
    }

    const overallFidelity = this.calculateOverallFidelity(results);
    const gaps = this.identifyRealityGaps(results);
    
    return {
      virtualService: virtualService.name,
      timestamp: new Date().toISOString(),
      overallFidelity: overallFidelity,
      results: results,
      gaps: gaps,
      recommendations: this.generateRecommendations(gaps)
    };
  }

  private calculateFidelity(comparison: ResponseComparison): number {
    let score = 0;
    let maxScore = 0;

    // Status code match (weight: 3)
    maxScore += 3;
    if (comparison.statusMatch) score += 3;

    // Headers match (weight: 2)
    maxScore += 2;
    score += comparison.headersSimilarity * 2;

    // Body structure match (weight: 4)
    maxScore += 4;
    score += comparison.bodyStructureSimilarity * 4;

    // Response time similarity (weight: 1)
    maxScore += 1;
    score += comparison.timingSimilarity * 1;

    return (score / maxScore) * 100;
  }

  private identifyRealityGaps(results: ValidationResult[]): RealityGap[] {
    const gaps: RealityGap[] = [];

    // Identify patterns in low-fidelity results
    const lowFidelityResults = results.filter(r => r.fidelity < 80);
    
    for (const result of lowFidelityResults) {
      if (!result.comparison.statusMatch) {
        gaps.push({
          type: 'STATUS_CODE_MISMATCH',
          description: `Virtual service returns ${result.virtualResponse.status} but real service returns ${result.realResponse.status}`,
          impact: 'HIGH',
          testCase: result.testCase
        });
      }

      if (result.comparison.bodyStructureSimilarity < 0.8) {
        gaps.push({
          type: 'RESPONSE_STRUCTURE_DIFFERENCE',
          description: 'Response body structure differs significantly from real service',
          impact: 'MEDIUM',
          testCase: result.testCase,
          details: result.comparison.bodyDifferences
        });
      }

      if (result.comparison.timingSimilarity < 0.5) {
        gaps.push({
          type: 'PERFORMANCE_MISMATCH',
          description: 'Response timing differs significantly from real service',
          impact: 'LOW',
          testCase: result.testCase
        });
      }
    }

    return gaps;
  }
}
```

## 4. API Security Testing Integration

### OWASP API Security Testing

```typescript
// src/testing/api-security-tester.ts
class APISecurityTester {
  private owaspTestSuite: OWASPTestSuite;
  private vulnerabilityScanner: VulnerabilityScanner;
  private authTester: AuthenticationTester;

  constructor(private config: SecurityTestConfig) {
    this.owaspTestSuite = new OWASPTestSuite(config.owaspConfig);
    this.vulnerabilityScanner = new VulnerabilityScanner(config.scannerConfig);
    this.authTester = new AuthenticationTester(config.authConfig);
  }

  async runSecuritySuite(apiEndpoint: string): Promise<SecurityTestResults> {
    const results: SecurityTestResults = {
      timestamp: new Date().toISOString(),
      endpoint: apiEndpoint,
      tests: {
        owasp: await this.runOWASPTests(apiEndpoint),
        authentication: await this.runAuthenticationTests(apiEndpoint),
        authorization: await this.runAuthorizationTests(apiEndpoint),
        injection: await this.runInjectionTests(apiEndpoint),
        dataExposure: await this.runDataExposureTests(apiEndpoint)
      },
      summary: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0
      }
    };

    // Calculate summary
    this.calculateSummary(results);

    return results;
  }

  private async runOWASPTests(apiEndpoint: string): Promise<OWASPTestResults> {
    const tests = [
      new BrokenObjectLevelAuthTest(),
      new BrokenUserAuthTest(),
      new ExcessiveDataExposureTest(),
      new LackOfResourcesLimitingTest(),
      new BrokenFunctionLevelAuthTest(),
      new MassAssignmentTest(),
      new SecurityMisconfigurationTest(),
      new InjectionTest(),
      new ImproperAssetsManagementTest(),
      new InsufficientLoggingTest()
    ];

    const results: OWASPTestResult[] = [];

    for (const test of tests) {
      try {
        const result = await test.execute(apiEndpoint);
        results.push(result);
      } catch (error) {
        results.push({
          test: test.name,
          status: 'ERROR',
          error: error.message,
          severity: 'INFO'
        });
      }
    }

    return {
      totalTests: tests.length,
      results: results,
      vulnerabilities: results.filter(r => r.status === 'VULNERABLE'),
      passed: results.filter(r => r.status === 'PASSED').length,
      failed: results.filter(r => r.status === 'VULNERABLE').length
    };
  }

  private async runAuthenticationTests(apiEndpoint: string): Promise<AuthTestResults> {
    const tests = [
      // JWT Security Tests
      {
        name: 'JWT_ALGORITHM_CONFUSION',
        execute: async () => await this.testJWTAlgorithmConfusion(apiEndpoint)
      },
      {
        name: 'JWT_SECRET_BRUTE_FORCE',
        execute: async () => await this.testJWTSecretBruteForce(apiEndpoint)
      },
      {
        name: 'JWT_EXPIRATION_BYPASS',
        execute: async () => await this.testJWTExpirationBypass(apiEndpoint)
      },
      
      // OAuth Tests
      {
        name: 'OAUTH_STATE_FIXATION',
        execute: async () => await this.testOAuthStateFixation(apiEndpoint)
      },
      {
        name: 'OAUTH_REDIRECT_URI_MANIPULATION',
        execute: async () => await this.testOAuthRedirectURI(apiEndpoint)
      },
      
      // Session Management Tests
      {
        name: 'SESSION_FIXATION',
        execute: async () => await this.testSessionFixation(apiEndpoint)
      },
      {
        name: 'SESSION_TIMEOUT',
        execute: async () => await this.testSessionTimeout(apiEndpoint)
      }
    ];

    const results: AuthTestResult[] = [];

    for (const test of tests) {
      const result = await test.execute();
      results.push({
        testName: test.name,
        ...result
      });
    }

    return {
      totalTests: tests.length,
      results: results,
      criticalIssues: results.filter(r => r.severity === 'CRITICAL').length,
      highIssues: results.filter(r => r.severity === 'HIGH').length
    };
  }

  private async testJWTAlgorithmConfusion(apiEndpoint: string): Promise<TestResult> {
    try {
      // Test for algorithm confusion vulnerability
      const validToken = await this.getValidJWT(apiEndpoint);
      const decodedToken = jwt.decode(validToken, { complete: true });
      
      if (!decodedToken || typeof decodedToken === 'string') {
        throw new Error('Invalid JWT token');
      }

      // Try to change algorithm to 'none'
      const noneAlgToken = jwt.sign(
        decodedToken.payload,
        '',
        { algorithm: 'none', noTimestamp: true }
      );

      const response = await this.makeAuthenticatedRequest(apiEndpoint, noneAlgToken);
      
      if (response.status === 200) {
        return {
          status: 'VULNERABLE',
          severity: 'CRITICAL',
          description: 'API accepts JWT tokens with algorithm set to "none"',
          evidence: {
            originalToken: validToken,
            maliciousToken: noneAlgToken,
            response: response.data
          },
          recommendation: 'Explicitly validate JWT algorithm and reject "none" algorithm'
        };
      }

      return {
        status: 'PASSED',
        severity: 'INFO',
        description: 'API properly validates JWT algorithm'
      };

    } catch (error) {
      return {
        status: 'ERROR',
        severity: 'INFO',
        description: `Test failed: ${error.message}`
      };
    }
  }

  private async runInjectionTests(apiEndpoint: string): Promise<InjectionTestResults> {
    const injectionPayloads = [
      // SQL Injection
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM information_schema.tables --",
      
      // NoSQL Injection
      '{"$ne": null}',
      '{"$regex": ".*"}',
      '{"$where": "this.credits == this.debits"}',
      
      // Command Injection
      '; cat /etc/passwd',
      '| whoami',
      '&& ping -c 10 127.0.0.1',
      
      // LDAP Injection
      '*)(uid=*))(|(uid=*',
      '*))%00',
      
      // XPath Injection
      "' or 1=1 or ''='",
      "') or ('1'='1",
      
      // Template Injection
      '{{7*7}}',
      '${7*7}',
      '#{7*7}'
    ];

    const testResults: InjectionTestResult[] = [];

    for (const payload of injectionPayloads) {
      const result = await this.testInjectionPayload(apiEndpoint, payload);
      testResults.push(result);
    }

    return {
      totalPayloads: injectionPayloads.length,
      results: testResults,
      vulnerableEndpoints: testResults.filter(r => r.vulnerable),
      riskLevel: this.calculateInjectionRisk(testResults)
    };
  }

  private async testInjectionPayload(
    apiEndpoint: string,
    payload: string
  ): Promise<InjectionTestResult> {
    try {
      // Test payload in different positions
      const testPositions = [
        { position: 'query_param', value: `?search=${encodeURIComponent(payload)}` },
        { position: 'path_param', value: `/${encodeURIComponent(payload)}` },
        { position: 'request_body', value: { search: payload } },
        { position: 'header', value: { 'X-Search': payload } }
      ];

      for (const position of testPositions) {
        const response = await this.sendInjectionRequest(apiEndpoint, position);
        
        if (await this.detectInjectionSuccess(response, payload)) {
          return {
            payload: payload,
            position: position.position,
            vulnerable: true,
            severity: this.classifyInjectionSeverity(payload),
            evidence: {
              request: position.value,
              response: response.data,
              indicators: await this.extractInjectionIndicators(response, payload)
            }
          };
        }
      }

      return {
        payload: payload,
        vulnerable: false,
        severity: 'INFO'
      };

    } catch (error) {
      return {
        payload: payload,
        vulnerable: false,
        severity: 'INFO',
        error: error.message
      };
    }
  }

  private async detectInjectionSuccess(
    response: APIResponse,
    payload: string
  ): Promise<boolean> {
    // Check for common injection success indicators
    const errorIndicators = [
      'SQL syntax',
      'mysql_fetch',
      'ORA-',
      'PostgreSQL',
      'MongoDB',
      'syntax error',
      'unexpected token',
      'command not found',
      'permission denied'
    ];

    const responseText = JSON.stringify(response.data).toLowerCase();
    
    // Check for error messages that might indicate successful injection
    if (errorIndicators.some(indicator => responseText.includes(indicator.toLowerCase()))) {
      return true;
    }

    // Check for unusual response times (potential blind injection)
    if (response.timing && response.timing.total > 5000) {
      return true;
    }

    // Check for response size anomalies
    if (response.data && JSON.stringify(response.data).length > 50000) {
      return true;
    }

    return false;
  }
}

class BrokenObjectLevelAuthTest {
  name = 'API1:2023 Broken Object Level Authorization';

  async execute(apiEndpoint: string): Promise<OWASPTestResult> {
    try {
      // Test for BOLA vulnerabilities
      const userAToken = await this.getUserToken('userA');
      const userBToken = await this.getUserToken('userB');

      // Get user A's resources
      const userAResources = await this.getUserResources(apiEndpoint, userAToken);
      
      if (userAResources.length === 0) {
        return {
          test: this.name,
          status: 'SKIPPED',
          severity: 'INFO',
          description: 'No user resources found to test'
        };
      }

      // Try to access user A's resources with user B's token
      const bolaResults = [];
      
      for (const resource of userAResources) {
        const response = await this.accessResource(apiEndpoint, resource.id, userBToken);
        
        if (response.status === 200) {
          bolaResults.push({
            resourceId: resource.id,
            resourceType: resource.type,
            unauthorizedAccess: true
          });
        }
      }

      if (bolaResults.length > 0) {
        return {
          test: this.name,
          status: 'VULNERABLE',
          severity: 'HIGH',
          description: `Found ${bolaResults.length} resources accessible without proper authorization`,
          evidence: bolaResults,
          recommendation: 'Implement proper object-level authorization checks'
        };
      }

      return {
        test: this.name,
        status: 'PASSED',
        severity: 'INFO',
        description: 'Object-level authorization properly implemented'
      };

    } catch (error) {
      return {
        test: this.name,
        status: 'ERROR',
        severity: 'INFO',
        error: error.message
      };
    }
  }

  private async getUserToken(userId: string): Promise<string> {
    // Implementation to get user token
    // This would typically involve authentication with test credentials
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `${userId}@test.com`,
        password: 'testpassword'
      })
    });

    const data = await response.json();
    return data.token;
  }

  private async getUserResources(apiEndpoint: string, token: string): Promise<Resource[]> {
    const response = await fetch(`${apiEndpoint}/resources`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      return data.resources || [];
    }

    return [];
  }

  private async accessResource(
    apiEndpoint: string,
    resourceId: string,
    token: string
  ): Promise<Response> {
    return await fetch(`${apiEndpoint}/resources/${resourceId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}
```

## 5. Performance Testing Integration

### Load Testing with K6

```javascript
// tests/performance/api-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const responseTime = new Trend('response_time');
const requestCount = new Counter('request_count');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'], // Error rate should be less than 5%
    error_rate: ['rate<0.05'],
    response_time: ['p(95)<500'],
  },
};

// Test data
const API_BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';
const testUsers = JSON.parse(open('./test-data/users.json'));
const testProducts = JSON.parse(open('./test-data/products.json'));

export function setup() {
  // Setup phase - authenticate and prepare test data
  console.log('Setting up load test...');
  
  const authResponse = http.post(`${API_BASE_URL}/auth/login`, {
    username: 'loadtest@example.com',
    password: 'testpassword'
  });
  
  check(authResponse, {
    'authentication successful': (r) => r.status === 200,
  });
  
  const token = authResponse.json('token');
  
  return {
    authToken: token,
    apiUrl: API_BASE_URL,
    users: testUsers,
    products: testProducts
  };
}

export default function(data) {
  const { authToken, apiUrl, users, products } = data;
  
  // Simulate realistic user journey
  const userJourney = Math.random();
  
  if (userJourney < 0.3) {
    // 30% - Browse products
    browseProducts(apiUrl, authToken);
  } else if (userJourney < 0.6) {
    // 30% - Search and view product details
    searchAndViewProducts(apiUrl, authToken);
  } else if (userJourney < 0.85) {
    // 25% - Complete purchase flow
    completePurchaseFlow(apiUrl, authToken, products);
  } else {
    // 15% - User management operations
    userManagementOperations(apiUrl, authToken);
  }
  
  sleep(Math.random() * 3 + 1); // Think time between 1-4 seconds
}

function browseProducts(apiUrl, authToken) {
  const response = http.get(`${apiUrl}/api/products`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const success = check(response, {
    'browse products - status 200': (r) => r.status === 200,
    'browse products - response time < 500ms': (r) => r.timings.duration < 500,
    'browse products - has products': (r) => r.json('products').length > 0,
  });
  
  requestCount.add(1);
  errorRate.add(!success);
  responseTime.add(response.timings.duration);
  
  if (success && response.json('products').length > 0) {
    // Follow up with category filtering
    const categories = ['electronics', 'books', 'clothing', 'home'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const categoryResponse = http.get(`${apiUrl}/api/products?category=${randomCategory}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    check(categoryResponse, {
      'category filter - status 200': (r) => r.status === 200,
      'category filter - response time < 300ms': (r) => r.timings.duration < 300,
    });
    
    requestCount.add(1);
    responseTime.add(categoryResponse.timings.duration);
  }
}

function searchAndViewProducts(apiUrl, authToken) {
  const searchTerms = ['laptop', 'phone', 'book', 'shoes', 'watch'];
  const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  
  // Search products
  const searchResponse = http.get(`${apiUrl}/api/products/search?q=${searchTerm}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const searchSuccess = check(searchResponse, {
    'search products - status 200': (r) => r.status === 200,
    'search products - response time < 400ms': (r) => r.timings.duration < 400,
  });
  
  requestCount.add(1);
  errorRate.add(!searchSuccess);
  responseTime.add(searchResponse.timings.duration);
  
  if (searchSuccess && searchResponse.json('results').length > 0) {
    // View product details
    const products = searchResponse.json('results');
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    const detailResponse = http.get(`${apiUrl}/api/products/${randomProduct.id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const detailSuccess = check(detailResponse, {
      'product details - status 200': (r) => r.status === 200,
      'product details - response time < 300ms': (r) => r.timings.duration < 300,
      'product details - has required fields': (r) => {
        const product = r.json();
        return product.id && product.name && product.price;
      },
    });
    
    requestCount.add(1);
    errorRate.add(!detailSuccess);
    responseTime.add(detailResponse.timings.duration);
    
    // Get product reviews
    const reviewsResponse = http.get(`${apiUrl}/api/products/${randomProduct.id}/reviews`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    check(reviewsResponse, {
      'product reviews - status 200': (r) => r.status === 200,
      'product reviews - response time < 200ms': (r) => r.timings.duration < 200,
    });
    
    requestCount.add(1);
    responseTime.add(reviewsResponse.timings.duration);
  }
}

function completePurchaseFlow(apiUrl, authToken, products) {
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  
  // Add to cart
  const addToCartResponse = http.post(`${apiUrl}/api/cart/items`, 
    JSON.stringify({
      productId: randomProduct.id,
      quantity: Math.floor(Math.random() * 3) + 1
    }), {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
  
  const cartSuccess = check(addToCartResponse, {
    'add to cart - status 201': (r) => r.status === 201,
    'add to cart - response time < 300ms': (r) => r.timings.duration < 300,
  });
  
  requestCount.add(1);
  errorRate.add(!cartSuccess);
  responseTime.add(addToCartResponse.timings.duration);
  
  if (cartSuccess) {
    // Get cart contents
    const cartResponse = http.get(`${apiUrl}/api/cart`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    check(cartResponse, {
      'get cart - status 200': (r) => r.status === 200,
      'get cart - response time < 200ms': (r) => r.timings.duration < 200,
    });
    
    requestCount.add(1);
    responseTime.add(cartResponse.timings.duration);
    
    // Simulate checkout process
    const checkoutResponse = http.post(`${apiUrl}/api/orders`, 
      JSON.stringify({
        paymentMethod: 'credit_card',
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          zipCode: '12345'
        }
      }), {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
    
    const checkoutSuccess = check(checkoutResponse, {
      'checkout - status 201': (r) => r.status === 201,
      'checkout - response time < 1000ms': (r) => r.timings.duration < 1000,
      'checkout - has order id': (r) => r.json('orderId') !== undefined,
    });
    
    requestCount.add(1);
    errorRate.add(!checkoutSuccess);
    responseTime.add(checkoutResponse.timings.duration);
  }
}

function userManagementOperations(apiUrl, authToken) {
  // Get user profile
  const profileResponse = http.get(`${apiUrl}/api/user/profile`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const profileSuccess = check(profileResponse, {
    'get profile - status 200': (r) => r.status === 200,
    'get profile - response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  requestCount.add(1);
  errorRate.add(!profileSuccess);
  responseTime.add(profileResponse.timings.duration);
  
  // Update profile
  const updateResponse = http.put(`${apiUrl}/api/user/profile`, 
    JSON.stringify({
      preferences: {
        newsletter: Math.random() > 0.5,
        theme: Math.random() > 0.5 ? 'dark' : 'light'
      }
    }), {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
  
  const updateSuccess = check(updateResponse, {
    'update profile - status 200': (r) => r.status === 200,
    'update profile - response time < 300ms': (r) => r.timings.duration < 300,
  });
  
  requestCount.add(1);
  errorRate.add(!updateSuccess);
  responseTime.add(updateResponse.timings.duration);
}

export function teardown(data) {
  console.log('Load test completed');
  console.log(`Total requests: ${requestCount.count}`);
  console.log(`Error rate: ${(errorRate.rate * 100).toFixed(2)}%`);
  console.log(`Average response time: ${responseTime.avg.toFixed(2)}ms`);
}
```

### Advanced Performance Analysis

```typescript
// src/testing/performance-analyzer.ts
class PerformanceAnalyzer {
  private metricsCollector: MetricsCollector;
  private trendAnalyzer: TrendAnalyzer;
  private bottleneckDetector: BottleneckDetector;

  constructor() {
    this.metricsCollector = new MetricsCollector();
    this.trendAnalyzer = new TrendAnalyzer();
    this.bottleneckDetector = new BottleneckDetector();
  }

  async analyzePerformanceResults(
    testResults: PerformanceTestResults
  ): Promise<PerformanceAnalysis> {
    const analysis: PerformanceAnalysis = {
      timestamp: new Date().toISOString(),
      testDuration: testResults.duration,
      overallMetrics: this.calculateOverallMetrics(testResults),
      endpointAnalysis: await this.analyzeEndpoints(testResults),
      trendAnalysis: await this.analyzeTrends(testResults),
      bottlenecks: await this.detectBottlenecks(testResults),
      recommendations: [],
      slaCompliance: this.checkSLACompliance(testResults)
    };

    analysis.recommendations = this.generateRecommendations(analysis);

    return analysis;
  }

  private calculateOverallMetrics(results: PerformanceTestResults): OverallMetrics {
    const allRequests = results.requests;
    const successfulRequests = allRequests.filter(r => r.status < 400);
    const failedRequests = allRequests.filter(r => r.status >= 400);

    return {
      totalRequests: allRequests.length,
      successfulRequests: successfulRequests.length,
      failedRequests: failedRequests.length,
      errorRate: (failedRequests.length / allRequests.length) * 100,
      
      responseTime: {
        min: Math.min(...allRequests.map(r => r.responseTime)),
        max: Math.max(...allRequests.map(r => r.responseTime)),
        avg: allRequests.reduce((sum, r) => sum + r.responseTime, 0) / allRequests.length,
        p50: this.calculatePercentile(allRequests.map(r => r.responseTime), 50),
        p95: this.calculatePercentile(allRequests.map(r => r.responseTime), 95),
        p99: this.calculatePercentile(allRequests.map(r => r.responseTime), 99)
      },
      
      throughput: {
        requestsPerSecond: allRequests.length / (results.duration / 1000),
        bytesPerSecond: allRequests.reduce((sum, r) => sum + r.responseSize, 0) / (results.duration / 1000)
      },
      
      concurrency: {
        maxConcurrentUsers: results.maxConcurrentUsers,
        avgConcurrentUsers: results.avgConcurrentUsers
      }
    };
  }

  private async analyzeEndpoints(
    results: PerformanceTestResults
  ): Promise<EndpointAnalysis[]> {
    const endpointGroups = this.groupRequestsByEndpoint(results.requests);
    const analyses: EndpointAnalysis[] = [];

    for (const [endpoint, requests] of endpointGroups) {
      const analysis = {
        endpoint: endpoint,
        requestCount: requests.length,
        errorRate: (requests.filter(r => r.status >= 400).length / requests.length) * 100,
        
        responseTime: {
          avg: requests.reduce((sum, r) => sum + r.responseTime, 0) / requests.length,
          p95: this.calculatePercentile(requests.map(r => r.responseTime), 95),
          p99: this.calculatePercentile(requests.map(r => r.responseTime), 99)
        },
        
        throughput: requests.length / (results.duration / 1000),
        
        statusCodes: this.groupByStatusCode(requests),
        
        issues: this.identifyEndpointIssues(endpoint, requests),
        
        recommendations: this.generateEndpointRecommendations(endpoint, requests)
      };

      analyses.push(analysis);
    }

    return analyses.sort((a, b) => b.requestCount - a.requestCount);
  }

  private async detectBottlenecks(
    results: PerformanceTestResults
  ): Promise<Bottleneck[]> {
    const bottlenecks: Bottleneck[] = [];

    // Detect slow endpoints
    const endpointGroups = this.groupRequestsByEndpoint(results.requests);
    
    for (const [endpoint, requests] of endpointGroups) {
      const avgResponseTime = requests.reduce((sum, r) => sum + r.responseTime, 0) / requests.length;
      
      if (avgResponseTime > 1000) { // Slower than 1 second
        bottlenecks.push({
          type: 'SLOW_ENDPOINT',
          severity: avgResponseTime > 5000 ? 'CRITICAL' : 'HIGH',
          description: `Endpoint ${endpoint} has high average response time`,
          metrics: {
            avgResponseTime: avgResponseTime,
            p95ResponseTime: this.calculatePercentile(requests.map(r => r.responseTime), 95),
            requestCount: requests.length
          },
          recommendations: [
            'Consider optimizing database queries',
            'Implement caching strategies',
            'Review business logic complexity',
            'Consider horizontal scaling'
          ]
        });
      }
    }

    // Detect error rate spikes
    const errorRateByTime = this.calculateErrorRateOverTime(results.requests);
    const highErrorPeriods = errorRateByTime.filter(period => period.errorRate > 5);
    
    if (highErrorPeriods.length > 0) {
      bottlenecks.push({
        type: 'HIGH_ERROR_RATE',
        severity: 'HIGH',
        description: `Detected ${highErrorPeriods.length} periods with error rate > 5%`,
        metrics: {
          maxErrorRate: Math.max(...highErrorPeriods.map(p => p.errorRate)),
          affectedPeriods: highErrorPeriods.length
        },
        recommendations: [
          'Investigate error patterns and root causes',
          'Implement proper error handling and retry logic',
          'Monitor system resources during high load',
          'Consider circuit breaker patterns'
        ]
      });
    }

    // Detect memory or resource constraints
    const responseTimeIncreaseOverTime = this.analyzeResponseTimeProgression(results.requests);
    
    if (responseTimeIncreaseOverTime.trend === 'INCREASING' && responseTimeIncreaseOverTime.magnitude > 50) {
      bottlenecks.push({
        type: 'RESOURCE_CONSTRAINT',
        severity: 'MEDIUM',
        description: 'Response times increase significantly during test execution',
        metrics: {
          initialAvgResponseTime: responseTimeIncreaseOverTime.initial,
          finalAvgResponseTime: responseTimeIncreaseOverTime.final,
          increasePercentage: responseTimeIncreaseOverTime.magnitude
        },
        recommendations: [
          'Monitor system resource usage (CPU, memory, disk I/O)',
          'Implement proper garbage collection tuning',
          'Check for memory leaks',
          'Consider vertical or horizontal scaling'
        ]
      });
    }

    return bottlenecks;
  }

  private checkSLACompliance(results: PerformanceTestResults): SLACompliance {
    // Define SLA thresholds (these would typically come from configuration)
    const slaThresholds = {
      responseTime: {
        p95: 500, // 95th percentile should be under 500ms
        p99: 1000 // 99th percentile should be under 1000ms
      },
      errorRate: 1, // Error rate should be under 1%
      availability: 99.9, // Availability should be above 99.9%
      throughput: 100 // Minimum requests per second
    };

    const overallMetrics = this.calculateOverallMetrics(results);
    
    return {
      responseTime: {
        p95: {
          threshold: slaThresholds.responseTime.p95,
          actual: overallMetrics.responseTime.p95,
          compliant: overallMetrics.responseTime.p95 <= slaThresholds.responseTime.p95
        },
        p99: {
          threshold: slaThresholds.responseTime.p99,
          actual: overallMetrics.responseTime.p99,
          compliant: overallMetrics.responseTime.p99 <= slaThresholds.responseTime.p99
        }
      },
      errorRate: {
        threshold: slaThresholds.errorRate,
        actual: overallMetrics.errorRate,
        compliant: overallMetrics.errorRate <= slaThresholds.errorRate
      },
      throughput: {
        threshold: slaThresholds.throughput,
        actual: overallMetrics.throughput.requestsPerSecond,
        compliant: overallMetrics.throughput.requestsPerSecond >= slaThresholds.throughput
      }
    };
  }

  private generateRecommendations(analysis: PerformanceAnalysis): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Response time recommendations
    if (analysis.overallMetrics.responseTime.p95 > 500) {
      recommendations.push({
        category: 'RESPONSE_TIME',
        priority: 'HIGH',
        title: 'Optimize response times',
        description: '95th percentile response time exceeds acceptable threshold',
        actions: [
          'Implement database query optimization',
          'Add caching layer for frequently accessed data',
          'Consider CDN for static assets',
          'Implement response compression'
        ]
      });
    }

    // Error rate recommendations
    if (analysis.overallMetrics.errorRate > 1) {
      recommendations.push({
        category: 'ERROR_HANDLING',
        priority: 'CRITICAL',
        title: 'Reduce error rate',
        description: 'Error rate exceeds acceptable threshold',
        actions: [
          'Implement proper input validation',
          'Add circuit breaker patterns',
          'Improve error handling and logging',
          'Implement graceful degradation'
        ]
      });
    }

    // Throughput recommendations
    if (analysis.overallMetrics.throughput.requestsPerSecond < 100) {
      recommendations.push({
        category: 'THROUGHPUT',
        priority: 'MEDIUM',
        title: 'Increase system throughput',
        description: 'System throughput is below expected levels',
        actions: [
          'Optimize critical code paths',
          'Implement connection pooling',
          'Consider horizontal scaling',
          'Optimize thread pool configurations'
        ]
      });
    }

    return recommendations;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private groupRequestsByEndpoint(requests: RequestResult[]): Map<string, RequestResult[]> {
    const groups = new Map<string, RequestResult[]>();
    
    for (const request of requests) {
      const endpoint = `${request.method} ${request.path}`;
      if (!groups.has(endpoint)) {
        groups.set(endpoint, []);
      }
      groups.get(endpoint)!.push(request);
    }
    
    return groups;
  }
}
```

## 6. Practical Exercises

### Exercise 1: Comprehensive API Testing Pipeline

Create a complete API testing pipeline that includes contract testing, security testing, and performance validation:

```yaml
# exercises/comprehensive-api-pipeline.yml
name: Complete API Testing Pipeline
on:
  push:
    branches: [main, develop]
    paths: ['src/api/**', 'tests/api/**']

jobs:
  api-testing-matrix:
    strategy:
      matrix:
        test-type: [contract, security, performance]
        environment: [dev, staging]
    
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # TODO: Implement matrix-based testing
      # 1. Set up environment-specific configurations
      # 2. Run appropriate test suite based on matrix.test-type
      # 3. Generate test reports
      # 4. Upload results to test reporting system
```

### Exercise 2: Contract Testing Implementation

Build a complete contract testing setup with consumer and provider verification:

```typescript
// exercises/contract-testing-setup.ts

// Task 1: Implement consumer contract tests
class ConsumerContractTests {
  async testUserServiceContract(): Promise<void> {
    // TODO: Implement Pact consumer tests
    // 1. Define expected interactions
    // 2. Mock provider responses
    // 3. Test consumer behavior
    // 4. Publish contracts to broker
  }
}

// Task 2: Implement provider verification
class ProviderVerification {
  async verifyConsumerContracts(): Promise<void> {
    // TODO: Implement provider verification
    // 1. Set up test data based on contract states
    // 2. Run provider against consumer contracts
    // 3. Report verification results
    // 4. Handle contract evolution
  }
}

// Task 3: Contract evolution management
class ContractEvolution {
  async manageContractChanges(): Promise<void> {
    // TODO: Implement contract evolution strategies
    // 1. Analyze breaking changes
    // 2. Generate migration paths
    // 3. Coordinate deployment strategies
    // 4. Monitor contract compliance
  }
}
```

### Exercise 3: API Security Testing Suite

Implement a comprehensive API security testing framework:

```typescript
// exercises/api-security-testing.ts

// Task 1: OWASP API Security Testing
class OWASPSecurityTester {
  async runOWASPTop10Tests(apiEndpoint: string): Promise<SecurityReport> {
    // TODO: Implement OWASP API Security Top 10 tests
    // 1. Broken Object Level Authorization
    // 2. Broken User Authentication
    // 3. Excessive Data Exposure
    // 4. Lack of Resources & Rate Limiting
    // 5. Broken Function Level Authorization
    // 6. Mass Assignment
    // 7. Security Misconfiguration
    // 8. Injection
    // 9. Improper Assets Management
    // 10. Insufficient Logging & Monitoring
  }
}

// Task 2: Authentication and Authorization Testing
class AuthSecurityTester {
  async testJWTSecurity(apiEndpoint: string): Promise<JWTSecurityReport> {
    // TODO: Implement JWT security tests
    // 1. Algorithm confusion attacks
    // 2. Token manipulation tests
    // 3. Expiration bypass attempts
    // 4. Secret brute force detection
  }

  async testOAuthSecurity(apiEndpoint: string): Promise<OAuthSecurityReport> {
    // TODO: Implement OAuth security tests
    // 1. State parameter validation
    // 2. Redirect URI manipulation
    // 3. Token leakage tests
    // 4. Scope elevation attempts
  }
}

// Task 3: Injection Testing
class InjectionTester {
  async runInjectionTests(apiEndpoint: string): Promise<InjectionReport> {
    // TODO: Implement comprehensive injection testing
    // 1. SQL injection in all parameters
    // 2. NoSQL injection for modern databases
    // 3. Command injection detection
    // 4. LDAP and XPath injection tests
    // 5. Template injection validation
  }
}
```

## Summary

This lesson covered advanced API testing integration within CI/CD pipelines, focusing on enterprise-scale testing strategies that ensure API reliability, security, and performance. Key areas included:

**Enterprise API Testing Architecture**: Multi-layered testing strategies with comprehensive test frameworks that handle functional, contract, security, and performance testing in coordinated workflows.

**Contract Testing Implementation**: Advanced contract testing patterns using Pact and OpenAPI specifications, including contract evolution management and backward compatibility validation across service boundaries.

**Service Virtualization**: Intelligent mock server orchestration with adaptive behaviors, realistic service simulation, and reality gap analysis to maintain testing fidelity.

**API Security Testing**: OWASP API Security Top 10 integration with automated vulnerability scanning, authentication testing, and injection attack detection.

**Performance Testing Integration**: Load testing with K6, advanced performance analysis, bottleneck detection, and SLA compliance monitoring with automated recommendations.

**Automated Analysis and Intelligence**: Predictive analytics for API reliability, trend analysis, and automated recommendation systems for continuous improvement.

The practical exercises demonstrate real-world implementation scenarios including comprehensive testing pipelines, contract testing coordination, and security validation frameworks that scale with enterprise requirements.

These advanced API testing patterns enable teams to maintain high-quality APIs in complex microservices architectures while ensuring security, performance, and reliability standards. The integration with CI/CD pipelines provides continuous feedback and automated quality gates that prevent issues from reaching production environments.

Understanding these patterns is essential for senior DevOps professionals who need to design and implement robust API testing strategies that support rapid development cycles while maintaining enterprise-grade quality and security standards.