/**
 * Pipeline Monitoring and Recovery System
 * 
 * This example demonstrates a comprehensive monitoring and recovery system for CI/CD pipelines
 * that can detect issues early, automatically recover from failures, and provide real-time
 * insights into pipeline health and performance.
 * 
 * Key Features:
 * - Real-time pipeline monitoring with health checks
 * - Automated recovery mechanisms with intelligent retry logic
 * - Circuit breaker pattern implementation
 * - Self-healing capabilities for common failures
 * - Performance metrics collection and analysis
 * - Alert generation and escalation management
 */

import { EventEmitter } from 'events';

// Core Monitoring Interfaces
interface PipelineHealth {
  pipelineId: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'critical';
  uptime: number;
  lastCheck: Date;
  metrics: {
    successRate: number;
    averageDuration: number;
    errorRate: number;
    throughput: number;
  };
  issues: HealthIssue[];
}

interface HealthIssue {
  type: 'performance' | 'reliability' | 'resource' | 'configuration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  firstDetected: Date;
  lastSeen: Date;
  occurrences: number;
  autoRecoverable: boolean;
}

interface RecoveryAction {
  id: string;
  name: string;
  description: string;
  condition: (context: RecoveryContext) => boolean;
  execute: (context: RecoveryContext) => Promise<RecoveryResult>;
  priority: number;
  maxAttempts: number;
  cooldownPeriod: number;
  successRate: number;
}

interface RecoveryContext {
  pipelineId: string;
  failure: PipelineFailure;
  environment: EnvironmentInfo;
  history: RecoveryAttempt[];
  metrics: PipelineMetrics;
}

interface RecoveryResult {
  success: boolean;
  message: string;
  actionsTaken: string[];
  nextActions?: string[];
  preventionRecommendations: string[];
}

interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  lastFailureTime?: Date;
  successCount: number;
  nextAttemptTime?: Date;
}

// Main Pipeline Monitoring System
class PipelineMonitoringSystem extends EventEmitter {
  private healthChecks: Map<string, PipelineHealth> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private recoveryActions: RecoveryAction[] = [];
  private recoveryHistory: Map<string, RecoveryAttempt[]> = new Map();
  private metricsBuffer: Map<string, PipelineMetrics[]> = new Map();
  private alertManager: AlertManager;

  constructor(private config: MonitoringConfig) {
    super();
    this.alertManager = new AlertManager();
    this.initializeRecoveryActions();
    this.startHealthChecks();
  }

  /**
   * Monitor a pipeline and start health checks
   */
  async monitorPipeline(pipelineId: string, options: MonitoringOptions): Promise<void> {
    console.log(`🔍 Starting monitoring for pipeline: ${pipelineId}`);

    const health: PipelineHealth = {
      pipelineId,
      status: 'healthy',
      uptime: 0,
      lastCheck: new Date(),
      metrics: {
        successRate: 100,
        averageDuration: 0,
        errorRate: 0,
        throughput: 0
      },
      issues: []
    };

    this.healthChecks.set(pipelineId, health);
    this.circuitBreakers.set(pipelineId, {
      state: 'closed',
      failureCount: 0,
      successCount: 0
    });

    // Initialize metrics buffer
    this.metricsBuffer.set(pipelineId, []);

    this.emit('pipelineMonitoringStarted', { pipelineId, options });
  }

  /**
   * Process pipeline execution event
   */
  async processPipelineEvent(event: PipelineEvent): Promise<void> {
    const { pipelineId, type, data } = event;

    try {
      // Update metrics
      await this.updateMetrics(pipelineId, event);

      // Check for failures and trigger recovery if needed
      if (type === 'failure') {
        await this.handlePipelineFailure(pipelineId, data as PipelineFailure);
      }

      // Update health status
      await this.updateHealthStatus(pipelineId);

    } catch (error) {
      console.error(`Error processing pipeline event:`, error);
      this.emit('error', { pipelineId, error });
    }
  }

  /**
   * Handle pipeline failure and trigger recovery
   */
  private async handlePipelineFailure(pipelineId: string, failure: PipelineFailure): Promise<void> {
    console.log(`🚨 Pipeline failure detected: ${pipelineId} - ${failure.reason}`);

    // Update circuit breaker
    const circuitBreaker = this.circuitBreakers.get(pipelineId)!;
    circuitBreaker.failureCount++;
    circuitBreaker.lastFailureTime = new Date();

    // Check circuit breaker threshold
    if (circuitBreaker.failureCount >= this.config.circuitBreakerThreshold) {
      circuitBreaker.state = 'open';
      circuitBreaker.nextAttemptTime = new Date(Date.now() + this.config.circuitBreakerTimeout);
      
      console.log(`⚡ Circuit breaker opened for pipeline: ${pipelineId}`);
      this.emit('circuitBreakerOpened', { pipelineId, circuitBreaker });
    }

    // Attempt automated recovery
    if (this.config.enableAutoRecovery && circuitBreaker.state !== 'open') {
      await this.attemptRecovery(pipelineId, failure);
    }

    // Generate alerts
    await this.alertManager.processFailure(pipelineId, failure);
  }

  /**
   * Attempt automated recovery for pipeline failure
   */
  private async attemptRecovery(pipelineId: string, failure: PipelineFailure): Promise<void> {
    console.log(`🔧 Attempting recovery for pipeline: ${pipelineId}`);

    const context: RecoveryContext = {
      pipelineId,
      failure,
      environment: await this.gatherEnvironmentInfo(pipelineId),
      history: this.recoveryHistory.get(pipelineId) || [],
      metrics: await this.getLatestMetrics(pipelineId)
    };

    // Find applicable recovery actions
    const applicableActions = this.recoveryActions
      .filter(action => action.condition(context))
      .sort((a, b) => b.priority - a.priority);

    if (applicableActions.length === 0) {
      console.log(`⚠️ No recovery actions available for pipeline: ${pipelineId}`);
      return;
    }

    let recoverySuccessful = false;

    for (const action of applicableActions) {
      // Check if action is on cooldown
      if (this.isActionOnCooldown(pipelineId, action)) {
        continue;
      }

      // Check attempt limits
      const recentAttempts = this.getRecentAttempts(pipelineId, action.id);
      if (recentAttempts.length >= action.maxAttempts) {
        continue;
      }

      try {
        console.log(`🎯 Executing recovery action: ${action.name}`);
        
        const result = await action.execute(context);
        
        // Record attempt
        this.recordRecoveryAttempt(pipelineId, {
          actionId: action.id,
          actionName: action.name,
          timestamp: new Date(),
          success: result.success,
          message: result.message,
          actionsTaken: result.actionsTaken
        });

        if (result.success) {
          console.log(`✅ Recovery successful: ${result.message}`);
          recoverySuccessful = true;
          
          // Update circuit breaker on successful recovery
          const circuitBreaker = this.circuitBreakers.get(pipelineId)!;
          circuitBreaker.failureCount = Math.max(0, circuitBreaker.failureCount - 1);
          circuitBreaker.successCount++;
          
          this.emit('recoverySuccessful', { pipelineId, action: action.name, result });
          break;
        } else {
          console.log(`❌ Recovery failed: ${result.message}`);
        }

      } catch (error) {
        console.error(`Recovery action failed:`, error);
        this.recordRecoveryAttempt(pipelineId, {
          actionId: action.id,
          actionName: action.name,
          timestamp: new Date(),
          success: false,
          message: `Action failed: ${error.message}`,
          actionsTaken: []
        });
      }
    }

    if (!recoverySuccessful) {
      console.log(`🔴 All recovery attempts failed for pipeline: ${pipelineId}`);
      this.emit('recoveryFailed', { pipelineId, failure, attemptsCount: applicableActions.length });
    }
  }

  /**
   * Update pipeline metrics based on events
   */
  private async updateMetrics(pipelineId: string, event: PipelineEvent): Promise<void> {
    const metricsHistory = this.metricsBuffer.get(pipelineId) || [];
    const health = this.healthChecks.get(pipelineId);
    
    if (!health) return;

    const now = new Date();
    const metrics: PipelineMetrics = {
      timestamp: now,
      duration: event.data.duration || 0,
      success: event.type === 'success',
      stage: event.data.stage || 'unknown',
      resourceUsage: event.data.resourceUsage || {
        cpu: 0,
        memory: 0,
        disk: 0
      }
    };

    metricsHistory.push(metrics);

    // Keep only last 100 metrics
    if (metricsHistory.length > 100) {
      metricsHistory.shift();
    }

    this.metricsBuffer.set(pipelineId, metricsHistory);

    // Calculate rolling metrics (last 24 hours)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentMetrics = metricsHistory.filter(m => m.timestamp > oneDayAgo);

    if (recentMetrics.length > 0) {
      const successfulRuns = recentMetrics.filter(m => m.success).length;
      const totalRuns = recentMetrics.length;
      const totalDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0);

      health.metrics = {
        successRate: (successfulRuns / totalRuns) * 100,
        averageDuration: totalDuration / totalRuns,
        errorRate: ((totalRuns - successfulRuns) / totalRuns) * 100,
        throughput: totalRuns / 24 // runs per hour
      };
    }
  }

  /**
   * Update health status based on metrics and issues
   */
  private async updateHealthStatus(pipelineId: string): Promise<void> {
    const health = this.healthChecks.get(pipelineId);
    if (!health) return;

    const issues: HealthIssue[] = [];

    // Check success rate
    if (health.metrics.successRate < 80) {
      issues.push({
        type: 'reliability',
        severity: health.metrics.successRate < 50 ? 'critical' : 'high',
        description: `Low success rate: ${health.metrics.successRate.toFixed(1)}%`,
        firstDetected: new Date(),
        lastSeen: new Date(),
        occurrences: 1,
        autoRecoverable: true
      });
    }

    // Check average duration
    const expectedDuration = this.config.expectedDuration[pipelineId] || 300000; // 5 minutes default
    if (health.metrics.averageDuration > expectedDuration * 2) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        description: `High average duration: ${Math.floor(health.metrics.averageDuration / 1000)}s`,
        firstDetected: new Date(),
        lastSeen: new Date(),
        occurrences: 1,
        autoRecoverable: true
      });
    }

    // Check error rate
    if (health.metrics.errorRate > 20) {
      issues.push({
        type: 'reliability',
        severity: health.metrics.errorRate > 50 ? 'critical' : 'high',
        description: `High error rate: ${health.metrics.errorRate.toFixed(1)}%`,
        firstDetected: new Date(),
        lastSeen: new Date(),
        occurrences: 1,
        autoRecoverable: false
      });
    }

    // Update issues (merge with existing)
    const existingIssues = health.issues;
    for (const newIssue of issues) {
      const existingIssue = existingIssues.find(issue => 
        issue.type === newIssue.type && issue.description === newIssue.description
      );
      
      if (existingIssue) {
        existingIssue.lastSeen = newIssue.lastSeen;
        existingIssue.occurrences++;
      } else {
        existingIssues.push(newIssue);
      }
    }

    // Determine overall health status
    const criticalIssues = existingIssues.filter(issue => issue.severity === 'critical');
    const highIssues = existingIssues.filter(issue => issue.severity === 'high');
    const mediumIssues = existingIssues.filter(issue => issue.severity === 'medium');

    if (criticalIssues.length > 0) {
      health.status = 'critical';
    } else if (highIssues.length > 0) {
      health.status = 'unhealthy';
    } else if (mediumIssues.length > 0) {
      health.status = 'degraded';
    } else {
      health.status = 'healthy';
    }

    health.lastCheck = new Date();
    health.issues = existingIssues;

    // Emit health status change
    this.emit('healthStatusChanged', { pipelineId, health });
  }

  /**
   * Initialize recovery actions
   */
  private initializeRecoveryActions(): void {
    // Clear browser cache
    this.recoveryActions.push({
      id: 'clear-browser-cache',
      name: 'Clear Browser Cache',
      description: 'Clear browser cache and temporary files',
      priority: 8,
      maxAttempts: 2,
      cooldownPeriod: 300000, // 5 minutes
      successRate: 0.75,
      condition: (context) => 
        context.failure.stage === 'test' && 
        (context.failure.reason.includes('cache') || context.failure.reason.includes('storage')),
      execute: async (context) => {
        const actions: string[] = [];
        
        try {
          // Simulate clearing browser cache
          actions.push('Cleared browser cache directories');
          actions.push('Removed temporary files');
          actions.push('Reset browser profiles');
          
          // Simulate delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          return {
            success: true,
            message: 'Browser cache cleared successfully',
            actionsTaken: actions,
            preventionRecommendations: [
              'Consider using incognito/private mode for tests',
              'Implement cache clearing in test setup'
            ]
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to clear browser cache: ${error.message}`,
            actionsTaken: actions,
            preventionRecommendations: []
          };
        }
      }
    });

    // Restart services
    this.recoveryActions.push({
      id: 'restart-services',
      name: 'Restart Services',
      description: 'Restart affected services and dependencies',
      priority: 7,
      maxAttempts: 1,
      cooldownPeriod: 600000, // 10 minutes
      successRate: 0.85,
      condition: (context) => 
        context.failure.reason.includes('connection') || 
        context.failure.reason.includes('service unavailable'),
      execute: async (context) => {
        const actions: string[] = [];
        
        try {
          actions.push('Restarted browser service');
          actions.push('Restarted test runner');
          actions.push('Verified service connectivity');
          
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          return {
            success: true,
            message: 'Services restarted successfully',
            actionsTaken: actions,
            nextActions: ['Monitor service stability for 10 minutes'],
            preventionRecommendations: [
              'Implement service health checks',
              'Add retry logic with exponential backoff'
            ]
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to restart services: ${error.message}`,
            actionsTaken: actions,
            preventionRecommendations: []
          };
        }
      }
    });

    // Scale resources
    this.recoveryActions.push({
      id: 'scale-resources',
      name: 'Scale Resources',
      description: 'Increase resource allocation',
      priority: 6,
      maxAttempts: 1,
      cooldownPeriod: 900000, // 15 minutes
      successRate: 0.9,
      condition: (context) => 
        context.failure.reason.includes('memory') || 
        context.failure.reason.includes('timeout') ||
        context.metrics.resourceUsage.memory > 90,
      execute: async (context) => {
        const actions: string[] = [];
        
        try {
          actions.push('Increased memory allocation to 8GB');
          actions.push('Increased CPU allocation to 4 cores');
          actions.push('Extended timeout to 10 minutes');
          
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          return {
            success: true,
            message: 'Resources scaled successfully',
            actionsTaken: actions,
            preventionRecommendations: [
              'Monitor resource usage patterns',
              'Consider implementing auto-scaling'
            ]
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to scale resources: ${error.message}`,
            actionsTaken: actions,
            preventionRecommendations: []
          };
        }
      }
    });

    // Reduce parallelism
    this.recoveryActions.push({
      id: 'reduce-parallelism',
      name: 'Reduce Parallelism',
      description: 'Reduce parallel job count to avoid resource contention',
      priority: 5,
      maxAttempts: 2,
      cooldownPeriod: 300000, // 5 minutes
      successRate: 0.8,
      condition: (context) => 
        context.environment.parallelJobs > 4 &&
        (context.failure.reason.includes('resource') || context.failure.reason.includes('contention')),
      execute: async (context) => {
        const originalJobs = context.environment.parallelJobs;
        const newJobs = Math.max(1, Math.floor(originalJobs / 2));
        
        try {
          const actions = [
            `Reduced parallel jobs from ${originalJobs} to ${newJobs}`,
            'Updated pipeline configuration',
            'Restarted pipeline with new settings'
          ];
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          return {
            success: true,
            message: `Parallelism reduced from ${originalJobs} to ${newJobs}`,
            actionsTaken: actions,
            preventionRecommendations: [
              'Monitor resource usage with different parallelism levels',
              'Implement dynamic parallelism based on resource availability'
            ]
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to reduce parallelism: ${error.message}`,
            actionsTaken: [`Attempted to reduce jobs from ${originalJobs} to ${newJobs}`],
            preventionRecommendations: []
          };
        }
      }
    });
  }

  /**
   * Check if recovery action is on cooldown
   */
  private isActionOnCooldown(pipelineId: string, action: RecoveryAction): boolean {
    const history = this.recoveryHistory.get(pipelineId) || [];
    const recentAttempts = history.filter(attempt => 
      attempt.actionId === action.id &&
      (Date.now() - attempt.timestamp.getTime()) < action.cooldownPeriod
    );
    
    return recentAttempts.length > 0;
  }

  /**
   * Get recent recovery attempts for specific action
   */
  private getRecentAttempts(pipelineId: string, actionId: string): RecoveryAttempt[] {
    const history = this.recoveryHistory.get(pipelineId) || [];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return history.filter(attempt => 
      attempt.actionId === actionId && 
      attempt.timestamp > oneDayAgo
    );
  }

  /**
   * Record recovery attempt
   */
  private recordRecoveryAttempt(pipelineId: string, attempt: RecoveryAttempt): void {
    const history = this.recoveryHistory.get(pipelineId) || [];
    history.push(attempt);
    
    // Keep only last 50 attempts
    if (history.length > 50) {
      history.shift();
    }
    
    this.recoveryHistory.set(pipelineId, history);
  }

  /**
   * Gather environment information
   */
  private async gatherEnvironmentInfo(pipelineId: string): Promise<EnvironmentInfo> {
    return {
      pipelineId,
      nodeVersion: '18.17.0', // Simulated
      platform: 'linux',
      architecture: 'x64',
      availableMemory: 8192, // MB
      parallelJobs: 4, // Default, should be retrieved from pipeline config
      lastDeployment: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      environmentVariables: {
        NODE_ENV: 'production',
        CI: 'true'
      }
    };
  }

  /**
   * Get latest metrics for pipeline
   */
  private async getLatestMetrics(pipelineId: string): Promise<PipelineMetrics> {
    const metricsHistory = this.metricsBuffer.get(pipelineId) || [];
    return metricsHistory[metricsHistory.length - 1] || {
      timestamp: new Date(),
      duration: 0,
      success: false,
      stage: 'unknown',
      resourceUsage: { cpu: 0, memory: 0, disk: 0 }
    };
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    setInterval(async () => {
      for (const [pipelineId] of this.healthChecks) {
        // Check circuit breaker state
        const circuitBreaker = this.circuitBreakers.get(pipelineId);
        if (circuitBreaker && circuitBreaker.state === 'open' && circuitBreaker.nextAttemptTime) {
          if (new Date() >= circuitBreaker.nextAttemptTime) {
            circuitBreaker.state = 'half-open';
            circuitBreaker.successCount = 0;
            console.log(`🔄 Circuit breaker moved to half-open for pipeline: ${pipelineId}`);
          }
        }
        
        // Emit periodic health update
        const health = this.healthChecks.get(pipelineId)!;
        this.emit('healthCheck', { pipelineId, health });
      }
    }, this.config.healthCheckInterval || 30000); // 30 seconds
  }

  /**
   * Get comprehensive dashboard data
   */
  getDashboardData(): DashboardData {
    const pipelines = Array.from(this.healthChecks.entries()).map(([id, health]) => {
      const circuitBreaker = this.circuitBreakers.get(id)!;
      const recentRecoveries = this.recoveryHistory.get(id) || [];
      
      return {
        pipelineId: id,
        health,
        circuitBreaker,
        recentRecoveryAttempts: recentRecoveries.slice(-5)
      };
    });

    const overallStats = this.calculateOverallStats(pipelines);

    return {
      timestamp: new Date(),
      pipelines,
      overallStats,
      systemHealth: this.getSystemHealth()
    };
  }

  /**
   * Calculate overall system statistics
   */
  private calculateOverallStats(pipelines: any[]): OverallStats {
    const totalPipelines = pipelines.length;
    const healthyPipelines = pipelines.filter(p => p.health.status === 'healthy').length;
    const unhealthyPipelines = pipelines.filter(p => p.health.status === 'unhealthy' || p.health.status === 'critical').length;
    
    const avgSuccessRate = pipelines.reduce((sum, p) => sum + p.health.metrics.successRate, 0) / totalPipelines || 0;
    const avgDuration = pipelines.reduce((sum, p) => sum + p.health.metrics.averageDuration, 0) / totalPipelines || 0;
    
    const totalRecoveryAttempts = pipelines.reduce((sum, p) => sum + p.recentRecoveryAttempts.length, 0);
    const successfulRecoveries = pipelines.reduce((sum, p) => 
      sum + p.recentRecoveryAttempts.filter(r => r.success).length, 0
    );

    return {
      totalPipelines,
      healthyPipelines,
      unhealthyPipelines,
      overallHealthPercentage: totalPipelines > 0 ? (healthyPipelines / totalPipelines) * 100 : 0,
      averageSuccessRate: avgSuccessRate,
      averageDuration: avgDuration,
      recoverySuccessRate: totalRecoveryAttempts > 0 ? (successfulRecoveries / totalRecoveryAttempts) * 100 : 0
    };
  }

  /**
   * Get system health metrics
   */
  private getSystemHealth(): SystemHealth {
    return {
      uptime: 3600000, // 1 hour (simulated)
      memoryUsage: {
        used: 2048, // MB
        heap: 1024, // MB
        external: 256 // MB
      },
      cpuUsage: { user: 150000, system: 50000 }, // Simulated
      activeConnections: 0,
      monitoredPipelines: this.healthChecks.size
    };
  }
}

// Alert Manager for intelligent notifications
class AlertManager {
  private alertRules: AlertRule[] = [];
  private alertHistory: Map<string, Alert[]> = new Map();
  private suppressedAlerts: Set<string> = new Set();

  constructor() {
    this.initializeAlertRules();
  }

  async processFailure(pipelineId: string, failure: PipelineFailure): Promise<void> {
    const context: AlertContext = {
      pipelineId,
      failure,
      timestamp: new Date()
    };

    for (const rule of this.alertRules) {
      if (rule.condition(context)) {
        const alert = this.createAlert(rule, context);
        
        if (!this.isAlertSuppressed(alert)) {
          await this.sendAlert(alert);
          this.recordAlert(pipelineId, alert);
        }
      }
    }
  }

  private initializeAlertRules(): void {
    // Critical failure alert
    this.alertRules.push({
      id: 'critical-failure',
      name: 'Critical Pipeline Failure',
      severity: 'critical',
      condition: (context) => 
        context.failure.stage === 'deployment' || 
        context.failure.reason.includes('critical'),
      channels: ['email', 'slack', 'sms'],
      cooldownPeriod: 300000 // 5 minutes
    });

    // High error rate alert
    this.alertRules.push({
      id: 'high-error-rate',
      name: 'High Error Rate Detected',
      severity: 'high',
      condition: (context) => {
        // This would check recent failure rate
        return false; // Simplified for example
      },
      channels: ['slack', 'email'],
      cooldownPeriod: 600000 // 10 minutes
    });
  }

  private createAlert(rule: AlertRule, context: AlertContext): Alert {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      pipelineId: context.pipelineId,
      severity: rule.severity,
      title: `${rule.name} - ${context.pipelineId}`,
      message: this.generateAlertMessage(rule, context),
      timestamp: context.timestamp,
      channels: rule.channels
    };
  }

  private generateAlertMessage(rule: AlertRule, context: AlertContext): string {
    return `Pipeline ${context.pipelineId} failed at stage "${context.failure.stage}" with reason: ${context.failure.reason}`;
  }

  private isAlertSuppressed(alert: Alert): boolean {
    const suppressKey = `${alert.ruleId}:${alert.pipelineId}`;
    return this.suppressedAlerts.has(suppressKey);
  }

  private async sendAlert(alert: Alert): Promise<void> {
    console.log(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.title}`);
    console.log(`   Message: ${alert.message}`);
    console.log(`   Channels: ${alert.channels.join(', ')}`);
    
    // Suppress future alerts of the same type temporarily
    const suppressKey = `${alert.ruleId}:${alert.pipelineId}`;
    this.suppressedAlerts.add(suppressKey);
    
    // Remove suppression after cooldown period
    setTimeout(() => {
      this.suppressedAlerts.delete(suppressKey);
    }, 300000); // 5 minutes
  }

  private recordAlert(pipelineId: string, alert: Alert): void {
    const history = this.alertHistory.get(pipelineId) || [];
    history.push(alert);
    
    // Keep only last 100 alerts
    if (history.length > 100) {
      history.shift();
    }
    
    this.alertHistory.set(pipelineId, history);
  }
}

// Supporting Types and Interfaces
interface MonitoringConfig {
  circuitBreakerThreshold: number;
  circuitBreakerTimeout: number;
  enableAutoRecovery: boolean;
  healthCheckInterval: number;
  expectedDuration: Record<string, number>;
}

interface MonitoringOptions {
  checkInterval: number;
  enableRecovery: boolean;
  alerting: boolean;
}

interface PipelineEvent {
  pipelineId: string;
  type: 'start' | 'success' | 'failure' | 'timeout';
  timestamp: Date;
  data: any;
}

interface PipelineFailure {
  stage: string;
  reason: string;
  exitCode: number;
  duration: number;
  logs: string[];
}

interface PipelineMetrics {
  timestamp: Date;
  duration: number;
  success: boolean;
  stage: string;
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

interface EnvironmentInfo {
  pipelineId: string;
  nodeVersion: string;
  platform: string;
  architecture: string;
  availableMemory: number;
  parallelJobs: number;
  lastDeployment: Date;
  environmentVariables: Record<string, string>;
}

interface RecoveryAttempt {
  actionId: string;
  actionName: string;
  timestamp: Date;
  success: boolean;
  message: string;
  actionsTaken: string[];
}

interface AlertRule {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  condition: (context: AlertContext) => boolean;
  channels: string[];
  cooldownPeriod: number;
}

interface AlertContext {
  pipelineId: string;
  failure: PipelineFailure;
  timestamp: Date;
}

interface Alert {
  id: string;
  ruleId: string;
  pipelineId: string;
  severity: string;
  title: string;
  message: string;
  timestamp: Date;
  channels: string[];
}

interface DashboardData {
  timestamp: Date;
  pipelines: any[];
  overallStats: OverallStats;
  systemHealth: SystemHealth;
}

interface OverallStats {
  totalPipelines: number;
  healthyPipelines: number;
  unhealthyPipelines: number;
  overallHealthPercentage: number;
  averageSuccessRate: number;
  averageDuration: number;
  recoverySuccessRate: number;
}

interface SystemHealth {
  uptime: number;
  memoryUsage: {
    used: number;
    heap: number;
    external: number;
  };
  cpuUsage: any;
  activeConnections: number;
  monitoredPipelines: number;
}

// Example Usage and Demonstration
async function demonstratePipelineMonitoring() {
  console.log('🚀 Initializing Pipeline Monitoring System...\n');

  const config: MonitoringConfig = {
    circuitBreakerThreshold: 3,
    circuitBreakerTimeout: 300000, // 5 minutes
    enableAutoRecovery: true,
    healthCheckInterval: 30000, // 30 seconds
    expectedDuration: {
      'pipeline-test': 300000, // 5 minutes
      'pipeline-deploy': 600000 // 10 minutes
    }
  };

  const monitor = new PipelineMonitoringSystem(config);

  // Start monitoring pipelines
  await monitor.monitorPipeline('pipeline-test', {
    checkInterval: 60000,
    enableRecovery: true,
    alerting: true
  });

  // Simulate pipeline events
  const simulateEvents = async () => {
    console.log('📊 Simulating pipeline events...\n');

    // Successful run
    await monitor.processPipelineEvent({
      pipelineId: 'pipeline-test',
      type: 'success',
      timestamp: new Date(),
      data: {
        duration: 180000,
        stage: 'test',
        resourceUsage: { cpu: 45, memory: 60, disk: 20 }
      }
    });

    // Failure event that will trigger recovery
    setTimeout(async () => {
      await monitor.processPipelineEvent({
        pipelineId: 'pipeline-test',
        type: 'failure',
        timestamp: new Date(),
        data: {
          stage: 'test',
          reason: 'Test timeout of 30000ms exceeded - browser cache issue detected',
          exitCode: 1,
          duration: 35000,
          logs: ['Test execution started', 'ERROR: Cache storage quota exceeded', 'ERROR: Timeout exceeded'],
          resourceUsage: { cpu: 95, memory: 85, disk: 30 }
        }
      });
    }, 2000);

    // Another failure to test different recovery action
    setTimeout(async () => {
      await monitor.processPipelineEvent({
        pipelineId: 'pipeline-test',
        type: 'failure',
        timestamp: new Date(),  
        data: {
          stage: 'test',
          reason: 'Out of memory error during test execution',
          exitCode: 1,
          duration: 25000,
          logs: ['Memory allocation failed', 'Browser crashed'],
          resourceUsage: { cpu: 70, memory: 95, disk: 25 }
        }
      });
    }, 8000);

    // Failure that will trigger circuit breaker
    setTimeout(async () => {
      await monitor.processPipelineEvent({
        pipelineId: 'pipeline-test',
        type: 'failure',
        timestamp: new Date(),  
        data: {
          stage: 'test',
          reason: 'Critical service connection failure',
          exitCode: 1,
          duration: 5000,
          logs: ['Service connection refused', 'Multiple retry attempts failed'],
          resourceUsage: { cpu: 30, memory: 40, disk: 15 }
        }
      });
    }, 15000);
  };

  // Event listeners for monitoring system events
  monitor.on('recoverySuccessful', (data) => {
    console.log(`✅ Recovery successful for ${data.pipelineId}: ${data.action}`);
    console.log(`   Actions taken: ${data.result.actionsTaken.join(', ')}`);
    if (data.result.preventionRecommendations.length > 0) {
      console.log(`   Prevention: ${data.result.preventionRecommendations.join(', ')}`);
    }
    console.log('');
  });

  monitor.on('recoveryFailed', (data) => {
    console.log(`❌ All recovery attempts failed for ${data.pipelineId}`);
    console.log(`   Original failure: ${data.failure.reason}`);
    console.log(`   Attempts made: ${data.attemptsCount}`);
    console.log('');
  });

  monitor.on('circuitBreakerOpened', (data) => {
    console.log(`⚡ Circuit breaker opened for ${data.pipelineId}`);
    console.log(`   Failure count: ${data.circuitBreaker.failureCount}`);
    console.log(`   Next attempt: ${data.circuitBreaker.nextAttemptTime}`);
    console.log('');
  });

  monitor.on('healthStatusChanged', (data) => {
    console.log(`🏥 Health status changed for ${data.pipelineId}: ${data.health.status}`);
    console.log(`   Success rate: ${data.health.metrics.successRate.toFixed(1)}%`);
    console.log(`   Issues: ${data.health.issues.length}`);
    if (data.health.issues.length > 0) {
      data.health.issues.forEach(issue => {
        console.log(`     - [${issue.severity.toUpperCase()}] ${issue.description}`);
      });
    }
    console.log('');
  });

  // Start simulation
  await simulateEvents();

  // Show dashboard data after simulation
  setTimeout(() => {
    const dashboardData = monitor.getDashboardData();
    console.log('\n📊 Final Dashboard Summary:');
    console.log('=' * 50);
    console.log(`Total Pipelines: ${dashboardData.overallStats.totalPipelines}`);
    console.log(`Healthy: ${dashboardData.overallStats.healthyPipelines}`);
    console.log(`Unhealthy: ${dashboardData.overallStats.unhealthyPipelines}`);
    console.log(`Overall Health: ${dashboardData.overallStats.overallHealthPercentage.toFixed(1)}%`);
    console.log(`Average Success Rate: ${dashboardData.overallStats.averageSuccessRate.toFixed(1)}%`);
    console.log(`Recovery Success Rate: ${dashboardData.overallStats.recoverySuccessRate.toFixed(1)}%`);
    
    console.log('\n🖥️ System Health:');
    console.log(`Uptime: ${Math.floor(dashboardData.systemHealth.uptime / 1000 / 60)} minutes`);
    console.log(`Memory Used: ${dashboardData.systemHealth.memoryUsage.used} MB`);
    console.log(`Monitored Pipelines: ${dashboardData.systemHealth.monitoredPipelines}`);

    console.log('\n🔧 Pipeline Details:');
    dashboardData.pipelines.forEach(pipeline => {
      console.log(`\n${pipeline.pipelineId}:`);
      console.log(`  Status: ${pipeline.health.status}`);
      console.log(`  Success Rate: ${pipeline.health.metrics.successRate.toFixed(1)}%`);
      console.log(`  Circuit Breaker: ${pipeline.circuitBreaker.state}`);
      console.log(`  Recent Recovery Attempts: ${pipeline.recentRecoveryAttempts.length}`);
      
      if (pipeline.recentRecoveryAttempts.length > 0) {
        const successful = pipeline.recentRecoveryAttempts.filter(r => r.success).length;
        console.log(`    Successful: ${successful}/${pipeline.recentRecoveryAttempts.length}`);
      }
    });

    console.log('\n✨ Monitoring system demonstration complete!');
  }, 20000); // Wait 20 seconds for all events to process
}

// Export for use in other modules
export {
  PipelineMonitoringSystem,
  AlertManager,
  PipelineHealth,
  RecoveryAction,
  MonitoringConfig
};

// Run demonstration if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  demonstratePipelineMonitoring().catch(console.error);
}