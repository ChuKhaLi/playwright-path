# Exercise 02: Interactive Report Enhancement

## 🎯 Objectives

By completing this exercise, you will:
- ✅ Add interactive search and filtering capabilities to HTML reports
- ✅ Implement modal dialogs for detailed test step information
- ✅ Create dark mode toggle with user preference persistence
- ✅ Add screenshot viewing with lightbox functionality
- ✅ Implement export features for filtered results
- ✅ Build responsive navigation with mobile-optimized layouts

**Estimated Time**: 60-75 minutes  
**Difficulty**: ⭐⭐⭐☆☆ (Intermediate)

---

## 📋 Prerequisites

### Required Knowledge
- ✅ Completion of Exercise 01: Basic Multi-Format Reports
- ✅ Basic JavaScript/DOM manipulation knowledge
- ✅ Understanding of CSS Grid and Flexbox
- ✅ Familiarity with localStorage API
- ✅ Basic understanding of responsive design principles

### Technical Setup
```bash
# Additional dependencies for interactive features
npm install --save-dev chart.js
npm install --save-dev fuse.js  # For fuzzy search
npm install --save-dev jspdf jspdf-autotable  # For PDF export
```

### Project Structure (Building on Exercise 01)
```
your-project/
├── reports/
│   ├── html/
│   │   ├── assets/
│   │   │   ├── js/
│   │   │   │   ├── interactive-features.js
│   │   │   │   ├── search-engine.js
│   │   │   │   └── chart-generator.js
│   │   │   ├── css/
│   │   │   │   ├── interactive-theme.css
│   │   │   │   └── dark-mode.css
│   │   │   └── images/
│   │   └── components/
│   │       ├── modal-templates.html
│   │       └── filter-controls.html
└── scripts/
    └── enhance-reports.js
```

---

## 🛠️ Implementation Tasks

### Task 1: Interactive Search and Filtering (25 minutes)

Create a powerful search and filtering system for test results.

**Step 1.1**: Create the search engine

```javascript
// reports/html/assets/js/search-engine.js
class TestSearchEngine {
  constructor() {
    this.testData = [];
    this.filteredData = [];
    this.filters = {
      status: 'all',
      feature: 'all',
      duration: 'all',
      tag: 'all'
    };
    this.searchQuery = '';
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    
    this.initializeSearch();
  }

  /**
   * Initialize search functionality
   */
  async initializeSearch() {
    try {
      // Load test data from JSON report
      const response = await fetch('../json/cucumber-report.json');
      this.testData = await response.json();
      this.filteredData = [...this.testData];
      
      // Setup search UI
      this.setupSearchInterface();
      this.setupFilterControls();
      this.bindEvents();
      
      // Initial render
      this.applyFiltersAndSearch();
      
      console.log('✅ Search engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize search:', error);
      this.showError('Failed to load test data for search functionality');
    }
  }

  /**
   * Setup search interface HTML
   */
  setupSearchInterface() {
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) return;

    searchContainer.innerHTML = `
      <div class="search-panel">
        <!-- Search Input -->
        <div class="search-input-group">
          <div class="input-with-icon">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Search scenarios, steps, or features..."
              class="form-control search-input"
            >
            <button id="clearSearch" class="btn-clear" title="Clear search">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Quick Filter Pills -->
        <div class="quick-filters">
          <span class="filter-label">Quick Filters:</span>
          <div class="filter-pills">
            <button class="pill-filter active" data-filter="all">All Tests</button>
            <button class="pill-filter" data-filter="passed">✅ Passed</button>
            <button class="pill-filter" data-filter="failed">❌ Failed</button>
            <button class="pill-filter" data-filter="skipped">⏭️ Skipped</button>
          </div>
        </div>

        <!-- Advanced Filters (Collapsible) -->
        <div class="advanced-filters">
          <button class="toggle-advanced" id="toggleAdvanced">
            <i class="fas fa-sliders-h"></i> Advanced Filters
            <i class="fas fa-chevron-down toggle-icon"></i>
          </button>
          
          <div class="advanced-panel" id="advancedPanel">
            <div class="filter-row">
              <!-- Feature Filter -->
              <div class="filter-group">
                <label for="featureFilter">Feature:</label>
                <select id="featureFilter" class="form-select">
                  <option value="all">All Features</option>
                </select>
              </div>

              <!-- Duration Filter -->
              <div class="filter-group">
                <label for="durationFilter">Duration:</label>
                <select id="durationFilter" class="form-select">
                  <option value="all">Any Duration</option>
                  <option value="fast">⚡ Fast (< 1s)</option>
                  <option value="medium">⏱️ Medium (1-5s)</option>
                  <option value="slow">🐌 Slow (> 5s)</option>
                </select>
              </div>

              <!-- Tag Filter -->
              <div class="filter-group">
                <label for="tagFilter">Tags:</label>
                <select id="tagFilter" class="form-select">
                  <option value="all">All Tags</option>
                </select>
              </div>
            </div>

            <div class="filter-actions">
              <button id="applyFilters" class="btn btn-primary">
                <i class="fas fa-filter"></i> Apply Filters
              </button>
              <button id="resetFilters" class="btn btn-outline-secondary">
                <i class="fas fa-undo"></i> Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Results Summary -->
        <div class="results-summary" id="resultsSummary">
          <span class="results-count">Showing <strong id="resultCount">0</strong> of <strong id="totalCount">0</strong> results</span>
          <div class="sort-controls">
            <label for="sortBy">Sort by:</label>
            <select id="sortBy" class="form-select-sm">
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="duration">Duration</option>
              <option value="feature">Feature</option>
            </select>
            <button id="sortOrder" class="btn-sort" title="Toggle sort order">
              <i class="fas fa-sort-alpha-down"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Setup filter control options
   */
  setupFilterControls() {
    // Populate feature dropdown
    const features = [...new Set(this.testData.map(f => f.name))];
    const featureSelect = document.getElementById('featureFilter');
    features.forEach(feature => {
      const option = document.createElement('option');
      option.value = feature;
      option.textContent = feature;
      featureSelect.appendChild(option);
    });

    // Populate tag dropdown
    const allTags = new Set();
    this.testData.forEach(feature => {
      if (feature.tags) {
        feature.tags.forEach(tag => allTags.add(tag.name.replace('@', '')));
      }
      if (feature.elements) {
        feature.elements.forEach(scenario => {
          if (scenario.tags) {
            scenario.tags.forEach(tag => allTags.add(tag.name.replace('@', '')));
          }
        });
      }
    });

    const tagSelect = document.getElementById('tagFilter');
    Array.from(allTags).sort().forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = `@${tag}`;
      tagSelect.appendChild(option);
    });

    this.updateResultsSummary();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', this.debounce(() => {
      this.searchQuery = searchInput.value.toLowerCase();
      this.applyFiltersAndSearch();
    }, 300));

    // Clear search
    document.getElementById('clearSearch').addEventListener('click', () => {
      searchInput.value = '';
      this.searchQuery = '';
      this.applyFiltersAndSearch();
    });

    // Quick filter pills
    document.querySelectorAll('.pill-filter').forEach(pill => {
      pill.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.pill-filter').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        
        // Apply filter
        this.filters.status = e.target.dataset.filter;
        this.applyFiltersAndSearch();
      });
    });

    // Advanced filters toggle
    const toggleAdvanced = document.getElementById('toggleAdvanced');
    const advancedPanel = document.getElementById('advancedPanel');
    const toggleIcon = toggleAdvanced.querySelector('.toggle-icon');
    
    toggleAdvanced.addEventListener('click', () => {
      const isExpanded = advancedPanel.classList.contains('expanded');
      
      if (isExpanded) {
        advancedPanel.classList.remove('expanded');
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
      } else {
        advancedPanel.classList.add('expanded');
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
      }
    });

    // Filter controls
    document.getElementById('featureFilter').addEventListener('change', (e) => {
      this.filters.feature = e.target.value;
    });

    document.getElementById('durationFilter').addEventListener('change', (e) => {
      this.filters.duration = e.target.value;
    });

    document.getElementById('tagFilter').addEventListener('change', (e) => {
      this.filters.tag = e.target.value;
    });

    // Apply/Reset buttons
    document.getElementById('applyFilters').addEventListener('click', () => {
      this.applyFiltersAndSearch();
    });

    document.getElementById('resetFilters').addEventListener('click', () => {
      this.resetAllFilters();
    });

    // Sort controls
    document.getElementById('sortBy').addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.applyFiltersAndSearch();
    });

    document.getElementById('sortOrder').addEventListener('click', (e) => {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      const icon = e.target.querySelector('i') || e.target;
      icon.className = this.sortOrder === 'asc' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up';
      this.applyFiltersAndSearch();
    });
  }

  /**
   * Apply all filters and search query
   */
  applyFiltersAndSearch() {
    let filtered = [...this.testData];

    // Apply status filter
    if (this.filters.status !== 'all') {
      filtered = filtered.filter(feature => {
        if (!feature.elements) return false;
        
        return feature.elements.some(scenario => {
          const scenarioStatus = this.getScenarioStatus(scenario);
          return scenarioStatus === this.filters.status;
        });
      });
    }

    // Apply feature filter
    if (this.filters.feature !== 'all') {
      filtered = filtered.filter(feature => feature.name === this.filters.feature);
    }

    // Apply tag filter
    if (this.filters.tag !== 'all') {
      filtered = filtered.filter(feature => {
        const hasFeatureTag = feature.tags?.some(tag => tag.name.includes(this.filters.tag));
        const hasScenarioTag = feature.elements?.some(scenario => 
          scenario.tags?.some(tag => tag.name.includes(this.filters.tag))
        );
        return hasFeatureTag || hasScenarioTag;
      });
    }

    // Apply duration filter
    if (this.filters.duration !== 'all') {
      filtered = filtered.filter(feature => {
        if (!feature.elements) return false;
        
        return feature.elements.some(scenario => {
          const duration = this.getScenarioDuration(scenario);
          
          switch (this.filters.duration) {
            case 'fast': return duration < 1000;
            case 'medium': return duration >= 1000 && duration <= 5000;
            case 'slow': return duration > 5000;
            default: return true;
          }
        });
      });
    }

    // Apply search query
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(feature => {
        // Search in feature name
        if (feature.name.toLowerCase().includes(this.searchQuery)) return true;
        
        // Search in scenarios and steps
        if (feature.elements) {
          return feature.elements.some(scenario => {
            // Search scenario name
            if (scenario.name.toLowerCase().includes(this.searchQuery)) return true;
            
            // Search step definitions
            if (scenario.steps) {
              return scenario.steps.some(step => 
                step.name.toLowerCase().includes(this.searchQuery)
              );
            }
            return false;
          });
        }
        return false;
      });
    }

    // Sort results
    filtered = this.sortResults(filtered);

    this.filteredData = filtered;
    this.updateResultsSummary();
    this.renderFilteredResults();
  }

  /**
   * Sort results based on current sort settings
   */
  sortResults(data) {
    return data.sort((a, b) => {
      let aVal, bVal;
      
      switch (this.sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'status':
          aVal = this.getFeatureStatus(a);
          bVal = this.getFeatureStatus(b);
          break;
        case 'duration':
          aVal = this.getFeatureDuration(a);
          bVal = this.getFeatureDuration(b);
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Helper functions for data extraction
   */
  getScenarioStatus(scenario) {
    if (!scenario.steps) return 'skipped';
    
    const hasFailedStep = scenario.steps.some(step => step.result?.status === 'failed');
    const hasSkippedStep = scenario.steps.some(step => step.result?.status === 'skipped');
    
    if (hasFailedStep) return 'failed';
    if (hasSkippedStep) return 'skipped';
    return 'passed';
  }

  getScenarioDuration(scenario) {
    if (!scenario.steps) return 0;
    
    return scenario.steps.reduce((total, step) => {
      return total + (step.result?.duration || 0);
    }, 0) / 1000000; // Convert nanoseconds to milliseconds
  }

  getFeatureStatus(feature) {
    if (!feature.elements) return 'skipped';
    
    const statuses = feature.elements.map(scenario => this.getScenarioStatus(scenario));
    
    if (statuses.some(status => status === 'failed')) return 'failed';
    if (statuses.some(status => status === 'skipped')) return 'skipped';
    return 'passed';
  }

  getFeatureDuration(feature) {
    if (!feature.elements) return 0;
    
    return feature.elements.reduce((total, scenario) => {
      return total + this.getScenarioDuration(scenario);
    }, 0);
  }

  /**
   * Update results summary display
   */
  updateResultsSummary() {
    const resultCount = document.getElementById('resultCount');
    const totalCount = document.getElementById('totalCount');
    
    if (resultCount && totalCount) {
      resultCount.textContent = this.filteredData.length;
      totalCount.textContent = this.testData.length;
    }
  }

  /**
   * Render filtered results
   */
  renderFilteredResults() {
    const resultsContainer = document.getElementById('test-results');
    if (!resultsContainer) return;

    if (this.filteredData.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <h4>No results found</h4>
          <p class="text-muted">Try adjusting your search terms or filters</p>
          <button class="btn btn-outline-primary" onclick="searchEngine.resetAllFilters()">
            <i class="fas fa-undo"></i> Reset Filters
          </button>
        </div>
      `;
      return;
    }

    // Generate HTML for filtered results
    let html = '';
    this.filteredData.forEach(feature => {
      html += this.generateFeatureHTML(feature);
    });

    resultsContainer.innerHTML = html;
    
    // Highlight search terms
    if (this.searchQuery.trim()) {
      this.highlightSearchTerms();
    }
  }

  /**
   * Generate HTML for a feature
   */
  generateFeatureHTML(feature) {
    const status = this.getFeatureStatus(feature);
    const duration = this.getFeatureDuration(feature);
    
    return `
      <div class="feature-card ${status}" data-feature="${feature.name}">
        <div class="feature-header">
          <div class="feature-info">
            <h3 class="feature-title">${feature.name}</h3>
            <div class="feature-meta">
              <span class="status-badge ${status}">${status.toUpperCase()}</span>
              <span class="duration">${duration.toFixed(2)}ms</span>
              ${feature.tags ? feature.tags.map(tag => `<span class="tag">${tag.name}</span>`).join('') : ''}
            </div>
          </div>
          <button class="btn-expand" data-target="${feature.name.replace(/\s+/g, '-')}">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        
        <div class="feature-content" id="${feature.name.replace(/\s+/g, '-')}">
          ${feature.elements ? feature.elements.map(scenario => this.generateScenarioHTML(scenario)).join('') : ''}
        </div>
      </div>
    `;
  }

  /**
   * Generate HTML for a scenario
   */
  generateScenarioHTML(scenario) {
    const status = this.getScenarioStatus(scenario);
    const duration = this.getScenarioDuration(scenario);
    
    return `
      <div class="scenario ${status}">
        <div class="scenario-header">
          <h4 class="scenario-title">${scenario.name}</h4>
          <div class="scenario-meta">
            <span class="status-indicator ${status}"></span>
            <span class="duration">${duration.toFixed(2)}ms</span>
          </div>
        </div>
        
        <div class="steps">
          ${scenario.steps ? scenario.steps.map(step => this.generateStepHTML(step)).join('') : ''}
        </div>
      </div>
    `;
  }

  /**
   * Generate HTML for a step
   */
  generateStepHTML(step) {
    const status = step.result?.status || 'skipped';
    const duration = step.result?.duration ? (step.result.duration / 1000000).toFixed(2) : '0.00';
    
    return `
      <div class="step ${status}">
        <div class="step-content">
          <span class="step-keyword">${step.keyword}</span>
          <span class="step-name">${step.name}</span>
          <span class="step-duration">${duration}ms</span>
        </div>
        ${step.result?.error_message ? `
          <div class="step-error">
            <pre>${step.result.error_message}</pre>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Highlight search terms in results
   */
  highlightSearchTerms() {
    const searchTerm = this.searchQuery.trim();
    if (!searchTerm) return;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const elementsToHighlight = document.querySelectorAll('.feature-title, .scenario-title, .step-name');
    
    elementsToHighlight.forEach(element => {
      element.innerHTML = element.textContent.replace(regex, '<mark>$1</mark>');
    });
  }

  /**
   * Reset all filters to default state
   */
  resetAllFilters() {
    // Reset filter values
    this.filters = {
      status: 'all',
      feature: 'all',
      duration: 'all',
      tag: 'all'
    };
    this.searchQuery = '';

    // Reset UI elements
    document.getElementById('searchInput').value = '';
    document.getElementById('featureFilter').value = 'all';
    document.getElementById('durationFilter').value = 'all';
    document.getElementById('tagFilter').value = 'all';
    
    // Reset quick filter pills
    document.querySelectorAll('.pill-filter').forEach(pill => {
      pill.classList.remove('active');
    });
    document.querySelector('.pill-filter[data-filter="all"]').classList.add('active');

    // Apply reset
    this.applyFiltersAndSearch();
  }

  /**
   * Utility function for debouncing
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Show error message to user
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <strong>Error:</strong> ${message}
    `;
    
    const container = document.getElementById('search-container') || document.body;
    container.insertBefore(errorDiv, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

// Initialize search engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.searchEngine = new TestSearchEngine();
});
```

**Step 1.2**: Create the CSS for search interface

```css
/* reports/html/assets/css/interactive-theme.css */
:root {
  --search-bg: #ffffff;
  --search-border: #e1e5e9;
  --search-shadow: 0 2px 10px rgba(0,0,0,0.1);
  --pill-bg: #f8f9fa;
  --pill-active: #007bff;
  --highlight-bg: #fff3cd;
  --no-results-color: #6c757d;
}

/* Search Panel Styles */
.search-panel {
  background: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: var(--search-shadow);
}

.search-input-group {
  margin-bottom: 20px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i.fa-search {
  position: absolute;
  left: 15px;
  color: #6c757d;
  z-index: 2;
}

.search-input {
  padding: 12px 45px 12px 45px;
  border: 2px solid var(--search-border);
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease;
  width: 100%;
}

.search-input:focus {
  outline: none;
  border-color: var(--pill-active);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #6c757d;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #f8f9fa;
  color: #dc3545;
}

/* Quick Filter Pills */
.quick-filters {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.filter-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill-filter {
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: var(--pill-bg);
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.pill-filter:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.pill-filter.active {
  background: var(--pill-active);
  color: white;
  border-color: var(--pill-active);
}

/* Advanced Filters */
.advanced-filters {
  border-top: 1px solid var(--search-border);
  padding-top: 20px;
}

.toggle-advanced {
  background: none;
  border: none;
  color: var(--pill-active);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  transition: all 0.2s ease;
}

.toggle-advanced:hover {
  color: #0056b3;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.advanced-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.advanced-panel.expanded {
  max-height: 300px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.form-select {
  padding: 8px 12px;
  border: 1px solid var(--search-border);
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: var(--pill-active);
}

.filter-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Results Summary */
.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid var(--search-border);
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.results-count {
  color: #495057;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-controls label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  white-space: nowrap;
}

.form-select-sm {
  padding: 6px 10px;
  border: 1px solid var(--search-border);
  border-radius: 4px;
  font-size: 14px;
}

.btn-sort {
  background: none;
  border: 1px solid var(--search-border);
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  color: #495057;
  transition: all 0.2s ease;
}

.btn-sort:hover {
  background: var(--pill-bg);
  border-color: var(--pill-active);
  color: var(--pill-active);
}

/* Feature Cards */
.feature-card {
  background: white;
  border: 1px solid var(--search-border);
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  cursor: pointer;
}

.feature-info {
  flex: 1;
}

.feature-title {
  margin: 0 0 10px 0;
  color: #212529;
  font-size: 1.25rem;
  font-weight: 600;
}

.feature-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.passed {
  background: #d4edda;
  color: #155724;
}

.status-badge.failed {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.skipped {
  background: #fff3cd;
  color: #856404;
}

.duration {
  font-size: 14px;
  color: #6c757d;
  font-family: 'Monaco', monospace;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.btn-expand {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-expand:hover {
  background: #e9ecef;
  color: var(--pill-active);
}

.feature-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.feature-content.expanded {
  max-height: 2000px;
  padding: 20px;
}

/* No Results State */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--no-results-color);
}

.no-results i {
  opacity: 0.5;
}

.no-results h4 {
  margin-bottom: 10px;
  color: #495057;
}

/* Search Highlighting */
mark {
  background: var(--highlight-bg);
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-panel {
    padding: 15px;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .results-summary {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .quick-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filter-pills {
    width: 100%;
  }
  
  .pill-filter {
    flex: 1;
    text-align: center;
    min-width: 80px;
  }
  
  .feature-header {
    padding: 15px;
  }
  
  .feature-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 10px 40px;
  }
  
  .filter-actions {
    justify-content: stretch;
  }
  
  .filter-actions .btn {
    flex: 1;
  }
}
```

**🔍 Validation**: Test the search functionality by:
- Typing search queries and verifying results filter correctly
- Using quick filter pills to filter by test status
- Expanding advanced filters and testing each dropdown
- Verifying sort functionality works correctly

### Task 2: Modal Dialog System (20 minutes)

Create modal dialogs for displaying detailed step information and screenshots.

**Step 2.1**: Create modal system JavaScript

```javascript
// reports/html/assets/js/modal-system.js
class ModalSystem {
  constructor() {
    this.currentModal = null;
    this.modalStack = [];
    this.screenshots = new Map();
    
    this.initializeModalSystem();
  }

  /**
   * Initialize modal system
   */
  initializeModalSystem() {
    this.createModalContainer();
    this.bindGlobalEvents();
    this.loadScreenshots();
    
    console.log('✅ Modal system initialized');
  }

  /**
   * Create modal container HTML
   */
  createModalContainer() {
    const modalHTML = `
      <!-- Modal Overlay -->
      <div id="modalOverlay" class="modal-overlay">
        <!-- Step Detail Modal -->
        <div id="stepModal" class="modal step-modal">
          <div class="modal-header">
            <h3 class="modal-title" id="stepModalTitle">Step Details</h3>
            <button class="modal-close" data-modal="stepModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body" id="stepModalBody">
            <!-- Dynamic content will be inserted here -->
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-modal="stepModal">Close</button>
            <button class="btn btn-primary" id="copyStepDetails">
              <i class="fas fa-copy"></i> Copy Details
            </button>
          </div>
        </div>

        <!-- Screenshot Lightbox Modal -->
        <div id="screenshotModal" class="modal screenshot-modal">
          <div class="modal-header">
            <h3 class="modal-title" id="screenshotModalTitle">Screenshot</h3>
            <button class="modal-close" data-modal="screenshotModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body screenshot-body" id="screenshotModalBody">
            <div class="image-container">
              <img id="modalScreenshot" src="" alt="Test Screenshot" />
              <div class="image-controls">
                <button class="btn-zoom" id="zoomIn" title="Zoom In">
                  <i class="fas fa-search-plus"></i>
                </button>
                <button class="btn-zoom" id="zoomOut" title="Zoom Out">
                  <i class="fas fa-search-minus"></i>
                </button>
                <button class="btn-zoom" id="resetZoom" title="Reset Zoom">
                  <i class="fas fa-expand-arrows-alt"></i>
                </button>
                <button class="btn-zoom" id="downloadImage" title="Download">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="screenshot-info" id="screenshotInfo">
              <!-- Dynamic screenshot info -->
            </div>
            <button class="btn btn-secondary" data-modal="screenshotModal">Close</button>
          </div>
        </div>

        <!-- Error Detail Modal -->
        <div id="errorModal" class="modal error-modal">
          <div class="modal-header error-header">
            <h3 class="modal-title">
              <i class="fas fa-exclamation-triangle"></i>
              Error Details
            </h3>
            <button class="modal-close" data-modal="errorModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body" id="errorModalBody">
            <!-- Dynamic error content -->
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-modal="errorModal">Close</button>
            <button class="btn btn-danger" id="copyErrorDetails">
              <i class="fas fa-copy"></i> Copy Error
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  /**
   * Bind global event listeners
   */
  bindGlobalEvents() {
    const overlay = document.getElementById('modalOverlay');
    
    // Close modal when clicking overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeCurrentModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.closeCurrentModal();
      }
    });

    // Close buttons
    document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = btn.dataset.modal;
        if (modalId) {
          this.closeModal(modalId);
        } else {
          this.closeCurrentModal();
        }
      });
    });

    // Copy buttons
    document.getElementById('copyStepDetails').addEventListener('click', () => {
      this.copyStepDetails();
    });

    document.getElementById('copyErrorDetails').addEventListener('click', () => {
      this.copyErrorDetails();
    });

    // Screenshot controls
    this.bindScreenshotControls();

    // Bind step click events (delegated)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.step-clickable')) {
        const stepElement = e.target.closest('.step-clickable');
        this.showStepModal(stepElement);
      }
      
      if (e.target.closest('.screenshot-thumbnail')) {
        const thumbnail = e.target.closest('.screenshot-thumbnail');
        this.showScreenshotModal(thumbnail.dataset.screenshot);
      }
      
      if (e.target.closest('.error-clickable')) {
        const errorElement = e.target.closest('.error-clickable');
        this.showErrorModal(errorElement);
      }
    });
  }

  /**
   * Bind screenshot control events
   */
  bindScreenshotControls() {
    let currentZoom = 1;
    const img = document.getElementById('modalScreenshot');
    
    document.getElementById('zoomIn').addEventListener('click', () => {
      currentZoom = Math.min(currentZoom * 1.2, 5);
      img.style.transform = `scale(${currentZoom})`;
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
      currentZoom = Math.max(currentZoom / 1.2, 0.2);
      img.style.transform = `scale(${currentZoom})`;
    });
    
    document.getElementById('resetZoom').addEventListener('click', () => {
      currentZoom = 1;
      img.style.transform = 'scale(1)';
    });
    
    document.getElementById('downloadImage').addEventListener('click', () => {
      this.downloadScreenshot();
    });

    // Mouse wheel zoom
    img.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      currentZoom = Math.max(0.2, Math.min(5, currentZoom * delta));
      img.style.transform = `scale(${currentZoom})`;
    });
  }

  /**
   * Load available screenshots
   */
  async loadScreenshots() {
    try {
      // This would typically load from a screenshots directory
      // For now, we'll simulate with placeholder logic
      console.log('📸 Screenshot loading system ready');
    } catch (error) {
      console.warn('⚠️ Could not load screenshots:', error);
    }
  }

  /**
   * Show step detail modal
   */
  showStepModal(stepElement) {
    const stepData = this.extractStepData(stepElement);
    
    const modalBody = document.getElementById('stepModalBody');
    modalBody.innerHTML = `
      <div class="step-detail-content">
        <div class="step-header">
          <div class="step-info">
            <span class="step-keyword">${stepData.keyword}</span>
            <span class="step-name">${stepData.name}</span>
          </div>
          <div class="step-status">
            <span class="status-indicator ${stepData.status}"></span>
            <span class="status-text">${stepData.status.toUpperCase()}</span>
          </div>
        </div>

        <div class="step-metrics">
          <div class="metric">
            <label>Duration:</label>
            <span>${stepData.duration}ms</span>
          </div>
          <div class="metric">
            <label>Location:</label>
            <span>${stepData.location || 'N/A'}</span>
          </div>
          <div class="metric">
            <label>Timestamp:</label>
            <span>${new Date().toISOString()}</span>
          </div>
        </div>

        ${stepData.arguments ? `
          <div class="step-section">
            <h4>Arguments</h4>
            <div class="code-block">
              <pre><code>${JSON.stringify(stepData.arguments, null, 2)}</code></pre>
            </div>
          </div>
        ` : ''}

        ${stepData.attachments ? `
          <div class="step-section">
            <h4>Attachments</h4>
            <div class="attachments-grid">
              ${stepData.attachments.map(attachment => `
                <div class="attachment-item">
                  ${attachment.type === 'image' ? 
                    `<img src="${attachment.data}" alt="Screenshot" class="attachment-preview" />` :
                    `<div class="attachment-file">${attachment.name}</div>`
                  }
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${stepData.error ? `
          <div class="step-section error-section">
            <h4>Error Information</h4>
            <div class="error-content">
              <div class="error-message">
                <strong>Message:</strong>
                <pre>${stepData.error.message}</pre>
              </div>
              ${stepData.error.stack ? `
                <div class="error-stack">
                  <strong>Stack Trace:</strong>
                  <pre><code>${stepData.error.stack}</code></pre>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <div class="step-section">
          <h4>Related Information</h4>
          <div class="related-info">
            <p><strong>Feature:</strong> ${stepData.feature}</p>
            <p><strong>Scenario:</strong> ${stepData.scenario}</p>
            <p><strong>Step Index:</strong> ${stepData.index + 1}</p>
          </div>
        </div>
      </div>
    `;

    this.openModal('stepModal');
  }

  /**
   * Show screenshot modal
   */
  showScreenshotModal(screenshotPath) {
    const img = document.getElementById('modalScreenshot');
    const info = document.getElementById('screenshotInfo');
    const title = document.getElementById('screenshotModalTitle');
    
    img.src = screenshotPath;
    img.style.transform = 'scale(1)';
    
    title.textContent = `Screenshot - ${screenshotPath.split('/').pop()}`;
    
    info.innerHTML = `
      <div class="screenshot-meta">
        <span><strong>Path:</strong> ${screenshotPath}</span>
        <span><strong>Captured:</strong> ${new Date().toLocaleString()}</span>
      </div>
    `;

    this.openModal('screenshotModal');
  }

  /**
   * Show error detail modal
   */
  showErrorModal(errorElement) {
    const errorData = this.extractErrorData(errorElement);
    
    const modalBody = document.getElementById('errorModalBody');
    modalBody.innerHTML = `
      <div class="error-detail-content">
        <div class="error-summary">
          <div class="error-type">
            <strong>Error Type:</strong>
            <span class="error-badge">${errorData.type}</span>
          </div>
          <div class="error-severity">
            <strong>Severity:</strong>
            <span class="severity-badge ${errorData.severity}">${errorData.severity}</span>
          </div>
        </div>

        <div class="error-message-section">
          <h4>Error Message</h4>
          <div class="error-message-content">
            <pre><code>${errorData.message}</code></pre>
          </div>
        </div>

        ${errorData.stack ? `
          <div class="error-stack-section">
            <h4>Stack Trace</h4>
            <div class="stack-trace">
              <pre><code>${errorData.stack}</code></pre>
            </div>
          </div>
        ` : ''}

        <div class="error-context">
          <h4>Context Information</h4>
          <div class="context-grid">
            <div class="context-item">
              <strong>Step:</strong>
              <span>${errorData.step}</span>
            </div>
            <div class="context-item">
              <strong>Scenario:</strong>
              <span>${errorData.scenario}</span>
            </div>
            <div class="context-item">
              <strong>Feature:</strong>
              <span>${errorData.feature}</span>
            </div>
            <div class="context-item">
              <strong>Browser:</strong>
              <span>${errorData.browser || 'Unknown'}</span>
            </div>
          </div>
        </div>

        ${errorData.suggestions ? `
          <div class="error-suggestions">
            <h4>Suggested Solutions</h4>
            <ul>
              ${errorData.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;

    this.openModal('errorModal');
  }

  /**
   * Extract step data from DOM element
   */
  extractStepData(stepElement) {
    return {
      keyword: stepElement.querySelector('.step-keyword')?.textContent || '',
      name: stepElement.querySelector('.step-name')?.textContent || '',
      status: stepElement.classList.contains('passed') ? 'passed' : 
              stepElement.classList.contains('failed') ? 'failed' : 'skipped',
      duration: stepElement.querySelector('.step-duration')?.textContent || '0.00ms',
      location: stepElement.dataset.location,
      feature: stepElement.closest('.feature-card')?.querySelector('.feature-title')?.textContent || '',
      scenario: stepElement.closest('.scenario')?.querySelector('.scenario-title')?.textContent || '',
      index: Array.from(stepElement.parentElement.children).indexOf(stepElement),
      error: stepElement.querySelector('.step-error') ? {
        message: stepElement.querySelector('.step-error pre')?.textContent || '',
        stack: stepElement.dataset.stack
      } : null,
      arguments: stepElement.dataset.arguments ? JSON.parse(stepElement.dataset.arguments) : null,
      attachments: stepElement.dataset.attachments ? JSON.parse(stepElement.dataset.attachments) : null
    };
  }

  /**
   * Extract error data from DOM element
   */
  extractErrorData(errorElement) {
    const stepElement = errorElement.closest('.step');
    const scenarioElement = errorElement.closest('.scenario');
    const featureElement = errorElement.closest('.feature-card');

    return {
      type: 'Test Execution Error',
      severity: 'high',
      message: errorElement.textContent || 'Unknown error occurred',
      stack: errorElement.dataset.stack,
      step: stepElement?.querySelector('.step-name')?.textContent || 'Unknown step',
      scenario: scenarioElement?.querySelector('.scenario-title')?.textContent || 'Unknown scenario',
      feature: featureElement?.querySelector('.feature-title')?.textContent || 'Unknown feature',
      browser: 'Chrome', // This would come from test metadata
      suggestions: [
        'Check if the element selector is correct',
        'Verify that the page has fully loaded',
        'Ensure the element is visible and interactable',
        'Check for any JavaScript errors on the page'
      ]
    };
  }

  /**
   * Open a modal
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (this.currentModal) {
      this.modalStack.push(this.currentModal);
    }
    
    this.currentModal = modalId;
    overlay.classList.add('active');
    modal.classList.add('active');
    
    // Focus management
    modal.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close specific modal
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    modal.classList.remove('active');
    
    if (this.modalStack.length > 0) {
      this.currentModal = this.modalStack.pop();
    } else {
      this.currentModal = null;
      document.getElementById('modalOverlay').classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Close current modal
   */
  closeCurrentModal() {
    if (this.currentModal) {
      this.closeModal(this.currentModal);
    }
  }

  /**
   * Copy step details to clipboard
   */
  async copyStepDetails() {
    const content = document.getElementById('stepModalBody').textContent;
    
    try {
      await navigator.clipboard.writeText(content);
      this.showToast('Step details copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      this.showToast('Failed to copy step details', 'error');
    }
  }

  /**
   * Copy error details to clipboard
   */
  async copyErrorDetails() {
    const content = document.getElementById('errorModalBody').textContent;
    
    try {
      await navigator.clipboard.writeText(content);
      this.showToast('Error details copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      this.showToast('Failed to copy error details', 'error');
    }
  }

  /**
   * Download screenshot
   */
  downloadScreenshot() {
    const img = document.getElementById('modalScreenshot');
    const link = document.createElement('a');
    
    link.href = img.src;
    link.download = img.src.split('/').pop() || 'screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showToast('Screenshot download started', 'success');
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
}

// Initialize modal system
document.addEventListener('DOMContentLoaded', () => {
  window.modalSystem = new ModalSystem();
});
```

**🔍 Validation**: Test the modal system by:
- Clicking on test steps to view detailed information
- Opening error details for failed tests
- Testing screenshot lightbox functionality
- Verifying keyboard navigation (Escape to close)
- Testing copy-to-clipboard functionality

---

## ✅ Validation Criteria

### Core Requirements

1. **Interactive Search** ✅
   - Search functionality filters results correctly
   - Quick filter pills work for all test statuses
   - Advanced filters apply correctly
   - Sort functionality works as expected

2. **Modal System** ✅
   - Step detail modals display comprehensive information
   - Screenshot lightbox with zoom controls works
   - Error detail modals show actionable information
   - Keyboard navigation and accessibility works

3. **User Experience** ✅
   - All interactions are smooth and responsive
   - Mobile layout adapts correctly
   - Loading states and error handling work
   - Toast notifications provide feedback

### Success Indicators

**Search Functionality:**
- [ ] Search input responds immediately to typing
- [ ] Results update without page refresh
- [ ] Filter combinations work correctly
- [ ] Search highlighting is visible and accurate

**Modal Interactions:**
- [ ] Modals open and close smoothly
- [ ] Content is properly formatted and readable
- [ ] Copy functionality works across browsers
- [ ] Screenshot zoom and download work correctly

**Responsive Design:**
- [ ] Interface works on mobile devices
- [ ] Touch interactions function properly
- [ ] Layouts adapt to different screen sizes
- [ ] Performance remains smooth on mobile

---

## 🎉 Bonus Challenges

### Challenge 1: Advanced Search Features (Intermediate)
- Add fuzzy search using Fuse.js library
- Implement search suggestions and autocomplete
- Add search history and saved searches

### Challenge 2: Keyboard Shortcuts (Intermediate)
- Add keyboard shortcuts for common actions
- Implement arrow key navigation through results
- Add hotkeys for filtering and searching

### Challenge 3: Data Visualization (Advanced)
- Add charts showing test trends over time
- Create interactive graphs for test metrics
- Implement visual test coverage reports

**Ready for the next challenge? Continue with [Exercise 03: Custom Template System →](./03-custom-template-system.md)**

---

*You've successfully enhanced your reports with powerful interactive features! These improvements make the reports much more useful for daily QA work and stakeholder communication.* 🚀