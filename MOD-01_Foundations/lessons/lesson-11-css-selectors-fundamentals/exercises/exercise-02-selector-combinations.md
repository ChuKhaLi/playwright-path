# Exercise 02: Advanced Selector Combinations

## Objective
Master advanced CSS selector combinations including descendant, child, adjacent sibling, and multiple class selectors to create complex styling rules and prepare for automated testing scenarios.

## Time Estimate
30-35 minutes

## Prerequisites
- Completed Exercise 01 (Basic CSS Selectors)
- Understanding of CSS specificity
- Familiarity with HTML nesting and structure

## Instructions

### Step 1: Create the HTML Structure
Create a new HTML file called `advanced-selectors.html` with this base structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced CSS Selector Combinations</title>
    <style>
        /* Your CSS combinations will go here */
    </style>
</head>
<body>
    <!-- HTML content will be added in steps -->
</body>
</html>
```

### Step 2: Add Complex HTML Structure
Add this HTML structure inside the `<body>` tag:

```html
<div class="app-container">
    <header class="site-header primary">
        <nav class="main-navigation">
            <ul class="nav-list">
                <li class="nav-item"><a href="#dashboard" class="nav-link active">Dashboard</a></li>
                <li class="nav-item"><a href="#users" class="nav-link">Users</a></li>
                <li class="nav-item"><a href="#settings" class="nav-link">Settings</a></li>
                <li class="nav-item"><a href="#help" class="nav-link external">Help</a></li>
            </ul>
        </nav>
        <div class="user-profile">
            <img src="https://via.placeholder.com/40" alt="User Avatar" class="avatar">
            <span class="username">John Doe</span>
            <button class="dropdown-toggle" data-testid="user-menu">▼</button>
        </div>
    </header>

    <main class="main-content">
        <section class="dashboard-section">
            <div class="section-header">
                <h1 class="page-title">Dashboard</h1>
                <button class="btn primary large" data-testid="new-item-btn">+ New Item</button>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card primary">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3 class="stat-number">1,234</h3>
                        <p class="stat-label">Total Users</p>
                    </div>
                </div>
                
                <div class="stat-card success">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <h3 class="stat-number">98.5%</h3>
                        <p class="stat-label">Success Rate</p>
                    </div>
                </div>
                
                <div class="stat-card warning">
                    <div class="stat-icon">⚠️</div>
                    <div class="stat-content">
                        <h3 class="stat-number">23</h3>
                        <p class="stat-label">Pending Issues</p>
                    </div>
                </div>
                
                <div class="stat-card danger">
                    <div class="stat-icon">🚨</div>
                    <div class="stat-content">
                        <h3 class="stat-number">5</h3>
                        <p class="stat-label">Critical Errors</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="data-section">
            <div class="section-header">
                <h2 class="section-title">Recent Activity</h2>
                <div class="section-controls">
                    <button class="btn secondary small">Filter</button>
                    <button class="btn secondary small">Export</button>
                </div>
            </div>
            
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="sortable" data-testid="name-header">Name</th>
                            <th class="sortable" data-testid="status-header">Status</th>
                            <th class="sortable" data-testid="date-header">Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-row active">
                            <td class="user-cell">
                                <img src="https://via.placeholder.com/32" alt="User" class="user-avatar">
                                <span class="user-name">Alice Johnson</span>
                            </td>
                            <td><span class="status-badge success">Active</span></td>
                            <td class="date-cell">2024-01-15</td>
                            <td class="actions-cell">
                                <button class="btn-icon edit" data-testid="edit-alice" title="Edit">✏️</button>
                                <button class="btn-icon delete" data-testid="delete-alice" title="Delete">🗑️</button>
                            </td>
                        </tr>
                        
                        <tr class="table-row">
                            <td class="user-cell">
                                <img src="https://via.placeholder.com/32" alt="User" class="user-avatar">
                                <span class="user-name">Bob Smith</span>
                            </td>
                            <td><span class="status-badge warning">Pending</span></td>
                            <td class="date-cell">2024-01-14</td>
                            <td class="actions-cell">
                                <button class="btn-icon edit" data-testid="edit-bob" title="Edit">✏️</button>
                                <button class="btn-icon delete" data-testid="delete-bob" title="Delete">🗑️</button>
                            </td>
                        </tr>
                        
                        <tr class="table-row inactive">
                            <td class="user-cell">
                                <img src="https://via.placeholder.com/32" alt="User" class="user-avatar">
                                <span class="user-name">Carol Davis</span>
                            </td>
                            <td><span class="status-badge danger">Inactive</span></td>
                            <td class="date-cell">2024-01-13</td>
                            <td class="actions-cell">
                                <button class="btn-icon edit" data-testid="edit-carol" title="Edit">✏️</button>
                                <button class="btn-icon delete" data-testid="delete-carol" title="Delete">🗑️</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="form-section">
            <div class="section-header">
                <h2 class="section-title">Quick Actions</h2>
            </div>
            
            <form class="quick-form" data-testid="quick-actions-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="task-name" class="form-label required">Task Name</label>
                        <input type="text" id="task-name" class="form-control" required data-testid="task-name-input">
                    </div>
                    
                    <div class="form-group">
                        <label for="priority" class="form-label">Priority</label>
                        <select id="priority" class="form-control" data-testid="priority-select">
                            <option value="">Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group full-width">
                        <label for="description" class="form-label">Description</label>
                        <textarea id="description" class="form-control" rows="3" data-testid="description-textarea"></textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn primary" data-testid="submit-task">Create Task</button>
                    <button type="reset" class="btn secondary" data-testid="reset-form">Reset</button>
                    <button type="button" class="btn danger outline" data-testid="cancel-task">Cancel</button>
                </div>
            </form>
        </section>
    </main>

    <aside class="sidebar">
        <div class="sidebar-section">
            <h3 class="sidebar-title">Quick Links</h3>
            <ul class="sidebar-menu">
                <li class="menu-item"><a href="#reports" class="menu-link">Reports</a></li>
                <li class="menu-item"><a href="#analytics" class="menu-link">Analytics</a></li>
                <li class="menu-item active"><a href="#dashboard" class="menu-link">Dashboard</a></li>
            </ul>
        </div>
        
        <div class="sidebar-section">
            <h3 class="sidebar-title">Recent Files</h3>
            <ul class="file-list">
                <li class="file-item">
                    <span class="file-icon">📄</span>
                    <span class="file-name">report_2024.pdf</span>
                </li>
                <li class="file-item">
                    <span class="file-icon">📊</span>
                    <span class="file-name">analytics.xlsx</span>
                </li>
                <li class="file-item">
                    <span class="file-icon">📝</span>
                    <span class="file-name">notes.txt</span>
                </li>
            </ul>
        </div>
    </aside>
</div>
```

### Step 3: Universal Selector and Base Styles
Add the foundation CSS:

```css
/* Universal selector - CSS reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Base element styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}
```

### Step 4: Descendant Selectors (Space)
Target elements inside other elements:

```css
/* All links inside navigation */
.main-navigation a {
    color: white;
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 6px;
    transition: background-color 0.2s;
}

/* All buttons inside form-actions */
.form-actions button {
    margin-right: 10px;
}

/* All paragraphs inside stat-content */
.stat-content p {
    margin: 0;
    font-size: 14px;
    color: #666;
}

/* All images inside user-cell */
.user-cell img {
    border-radius: 50%;
    margin-right: 10px;
}

/* All spans inside status badges */
.status-badge span {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
}
```

### Step 5: Child Selectors (>)
Target direct children only:

```css
/* Direct list items of nav-list only */
.nav-list > li {
    display: inline-block;
    margin-right: 5px;
}

/* Direct form-group children of form-row */
.form-row > .form-group {
    flex: 1;
    margin-right: 15px;
}

/* Direct children of stats-grid */
.stats-grid > .stat-card {
    flex: 1;
    min-width: 200px;
}

/* Direct tr children of tbody */
.data-table tbody > tr {
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

/* Direct sections of main-content */
.main-content > section {
    background: white;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Step 6: Adjacent Sibling Selectors (+)
Target elements immediately following other elements:

```css
/* Form group immediately after another form group */
.form-group + .form-group {
    margin-left: 15px;
}

/* Section immediately after dashboard-section */
.dashboard-section + .data-section {
    margin-top: 30px;
}

/* Button immediately after primary button */
.btn.primary + .btn {
    margin-left: 10px;
}

/* Label immediately followed by required input */
.form-label + .form-control[required] {
    border-left: 3px solid #e74c3c;
}
```

### Step 7: Multiple Class Selectors
Target elements with specific class combinations:

```css
/* Elements with both btn and primary classes */
.btn.primary {
    background-color: #007bff;
    color: white;
    border: 2px solid #007bff;
}

/* Elements with both btn and secondary classes */
.btn.secondary {
    background-color: #6c757d;
    color: white;
    border: 2px solid #6c757d;
}

/* Elements with both btn and danger classes */
.btn.danger {
    background-color: #dc3545;
    color: white;
    border: 2px solid #dc3545;
}

/* Elements with btn, danger, and outline classes */
.btn.danger.outline {
    background-color: transparent;
    color: #dc3545;
    border: 2px solid #dc3545;
}

/* Elements with both stat-card and primary classes */
.stat-card.primary {
    border-left: 4px solid #007bff;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

/* Elements with both stat-card and success classes */
.stat-card.success {
    border-left: 4px solid #28a745;
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

/* Elements with both stat-card and warning classes */
.stat-card.warning {
    border-left: 4px solid #ffc107;
    background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
}

/* Elements with both stat-card and danger classes */
.stat-card.danger {
    border-left: 4px solid #dc3545;
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

/* Elements with both status-badge and success classes */
.status-badge.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

/* Elements with both status-badge and warning classes */
.status-badge.warning {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}

/* Elements with both status-badge and danger classes */
.status-badge.danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
```

### Step 8: Complex Combinations
Combine multiple selector types:

```css
/* Active navigation links inside main navigation */
.main-navigation .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
}

/* External links inside navigation lists */
.nav-list .nav-link.external::after {
    content: " ↗";
    font-size: 12px;
    opacity: 0.7;
}

/* Hover state for primary buttons inside form actions */
.form-actions .btn.primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
    transform: translateY(-1px);
}

/* First child stat cards */
.stats-grid .stat-card:first-child {
    margin-left: 0;
}

/* Last child form groups */
.form-row .form-group:last-child {
    margin-right: 0;
}

/* Even table rows that are not active */
.data-table tr:nth-child(even):not(.active) {
    background-color: #f8f9fa;
}

/* Hover effect on inactive table rows */
.data-table tr.inactive:hover {
    background-color: #fff3cd;
}

/* Focus state for required form controls */
.form-control[required]:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Disabled state for buttons inside actions cell */
.actions-cell .btn-icon:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

### Step 9: Layout and Structure
Add the remaining layout CSS:

```css
/* App container layout */
.app-container {
    display: grid;
    grid-template-areas: 
        "header header"
        "main sidebar";
    grid-template-columns: 1fr 280px;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
    gap: 20px;
    padding: 20px;
}

/* Header layout */
.site-header {
    grid-area: header;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Main content layout */
.main-content {
    grid-area: main;
}

/* Sidebar layout */
.sidebar {
    grid-area: sidebar;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: fit-content;
}

/* Section headers */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #eee;
}

/* Stats grid layout */
.stats-grid {
    display: flex;
    gap: 20px;
    padding: 25px;
    flex-wrap: wrap;
}

/* Form layout */
.form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
}

.form-group.full-width {
    width: 100%;
}

/* Table layout */
.data-table-container {
    overflow-x: auto;
    padding: 0 25px 25px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}
```

### Step 10: Add Responsive Design
Include responsive selectors:

```css
/* Responsive design using attribute selectors and combinations */
@media (max-width: 768px) {
    .app-container {
        grid-template-areas: 
            "header"
            "main"
            "sidebar";
        grid-template-columns: 1fr;
        padding: 10px;
        gap: 15px;
    }
    
    /* Stack navigation items on mobile */
    .nav-list > li {
        display: block;
        margin-bottom: 5px;
    }
    
    /* Stack form groups on mobile */
    .form-row > .form-group {
        margin-right: 0;
        margin-bottom: 15px;
    }
    
    /* Stack stats cards on mobile */
    .stats-grid > .stat-card {
        min-width: 100%;
    }
    
    /* Hide action buttons on mobile except first */
    .actions-cell .btn-icon:not(:first-child) {
        display: none;
    }
}
```

## Testing Your Advanced Selectors

### Step 1: Test Descendant Selectors
1. Verify that all navigation links are white
2. Check that all buttons inside form-actions have right margins
3. Confirm that stat-content paragraphs are smaller and gray
4. Ensure user avatars are circular with margins

### Step 2: Test Child Selectors
1. Check that only direct nav-list children are inline-block
2. Verify that form-groups inside form-rows have proper flex layout
3. Confirm that direct stat-cards have equal flex sizing
4. Ensure table rows have bottom borders

### Step 3: Test Adjacent Sibling Selectors
1. Verify that second form-groups have left margins
2. Check spacing between sections
3. Confirm button spacing after primary buttons
4. Test required input styling after labels

### Step 4: Test Multiple Class Combinations
1. Verify each button type (.btn.primary, .btn.secondary, etc.) has correct colors
2. Check that stat-cards with different themes have appropriate backgrounds
3. Confirm status badges display correct colors based on class combinations
4. Test .btn.danger.outline has transparent background

### Step 5: Test Complex Combinations
1. Check that .nav-link.active has special background
2. Verify external links show arrow icons
3. Confirm hover effects work on combined selectors
4. Test that inactive table rows have proper hover effects

## Common Challenges and Solutions

### Challenge 1: Specificity Conflicts
**Problem**: Some styles don't apply due to specificity
**Solution**: 
```css
/* Instead of fighting specificity, be more specific */
.main-navigation .nav-list .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
}
```

### Challenge 2: Overly Complex Selectors
**Problem**: Selectors become too long and fragile
**Solution**:
```css
/* Too complex */
.app-container .main-content .data-section .data-table tbody tr.table-row:not(.active):hover {
    background-color: #f8f9fa;
}

/* Better approach */
.table-row:not(.active):hover {
    background-color: #f8f9fa;
}
```

### Challenge 3: Adjacent Sibling Not Working
**Problem**: Adjacent sibling selector only works for immediate siblings
**Solution**:
```css
/* This only works if elements are directly adjacent */
.form-group + .form-group {
    margin-left: 15px;
}

/* For general siblings, use ~ */
.form-group ~ .form-group {
    margin-left: 15px;
}
```

## Validation Checklist

### Descendant Selectors (Space)
- [ ] Navigation links styled within main-navigation
- [ ] Form buttons styled within form-actions
- [ ] Stat paragraphs styled within stat-content
- [ ] User images styled within user-cell

### Child Selectors (>)
- [ ] Direct nav-list items have inline-block display
- [ ] Direct form-groups have flex properties
- [ ] Direct stat-cards have equal sizing
- [ ] Direct table rows have border styling

### Adjacent Sibling Selectors (+) 
- [ ] Second form-groups have left margins
- [ ] Sections have proper top margins
- [ ] Secondary buttons have left margins
- [ ] Required inputs have red borders after labels

### Multiple Class Combinations
- [ ] .btn.primary has blue background
- [ ] .btn.secondary has gray background  
- [ ] .btn.danger has red background
- [ ] .btn.danger.outline has transparent background
- [ ] .stat-card.primary has blue left border
- [ ] .status-badge.success has green styling

### Complex Combinations
- [ ] .nav-link.active has special background
- [ ] .nav-link.external shows arrow icon
- [ ] .btn.primary:hover has darker blue
- [ ] .table-row.inactive:hover has yellow background
- [ ] [required]:focus has blue border and shadow

## Expected Results

Your completed dashboard should demonstrate:

### Visual Hierarchy
- ✅ Professional header with gradient background
- ✅ Card-based layout with proper spacing
- ✅ Color-coded stat cards and status badges
- ✅ Clean data table with hover effects
- ✅ Functional form with proper validation styling

### Selector Functionality
- ✅ **Descendant selectors**: Styling elements within specific containers
- ✅ **Child selectors**: Targeting direct children for layout control
- ✅ **Adjacent siblings**: Managing spacing between related elements
- ✅ **Multiple classes**: Creating themed components with class combinations
- ✅ **Complex combinations**: Advanced targeting with pseudo-classes and attributes

### Interactive Features
- ✅ Hover effects on buttons and table rows
- ✅ Focus states on form inputs
- ✅ Visual feedback for required fields
- ✅ Status indicators with appropriate colors

## Testing for Automation Context

This exercise prepares you for automated testing by demonstrating:

### Reliable Selectors
```css
/* Good for testing - stable and semantic */
[data-testid="user-menu"]
.nav-link.active
.status-badge.success
.btn.primary
```

### Avoiding Fragile Selectors
```css
/* Avoid - too dependent on structure */
.app-container > .main-content > section:first-child > .section-header > button

/* Better - more stable */
[data-testid="new-item-btn"]
.btn.primary
```

## Extension Challenges (Optional)

### Challenge 1: Advanced Pseudo-Selectors
Add more sophisticated targeting:
```css
.data-table tr:nth-child(3n):not(.active) {
    background-color: #f0f8ff;
}

.form-control:not([type="submit"]):not([type="button"]) {
    border-radius: 6px;
}
```

### Challenge 2: Attribute Value Selectors
Target specific attribute values:
```css
[data-testid^="edit-"] {
    color: #17a2b8;
}

[data-testid$="-btn"] {
    font-weight: 600;
}

[title*="Edit"] {
    border-color: #17a2b8;
}
```

### Challenge 3: Complex Animations
Add state-based animations:
```css
.stat-card.primary:hover .stat-number {
    transform: scale(1.1);
    transition: transform 0.3s ease;
}

.table-row:hover .actions-cell .btn-icon {
    opacity: 1;
    transform: translateX(0);
}
```

## Reflection Questions

After completing this exercise:

1. **Selector Strategy**: When would you use descendant vs. child selectors?
2. **Specificity Management**: How do multiple classes affect selector specificity?
3. **Maintainability**: Which selector combinations are most maintainable?
4. **Testing Implications**: How do these selectors translate to automated testing?

## Next Steps

You've now mastered:
- Complex selector combinations for precise targeting
- Layout control using CSS selector strategies
- Component theming with multiple class selectors
- Responsive design with selector-based media queries

This knowledge prepares you for:
- Advanced CSS architecture patterns
- Automated testing with reliable selectors
- Complex web application styling
- Understanding how testing frameworks locate elements

The selector patterns you've learned here are directly applicable to tools like Playwright, Selenium, and Cypress for web automation testing.