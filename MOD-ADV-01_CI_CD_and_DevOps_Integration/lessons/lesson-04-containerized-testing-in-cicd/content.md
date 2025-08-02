# Lesson 04: Containerized Testing in CI/CD

## Learning Objectives

By the end of this lesson, you will be able to:

- **Design Advanced Container Orchestration Strategies**: Create sophisticated CI/CD pipelines that orchestrate multiple containerized testing environments with complex dependencies and service meshes
- **Implement Dynamic Test Environment Provisioning**: Build systems that automatically provision, configure, and tear down containerized test environments based on code changes and testing requirements
- **Master Container Pipeline Optimization**: Apply advanced techniques for parallel container execution, intelligent resource allocation, and pipeline performance optimization in enterprise CI/CD environments
- **Architect Multi-Environment Container Testing**: Design container strategies that seamlessly test across development, staging, and production-like environments with environment-specific configurations
- **Implement Advanced Container Security in Pipelines**: Integrate container security scanning, compliance checking, and vulnerability management into automated CI/CD workflows
- **Design Container Testing Patterns for Microservices**: Create testing strategies for complex microservice architectures using container orchestration and service mesh patterns
- **Build Intelligent Container Caching Systems**: Implement sophisticated caching strategies that optimize build times, reduce resource consumption, and improve pipeline reliability
- **Integrate Container Monitoring and Observability**: Implement comprehensive monitoring, logging, and observability for containerized testing environments in CI/CD pipelines

## Introduction

Modern enterprise software development requires sophisticated testing strategies that can handle complex microservice architectures, multiple environments, and rapid deployment cycles. Containerized testing in CI/CD pipelines provides the scalability, consistency, and reliability needed for enterprise-grade software delivery.

This lesson focuses on advanced patterns for integrating containerized testing into CI/CD pipelines, going beyond basic Docker usage to explore enterprise-level orchestration, optimization, and monitoring strategies used by companies like Netflix, Uber, and Spotify to manage complex testing infrastructures at scale.

## Prerequisites Review

Before diving into containerized CI/CD testing, ensure you understand:
- Docker fundamentals for testing (Lesson 03)
- Advanced GitHub Actions workflows (Lesson 02)
- Container orchestration with Docker Compose
- CI/CD pipeline concepts and best practices
- Microservices architecture patterns

## 1. Advanced Container Orchestration in CI/CD

### 1.1 Multi-Service Testing Orchestration

```yaml
# File: .github/workflows/containerized-testing.yml
name: Advanced Containerized Testing Pipeline

on:
  push:
    branches: [main, develop, 'feature/*']
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Nightly builds

env:
  DOCKER_BUILDKIT: 1
  COMPOSE_DOCKER_CLI_BUILD: 1
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  TEST_ENVIRONMENT: ${{ github.ref_name }}

jobs:
  # Environment preparation and image building
  prepare-environment:
    runs-on: ubuntu-latest
    outputs:
      test-matrix: ${{ steps.generate-matrix.outputs.matrix }}
      image-tag: ${{ steps.meta.outputs.tags }}
      cache-key: ${{ steps.cache-key.outputs.key }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate dynamic test matrix
        id: generate-matrix
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = require('path');
            
            // Analyze changed files to determine test strategy
            const { execSync } = require('child_process');
            
            let changedFiles = [];
            try {
              const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
              changedFiles = output.trim().split('\n').filter(f => f);
            } catch (error) {
              // If git diff fails, run full test suite
              changedFiles = [];
            }
            
            // Generate intelligent test matrix based on changes
            const matrix = {
              include: []
            };
            
            // Always run unit tests
            matrix.include.push({
              test_type: 'unit',
              environment: 'test',
              services: ['app'],
              parallel: true,
              timeout: 10
            });
            
            // Add integration tests if backend changes detected
            const backendChanges = changedFiles.some(f => 
              f.includes('src/') || f.includes('api/') || f.includes('database/')
            );
            
            if (backendChanges || changedFiles.length === 0) {
              matrix.include.push({
                test_type: 'integration',
                environment: 'integration',
                services: ['app', 'postgres', 'redis', 'elasticsearch'],
                parallel: false,
                timeout: 20
              });
            }
            
            // Add E2E tests if frontend changes or full test required
            const frontendChanges = changedFiles.some(f => 
              f.includes('frontend/') || f.includes('ui/') || f.includes('web/')
            );
            
            if (frontendChanges || changedFiles.length === 0 || context.eventName === 'schedule') {
              matrix.include.push({
                test_type: 'e2e',
                environment: 'staging',
                services: ['app', 'postgres', 'redis', 'frontend', 'nginx'],
                parallel: false,
                timeout: 30
              });
            }
            
            // Add performance tests for main branch or nightly builds
            if (context.ref === 'refs/heads/main' || context.eventName === 'schedule') {
              matrix.include.push({
                test_type: 'performance',
                environment: 'performance',
                services: ['app', 'postgres', 'redis', 'monitoring'],
                parallel: false,
                timeout: 45
              });
            }
            
            // Add security tests for security-related changes or nightly builds
            const securityChanges = changedFiles.some(f => 
              f.includes('security/') || f.includes('auth/') || f.includes('Dockerfile')
            );
            
            if (securityChanges || context.eventName === 'schedule') {
              matrix.include.push({
                test_type: 'security',
                environment: 'security',
                services: ['app', 'security-scanner', 'vulnerability-db'],
                parallel: false,
                timeout: 25
              });
            }
            
            core.setOutput('matrix', JSON.stringify(matrix));
            
            // Log the generated matrix for debugging
            core.info(`Generated test matrix: ${JSON.stringify(matrix, null, 2)}`);

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        with:
          platforms: linux/amd64,linux/arm64
          driver-opts: |
            network=host
            env.BUILDKIT_STEP_LOG_MAX_SIZE=50000000

      - name: Generate cache key
        id: cache-key
        run: |
          echo "key=docker-cache-${{ hashFiles('**/Dockerfile*', '**/package*.json', '**/requirements*.txt', '**/go.mod', '**/go.sum') }}" >> $GITHUB_OUTPUT

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
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push base images
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/multi-stage.Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: |
            type=gha,scope=${{ github.workflow }}
            type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:cache
          cache-to: |
            type=gha,scope=${{ github.workflow }},mode=max
            type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:cache,mode=max
          target: test-base

  # Parallel containerized testing
  containerized-tests:
    runs-on: ubuntu-latest
    needs: prepare-environment
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.prepare-environment.outputs.test-matrix) }}
    env:
      TEST_TYPE: ${{ matrix.test_type }}
      TEST_ENVIRONMENT: ${{ matrix.environment }}
      SERVICES: ${{ join(matrix.services, ',') }}
      PARALLEL_EXECUTION: ${{ matrix.parallel }}
      TEST_TIMEOUT: ${{ matrix.timeout }}
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Pull base images
        run: |
          echo "Pulling base images for ${{ matrix.test_type }} tests..."
          docker pull ${{ needs.prepare-environment.outputs.image-tag }}
          
          # Tag for local use
          docker tag ${{ needs.prepare-environment.outputs.image-tag }} app:test

      - name: Prepare test environment
        run: |
          # Create environment-specific configuration
          mkdir -p config/${{ matrix.environment }}
          
          # Generate dynamic environment configuration
          cat > config/${{ matrix.environment }}/test.env << EOF
          NODE_ENV=${{ matrix.environment }}
          TEST_TYPE=${{ matrix.test_type }}
          PARALLEL_EXECUTION=${{ matrix.parallel }}
          CI=true
          GITHUB_RUN_ID=${{ github.run_id }}
          GITHUB_RUN_NUMBER=${{ github.run_number }}
          BRANCH_NAME=${{ github.ref_name }}
          COMMIT_SHA=${{ github.sha }}
          EOF
          
          # Set up test-specific Docker Compose override
          cat > docker-compose.${{ matrix.test_type }}.override.yml << 'EOF'
          version: '3.8'
          services:
            app:
              environment:
                - NODE_ENV=${{ matrix.environment }}
                - TEST_TYPE=${{ matrix.test_type }}
                - LOG_LEVEL=warn
              healthcheck:
                interval: 5s
                timeout: 3s
                retries: 3
          EOF

      - name: Start test infrastructure
        timeout-minutes: 5
        run: |
          echo "Starting infrastructure services: ${{ env.SERVICES }}"
          
          # Start only required services for this test type
          IFS=',' read -ra SERVICE_ARRAY <<< "${{ env.SERVICES }}"
          
          # Create a dynamic compose file with only required services
          python3 << 'EOF'
          import yaml
          import os
          
          # Load base compose file
          with open('docker-compose.test.yml', 'r') as f:
              compose = yaml.safe_load(f)
          
          # Get required services
          required_services = os.environ['SERVICES'].split(',')
          
          # Filter services
          filtered_services = {}
          for service in required_services:
              if service in compose['services']:
                  filtered_services[service] = compose['services'][service]
          
          # Update compose structure
          compose['services'] = filtered_services
          
          # Write filtered compose file
          with open('docker-compose.filtered.yml', 'w') as f:
              yaml.dump(compose, f, default_flow_style=False)
          EOF
          
          # Start filtered services
          docker-compose -f docker-compose.filtered.yml \
            -f docker-compose.${{ matrix.test_type }}.override.yml \
            --env-file config/${{ matrix.environment }}/test.env \
            up -d --build
          
          # Wait for services to be healthy
          timeout 300 bash -c '
            until docker-compose -f docker-compose.filtered.yml ps | grep -q "healthy\|Up"; do
              echo "Waiting for services to be ready..."
              sleep 5
            done
          '

      - name: Run containerized tests
        timeout-minutes: ${{ matrix.timeout }}
        run: |
          echo "Running ${{ matrix.test_type }} tests in containerized environment"
          
          # Set test-specific environment variables
          export TEST_RESULTS_DIR="test-results/${{ matrix.test_type }}"
          export COVERAGE_DIR="coverage/${{ matrix.test_type }}"
          
          # Create result directories
          mkdir -p "$TEST_RESULTS_DIR" "$COVERAGE_DIR"
          
          # Run the appropriate test suite
          case "${{ matrix.test_type }}" in
            "unit")
              docker-compose -f docker-compose.filtered.yml \
                exec -T app npm run test:unit -- \
                --coverage \
                --ci \
                --maxWorkers=${{ matrix.parallel && '4' || '1' }} \
                --testResultsProcessor="jest-junit" \
                --coverageDirectory="/app/coverage" \
                --outputFile="/app/$TEST_RESULTS_DIR/results.xml"
              ;;
            "integration")
              docker-compose -f docker-compose.filtered.yml \
                exec -T app npm run test:integration -- \
                --ci \
                --testResultsProcessor="jest-junit" \
                --outputFile="/app/$TEST_RESULTS_DIR/results.xml"
              ;;
            "e2e")
              docker-compose -f docker-compose.filtered.yml \
                exec -T app npm run test:e2e -- \
                --reporter=junit \
                --outputFile="/app/$TEST_RESULTS_DIR/results.xml"
              ;;
            "performance")
              docker-compose -f docker-compose.filtered.yml \
                exec -T app npm run test:performance -- \
                --output="/app/$TEST_RESULTS_DIR/performance.json"
              ;;
            "security")
              docker-compose -f docker-compose.filtered.yml \
                exec -T security-scanner trivy fs /app \
                --format json \
                --output "/app/$TEST_RESULTS_DIR/security.json"
              ;;
          esac

      - name: Collect test artifacts
        if: always()
        run: |
          # Copy test results from containers
          docker-compose -f docker-compose.filtered.yml \
            cp app:/app/test-results ./test-results-${{ matrix.test_type }} || true
          
          docker-compose -f docker-compose.filtered.yml \
            cp app:/app/coverage ./coverage-${{ matrix.test_type }} || true
          
          # Collect container logs
          docker-compose -f docker-compose.filtered.yml logs > container-logs-${{ matrix.test_type }}.txt

      - name: Generate test report
        if: always()
        run: |
          # Generate comprehensive test report
          cat > test-summary-${{ matrix.test_type }}.md << EOF
          # Test Summary: ${{ matrix.test_type }}
          
          **Environment**: ${{ matrix.environment }}
          **Services**: ${{ env.SERVICES }}
          **Parallel Execution**: ${{ matrix.parallel }}
          **Duration**: ${{ matrix.timeout }} minutes (max)
          **Status**: $([ $? -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")
          
          ## Test Configuration
          - Test Type: ${{ matrix.test_type }}
          - Environment: ${{ matrix.environment }}
          - Services Used: ${{ env.SERVICES }}
          - Branch: ${{ github.ref_name }}
          - Commit: ${{ github.sha }}
          
          ## Artifacts Generated
          - Test Results: test-results-${{ matrix.test_type }}/
          - Coverage Report: coverage-${{ matrix.test_type }}/
          - Container Logs: container-logs-${{ matrix.test_type }}.txt
          EOF

      - name: Cleanup test environment
        if: always()
        run: |
          # Stop and remove containers
          docker-compose -f docker-compose.filtered.yml down --volumes --remove-orphans || true
          
          # Clean up unused images and volumes
          docker system prune -f || true

      - name: Upload test artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-artifacts-${{ matrix.test_type }}-${{ github.run_id }}
          path: |
            test-results-${{ matrix.test_type }}/
            coverage-${{ matrix.test_type }}/
            container-logs-${{ matrix.test_type }}.txt
            test-summary-${{ matrix.test_type }}.md
          retention-days: 30

  # Container performance analysis
  performance-analysis:
    runs-on: ubuntu-latest
    needs: [prepare-environment, containerized-tests]
    if: always()
    steps:
      - uses: actions/checkout@v4

      - name: Download all test artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts/

      - name: Analyze container performance
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = require('path');
            
            // Analyze test artifacts and generate performance report
            const artifactDir = 'artifacts';
            const performanceData = {};
            
            // Process each test type's artifacts
            if (fs.existsSync(artifactDir)) {
              const testTypes = fs.readdirSync(artifactDir);
              
              for (const testType of testTypes) {
                const testDir = path.join(artifactDir, testType);
                
                if (fs.statSync(testDir).isDirectory()) {
                  const logFile = path.join(testDir, `container-logs-${testType.split('-')[2]}.txt`);
                  
                  if (fs.existsSync(logFile)) {
                    const logs = fs.readFileSync(logFile, 'utf8');
                    
                    // Extract performance metrics from logs
                    const metrics = {
                      testType: testType.split('-')[2],
                      containerStartTime: extractMetric(logs, /Container started in (\d+)ms/),
                      testDuration: extractMetric(logs, /Tests completed in (\d+)ms/),
                      memoryUsage: extractMetric(logs, /Memory usage: (\d+)MB/),
                      cpuUsage: extractMetric(logs, /CPU usage: ([\d.]+)%/)
                    };
                    
                    performanceData[metrics.testType] = metrics;
                  }
                }
              }
            }
            
            function extractMetric(text, regex) {
              const match = text.match(regex);
              return match ? match[1] : 'N/A';
            }
            
            // Generate performance summary
            core.summary.addHeading('🚀 Container Performance Analysis');
            
            const table = Object.entries(performanceData).map(([testType, metrics]) => [
              testType,
              metrics.containerStartTime + 'ms',
              metrics.testDuration + 'ms',
              metrics.memoryUsage + 'MB',
              metrics.cpuUsage + '%'
            ]);
            
            if (table.length > 0) {
              core.summary.addTable([
                ['Test Type', 'Container Start', 'Test Duration', 'Memory Usage', 'CPU Usage'],
                ...table
              ]);
            } else {
              core.summary.addRaw('No performance data available for analysis.');
            }
            
            await core.summary.write();

  # Container security and compliance
  security-compliance:
    runs-on: ubuntu-latest
    needs: prepare-environment
    if: github.event_name != 'pull_request' || contains(github.event.pull_request.labels.*.name, 'security-scan')
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4

      - name: Run comprehensive container security scan
        run: |
          # Pull the built image
          docker pull ${{ needs.prepare-environment.outputs.image-tag }}
          
          # Run Trivy vulnerability scan
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            -v $(pwd):/workspace \
            aquasec/trivy:latest image \
            --format sarif \
            --output /workspace/trivy-results.sarif \
            --severity HIGH,CRITICAL \
            ${{ needs.prepare-environment.outputs.image-tag }}
          
          # Run Docker Bench security scan
          docker run --rm --net host --pid host --userns host --cap-add audit_control \
            -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
            -v /var/lib:/var/lib:ro \
            -v /var/run/docker.sock:/var/run/docker.sock:ro \
            -v /usr/lib/systemd:/usr/lib/systemd:ro \
            -v /etc:/etc:ro \
            --label docker_bench_security \
            docker/docker-bench-security > docker-bench-results.txt
          
          # Run container compliance checks
          docker run --rm -v $(pwd):/workspace \
            aquasec/conftest:latest verify \
            --policy /workspace/policies/container-security.rego \
            /workspace/docker-compose.test.yml > compliance-results.txt

      - name: Upload security scan results
        if: always()
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy-results.sarif

      - name: Upload security artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: security-scan-results-${{ github.run_id }}
          path: |
            trivy-results.sarif
            docker-bench-results.txt
            compliance-results.txt

  # Deployment readiness assessment
  deployment-readiness:
    runs-on: ubuntu-latest
    needs: [containerized-tests, performance-analysis, security-compliance]
    if: always() && github.ref == 'refs/heads/main'
    steps:
      - name: Assess deployment readiness
        uses: actions/github-script@v7
        with:
          script: |
            // Evaluate all test results and determine deployment readiness
            const testResults = {
              containerizedTests: '${{ needs.containerized-tests.result }}',
              performanceAnalysis: '${{ needs.performance-analysis.result }}',
              securityCompliance: '${{ needs.security-compliance.result }}'
            };
            
            const allPassed = Object.values(testResults).every(result => 
              result === 'success' || result === 'skipped'
            );
            
            core.summary.addHeading('🚀 Deployment Readiness Assessment');
            
            core.summary.addTable([
              ['Component', 'Status', 'Result'],
              ['Containerized Tests', testResults.containerizedTests === 'success' ? '✅' : '❌', testResults.containerizedTests],
              ['Performance Analysis', testResults.performanceAnalysis === 'success' ? '✅' : '❌', testResults.performanceAnalysis],
              ['Security Compliance', testResults.securityCompliance === 'success' ? '✅' : '❌', testResults.securityCompliance]
            ]);
            
            if (allPassed) {
              core.summary.addRaw('\n## ✅ Ready for Deployment\n\nAll quality gates have passed. The application is ready for deployment to production.');
              core.setOutput('deployment-ready', 'true');
            } else {
              core.summary.addRaw('\n## ❌ Not Ready for Deployment\n\nOne or more quality gates have failed. Please review the results and fix any issues before deploying.');
              core.setOutput('deployment-ready', 'false');
            }
            
            await core.summary.write();

      - name: Trigger deployment workflow
        if: steps.deployment-readiness.outputs.deployment-ready == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            // Trigger deployment workflow if all tests pass
            await github.rest.actions.createWorkflowDispatch({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: 'deploy-production.yml',
              ref: 'main',
              inputs: {
                image_tag: '${{ needs.prepare-environment.outputs.image-tag }}',
                deployment_environment: 'production',
                skip_tests: 'true'
              }
            });
            
            core.info('Production deployment workflow triggered successfully');
```

### 1.2 Dynamic Environment Provisioning

```python
# File: scripts/dynamic-environment-provisioner.py
#!/usr/bin/env python3
"""
Dynamic Environment Provisioner for Containerized Testing
Automatically provisions and manages containerized test environments
"""

import os
import json
import yaml
import subprocess
import argparse
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import docker
import boto3
from kubernetes import client, config

class EnvironmentProvisioner:
    def __init__(self, config_file: str = 'provisioner-config.yml'):
        self.config = self.load_config(config_file)
        self.docker_client = docker.from_env()
        self.setup_logging()
        
    def setup_logging(self):
        """Set up structured logging"""
        logging.basicConfig(
            level=getattr(logging, self.config.get('log_level', 'INFO')),
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('environment-provisioner.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def load_config(self, config_file: str) -> Dict:
        """Load configuration from YAML file"""
        try:
            with open(config_file, 'r') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            self.logger.warning(f"Config file {config_file} not found, using defaults")
            return self.get_default_config()

    def get_default_config(self) -> Dict:
        """Return default configuration"""
        return {
            'environments': {
                'unit': {
                    'services': ['app'],
                    'resources': {'cpu': '0.5', 'memory': '512Mi'},
                    'timeout': 600,
                    'parallel': True
                },
                'integration': {
                    'services': ['app', 'postgres', 'redis'],
                    'resources': {'cpu': '1.0', 'memory': '1Gi'},
                    'timeout': 1200,
                    'parallel': False
                },
                'e2e': {
                    'services': ['app', 'postgres', 'redis', 'frontend', 'nginx'],
                    'resources': {'cpu': '2.0', 'memory': '2Gi'},
                    'timeout': 1800,
                    'parallel': False
                }
            },
            'platforms': {
                'docker': {'enabled': True, 'priority': 1},
                'kubernetes': {'enabled': False, 'priority': 2},
                'aws_ecs': {'enabled': False, 'priority': 3}
            },
            'cleanup': {
                'auto_cleanup': True,
                'retention_hours': 24,
                'cleanup_interval': 3600
            }
        }

    def analyze_changes(self, git_diff: str) -> Dict:
        """Analyze git changes to determine optimal test strategy"""
        changes = {
            'backend': False,
            'frontend': False,
            'database': False,
            'infrastructure': False,
            'security': False
        }
        
        for line in git_diff.split('\n'):
            if not line.startswith('+++') and not line.startswith('---'):
                continue
                
            file_path = line[4:] if line.startswith('+++') else line[4:]
            
            if any(path in file_path for path in ['src/', 'api/', 'backend/']):
                changes['backend'] = True
            elif any(path in file_path for path in ['frontend/', 'ui/', 'web/']):
                changes['frontend'] = True
            elif any(path in file_path for path in ['migrations/', 'schema/', 'database/']):
                changes['database'] = True
            elif any(path in file_path for path in ['Dockerfile', 'docker-compose', '.github/']):
                changes['infrastructure'] = True
            elif any(path in file_path for path in ['security/', 'auth/', 'permissions/']):
                changes['security'] = True

        return changes

    def generate_test_strategy(self, changes: Dict, branch: str, is_pr: bool) -> Dict:
        """Generate intelligent test strategy based on changes"""
        strategy = {
            'environments': [],
            'parallel_execution': True,
            'resource_allocation': 'standard'
        }
        
        # Always run unit tests
        strategy['environments'].append('unit')
        
        # Add integration tests for backend or database changes
        if changes['backend'] or changes['database']:
            strategy['environments'].append('integration')
        
        # Add E2E tests for frontend changes or main branch
        if changes['frontend'] or branch == 'main' or not is_pr:
            strategy['environments'].append('e2e')
        
        # Add security tests for security-related changes
        if changes['security'] or changes['infrastructure']:
            strategy['environments'].append('security')
        
        # Add performance tests for main branch
        if branch == 'main':
            strategy['environments'].append('performance')
        
        # Adjust resource allocation based on test load
        if len(strategy['environments']) > 3:
            strategy['resource_allocation'] = 'high'
            strategy['parallel_execution'] = False
        elif len(strategy['environments']) == 1:
            strategy['resource_allocation'] = 'minimal'
        
        return strategy

    def provision_docker_environment(self, env_name: str, strategy: Dict) -> Dict:
        """Provision Docker-based test environment"""
        self.logger.info(f"Provisioning Docker environment: {env_name}")
        
        env_config = self.config['environments'][env_name]
        
        # Generate dynamic Docker Compose configuration
        compose_config = {
            'version': '3.8',
            'services': {},
            'networks': {
                f'{env_name}-network': {
                    'driver': 'bridge'
                }
            },
            'volumes': {
                f'{env_name}-data': {}
            }
        }
        
        # Add services based on environment requirements
        for service in env_config['services']:
            service_config = self.get_service_config(service, env_name, strategy)
            compose_config['services'][service] = service_config
        
        # Write dynamic compose file
        compose_file = f'docker-compose.{env_name}.generated.yml'
        with open(compose_file, 'w') as f:
            yaml.dump(compose_config, f, default_flow_style=False)
        
        # Start the environment
        try:
            subprocess.run(
                ['docker-compose', '-f', compose_file, 'up', '-d'],
                check=True,
                capture_output=True,
                text=True
            )
            
            # Wait for services to be healthy
            self.wait_for_environment_health(compose_file, env_config['timeout'])
            
            return {
                'status': 'success',
                'environment_id': f'{env_name}-{datetime.now().strftime("%Y%m%d-%H%M%S")}',
                'compose_file': compose_file,
                'services': env_config['services']
            }
            
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Failed to provision {env_name} environment: {e}")
            return {'status': 'failed', 'error': str(e)}

    def get_service_config(self, service: str, env_name: str, strategy: Dict) -> Dict:
        """Generate service configuration for Docker Compose"""
        base_config = {
            'networks': [f'{env_name}-network'],
            'restart': 'unless-stopped'
        }
        
        service_configs = {
            'app': {
                **base_config,
                'build': {
                    'context': '.',
                    'dockerfile': 'docker/multi-stage.Dockerfile',
                    'target': 'test-runner'
                },
                'environment': [
                    f'NODE_ENV={env_name}',
                    f'TEST_TYPE={env_name}',
                    'CI=true'
                ],
                'volumes': [
                    f'{env_name}-data:/app/data',
                    './test-results:/app/test-results'
                ],
                'healthcheck': {
                    'test': ['CMD', 'curl', '-f', 'http://localhost:3000/health'],
                    'interval': '10s',
                    'timeout': '5s',
                    'retries': 3,
                    'start_period': '10s'
                }
            },
            'postgres': {
                **base_config,
                'image': 'postgres:15-alpine',
                'environment': [
                    f'POSTGRES_DB={env_name}db',
                    'POSTGRES_USER=test',
                    'POSTGRES_PASSWORD=test'
                ],
                'volumes': [
                    f'{env_name}-data:/var/lib/postgresql/data'
                ],
                'healthcheck': {
                    'test': ['CMD-SHELL', 'pg_isready -U test'],
                    'interval': '5s',
                    'timeout': '3s',
                    'retries': 5
                }
            },
            'redis': {
                **base_config,
                'image': 'redis:7-alpine',
                'command': 'redis-server --appendonly yes',
                'volumes': [
                    f'{env_name}-data:/data'
                ],
                'healthcheck': {
                    'test': ['CMD', 'redis-cli', 'ping'],
                    'interval': '5s',
                    'timeout': '2s',
                    'retries': 3
                }
            },
            'frontend': {
                **base_config,
                'build': {
                    'context': './frontend',
                    'dockerfile': 'Dockerfile.test'
                },
                'environment': [
                    f'NODE_ENV={env_name}',
                    'API_URL=http://app:3000'
                ],
                'depends_on': ['app']
            },
            'nginx': {
                **base_config,
                'image': 'nginx:alpine',
                'ports': ['80:80'],
                'volumes': [
                    './nginx/test.conf:/etc/nginx/nginx.conf:ro'
                ],
                'depends_on': ['app', 'frontend']
            }
        }
        
        return service_configs.get(service, base_config)

    def wait_for_environment_health(self, compose_file: str, timeout: int):
        """Wait for all services in the environment to be healthy"""
        start_time = datetime.now()
        
        while (datetime.now() - start_time).seconds < timeout:
            try:
                result = subprocess.run(
                    ['docker-compose', '-f', compose_file, 'ps', '--format', 'json'],
                    capture_output=True,
                    text=True,
                    check=True
                )
                
                services = [json.loads(line) for line in result.stdout.strip().split('\n') if line]
                
                if all(service.get('Health', 'healthy') in ['healthy', 'starting'] for service in services):
                    self.logger.info("All services are healthy")
                    return True
                    
            except subprocess.CalledProcessError:
                pass
            
            time.sleep(5)
        
        raise TimeoutError(f"Environment failed to become healthy within {timeout} seconds")

    def provision_kubernetes_environment(self, env_name: str, strategy: Dict) -> Dict:
        """Provision Kubernetes-based test environment"""
        self.logger.info(f"Provisioning Kubernetes environment: {env_name}")
        
        try:
            # Load Kubernetes configuration
            config.load_incluster_config() if os.getenv('KUBERNETES_SERVICE_HOST') else config.load_kube_config()
            
            v1 = client.CoreV1Api()
            apps_v1 = client.AppsV1Api()
            
            namespace_name = f"test-{env_name}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            
            # Create namespace
            namespace = client.V1Namespace(
                metadata=client.V1ObjectMeta(
                    name=namespace_name,
                    labels={
                        'test-environment': env_name,
                        'created-by': 'environment-provisioner',
                        'auto-cleanup': 'true'
                    }
                )
            )
            
            v1.create_namespace(namespace)
            
            # Deploy services to Kubernetes
            env_config = self.config['environments'][env_name]
            deployed_services = []
            
            for service in env_config['services']:
                k8s_manifests = self.generate_kubernetes_manifests(service, namespace_name, strategy)
                
                for manifest in k8s_manifests:
                    if manifest['kind'] == 'Deployment':
                        apps_v1.create_namespaced_deployment(namespace_name, manifest)
                    elif manifest['kind'] == 'Service':
                        v1.create_namespaced_service(namespace_name, manifest)
                    elif manifest['kind'] == 'ConfigMap':
                        v1.create_namespaced_config_map(namespace_name, manifest)
                
                deployed_services.append(service)
            
            # Wait for deployments to be ready
            self.wait_for_kubernetes_deployments(namespace_name, env_config['timeout'])
            
            return {
                'status': 'success',
                'environment_id': namespace_name,
                'platform': 'kubernetes',
                'services': deployed_services
            }
            
        except Exception as e:
            self.logger.error(f"Failed to provision Kubernetes environment: {e}")
            return {'status': 'failed', 'error': str(e)}

    def cleanup_environment(self, environment_id: str, platform: str = 'docker'):
        """Clean up a test environment"""
        self.logger.info(f"Cleaning up environment: {environment_id}")
        
        try:
            if platform == 'docker':
                self.cleanup_docker_environment(environment_id)
            elif platform == 'kubernetes':
                self.cleanup_kubernetes_environment(environment_id)
                
            self.logger.info(f"Successfully cleaned up environment: {environment_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to cleanup environment {environment_id}: {e}")

    def cleanup_docker_environment(self, environment_id: str):
        """Clean up Docker-based environment"""
        # Find and stop related containers
        containers = self.docker_client.containers.list(
            filters={'label': f'environment_id={environment_id}'}
        )
        
        for container in containers:
            container.stop()
            container.remove()
        
        # Remove related volumes
        volumes = self.docker_client.volumes.list(
            filters={'label': f'environment_id={environment_id}'}
        )
        
        for volume in volumes:
            volume.remove()

    def cleanup_kubernetes_environment(self, namespace_name: str):
        """Clean up Kubernetes-based environment"""
        config.load_incluster_config() if os.getenv('KUBERNETES_SERVICE_HOST') else config.load_kube_config()
        v1 = client.CoreV1Api()
        
        # Delete the entire namespace (this removes all resources)
        v1.delete_namespace(namespace_name)

    def auto_cleanup_expired_environments(self):
        """Automatically clean up expired test environments"""
        if not self.config['cleanup']['auto_cleanup']:
            return
        
        retention_hours = self.config['cleanup']['retention_hours']
        cutoff_time = datetime.now() - timedelta(hours=retention_hours)
        
        # Cleanup Docker environments
        containers = self.docker_client.containers.list(
            all=True,
            filters={'label': 'created-by=environment-provisioner'}
        )
        
        for container in containers:
            created_time = datetime.fromisoformat(
                container.attrs['Created'].replace('Z', '+00:00')
            ).replace(tzinfo=None)
            
            if created_time < cutoff_time:
                self.logger.info(f"Cleaning up expired container: {container.name}")
                if container.status == 'running':
                    container.stop()
                container.remove()

def main():
    parser = argparse.ArgumentParser(description='Dynamic Environment Provisioner')
    parser.add_argument('--action', choices=['provision', 'cleanup', 'auto-cleanup'], required=True)
    parser.add_argument('--environment', help='Environment type (unit, integration, e2e)')
    parser.add_argument('--environment-id', help='Environment ID for cleanup')
    parser.add_argument('--git-diff', help='Git diff for change analysis')
    parser.add_argument('--branch', default='main', help='Branch name')
    parser.add_argument('--is-pr', action='store_true', help='Is this a pull request?')
    parser.add_argument('--config', default='provisioner-config.yml', help='Config file path')
    
    args = parser.parse_args()
    
    provisioner = EnvironmentProvisioner(args.config)
    
    if args.action == 'provision':
        if not args.environment:
            # Analyze changes and generate strategy
            changes = provisioner.analyze_changes(args.git_diff or '')
            strategy = provisioner.generate_test_strategy(changes, args.branch, args.is_pr)
            
            results = []
            for env in strategy['environments']:
                result = provisioner.provision_docker_environment(env, strategy)
                results.append(result)
            
            print(json.dumps(results, indent=2))
        else:
            result = provisioner.provision_docker_environment(args.environment, {})
            print(json.dumps(result, indent=2))
    
    elif args.action == 'cleanup':
        if args.environment_id:
            provisioner.cleanup_environment(args.environment_id)
        else:
            print("Environment ID required for cleanup")
    
    elif args.action == 'auto-cleanup':
        provisioner.auto_cleanup_expired_environments()

if __name__ == '__main__':
    main()
```

## 2. Advanced Container Testing Patterns

### 2.1 Microservices Testing with Service Mesh

```yaml
# File: docker-compose.microservices.yml
# Advanced microservices testing with service mesh patterns

version: '3.8'

x-service-defaults: &service-defaults
  networks:
    - service-mesh
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
  restart: unless-stopped

x-envoy-config: &envoy-config
  image: envoyproxy/envoy:v1.25-latest
  networks:
    - service-mesh
  volumes:
    - ./envoy:/etc/envoy:ro

networks:
  service-mesh:
    driver: bridge
    ipam:
      config:
        - subnet: 172.25.0.0/16

services:
  # Service Discovery and Configuration
  consul:
    <<: *service-defaults
    image: consul:1.15
    ports:
      - "8500:8500"
    environment:
      CONSUL_BIND_INTERFACE: eth0
    volumes:
      - consul-data:/consul/data
    command: >
      consul agent -server -bootstrap-expect=1 -ui 
      -bind=0.0.0.0 -client=0.0.0.0 
      -data-dir=/consul/data

  # API Gateway with Envoy
  api-gateway:
    <<: *envoy-config
    ports:
      - "80:8080"
      - "9901:9901"  # Admin interface
    depends_on:
      - consul
    volumes:
      - ./envoy/gateway.yaml:/etc/envoy/envoy.yaml:ro
    environment:
      ENVOY_LOG_LEVEL: warn

  # User Service
  user-service:
    <<: *service-defaults
    build:
      context: ./services/user
      dockerfile: Dockerfile.test
      args:
        SERVICE_NAME: user-service
    environment:
      SERVICE_NAME: user-service
      SERVICE_PORT: 3001
      DATABASE_URL: postgresql://user:pass@user-db:5432/users
      CONSUL_URL: http://consul:8500
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      - user-db
      - consul
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  user-service-envoy:
    <<: *envoy-config
    volumes:
      - ./envoy/user-service.yaml:/etc/envoy/envoy.yaml:ro
    depends_on:
      - user-service

  user-db:
    <<: *service-defaults
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: users
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - user-db-data:/var/lib/postgresql/data
      - ./services/user/schema.sql:/docker-entrypoint-initdb.d/schema.sql:ro

  # Order Service
  order-service:
    <<: *service-defaults
    build:
      context: ./services/order
      dockerfile: Dockerfile.test
      args:
        SERVICE_NAME: order-service
    environment:
      SERVICE_NAME: order-service
      SERVICE_PORT: 3002
      DATABASE_URL: postgresql://order:pass@order-db:5432/orders
      USER_SERVICE_URL: http://user-service-envoy:8080
      CONSUL_URL: http://consul:8500
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      - order-db
      - consul
      - user-service
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  order-service-envoy:
    <<: *envoy-config
    volumes:
      - ./envoy/order-service.yaml:/etc/envoy/envoy.yaml:ro
    depends_on:
      - order-service

  order-db:
    <<: *service-defaults
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: orders
      POSTGRES_USER: order
      POSTGRES_PASSWORD: pass
    volumes:
      - order-db-data:/var/lib/postgresql/data
      - ./services/order/schema.sql:/docker-entrypoint-initdb.d/schema.sql:ro

  # Payment Service
  payment-service:
    <<: *service-defaults
    build:
      context: ./services/payment
      dockerfile: Dockerfile.test
      args:
        SERVICE_NAME: payment-service
    environment:
      SERVICE_NAME: payment-service
      SERVICE_PORT: 3003
      REDIS_URL: redis://payment-cache:6379
      ORDER_SERVICE_URL: http://order-service-envoy:8080
      CONSUL_URL: http://consul:8500
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      - payment-cache
      - consul
      - order-service
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  payment-service-envoy:
    <<: *envoy-config
    volumes:
      - ./envoy/payment-service.yaml:/etc/envoy/envoy.yaml:ro
    depends_on:
      - payment-service

  payment-cache:
    <<: *service-defaults
    image: redis:7-alpine
    volumes:
      - payment-cache-data:/data

  # Notification Service
  notification-service:
    <<: *service-defaults
    build:
      context: ./services/notification
      dockerfile: Dockerfile.test
      args:
        SERVICE_NAME: notification-service
    environment:
      SERVICE_NAME: notification-service
      SERVICE_PORT: 3004
      RABBITMQ_URL: amqp://guest:guest@message-queue:5672
      CONSUL_URL: http://consul:8500
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      - message-queue
      - consul
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3004/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  notification-service-envoy:
    <<: *envoy-config
    volumes:
      - ./envoy/notification-service.yaml:/etc/envoy/envoy.yaml:ro
    depends_on:
      - notification-service

  message-queue:
    <<: *service-defaults
    image: rabbitmq:3-management-alpine
    ports:
      - "15672:15672"  # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq

  # Observability Stack
  jaeger:
    <<: *service-defaults
    image: jaegertracing/all-in-one:1.45
    ports:
      - "16686:16686"  # Jaeger UI
      - "14268:14268"  # Jaeger collector
    environment:
      COLLECTOR_OTLP_ENABLED: true

  prometheus:
    <<: *service-defaults
    image: prom/prometheus:v2.42.0
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    <<: *service-defaults
    image: grafana/grafana:9.4.3
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana-dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./monitoring/grafana-datasources:/etc/grafana/provisioning/datasources:ro

  # Test Runners for Different Test Types
  contract-tests:
    <<: *service-defaults
    build:
      context: .
      dockerfile: docker/contract-test.Dockerfile
    environment:
      PACT_BROKER_URL: http://pact-broker:9292
      PACT_BROKER_USERNAME: pact
      PACT_BROKER_PASSWORD: pact
    volumes:
      - ./test-results/contract:/app/test-results
    depends_on:
      - pact-broker
    profiles:
      - contract-testing

  integration-tests:
    <<: *service-defaults
    build:
      context: .
      dockerfile: docker/integration-test.Dockerfile
    environment:
      API_GATEWAY_URL: http://api-gateway:8080
      TEST_TIMEOUT: 300000
    volumes:
      - ./test-results/integration:/app/test-results
    depends_on:
      - api-gateway
      - user-service
      - order-service
      - payment-service
      - notification-service
    profiles:
      - integration-testing

  e2e-tests:
    <<: *service-defaults
    build:
      context: .
      dockerfile: docker/e2e-test.Dockerfile
    environment:
      BASE_URL: http://api-gateway:8080
      HEADLESS: true
      BROWSER: chromium
    volumes:
      - ./test-results/e2e:/app/test-results
      - ./playwright-report:/app/playwright-report
    depends_on:
      - api-gateway
    profiles:
      - e2e-testing

  performance-tests:
    <<: *service-defaults
    build:
      context: .
      dockerfile: docker/performance-test.Dockerfile
    environment:
      TARGET_URL: http://api-gateway:8080
      VU_COUNT: 50
      DURATION: 5m
      RAMP_UP_TIME: 1m
    volumes:
      - ./test-results/performance:/app/test-results
    depends_on:
      - api-gateway
    profiles:
      - performance-testing

  chaos-tests:
    <<: *service-defaults
    build:
      context: .
      dockerfile: docker/chaos-test.Dockerfile
    environment:
      TARGET_SERVICES: user-service,order-service,payment-service
      CHAOS_DURATION: 300
      FAILURE_RATE: 0.1
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./test-results/chaos:/app/test-results
    depends_on:
      - user-service
      - order-service
      - payment-service
    profiles:
      - chaos-testing

  # Contract Testing Infrastructure
  pact-broker:
    <<: *service-defaults
    image: pactfoundation/pact-broker:2.106.0
    ports:
      - "9292:9292"
    environment:
      PACT_BROKER_DATABASE_URL: postgresql://pact:pact@pact-db:5432/pact_broker
      PACT_BROKER_BASIC_AUTH_USERNAME: pact
      PACT_BROKER_BASIC_AUTH_PASSWORD: pact
    depends_on:
      - pact-db

  pact-db:
    <<: *service-defaults
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pact_broker
      POSTGRES_USER: pact
      POSTGRES_PASSWORD: pact
    volumes:
      - pact-db-data:/var/lib/postgresql/data

volumes:
  consul-data:
  user-db-data:
  order-db-data:
  payment-cache-data:
  rabbitmq-data:
  prometheus-data:
  grafana-data:
  pact-db-data:
```

### 2.2 Advanced Testing Orchestration Script

```bash
#!/bin/bash
# File: scripts/advanced-test-orchestrator.sh
# Advanced orchestrator for microservices testing

set -euo pipefail

# Configuration
COMPOSE_FILE="docker-compose.microservices.yml"
TEST_TIMEOUT=3600  # 1 hour
PARALLEL_LIMIT=4
RETRY_COUNT=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test phases
declare -A TEST_PHASES=(
    ["infrastructure"]="consul jaeger prometheus grafana"
    ["databases"]="user-db order-db payment-cache message-queue pact-db"
    ["services"]="user-service order-service payment-service notification-service"
    ["gateways"]="api-gateway user-service-envoy order-service-envoy payment-service-envoy notification-service-envoy"
    ["support"]="pact-broker"
)

# Test suites
declare -A TEST_SUITES=(
    ["contract"]="contract-tests"
    ["integration"]="integration-tests"
    ["e2e"]="e2e-tests"
    ["performance"]="performance-tests"
    ["chaos"]="chaos-tests"
)

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

log_info() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}"
}

# Create test report directory
create_report_structure() {
    local timestamp=$(date +'%Y%m%d-%H%M%S')
    local report_dir="test-reports/$timestamp"
    
    mkdir -p "$report_dir"/{logs,results,metrics,artifacts}
    
    echo "$report_dir"
}

# Health check for services
check_service_health() {
    local service=$1
    local timeout=${2:-60}
    local interval=5
    local count=0
    
    log_info "Checking health of $service..."
    
    while [ $count -lt $timeout ]; do
        if docker-compose -f $COMPOSE_FILE ps --services --filter "status=running" | grep -q "^$service$"; then
            # Check if service has health check
            local health_status=$(docker-compose -f $COMPOSE_FILE ps --format "table {{.Service}}\t{{.Status}}" | grep "^$service" | awk '{print $2}')
            
            if [[ "$health_status" == *"healthy"* ]] || [[ "$health_status" == *"Up"* ]]; then
                log_success "$service is healthy"
                return 0
            fi
        fi
        
        sleep $interval
        count=$((count + interval))
        
        if [ $((count % 20)) -eq 0 ]; then
            log_info "Still waiting for $service... ($count/$timeout seconds)"
        fi
    done
    
    log_error "$service failed to become healthy within $timeout seconds"
    return 1
}

# Start services in phases
start_services_phased() {
    for phase in infrastructure databases services gateways support; do
        log "Starting $phase phase..."
        
        local services=(${TEST_PHASES[$phase]})
        
        # Start services in the phase
        for service in "${services[@]}"; do
            log_info "Starting $service..."
            
            if ! docker-compose -f $COMPOSE_FILE up -d "$service"; then
                log_error "Failed to start $service"
                return 1
            fi
        done
        
        # Wait for all services in the phase to be healthy
        for service in "${services[@]}"; do
            if ! check_service_health "$service" 120; then
                log_error "Service $service failed health check"
                return 1
            fi
        done
        
        log_success "Phase $phase completed successfully"
        sleep 5  # Brief pause between phases
    done
    
    log_success "All services started successfully"
}

# Run test suite with retry logic
run_test_suite() {
    local test_type=$1
    local service_name=${TEST_SUITES[$test_type]}
    local report_dir=$2
    local attempt=1
    
    while [ $attempt -le $RETRY_COUNT ]; do
        log "Running $test_type tests (attempt $attempt/$RETRY_COUNT)..."
        
        # Start the test service
        if docker-compose -f $COMPOSE_FILE --profile "${test_type}-testing" up --build -d "$service_name"; then
            
            # Monitor test execution
            local container_id=$(docker-compose -f $COMPOSE_FILE ps -q "$service_name")
            local start_time=$(date +%s)
            
            # Wait for test completion with timeout
            if timeout $TEST_TIMEOUT docker wait "$container_id" > /dev/null 2>&1; then
                local end_time=$(date +%s)
                local duration=$((end_time - start_time))
                
                # Check exit code
                local exit_code=$(docker inspect "$container_id" --format='{{.State.ExitCode}}')
                
                if [ "$exit_code" -eq 0 ]; then
                    log_success "$test_type tests passed in ${duration}s"
                    
                    # Collect test artifacts
                    collect_test_artifacts "$service_name" "$test_type" "$report_dir"
                    
                    return 0
                else
                    log_error "$test_type tests failed with exit code $exit_code"
                fi
            else
                log_error "$test_type tests timed out after $TEST_TIMEOUT seconds"
                docker-compose -f $COMPOSE_FILE kill "$service_name"
            fi
            
            # Collect logs for failed attempts
            docker-compose -f $COMPOSE_FILE logs "$service_name" > "$report_dir/logs/${test_type}-attempt-${attempt}.log" 2>&1
            
            # Stop the test service
            docker-compose -f $COMPOSE_FILE stop "$service_name"
            docker-compose -f $COMPOSE_FILE rm -f "$service_name"
        else
            log_error "Failed to start $test_type test service"
        fi
        
        attempt=$((attempt + 1))
        
        if [ $attempt -le $RETRY_COUNT ]; then
            log_warning "Retrying $test_type tests in 30 seconds..."
            sleep 30
        fi
    done
    
    log_error "$test_type tests failed after $RETRY_COUNT attempts"
    return 1
}

# Collect test artifacts
collect_test_artifacts() {
    local service_name=$1
    local test_type=$2
    local report_dir=$3
    
    log_info "Collecting artifacts for $test_type tests..."
    
    # Copy test results
    docker cp "$(docker-compose -f $COMPOSE_FILE ps -q "$service_name"):/app/test-results/" "$report_dir/results/${test_type}/" 2>/dev/null || true
    
    # Copy coverage reports
    docker cp "$(docker-compose -f $COMPOSE_FILE ps -q "$service_name"):/app/coverage/" "$report_dir/artifacts/${test_type}/" 2>/dev/null || true
    
    # Copy test reports
    docker cp "$(docker-compose -f $COMPOSE_FILE ps -q "$service_name"):/app/playwright-report/" "$report_dir/artifacts/${test_type}/playwright/" 2>/dev/null || true
    
    # Collect service logs
    docker-compose -f $COMPOSE_FILE logs "$service_name" > "$report_dir/logs/${test_type}-service.log" 2>&1
}

# Collect system metrics
collect_system_metrics() {
    local report_dir=$1
    
    log_info "Collecting system metrics..."
    
    # Docker stats
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" > "$report_dir/metrics/docker-stats.txt"
    
    # Prometheus metrics (if available)
    if curl -s http://localhost:9090/api/v1/query?query=up > /dev/null 2>&1; then
        curl -s "http://localhost:9090/api/v1/query?query=up" > "$report_dir/metrics/prometheus-up.json"
        curl -s "http://localhost:9090/api/v1/query?query=container_memory_usage_bytes" > "$report_dir/metrics/memory-usage.json"
        curl -s "http://localhost:9090/api/v1/query?query=rate(container_cpu_usage_seconds_total[5m])" > "$report_dir/metrics/cpu-usage.json"
    fi
    
    # Jaeger traces (if available)
    if curl -s http://localhost:16686/api/traces > /dev/null 2>&1; then
        curl -s "http://localhost:16686/api/traces?service=user-service&limit=100" > "$report_dir/metrics/user-service-traces.json"
        curl -s "http://localhost:16686/api/traces?service=order-service&limit=100" > "$report_dir/metrics/order-service-traces.json"
        curl -s "http://localhost:16686/api/traces?service=payment-service&limit=100" > "$report_dir/metrics/payment-service-traces.json"
    fi
}

# Generate comprehensive test report
generate_test_report() {
    local report_dir=$1
    local test_results=$2
    
    log_info "Generating comprehensive test report..."
    
    cat > "$report_dir/test-summary.md" << EOF
# Microservices Testing Report

Generated: $(date +'%Y-%m-%d %H:%M:%S')
Environment: Containerized Microservices
Architecture: Service Mesh with Envoy

## Test Results Summary

EOF

    # Add test results
    for test_type in "${!test_results[@]}"; do
        local result=${test_results[$test_type]}
        local status_icon="❌"
        
        if [ "$result" = "0" ]; then
            status_icon="✅"
        fi
        
        echo "- $status_icon **$test_type**: $([ "$result" = "0" ] && echo "PASSED" || echo "FAILED")" >> "$report_dir/test-summary.md"
    done
    
    cat >> "$report_dir/test-summary.md" << EOF

## Service Architecture

### Core Services
- **User Service**: User management and authentication
- **Order Service**: Order processing and management
- **Payment Service**: Payment processing
- **Notification Service**: Event-driven notifications

### Infrastructure
- **API Gateway**: Envoy-based traffic routing
- **Service Discovery**: Consul for service registration
- **Observability**: Jaeger tracing, Prometheus metrics, Grafana dashboards
- **Message Queue**: RabbitMQ for async communication

### Databases
- **PostgreSQL**: User and order data persistence
- **Redis**: Payment service caching
- **Pact Broker**: Contract testing coordination

## Test Coverage

### Contract Tests
- Service-to-service contract verification
- Consumer-driven contract testing with Pact
- API compatibility validation

### Integration Tests
- Cross-service communication testing
- Database integration verification
- Message queue integration testing

### End-to-End Tests
- Full user journey validation
- UI and API integration testing
- Cross-browser compatibility

### Performance Tests
- Load testing under realistic conditions
- Service mesh performance validation
- Resource usage optimization

### Chaos Tests
- Service resilience validation
- Failure scenario testing
- Recovery time measurement

## Artifacts

- Test Results: \`results/\`
- Service Logs: \`logs/\`
- System Metrics: \`metrics/\`
- Coverage Reports: \`artifacts/\`

EOF

    log_success "Test report generated: $report_dir/test-summary.md"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up test environment..."
    
    # Stop all services
    docker-compose -f $COMPOSE_FILE down --volumes --remove-orphans || true
    
    # Clean up unused images and volumes
    docker system prune -f || true
}

# Main execution function
main() {
    local test_mode=${1:-"all"}
    local report_dir
    
    # Set up signal handlers
    trap cleanup EXIT INT TERM
    
    log "Starting Advanced Microservices Testing"
    log "Test mode: $test_mode"
    
    # Create report structure
    report_dir=$(create_report_structure)
    log_info "Report directory: $report_dir"
    
    # Start services in phases
    if ! start_services_phased; then
        log_error "Failed to start services"
        exit 1
    fi
    
    # Collect initial system metrics
    collect_system_metrics "$report_dir"
    
    # Run tests based on mode
    declare -A test_results
    
    case $test_mode in
        "contract")
            run_test_suite "contract" "$report_dir"
            test_results["contract"]=$?
            ;;
        "integration")
            run_test_suite "integration" "$report_dir"
            test_results["integration"]=$?
            ;;
        "e2e")
            run_test_suite "e2e" "$report_dir"
            test_results["e2e"]=$?
            ;;
        "performance")
            run_test_suite "performance" "$report_dir"
            test_results["performance"]=$?
            ;;
        "chaos")
            run_test_suite "chaos" "$report_dir"
            test_results["chaos"]=$?
            ;;
        "all")
            for test_type in contract integration e2e performance; do
                run_test_suite "$test_type" "$report_dir"
                test_results["$test_type"]=$?
            done
            ;;
        "full")
            for test_type in "${!TEST_SUITES[@]}"; do
                run_test_suite "$test_type" "$report_dir"
                test_results["$test_type"]=$?
            done
            ;;
        *)
            log_error "Unknown test mode: $test_mode"
            echo "Available modes: contract, integration, e2e, performance, chaos, all, full"
            exit 1
            ;;
    esac
    
    # Collect final system metrics
    collect_system_metrics "$report_dir"
    
    # Generate comprehensive report
    generate_test_report "$report_dir" "$(declare -p test_results)"
    
    # Calculate overall result
    local overall_result=0
    for result in "${test_results[@]}"; do
        if [ "$result" -ne 0 ]; then
            overall_result=1
            break
        fi
    done
    
    if [ $overall_result -eq 0 ]; then
        log_success "All tests passed successfully!"
    else
        log_error "Some tests failed. Check the report for details."
    fi
    
    log_info "Test execution completed. Report available at: $report_dir"
    
    exit $overall_result
}

# Help function
show_help() {
    cat << EOF
Advanced Microservices Test Orchestrator

Usage: $0 [test_mode]

Test Modes:
  contract     Run contract tests only
  integration  Run integration tests only
  e2e          Run end-to-end tests only
  performance  Run performance tests only
  chaos        Run chaos engineering tests only
  all          Run contract, integration, e2e, and performance tests
  full         Run all available test types including chaos tests

Examples:
  $0 contract      # Run contract tests
  $0 all          # Run main test suite
  $0 full         # Run complete test suite including chaos tests

Environment Variables:
  TEST_TIMEOUT     Test timeout in seconds (default: 3600)
  PARALLEL_LIMIT   Maximum parallel test processes (default: 4)
  RETRY_COUNT      Number of retry attempts for failed tests (default: 3)

EOF
}

# Script entry point
if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

main "$@"
```

## 3. Container Performance Optimization

### 3.1 Intelligent Resource Management

```yaml
# File: docker-compose.optimized.yml
# Performance-optimized container configuration

version: '3.8'

x-performance-config: &performance-config
  deploy:
    resources:
      limits:
        cpus: '${CPU_LIMIT:-1.0}'
        memory: '${MEMORY_LIMIT:-1G}'
      reservations:
        cpus: '${CPU_RESERVATION:-0.25}'
        memory: '${MEMORY_RESERVATION:-256M}'
  logging:
    driver: "json-file"
    options:
      max-size: "50m"
      max-file: "3"
  restart: unless-stopped

x-cache-config: &cache-config
  volumes:
    - type: tmpfs
      target: /tmp
      tmpfs:
        size: 512M
    - type: bind
      source: /var/cache/docker-build
      target: /cache
      bind:
        propagation: shared

services:
  # Optimized application service
  app:
    <<: *performance-config
    build:
      context: .
      dockerfile: docker/optimized.Dockerfile
      cache_from:
        - ${REGISTRY}/${IMAGE_NAME}:cache
      args:
        - BUILDKIT_INLINE_CACHE=1
        - NODE_ENV=production
    environment:
      # Node.js optimizations
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=1024 --optimize-for-size
      - UV_THREADPOOL_SIZE=16
      
      # Application optimizations
      - LOG_LEVEL=warn
      - CACHE_TTL=3600
      - CONNECTION_POOL_SIZE=20
      
      # Performance monitoring
      - ENABLE_PROFILING=true
      - METRICS_ENABLED=true
    volumes:
      <<: *cache-config
    networks:
      - optimized-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s

  # Optimized database
  postgres:
    <<: *performance-config
    image: postgres:15-alpine
    environment:
      # PostgreSQL performance tuning
      - POSTGRES_DB=testdb
      - POSTGRES_USER=test
      - POSTGRES_PASSWORD=test
      - POSTGRES_SHARED_BUFFERS=256MB
      - POSTGRES_EFFECTIVE_CACHE_SIZE=1GB
      - POSTGRES_WORK_MEM=32MB
      - POSTGRES_MAINTENANCE_WORK_MEM=256MB
      - POSTGRES_WAL_BUFFERS=16MB
      - POSTGRES_CHECKPOINT_COMPLETION_TARGET=0.9
      - POSTGRES_RANDOM_PAGE_COST=1.1
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf:ro
    command: >
      postgres
      -c config_file=/etc/postgresql/postgresql.conf
      -c shared_preload_libraries=pg_stat_statements
      -c pg_stat_statements.track=all
    networks:
      - optimized-network

  # Optimized Redis
  redis:
    <<: *performance-config
    image: redis:7-alpine
    command: >
      redis-server
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
      --tcp-keepalive 60
      --timeout 300
      --tcp-backlog 511
      --databases 1
      --save ""
      --appendonly no
    volumes:
      - redis-data:/data
    networks:
      - optimized-network

  # Performance test runner
  performance-tests:
    <<: *performance-config
    build:
      context: .
      dockerfile: docker/performance-test.Dockerfile
      cache_from:
        - ${REGISTRY}/${IMAGE_NAME}:performance-cache
    environment:
      - TARGET_URL=http://app:3000
      - VIRTUAL_USERS=${VU_COUNT:-50}
      - DURATION=${TEST_DURATION:-5m}
      - RAMP_UP_TIME=${RAMP_UP:-1m}
      - THRESHOLDS_P95=${P95_THRESHOLD:-500}
      - THRESHOLDS_ERROR_RATE=${ERROR_RATE_THRESHOLD:-0.1}
    volumes:
      - ./test-results/performance:/app/results
      - /sys/fs/cgroup:/sys/fs/cgroup:ro
    depends_on:
      - app
      - postgres
      - redis
    networks:
      - optimized-network
    profiles:
      - performance-testing

  # Resource monitor
  resource-monitor:
    image: prom/node-exporter:v1.5.0
    <<: *performance-config
    command:
      - '--path.rootfs=/host'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    volumes:
      - /:/host:ro,rslave
      - ./monitoring/metrics:/metrics
    networks:
      - optimized-network
    profiles:
      - monitoring

  # Performance analyzer
  performance-analyzer:
    build:
      context: ./monitoring
      dockerfile: Dockerfile.analyzer
    <<: *performance-config
    environment:
      - PROMETHEUS_URL=http://prometheus:9090
      - GRAFANA_URL=http://grafana:3000
      - ANALYSIS_INTERVAL=30s
    volumes:
      - ./test-results/analysis:/app/analysis
    depends_on:
      - resource-monitor
    networks:
      - optimized-network
    profiles:
      - analysis

networks:
  optimized-network:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: optimized-br0
      com.docker.network.driver.mtu: 1500

volumes:
  postgres-data:
    driver: local
    driver_opts:
      type: tmpfs
      device: tmpfs
      o: size=1G,uid=999,gid=999
  redis-data:
    driver: local
    driver_opts:
      type: tmpfs
      device: tmpfs
      o: size=512M,uid=999,gid=999
```

### 3.2 Advanced Caching Strategy

```dockerfile
# File: docker/optimized.Dockerfile
# Multi-layer caching optimization for maximum performance

# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS base

# Install system dependencies with cache mount
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache \
    ca-certificates \
    curl \
    dumb-init \
    && update-ca-certificates

# Create optimized user and directories
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser && \
    mkdir -p /app /cache /tmp/app && \
    chown -R appuser:appuser /app /cache /tmp/app

WORKDIR /app
USER appuser

# Dependencies stage with advanced caching
FROM base AS deps

# Copy package files for dependency resolution
COPY --chown=appuser:appuser package*.json ./

# Install dependencies with multi-layer caching
RUN --mount=type=cache,target=/home/appuser/.npm,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/node_modules/.cache,uid=1001,gid=1001 \
    npm ci --prefer-offline --no-audit --cache /home/appuser/.npm && \
    npm cache clean --force

# Development dependencies stage
FROM deps AS dev-deps
RUN --mount=type=cache,target=/home/appuser/.npm,uid=1001,gid=1001 \
    npm ci --cache /home/appuser/.npm && \
    npm cache clean --force

# Source preparation stage
FROM dev-deps AS source
COPY --chown=appuser:appuser . .

# Build stage with caching
FROM source AS builder
RUN --mount=type=cache,target=/app/.next/cache,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/dist,uid=1001,gid=1001 \
    --mount=type=cache,target=/tmp,uid=1001,gid=1001 \
    npm run build

# Test preparation stage
FROM builder AS test-prep

# Pre-compile test assets
RUN --mount=type=cache,target=/app/coverage,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/test-results,uid=1001,gid=1001 \
    npm run lint && \
    npm run typecheck

# Unit test stage
FROM test-prep AS unit-tests

ENV NODE_ENV=test \
    NODE_OPTIONS="--max-old-space-size=1024" \
    JEST_WORKERS=50%

# Optimize test execution
RUN mkdir -p /app/test-results /app/coverage && \
    chown -R appuser:appuser /app/test-results /app/coverage

CMD ["npm", "run", "test:unit", "--", "--ci", "--maxWorkers=50%", "--cache"]

# Integration test stage
FROM test-prep AS integration-tests

ENV NODE_ENV=integration \
    NODE_OPTIONS="--max-old-space-size=1536"

CMD ["npm", "run", "test:integration", "--", "--ci"]

# E2E test stage
FROM test-prep AS e2e-tests

# Install browsers with caching
RUN --mount=type=cache,target=/home/appuser/.cache/ms-playwright,uid=1001,gid=1001 \
    npx playwright install --with-deps chromium

ENV NODE_ENV=e2e \
    HEADLESS=true \
    BROWSER=chromium

CMD ["npm", "run", "test:e2e"]

# Performance test stage
FROM test-prep AS performance-tests

# Install performance testing tools
RUN --mount=type=cache,target=/home/appuser/.npm,uid=1001,gid=1001 \
    npm install -g k6 artillery && \
    npm cache clean --force

ENV NODE_ENV=performance

CMD ["npm", "run", "test:performance"]

# Production stage
FROM base AS production

# Copy production artifacts
COPY --from=builder --chown=appuser:appuser /app/dist ./dist
COPY --from=deps --chown=appuser:appuser /app/node_modules ./node_modules
COPY --chown=appuser:appuser package.json ./

# Production optimizations
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=512 --optimize-for-size" \
    UV_THREADPOOL_SIZE=4

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

## 4. Container Security Integration

### 4.1 Security Scanning Pipeline

```yaml
# File: .github/workflows/container-security.yml
name: Container Security Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Build secure container images
  build-secure-images:
    runs-on: ubuntu-latest
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

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
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push secure image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/secure.Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  # Vulnerability scanning
  vulnerability-scan:
    runs-on: ubuntu-latest
    needs: build-secure-images
    permissions:
      security-events: write
    strategy:
      matrix:
        scanner: [trivy, grype, snyk]
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        if: matrix.scanner == 'trivy'
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build-secure-images.outputs.image-tag }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Run Grype vulnerability scanner
        if: matrix.scanner == 'grype'
        run: |
          curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
          grype ${{ needs.build-secure-images.outputs.image-tag }} -o sarif > grype-results.sarif

      - name: Run Snyk vulnerability scanner
        if: matrix.scanner == 'snyk'
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: |
          npm install -g snyk
          snyk container test ${{ needs.build-secure-images.outputs.image-tag }} --severity-threshold=high --json > snyk-results.json

      - name: Upload scan results to GitHub Security tab
        if: matrix.scanner != 'snyk'
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: '${{ matrix.scanner }}-results.sarif'

      - name: Upload scan artifacts
        uses: actions/upload-artifact@v4
        with:
          name: security-scan-${{ matrix.scanner }}
          path: |
            *-results.*

  # Container configuration security
  container-config-security:
    runs-on: ubuntu-latest
    needs: build-secure-images
    steps:
      - uses: actions/checkout@v4

      - name: Install security tools
        run: |
          # Install hadolint for Dockerfile security
          wget -O hadolint https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64
          chmod +x hadolint
          sudo mv hadolint /usr/local/bin/
          
          # Install conftest for policy checking
          wget -O conftest.tar.gz https://github.com/open-policy-agent/conftest/releases/latest/download/conftest_0.46.0_Linux_x86_64.tar.gz
          tar xzf conftest.tar.gz
          sudo mv conftest /usr/local/bin/

      - name: Lint Dockerfiles
        run: |
          find . -name "Dockerfile*" -exec hadolint {} \; > hadolint-results.txt || true

      - name: Check Docker Compose security
        run: |
          conftest verify --policy policies/docker-compose-security.rego docker-compose*.yml > conftest-results.txt || true

      - name: Run Docker Bench Security
        run: |
          docker run --rm --net host --pid host --userns host --cap-add audit_control \
            -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
            -v /var/lib:/var/lib:ro \
            -v /var/run/docker.sock:/var/run/docker.sock:ro \
            -v /usr/lib/systemd:/usr/lib/systemd:ro \
            -v /etc:/etc:ro \
            --label docker_bench_security \
            docker/docker-bench-security > docker-bench-results.txt || true

      - name: Upload configuration security results
        uses: actions/upload-artifact@v4
        with:
          name: config-security-results
          path: |
            hadolint-results.txt
            conftest-results.txt
            docker-bench-results.txt

  # Runtime security testing
  runtime-security-tests:
    runs-on: ubuntu-latest
    needs: build-secure-images
    steps:
      - uses: actions/checkout@v4

      - name: Pull test image
        run: |
          docker pull ${{ needs.build-secure-images.outputs.image-tag }}
          docker tag ${{ needs.build-secure-images.outputs.image-tag }} app:security-test

      - name: Start security test environment
        run: |
          docker-compose -f docker-compose.security.yml up -d
          
          # Wait for services to be ready
          timeout 300 bash -c '
            until docker-compose -f docker-compose.security.yml ps | grep -q "healthy\|Up"; do
              echo "Waiting for services..."
              sleep 5
            done
          '

      - name: Run OWASP ZAP security tests
        run: |
          mkdir -p security-reports
          
          docker run --rm --network container \
            -v $(pwd)/security-reports:/zap/wrk:rw \
            owasp/zap2docker-stable:latest \
            zap-baseline.py -t http://app:3000 \
            -J /zap/wrk/zap-report.json \
            -r /zap/wrk/zap-report.html \
            || true

      - name: Run container escape tests
        run: |
          # Test container security boundaries
          docker run --rm --network container app:security-test \
            sh -c '
              # Test file system permissions
              echo "Testing file system security..."
              [ ! -w /etc/passwd ] && echo "✓ /etc/passwd is read-only" || echo "✗ /etc/passwd is writable"
              
              # Test process isolation
              echo "Testing process isolation..."
              ps aux | grep -v grep | grep -q "^root" && echo "✗ Root processes visible" || echo "✓ Process isolation working"
              
              # Test network security
              echo "Testing network security..."
              nc -z localhost 22 && echo "✗ SSH accessible" || echo "✓ SSH not accessible"
            ' > security-test-results.txt

      - name: Cleanup security test environment
        if: always()
        run: |
          docker-compose -f docker-compose.security.yml down --volumes

      - name: Upload runtime security results
        uses: actions/upload-artifact@v4
        with:
          name: runtime-security-results
          path: |
            security-reports/
            security-test-results.txt

  # Security report aggregation
  security-report:
    runs-on: ubuntu-latest
    needs: [vulnerability-scan, container-config-security, runtime-security-tests]
    if: always()
    steps:
      - uses: actions/checkout@v4

      - name: Download all security artifacts
        uses: actions/download-artifact@v4
        with:
          path: security-artifacts/

      - name: Generate security summary
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = require('path');
            
            // Aggregate security results
            const securitySummary = {
              vulnerabilities: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
              },
              configurationIssues: 0,
              runtimeSecurityTests: 'unknown'
            };
            
            // Process vulnerability scan results
            const scanResults = ['trivy', 'grype', 'snyk'];
            
            for (const scanner of scanResults) {
              const scanDir = `security-artifacts/security-scan-${scanner}`;
              
              if (fs.existsSync(scanDir)) {
                const files = fs.readdirSync(scanDir);
                
                for (const file of files) {
                  if (file.endsWith('.sarif')) {
                    try {
                      const sarifContent = fs.readFileSync(path.join(scanDir, file), 'utf8');
                      const sarif = JSON.parse(sarifContent);
                      
                      // Extract vulnerability counts from SARIF
                      if (sarif.runs && sarif.runs[0] && sarif.runs[0].results) {
                        for (const result of sarif.runs[0].results) {
                          const level = result.level || 'info';
                          
                          switch (level) {
                            case 'error':
                              securitySummary.vulnerabilities.critical++;
                              break;
                            case 'warning':
                              securitySummary.vulnerabilities.high++;
                              break;
                            case 'note':
                              securitySummary.vulnerabilities.medium++;
                              break;
                            default:
                              securitySummary.vulnerabilities.low++;
                          }
                        }
                      }
                    } catch (error) {
                      core.warning(`Failed to parse SARIF file ${file}: ${error.message}`);
                    }
                  }
                }
              }
            }
            
            // Check runtime security test results
            const runtimeResultsFile = 'security-artifacts/runtime-security-results/security-test-results.txt';
            
            if (fs.existsSync(runtimeResultsFile)) {
              const runtimeResults = fs.readFileSync(runtimeResultsFile, 'utf8');
              securitySummary.runtimeSecurityTests = runtimeResults.includes('✗') ? 'failed' : 'passed';
            }
            
            // Generate summary report
            core.summary.addHeading('🔒 Container Security Report');
            
            core.summary.addTable([
              ['Security Aspect', 'Status', 'Details'],
              ['Critical Vulnerabilities', securitySummary.vulnerabilities.critical === 0 ? '✅' : '❌', `${securitySummary.vulnerabilities.critical} found`],
              ['High Vulnerabilities', securitySummary.vulnerabilities.high <= 5 ? '✅' : '⚠️', `${securitySummary.vulnerabilities.high} found`],
              ['Runtime Security', securitySummary.runtimeSecurityTests === 'passed' ? '✅' : '❌', securitySummary.runtimeSecurityTests],
            ]);
            
            const totalVulns = Object.values(securitySummary.vulnerabilities).reduce((a, b) => a + b, 0);
            
            if (totalVulns === 0 && securitySummary.runtimeSecurityTests === 'passed') {
              core.summary.addRaw('\n## ✅ Security Assessment: PASSED\n\nNo critical security issues found. Container is secure for deployment.');
            } else {
              core.summary.addRaw('\n## ❌ Security Assessment: REVIEW REQUIRED\n\nSecurity issues detected. Please review and address before deployment.');
            }
            
            await core.summary.write();
            
            // Set output for subsequent jobs
            core.setOutput('security-status', totalVulns === 0 && securitySummary.runtimeSecurityTests === 'passed' ? 'passed' : 'failed');

      - name: Upload comprehensive security report
        uses: actions/upload-artifact@v4
        with:
          name: comprehensive-security-report
          path: security-artifacts/
```

## 5. Practical Exercise: Enterprise Container Testing Pipeline

### Exercise Overview

Design and implement a complete enterprise-grade containerized testing pipeline that demonstrates advanced CI/CD patterns, security integration, and performance optimization.

### Requirements

1. **Multi-Service Architecture**: Create a microservices-based application with at least 4 services
2. **Advanced Orchestration**: Implement intelligent test orchestration with dynamic environment provisioning
3. **Security Integration**: Include comprehensive security scanning and compliance checking
4. **Performance Optimization**: Demonstrate advanced caching, resource management, and optimization techniques
5. **Observability**: Implement comprehensive monitoring, logging, and tracing
6. **Production Readiness**: Include deployment readiness assessment and automated quality gates

### Implementation Steps

1. **Design Microservices Architecture**: Create service specifications and dependencies
2. **Implement Container Orchestration**: Build Docker Compose configurations for different environments
3. **Create Advanced Dockerfiles**: Implement multi-stage builds with optimization and security
4. **Build CI/CD Pipeline**: Create GitHub Actions workflow with intelligent test matrix
5. **Integrate Security Scanning**: Add multiple security scanners and compliance checks
6. **Implement Performance Testing**: Create performance benchmarks and optimization strategies
7. **Add Observability**: Implement comprehensive monitoring and alerting
8. **Create Quality Gates**: Build automated deployment readiness assessment

### Success Criteria

- All services start successfully with proper health checks
- Intelligent test matrix executes based on code changes
- Security scans pass with no critical vulnerabilities
- Performance tests meet defined thresholds
- Comprehensive observability provides actionable insights
- Quality gates accurately assess deployment readiness
- Pipeline completes in under 30 minutes for full test suite

## Assessment

### Knowledge Check

1. **Container Orchestration Strategy**: Design a containerized testing strategy for a microservices application with 8 services, including dependency management and failure handling.

2. **Performance Optimization**: Analyze a slow-running containerized CI/CD pipeline and propose specific optimization strategies with expected performance improvements.

3. **Security Integration**: Describe how you would implement comprehensive container security in a CI/CD pipeline, including scanning, compliance, and runtime security.

4. **Dynamic Environment Provisioning**: Explain how you would design a system that automatically provisions optimal test environments based on code changes and testing requirements.

### Practical Assessment

Create a complete enterprise-grade containerized testing solution that includes:
- Multi-service microservices architecture with service mesh
- Intelligent test orchestration with dynamic provisioning
- Comprehensive security scanning and compliance
- Advanced performance optimization and monitoring
- Production-ready CI/CD pipeline integration
- Automated quality gates and deployment readiness assessment

The solution should demonstrate enterprise-level containerization expertise and advanced DevOps practices.

## Summary

This lesson covered advanced containerized testing in CI/CD pipelines:

1. **Advanced Container Orchestration**: Learned to design sophisticated CI/CD pipelines that intelligently orchestrate containerized testing environments with dynamic provisioning and resource optimization.

2. **Microservices Testing Patterns**: Implemented comprehensive testing strategies for complex microservices architectures using service mesh patterns and advanced orchestration.

3. **Performance Optimization**: Applied enterprise-level optimization techniques including intelligent caching, resource management, and performance monitoring.

4. **Security Integration**: Integrated comprehensive container security including vulnerability scanning, configuration compliance, and runtime security testing.

5. **Dynamic Environment Management**: Created systems for automatic provisioning and management of containerized test environments based on code changes and testing requirements.

6. **Production Readiness Assessment**: Implemented automated quality gates and deployment readiness assessment for enterprise-grade software delivery.

These patterns provide the foundation for building scalable, secure, and efficient containerized testing infrastructure that can handle enterprise-level complexity and requirements.

## Next Steps

In the next lesson, we'll explore parallel execution strategies and pipeline optimization techniques that build on these containerized testing patterns to achieve maximum efficiency and reliability in CI/CD pipelines.

## Further Reading

- [Docker Best Practices for CI/CD](https://docs.docker.com/ci-cd/best-practices/)
- [Kubernetes Testing Strategies](https://kubernetes.io/docs/concepts/testing/)
- [Container Security Best Practices](https://docs.docker.com/engine/security/)
- [Service Mesh Testing Patterns](https://istio.io/latest/docs/tasks/observability/distributed-tracing/)
- [Microservices Testing Strategies](https://martinfowler.com/articles/microservice-testing/)