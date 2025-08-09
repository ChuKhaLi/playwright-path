/**
 * Deployment Controller
 * Advanced deployment orchestration system for CI/CD pipelines
 * Supports blue-green deployments, canary releases, and automated rollbacks
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

// Types and interfaces
interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  strategy: 'rolling' | 'blue-green' | 'canary';
  application: {
    name: string;
    version: string;
    image?: string;
    healthCheckUrl: string;
    readinessProbe: string;
  };
  deployment: {
    replicas: number;
    maxUnavailable: number;
    maxSurge: number;
    timeout: number;
    rollbackOnFailure: boolean;
  };
  monitoring: {
    healthCheckInterval: number;
    healthCheckTimeout: number;
    maxFailedChecks: number;
    monitoringDuration: number;
  };
  notifications: {
    slack?: {
      webhook: string;
      channel: string;
    };
    email?: {
      recipients: string[];
      smtp: any;
    };
  };
}

interface DeploymentStatus {
  id: string;
  environment: string;
  strategy: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'rolling-back' | 'rolled-back';
  startTime: Date;
  endTime?: Date;
  currentPhase: string;
  progress: number;
  healthChecks: HealthCheckResult[];
  errors: string[];
  rollbackReason?: string;
}

interface HealthCheckResult {
  timestamp: Date;
  url: string;
  responseTime: number;
  statusCode: number;
  healthy: boolean;
  error?: string;
}

class DeploymentController extends EventEmitter {
  private config: DeploymentConfig;
  private status: DeploymentStatus;
  private healthCheckInterval?: NodeJS.Timeout;
  private rollbackInProgress = false;

  constructor(config: DeploymentConfig) {
    super();
    this.config = config;
    this.status = this.initializeStatus();
    this.setupEventHandlers();
  }

  /**
   * Initialize deployment status
   */
  private initializeStatus(): DeploymentStatus {
    return {
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      environment: this.config.environment,
      strategy: this.config.strategy,
      status: 'pending',
      startTime: new Date(),
      currentPhase: 'initializing',
      progress: 0,
      healthChecks: [],
      errors: []
    };
  }

  /**
   * Setup event handlers for logging and notifications
   */
  private setupEventHandlers(): void {
    this.on('deployment:started', (status) => {
      console.log(`🚀 Deployment started: ${status.id}`);
      console.log(`   Environment: ${status.environment}`);
      console.log(`   Strategy: ${status.strategy}`);
      console.log(`   Application: ${this.config.application.name}@${this.config.application.version}`);
    });

    this.on('deployment:progress', (status) => {
      console.log(`📈 Deployment progress: ${status.progress}% - ${status.currentPhase}`);
    });

    this.on('deployment:completed', (status) => {
      console.log(`✅ Deployment completed successfully: ${status.id}`);
      console.log(`   Duration: ${this.getDeploymentDuration(status)}ms`);
      this.sendNotification('success', 'Deployment completed successfully');
    });

    this.on('deployment:failed', (status) => {
      console.error(`❌ Deployment failed: ${status.id}`);
      console.error(`   Errors: ${status.errors.join(', ')}`);
      this.sendNotification('error', `Deployment failed: ${status.errors.join(', ')}`);
    });

    this.on('deployment:rollback', (status) => {
      console.warn(`🔄 Rolling back deployment: ${status.id}`);
      console.warn(`   Reason: ${status.rollbackReason}`);
      this.sendNotification('warning', `Deployment rollback initiated: ${status.rollbackReason}`);
    });
  }

  /**
   * Start the deployment process
   */
  async deploy(): Promise<DeploymentStatus> {
    try {
      this.status.status = 'in-progress';
      this.status.startTime = new Date();
      this.emit('deployment:started', this.status);

      // Pre-deployment validation
      await this.validatePrerequisites();
      this.updateProgress('Prerequisites validated', 10);

      // Execute deployment strategy
      switch (this.config.strategy) {
        case 'blue-green':
          await this.executeBlueGreenDeployment();
          break;
        case 'canary':
          await this.executeCanaryDeployment();
          break;
        case 'rolling':
          await this.executeRollingDeployment();
          break;
        default:
          throw new Error(`Unsupported deployment strategy: ${this.config.strategy}`);
      }

      // Post-deployment validation
      await this.validateDeployment();
      this.updateProgress('Deployment completed', 100);

      this.status.status = 'completed';
      this.status.endTime = new Date();
      this.emit('deployment:completed', this.status);

      return this.status;

    } catch (error) {
      await this.handleDeploymentFailure(error as Error);
      throw error;
    }
  }

  /**
   * Validate deployment prerequisites
   */
  private async validatePrerequisites(): Promise<void> {
    console.log('🔍 Validating deployment prerequisites...');

    // Check application health endpoint is accessible
    try {
      const healthCheck = await this.performHealthCheck(this.config.application.healthCheckUrl);
      if (!healthCheck.healthy) {
        console.warn('⚠️ Current application not healthy, proceeding with deployment');
      }
    } catch (error) {
      console.warn('⚠️ Unable to check current application health, proceeding with deployment');
    }

    // Validate configuration
    if (!this.config.application.name || !this.config.application.version) {
      throw new Error('Application name and version are required');
    }

    // Check deployment permissions (simulation)
    await this.simulatePermissionCheck();

    console.log('✅ Prerequisites validation completed');
  }

  /**
   * Execute blue-green deployment strategy
   */
  private async executeBlueGreenDeployment(): Promise<void> {
    console.log('🔵 Executing blue-green deployment...');

    // Step 1: Deploy to green environment
    this.updateProgress('Deploying to green environment', 20);
    await this.deployToGreenEnvironment();

    // Step 2: Health check green environment
    this.updateProgress('Health checking green environment', 40);
    await this.waitForHealthy(this.config.application.healthCheckUrl, 60000);

    // Step 3: Run smoke tests on green
    this.updateProgress('Running smoke tests on green environment', 60);
    await this.runSmokeTests();

    // Step 4: Switch traffic to green
    this.updateProgress('Switching traffic to green environment', 80);
    await this.switchTrafficToGreen();

    // Step 5: Monitor and finalize
    this.updateProgress('Monitoring new deployment', 90);
    await this.monitorDeployment();

    console.log('✅ Blue-green deployment completed');
  }

  /**
   * Execute canary deployment strategy
   */
  private async executeCanaryDeployment(): Promise<void> {
    console.log('🐤 Executing canary deployment...');

    const canaryPercentages = [10, 25, 50, 75, 100];

    for (const percentage of canaryPercentages) {
      this.updateProgress(`Canary deployment: ${percentage}% traffic`, (percentage / 100) * 80);
      
      // Deploy canary version with percentage of traffic
      await this.deployCanary(percentage);
      
      // Monitor canary performance
      await this.monitorCanaryMetrics(percentage);
      
      // Validate canary health
      const isHealthy = await this.validateCanaryHealth();
      if (!isHealthy) {
        throw new Error(`Canary deployment failed at ${percentage}% traffic`);
      }
      
      console.log(`✅ Canary ${percentage}% validation successful`);
      
      // Wait between rollout phases
      if (percentage < 100) {
        await this.sleep(30000); // 30 second pause between phases
      }
    }

    this.updateProgress('Finalizing canary deployment', 90);
    await this.finalizeCanaryDeployment();

    console.log('✅ Canary deployment completed');
  }

  /**
   * Execute rolling deployment strategy
   */
  private async executeRollingDeployment(): Promise<void> {
    console.log('🔄 Executing rolling deployment...');

    const totalReplicas = this.config.deployment.replicas;
    const maxUnavailable = this.config.deployment.maxUnavailable;
    const maxSurge = this.config.deployment.maxSurge;

    // Calculate rolling update parameters
    const batchSize = Math.min(maxSurge, Math.max(1, totalReplicas - maxUnavailable));
    const batches = Math.ceil(totalReplicas / batchSize);

    for (let batch = 1; batch <= batches; batch++) {
      const progress = 20 + (batch / batches) * 60;
      this.updateProgress(`Rolling update batch ${batch}/${batches}`, progress);

      // Update batch of replicas
      await this.updateReplicaBatch(batch, batchSize);
      
      // Wait for batch to be ready
      await this.waitForBatchReady(batch);
      
      console.log(`✅ Rolling update batch ${batch}/${batches} completed`);
    }

    this.updateProgress('Verifying rolling deployment', 85);
    await this.verifyRollingDeployment();

    console.log('✅ Rolling deployment completed');
  }

  /**
   * Deploy to green environment (blue-green strategy)
   */
  private async deployToGreenEnvironment(): Promise<void> {
    console.log('🌿 Deploying to green environment...');
    
    // Simulate deployment commands
    const deploymentCommands = [
      `kubectl apply -f k8s/${this.config.environment}/green/`,
      `kubectl set image deployment/${this.config.application.name}-green app=${this.config.application.image}`,
      `kubectl rollout status deployment/${this.config.application.name}-green --timeout=${this.config.deployment.timeout}s`
    ];

    for (const command of deploymentCommands) {
      console.log(`Executing: ${command}`);
      await this.executeCommand(command);
    }

    console.log('✅ Green environment deployment completed');
  }

  /**
   * Switch traffic to green environment
   */
  private async switchTrafficToGreen(): Promise<void> {
    console.log('🔀 Switching traffic to green environment...');
    
    // Update service selector to point to green deployment
    const switchCommands = [
      `kubectl patch service ${this.config.application.name} -p '{\"spec\":{\"selector\":{\"version\":\"green\"}}}'`,
      `kubectl annotate service ${this.config.application.name} deployment.kubernetes.io/revision-`
    ];

    for (const command of switchCommands) {
      console.log(`Executing: ${command}`);
      await this.executeCommand(command);
    }

    // Wait for DNS propagation
    await this.sleep(10000);
    
    console.log('✅ Traffic switched to green environment');
  }

  /**
   * Deploy canary version with specified traffic percentage
   */
  private async deployCanary(percentage: number): Promise<void> {
    console.log(`🐤 Deploying canary with ${percentage}% traffic...`);
    
    const canaryCommands = [
      `kubectl apply -f k8s/${this.config.environment}/canary/`,
      `kubectl set image deployment/${this.config.application.name}-canary app=${this.config.application.image}`,
      `kubectl patch virtualservice ${this.config.application.name} --type='json' -p='[{"op": "replace", "path": "/spec/http/0/match/0/weight", "value": ${percentage}}]'`
    ];

    for (const command of canaryCommands) {
      console.log(`Executing: ${command}`);
      await this.executeCommand(command);
    }

    // Wait for canary to be ready
    await this.waitForHealthy(`${this.config.application.healthCheckUrl}/canary`, 30000);
    
    console.log(`✅ Canary ${percentage}% deployment completed`);
  }

  /**
   * Monitor canary metrics
   */
  private async monitorCanaryMetrics(percentage: number): Promise<void> {
    console.log(`📊 Monitoring canary metrics for ${percentage}% traffic...`);
    
    const monitoringDuration = Math.min(this.config.monitoring.monitoringDuration, 120000); // Max 2 minutes
    const checkInterval = 10000; // 10 seconds
    const checks = Math.floor(monitoringDuration / checkInterval);

    let errorCount = 0;
    let totalChecks = 0;

    for (let i = 0; i < checks; i++) {
      totalChecks++;
      
      try {
        const healthCheck = await this.performHealthCheck(`${this.config.application.healthCheckUrl}/canary`);
        this.status.healthChecks.push(healthCheck);
        
        if (!healthCheck.healthy) {
          errorCount++;
        }
        
        // Check error rate threshold
        const errorRate = (errorCount / totalChecks) * 100;
        if (errorRate > 5) { // 5% error rate threshold
          throw new Error(`Canary error rate too high: ${errorRate.toFixed(2)}%`);
        }
        
      } catch (error) {
        errorCount++;
        console.warn(`⚠️ Canary health check failed: ${error}`);
      }
      
      await this.sleep(checkInterval);
    }
    
    const errorRate = (errorCount / totalChecks) * 100;
    console.log(`📈 Canary monitoring completed - Error rate: ${errorRate.toFixed(2)}%`);
  }

  /**
   * Validate canary health
   */
  private async validateCanaryHealth(): Promise<boolean> {
    console.log('🔍 Validating canary health...');
    
    try {
      const healthCheck = await this.performHealthCheck(`${this.config.application.healthCheckUrl}/canary`);
      
      if (!healthCheck.healthy) {
        console.error('❌ Canary health check failed');
        return false;
      }
      
      // Additional validation can be added here
      // - Response time thresholds
      // - Error rate analysis
      // - Business metrics validation
      
      console.log('✅ Canary health validation passed');
      return true;
      
    } catch (error) {
      console.error(`❌ Canary health validation failed: ${error}`);
      return false;
    }
  }

  /**
   * Update replica batch for rolling deployment
   */
  private async updateReplicaBatch(batch: number, batchSize: number): Promise<void> {
    console.log(`🔄 Updating replica batch ${batch} (size: ${batchSize})...`);
    
    const updateCommands = [
      `kubectl patch deployment ${this.config.application.name} -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","image":"${this.config.application.image}"}]}}}}'`,
      `kubectl scale deployment ${this.config.application.name} --replicas=${Math.min(batch * batchSize, this.config.deployment.replicas)}`
    ];

    for (const command of updateCommands) {
      console.log(`Executing: ${command}`);
      await this.executeCommand(command);
    }
    
    console.log(`✅ Replica batch ${batch} update initiated`);
  }

  /**
   * Wait for replica batch to be ready
   */
  private async waitForBatchReady(batch: number): Promise<void> {
    console.log(`⏳ Waiting for batch ${batch} to be ready...`);
    
    const timeout = this.config.deployment.timeout;
    const checkCommand = `kubectl rollout status deployment/${this.config.application.name} --timeout=${timeout}s`;
    
    await this.executeCommand(checkCommand);
    
    console.log(`✅ Batch ${batch} is ready`);
  }

  /**
   * Run smoke tests
   */
  private async runSmokeTests(): Promise<void> {
    console.log('💨 Running smoke tests...');
    
    try {
      // Run Playwright smoke tests
      const testCommand = `npx playwright test --grep="@smoke|@critical" --config=playwright.config.ts`;
      await this.executeCommand(testCommand);
      
      console.log('✅ Smoke tests passed');
    } catch (error) {
      throw new Error(`Smoke tests failed: ${error}`);
    }
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(url: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Simulate HTTP request (replace with actual HTTP client in real implementation)
      const simulatedResponse = {
        ok: Math.random() > 0.1, // 90% success rate simulation
        status: Math.random() > 0.1 ? 200 : 500
      };
      
      const responseTime = Date.now() - startTime + Math.random() * 100; // Add random delay
      
      return {
        timestamp: new Date(),
        url,
        responseTime,
        statusCode: simulatedResponse.status,
        healthy: simulatedResponse.ok,
        error: simulatedResponse.ok ? undefined : `HTTP ${simulatedResponse.status}`
      };
      
    } catch (error) {
      return {
        timestamp: new Date(),
        url,
        responseTime: Date.now() - startTime,
        statusCode: 0,
        healthy: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Wait for application to be healthy
   */
  private async waitForHealthy(url: string, timeout: number): Promise<void> {
    console.log(`⏳ Waiting for application to be healthy: ${url}`);
    
    const startTime = Date.now();
    let attempts = 0;
    
    while (Date.now() - startTime < timeout) {
      attempts++;
      
      try {
        const healthCheck = await this.performHealthCheck(url);
        this.status.healthChecks.push(healthCheck);
        
        if (healthCheck.healthy) {
          console.log(`✅ Application healthy after ${attempts} attempts (${Date.now() - startTime}ms)`);
          return;
        }
        
      } catch (error) {
        console.log(`🔄 Health check attempt ${attempts} failed: ${error}`);
      }
      
      await this.sleep(5000); // Wait 5 seconds between checks
    }
    
    throw new Error(`Application failed to become healthy within ${timeout}ms`);
  }

  /**
   * Monitor deployment health
   */
  private async monitorDeployment(): Promise<void> {
    console.log('📊 Monitoring deployment health...');
    
    const monitoringDuration = this.config.monitoring.monitoringDuration;
    const checkInterval = this.config.monitoring.healthCheckInterval;
    const checks = Math.floor(monitoringDuration / checkInterval);
    
    let failedChecks = 0;
    
    for (let i = 0; i < checks; i++) {
      try {
        const healthCheck = await this.performHealthCheck(this.config.application.healthCheckUrl);
        this.status.healthChecks.push(healthCheck);
        
        if (!healthCheck.healthy) {
          failedChecks++;
          if (failedChecks >= this.config.monitoring.maxFailedChecks) {
            throw new Error(`Too many failed health checks: ${failedChecks}`);
          }
        } else {
          failedChecks = 0; // Reset counter on successful check
        }
        
      } catch (error) {
        console.warn(`⚠️ Health check failed: ${error}`);
        failedChecks++;
      }
      
      await this.sleep(checkInterval);
    }
    
    console.log('✅ Deployment monitoring completed successfully');
  }

  /**
   * Handle deployment failure
   */
  private async handleDeploymentFailure(error: Error): Promise<void> {
    console.error(`❌ Deployment failed: ${error.message}`);
    
    this.status.status = 'failed';
    this.status.endTime = new Date();
    this.status.errors.push(error.message);
    
    if (this.config.deployment.rollbackOnFailure && !this.rollbackInProgress) {
      await this.initiateRollback(error.message);
    }
    
    this.emit('deployment:failed', this.status);
  }

  /**
   * Initiate rollback
   */
  private async initiateRollback(reason: string): Promise<void> {
    if (this.rollbackInProgress) {
      console.log('🔄 Rollback already in progress, skipping...');
      return;
    }
    
    this.rollbackInProgress = true;
    this.status.status = 'rolling-back';
    this.status.rollbackReason = reason;
    
    this.emit('deployment:rollback', this.status);
    
    try {
      console.log('🔄 Initiating automatic rollback...');
      
      const rollbackCommands = [
        `kubectl rollout undo deployment/${this.config.application.name}`,
        `kubectl rollout status deployment/${this.config.application.name} --timeout=300s`
      ];
      
      for (const command of rollbackCommands) {
        console.log(`Executing rollback: ${command}`);
        await this.executeCommand(command);
      }
      
      // Verify rollback health
      await this.waitForHealthy(this.config.application.healthCheckUrl, 60000);
      
      this.status.status = 'rolled-back';
      console.log('✅ Rollback completed successfully');
      
    } catch (rollbackError) {
      console.error(`❌ Rollback failed: ${rollbackError}`);
      this.status.errors.push(`Rollback failed: ${rollbackError}`);
    } finally {
      this.rollbackInProgress = false;
    }
  }

  /**
   * Execute command with proper error handling
   */
  private async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Simulate command execution for educational purposes
      console.log(`[SIMULATED] ${command}`);
      
      // Simulate success/failure based on command type
      const isHealthCheck = command.includes('curl') || command.includes('health');
      const shouldFail = Math.random() < (isHealthCheck ? 0.1 : 0.05); // 10% failure rate for health checks, 5% for others
      
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error(`Command failed: ${command}`));
        } else {
          resolve(`Command executed successfully: ${command}`);
        }
      }, Math.random() * 2000 + 500); // Random delay between 500ms and 2.5s
    });
  }

  /**
   * Update deployment progress
   */
  private updateProgress(phase: string, progress: number): void {
    this.status.currentPhase = phase;
    this.status.progress = Math.min(progress, 100);
    this.emit('deployment:progress', this.status);
  }

  /**
   * Send notifications
   */
  private async sendNotification(type: 'success' | 'error' | 'warning', message: string): Promise<void> {
    if (this.config.notifications.slack) {
      await this.sendSlackNotification(type, message);
    }
    
    if (this.config.notifications.email) {
      await this.sendEmailNotification(type, message);
    }
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(type: 'success' | 'error' | 'warning', message: string): Promise<void> {
    try {
      const colors = { success: 'good', error: 'danger', warning: 'warning' };
      const emojis = { success: '✅', error: '❌', warning: '⚠️' };
      
      const payload = {
        channel: this.config.notifications.slack!.channel,
        text: `${emojis[type]} Deployment ${type.toUpperCase()}`,
        attachments: [{
          color: colors[type],
          fields: [
            { title: 'Environment', value: this.config.environment, short: true },
            { title: 'Application', value: this.config.application.name, short: true },
            { title: 'Version', value: this.config.application.version, short: true },
            { title: 'Strategy', value: this.config.strategy, short: true },
            { title: 'Message', value: message, short: false }
          ],
          footer: 'Deployment Controller',
          ts: Math.floor(Date.now() / 1000)
        }]
      };
      
      console.log(`📲 [SIMULATED] Slack notification sent: ${JSON.stringify(payload, null, 2)}`);
      
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
    }
  }

  /**
   * Send Email notification (placeholder)
   */
  private async sendEmailNotification(type: 'success' | 'error' | 'warning', message: string): Promise<void> {
    // Email notification implementation would go here
    console.log(`📧 [SIMULATED] Email notification (${type}): ${message}`);
  }

  /**
   * Utility: Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Utility: Calculate deployment duration
   */
  private getDeploymentDuration(status: DeploymentStatus): number {
    if (!status.endTime) return 0;
    return status.endTime.getTime() - status.startTime.getTime();
  }

  /**
   * Utility: Simulate permission check
   */
  private async simulatePermissionCheck(): Promise<void> {
    console.log('🔐 Checking deployment permissions...');
    await this.sleep(1000); // Simulate permission check delay
    console.log('✅ Deployment permissions verified');
  }

  /**
   * Utility: Verify rolling deployment
   */
  private async verifyRollingDeployment(): Promise<void> {
    console.log('🔍 Verifying rolling deployment...');
    
    // Simulate verification
    await this.sleep(2000);
    
    console.log('✅ Rolling deployment verification completed');
  }

  /**
   * Utility: Finalize canary deployment
   */
  private async finalizeCanaryDeployment(): Promise<void> {
    console.log('🎯 Finalizing canary deployment...');
    
    const finalizeCommands = [
      `kubectl delete deployment ${this.config.application.name}-canary`,
      `kubectl patch virtualservice ${this.config.application.name} --type='json' -p='[{"op": "remove", "path": "/spec/http/0/match/0/weight"}]'`
    ];
    
    for (const command of finalizeCommands) {
      console.log(`Executing: ${command}`);
      await this.executeCommand(command);
    }
    
    console.log('✅ Canary deployment finalized');
  }

  /**
   * Utility: Validate deployment
   */
  private async validateDeployment(): Promise<void> {
    console.log('🔍 Validating deployment...');
    
    // Final health check
    await this.waitForHealthy(this.config.application.healthCheckUrl, 30000);
    
    // Run validation tests
    await this.runSmokeTests();
    
    console.log('✅ Deployment validation completed');
  }

  /**
   * Get current deployment status
   */
  getStatus(): DeploymentStatus {
    return { ...this.status };
  }

  /**
   * Export deployment report
   */
  async exportReport(outputPath: string): Promise<void> {
    const report = {
      deployment: this.status,
      config: this.config,
      summary: {
        duration: this.getDeploymentDuration(this.status),
        healthChecks: this.status.healthChecks.length,
        successfulHealthChecks: this.status.healthChecks.filter(hc => hc.healthy).length,
        averageResponseTime: this.status.healthChecks.length > 0 
          ? this.status.healthChecks.reduce((sum, hc) => sum + hc.responseTime, 0) / this.status.healthChecks.length 
          : 0
      }
    };
    
    await fs.promises.writeFile(outputPath, JSON.stringify(report, null, 2));
    console.log(`📄 Deployment report exported to: ${outputPath}`);
  }
}

// Export for use as module
export { DeploymentController, DeploymentConfig, DeploymentStatus };

// CLI usage example
async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node deployment-controller.js <config-file>');
    process.exit(1);
  }

  const configPath = process.argv[2];
  
  try {
    const config: DeploymentConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const controller = new DeploymentController(config);
    
    const result = await controller.deploy();
    await controller.exportReport('./deployment-report.json');
    
    console.log(`\n🎉 Deployment ${result.status}: ${result.id}`);
    process.exit(result.status === 'completed' ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}