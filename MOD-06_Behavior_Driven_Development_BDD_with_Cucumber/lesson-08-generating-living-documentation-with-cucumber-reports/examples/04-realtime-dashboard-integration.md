# Example 04: Real-time Dashboard Integration

## Overview

This example demonstrates how to create real-time dashboards that provide live monitoring of test execution progress. You'll learn to build WebSocket-based systems that update stakeholders in real-time, integrate with CI/CD pipelines for live feedback, and create responsive monitoring interfaces that scale with your testing infrastructure.

**Duration**: 60 minutes  
**Complexity**: Advanced  
**Prerequisites**: Completion of Examples 01-03 (Basic, Advanced, and Custom Reports)  

---

## Learning Objectives

By completing this example, you will master:

- ✅ **WebSocket Integration**: Build real-time communication systems for live updates
- ✅ **Live Test Monitoring**: Create dashboards that update during test execution
- ✅ **CI/CD Integration**: Connect dashboards to continuous integration pipelines
- ✅ **Progressive Updates**: Implement efficient data streaming and state management
- ✅ **Multi-Client Support**: Handle multiple dashboard clients with synchronized updates
- ✅ **Historical Trending**: Integrate real-time data with historical analysis

---

## Real-time Dashboard Architecture

### 1. WebSocket Server for Live Updates

Create a WebSocket server that streams test execution data:

```javascript
// src/dashboard/websocket-server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');

/**
 * Real-time Dashboard WebSocket Server
 */
class DashboardWebSocketServer {
  constructor(options = {}) {
    this.options = {
      port: options.port || 8080,
      staticDir: options.staticDir || 'dashboard/',
      dataDir: options.dataDir || 'reports/json/',
      updateInterval: options.updateInterval || 1000, // 1 second
      maxClients: options.maxClients || 100,
      enableAuthentication: options.enableAuthentication || false,
      authToken: options.authToken || null,
      ...options
    };

    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    this.clients = new Set();
    this.testSessions = new Map();
    this.executionState = {
      isRunning: false,
      currentFeature: null,
      currentScenario: null,
      startTime: null,
      statistics: {
        totalFeatures: 0,
        totalScenarios: 0,
        completedScenarios: 0,
        passedScenarios: 0,
        failedScenarios: 0,
        skippedScenarios: 0,
        currentProgress: 0
      }
    };

    this.setupExpress();
    this.setupWebSocket();
    this.startFileWatcher();
  }

  /**
   * Setup Express server for static files and API endpoints
   */
  setupExpress() {
    // Serve static dashboard files
    this.app.use(express.static(this.options.staticDir));
    
    // API endpoints
    this.app.use(express.json());
    
    // Get current execution state
    this.app.get('/api/state', (req, res) => {
      res.json({
        executionState: this.executionState,
        connectedClients: this.clients.size,
        activeSessions: this.testSessions.size
      });
    });
    
    // Get historical data
    this.app.get('/api/history', async (req, res) => {
      try {
        const history = await this.getHistoricalData();
        res.json(history);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Manual test trigger (for demo purposes)
    this.app.post('/api/trigger-test', (req, res) => {
      this.simulateTestExecution();
      res.json({ message: 'Test execution triggered' });
    });
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        clients: this.clients.size,
        memory: process.memoryUsage()
      });
    });
  }

  /**
   * Setup WebSocket server with client management
   */
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log(`📱 New client connected from ${req.socket.remoteAddress}`);
      
      // Authentication check
      if (this.options.enableAuthentication) {
        const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
        if (token !== this.options.authToken) {
          ws.close(1008, 'Authentication failed');
          return;
        }
      }
      
      // Add client to set
      this.clients.add(ws);
      
      // Send initial state
      this.sendToClient(ws, {
        type: 'initial_state',
        data: this.executionState,
        timestamp: moment().toISOString()
      });
      
      // Handle client messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('Invalid message from client:', error.message);
        }
      });
      
      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`📱 Client disconnected. Active clients: ${this.clients.size}`);
      });
      
      // Handle client errors
      ws.on('error', (error) => {
        console.error('WebSocket client error:', error.message);
        this.clients.delete(ws);
      });
    });
    
    // Broadcast updates periodically
    setInterval(() => {
      this.broadcastUpdate();
    }, this.options.updateInterval);
  }

  /**
   * Handle messages from clients
   */
  handleClientMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        this.handleSubscription(ws, data.filter);
        break;
        
      case 'unsubscribe':
        this.handleUnsubscription(ws, data.filter);
        break;
        
      case 'request_history':
        this.sendHistoryToClient(ws, data.period);
        break;
        
      case 'ping':
        this.sendToClient(ws, { type: 'pong', timestamp: moment().toISOString() });
        break;
        
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  /**
   * Start watching for test result files
   */
  startFileWatcher() {
    const chokidar = require('chokidar');
    
    const watcher = chokidar.watch(
      path.join(this.options.dataDir, '*.json'),
      { ignoreInitial: false }
    );
    
    watcher.on('add', (filePath) => {
      this.processNewTestFile(filePath);
    });
    
    watcher.on('change', (filePath) => {
      this.processUpdatedTestFile(filePath);
    });
    
    console.log(`👁️  Watching for test files in: ${this.options.dataDir}`);
  }

  /**
   * Process new test result file
   */
  async processNewTestFile(filePath) {
    try {
      const data = await fs.readJson(filePath);
      const sessionId = path.basename(filePath, '.json');
      
      // Start new test session
      this.testSessions.set(sessionId, {
        startTime: moment().toISOString(),
        filePath,
        lastUpdate: moment().toISOString(),
        features: data
      });
      
      // Update execution state
      this.updateExecutionState(data, 'started');
      
      // Broadcast update
      this.broadcastTestUpdate('session_started', {
        sessionId,
        features: data.length,
        startTime: moment().toISOString()
      });
      
    } catch (error) {
      console.error('Error processing new test file:', error.message);
    }
  }

  /**
   * Process updated test result file
   */
  async processUpdatedTestFile(filePath) {
    try {
      const data = await fs.readJson(filePath);
      const sessionId = path.basename(filePath, '.json');
      
      // Update existing session
      if (this.testSessions.has(sessionId)) {
        const session = this.testSessions.get(sessionId);
        session.features = data;
        session.lastUpdate = moment().toISOString();
        
        // Update execution state
        this.updateExecutionState(data, 'updated');
        
        // Broadcast update
        this.broadcastTestUpdate('session_updated', {
          sessionId,
          features: data,
          lastUpdate: moment().toISOString()
        });
      }
      
    } catch (error) {
      console.error('Error processing updated test file:', error.message);
    }
  }

  /**
   * Update execution state based on test data
   */
  updateExecutionState(features, eventType) {
    const stats = this.calculateLiveStatistics(features);
    
    this.executionState = {
      ...this.executionState,
      isRunning: eventType !== 'completed',
      statistics: stats,
      lastUpdate: moment().toISOString()
    };
    
    // Determine current execution status
    if (features.length > 0) {
      const currentFeature = features.find(f => 
        f.elements?.some(e => !e.steps?.every(s => s.result))
      );
      
      if (currentFeature) {
        this.executionState.currentFeature = currentFeature.name;
        
        const currentScenario = currentFeature.elements?.find(e => 
          !e.steps?.every(s => s.result)
        );
        
        if (currentScenario) {
          this.executionState.currentScenario = currentScenario.name;
        }
      }
    }
  }

  /**
   * Calculate live statistics from test data
   */
  calculateLiveStatistics(features) {
    const stats = {
      totalFeatures: features.length,
      totalScenarios: 0,
      completedScenarios: 0,
      passedScenarios: 0,
      failedScenarios: 0,
      skippedScenarios: 0,
      currentProgress: 0,
      estimatedTimeRemaining: 0
    };

    features.forEach(feature => {
      feature.elements?.forEach(scenario => {
        stats.totalScenarios++;
        
        // Check if scenario is completed
        const allStepsHaveResults = scenario.steps?.every(step => step.result);
        
        if (allStepsHaveResults) {
          stats.completedScenarios++;
          
          // Determine scenario status
          const hasFailedStep = scenario.steps.some(step => step.result?.status === 'failed');
          const hasSkippedStep = scenario.steps.some(step => step.result?.status === 'skipped');
          
          if (hasFailedStep) {
            stats.failedScenarios++;
          } else if (hasSkippedStep) {
            stats.skippedScenarios++;
          } else {
            stats.passedScenarios++;
          }
        }
      });
    });
    
    // Calculate progress percentage
    if (stats.totalScenarios > 0) {
      stats.currentProgress = Math.round((stats.completedScenarios / stats.totalScenarios) * 100);
    }
    
    return stats;
  }

  /**
   * Broadcast updates to all connected clients
   */
  broadcastUpdate() {
    if (this.clients.size === 0) return;
    
    const updateData = {
      type: 'live_update',
      data: {
        executionState: this.executionState,
        timestamp: moment().toISOString(),
        clientCount: this.clients.size
      }
    };
    
    this.broadcastToAllClients(updateData);
  }

  /**
   * Broadcast test-specific updates
   */
  broadcastTestUpdate(eventType, data) {
    const updateData = {
      type: eventType,
      data: {
        ...data,
        executionState: this.executionState
      },
      timestamp: moment().toISOString()
    };
    
    this.broadcastToAllClients(updateData);
  }

  /**
   * Send message to all connected clients
   */
  broadcastToAllClients(data) {
    const message = JSON.stringify(data);
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      } else {
        this.clients.delete(client);
      }
    });
  }

  /**
   * Send message to specific client
   */
  sendToClient(client, data) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

  /**
   * Simulate test execution for demo purposes
   */
  simulateTestExecution() {
    console.log('🎭 Simulating test execution...');
    
    const features = ['Login', 'Navigation', 'Checkout', 'Profile'];
    let currentFeature = 0;
    let currentScenario = 0;
    
    this.executionState.isRunning = true;
    this.executionState.startTime = moment().toISOString();
    this.executionState.statistics.totalScenarios = 20;
    
    const simulationInterval = setInterval(() => {
      if (currentFeature >= features.length) {
        // Simulation complete
        this.executionState.isRunning = false;
        this.executionState.currentFeature = null;
        this.executionState.currentScenario = null;
        
        this.broadcastTestUpdate('simulation_complete', {
          duration: moment().diff(this.executionState.startTime, 'seconds')
        });
        
        clearInterval(simulationInterval);
        return;
      }
      
      // Update current execution
      this.executionState.currentFeature = features[currentFeature];
      this.executionState.currentScenario = `Scenario ${currentScenario + 1}`;
      this.executionState.statistics.completedScenarios++;
      this.executionState.statistics.currentProgress = Math.round(
        (this.executionState.statistics.completedScenarios / 20) * 100
      );
      
      // Randomly pass/fail scenarios
      if (Math.random() > 0.1) {
        this.executionState.statistics.passedScenarios++;
      } else {
        this.executionState.statistics.failedScenarios++;
      }
      
      currentScenario++;
      if (currentScenario >= 5) {
        currentFeature++;
        currentScenario = 0;
      }
      
    }, 2000); // Update every 2 seconds
  }

  /**
   * Get historical test data
   */
  async getHistoricalData() {
    // In production, this would query a database
    return {
      trends: {
        passRate: [85, 87, 92, 88, 90, 95, 93],
        executionTime: [120, 115, 108, 125, 118, 110, 105],
        testCount: [150, 152, 155, 158, 160, 162, 165]
      },
      recentRuns: [
        {
          timestamp: moment().subtract(1, 'hour').toISOString(),
          passRate: 93,
          duration: 105,
          totalTests: 165
        },
        {
          timestamp: moment().subtract(3, 'hours').toISOString(),
          passRate: 95,
          duration: 110,
          totalTests: 162
        }
      ]
    };
  }

  /**
   * Start the server
   */
  start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.options.port, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`🚀 Dashboard server started on port ${this.options.port}`);
          console.log(`📊 Dashboard: http://localhost:${this.options.port}`);
          console.log(`🔌 WebSocket: ws://localhost:${this.options.port}`);
          resolve();
        }
      });
    });
  }

  /**
   * Stop the server
   */
  stop() {
    return new Promise((resolve) => {
      this.clients.forEach(client => {
        client.close(1001, 'Server shutting down');
      });
      
      this.server.close(() => {
        console.log('🛑 Dashboard server stopped');
        resolve();
      });
    });
  }
}

module.exports = DashboardWebSocketServer;
```

### 2. Real-time Dashboard Frontend

Create an interactive dashboard that connects to the WebSocket server:

```html
<!-- dashboard/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Test Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
    <style>
        .dashboard-card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .dashboard-card:hover {
            transform: translateY(-2px);
        }
        
        .metric-display {
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
        }
        
        .status-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 10px;
        }
        
        .status-running { background-color: #28a745; animation: pulse 1.5s infinite; }
        .status-idle { background-color: #6c757d; }
        .status-error { background-color: #dc3545; }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .progress-ring {
            transform: rotate(-90deg);
        }
        
        .progress-ring-circle {
            transition: stroke-dashoffset 0.35s;
            transform-origin: 50% 50%;
        }
        
        .connection-status {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .test-log {
            height: 300px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 14px;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
        }
        
        .log-entry {
            margin: 5px 0;
            padding: 5px 10px;
            border-radius: 5px;
        }
        
        .log-info { background: #cce5ff; }
        .log-success { background: #d4edda; }
        .log-warning { background: #fff3cd; }
        .log-error { background: #f8d7da; }
        
        .metric-card {
            text-align: center;
            padding: 20px;
        }
        
        .chart-container {
            position: relative;
            height: 300px;
        }
    </style>
</head>
<body>
    <!-- Connection Status -->
    <div class="connection-status">
        <span id="connectionStatus" class="badge bg-secondary">
            <i class="fas fa-circle"></i> Connecting...
        </span>
    </div>

    <div class="container-fluid py-4">
        <!-- Header -->
        <div class="row mb-4">
            <div class="col-md-8">
                <h1><i class="fas fa-tachometer-alt"></i> Live Test Dashboard</h1>
                <p class="text-muted">Real-time monitoring of automated test execution</p>
            </div>
            <div class="col-md-4 text-end">
                <button id="simulateBtn" class="btn btn-primary">
                    <i class="fas fa-play"></i> Simulate Test
                </button>
                <button id="refreshBtn" class="btn btn-outline-secondary">
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>
        </div>

        <!-- Status Cards -->
        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card dashboard-card">
                    <div class="card-body metric-card">
                        <div class="d-flex align-items-center justify-content-center mb-2">
                            <span id="executionStatus" class="status-indicator status-idle"></span>
                            <h5 class="mb-0">Execution Status</h5>
                        </div>
                        <div id="executionStatusText" class="text-muted">Idle</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card dashboard-card">
                    <div class="card-body metric-card">
                        <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                        <div id="passedCount" class="metric-display text-success">0</div>
                        <div class="text-muted">Passed</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card dashboard-card">
                    <div class="card-body metric-card">
                        <i class="fas fa-times-circle fa-2x text-danger mb-2"></i>
                        <div id="failedCount" class="metric-display text-danger">0</div>
                        <div class="text-muted">Failed</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card dashboard-card">
                    <div class="card-body metric-card">
                        <i class="fas fa-clock fa-2x text-info mb-2"></i>
                        <div id="totalCount" class="metric-display text-info">0</div>
                        <div class="text-muted">Total Tests</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Progress and Current Status -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card dashboard-card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-line"></i> Execution Progress</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-center mb-3">
                            <svg class="progress-ring" width="120" height="120">
                                <circle class="progress-ring-circle" 
                                        stroke="#e6e6e6" 
                                        stroke-width="8" 
                                        fill="transparent" 
                                        r="52" 
                                        cx="60" 
                                        cy="60"/>
                                <circle id="progressCircle" 
                                        class="progress-ring-circle" 
                                        stroke="#28a745" 
                                        stroke-width="8" 
                                        fill="transparent" 
                                        r="52" 
                                        cx="60" 
                                        cy="60"
                                        stroke-dasharray="326.73"
                                        stroke-dashoffset="326.73"/>
                                <text x="60" y="65" text-anchor="middle" 
                                      font-size="20" font-weight="bold" 
                                      id="progressText">0%</text>
                            </svg>
                        </div>
                        <div class="text-center">
                            <p class="mb-1"><strong>Current Feature:</strong> <span id="currentFeature">-</span></p>
                            <p class="mb-0"><strong>Current Scenario:</strong> <span id="currentScenario">-</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card dashboard-card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-bar"></i> Test Distribution</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="distributionChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Live Log and Historical Trends -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card dashboard-card">
                    <div class="card-header">
                        <h5><i class="fas fa-terminal"></i> Live Execution Log</h5>
                        <button id="clearLogBtn" class="btn btn-sm btn-outline-secondary">
                            <i class="fas fa-trash"></i> Clear
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="testLog" class="test-log"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card dashboard-card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-area"></i> Historical Trends</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="trendsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Stats Table -->
        <div class="row">
            <div class="col-12">
                <div class="card dashboard-card">
                    <div class="card-header">
                        <h5><i class="fas fa-table"></i> Current Session Details</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Metric</th>
                                        <th>Value</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="sessionDetailsTable">
                                    <tr>
                                        <td>Session Start Time</td>
                                        <td id="sessionStart">-</td>
                                        <td><span class="badge bg-info">N/A</span></td>
                                    </tr>
                                    <tr>
                                        <td>Elapsed Time</td>
                                        <td id="elapsedTime">-</td>
                                        <td><span class="badge bg-info">N/A</span></td>
                                    </tr>
                                    <tr>
                                        <td>Connected Clients</td>
                                        <td id="connectedClients">1</td>
                                        <td><span class="badge bg-success">Active</span></td>
                                    </tr>
                                    <tr>
                                        <td>Average Test Duration</td>
                                        <td id="avgDuration">-</td>
                                        <td><span class="badge bg-info">N/A</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- WebSocket and Dashboard JavaScript -->
    <script src="dashboard.js"></script>
</body>
</html>
```

### 3. Dashboard JavaScript Controller

Create the client-side JavaScript that handles WebSocket communication:

```javascript
// dashboard/dashboard.js
class LiveTestDashboard {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
    
    this.charts = {};
    this.executionState = {};
    this.logEntries = [];
    
    this.init();
  }

  /**
   * Initialize dashboard
   */
  init() {
    this.setupWebSocket();
    this.setupEventListeners();
    this.setupCharts();
    this.startUpdateTimer();
  }

  /**
   * Setup WebSocket connection
   */
  setupWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.updateConnectionStatus('connected');
      this.reconnectAttempts = 0;
      
      // Send ping to maintain connection
      setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.updateConnectionStatus('disconnected');
      this.attemptReconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.updateConnectionStatus('error');
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleWebSocketMessage(data) {
    switch (data.type) {
      case 'initial_state':
        this.handleInitialState(data.data);
        break;
        
      case 'live_update':
        this.handleLiveUpdate(data.data);
        break;
        
      case 'session_started':
        this.handleSessionStarted(data.data);
        break;
        
      case 'session_updated':
        this.handleSessionUpdated(data.data);
        break;
        
      case 'simulation_complete':
        this.handleSimulationComplete(data.data);
        break;
        
      case 'pong':
        // Handle ping response
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  /**
   * Handle initial state from server
   */
  handleInitialState(state) {
    this.executionState = state;
    this.updateUI();
    this.addLogEntry('info', 'Connected to dashboard server');
  }

  /**
   * Handle live updates
   */
  handleLiveUpdate(data) {
    this.executionState = data.executionState;
    this.updateUI();
    
    // Update connected clients count
    document.getElementById('connectedClients').textContent = data.clientCount || 1;
  }

  /**
   * Handle session started event
   */
  handleSessionStarted(data) {
    this.addLogEntry('info', `New test session started: ${data.sessionId}`);
    this.addLogEntry('info', `Total features: ${data.features}`);
  }

  /**
   * Handle session updated event
   */
  handleSessionUpdated(data) {
    this.addLogEntry('success', `Session updated: ${data.sessionId}`);
  }

  /**
   * Handle simulation complete event
   */
  handleSimulationComplete(data) {
    this.addLogEntry('success', `Test execution completed in ${data.duration} seconds`);
  }

  /**
   * Update connection status indicator
   */
  updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    
    switch (status) {
      case 'connected':
        statusElement.className = 'badge bg-success';
        statusElement.innerHTML = '<i class="fas fa-circle"></i> Connected';
        break;
      case 'disconnected':
        statusElement.className = 'badge bg-warning';
        statusElement.innerHTML = '<i class="fas fa-circle"></i> Disconnected';
        break;
      case 'error':
        statusElement.className = 'badge bg-danger';
        statusElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
        break;
      default:
        statusElement.className = 'badge bg-secondary';
        statusElement.innerHTML = '<i class="fas fa-circle"></i> Connecting...';
    }
  }

  /**
   * Attempt to reconnect WebSocket
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.setupWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.updateConnectionStatus('error');
    }
  }

  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    // Simulate test button
    document.getElementById('simulateBtn').addEventListener('click', () => {
      fetch('/api/trigger-test', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          this.addLogEntry('info', 'Test simulation triggered');
        })
        .catch(error => {
          this.addLogEntry('error', 'Failed to trigger test simulation');
        });
    });
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
      location.reload();
    });
    
    // Clear log button
    document.getElementById('clearLogBtn').addEventListener('click', () => {
      this.clearLog();
    });
  }

  /**
   * Setup Chart.js charts
   */
  setupCharts() {
    // Distribution Chart (Doughnut)
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    this.charts.distribution = new Chart(distributionCtx, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Skipped', 'Pending'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#6c757d'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    
    // Trends Chart (Line)
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    this.charts.trends = new Chart(trendsCtx, {
      type: 'line',
      data: {
        labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
        datasets: [{
          label: 'Pass Rate %',
          data: [85, 87, 92, 88, 90, 95, 93],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  /**
   * Update UI with current execution state
   */
  updateUI() {
    const stats = this.executionState.statistics || {};
    
    // Update metric cards
    document.getElementById('passedCount').textContent = stats.passedScenarios || 0;
    document.getElementById('failedCount').textContent = stats.failedScenarios || 0;
    document.getElementById('totalCount').textContent = stats.totalScenarios || 0;
    
    // Update execution status
    const statusIndicator = document.getElementById('executionStatus');
    const statusText = document.getElementById('executionStatusText');
    
    if (this.executionState.isRunning) {
      statusIndicator.className = 'status-indicator status-running';
      statusText.textContent = 'Running';
    } else {
      statusIndicator.className = 'status-indicator status-idle';
      statusText.textContent = 'Idle';
    }
    
    // Update progress ring
    this.updateProgressRing(stats.currentProgress || 0);
    
    // Update current execution info
    document.getElementById('currentFeature').textContent = 
      this.executionState.currentFeature || '-';
    document.getElementById('currentScenario').textContent = 
      this.executionState.currentScenario || '-';
    
    // Update distribution chart
    if (this.charts.distribution) {
      this.charts.distribution.data.datasets[0].data = [
        stats.passedScenarios || 0,
        stats.failedScenarios || 0,
        stats.skippedScenarios || 0,
        (stats.totalScenarios || 0) - (stats.completedScenarios || 0)
      ];
      this.charts.distribution.update('none');
    }
    
    // Update session details
    if (this.executionState.startTime) {
      document.getElementById('sessionStart').textContent = 
        new Date(this.executionState.startTime).toLocaleString();
    }
  }

  /**
   * Update progress ring
   */
  updateProgressRing(percentage) {
    const circle = document.getElementById('progressCircle');
    const text = document.getElementById('progressText');
    
    const circumference = 2 * Math.PI * 52; // radius = 52
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
    text.textContent = `${percentage}%`;
  }

  /**
   * Add entry to live log
   */
  addLogEntry(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = {
      timestamp,
      type,
      message
    };
    
    this.logEntries.push(entry);
    
    // Keep only last 100 entries
    if (this.logEntries.length > 100) {
      this.logEntries.shift();
    }
    
    this.updateLogDisplay();
  }

  /**
   * Update log display
   */
  updateLogDisplay() {
    const logContainer = document.getElementById('testLog');
    
    logContainer.innerHTML = this.logEntries.map(entry => 
      `<div class="log-entry log-${entry.type}">
        <span class="text-muted">[${entry.timestamp}]</span> ${entry.message}
      </div>`
    ).join('');
    
    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  /**
   * Clear log entries
   */
  clearLog() {
    this.logEntries = [];
    this.updateLogDisplay();
  }

  /**
   * Start update timer for elapsed time
   */
  startUpdateTimer() {
    setInterval(() => {
      if (this.executionState.startTime) {
        const elapsed = Math.floor((Date.now() - new Date(this.executionState.startTime)) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('elapsedTime').textContent = 
          `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
  new LiveTestDashboard();
});
```

---

## CI/CD Pipeline Integration

### 1. GitHub Actions Integration

```yaml
# .github/workflows/test-with-dashboard.yml
name: Tests with Live Dashboard

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-with-dashboard:
    runs-on: ubuntu-latest
    
    services:
      dashboard:
        image: node:18
        ports:
          - 8080:8080
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        npm install ws express chokidar moment
    
    - name: Start Dashboard Server
      run: |
        node src/dashboard/websocket-server.js &
        DASHBOARD_PID=$!
        echo "DASHBOARD_PID=$DASHBOARD_PID" >> $GITHUB_ENV
      
    - name: Wait for Dashboard
      run: |
        timeout 30 bash -c 'until curl -f http://localhost:8080/health; do sleep 1; done'
    
    - name: Run Tests with Live Updates
      run: |
        npm run test:dashboard
        
    - name: Upload Dashboard Reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: dashboard-reports
        path: |
          reports/
          dashboard/
          
    - name: Stop Dashboard Server
      if: always()
      run: |
        kill $DASHBOARD_PID || true
```

### 2. Dashboard Integration Script

```javascript
// scripts/run-tests-with-dashboard.js
const { spawn } = require('child_process');
const DashboardWebSocketServer = require('../src/dashboard/websocket-server');

/**
 * Run tests with live dashboard integration
 */
class TestDashboardRunner {
  constructor() {
    this.dashboardServer = null;
    this.testProcess = null;
  }

  async run() {
    try {
      // Start dashboard server
      await this.startDashboard();
      
      // Run tests
      await this.runTests();
      
      // Keep dashboard open for a while to view results
      console.log('📊 Dashboard available at: http://localhost:8080');
      console.log('⏰ Keeping dashboard open for 30 seconds...');
      
      await this.delay(30000);
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }

  async startDashboard() {
    console.log('🚀 Starting dashboard server...');
    
    this.dashboardServer = new DashboardWebSocketServer({
      port: 8080,
      staticDir: 'dashboard/',
      dataDir: 'reports/json/'
    });
    
    await this.dashboardServer.start();
  }

  async runTests() {
    console.log('🧪 Running Cucumber tests...');
    
    return new Promise((resolve, reject) => {
      this.testProcess = spawn('npm', ['run', 'test:cucumber'], {
        stdio: 'inherit',
        shell: true
      });
      
      this.testProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Tests completed successfully');
          resolve();
        } else {
          console.log('⚠️ Tests completed with errors');
          resolve(); // Don't reject, we still want to show dashboard
        }
      });
      
      this.testProcess.on('error', (error) => {
        reject(error);
      });
    });
  }

  async cleanup() {
    console.log('🧹 Cleaning up...');
    
    if (this.testProcess && !this.testProcess.killed) {
      this.testProcess.kill();
    }
    
    if (this.dashboardServer) {
      await this.dashboardServer.stop();
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new TestDashboardRunner();
  
  // Handle process signals
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await runner.cleanup();
    process.exit(0);
  });
  
  runner.run();
}

module.exports = TestDashboardRunner;
```

---

## Usage Examples

### 1. Basic Dashboard Usage

```bash
# Start dashboard server
node src/dashboard/websocket-server.js

# In another terminal, run tests
npm run test:cucumber

# Dashboard will update in real-time at http://localhost:8080
```

### 2. Integration with Package.json

```json
{
  "scripts": {
    "dashboard": "node src/dashboard/websocket-server.js",
    "test:dashboard": "node scripts/run-tests-with-dashboard.js",
    "test:cucumber": "cucumber-js --format json:reports/json/cucumber-report.json",
    "dev:dashboard": "concurrently \"npm run dashboard\" \"npm run test:cucumber\"",
    "ci:dashboard": "npm run test:dashboard && npm run generate:reports"
  },
  "devDependencies": {
    "concurrently": "^7.6.0",
    "ws": "^8.13.0",
    "express": "^4.18.2",
    "chokidar": "^3.5.3",
    "moment": "^2.29.4"
  }
}
```

### 3. Docker Compose for Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  dashboard:
    build:
      context: .
      dockerfile: Dockerfile.dashboard
    ports:
      - "8080:8080"
    volumes:
      - ./reports:/app/reports
      - ./dashboard:/app/dashboard
    environment:
      - NODE_ENV=development
      
  tests:
    build:
      context: .
      dockerfile: Dockerfile.tests
    depends_on:
      - dashboard
    volumes:
      - ./reports:/app/reports
    environment:
      - DASHBOARD_URL=http://dashboard:8080
```

---

## Key Benefits Demonstrated

### 1. **Real-time Monitoring**
- Live progress updates during test execution
- Immediate feedback on test failures and successes
- Real-time statistics and metrics visualization

### 2. **Multi-Client Support**
- Multiple stakeholders can monitor simultaneously
- Synchronized updates across all connected clients
- WebSocket-based efficient communication

### 3. **CI/CD Integration**
- Seamless integration with GitHub Actions and other CI systems
- Automated dashboard startup and teardown
- Build pipeline visualization and monitoring

### 4. **Historical Context**
- Integration of real-time data with historical trends
- Performance regression detection
- Long-term quality metrics tracking

### 5. **Professional Presentation**
- Executive-friendly dashboard views
- Interactive charts and visualizations
- Mobile-responsive design for on-the-go monitoring

---

## Next Steps

This real-time dashboard system provides comprehensive live monitoring capabilities for your test execution. You can extend it further by:

1. Adding database persistence for historical data
2. Implementing user authentication and role-based access
3. Creating custom alert systems for critical failures
4. Integrating with messaging platforms (Slack, Teams, etc.)
5. Building mobile applications for remote monitoring

### Key Takeaways

- ✅ **WebSocket technology** enables efficient real-time communication
- ✅ **Live monitoring** provides immediate feedback during test execution
- ✅ **CI/CD integration** brings visibility to automated pipelines
- ✅ **Multi-client support** serves diverse stakeholder needs
- ✅ **Interactive visualizations** make data more accessible and actionable

You now have the tools to create sophisticated, real-time monitoring systems that keep your entire team informed about test execution status! 🚀

**[← Back to Examples Overview](./README.md)**