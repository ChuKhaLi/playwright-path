# Lesson 09: Production Deployment Strategies

## Learning Objectives

By the end of this lesson, you will be able to:

- Design and implement advanced deployment patterns (blue-green, canary, rolling deployments)
- Orchestrate zero-downtime deployments across multi-service architectures
- Implement feature flags and progressive rollout strategies
- Design automated rollback mechanisms and disaster recovery procedures
- Create production-ready deployment pipelines with comprehensive safety checks
- Implement Infrastructure as Code for deployment environment management
- Design deployment coordination strategies for microservices architectures
- Implement advanced monitoring and health checking for deployment validation

## Introduction

Production deployment strategies are critical for maintaining system reliability, minimizing risk, and ensuring continuous service availability. This lesson covers enterprise-level deployment patterns that enable safe, efficient, and automated delivery of software to production environments.

Modern deployment strategies go beyond simple "push to production" approaches, incorporating sophisticated techniques for risk mitigation, performance optimization, and business continuity. We'll explore advanced patterns used by leading technology companies to deploy thousands of times per day while maintaining exceptional reliability.

## Core Deployment Strategy Concepts

### 1. Zero-Downtime Deployment Principles

Zero-downtime deployments ensure continuous service availability during updates:

```yaml
# .github/workflows/zero-downtime-deployment.yml
name: Zero-Downtime Production Deployment

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      deployment_strategy:
        description: 'Deployment Strategy'
        required: true
        default: 'blue-green'
        type: choice
        options:
        - blue-green
        - canary
        - rolling

env:
  DEPLOYMENT_TIMEOUT: 1800
  HEALTH_CHECK_TIMEOUT: 300
  ROLLBACK_THRESHOLD: 5

jobs:
  deployment-strategy-selection:
    runs-on: ubuntu-latest
    outputs:
      strategy: ${{ steps.select-strategy.outputs.strategy }}
      environment: ${{ steps.select-strategy.outputs.environment }}
      replicas: ${{ steps.select-strategy.outputs.replicas }}
    steps:
      - name: Select Deployment Strategy
        id: select-strategy
        run: |
          # Determine strategy based on input or automated rules
          STRATEGY="${{ github.event.inputs.deployment_strategy }}"
          
          if [ -z "$STRATEGY" ]; then
            # Auto-select based on change analysis
            if [[ "${{ github.event.head_commit.message }}" == *"[major]"* ]]; then
              STRATEGY="blue-green"
            elif [[ "${{ github.event.head_commit.message }}" == *"[hotfix]"* ]]; then
              STRATEGY="rolling"
            else
              STRATEGY="canary"
            fi
          fi
          
          echo "strategy=$STRATEGY" >> $GITHUB_OUTPUT
          echo "environment=production" >> $GITHUB_OUTPUT
          echo "replicas=6" >> $GITHUB_OUTPUT

  blue-green-deployment:
    if: needs.deployment-strategy-selection.outputs.strategy == 'blue-green'
    needs: deployment-strategy-selection
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Green Environment
        id: green-deploy
        run: |
          # Deploy to green environment
          kubectl apply -f k8s/green-environment.yml
          
          # Wait for green environment to be ready
          kubectl wait --for=condition=available \
            --timeout=600s deployment/app-green
          
          # Store green environment details
          GREEN_ENDPOINT=$(kubectl get service app-green -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
          echo "green_endpoint=$GREEN_ENDPOINT" >> $GITHUB_OUTPUT

      - name: Comprehensive Health Validation
        id: health-check
        run: |
          # Multi-layered health checking
          ./scripts/comprehensive-health-check.sh \
            --endpoint "${{ steps.green-deploy.outputs.green_endpoint }}" \
            --checks "health,performance,integration,security" \
            --timeout ${{ env.HEALTH_CHECK_TIMEOUT }}

      - name: Traffic Switch with Gradual Ramp
        id: traffic-switch
        run: |
          # Gradual traffic switching with monitoring
          for percentage in 10 25 50 75 100; do
            echo "Switching ${percentage}% traffic to green"
            
            # Update load balancer weights
            ./scripts/update-traffic-weights.sh \
              --green-weight $percentage \
              --blue-weight $((100 - percentage))
            
            # Monitor metrics for 2 minutes
            sleep 120
            
            # Validate metrics before continuing
            ./scripts/validate-deployment-metrics.sh \
              --threshold-error-rate 0.1 \
              --threshold-latency-p99 500 \
              --threshold-throughput 1000
            
            if [ $? -ne 0 ]; then
              echo "Metrics validation failed at ${percentage}% traffic"
              exit 1
            fi
          done

      - name: Blue Environment Cleanup
        if: success()
        run: |
          # Clean up old blue environment
          kubectl delete -f k8s/blue-environment.yml --ignore-not-found=true
          
          # Update environment labels
          kubectl label service app-service environment=green --overwrite

  canary-deployment:
    if: needs.deployment-strategy-selection.outputs.strategy == 'canary'
    needs: deployment-strategy-selection
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy Canary Version
        id: canary-deploy
        run: |
          # Deploy canary with 5% of traffic
          envsubst < k8s/canary-deployment.yml | kubectl apply -f -
          
          # Wait for canary to be ready
          kubectl wait --for=condition=available \
            --timeout=300s deployment/app-canary

      - name: Canary Analysis and Progressive Rollout
        id: canary-analysis
        run: |
          # Progressive canary rollout with automated analysis
          CANARY_PERCENTAGES=(5 10 25 50 100)
          
          for percentage in "${CANARY_PERCENTAGES[@]}"; do
            echo "Canary rollout: ${percentage}%"
            
            # Update canary traffic percentage
            kubectl patch service app-service \
              -p '{"spec":{"selector":{"version":"canary"}}}' \
              --type merge
            
            # Run automated canary analysis
            ./scripts/canary-analysis.sh \
              --percentage $percentage \
              --duration 300 \
              --success-criteria "error_rate<0.1,latency_p99<500,user_satisfaction>0.95"
            
            ANALYSIS_RESULT=$?
            if [ $ANALYSIS_RESULT -ne 0 ]; then
              echo "Canary analysis failed at ${percentage}%"
              # Trigger automatic rollback
              kubectl patch service app-service \
                -p '{"spec":{"selector":{"version":"stable"}}}' \
                --type merge
              exit 1
            fi
            
            # Wait before next percentage increase
            sleep 180
          done

      - name: Promote Canary to Stable
        if: success()
        run: |
          # Promote canary to stable version
          kubectl patch deployment app-stable \
            --patch-file k8s/promote-canary.yml
          
          # Clean up canary deployment
          kubectl delete deployment app-canary

  rolling-deployment:
    if: needs.deployment-strategy-selection.outputs.strategy == 'rolling'
    needs: deployment-strategy-selection
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Rolling Update with Health Checks
        id: rolling-update
        run: |
          # Configure rolling update parameters
          kubectl patch deployment app \
            -p '{
              "spec": {
                "strategy": {
                  "type": "RollingUpdate",
                  "rollingUpdate": {
                    "maxUnavailable": "25%",
                    "maxSurge": "25%"
                  }
                }
              }
            }'
          
          # Apply new image with rolling update
          kubectl set image deployment/app \
            app=${{ env.DOCKER_REGISTRY }}/app:${{ github.sha }}
          
          # Monitor rolling update progress
          kubectl rollout status deployment/app \
            --timeout=600s

      - name: Post-Deployment Validation
        run: |
          # Comprehensive post-deployment validation
          ./scripts/post-deployment-validation.sh \
            --deployment app \
            --health-checks "readiness,liveness,business-logic" \
            --performance-tests "load,stress,spike" \
            --security-scans "vulnerability,compliance"

  deployment-notification:
    needs: [deployment-strategy-selection, blue-green-deployment, canary-deployment, rolling-deployment]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Deployment Notification
        uses: ./.github/actions/deployment-notification
        with:
          strategy: ${{ needs.deployment-strategy-selection.outputs.strategy }}
          status: ${{ job.status }}
          environment: production
          slack_webhook: ${{ secrets.SLACK_WEBHOOK }}
          teams_webhook: ${{ secrets.TEAMS_WEBHOOK }}
```

### 2. Feature Flag Integration

Feature flags enable safe deployment decoupling from feature release:

```typescript
// src/deployment/feature-flag-manager.ts
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  userTargeting?: UserTargeting;
  environmentRestrictions?: string[];
  killSwitch?: boolean;
  metadata?: FeatureFlagMetadata;
}

export interface UserTargeting {
  includedUsers?: string[];
  excludedUsers?: string[];
  userAttributes?: Record<string, any>;
  segmentRules?: SegmentRule[];
}

export interface SegmentRule {
  attribute: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'in' | 'gt' | 'lt';
  value: any;
}

export interface FeatureFlagMetadata {
  description: string;
  owner: string;
  jiraTicket?: string;
  createdAt: Date;
  expiresAt?: Date;
  dependencies?: string[];
}

export class EnterpriseFeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private analytics: FeatureFlagAnalytics;
  private cache: FeatureFlagCache;

  constructor(
    private config: FeatureFlagConfig,
    private logger: Logger
  ) {
    this.analytics = new FeatureFlagAnalytics(config.analyticsConfig);
    this.cache = new FeatureFlagCache(config.cacheConfig);
    this.initializeFlags();
  }

  async isEnabled(
    flagKey: string,
    context: EvaluationContext
  ): Promise<boolean> {
    try {
      // Check cache first
      const cachedResult = await this.cache.get(
        this.getCacheKey(flagKey, context)
      );
      
      if (cachedResult !== null) {
        this.analytics.recordEvaluation(flagKey, cachedResult, 'cache');
        return cachedResult;
      }

      const flag = await this.getFlag(flagKey);
      if (!flag) {
        this.logger.warn(`Feature flag ${flagKey} not found`);
        return false;
      }

      const result = await this.evaluateFlag(flag, context);
      
      // Cache result with TTL
      await this.cache.set(
        this.getCacheKey(flagKey, context),
        result,
        flag.metadata?.dependencies?.length ? 30 : 300 // Shorter TTL for dependent flags
      );

      this.analytics.recordEvaluation(flagKey, result, 'evaluation');
      return result;

    } catch (error) {
      this.logger.error(`Error evaluating feature flag ${flagKey}:`, error);
      return false; // Fail safe
    }
  }

  private async evaluateFlag(
    flag: FeatureFlag,
    context: EvaluationContext
  ): Promise<boolean> {
    // Kill switch check
    if (flag.killSwitch) {
      return false;
    }

    // Environment restrictions
    if (flag.environmentRestrictions?.length) {
      if (!flag.environmentRestrictions.includes(context.environment)) {
        return false;
      }
    }

    // User targeting
    if (flag.userTargeting) {
      const targetingResult = this.evaluateUserTargeting(
        flag.userTargeting,
        context
      );
      if (targetingResult !== null) {
        return targetingResult;
      }
    }

    // Rollout percentage
    if (flag.rolloutPercentage < 100) {
      const hash = this.generateUserHash(flag.key, context.userId);
      return hash < flag.rolloutPercentage;
    }

    return flag.enabled;
  }

  private evaluateUserTargeting(
    targeting: UserTargeting,
    context: EvaluationContext
  ): boolean | null {
    // Explicit inclusion
    if (targeting.includedUsers?.includes(context.userId)) {
      return true;
    }

    // Explicit exclusion
    if (targeting.excludedUsers?.includes(context.userId)) {
      return false;
    }

    // Segment rules
    if (targeting.segmentRules?.length) {
      return this.evaluateSegmentRules(targeting.segmentRules, context);
    }

    return null; // No targeting rules matched
  }

  private evaluateSegmentRules(
    rules: SegmentRule[],
    context: EvaluationContext
  ): boolean {
    return rules.every(rule => {
      const attributeValue = context.userAttributes?.[rule.attribute];
      
      switch (rule.operator) {
        case 'equals':
          return attributeValue === rule.value;
        case 'contains':
          return String(attributeValue).includes(String(rule.value));
        case 'startsWith':
          return String(attributeValue).startsWith(String(rule.value));
        case 'in':
          return Array.isArray(rule.value) && rule.value.includes(attributeValue);
        case 'gt':
          return Number(attributeValue) > Number(rule.value);
        case 'lt':
          return Number(attributeValue) < Number(rule.value);
        default:
          return false;
      }
    });
  }

  private generateUserHash(flagKey: string, userId: string): number {
    // Consistent hash function for rollout percentage
    const crypto = require('crypto');
    const hash = crypto.createHash('md5')
      .update(`${flagKey}:${userId}`)
      .digest('hex');
    
    return parseInt(hash.substring(0, 8), 16) % 100;
  }

  async createFlag(flag: FeatureFlag): Promise<void> {
    // Validate flag configuration
    this.validateFlag(flag);
    
    // Check dependencies
    if (flag.metadata?.dependencies) {
      await this.validateDependencies(flag.metadata.dependencies);
    }

    this.flags.set(flag.key, flag);
    await this.persistFlag(flag);
    
    this.logger.info(`Feature flag ${flag.key} created`, {
      flag: flag.key,
      enabled: flag.enabled,
      rolloutPercentage: flag.rolloutPercentage
    });
  }

  async updateFlag(
    flagKey: string,
    updates: Partial<FeatureFlag>
  ): Promise<void> {
    const existingFlag = await this.getFlag(flagKey);
    if (!existingFlag) {
      throw new Error(`Feature flag ${flagKey} not found`);
    }

    const updatedFlag = { ...existingFlag, ...updates };
    this.validateFlag(updatedFlag);

    this.flags.set(flagKey, updatedFlag);
    await this.persistFlag(updatedFlag);
    
    // Clear cache for this flag
    await this.cache.clear(flagKey);
    
    this.logger.info(`Feature flag ${flagKey} updated`, updates);
  }

  private validateFlag(flag: FeatureFlag): void {
    if (!flag.key || typeof flag.key !== 'string') {
      throw new Error('Flag key is required and must be a string');
    }

    if (flag.rolloutPercentage < 0 || flag.rolloutPercentage > 100) {
      throw new Error('Rollout percentage must be between 0 and 100');
    }

    if (flag.metadata?.expiresAt && flag.metadata.expiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }
  }
}

// Deployment integration with feature flags
export class FeatureFlagDeploymentIntegration {
  constructor(
    private flagManager: EnterpriseFeatureFlagManager,
    private deploymentConfig: DeploymentConfig
  ) {}

  async preDeploymentFlagSetup(
    deployment: DeploymentConfig
  ): Promise<void> {
    // Create flags for new features
    for (const feature of deployment.newFeatures) {
      await this.flagManager.createFlag({
        key: feature.flagKey,
        enabled: false, // Start disabled
        rolloutPercentage: 0,
        environmentRestrictions: [deployment.environment],
        metadata: {
          description: feature.description,
          owner: deployment.owner,
          jiraTicket: feature.jiraTicket,
          createdAt: new Date(),
          expiresAt: this.calculateFlagExpiration(feature.type)
        }
      });
    }

    // Update existing flags for deployment
    for (const flagUpdate of deployment.flagUpdates) {
      await this.flagManager.updateFlag(
        flagUpdate.key,
        flagUpdate.changes
      );
    }
  }

  async postDeploymentFlagRollout(
    deployment: DeploymentConfig
  ): Promise<void> {
    // Progressive rollout schedule
    const rolloutSchedule = [
      { percentage: 1, duration: 300 },   // 1% for 5 minutes
      { percentage: 5, duration: 600 },   // 5% for 10 minutes
      { percentage: 25, duration: 900 },  // 25% for 15 minutes
      { percentage: 50, duration: 1200 }, // 50% for 20 minutes
      { percentage: 100, duration: 0 }    // 100%
    ];

    for (const feature of deployment.newFeatures) {
      if (feature.autoRollout) {
        await this.executeProgressiveRollout(
          feature.flagKey,
          rolloutSchedule
        );
      }
    }
  }

  private async executeProgressiveRollout(
    flagKey: string,
    schedule: RolloutStep[]
  ): Promise<void> {
    for (const step of schedule) {
      await this.flagManager.updateFlag(flagKey, {
        enabled: true,
        rolloutPercentage: step.percentage
      });

      if (step.duration > 0) {
        // Monitor metrics during rollout step
        const metrics = await this.monitorRolloutMetrics(
          flagKey,
          step.duration
        );

        if (!this.validateRolloutMetrics(metrics)) {
          // Rollback on metric failure
          await this.flagManager.updateFlag(flagKey, {
            killSwitch: true
          });
          throw new Error(
            `Rollout failed for ${flagKey} at ${step.percentage}%`
          );
        }
      }
    }
  }
}
```

### 3. Automated Rollback Mechanisms

Comprehensive rollback strategies for deployment failures:

```yaml
# .github/workflows/automated-rollback.yml
name: Automated Rollback System

on:
  workflow_call:
    inputs:
      deployment_id:
        required: true
        type: string
      rollback_trigger:
        required: true
        type: string
      rollback_strategy:
        required: false
        type: string
        default: 'immediate'

env:
  ROLLBACK_TIMEOUT: 600
  HEALTH_CHECK_RETRIES: 5
  NOTIFICATION_CHANNELS: 'slack,teams,pagerduty'

jobs:
  rollback-decision:
    runs-on: ubuntu-latest
    outputs:
      should_rollback: ${{ steps.decision.outputs.should_rollback }}
      rollback_target: ${{ steps.decision.outputs.rollback_target }}
      rollback_strategy: ${{ steps.decision.outputs.rollback_strategy }}
    steps:
      - name: Evaluate Rollback Decision
        id: decision
        run: |
          # Analyze rollback trigger
          TRIGGER="${{ inputs.rollback_trigger }}"
          DEPLOYMENT_ID="${{ inputs.deployment_id }}"
          
          # Get deployment metadata
          DEPLOYMENT_INFO=$(kubectl get deployment -l deployment-id=$DEPLOYMENT_ID -o json)
          CURRENT_REPLICAS=$(echo $DEPLOYMENT_INFO | jq '.items[0].status.replicas')
          READY_REPLICAS=$(echo $DEPLOYMENT_INFO | jq '.items[0].status.readyReplicas // 0')
          
          # Decision logic based on trigger type
          case $TRIGGER in
            "health_check_failure")
              if [ $READY_REPLICAS -lt $((CURRENT_REPLICAS / 2)) ]; then
                echo "should_rollback=true" >> $GITHUB_OUTPUT
                echo "rollback_strategy=immediate" >> $GITHUB_OUTPUT
              else
                echo "should_rollback=true" >> $GITHUB_OUTPUT
                echo "rollback_strategy=gradual" >> $GITHUB_OUTPUT
              fi
              ;;
            "performance_degradation")
              echo "should_rollback=true" >> $GITHUB_OUTPUT
              echo "rollback_strategy=feature_flag" >> $GITHUB_OUTPUT
              ;;
            "error_rate_spike")
              echo "should_rollback=true" >> $GITHUB_OUTPUT
              echo "rollback_strategy=immediate" >> $GITHUB_OUTPUT
              ;;
            "manual_trigger")
              echo "should_rollback=true" >> $GITHUB_OUTPUT
              echo "rollback_strategy=${{ inputs.rollback_strategy }}" >> $GITHUB_OUTPUT
              ;;
            *)
              echo "should_rollback=false" >> $GITHUB_OUTPUT
              ;;
          esac
          
          # Determine rollback target
          PREVIOUS_STABLE=$(kubectl get configmap deployment-history \
            -o jsonpath='{.data.previous_stable_version}')
          echo "rollback_target=$PREVIOUS_STABLE" >> $GITHUB_OUTPUT

  immediate-rollback:
    if: needs.rollback-decision.outputs.should_rollback == 'true' && 
        needs.rollback-decision.outputs.rollback_strategy == 'immediate'
    needs: rollback-decision
    runs-on: ubuntu-latest
    steps:
      - name: Execute Immediate Rollback
        run: |
          TARGET_VERSION="${{ needs.rollback-decision.outputs.rollback_target }}"
          DEPLOYMENT_ID="${{ inputs.deployment_id }}"
          
          echo "Executing immediate rollback to $TARGET_VERSION"
          
          # Immediate rollback using kubectl rollout undo
          kubectl rollout undo deployment/app --to-revision=$(
            kubectl rollout history deployment/app | 
            grep $TARGET_VERSION | 
            awk '{print $1}'
          )
          
          # Wait for rollback completion
          kubectl rollout status deployment/app --timeout=${ROLLBACK_TIMEOUT}s
          
          # Verify rollback success
          CURRENT_IMAGE=$(kubectl get deployment app -o jsonpath='{.spec.template.spec.containers[0].image}')
          if [[ "$CURRENT_IMAGE" == *"$TARGET_VERSION"* ]]; then
            echo "Rollback successful: $CURRENT_IMAGE"
          else
            echo "Rollback verification failed: $CURRENT_IMAGE"
            exit 1
          fi

      - name: Post-Rollback Health Check
        run: |
          # Comprehensive health check after rollback
          ./scripts/comprehensive-health-check.sh \
            --deployment app \
            --timeout 300 \
            --retries ${{ env.HEALTH_CHECK_RETRIES }} \
            --checks "health,performance,integration"

  gradual-rollback:
    if: needs.rollback-decision.outputs.should_rollback == 'true' && 
        needs.rollback-decision.outputs.rollback_strategy == 'gradual'
    needs: rollback-decision
    runs-on: ubuntu-latest
    steps:
      - name: Execute Gradual Rollback
        run: |
          TARGET_VERSION="${{ needs.rollback-decision.outputs.rollback_target }}"
          
          # Gradual rollback with traffic shifting
          ROLLBACK_PERCENTAGES=(25 50 75 100)
          
          for percentage in "${ROLLBACK_PERCENTAGES[@]}"; do
            echo "Rolling back ${percentage}% of traffic"
            
            # Update deployment with mixed versions
            ./scripts/gradual-rollback.sh \
              --target-version $TARGET_VERSION \
              --rollback-percentage $percentage \
              --health-check-interval 60
            
            # Monitor for 2 minutes
            sleep 120
            
            # Validate rollback metrics
            METRICS_VALID=$(./scripts/validate-rollback-metrics.sh \
              --percentage $percentage)
            
            if [ "$METRICS_VALID" != "true" ]; then
              echo "Rollback validation failed at ${percentage}%"
              # Escalate to immediate rollback
              kubectl rollout undo deployment/app
              break
            fi
          done

  feature-flag-rollback:
    if: needs.rollback-decision.outputs.should_rollback == 'true' && 
        needs.rollback-decision.outputs.rollback_strategy == 'feature_flag'
    needs: rollback-decision
    runs-on: ubuntu-latest
    steps:
      - name: Execute Feature Flag Rollback
        run: |
          DEPLOYMENT_ID="${{ inputs.deployment_id }}"
          
          # Get feature flags associated with deployment
          FEATURE_FLAGS=$(kubectl get configmap deployment-metadata \
            -o jsonpath="{.data.feature_flags_$DEPLOYMENT_ID}")
          
          # Disable feature flags instead of code rollback
          for flag in $(echo $FEATURE_FLAGS | jq -r '.[]'); do
            echo "Disabling feature flag: $flag"
            
            # Update feature flag to disabled
            curl -X POST "$FEATURE_FLAG_API/flags/$flag/disable" \
              -H "Authorization: Bearer $FEATURE_FLAG_TOKEN" \
              -H "Content-Type: application/json" \
              -d '{
                "disabled": true,
                "reason": "Automated rollback triggered",
                "rollback_deployment_id": "'$DEPLOYMENT_ID'"
              }'
          done
          
          # Verify feature flags are disabled
          sleep 30
          ./scripts/verify-feature-flags-disabled.sh --flags "$FEATURE_FLAGS"

  rollback-notification:
    needs: [rollback-decision, immediate-rollback, gradual-rollback, feature-flag-rollback]
    if: always() && needs.rollback-decision.outputs.should_rollback == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Send Rollback Notifications
        run: |
          ROLLBACK_STATUS="success"
          if [[ "${{ needs.immediate-rollback.result }}" == "failure" ]] || 
             [[ "${{ needs.gradual-rollback.result }}" == "failure" ]] || 
             [[ "${{ needs.feature-flag-rollback.result }}" == "failure" ]]; then
            ROLLBACK_STATUS="failure"
          fi
          
          # Send notifications to multiple channels
          ./scripts/send-rollback-notification.sh \
            --deployment-id "${{ inputs.deployment_id }}" \
            --rollback-trigger "${{ inputs.rollback_trigger }}" \
            --rollback-strategy "${{ needs.rollback-decision.outputs.rollback_strategy }}" \
            --rollback-status "$ROLLBACK_STATUS" \
            --channels "${{ env.NOTIFICATION_CHANNELS }}"

  post-rollback-analysis:
    needs: [rollback-decision, immediate-rollback, gradual-rollback, feature-flag-rollback]
    if: always() && needs.rollback-decision.outputs.should_rollback == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Conduct Post-Rollback Analysis
        run: |
          # Collect rollback metrics and logs
          ./scripts/post-rollback-analysis.sh \
            --deployment-id "${{ inputs.deployment_id }}" \
            --rollback-trigger "${{ inputs.rollback_trigger }}" \
            --start-time "$(date -d '1 hour ago' -Iseconds)" \
            --end-time "$(date -Iseconds)"
          
          # Generate rollback report
          ./scripts/generate-rollback-report.sh \
            --output-format "json,pdf" \
            --include-logs true \
            --include-metrics true \
            --include-timeline true
```

## Advanced Deployment Orchestration

### 1. Multi-Service Deployment Coordination

Orchestrating deployments across microservices architectures requires sophisticated coordination patterns. Here's an enterprise-level deployment orchestration system:

```typescript
// src/deployment/orchestration-engine.ts
export interface DeploymentPlan {
  id: string;
  services: ServiceDeployment[];
  dependencies: DeploymentDependency[];
  strategy: OrchestrationStrategy;
  rollbackPlan: RollbackPlan;
  validationRules: ValidationRule[];
}

export interface ServiceDeployment {
  serviceName: string;
  currentVersion: string;
  targetVersion: string;
  deploymentStrategy: 'blue-green' | 'canary' | 'rolling';
  healthChecks: HealthCheck[];
  resources: ResourceRequirements;
  configChanges?: ConfigurationChange[];
}

export interface DeploymentDependency {
  dependentService: string;
  dependsOnService: string;
  dependencyType: 'hard' | 'soft' | 'order-only';
  validationRequired: boolean;
}

export class EnterpriseDeploymentOrchestrator {
  private deploymentQueue: Map<string, DeploymentPlan> = new Map();
  private serviceRegistry: ServiceRegistry;
  private metricsCollector: MetricsCollector;
  private notificationService: NotificationService;

  constructor(
    private config: OrchestratorConfig,
    private logger: Logger
  ) {
    this.serviceRegistry = new ServiceRegistry(config.registryConfig);
    this.metricsCollector = new MetricsCollector(config.metricsConfig);
    this.notificationService = new NotificationService(config.notificationConfig);
  }

  async executeDeploymentPlan(plan: DeploymentPlan): Promise<DeploymentResult> {
    const execution = new DeploymentExecution(plan, this.logger);
    
    try {
      // Pre-deployment validation
      await this.validateDeploymentPlan(plan);
      
      // Create deployment tracking
      const deploymentId = await this.createDeploymentTracking(plan);
      execution.setDeploymentId(deploymentId);

      // Execute based on orchestration strategy
      const result = await this.executeOrchestrationStrategy(
        plan,
        execution
      );

      // Post-deployment validation and cleanup
      await this.postDeploymentValidation(plan, result);
      
      return result;

    } catch (error) {
      this.logger.error('Deployment execution failed:', error);
      
      // Execute rollback if configured
      if (plan.rollbackPlan.autoRollback) {
        await this.executeRollback(plan, execution);
      }
      
      throw error;
    }
  }

  private async executeOrchestrationStrategy(
    plan: DeploymentPlan,
    execution: DeploymentExecution
  ): Promise<DeploymentResult> {
    switch (plan.strategy.type) {
      case 'sequential':
        return await this.executeSequentialDeployment(plan, execution);
      case 'parallel':
        return await this.executeParallelDeployment(plan, execution);
      case 'waves':
        return await this.executeWaveDeployment(plan, execution);
      default:
        throw new Error(`Unknown orchestration strategy: ${plan.strategy.type}`);
    }
  }

  private async executeSequentialDeployment(
    plan: DeploymentPlan,
    execution: DeploymentExecution
  ): Promise<DeploymentResult> {
    const results: ServiceDeploymentResult[] = [];
    const sortedServices = this.topologicalSort(plan.services, plan.dependencies);

    for (const service of sortedServices) {
      this.logger.info(`Deploying service: ${service.serviceName}`);
      
      const serviceResult = await this.deployService(service, execution);
      results.push(serviceResult);

      if (!serviceResult.success) {
        if (plan.strategy.failureHandling.stopOnFailure) {
          throw new Error(
            `Service deployment failed: ${service.serviceName}`
          );
        }
      }

      // Wait for service stabilization
      await this.waitForServiceStabilization(service, serviceResult);
    }

    return new DeploymentResult(results, execution.getMetrics());
  }

  private topologicalSort(
    services: ServiceDeployment[],
    dependencies: DeploymentDependency[]
  ): ServiceDeployment[] {
    // Implementation of topological sorting for dependency resolution
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const result: ServiceDeployment[] = [];

    const visit = (serviceName: string) => {
      if (visiting.has(serviceName)) {
        throw new Error(`Circular dependency detected involving ${serviceName}`);
      }
      
      if (visited.has(serviceName)) {
        return;
      }

      visiting.add(serviceName);
      
      // Visit dependencies first
      const serviceDeps = dependencies.filter(d => 
        d.dependentService === serviceName && d.dependencyType === 'hard'
      );
      
      for (const dep of serviceDeps) {
        visit(dep.dependsOnService);
      }
      
      visiting.delete(serviceName);
      visited.add(serviceName);
      
      const service = services.find(s => s.serviceName === serviceName);
      if (service) {
        result.push(service);
      }
    };

    for (const service of services) {
      visit(service.serviceName);
    }

    return result;
  }
}
```

### 2. Infrastructure as Code for Deployments

Managing deployment infrastructure through code provides consistency and reproducibility:

```yaml
# terraform/deployment-infrastructure/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
  
  backend "s3" {
    bucket = "company-terraform-state"
    key    = "deployment-infrastructure/terraform.tfstate"
    region = "us-west-2"
  }
}

# Multi-environment deployment infrastructure
module "deployment_environments" {
  source = "./modules/deployment-environment"
  
  for_each = var.environments
  
  environment_name = each.key
  environment_config = each.value
  
  # Network configuration
  vpc_cidr = each.value.vpc_cidr
  availability_zones = each.value.availability_zones
  
  # EKS configuration
  eks_cluster_version = each.value.eks_version
  node_groups = each.value.node_groups
  
  # Application Load Balancer configuration
  alb_configuration = each.value.alb_config
  
  # Monitoring and logging
  monitoring_enabled = true
  log_retention_days = each.value.log_retention
  
  # Security configuration
  security_groups = each.value.security_groups
  iam_roles = each.value.iam_roles
  
  tags = merge(var.common_tags, {
    Environment = each.key
    Purpose = "deployment-infrastructure"
  })
}

# Blue-Green deployment infrastructure
resource "aws_lb_target_group" "blue" {
  for_each = var.environments
  
  name     = "${each.key}-app-blue"
  port     = 80
  protocol = "HTTP"
  vpc_id   = module.deployment_environments[each.key].vpc_id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
    protocol            = "HTTP"
    port                = "traffic-port"
  }
  
  tags = {
    Environment = each.key
    Color = "blue"
  }
}

resource "aws_lb_target_group" "green" {
  for_each = var.environments
  
  name     = "${each.key}-app-green"
  port     = 80
  protocol = "HTTP"
  vpc_id   = module.deployment_environments[each.key].vpc_id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
    protocol            = "HTTP"
    port                = "traffic-port"
  }
  
  tags = {
    Environment = each.key
    Color = "green"
  }
}

# Application Load Balancer with weighted routing
resource "aws_lb" "application" {
  for_each = var.environments
  
  name               = "${each.key}-app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [module.deployment_environments[each.key].alb_security_group_id]
  subnets            = module.deployment_environments[each.key].public_subnet_ids
  
  enable_deletion_protection = each.value.deletion_protection_enabled
  
  access_logs {
    bucket  = module.deployment_environments[each.key].access_logs_bucket
    prefix  = "alb-access-logs"
    enabled = true
  }
  
  tags = {
    Environment = each.key
  }
}

# Lambda function for deployment automation
resource "aws_lambda_function" "deployment_orchestrator" {
  for_each = var.environments
  
  filename         = "deployment-orchestrator.zip"
  function_name    = "${each.key}-deployment-orchestrator"
  role            = aws_iam_role.lambda_execution[each.key].arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 900
  
  environment {
    variables = {
      ENVIRONMENT = each.key
      EKS_CLUSTER_NAME = module.deployment_environments[each.key].eks_cluster_name
      BLUE_TARGET_GROUP_ARN = aws_lb_target_group.blue[each.key].arn
      GREEN_TARGET_GROUP_ARN = aws_lb_target_group.green[each.key].arn
      ALB_LISTENER_ARN = aws_lb_listener.application[each.key].arn
      SLACK_WEBHOOK_URL = each.value.slack_webhook_url
      FEATURE_FLAG_API_ENDPOINT = each.value.feature_flag_api_endpoint
    }
  }
  
  tags = {
    Environment = each.key
  }
}

# CloudWatch alarms for deployment monitoring
resource "aws_cloudwatch_metric_alarm" "deployment_error_rate" {
  for_each = var.environments
  
  alarm_name          = "${each.key}-deployment-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4XXError"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors application error rate during deployment"
  alarm_actions       = [aws_sns_topic.deployment_notifications[each.key].arn]
  
  dimensions = {
    LoadBalancer = aws_lb.application[each.key].arn_suffix
  }
  
  tags = {
    Environment = each.key
  }
}
```

## Summary

This lesson covered advanced production deployment strategies essential for enterprise-level operations:

### Key Concepts Learned:

1. **Zero-Downtime Deployment Patterns**:
   - Blue-green deployments with automated traffic switching
   - Canary deployments with progressive rollout and automated analysis
   - Rolling deployments with comprehensive health monitoring
   - Feature flag integration for deployment decoupling

2. **Automated Rollback Mechanisms**:
   - Multi-strategy rollback approaches (immediate, gradual, feature-flag)
   - Intelligent rollback decision making based on failure types
   - Comprehensive post-rollback analysis and reporting
   - Integration with monitoring and alerting systems

3. **Multi-Service Deployment Orchestration**:
   - Dependency-aware deployment sequencing
   - Parallel and wave-based deployment strategies
   - Service registry integration and coordination
   - Comprehensive failure handling and recovery

4. **Infrastructure as Code for Deployments**:
   - Terraform-based deployment infrastructure
   - Multi-environment deployment automation
   - CloudWatch monitoring and alerting integration
   - Lambda-based deployment orchestration

### Enterprise Applications:

- **Financial Services**: Zero-downtime deployments for trading systems with millisecond SLA requirements
- **E-commerce Platforms**: Complex microservices deployments during peak traffic periods
- **Healthcare Systems**: Compliance-aware deployments with data integrity guarantees
- **SaaS Platforms**: Multi-tenant deployment coordination across global regions

### Professional Development:

These advanced deployment strategies prepare you for senior roles including:
- **Senior DevOps Engineer** ($120k-$160k): Leading deployment automation initiatives
- **CI/CD Architect** ($140k-$180k): Designing enterprise deployment patterns
- **Site Reliability Engineer** ($130k-$170k): Ensuring production system reliability
- **Principal Engineer** ($160k-$220k+): Setting technical strategy for deployment practices

### Next Steps:

Continue to Lesson 10 to explore monitoring and observability patterns that complement these deployment strategies, providing comprehensive visibility into production system health and performance.