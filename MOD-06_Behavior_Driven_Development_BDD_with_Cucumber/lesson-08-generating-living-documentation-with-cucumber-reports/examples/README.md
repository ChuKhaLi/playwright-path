# Examples - Generating Living Documentation with Cucumber Reports

This directory contains progressive examples demonstrating how to configure, customize, and deploy comprehensive Cucumber reporting systems that generate living documentation for your BDD test suites.

## Learning Path

These examples are designed to be followed sequentially, with each building upon concepts from the previous ones:

### 📊 [Example 01: Basic Report Configuration](./01-basic-report-configuration.md)
**Duration**: 30 minutes  
**Complexity**: Beginner  
**Focus**: Setting up multiple Cucumber reporters and generating standard reports

**What You'll Learn**:
- Configure multiple reporters in Cucumber.js
- Generate HTML, JSON, and JUnit XML reports
- Set up basic CI/CD report integration
- Understand report data structure and formats

**Key Technologies**: cucumber-html-reporter, cucumber-junit-reporter, JSON formatting

---

### 🎨 [Example 02: Advanced HTML Reports](./02-advanced-html-reports.md)
**Duration**: 45 minutes  
**Complexity**: Intermediate  
**Focus**: Creating interactive, customized HTML reports with advanced features

**What You'll Learn**:
- Customize HTML report themes and branding
- Add interactive filtering and search capabilities
- Embed screenshots, videos, and rich media
- Implement responsive design for mobile access

**Key Technologies**: multiple-cucumber-html-reporter, custom CSS/JS, Handlebars templating

---

### 🔧 [Example 03: Custom Report Templates](./03-custom-report-templates.md)
**Duration**: 60 minutes  
**Complexity**: Advanced  
**Focus**: Building specialized reports for different audiences and purposes

**What You'll Learn**:
- Create audience-specific report templates
- Implement custom data transformation pipelines
- Build multi-language and accessible reports
- Generate executive summaries and technical details

**Key Technologies**: Template engines, data processing, accessibility tools, i18n

---

### 📈 [Example 04: Real-time Dashboard Integration](./04-realtime-dashboard-integration.md)
**Duration**: 75 minutes  
**Complexity**: Expert  
**Focus**: Live test execution monitoring and real-time reporting systems

**What You'll Learn**:
- Build real-time test execution dashboards
- Implement WebSocket-based live updates
- Integrate with monitoring platforms (Grafana, DataDog)
- Create alerting and notification systems

**Key Technologies**: WebSocket, real-time data streaming, dashboard frameworks, monitoring APIs

---

## Example Usage Scenarios

Each example addresses specific real-world scenarios:

### **Example 01 - Basic Configuration**
- ✅ **New Team Setup**: Getting started with Cucumber reporting
- ✅ **CI/CD Integration**: Basic pipeline report generation
- ✅ **Multi-Format Needs**: Different report formats for different tools
- ✅ **Archive Management**: Storing and organizing historical reports

### **Example 02 - Advanced HTML Reports**
- ✅ **Stakeholder Communication**: Beautiful, branded reports for business stakeholders
- ✅ **Developer Experience**: Interactive reports for quick issue identification
- ✅ **Mobile Access**: Reports accessible on mobile devices and tablets
- ✅ **Rich Media Integration**: Screenshots and videos for comprehensive documentation

### **Example 03 - Custom Templates**
- ✅ **Executive Reporting**: High-level summaries for leadership
- ✅ **Technical Documentation**: Detailed reports for development teams
- ✅ **Compliance Reporting**: Specialized formats for regulatory requirements
- ✅ **Multi-Language Support**: Reports in multiple languages for global teams

### **Example 04 - Real-time Dashboards**
- ✅ **Live Monitoring**: Real-time test execution visibility
- ✅ **Performance Tracking**: Continuous performance and quality monitoring
- ✅ **Incident Response**: Immediate alerts for test failures and issues
- ✅ **Trend Analysis**: Historical data analysis and prediction

---

## Prerequisites for Examples

### Required Setup
- ✅ Node.js (v18+) with npm or yarn
- ✅ Cucumber.js with TypeScript configuration
- ✅ Playwright Test framework
- ✅ At least 10-15 test scenarios for meaningful reports
- ✅ Basic understanding of HTML, CSS, and JavaScript

### Recommended Tools
- ✅ Visual Studio Code with relevant extensions
- ✅ Git for version control
- ✅ Docker for containerized examples
- ✅ Access to CI/CD platform (optional but recommended)

---

## Common Reporting Patterns

Throughout these examples, you'll encounter several recurring patterns:

### **Multi-Reporter Architecture**
```javascript
// cucumber.js configuration pattern
module.exports = {
  default: {
    format: [
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/cucumber-report.xml',
      '@cucumber/pretty-formatter'
    ],
    // Additional configuration
  }
};
```

### **Custom Data Processing Pipeline**
```javascript
// Report generation pattern
const reportOptions = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: true
};
```

### **Template Customization Pattern**
```javascript
// Custom template processing
const customTemplate = {
  brandingHtml: '<div class="custom-branding">Company Logo</div>',
  customData: {
    buildInfo: process.env.BUILD_INFO,
    environment: process.env.NODE_ENV
  }
};
```

---

## Best Practices Demonstrated

### **Report Organization**
- Structured directory hierarchy for report storage
- Consistent naming conventions for different report types
- Version control integration for report templates
- Archive management for historical report data

### **Performance Optimization**
- Efficient report generation for large test suites
- Caching strategies for repeated report generation
- Parallel processing for multiple report formats
- Resource optimization for media-rich reports

### **Security and Access Control**
- Secure handling of sensitive test data in reports
- Access control patterns for different stakeholder groups
- Data masking for production report distribution
- Compliance considerations for regulated environments

---

## Troubleshooting Guide

### Common Issues and Solutions

#### **Report Generation Failures**
```bash
# Check dependencies
npm ls cucumber-html-reporter

# Verify file permissions
ls -la reports/

# Test with minimal configuration
npx cucumber-js --format json:test.json
```

#### **Template Customization Issues**
```bash
# Validate JSON structure
npx jsonlint reports/cucumber-report.json

# Check template syntax
# Use online Handlebars validators

# Test incremental changes
# Start with basic template, add features gradually
```

#### **Real-time Integration Problems**
```bash
# Check WebSocket connections
# Use browser developer tools

# Verify API endpoints
curl -X GET http://localhost:3000/api/reports/status

# Monitor resource usage
# Check memory and CPU utilization
```

---

## Advanced Topics Preview

These examples prepare you for advanced reporting scenarios:

- **Custom Metrics Collection**: Beyond pass/fail - performance, coverage, quality metrics
- **Machine Learning Integration**: Predictive analytics and intelligent insights
- **Multi-Project Reporting**: Consolidated reports across multiple projects and teams
- **Compliance Automation**: Automated regulatory and audit report generation

---

## Next Steps

After completing these examples:

1. **Practice Exercises**: Apply concepts through hands-on exercises
2. **Assessment Preparation**: Review key concepts for evaluation
3. **Advanced Integration**: Explore enterprise reporting patterns
4. **Community Contribution**: Share your custom reporting solutions

---

## Quick Navigation

| Example | Duration | Complexity | Key Focus |
|---------|----------|------------|-----------|
| [01 - Basic Configuration](./01-basic-report-configuration.md) | 30 min | Beginner | Multi-reporter setup |
| [02 - Advanced HTML Reports](./02-advanced-html-reports.md) | 45 min | Intermediate | Interactive customization |
| [03 - Custom Templates](./03-custom-report-templates.md) | 60 min | Advanced | Audience-specific reports |
| [04 - Real-time Dashboards](./04-realtime-dashboard-integration.md) | 75 min | Expert | Live monitoring systems |

**Total Example Time**: 3.5 hours for comprehensive understanding

Ready to transform your test results into powerful living documentation? Let's start with the fundamentals! 🚀

**[Begin with Example 01: Basic Report Configuration →](./01-basic-report-configuration.md)**