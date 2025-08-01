// interactive-enhancements.js
/**
 * Interactive HTML Report Enhancements
 * 
 * This example demonstrates how to add interactive features to Playwright HTML reports:
 * - Advanced filtering and search capabilities
 * - Custom navigation and user experience improvements
 * - Export functionality for stakeholders
 * - Keyboard shortcuts and accessibility features
 * - Real-time data visualization
 * 
 * Usage: Include this script in your HTML report template or inject it post-generation
 */

class PlaywrightReportEnhancements {
  constructor() {
    this.testData = [];
    this.filteredData = [];
    this.currentFilters = {
      status: '',
      project: '',
      browser: '',
      duration: '',
      category: '',
      search: ''
    };
    
    this.initialize();
  }

  /**
   * Initialize all enhancements when DOM is ready
   */
  initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEnhancements());
    } else {
      this.setupEnhancements();
    }
  }

  /**
   * Main setup method for all enhancements
   */
  setupEnhancements() {
    console.log('🚀 Initializing Playwright Report Enhancements...');
    
    try {
      // Core functionality
      this.extractTestData();
      this.setupAdvancedFiltering();
      this.enhanceNavigation();
      this.addKeyboardShortcuts();
      this.setupExportFunctionality();
      
      // UI improvements
      this.addProgressIndicators();
      this.enhanceTestDetails();
      this.setupTooltips();
      
      // Data visualization
      this.addTrendCharts();
      this.addPerformanceMetrics();
      
      // Accessibility improvements
      this.enhanceAccessibility();
      
      console.log('✅ Report enhancements initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize enhancements:', error);
    }
  }

  /**
   * Extract test data from the report for processing
   */
  extractTestData() {
    const testElements = document.querySelectorAll('[data-test-id], .test-case, .test-result, .test-file');
    
    this.testData = Array.from(testElements).map((element, index) => {
      return {
        id: index,
        element: element,
        name: this.extractTestName(element),
        status: this.extractStatus(element),
        duration: this.extractDuration(element),
        project: this.extractProject(element),
        browser: this.extractBrowser(element),
        file: this.extractFile(element),
        category: this.extractCategory(element),
        retries: this.extractRetries(element),
        error: this.extractError(element),
        tags: this.extractTags(element)
      };
    }).filter(test => test.name && test.name !== '');

    this.filteredData = [...this.testData];
    console.log(`📊 Extracted ${this.testData.length} test results`);
  }

  /**
   * Setup advanced filtering with custom filter types
   */
  setupAdvancedFiltering() {
    // Create enhanced filter panel
    const filterPanel = this.createFilterPanel();
    
    // Insert filter panel at the top of the report
    const reportContainer = document.querySelector('main, .report-container, body');
    if (reportContainer && reportContainer.firstChild) {
      reportContainer.insertBefore(filterPanel, reportContainer.firstChild);
    }

    // Setup filter event listeners
    this.setupFilterListeners();
    
    // Add real-time search
    this.setupRealTimeSearch();
  }

  createFilterPanel() {
    const panel = document.createElement('div');
    panel.className = 'enhanced-filter-panel';
    panel.innerHTML = `
      <div class="filter-header">
        <h3>🔍 Advanced Filters</h3>
        <button id="toggleFilters" class="toggle-btn" aria-label="Toggle Filters">
          <span class="icon">⬇️</span>
        </button>
      </div>
      
      <div class="filter-content" id="filterContent">
        <div class="filter-row">
          <div class="filter-group">
            <label for="statusFilter">Status:</label>
            <select id="statusFilter" class="filter-select">
              <option value="">All Statuses</option>
              <option value="passed">✅ Passed</option>
              <option value="failed">❌ Failed</option>
              <option value="skipped">⏭️ Skipped</option>
              <option value="timedout">⏱️ Timed Out</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="projectFilter">Project:</label>
            <select id="projectFilter" class="filter-select">
              <option value="">All Projects</option>
              ${this.getUniqueValues('project').map(project => 
                `<option value="${project}">${project}</option>`
              ).join('')}
            </select>
          </div>
          
          <div class="filter-group">
            <label for="browserFilter">Browser:</label>
            <select id="browserFilter" class="filter-select">
              <option value="">All Browsers</option>
              <option value="chromium">🌐 Chromium</option>
              <option value="firefox">🦊 Firefox</option>
              <option value="webkit">🧭 WebKit</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="durationFilter">Duration:</label>
            <select id="durationFilter" class="filter-select">
              <option value="">All Durations</option>
              <option value="fast">⚡ Fast (< 5s)</option>
              <option value="medium">🐎 Medium (5s - 30s)</option>
              <option value="slow">🐌 Slow (> 30s)</option>
            </select>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-group search-group">
            <label for="searchInput">Search:</label>
            <div class="search-container">
              <input type="text" id="searchInput" class="search-input" 
                     placeholder="Search test names, files, or errors..." 
                     autocomplete="off">
              <button id="clearSearch" class="clear-btn" title="Clear search">✖️</button>
            </div>
          </div>
          
          <div class="filter-group">
            <label for="categoryFilter">Category:</label>
            <select id="categoryFilter" class="filter-select">
              <option value="">All Categories</option>
              <option value="smoke">🔥 Smoke</option>
              <option value="regression">🔄 Regression</option>
              <option value="integration">🔗 Integration</option>
              <option value="api">📡 API</option>
              <option value="e2e">🎯 E2E</option>
            </select>
          </div>
          
          <div class="filter-actions">
            <button id="resetFilters" class="action-btn reset-btn">🔄 Reset</button>
            <button id="saveFilters" class="action-btn save-btn">💾 Save</button>
            <button id="loadFilters" class="action-btn load-btn">📁 Load</button>
          </div>
        </div>
        
        <div class="filter-summary" id="filterSummary">
          <span class="result-count">Showing all ${this.testData.length} tests</span>
          <div class="quick-stats"></div>
        </div>
      </div>
    `;

    // Add enhanced styles
    this.addFilterStyles();
    
    return panel;
  }

  setupFilterListeners() {
    // Status filter
    document.getElementById('statusFilter')?.addEventListener('change', (e) => {
      this.currentFilters.status = e.target.value;
      this.applyFilters();
    });

    // Project filter
    document.getElementById('projectFilter')?.addEventListener('change', (e) => {
      this.currentFilters.project = e.target.value;
      this.applyFilters();
    });

    // Browser filter
    document.getElementById('browserFilter')?.addEventListener('change', (e) => {
      this.currentFilters.browser = e.target.value;
      this.applyFilters();
    });

    // Duration filter
    document.getElementById('durationFilter')?.addEventListener('change', (e) => {
      this.currentFilters.duration = e.target.value;
      this.applyFilters();
    });

    // Category filter
    document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
      this.currentFilters.category = e.target.value;
      this.applyFilters();
    });

    // Toggle filters visibility
    document.getElementById('toggleFilters')?.addEventListener('click', () => {
      this.toggleFilterPanel();
    });

    // Reset filters
    document.getElementById('resetFilters')?.addEventListener('click', () => {
      this.resetAllFilters();
    });

    // Save/Load filters
    document.getElementById('saveFilters')?.addEventListener('click', () => {
      this.saveFilters();
    });

    document.getElementById('loadFilters')?.addEventListener('click', () => {
      this.loadFilters();
    });

    // Clear search
    document.getElementById('clearSearch')?.addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      this.currentFilters.search = '';
      this.applyFilters();
    });
  }

  setupRealTimeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      // Debounce search to avoid excessive filtering
      searchTimeout = setTimeout(() => {
        this.currentFilters.search = e.target.value.toLowerCase();
        this.applyFilters();
      }, 300);
    });

    // Add search suggestions
    this.setupSearchSuggestions(searchInput);
  }

  setupSearchSuggestions(searchInput) {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchInput.parentNode.appendChild(suggestionsContainer);

    searchInput.addEventListener('focus', () => {
      this.showSearchSuggestions(suggestionsContainer);
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => suggestionsContainer.style.display = 'none', 200);
    });
  }

  showSearchSuggestions(container) {
    const commonSearches = [
      'failed tests',
      'slow tests',
      'timeout errors',
      'authentication',
      'checkout',
      'login'
    ];

    container.innerHTML = commonSearches.map(search => 
      `<div class="suggestion-item" onclick="this.parentNode.previousSibling.value='${search}'; this.parentNode.style.display='none'">${search}</div>`
    ).join('');
    
    container.style.display = 'block';
  }

  /**
   * Apply all active filters to the test data
   */
  applyFilters() {
    this.filteredData = this.testData.filter(test => {
      // Status filter
      if (this.currentFilters.status && test.status !== this.currentFilters.status) {
        return false;
      }

      // Project filter
      if (this.currentFilters.project && test.project !== this.currentFilters.project) {
        return false;
      }

      // Browser filter
      if (this.currentFilters.browser && test.browser !== this.currentFilters.browser) {
        return false;
      }

      // Duration filter
      if (this.currentFilters.duration) {
        const duration = test.duration;
        switch (this.currentFilters.duration) {
          case 'fast':
            if (duration >= 5000) return false;
            break;
          case 'medium':
            if (duration < 5000 || duration > 30000) return false;
            break;
          case 'slow':
            if (duration <= 30000) return false;
            break;
        }
      }

      // Category filter
      if (this.currentFilters.category && !test.tags.includes(this.currentFilters.category)) {
        return false;
      }

      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search;
        const searchableText = [
          test.name,
          test.file,
          test.error,
          ...test.tags
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    this.updateDisplay();
    this.updateFilterSummary();
  }

  /**
   * Update the display to show only filtered tests
   */
  updateDisplay() {
    // Hide all tests first
    this.testData.forEach(test => {
      test.element.style.display = 'none';
    });

    // Show filtered tests
    this.filteredData.forEach(test => {
      test.element.style.display = 'block';
    });

    // Update any summary statistics
    this.updateSummaryStats();
  }

  /**
   * Enhanced navigation features
   */
  enhanceNavigation() {
    this.addBreadcrumbs();
    this.addBackToTop();
    this.addTestNavigation();
    this.improveScrolling();
  }

  addBreadcrumbs() {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb-nav';
    breadcrumb.innerHTML = `
      <ol class="breadcrumb">
        <li><a href="#summary">📊 Summary</a></li>
        <li><a href="#projects">📁 Projects</a></li>
        <li><a href="#tests">🧪 Tests</a></li>
        <li><a href="#failures">❌ Failures</a></li>
      </ol>
    `;

    const header = document.querySelector('header, .report-header, h1');
    if (header) {
      header.after(breadcrumb);
    }
  }

  addBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '⬆️ Top';
    backToTop.title = 'Back to top';
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(backToTop);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
    });
  }

  /**
   * Add keyboard shortcuts for power users
   */
  addKeyboardShortcuts() {
    const shortcuts = {
      'f': () => document.getElementById('searchInput')?.focus(),
      'r': () => this.resetAllFilters(),
      'e': () => this.exportResults(),
      'Escape': () => this.clearSearch(),
      '1': () => this.filterByStatus('passed'),
      '2': () => this.filterByStatus('failed'),
      '3': () => this.filterByStatus('skipped')
    };

    document.addEventListener('keydown', (e) => {
      // Don't interfere with input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          shortcuts[e.key]?.();
        }
        return;
      }

      const shortcut = e.key;
      if (shortcuts[shortcut]) {
        e.preventDefault();
        shortcuts[shortcut]();
      }
    });

    // Add keyboard shortcuts help
    this.addKeyboardHelp();
  }

  addKeyboardHelp() {
    const helpButton = document.createElement('button');
    helpButton.className = 'help-button';
    helpButton.innerHTML = '❓';
    helpButton.title = 'Keyboard Shortcuts';
    
    helpButton.addEventListener('click', () => {
      this.showKeyboardHelp();
    });

    document.body.appendChild(helpButton);
  }

  showKeyboardHelp() {
    const modal = document.createElement('div');
    modal.className = 'keyboard-help-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>⌨️ Keyboard Shortcuts</h3>
          <button class="close-modal">✖️</button>
        </div>
        <div class="modal-body">
          <div class="shortcut-group">
            <h4>Navigation</h4>
            <div class="shortcut"><kbd>F</kbd> Focus search</div>
            <div class="shortcut"><kbd>R</kbd> Reset filters</div>
            <div class="shortcut"><kbd>E</kbd> Export results</div>
            <div class="shortcut"><kbd>Esc</kbd> Clear search</div>
          </div>
          <div class="shortcut-group">
            <h4>Quick Filters</h4>
            <div class="shortcut"><kbd>1</kbd> Show passed tests</div>
            <div class="shortcut"><kbd>2</kbd> Show failed tests</div>
            <div class="shortcut"><kbd>3</kbd> Show skipped tests</div>
          </div>
        </div>
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('close-modal')) {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
  }

  /**
   * Export functionality for sharing results
   */
  setupExportFunctionality() {
    const exportButton = document.createElement('button');
    exportButton.className = 'export-button';
    exportButton.innerHTML = '📊 Export';
    exportButton.title = 'Export test results';
    
    const exportMenu = this.createExportMenu();
    exportButton.appendChild(exportMenu);
    
    exportButton.addEventListener('click', (e) => {
      e.stopPropagation();
      exportMenu.style.display = exportMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Add to filter panel
    const filterPanel = document.querySelector('.enhanced-filter-panel .filter-actions');
    if (filterPanel) {
      filterPanel.appendChild(exportButton);
    }
  }

  createExportMenu() {
    const menu = document.createElement('div');
    menu.className = 'export-menu';
    menu.innerHTML = `
      <div class="export-option" data-format="csv">📄 CSV</div>
      <div class="export-option" data-format="json">📋 JSON</div>
      <div class="export-option" data-format="html">🌐 HTML Summary</div>
    `;

    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      const format = e.target.dataset.format;
      if (format) {
        this.exportResults(format);
        menu.style.display = 'none';
      }
    });

    return menu;
  }

  exportResults(format = 'csv') {
    const data = this.filteredData.map(test => ({
      name: test.name,
      status: test.status,
      duration: test.duration,
      project: test.project,
      browser: test.browser,
      file: test.file,
      category: test.tags.join(', '),
      error: test.error || ''
    }));

    switch (format) {
      case 'csv':
        this.downloadCSV(data);
        break;
      case 'json':
        this.downloadJSON(data);
        break;
      case 'html':
        this.downloadHTMLSummary(data);
        break;
    }
  }

  downloadCSV(data) {
    const headers = ['Test Name', 'Status', 'Duration (ms)', 'Project', 'Browser', 'File', 'Category', 'Error'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        this.escapeCSV(row.name),
        row.status,
        row.duration,
        row.project,
        row.browser,
        this.escapeCSV(row.file),
        this.escapeCSV(row.category),
        this.escapeCSV(row.error)
      ].join(','))
    ].join('\n');

    this.downloadFile(csvContent, 'test-results.csv', 'text/csv');
  }

  downloadJSON(data) {
    const jsonContent = JSON.stringify({
      exportedAt: new Date().toISOString(),
      totalTests: data.length,
      filters: this.currentFilters,
      results: data
    }, null, 2);

    this.downloadFile(jsonContent, 'test-results.json', 'application/json');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Helper methods for data extraction
  extractTestName(element) {
    const nameElement = element.querySelector('.test-title, .test-name, h3, h4');
    return nameElement?.textContent?.trim() || '';
  }

  extractStatus(element) {
    if (element.classList.contains('passed') || element.querySelector('.passed')) return 'passed';
    if (element.classList.contains('failed') || element.querySelector('.failed')) return 'failed';
    if (element.classList.contains('skipped') || element.querySelector('.skipped')) return 'skipped';
    if (element.classList.contains('timedout') || element.querySelector('.timedout')) return 'timedout';
    return 'unknown';
  }

  extractDuration(element) {
    const durationElement = element.querySelector('.duration, .test-duration');
    if (!durationElement) return 0;
    
    const text = durationElement.textContent;
    const match = text.match(/(\\d+\\.?\\d*)(ms|s)/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    return match[2] === 's' ? value * 1000 : value;
  }

  extractProject(element) {
    const projectElement = element.querySelector('.project-name, .project');
    return projectElement?.textContent?.trim() || 'default';
  }

  extractBrowser(element) {
    const projectText = this.extractProject(element).toLowerCase();
    if (projectText.includes('chrome')) return 'chromium';
    if (projectText.includes('firefox')) return 'firefox';
    if (projectText.includes('webkit') || projectText.includes('safari')) return 'webkit';
    return 'unknown';
  }

  extractFile(element) {
    const fileElement = element.querySelector('.test-file, .file-path');
    return fileElement?.textContent?.trim() || '';
  }

  extractCategory(element) {
    const file = this.extractFile(element);
    if (file.includes('/smoke/')) return 'smoke';
    if (file.includes('/regression/')) return 'regression';
    if (file.includes('/integration/')) return 'integration';
    if (file.includes('/api/')) return 'api';
    if (file.includes('/e2e/')) return 'e2e';
    return 'general';
  }

  extractTags(element) {
    const tags = [];
    const category = this.extractCategory(element);
    if (category !== 'general') tags.push(category);
    
    // Extract additional tags from test title or attributes
    const title = this.extractTestName(element);
    const tagMatches = title.match(/@(\\w+)/g);
    if (tagMatches) {
      tags.push(...tagMatches.map(tag => tag.substring(1)));
    }
    
    return tags;
  }

  extractError(element) {
    const errorElement = element.querySelector('.error-message, .failure-message');
    return errorElement?.textContent?.trim() || '';
  }

  extractRetries(element) {
    const retryInfo = element.querySelector('.retry-info, .retries');
    if (!retryInfo) return 0;
    
    const match = retryInfo.textContent.match(/(\\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  // Utility methods
  getUniqueValues(property) {
    return [...new Set(this.testData.map(test => test[property]).filter(Boolean))];
  }

  escapeCSV(value) {
    if (typeof value !== 'string') return value;
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  addFilterStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .enhanced-filter-panel {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        margin: 1rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
        background: #ffffff;
        border-radius: 8px 8px 0 0;
      }
      
      .filter-content {
        padding: 1rem;
      }
      
      .filter-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      
      .filter-group {
        display: flex;
        flex-direction: column;
        min-width: 150px;
      }
      
      .filter-group label {
        font-weight: 600;
        margin-bottom: 0.25rem;
        font-size: 0.9em;
      }
      
      .filter-select, .search-input {
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 0.9em;
      }
      
      .search-container {
        position: relative;
        display: flex;
      }
      
      .search-input {
        flex: 1;
        padding-right: 2rem;
      }
      
      .clear-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.6;
      }
      
      .action-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 0.9em;
        margin: 0 0.25rem;
      }
      
      .action-btn:hover {
        background: #f8f9fa;
      }
      
      .filter-summary {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 0.75rem 1rem;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        display: none;
        z-index: 1000;
      }
      
      .help-button {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
      }
      
      .keyboard-help-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1001;
      }
      
      .modal-content {
        background: white;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
      }
      
      .modal-body {
        padding: 1rem;
      }
      
      .shortcut-group {
        margin-bottom: 1rem;
      }
      
      .shortcut {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem 0;
      }
      
      kbd {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 3px;
        padding: 0.1rem 0.3rem;
        font-family: monospace;
        font-size: 0.9em;
      }
      
      .export-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        display: none;
        z-index: 1000;
      }
      
      .export-option {
        padding: 0.5rem 1rem;
        cursor: pointer;
        white-space: nowrap;
      }
      
      .export-option:hover {
        background: #f8f9fa;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Placeholder methods for additional features
  addProgressIndicators() { 
    console.log('📊 Adding progress indicators...');
  }
  
  enhanceTestDetails() { 
    console.log('🔍 Enhancing test details...');
  }
  
  setupTooltips() { 
    console.log('💡 Setting up tooltips...');
  }
  
  addTrendCharts() { 
    console.log('📈 Adding trend charts...');
  }
  
  addPerformanceMetrics() {
    console.log('⚡ Adding performance metrics...');
  }
  
  enhanceAccessibility() { 
    console.log('♿ Enhancing accessibility...');
  }
  
  addTestNavigation() { 
    console.log('🧭 Adding test navigation...');
  }
  
  improveScrolling() { 
    console.log('📜 Improving scrolling...');
  }
  
  toggleFilterPanel() { 
    const content = document.getElementById('filterContent');
    const icon = document.querySelector('#toggleFilters .icon');
    if (content) {
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      if (icon) icon.textContent = isHidden ? '⬇️' : '⬆️';
    }
  }
  
  resetAllFilters() { 
    Object.keys(this.currentFilters).forEach(key => {
      this.currentFilters[key] = '';
    });
    
    // Reset UI controls
    document.querySelectorAll('.filter-select').forEach(select => {
      select.selectedIndex = 0;
    });
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    this.applyFilters();
  }
  
  filterByStatus(status) {
    this.currentFilters.status = status;
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.value = status;
    this.applyFilters();
  }
  
  saveFilters() { 
    localStorage.setItem('playwright-report-filters', JSON.stringify(this.currentFilters));
    console.log('✅ Filters saved');
  }
  
  loadFilters() { 
    const saved = localStorage.getItem('playwright-report-filters');
    if (saved) {
      this.currentFilters = JSON.parse(saved);
      this.applyFilters();
      console.log('✅ Filters loaded');
    }
  }
  
  updateFilterSummary() {
    const summary = document.getElementById('filterSummary');
    if (summary) {
      const resultCount = summary.querySelector('.result-count');
      if (resultCount) {
        resultCount.textContent = `Showing ${this.filteredData.length} of ${this.testData.length} tests`;
      }
    }
  }
  
  updateSummaryStats() { 
    console.log('📊 Updating summary statistics...');
  }
  
  clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
      this.currentFilters.search = '';
      this.applyFilters();
    }
  }

  downloadHTMLSummary(data) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Results Summary</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f8f9fa; font-weight: 600; }
          .passed { color: #28a745; }
          .failed { color: #dc3545; }
          .skipped { color: #ffc107; }
        </style>
      </head>
      <body>
        <h1>Test Results Summary</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total Tests: ${data.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Project</th>
              <th>Browser</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(test => `
              <tr>
                <td>${test.name}</td>
                <td class="${test.status}">${test.status}</td>
                <td>${test.duration}ms</td>
                <td>${test.project}</td>
                <td>${test.browser}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    this.downloadFile(htmlContent, 'test-summary.html', 'text/html');
  }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  window.PlaywrightReportEnhancements = PlaywrightReportEnhancements;
  new PlaywrightReportEnhancements();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlaywrightReportEnhancements;
}