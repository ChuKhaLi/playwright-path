# Lesson 03: Docker Fundamentals for Testing

## Learning Objectives

By the end of this lesson, you will be able to:

- **Design Containerized Testing Environments**: Create robust, reproducible testing environments using Docker containers that eliminate "works on my machine" issues
- **Implement Multi-Stage Dockerfile Patterns**: Build optimized Docker images for testing with multi-stage builds, layer caching, and security best practices
- **Master Container Orchestration for Testing**: Use Docker Compose to orchestrate complex testing scenarios with multiple services, databases, and external dependencies
- **Apply Testing-Specific Container Patterns**: Implement specialized container patterns for different testing types (unit, integration, E2E, performance, security)
- **Optimize Container Performance for CI/CD**: Design high-performance container images with intelligent caching, minimal attack surface, and fast startup times
- **Implement Cross-Platform Testing Strategies**: Create container solutions that enable consistent testing across different operating systems and architectures
- **Design Container Security for Testing**: Apply security best practices for test containers including secrets management, network isolation, and vulnerability scanning
- **Integrate Containers with Advanced CI/CD Workflows**: Connect containerized testing with the advanced GitHub Actions patterns from previous lessons

## Introduction

Modern testing requires consistent, reproducible environments that can be created and destroyed on-demand. Docker containers provide the perfect solution for this challenge, enabling teams to package applications with all their dependencies and run them consistently across development, testing, and production environments.

This lesson focuses specifically on Docker patterns for testing scenarios, going beyond basic containerization to explore advanced patterns used by companies like Netflix, Spotify, and Docker Inc. themselves to manage complex testing infrastructures. You'll learn to design container architectures that not only work but scale efficiently in enterprise CI/CD pipelines.

## Prerequisites Review

Before diving into Docker for testing, ensure you understand:
- Advanced GitHub Actions workflows (Lesson 02)
- Container basics (images, containers, registries)
- Testing pyramid concepts (unit, integration, E2E)
- CI/CD pipeline fundamentals

## 1. Container Architecture for Testing

### 1.1 Testing Environment Challenges

Traditional testing environments face several challenges:
- **Environment Drift**: Differences between development, testing, and production
- **Dependency Management**: Complex software dependencies and version conflicts
- **Scalability Issues**: Difficulty scaling test environments for parallel execution
- **Resource Management**: Inefficient resource utilization and cleanup
- **Cross-Platform Compatibility**: Testing across different operating systems and architectures

**Enterprise Reality**: A single integration test failure due to environment differences can cost a team 2-4 hours of debugging time. Multiply this by hundreds of developers and the cost becomes substantial.

### 1.2 Container-First Testing Strategy

```dockerfile
# Base testing image with common dependencies
# File: docker/base-test.Dockerfile
FROM node:18-alpine AS base

# Install common testing dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Set up Chromium for Playwright
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/bin/chromium-browser \
    CHROMIUM_FLAGS="--disable-software-rasterizer --disable-background-timer-throttling"

# Create non-root user for security
RUN addgroup -g 1001 -S testuser && \
    adduser -S testuser -u 1001 -G testuser

# Set up working directory
WORKDIR /app
RUN chown testuser:testuser /app
USER testuser

# Copy package files
COPY --chown=testuser:testuser package*.json ./

# Install dependencies with caching optimization
RUN npm ci --only=production && \
    npm cache clean --force

# Development and testing dependencies stage
FROM base AS test-deps
USER root
RUN npm ci && npm cache clean --force
USER testuser

# Unit testing stage
FROM test-deps AS unit-test
COPY --chown=testuser:testuser . .
RUN npm run build
CMD ["npm", "run", "test:unit"]

# Integration testing stage
FROM test-deps AS integration-test
COPY --chown=testuser:testuser . .
RUN npm run build

# Install additional integration test dependencies
USER root
RUN apk add --no-cache postgresql-client redis-tools
USER testuser

CMD ["npm", "run", "test:integration"]

# E2E testing stage
FROM test-deps AS e2e-test
COPY --chown=testuser:testuser . .
RUN npm run build

# Install Playwright browsers
USER root
RUN npx playwright install --with-deps chromium firefox webkit
USER testuser

CMD ["npm", "run", "test:e2e"]

# Production-like testing stage
FROM base AS production-test
COPY --chown=testuser:testuser --from=test-deps /app/node_modules ./node_modules
COPY --chown=testuser:testuser --from=test-deps /app/dist ./dist
COPY --chown=testuser:testuser package*.json ./

# Health check for container readiness
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["npm", "start"]
```

### 1.3 Advanced Multi-Stage Build Patterns

```dockerfile
# File: docker/advanced-test.Dockerfile
# Multi-architecture and multi-environment testing Dockerfile

# Build arguments for flexibility
ARG NODE_VERSION=18
ARG ALPINE_VERSION=3.18
ARG BUILDPLATFORM
ARG TARGETPLATFORM

# Base stage with platform-specific optimizations
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

# Install build dependencies based on target platform
RUN case "$TARGETPLATFORM" in \
    "linux/amd64") \
        apk add --no-cache python3 make g++ ;; \
    "linux/arm64") \
        apk add --no-cache python3 make g++ ;; \
    "linux/arm/v7") \
        apk add --no-cache python3 make g++ ;; \
    *) \
        echo "Unsupported platform: $TARGETPLATFORM" && exit 1 ;; \
    esac

# Security hardening
RUN apk upgrade --no-cache && \
    apk add --no-cache \
        dumb-init \
        curl \
        bash \
        git \
        ca-certificates \
    && rm -rf /var/cache/apk/* \
    && addgroup -g 1001 -S testuser \
    && adduser -S testuser -u 1001 -G testuser

# Dependency caching stage
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY .npmrc* ./

# Smart dependency installation with layer caching
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production && \
    npm cache clean --force

# Development dependencies stage
FROM deps AS dev-deps
RUN --mount=type=cache,target=/root/.npm \
    npm ci && \
    npm cache clean --force

# Application build stage
FROM dev-deps AS builder
COPY --chown=testuser:testuser . .
RUN npm run build && \
    npm run lint && \
    npm run typecheck

# Test utilities stage
FROM builder AS test-utils
RUN --mount=type=cache,target=/root/.npm \
    npm install -g \
        @playwright/test \
        newman \
        artillery \
        k6 \
    && npm cache clean --force

# Unit test runner
FROM test-utils AS unit-tests
USER testuser
WORKDIR /app
COPY --from=builder --chown=testuser:testuser /app .

# Configure test environment
ENV NODE_ENV=test \
    LOG_LEVEL=error \
    JEST_WORKERS=2

# Run unit tests with coverage
CMD ["npm", "run", "test:unit", "--", "--coverage", "--ci", "--watchAll=false"]

# Integration test runner with service dependencies
FROM test-utils AS integration-tests

# Install database and service clients
RUN apk add --no-cache \
    postgresql-client \
    redis-tools \
    mysql-client \
    mongodb-tools

USER testuser
WORKDIR /app
COPY --from=builder --chown=testuser:testuser /app .

# Integration test configuration
ENV NODE_ENV=integration \
    DATABASE_URL=postgresql://test:test@postgres:5432/testdb \
    REDIS_URL=redis://redis:6379 \
    LOG_LEVEL=warn

# Wait for services script
COPY --chown=testuser:testuser docker/wait-for-services.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-services.sh

CMD ["/usr/local/bin/wait-for-services.sh", "npm", "run", "test:integration"]

# E2E test runner with browser support
FROM test-utils AS e2e-tests

# Install browsers and dependencies
RUN npx playwright install-deps && \
    npx playwright install chromium firefox webkit

USER testuser
WORKDIR /app
COPY --from=builder --chown=testuser:testuser /app .

# E2E test configuration
ENV NODE_ENV=e2e \
    HEADLESS=true \
    BROWSER=chromium \
    BASE_URL=http://app:3000 \
    LOG_LEVEL=error

# Custom E2E test configuration
COPY --chown=testuser:testuser playwright.config.docker.ts ./playwright.config.ts

CMD ["npm", "run", "test:e2e"]

# Performance test runner
FROM test-utils AS performance-tests
USER testuser
WORKDIR /app
COPY --from=builder --chown=testuser:testuser /app .

# Performance testing tools configuration
ENV NODE_ENV=performance \
    TARGET_URL=http://app:3000 \
    VU_COUNT=10 \
    DURATION=5m

COPY --chown=testuser:testuser performance/ ./performance/

CMD ["npm", "run", "test:performance"]

# Security test runner
FROM test-utils AS security-tests

# Install security testing tools
RUN apk add --no-cache \
    nmap \
    curl \
    wget

USER testuser
WORKDIR /app
COPY --from=builder --chown=testuser:testuser /app .

# Security testing configuration
ENV NODE_ENV=security \
    TARGET_HOST=app \
    TARGET_PORT=3000

COPY --chown=testuser:testuser security/ ./security/

CMD ["npm", "run", "test:security"]

# Production simulation stage
FROM deps AS production-sim

# Copy only production artifacts
COPY --from=builder --chown=testuser:testuser /app/dist ./dist
COPY --from=builder --chown=testuser:testuser /app/package.json ./

USER testuser
WORKDIR /app

# Production environment configuration
ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info

# Health check for readiness
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

## 2. Docker Compose for Complex Testing Scenarios

### 2.1 Multi-Service Testing Environment

```yaml
# File: docker-compose.test.yml
version: '3.8'

# Shared network for service communication
networks:
  test-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

# Shared volumes for data persistence and sharing
volumes:
  postgres-data:
  redis-data:
  test-results:
  coverage-data:

services:
  # PostgreSQL database for integration tests
  postgres:
    image: postgres:15-alpine
    networks:
      test-network:
        aliases:
          - db
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docker/init-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test -d testdb"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # Redis for caching and session management
  redis:
    image: redis:7-alpine
    networks:
      test-network:
        aliases:
          - cache
    command: redis-server --appendonly yes --requirepass testpass
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Application service for testing
  app:
    build:
      context: .
      dockerfile: docker/advanced-test.Dockerfile
      target: production-sim
      args:
        NODE_VERSION: 18
        BUILDPLATFORM: linux/amd64
    networks:
      test-network:
        aliases:
          - application
    environment:
      NODE_ENV: test
      DATABASE_URL: postgresql://test:test@postgres:5432/testdb
      REDIS_URL: redis://:testpass@redis:6379
      LOG_LEVEL: warn
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s
    volumes:
      - test-results:/app/test-results

  # Unit test runner
  unit-tests:
    build:
      context: .
      dockerfile: docker/advanced-test.Dockerfile
      target: unit-tests
    networks:
      - test-network
    environment:
      NODE_ENV: test
      CI: true
    volumes:
      - coverage-data:/app/coverage
      - test-results:/app/test-results
    profiles:
      - unit-testing

  # Integration test runner
  integration-tests:
    build:
      context: .
      dockerfile: docker/advanced-test.Dockerfile
      target: integration-tests
    networks:
      - test-network
    environment:
      NODE_ENV: integration
      DATABASE_URL: postgresql://test:test@postgres:5432/testdb
      REDIS_URL: redis://:testpass@redis:6379
      CI: true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      app:
        condition: service_healthy
    volumes:
      - test-results:/app/test-results
    profiles:
      - integration-testing

  # E2E test runner
  e2e-tests:
    build:
      context: .
      dockerfile: docker/advanced-test.Dockerfile
      target: e2e-tests
    networks:
      - test-network
    environment:
      NODE_ENV: e2e
      BASE_URL: http://app:3000
      HEADLESS: true
      CI: true
    depends_on:
      app:
        condition: service_healthy
    volumes:
      - test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    profiles:
      - e2e-testing

  # Performance test runner
  performance-tests:
    build:
      context: .
      dockerfile: docker/advanced-test.Dockerfile
      target: performance-tests
    networks:
      - test-network
    environment:
      TARGET_URL: http://app:3000
      VU_COUNT: ${PERFORMANCE_VU_COUNT:-10}
      DURATION: ${PERFORMANCE_DURATION:-5m}
      CI: true
    depends_on:
      app:
        condition: service_healthy
    volumes:
      - test-results:/app/test-results
    profiles:
      - performance-testing

  # Security test runner
  security-tests:
    build:
      context: .
      dockerfile: docker/advanced-test.Dockerfile
      target: security-tests
    networks:
      - test-network
    environment:
      TARGET_HOST: app
      TARGET_PORT: 3000
      CI: true
    depends_on:
      app:
        condition: service_healthy
    volumes:
      - test-results:/app/test-results
    profiles:
      - security-testing

  # Test results collector and reporter
  test-reporter:
    image: node:18-alpine
    networks:
      - test-network
    working_dir: /results
    environment:
      REPORT_FORMAT: ${REPORT_FORMAT:-html}
      OUTPUT_DIR: /output
    volumes:
      - test-results:/results
      - ./test-reports:/output
      - ./docker/generate-reports.js:/scripts/generate-reports.js:ro
    command: ["node", "/scripts/generate-reports.js"]
    profiles:
      - reporting

  # Database migration runner for testing
  db-migrate:
    build:
      context: .
      dockerfile: docker/advanced-test.Dockerfile
      target: dev-deps
    networks:
      - test-network
    environment:
      DATABASE_URL: postgresql://test:test@postgres:5432/testdb
    depends_on:
      postgres:
        condition: service_healthy
    command: ["npm", "run", "db:migrate"]
    volumes:
      - ./migrations:/app/migrations:ro
    profiles:
      - migration

# Development override for local testing
---
# File: docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      target: dev-deps
    environment:
      NODE_ENV: development
      LOG_LEVEL: debug
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
      - "9229:9229"  # Node.js debugging port
    command: ["npm", "run", "dev"]

  postgres:
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: devdb
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev

  redis:
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
```

### 2.2 Advanced Testing Orchestration

```bash
#!/bin/bash
# File: docker/test-orchestrator.sh
# Advanced test orchestration script

set -euo pipefail

# Configuration
COMPOSE_FILE="docker-compose.test.yml"
COMPOSE_DEV_FILE="docker-compose.dev.yml"
TEST_TIMEOUT=1800  # 30 minutes
PARALLEL_JOBS=4

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up test environment..."
    docker-compose -f $COMPOSE_FILE down --volumes --remove-orphans || true
    docker system prune -f || true
}

# Trap cleanup on exit
trap cleanup EXIT

# Function to wait for service health
wait_for_service() {
    local service=$1
    local timeout=${2:-60}
    local count=0

    log_info "Waiting for $service to become healthy..."
    
    while [ $count -lt $timeout ]; do
        if docker-compose -f $COMPOSE_FILE ps --services --filter "status=running" | grep -q "$service"; then
            if docker-compose -f $COMPOSE_FILE exec -T "$service" sh -c 'exit 0' 2>/dev/null; then
                log_success "$service is healthy"
                return 0
            fi
        fi
        
        sleep 1
        count=$((count + 1))
        
        if [ $((count % 10)) -eq 0 ]; then
            log_warning "Still waiting for $service... ($count/$timeout)"
        fi
    done
    
    log_error "$service failed to become healthy within $timeout seconds"
    return 1
}

# Function to run test suite
run_test_suite() {
    local test_type=$1
    local service_name="${test_type}-tests"
    
    log_info "Starting $test_type tests..."
    
    # Start the test service
    if ! docker-compose -f $COMPOSE_FILE --profile "${test_type}-testing" up --build -d; then
        log_error "Failed to start $test_type test environment"
        return 1
    fi
    
    # Wait for dependencies
    case $test_type in
        "integration"|"e2e"|"performance"|"security")
            wait_for_service "app" 120
            ;;
    esac
    
    # Run the tests with timeout
    local exit_code=0
    
    if ! timeout $TEST_TIMEOUT docker-compose -f $COMPOSE_FILE exec -T "$service_name" sh -c 'exit 0' 2>/dev/null; then
        log_warning "$service_name not responding, checking logs..."
        docker-compose -f $COMPOSE_FILE logs "$service_name"
    fi
    
    # Get test results
    if docker-compose -f $COMPOSE_FILE ps "$service_name" | grep -q "Exit 0"; then
        log_success "$test_type tests passed"
    else
        log_error "$test_type tests failed"
        exit_code=1
        
        # Capture logs for debugging
        log_info "Capturing $test_type test logs..."
        docker-compose -f $COMPOSE_FILE logs "$service_name" > "logs/${test_type}-tests.log" 2>&1
    fi
    
    return $exit_code
}

# Function to run tests in parallel
run_parallel_tests() {
    local test_types=("$@")
    local pids=()
    local results=()
    
    log_info "Running tests in parallel: ${test_types[*]}"
    
    # Start tests in background
    for test_type in "${test_types[@]}"; do
        (
            run_test_suite "$test_type"
            echo $? > "results/${test_type}.result"
        ) &
        pids+=($!)
    done
    
    # Wait for all tests to complete
    for pid in "${pids[@]}"; do
        wait $pid
    done
    
    # Collect results
    local overall_result=0
    for test_type in "${test_types[@]}"; do
        if [ -f "results/${test_type}.result" ]; then
            result=$(cat "results/${test_type}.result")
            results+=("$test_type:$result")
            if [ $result -ne 0 ]; then
                overall_result=1
            fi
        else
            log_error "No result file for $test_type"
            overall_result=1
        fi
    done
    
    # Report results
    log_info "Parallel test results:"
    for result in "${results[@]}"; do
        IFS=':' read -r test_type exit_code <<< "$result"
        if [ $exit_code -eq 0 ]; then
            log_success "$test_type: PASSED"
        else
            log_error "$test_type: FAILED"
        fi
    done
    
    return $overall_result
}

# Function to generate comprehensive test report
generate_test_report() {
    log_info "Generating comprehensive test report..."
    
    # Create report directory
    mkdir -p test-reports
    
    # Start test reporter service
    docker-compose -f $COMPOSE_FILE --profile reporting up --build -d test-reporter
    
    # Wait for report generation
    sleep 10
    
    # Check if reports were generated
    if [ -d "test-reports" ] && [ "$(ls -A test-reports)" ]; then
        log_success "Test reports generated in test-reports/ directory"
        
        # List generated reports
        log_info "Generated reports:"
        find test-reports -type f -name "*.html" -o -name "*.json" -o -name "*.xml" | sed 's/^/  /'
    else
        log_warning "No test reports generated"
    fi
}

# Main function
main() {
    local test_mode=${1:-"all"}
    local environment=${2:-"test"}
    
    log_info "Starting Docker test orchestration"
    log_info "Test mode: $test_mode"
    log_info "Environment: $environment"
    
    # Create necessary directories
    mkdir -p logs results test-reports
    
    # Build base images first
    log_info "Building base test images..."
    if ! docker-compose -f $COMPOSE_FILE build; then
        log_error "Failed to build test images"
        exit 1
    fi
    
    # Start infrastructure services
    log_info "Starting infrastructure services..."
    if ! docker-compose -f $COMPOSE_FILE up -d postgres redis; then
        log_error "Failed to start infrastructure services"
        exit 1
    fi
    
    # Wait for infrastructure
    wait_for_service "postgres" 60
    wait_for_service "redis" 30
    
    # Run database migrations
    log_info "Running database migrations..."
    docker-compose -f $COMPOSE_FILE --profile migration up --build db-migrate
    
    # Execute tests based on mode
    case $test_mode in
        "unit")
            run_test_suite "unit"
            ;;
        "integration")
            run_test_suite "integration"
            ;;
        "e2e")
            run_test_suite "e2e"
            ;;
        "performance")
            run_test_suite "performance"
            ;;
        "security")
            run_test_suite "security"
            ;;
        "fast")
            run_parallel_tests "unit" "integration"
            ;;
        "all")
            run_parallel_tests "unit" "integration" "e2e"
            ;;
        "full")
            run_parallel_tests "unit" "integration" "e2e" "performance" "security"
            ;;
        *)
            log_error "Unknown test mode: $test_mode"
            log_info "Available modes: unit, integration, e2e, performance, security, fast, all, full"
            exit 1
            ;;
    esac
    
    # Generate reports
    generate_test_report
    
    log_success "Test orchestration completed"
}

# Help function
show_help() {
    cat << EOF
Docker Test Orchestrator

Usage: $0 [test_mode] [environment]

Test Modes:
  unit         Run only unit tests
  integration  Run only integration tests
  e2e          Run only E2E tests
  performance  Run only performance tests
  security     Run only security tests
  fast         Run unit and integration tests in parallel
  all          Run unit, integration, and E2E tests in parallel
  full         Run all test types in parallel (default)

Environments:
  test         Use test configuration (default)
  dev          Use development configuration

Examples:
  $0 unit                    # Run unit tests only
  $0 fast test              # Run fast test suite
  $0 all dev                # Run all tests in dev environment

EOF
}

# Script entry point
if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

main "$@"
```

## 3. Container Performance Optimization for Testing

### 3.1 Layer Caching Strategies

```dockerfile
# File: docker/optimized-test.Dockerfile
# Optimized Dockerfile with advanced caching strategies

FROM node:18-alpine AS base

# Install system dependencies in separate layer for better caching
RUN apk add --no-cache \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/cache/apk/*

# Create user and set permissions in separate layer
RUN addgroup -g 1001 -S testuser && \
    adduser -S testuser -u 1001 -G testuser && \
    mkdir -p /app && \
    chown testuser:testuser /app

WORKDIR /app
USER testuser

# Dependencies caching layer - only invalidated when package files change
FROM base AS deps-cache
COPY --chown=testuser:testuser package*.json ./

# Use BuildKit cache mounts for optimal dependency caching
RUN --mount=type=cache,target=/home/testuser/.npm,uid=1001,gid=1001 \
    npm ci --prefer-offline --no-audit && \
    npm cache clean --force

# Development dependencies layer
FROM deps-cache AS dev-deps-cache
RUN --mount=type=cache,target=/home/testuser/.npm,uid=1001,gid=1001 \
    npm ci && \
    npm cache clean --force

# Source code layer - separate from dependencies for better layer reuse
FROM dev-deps-cache AS source
COPY --chown=testuser:testuser . .

# Build layer with cache optimization
FROM source AS build-cache
RUN --mount=type=cache,target=/app/.next/cache \
    --mount=type=cache,target=/app/dist \
    npm run build

# Test-specific optimizations
FROM build-cache AS test-optimized

# Pre-warm common test operations
RUN npm run lint:check || true && \
    npm run typecheck || true

# Create test result directories
RUN mkdir -p \
    /app/test-results \
    /app/coverage \
    /app/reports \
    && chown -R testuser:testuser /app/test-results /app/coverage /app/reports

# Test runner with optimizations
FROM test-optimized AS test-runner

# Set optimal test environment variables
ENV NODE_ENV=test \
    NODE_OPTIONS="--max-old-space-size=2048" \
    JEST_WORKERS=50% \
    CI=true

# Use multi-command execution for better performance
CMD ["sh", "-c", "npm run test:unit && npm run test:integration"]
```

### 3.2 Container Resource Management

```yaml
# File: docker-compose.performance.yml
# Performance-optimized Docker Compose configuration

version: '3.8'

x-resource-limits: &resource-limits
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 2G
      reservations:
        cpus: '0.5'
        memory: 512M

x-logging: &logging
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"

services:
  # Optimized PostgreSQL for testing
  postgres:
    image: postgres:15-alpine
    <<: *logging
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.25'
          memory: 256M
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      # Performance optimizations
      POSTGRES_SHARED_BUFFERS: 256MB
      POSTGRES_EFFECTIVE_CACHE_SIZE: 1GB
      POSTGRES_WORK_MEM: 16MB
    volumes:
      - type: tmpfs
        target: /var/lib/postgresql/data
        tmpfs:
          size: 1G
      - ./docker/postgres-test.conf:/etc/postgresql/postgresql.conf:ro
    command: ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test -d testdb"]
      interval: 5s
      timeout: 3s
      retries: 3
      start_period: 5s

  # Optimized Redis for testing
  redis:
    image: redis:7-alpine
    <<: *logging
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.1'
          memory: 128M
    command: >
      redis-server
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --save ""
      --appendonly no
    volumes:
      - type: tmpfs
        target: /data
        tmpfs:
          size: 256M
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 2s
      retries: 3

  # Application with performance tuning
  app:
    build:
      context: .
      dockerfile: docker/optimized-test.Dockerfile
      target: test-runner
      cache_from:
        - node:18-alpine
        - myapp:deps-cache
        - myapp:build-cache
    <<: [*resource-limits, *logging]
    environment:
      NODE_ENV: test
      DATABASE_URL: postgresql://test:test@postgres:5432/testdb
      REDIS_URL: redis://redis:6379
      # Performance optimizations
      UV_THREADPOOL_SIZE: 16
      NODE_OPTIONS: "--max-old-space-size=1536 --optimize-for-size"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s

  # Parallel test runners
  unit-tests:
    build:
      context: .
      dockerfile: docker/optimized-test.Dockerfile
      target: test-runner
    <<: *logging
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      NODE_ENV: test
      JEST_WORKERS: 2
      NODE_OPTIONS: "--max-old-space-size=768"
    volumes:
      - test-results:/app/test-results
    command: ["npm", "run", "test:unit", "--", "--maxWorkers=2", "--ci"]

  integration-tests:
    build:
      context: .
      dockerfile: docker/optimized-test.Dockerfile
      target: test-runner
    <<: [*resource-limits, *logging]
    environment:
      NODE_ENV: integration
      DATABASE_URL: postgresql://test:test@postgres:5432/testdb
      REDIS_URL: redis://redis:6379
      NODE_OPTIONS: "--max-old-space-size=1024"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      app:
        condition: service_healthy
    volumes:
      - test-results:/app/test-results
    command: ["npm", "run", "test:integration", "--", "--ci"]

volumes:
  test-results:
    driver: local
```

## 4. Cross-Platform Testing Strategies

### 4.1 Multi-Architecture Container Support

```dockerfile
# File: docker/multi-arch.Dockerfile
# Multi-architecture Dockerfile for cross-platform testing

# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM node:18-alpine AS base

ARG BUILDPLATFORM
ARG TARGETPLATFORM
ARG BUILDOS
ARG BUILDARCH
ARG TARGETOS  
ARG TARGETARCH

# Platform-specific dependencies
RUN case "$TARGETARCH" in \
    "amd64") \
        echo "Installing dependencies for AMD64" && \
        apk add --no-cache chromium ;; \
    "arm64") \
        echo "Installing dependencies for ARM64" && \
        apk add --no-cache chromium ;; \
    "arm") \
        echo "Installing dependencies for ARM" && \
        apk add --no-cache chromium ;; \
    *) \
        echo "Unsupported architecture: $TARGETARCH" && exit 1 ;; \
    esac

# Cross-compilation helpers
FROM base AS build-tools
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers

# Architecture-specific optimizations
FROM build-tools AS optimized
RUN case "$TARGETARCH" in \
    "amd64") \
        export NODE_OPTIONS="--max-old-space-size=4096" ;; \
    "arm64") \
        export NODE_OPTIONS="--max-old-space-size=2048" ;; \
    "arm") \
        export NODE_OPTIONS="--max-old-space-size=1024" ;; \
    esac

WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build

# Test stage with platform-specific configurations
FROM optimized AS test
ENV NODE_ENV=test

# Platform-specific test configurations
COPY docker/test-config.${TARGETARCH}.json ./test-config.json

CMD ["npm", "test"]
```

### 4.2 Cross-Platform Testing Orchestration

```yaml
# File: docker-compose.cross-platform.yml
version: '3.8'

services:
  # AMD64 test runner
  test-amd64:
    build:
      context: .
      dockerfile: docker/multi-arch.Dockerfile
      platforms:
        - linux/amd64
    environment:
      PLATFORM: amd64
      TEST_SUITE: full
    volumes:
      - ./test-results/amd64:/app/test-results

  # ARM64 test runner
  test-arm64:
    build:
      context: .
      dockerfile: docker/multi-arch.Dockerfile
      platforms:
        - linux/arm64
    environment:
      PLATFORM: arm64
      TEST_SUITE: compatibility
    volumes:
      - ./test-results/arm64:/app/test-results

  # ARM test runner
  test-arm:
    build:
      context: .
      dockerfile: docker/multi-arch.Dockerfile
      platforms:
        - linux/arm/v7
    environment:
      PLATFORM: arm
      TEST_SUITE: basic
    volumes:
      - ./test-results/arm:/app/test-results

  # Cross-platform compatibility validator
  compatibility-validator:
    build:
      context: .
      dockerfile: docker/validator.Dockerfile
    depends_on:
      - test-amd64
      - test-arm64
      - test-arm
    volumes:
      - ./test-results:/results:ro
      - ./compatibility-report:/output
    command: ["node", "validate-compatibility.js"]
```

## 5. Container Security for Testing

### 5.1 Security-Hardened Test Containers

```dockerfile
# File: docker/secure-test.Dockerfile
# Security-hardened Dockerfile for testing environments

FROM node:18-alpine AS base

# Install security scanning tools
RUN apk add --no-cache \
    ca-certificates \
    curl \
    dumb-init \
    && update-ca-certificates \
    && rm -rf /var/cache/apk/*

# Create non-root user with minimal privileges
RUN addgroup -g 1001 -S testuser && \
    adduser -S testuser -u 1001 -G testuser \
    --home /home/testuser \
    --shell /sbin/nologin \
    --no-create-home \
    --disabled-password

# Set up secure working directory
WORKDIR /app
RUN chown testuser:testuser /app && \
    chmod 755 /app

# Security: Remove setuid/setgid permissions
RUN find /usr -perm /6000 -type f -exec chmod a-s {} \; || true

# Dependencies with security scanning
FROM base AS secure-deps
USER testuser
COPY --chown=testuser:testuser package*.json ./

# Install dependencies and run security audit
RUN npm ci --only=production && \
    npm audit --audit-level moderate && \
    npm cache clean --force

# Development dependencies with security checks
FROM secure-deps AS secure-dev-deps
RUN npm ci && \
    npm audit --audit-level low && \
    npm cache clean --force

# Application build with security checks
FROM secure-dev-deps AS secure-build
COPY --chown=testuser:testuser . .

# Run security linting and checks
RUN npm run lint:security && \
    npm run build && \
    npm run test:security-static

# Final test image with minimal attack surface
FROM alpine:3.18 AS secure-test

# Install only required runtime dependencies
RUN apk add --no-cache \
    nodejs \
    npm \
    dumb-init \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Create secure user
RUN addgroup -g 1001 -S testuser && \
    adduser -S testuser -u 1001 -G testuser \
    --home /home/testuser \
    --shell /sbin/nologin \
    --disabled-password

# Copy only necessary files
WORKDIR /app
COPY --from=secure-build --chown=testuser:testuser /app/node_modules ./node_modules
COPY --from=secure-build --chown=testuser:testuser /app/dist ./dist
COPY --from=secure-build --chown=testuser:testuser /app/package.json ./

# Security: Set read-only filesystem (with exceptions)
USER testuser

# Security labels and metadata
LABEL \
    security.scan.date="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    security.scan.status="passed" \
    security.non-root="true" \
    security.no-setuid="true"

# Health check with security considerations
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD ["node", "-e", "process.exit(0)"]

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "test"]
```

### 5.2 Container Security Scanning Integration

```yaml
# File: docker-compose.security.yml
version: '3.8'

services:
  # Application under test
  app:
    build:
      context: .
      dockerfile: docker/secure-test.Dockerfile
      target: secure-test
    networks:
      - test-network
    read_only: true
    tmpfs:
      - /tmp
      - /app/logs
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    security_opt:
      - no-new-privileges:true
    user: "1001:1001"

  # Container vulnerability scanner
  trivy-scanner:
    image: aquasec/trivy:latest
    networks:
      - test-network
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./security-reports:/reports
    command: [
      "image",
      "--format", "json",
      "--output", "/reports/trivy-report.json",
      "--severity", "HIGH,CRITICAL",
      "app:latest"
    ]
    depends_on:
      - app

  # Container security benchmarking
  docker-bench:
    image: docker/docker-bench-security:latest
    networks:
      - test-network
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./security-reports:/reports
    command: sh -c "docker-bench-security.sh > /reports/docker-bench.txt"

  # Network security testing
  nmap-scanner:
    image: instrumentisto/nmap:latest
    networks:
      - test-network
    volumes:
      - ./security-reports:/reports
    command: [
      "nmap",
      "-sV", "-sC", "-O",
      "--script", "vuln",
      "-oX", "/reports/nmap-scan.xml",
      "app"
    ]
    depends_on:
      - app

  # OWASP ZAP security testing
  zap-scanner:
    image: owasp/zap2docker-stable:latest
    networks:
      - test-network
    volumes:
      - ./security-reports:/zap/wrk
    command: [
      "zap-baseline.py",
      "-t", "http://app:3000",
      "-J", "/zap/wrk/zap-report.json",
      "-r", "/zap/wrk/zap-report.html"
    ]
    depends_on:
      - app

  # Security report aggregator
  security-reporter:
    build:
      context: ./docker/security-reporter
    networks:
      - test-network
    volumes:
      - ./security-reports:/input:ro
      - ./final-reports:/output
    depends_on:
      - trivy-scanner
      - docker-bench
      - nmap-scanner
      - zap-scanner
    command: ["node", "aggregate-security-reports.js"]

networks:
  test-network:
    driver: bridge
```

## 6. Integration with GitHub Actions

### 6.1 Container-Aware CI/CD Pipeline

```yaml
# File: .github/workflows/container-testing.yml
name: Advanced Container Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  DOCKER_BUILDKIT: 1
  COMPOSE_DOCKER_CLI_BUILD: 1
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Build and cache container images
  build-images:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        with:
          platforms: linux/amd64,linux/arm64

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-

      - name: Build and push Docker images
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/advanced-test.Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          target: test-utils

  # Container security scanning
  security-scan:
    runs-on: ubuntu-latest
    needs: build-images
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build-images.outputs.image-tag }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  # Multi-architecture testing
  test-matrix:
    runs-on: ubuntu-latest
    needs: build-images
    strategy:
      fail-fast: false
      matrix:
        test-type: [unit, integration, e2e]
        platform: [linux/amd64, linux/arm64]
        include:
          - test-type: performance
            platform: linux/amd64
          - test-type: security
            platform: linux/amd64
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Set up QEMU for multi-arch
        if: matrix.platform == 'linux/arm64'
        uses: docker/setup-qemu-action@v3

      - name: Run containerized tests
        run: |
          export PLATFORM=${{ matrix.platform }}
          export TEST_TYPE=${{ matrix.test-type }}
          
          # Pull the built image
          docker pull ${{ needs.build-images.outputs.image-tag }}
          
          # Tag for local use
          docker tag ${{ needs.build-images.outputs.image-tag }} myapp:test
          
          # Run the specific test suite
          docker-compose -f docker-compose.test.yml \
            --profile ${{ matrix.test-type }}-testing \
            up --build --abort-on-container-exit

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.test-type }}-${{ matrix.platform }}
          path: |
            test-results/
            coverage/
            reports/

  # Container performance benchmarking
  performance-benchmark:
    runs-on: ubuntu-latest
    needs: build-images
    steps:
      - uses: actions/checkout@v4

      - name: Performance benchmark
        run: |
          # Run performance tests with resource monitoring
          docker stats --no-stream > container-stats.txt &
          STATS_PID=$!
          
          docker-compose -f docker-compose.performance.yml up --abort-on-container-exit
          
          kill $STATS_PID || true

      - name: Analyze performance results
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            
            // Read performance metrics
            const stats = fs.readFileSync('container-stats.txt', 'utf8');
            
            // Generate performance summary
            core.summary.addHeading('🚀 Container Performance Results');
            core.summary.addCodeBlock(stats, 'text');
            
            await core.summary.write();

  # Integration with external monitoring
  monitoring-integration:
    runs-on: ubuntu-latest
    needs: [test-matrix, security-scan]
    if: always()
    steps:
      - name: Send metrics to monitoring system
        uses: actions/github-script@v7
        with:
          script: |
            // Send test metrics to external monitoring system
            const testResults = {
              repository: context.repo.repo,
              branch: context.ref,
              commit: context.sha,
              workflow_run_id: context.runId,
              test_results: '${{ needs.test-matrix.result }}',
              security_results: '${{ needs.security-scan.result }}',
              timestamp: new Date().toISOString()
            };
            
            // Send to monitoring endpoint (replace with actual endpoint)
            // await fetch('https://monitoring.company.com/api/ci-metrics', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(testResults)
            // });
            
            core.info('Test metrics recorded for monitoring');
```

## 7. Practical Exercise: Complete Container Testing Pipeline

### Exercise Overview

Design and implement a complete containerized testing pipeline that integrates with the advanced GitHub Actions workflows from Lesson 02.

### Requirements

1. **Multi-Stage Container Architecture**: Create optimized Docker images for different testing scenarios
2. **Service Orchestration**: Use Docker Compose to orchestrate complex testing environments
3. **Security Integration**: Include container security scanning and hardening
4. **Performance Optimization**: Implement advanced caching and resource management
5. **CI/CD Integration**: Connect with GitHub Actions for automated testing
6. **Cross-Platform Support**: Enable testing across multiple architectures

### Implementation Steps

1. Create multi-stage Dockerfiles for different test types
2. Design Docker Compose configurations for complex scenarios
3. Implement security scanning and hardening measures
4. Optimize for performance and resource usage
5. Integrate with GitHub Actions workflows
6. Add cross-platform testing capabilities
7. Create monitoring and reporting mechanisms

### Success Criteria

- Container images build successfully for all test types
- Docker Compose orchestrates complex multi-service scenarios
- Security scans pass without high/critical vulnerabilities
- Performance optimizations reduce test execution time by 40%
- CI/CD integration works seamlessly with GitHub Actions
- Cross-platform tests execute successfully on multiple architectures

## Assessment

### Knowledge Check

1. **Container Architecture Design**: Design a multi-stage Dockerfile that optimizes for both build time and runtime performance while maintaining security best practices.

2. **Service Orchestration**: Explain how you would orchestrate a testing environment with 8 different services (database, cache, message queue, API, frontend, etc.) using Docker Compose.

3. **Performance Optimization**: Analyze a slow-running containerized test suite and propose specific optimization strategies with expected performance improvements.

4. **Security Hardening**: Describe the security measures you would implement for a containerized testing environment in a enterprise setting.

### Practical Assessment

Create a complete containerized testing solution that includes:
- Multi-stage Dockerfiles optimized for different test types
- Docker Compose orchestration for complex scenarios
- Security scanning and hardening implementation
- Performance optimization and monitoring
- Integration with CI/CD pipelines
- Cross-platform testing capabilities

The solution should demonstrate advanced Docker knowledge and enterprise-level testing practices.

## Summary

This lesson covered Docker fundamentals specifically tailored for testing environments:

1. **Container Architecture for Testing**: Learned to design multi-stage Docker images optimized for different testing scenarios with proper separation of concerns and security hardening.

2. **Service Orchestration**: Implemented complex Docker Compose configurations that orchestrate multi-service testing environments with proper dependency management and health checks.

3. **Performance Optimization**: Applied advanced caching strategies, resource management, and layer optimization techniques to minimize build and execution times.

4. **Cross-Platform Testing**: Created multi-architecture containers that enable consistent testing across different platforms and architectures.

5. **Security Integration**: Implemented container security best practices including vulnerability scanning, minimal attack surface, and proper privilege management.

6. **CI/CD Integration**: Connected containerized testing with advanced GitHub Actions workflows for automated, scalable testing pipelines.

These Docker patterns provide the foundation for building robust, scalable testing infrastructure that can handle enterprise-level complexity while maintaining security and performance standards.

## Next Steps

In the next lesson, we'll explore how to integrate these containerized testing patterns into CI/CD pipelines, focusing on advanced orchestration, parallel execution, and production deployment strategies.

## Further Reading

- [Docker Best Practices for Testing](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-Stage Builds for Testing](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose for Testing](https://docs.docker.com/compose/gettingstarted/)
- [Container Security Best Practices](https://docs.docker.com/engine/security/)
- [Docker Performance Optimization](https://docs.docker.com/config/containers/resource_constraints/)