# Lesson 02: Setting up GitHub Actions for Playwright

**Module**: MOD-04 CI/CD and Reporting  
**Lesson Duration**: 120 minutes  
**Difficulty Level**: Core  
**Prerequisites**: Lesson 01 completion (75%+ score), GitHub account, basic YAML familiarity  

## 📋 Lesson Overview

This hands-on lesson guides you through creating your first GitHub Actions workflow specifically optimized for Playwright test execution. You'll learn practical YAML configuration, environment setup, and artifact management while building a production-ready CI/CD pipeline that can scale with your testing needs.

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:

- **LO-02-01**: **Create functional GitHub Actions workflows** for Playwright test execution including proper YAML syntax, action selection, and workflow triggering mechanisms
- **LO-02-02**: **Configure test environment dependencies** including Node.js setup, Playwright installation, and browser provisioning in CI/CD environments
- **LO-02-03**: **Implement basic artifact management** for test results, screenshots, and execution logs with proper retention policies and access controls

## 📚 Lesson Structure

### **1. Introduction & Setup** (20 minutes)
- GitHub Actions fundamentals review
- Repository preparation and access verification
- Workflow file structure and location
- YAML syntax essentials for CI/CD

### **2. Basic Workflow Creation** (30 minutes)
- Creating your first Playwright workflow
- Trigger configuration and event handling
- Job definition and runner selection
- Step-by-step workflow construction

### **3. Environment Configuration** (35 minutes)
- Node.js version management and setup
- Playwright installation and browser provisioning
- Dependency management and caching strategies
- Environment variables and secrets handling

### **4. Test Execution & Debugging** (25 minutes)
- Running Playwright tests in CI environment
- Handling test failures and debugging techniques
- Log analysis and troubleshooting common issues
- Performance optimization for CI execution

### **5. Artifact Management** (10 minutes)
- Configuring test result uploads
- Screenshot and video artifact handling
- Retention policies and storage management
- Access control and security considerations

## 🛠️ Required Tools and Setup

### **Essential Requirements**
- **GitHub Account**: With repository creation permissions
- **Git**: Installed locally with basic command familiarity
- **Node.js**: Version 18+ (LTS recommended)
- **VS Code**: With GitHub Actions and YAML extensions
- **Web Browser**: For GitHub interface interaction

### **Playwright Project Setup**
- **Test Project**: Sample Playwright project (provided)
- **Dependencies**: package.json with Playwright configuration
- **Test Files**: Basic E2E test examples
- **Configuration**: playwright.config.ts setup

### **Pre-lesson Checklist**
- [ ] GitHub account created and verified
- [ ] Repository access and push permissions confirmed
- [ ] Local development environment ready
- [ ] Basic YAML syntax understanding
- [ ] Lesson 01 assessment passed (75%+)

## 📖 Key Topics Covered

### **GitHub Actions Fundamentals**
- Workflow file anatomy and structure
- Trigger events and scheduling options
- Jobs, steps, and action dependencies
- Runner environments and capabilities

### **YAML Configuration Mastery**
- Proper indentation and syntax rules
- Environment variables and expressions
- Conditional execution and matrix strategies
- Secret management and security practices

### **Playwright-Specific Setup**
- Browser installation and management
- Headless vs. headed execution modes
- Test configuration for CI environments
- Performance and resource optimization

### **Artifact and Logging**
- Test result format and storage
- Screenshot capture on failures
- Video recording configuration
- Log aggregation and analysis tools

## 🎯 Assessment Methods

### **Knowledge Check** (15 minutes)
- 8 multiple-choice questions on workflow configuration
- 4 YAML syntax and structure questions
- 3 troubleshooting scenario questions
- **Passing Score**: 75% (11/15 questions correct)

### **Hands-On Lab** (60 minutes)
- Create complete GitHub Actions workflow from scratch
- Configure multi-environment test execution
- Implement comprehensive artifact management
- **Deliverable**: Working CI/CD pipeline with test evidence

### **Troubleshooting Challenge** (15 minutes)
- Debug provided broken workflow configurations
- Identify and fix common CI/CD issues
- Optimize workflow performance and reliability
- **Success Criteria**: All tests passing in under 10 minutes

## 📁 Lesson Resources

### **Content Files**
- [`content.md`](content.md) - Step-by-step implementation guide
- [`examples/`](examples/) - Complete workflow templates and configurations
- [`exercises/`](exercises/) - Progressive hands-on labs and challenges
- [`assessment.md`](assessment.md) - Comprehensive evaluation and rubrics

### **Code Templates**
- **Starter Workflow**: Basic Playwright GitHub Actions template
- **Advanced Configurations**: Multi-browser, multi-OS setups
- **Troubleshooting Examples**: Common issues and solutions
- **Best Practices**: Production-ready workflow patterns

### **External Resources**
- GitHub Actions official documentation
- Playwright CI/CD integration guides
- YAML validation tools and syntax references
- Community best practices and examples

## 🚀 Career Relevance

### **Professional Skills Development**
- **DevOps Integration**: Essential skill for modern QA professionals
- **Infrastructure as Code**: YAML-based configuration management
- **Cloud Platform Expertise**: GitHub Actions and runner management
- **Automation Leadership**: Team enablement and process improvement

### **Salary Impact by Experience Level**
- **Entry Level ($65,000-85,000)**: Basic workflow creation and maintenance
- **Mid Level ($85,000-105,000)**: Advanced configuration and optimization
- **Senior Level ($105,000+)**: Architecture design and team leadership

### **Industry Applications**
- **SaaS Companies**: Continuous deployment and quality assurance
- **E-commerce Platforms**: High-frequency testing and release cycles
- **Financial Services**: Compliance-driven automation and audit trails
- **Healthcare Technology**: Regulated environment CI/CD practices

### **Next Steps Preparation**
This lesson prepares you for:
- Lesson 03: Advanced Playwright configuration for headless execution
- Multi-environment deployment strategies
- Professional CI/CD platform administration roles
- Leadership positions in DevOps and quality engineering

## 💡 Success Tips

### **For First-Time CI/CD Users**
- Start with the simplest possible workflow
- Test each change incrementally
- Use the GitHub Actions log viewer extensively
- Don't hesitate to copy and modify working examples

### **For Experienced Developers**
- Focus on Playwright-specific optimizations
- Experiment with advanced GitHub Actions features
- Consider security and compliance implications
- Plan for scalability and team adoption

### **For Team Leaders**
- Document your workflow decisions and rationale
- Consider team skill levels in complexity choices
- Plan change management and training strategies
- Establish monitoring and maintenance procedures

## 🆘 Getting Help

### **During the Lesson**
- **Live Support**: Ask questions during hands-on segments
- **Peer Collaboration**: Work with others on challenging configurations
- **Instructor Guidance**: Request help with complex YAML issues
- **Community Resources**: Leverage GitHub Actions community discussions

### **After the Lesson**
- **Documentation**: Comprehensive troubleshooting guides provided
- **Code Examples**: Multiple working configurations for reference
- **Community Support**: Join GitHub Actions and Playwright Discord servers
- **Continued Learning**: Advanced topics and optimization techniques

### **Troubleshooting Resources**
- **Common Issues Guide**: Typical problems and solutions
- **YAML Validator**: Syntax checking tools and references
- **Log Analysis**: How to read and interpret GitHub Actions logs
- **Performance Optimization**: Tips for faster, more reliable workflows

## 📊 Success Metrics

### **Technical Competency**
- Successfully create and deploy a working Playwright workflow
- Configure proper environment dependencies and artifact management
- Demonstrate troubleshooting skills with broken configurations
- Optimize workflow execution time and resource usage

### **Professional Readiness**
- Confidently explain workflow decisions to technical stakeholders
- Apply security best practices in CI/CD configuration
- Plan implementation strategies for real-world projects
- Mentor others in GitHub Actions and Playwright integration

### **Business Value**
- Reduce manual testing effort through effective automation
- Improve deployment reliability and quality assurance
- Enable faster release cycles and continuous delivery
- Provide clear metrics and reporting for stakeholder communication

---

**Next Lesson**: [Lesson 03: Configuring Playwright for Headless Execution](../lesson-03-configuring-playwright-for-headless-execution/README.md)

**Module Navigation**: [MOD-04 Overview](../../README.md) | [Previous Lesson](../lesson-01-introduction-to-ci-cd-for-qa/README.md) | [Next Module](../../../MOD-05_Cross_Browser_and_Device_Testing/README.md)

**Estimated Completion Time**: 2 hours  
**Practical Lab Weight**: 70% of lesson content  
**Theory/Concept Weight**: 30% of lesson content
