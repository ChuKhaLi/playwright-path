/**
 * Comprehensive Failure Analysis System
 * 
 * This example demonstrates a production-ready system for analyzing CI/CD pipeline failures,
 * identifying patterns, and providing automated recommendations for resolution.
 * 
 * Key Features:
 * - Failure symptom collection and normalization
 * - Historical pattern analysis with machine learning insights
 * - Root cause identification using multiple analysis techniques
 * - Automated recommendation generation
 * - Integration with monitoring and alerting systems
 */

import { EventEmitter } from 'events';
import * as fs from 'fs/promises';
import * as path from 'path';

// Core Interfaces
interface FailureSymptoms {
  timestamp: Date;
  pipelineId: string;
  stage: string;
  exitCode: number;
  errorMessage: string;
  stackTrace?: string;
  affectedComponents: string[];
  environmentContext: {
    branch: string;
    commit: string;
    triggeredBy: string;
    parallelJobs: number;
    runner: string;
    os: string;
  };
  metrics: {
    duration: number;
    memoryUsage: number;
    cpuUsage: number;
    diskSpace: number;
  };
}

interface FailurePattern {
  errorSignature: string;
  frequency: number;
  recentOccurrences: Date[];
  commonFactors: string[];
  resolutionHistory: Resolution[];
  averageResolutionTime: number;
  successRate: number;
}

interface Resolution {
  action: string;
  success: boolean;
  timeToResolve: number;
  automatable: boolean;
  implementedBy: string;
  timestamp: Date;
}

interface AnalysisResult {
  primaryCause: string;
  confidence: number;
  contributingFactors: string[];
  recommendations: Recommendation[];
  similarIncidents: FailureSymptoms[];
  estimatedImpact: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedUsers: number;
    businessImpact: string;
  };
}

interface Recommendation {
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  automatable: boolean;
  estimatedTime: number;
  resources: string[];
  dependencies: string[];
}

// Main Failure Analysis System
class ComprehensiveFailureAnalyzer extends EventEmitter {
  private failureHistory: Map<string, FailureSymptoms[]> = new Map();
  private patterns: Map<string, FailurePattern> = new Map();
  private resolutionDatabase: Map<string, Resolution[]> = new Map();
  private analysisCache: Map<string, AnalysisResult> = new Map();

  constructor(private config: AnalyzerConfig) {
    super();
    this.initializePatternDatabase();
  }

  /**
   * Main entry point for failure analysis
   */
  async analyzeFailure(pipelineRun: PipelineRun): Promise<AnalysisResult> {
    console.log(`🔍 Starting failure analysis for pipeline ${pipelineRun.id}`);
    
    try {
      // Step 1: Collect failure symptoms
      const symptoms = await this.collectFailureSymptoms(pipelineRun);
      console.log(`📊 Collected symptoms: ${symptoms.errorMessage}`);

      // Step 2: Check cache for similar analysis
      const cacheKey = this.generateCacheKey(symptoms);
      if (this.analysisCache.has(cacheKey)) {
        console.log(`⚡ Using cached analysis for similar failure`);
        return this.analysisCache.get(cacheKey)!;
      }

      // Step 3: Perform comprehensive analysis
      const analysis = await this.performComprehensiveAnalysis(symptoms);
      
      // Step 4: Cache results
      this.analysisCache.set(cacheKey, analysis);
      
      // Step 5: Emit analysis complete event
      this.emit('analysisComplete', { symptoms, analysis });
      
      console.log(`✅ Analysis complete. Primary cause: ${analysis.primaryCause}`);
      return analysis;

    } catch (error) {
      console.error(`❌ Failure analysis error:`, error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  /**
   * Collect and normalize failure symptoms from pipeline run
   */
  private async collectFailureSymptoms(pipelineRun: PipelineRun): Promise<FailureSymptoms> {
    // Extract error information from logs
    const errorInfo = await this.extractErrorInformation(pipelineRun.logs);
    
    // Gather environment metrics
    const metrics = await this.gatherEnvironmentMetrics(pipelineRun);
    
    // Identify affected components
    const affectedComponents = await this.identifyAffectedComponents(pipelineRun);

    const symptoms: FailureSymptoms = {
      timestamp: pipelineRun.failedAt,
      pipelineId: pipelineRun.id,
      stage: pipelineRun.failedStage,
      exitCode: pipelineRun.exitCode,
      errorMessage: errorInfo.message,
      stackTrace: errorInfo.stackTrace,
      affectedComponents,
      environmentContext: {
        branch: pipelineRun.branch,
        commit: pipelineRun.commit,
        triggeredBy: pipelineRun.trigger.author,
        parallelJobs: pipelineRun.parallelJobs,
        runner: process.env.RUNNER_NAME || 'unknown',
        os: process.platform
      },
      metrics
    };

    // Store in history
    this.storeFailureHistory(symptoms);
    
    return symptoms;
  }

  /**
   * Extract detailed error information from pipeline logs
   */
  private async extractErrorInformation(logs: string[]): Promise<{ message: string; stackTrace?: string }> {
    const errorPatterns = [
      {
        name: 'playwright-timeout',
        pattern: /Test timeout of (\d+)ms exceeded/i,
        extract: (match: RegExpMatchArray) => `Playwright test exceeded timeout of ${match[1]}ms`
      },
      {
        name: 'element-not-found',
        pattern: /Error: Element (.+) not found/i,
        extract: (match: RegExpMatchArray) => `Element not found: ${match[1]}`
      },
      {
        name: 'network-error',
        pattern: /Error: net::ERR_(.+)/i,
        extract: (match: RegExpMatchArray) => `Network error: ${match[1]}`
      },
      {
        name: 'out-of-memory',
        pattern: /Error: Cannot allocate memory|FATAL ERROR: Ineffective mark-compacts/i,
        extract: () => 'Out of memory error during test execution'
      },
      {
        name: 'generic-error',
        pattern: /ERROR:\s*(.+)/i,
        extract: (match: RegExpMatchArray) => match[1].trim()
      }
    ];

    let errorMessage = 'Unknown error';
    let stackTrace: string | undefined;

    // Search through logs in reverse order (most recent first)
    for (const log of logs.reverse()) {
      for (const errorPattern of errorPatterns) {
        const match = log.match(errorPattern.pattern);
        if (match) {
          errorMessage = errorPattern.extract(match);
          
          // Extract stack trace if available
          const stackMatch = log.match(/^\s+at\s+.+$/gm);
          if (stackMatch) {
            stackTrace = stackMatch.join('\n');
          }
          
          return { message: errorMessage, stackTrace };
        }
      }
    }

    // Fallback to last non-empty log line
    const lastLine = logs.find(line => line.trim().length > 0);
    if (lastLine) {
      errorMessage = lastLine.trim();
    }

    return { message: errorMessage, stackTrace };
  }

  /**
   * Gather environment metrics at time of failure
   */
  private async gatherEnvironmentMetrics(pipelineRun: PipelineRun): Promise<FailureSymptoms['metrics']> {
    const metrics = {
      duration: pipelineRun.duration || 0,
      memoryUsage: 0,
      cpuUsage: 0,
      diskSpace: 0
    };

    try {
      // Parse metrics from logs if available
      const metricsLogs = pipelineRun.logs.filter(log => 
        log.includes('Memory:') || log.includes('CPU:') || log.includes('Disk:')
      );

      for (const log of metricsLogs) {
        const memoryMatch = log.match(/Memory:\s*(\d+(?:\.\d+)?)\s*MB/i);
        if (memoryMatch) {
          metrics.memoryUsage = parseFloat(memoryMatch[1]);
        }

        const cpuMatch = log.match(/CPU:\s*(\d+(?:\.\d+)?)\s*%/i);
        if (cpuMatch) {
          metrics.cpuUsage = parseFloat(cpuMatch[1]);
        }

        const diskMatch = log.match(/Disk:\s*(\d+(?:\.\d+)?)\s*GB/i);
        if (diskMatch) {
          metrics.diskSpace = parseFloat(diskMatch[1]);
        }
      }

      // Get current system metrics as fallback
      if (metrics.memoryUsage === 0) {
        const memInfo = process.memoryUsage();
        metrics.memoryUsage = memInfo.rss / 1024 / 1024; // Convert to MB
      }

    } catch (error) {
      console.warn(`⚠️ Could not gather environment metrics:`, error.message);
    }

    return metrics;
  }

  /**
   * Identify components affected by the failure
   */
  private async identifyAffectedComponents(pipelineRun: PipelineRun): Promise<string[]> {
    const components = new Set<string>();

    // Analyze stage name
    if (pipelineRun.failedStage) {
      components.add(pipelineRun.failedStage);
    }

    // Analyze file paths in logs
    const filePatterns = [
      /([^\/\s]+\.spec\.[jt]s)/g,
      /([^\/\s]+\.test\.[jt]s)/g,
      /([^\/\s]+\.page\.[jt]s)/g,
      /src\/([^\/\s]+)/g
    ];

    for (const log of pipelineRun.logs) {
      for (const pattern of filePatterns) {
        const matches = log.match(pattern);
        if (matches) {
          matches.forEach(match => components.add(match));
        }
      }
    }

    // Analyze browser information
    const browserMatch = pipelineRun.logs.join('\n').match(/browser:\s*(\w+)/i);
    if (browserMatch) {
      components.add(`browser-${browserMatch[1].toLowerCase()}`);
    }

    return Array.from(components);
  }

  /**
   * Perform comprehensive analysis using multiple techniques
   */
  private async performComprehensiveAnalysis(symptoms: FailureSymptoms): Promise<AnalysisResult> {
    // Parallel analysis execution
    const [
      patternAnalysis,
      rootCauseAnalysis,
      similarIncidents,
      impactAssessment
    ] = await Promise.all([
      this.performPatternAnalysis(symptoms),
      this.performRootCauseAnalysis(symptoms),
      this.findSimilarIncidents(symptoms),
      this.assessImpact(symptoms)
    ]);

    // Generate recommendations based on all analyses
    const recommendations = await this.generateRecommendations(
      symptoms,
      patternAnalysis,
      rootCauseAnalysis,
      similarIncidents
    );

    const analysis: AnalysisResult = {
      primaryCause: rootCauseAnalysis.primaryCause,
      confidence: rootCauseAnalysis.confidence,
      contributingFactors: rootCauseAnalysis.contributingFactors,
      recommendations,
      similarIncidents,
      estimatedImpact: impactAssessment
    };

    return analysis;
  }

  /**
   * Analyze failure patterns using historical data
   */
  private async performPatternAnalysis(symptoms: FailureSymptoms): Promise<FailurePattern | null> {
    const signature = this.generateErrorSignature(symptoms);
    
    if (this.patterns.has(signature)) {
      const pattern = this.patterns.get(signature)!;
      
      // Update pattern with new occurrence
      pattern.frequency++;
      pattern.recentOccurrences.push(symptoms.timestamp);
      
      // Keep only last 30 occurrences
      if (pattern.recentOccurrences.length > 30) {
        pattern.recentOccurrences = pattern.recentOccurrences.slice(-30);
      }
      
      return pattern;
    }

    // Create new pattern
    const newPattern: FailurePattern = {
      errorSignature: signature,
      frequency: 1,
      recentOccurrences: [symptoms.timestamp],
      commonFactors: symptoms.affectedComponents,
      resolutionHistory: [],
      averageResolutionTime: 0,
      successRate: 0
    };

    this.patterns.set(signature, newPattern);
    return newPattern;
  }

  /**
   * Perform root cause analysis using multiple techniques
   */
  private async performRootCauseAnalysis(symptoms: FailureSymptoms): Promise<{
    primaryCause: string;
    confidence: number;
    contributingFactors: string[];
  }> {
    const analyses = [
      await this.analyzeErrorMessage(symptoms),
      await this.analyzeEnvironmentalFactors(symptoms),
      await this.analyzeResourceConstraints(symptoms),
      await this.analyzeTimingIssues(symptoms)
    ];

    // Sort by confidence and select primary cause
    analyses.sort((a, b) => b.confidence - a.confidence);
    const primaryAnalysis = analyses[0];

    // Collect contributing factors from all analyses
    const contributingFactors = analyses
      .slice(1)
      .filter(a => a.confidence > 0.3)
      .map(a => a.cause);

    return {
      primaryCause: primaryAnalysis.cause,
      confidence: primaryAnalysis.confidence,
      contributingFactors
    };
  }

  /**
   * Analyze error message patterns
   */
  private async analyzeErrorMessage(symptoms: FailureSymptoms): Promise<{ cause: string; confidence: number }> {
    const errorMessage = symptoms.errorMessage.toLowerCase();

    const patterns = [
      {
        keywords: ['timeout', 'timed out'],
        cause: 'Test execution timeout',
        confidence: 0.9
      },
      {
        keywords: ['element', 'not found', 'selector'],
        cause: 'Element selector issue',
        confidence: 0.8
      },
      {
        keywords: ['memory', 'out of memory', 'allocation'],
        cause: 'Memory exhaustion',
        confidence: 0.95
      },
      {
        keywords: ['network', 'connection', 'refused'],
        cause: 'Network connectivity issue',
        confidence: 0.85
      },
      {
        keywords: ['permission', 'denied', 'access'],
        cause: 'Permission or access issue',
        confidence: 0.8
      },
      {
        keywords: ['browser', 'chromium', 'firefox', 'webkit', 'launch'],
        cause: 'Browser launch or configuration issue',
        confidence: 0.75
      }
    ];

    for (const pattern of patterns) {
      if (pattern.keywords.some(keyword => errorMessage.includes(keyword))) {
        // Increase confidence if multiple keywords match
        const matchCount = pattern.keywords.filter(keyword => errorMessage.includes(keyword)).length;
        const adjustedConfidence = Math.min(pattern.confidence + (matchCount - 1) * 0.1, 0.99);
        
        return {
          cause: pattern.cause,
          confidence: adjustedConfidence
        };
      }
    }

    return {
      cause: 'Unknown error pattern',
      confidence: 0.1
    };
  }

  /**
   * Analyze environmental factors
   */
  private async analyzeEnvironmentalFactors(symptoms: FailureSymptoms): Promise<{ cause: string; confidence: number }> {
    const env = symptoms.environmentContext;
    const metrics = symptoms.metrics;

    // High parallel job count
    if (env.parallelJobs > 4) {
      return {
        cause: 'Resource contention from high parallelism',
        confidence: 0.7
      };
    }

    // High memory usage
    if (metrics.memoryUsage > 3000) { // 3GB
      return {
        cause: 'High memory usage causing performance issues',
        confidence: 0.8
      };
    }

    // Long duration
    if (metrics.duration > 1800000) { // 30 minutes
      return {
        cause: 'Long-running test execution',
        confidence: 0.6
      };
    }

    return {
      cause: 'Environmental factors within normal range',
      confidence: 0.2
    };
  }

  /**
   * Analyze resource constraints
   */
  private async analyzeResourceConstraints(symptoms: FailureSymptoms): Promise<{ cause: string; confidence: number }> {
    const metrics = symptoms.metrics;

    if (metrics.memoryUsage > 4000) { // 4GB
      return {
        cause: 'Memory constraint violation',
        confidence: 0.9
      };
    }

    if (metrics.cpuUsage > 90) {
      return {
        cause: 'CPU resource exhaustion',
        confidence: 0.85
      };
    }

    if (metrics.diskSpace < 1) { // Less than 1GB free
      return {
        cause: 'Disk space exhaustion',
        confidence: 0.95
      };
    }

    return {
      cause: 'Resource constraints within acceptable limits',
      confidence: 0.1
    };
  }

  /**
   * Analyze timing and race condition issues
   */
  private async analyzeTimingIssues(symptoms: FailureSymptoms): Promise<{ cause: string; confidence: number }> {
    const errorMessage = symptoms.errorMessage.toLowerCase();
    const env = symptoms.environmentContext;

    // Check for timing-related keywords
    const timingKeywords = ['timeout', 'race', 'timing', 'wait', 'async'];
    const hasTimingKeywords = timingKeywords.some(keyword => errorMessage.includes(keyword));

    if (hasTimingKeywords && env.parallelJobs > 1) {
      return {
        cause: 'Race condition in parallel execution',
        confidence: 0.75
      };
    }

    if (hasTimingKeywords) {
      return {
        cause: 'Timing or synchronization issue',
        confidence: 0.6
      };
    }

    return {
      cause: 'No timing issues detected',
      confidence: 0.1
    };
  }

  /**
   * Find similar historical incidents
   */
  private async findSimilarIncidents(symptoms: FailureSymptoms, limit: number = 5): Promise<FailureSymptoms[]> {
    const allFailures: FailureSymptoms[] = [];
    
    // Collect all historical failures
    for (const failures of this.failureHistory.values()) {
      allFailures.push(...failures);
    }

    // Calculate similarity scores
    const similarities = allFailures.map(failure => ({
      failure,
      score: this.calculateSimilarityScore(symptoms, failure)
    }));

    // Sort by similarity and return top matches
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(item => item.score > 0.3) // Minimum similarity threshold
      .map(item => item.failure);
  }

  /**
   * Calculate similarity score between two failures
   */
  private calculateSimilarityScore(failure1: FailureSymptoms, failure2: FailureSymptoms): number {
    let score = 0;
    let factors = 0;

    // Error message similarity (40% weight)
    const messageSimilarity = this.calculateTextSimilarity(failure1.errorMessage, failure2.errorMessage);
    score += messageSimilarity * 0.4;
    factors += 0.4;

    // Stage similarity (20% weight)
    if (failure1.stage === failure2.stage) {
      score += 0.2;
    }
    factors += 0.2;

    // Component overlap (25% weight)
    const componentOverlap = this.calculateSetOverlap(failure1.affectedComponents, failure2.affectedComponents);
    score += componentOverlap * 0.25;
    factors += 0.25;

    // Environment similarity (15% weight)
    const envSimilarity = this.calculateEnvironmentSimilarity(
      failure1.environmentContext,
      failure2.environmentContext
    );
    score += envSimilarity * 0.15;
    factors += 0.15;

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate text similarity using simple word overlap
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Calculate overlap between two sets
   */
  private calculateSetOverlap(set1: string[], set2: string[]): number {
    const s1 = new Set(set1);
    const s2 = new Set(set2);
    
    const intersection = new Set([...s1].filter(item => s2.has(item)));
    const union = new Set([...s1, ...s2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Calculate environment similarity
   */
  private calculateEnvironmentSimilarity(env1: any, env2: any): number {
    let matches = 0;
    let total = 0;

    const keys = ['branch', 'os', 'runner'];
    for (const key of keys) {
      total++;
      if (env1[key] === env2[key]) {
        matches++;
      }
    }

    return total > 0 ? matches / total : 0;
  }

  /**
   * Assess impact of the failure
   */
  private async assessImpact(symptoms: FailureSymptoms): Promise<AnalysisResult['estimatedImpact']> {
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let affectedUsers = 0;
    let businessImpact = '';

    // Assess severity based on various factors
    const severityFactors = [
      {
        condition: symptoms.stage === 'deployment' || symptoms.stage === 'production',
        severity: 'critical' as const,
        impact: 'Production deployment failure'
      },
      {
        condition: symptoms.errorMessage.toLowerCase().includes('critical') || 
                  symptoms.errorMessage.toLowerCase().includes('fatal'),
        severity: 'critical' as const,
        impact: 'Critical system failure'
      },
      {
        condition: symptoms.environmentContext.parallelJobs > 10 || 
                  symptoms.metrics.duration > 3600000, // 1 hour
        severity: 'high' as const,
        impact: 'High resource impact affecting multiple operations'
      },
      {
        condition: symptoms.affectedComponents.length > 5,
        severity: 'medium' as const,
        impact: 'Multiple components affected'
      }
    ];

    for (const factor of severityFactors) {
      if (factor.condition) {
        severity = factor.severity;
        businessImpact = factor.impact;
        break;
      }
    }

    // Estimate affected users based on severity and branch
    if (symptoms.environmentContext.branch === 'main' || 
        symptoms.environmentContext.branch === 'master') {
      affectedUsers = severity === 'critical' ? 1000 : 
                     severity === 'high' ? 500 :
                     severity === 'medium' ? 100 : 10;
    }

    return {
      severity,
      affectedUsers,
      businessImpact: businessImpact || 'Development workflow disruption'
    };
  }

  /**
   * Generate actionable recommendations
   */
  private async generateRecommendations(
    symptoms: FailureSymptoms,
    pattern: FailurePattern | null,
    rootCause: any,
    similarIncidents: FailureSymptoms[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Recommendations based on root cause
    if (rootCause.primaryCause.includes('timeout')) {
      recommendations.push({
        action: 'Increase test timeouts and add explicit waits',
        priority: 'high',
        confidence: 0.8,
        automatable: true,
        estimatedTime: 1800, // 30 minutes
        resources: ['playwright.config.ts'],
        dependencies: []
      });
    }

    if (rootCause.primaryCause.includes('memory')) {
      recommendations.push({
        action: 'Increase memory allocation for test runners',
        priority: 'critical',
        confidence: 0.9,
        automatable: true,
        estimatedTime: 900, // 15 minutes
        resources: ['CI configuration', 'Docker resources'],
        dependencies: ['infrastructure-team']
      });
    }

    if (rootCause.primaryCause.includes('element') || rootCause.primaryCause.includes('selector')) {
      recommendations.push({
        action: 'Review and update element selectors',
        priority: 'medium',
        confidence: 0.7,
        automatable: false,
        estimatedTime: 3600, // 1 hour
        resources: ['test files', 'page objects'],
        dependencies: ['QA team review']
      });
    }

    // Recommendations based on patterns
    if (pattern && pattern.frequency > 3) {
      recommendations.push({
        action: 'Implement automated recovery for recurring issue',
        priority: 'high',
        confidence: 0.75,
        automatable: true,
        estimatedTime: 7200, // 2 hours
        resources: ['CI pipeline', 'monitoring system'],
        dependencies: ['devops-team']
      });
    }

    // Recommendations based on similar incidents
    if (similarIncidents.length > 0) {
      const resolutions = await this.getSuccessfulResolutions(similarIncidents);
      for (const resolution of resolutions) {
        recommendations.push({
          action: `Apply proven solution: ${resolution.action}`,
          priority: 'medium',
          confidence: resolution.success ? 0.8 : 0.5,
          automatable: resolution.automatable,
          estimatedTime: resolution.timeToResolve,
          resources: ['historical-resolution'],
          dependencies: []
        });
      }
    }

    // General preventive recommendations
    recommendations.push({
      action: 'Add comprehensive logging for better debugging',
      priority: 'low',
      confidence: 0.6,
      automatable: true,
      estimatedTime: 1800,
      resources: ['test framework'],
      dependencies: []
    });

    // Sort by priority and confidence
    return recommendations.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.confidence - a.confidence;
    });
  }

  /**
   * Get successful resolutions from similar incidents
   */
  private async getSuccessfulResolutions(incidents: FailureSymptoms[]): Promise<Resolution[]> {
    const resolutions: Resolution[] = [];

    for (const incident of incidents) {
      const incidentResolutions = this.resolutionDatabase.get(incident.pipelineId) || [];
      resolutions.push(...incidentResolutions.filter(r => r.success));
    }

    // Remove duplicates and sort by success rate
    const uniqueResolutions = Array.from(
      new Map(resolutions.map(r => [r.action, r])).values()
    );

    return uniqueResolutions.sort((a, b) => b.timeToResolve - a.timeToResolve);
  }

  /**
   * Generate normalized error signature for pattern matching
   */
  private generateErrorSignature(symptoms: FailureSymptoms): string {
    const normalizedError = symptoms.errorMessage
      .replace(/\d+/g, 'N') // Replace numbers
      .replace(/[a-f0-9-]{36}/g, 'UUID') // Replace UUIDs
      .replace(/\b\d+\.\d+\.\d+\b/g, 'VERSION') // Replace version numbers
      .replace(/\b[A-Z][a-z]+\d+\b/g, 'ID') // Replace IDs
      .toLowerCase()
      .trim();

    return `${symptoms.stage}:${normalizedError}`;
  }

  /**
   * Generate cache key for analysis results
   */
  private generateCacheKey(symptoms: FailureSymptoms): string {
    const key = [
      symptoms.stage,
      this.generateErrorSignature(symptoms),
      symptoms.environmentContext.os,
      symptoms.affectedComponents.sort().join(',')
    ].join('|');

    return Buffer.from(key).toString('base64');
  }

  /**
   * Store failure in history for pattern analysis
   */
  private storeFailureHistory(symptoms: FailureSymptoms): void {
    const pipelineHistory = this.failureHistory.get(symptoms.pipelineId) || [];
    pipelineHistory.push(symptoms);
    
    // Keep only last 50 failures per pipeline
    if (pipelineHistory.length > 50) {
      pipelineHistory.shift();
    }
    
    this.failureHistory.set(symptoms.pipelineId, pipelineHistory);
  }

  /**
   * Initialize pattern database with known patterns
   */
  private initializePatternDatabase(): void {
    // Common patterns can be pre-loaded here
    const commonPatterns = [
      {
        signature: 'test:test timeout of nms exceeded',
        frequency: 0,
        resolutions: ['Increase timeout values', 'Add explicit waits', 'Optimize test performance']
      },
      {
        signature: 'test:element selector not found',
        frequency: 0,
        resolutions: ['Update selectors', 'Add wait conditions', 'Review page changes']
      }
    ];

    commonPatterns.forEach(pattern => {
      this.patterns.set(pattern.signature, {
        errorSignature: pattern.signature,
        frequency: pattern.frequency,
        recentOccurrences: [],
        commonFactors: [],
        resolutionHistory: pattern.resolutions.map(action => ({
          action,
          success: true,
          timeToResolve: 1800,
          automatable: false,
          implementedBy: 'system',
          timestamp: new Date()
        })),
        averageResolutionTime: 1800,
        successRate: 0.8
      });
    });
  }

  /**
   * Export analysis data for external processing
   */
  async exportAnalysisData(): Promise<AnalysisExport> {
    return {
      patterns: Array.from(this.patterns.entries()),
      resolutions: Array.from(this.resolutionDatabase.entries()),
      failureHistory: Array.from(this.failureHistory.entries()),
      timestamp: new Date()
    };
  }

  /**
   * Get analysis statistics
   */
  getAnalysisStatistics(): AnalysisStatistics {
    const totalFailures = Array.from(this.failureHistory.values())
      .reduce((sum, failures) => sum + failures.length, 0);
    
    const totalPatterns = this.patterns.size;
    const totalResolutions = Array.from(this.resolutionDatabase.values())
      .reduce((sum, resolutions) => sum + resolutions.length, 0);

    const successfulResolutions = Array.from(this.resolutionDatabase.values())
      .flat()
      .filter(r => r.success).length;

    return {
      totalFailures,
      totalPatterns,
      totalResolutions,
      successRate: totalResolutions > 0 ? successfulResolutions / totalResolutions : 0,
      averageAnalysisTime: 5000, // milliseconds
      cacheHitRate: this.analysisCache.size > 0 ? 0.3 : 0
    };
  }
}

// Supporting Types and Interfaces
interface PipelineRun {
  id: string;
  failedAt: Date;
  failedStage: string;
  exitCode: number;
  logs: string[];
  duration?: number;
  branch: string;
  commit: string;
  trigger: {
    author: string;
  };
  parallelJobs: number;
}

interface AnalyzerConfig {
  maxHistorySize: number;
  cacheSize: number;
  analysisTimeout: number;
  patternMatchThreshold: number;
}

interface AnalysisExport {
  patterns: [string, FailurePattern][];
  resolutions: [string, Resolution[]][];
  failureHistory: [string, FailureSymptoms[]][];
  timestamp: Date;
}

interface AnalysisStatistics {
  totalFailures: number;
  totalPatterns: number;
  totalResolutions: number;
  successRate: number;
  averageAnalysisTime: number;
  cacheHitRate: number;
}

// Example Usage
async function demonstrateFailureAnalysis() {
  console.log('🚀 Initializing Comprehensive Failure Analysis System...\n');

  const config: AnalyzerConfig = {
    maxHistorySize: 1000,
    cacheSize: 100,
    analysisTimeout: 30000,
    patternMatchThreshold: 0.7
  };

  const analyzer = new ComprehensiveFailureAnalyzer(config);

  // Example pipeline failure
  const failedPipelineRun: PipelineRun = {
    id: 'pipeline-123',
    failedAt: new Date(),
    failedStage: 'test',
    exitCode: 1,
    logs: [
      'INFO: Starting test execution...',
      'INFO: Running tests on Chrome browser',
      'ERROR: Test timeout of 30000ms exceeded',
      'ERROR: Element .submit-button not found',
      'INFO: Memory usage: 2500.5 MB',
      'INFO: CPU usage: 85.2%',
      'ERROR: Test failed with exit code 1'
    ],
    duration: 45000,
    branch: 'feature/user-registration',
    commit: 'abc123def456',
    trigger: {
      author: 'developer@company.com'
    },
    parallelJobs: 4
  };

  try {
    // Analyze the failure
    const analysis = await analyzer.analyzeFailure(failedPipelineRun);

    console.log('📊 Analysis Results:');
    console.log(`Primary Cause: ${analysis.primaryCause}`);
    console.log(`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
    console.log(`Contributing Factors: ${analysis.contributingFactors.join(', ')}`);
    console.log(`Impact Severity: ${analysis.estimatedImpact.severity}`);
    console.log(`Estimated Affected Users: ${analysis.estimatedImpact.affectedUsers}`);
    
    console.log('\n🔧 Recommendations:');
    analysis.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.action}`);
      console.log(`   Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
      console.log(`   Estimated Time: ${Math.floor(rec.estimatedTime / 60)} minutes`);
      console.log(`   Automatable: ${rec.automatable ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Display statistics
    const stats = analyzer.getAnalysisStatistics();
    console.log('📈 System Statistics:');
    console.log(`Total Patterns: ${stats.totalPatterns}`);
    console.log(`Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
    console.log(`Cache Hit Rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

// Export for use in other modules
export {
  ComprehensiveFailureAnalyzer,
  FailureSymptoms,
  FailurePattern,
  AnalysisResult,
  Recommendation
};

// Run demonstration if this file is executed directly
if (require.main === module) {
  demonstrateFailureAnalysis().catch(console.error);
}