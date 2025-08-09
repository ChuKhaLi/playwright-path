# Exercise 01: Platform Evaluation Workshop

**Duration**: 45 minutes  
**Difficulty**: Beginner  
**Type**: Hands-on Analysis  
**Prerequisites**: Completion of lesson content and platform comparison matrix review  

## 🎯 Exercise Objectives

By completing this exercise, you will:
- **Apply platform evaluation criteria** to real-world scenarios
- **Calculate ROI projections** for CI/CD implementation
- **Create a justified recommendation** for platform selection
- **Develop stakeholder communication skills** for technical decisions

---

## 📋 Exercise Overview

You'll work through a realistic platform selection scenario, evaluating different CI/CD options for a fictional company and presenting your recommendation with supporting analysis.

### **Scenario: TechCorp E-commerce Platform**

**Company Profile:**
- **Team Size**: 25 developers, 5 QA engineers
- **Current Stack**: JavaScript/TypeScript, React, Node.js, PostgreSQL
- **Repository**: GitHub (migrated 6 months ago)
- **Testing**: Manual testing + some Playwright E2E tests
- **Release Frequency**: Monthly releases (want to move to weekly)
- **Budget**: $2,000-5,000/month for CI/CD tooling
- **Compliance**: PCI DSS for payment processing

**Current Pain Points:**
- Manual testing takes 3-5 days per release
- 15-20 critical bugs reach production monthly
- Deployment process takes 4-6 hours
- No automated quality gates
- Testing environment inconsistencies

---

## 🔧 Part 1: Current State Assessment (15 minutes)

### **Task 1.1: Baseline Analysis**

Complete the current state assessment for TechCorp:

```yaml
# TechCorp Current State Assessment
testing-practices:
  manual-testing-percentage: ____%
  automated-test-coverage: ____%
  average-test-cycle-duration: ____ days
  defect-detection-rate: ____%
  production-bugs-per-release: ____
  
development-practices:
  version-control-usage: ____
  branching-strategy: ____
  code-review-process: ____
  deployment-frequency: ____
  deployment-duration: ____ hours
  
infrastructure:
  testing-environments: ____
  environment-provisioning: ____
  monitoring-capabilities: ____
  
team-readiness:
  automation-skills: ____
  devops-culture: ____
  change-management: ____
```

### **Task 1.2: Pain Point Analysis**

Calculate the current cost of their pain points:

```yaml
# Monthly Cost Analysis
manual-testing-cost:
  qa-engineers: 5
  average-salary: $4,000/month
  time-spent-testing: ____%
  monthly-testing-cost: $____

production-incident-cost:
  critical-bugs-per-month: ____
  average-resolution-time: ____ hours
  hourly-cost-impact: $500
  monthly-incident-cost: $____

deployment-inefficiency:
  deployment-frequency: ____
  hours-per-deployment: ____
  team-members-involved: ____
  hourly-rate: $50
  monthly-deployment-cost: $____

total-monthly-pain-cost: $____
total-annual-pain-cost: $____
```

**💡 Solution Guidelines:**
- Manual testing: ~80% of QA time
- Production bugs: 15-20 monthly  
- Deployment team: 3-4 people involved
- Consider opportunity cost of delayed features

---

## 🏗️ Part 2: Platform Evaluation (20 minutes)

### **Task 2.1: Platform Scoring**

Using the comparison matrix from the examples, score each platform for TechCorp's specific needs:

| Criteria | Weight | GitHub Actions | Jenkins | Azure DevOps | CircleCI |
|----------|--------|----------------|---------|--------------|----------|
| **GitHub Integration** | 25% | ___/5 | ___/5 | ___/5 | ___/5 |
| **Ease of Setup** | 20% | ___/5 | ___/5 | ___/5 | ___/5 |
| **Cost Effectiveness** | 20% | ___/5 | ___/5 | ___/5 | ___/5 |
| **PCI Compliance** | 15% | ___/5 | ___/5 | ___/5 | ___/5 |
| **Scalability** | 10% | ___/5 | ___/5 | ___/5 | ___/5 |
| **Team Adoption** | 10% | ___/5 | ___/5 | ___/5 | ___/5 |

### **Task 2.2: Cost Projection**

Calculate monthly costs for each platform based on TechCorp's usage:

**Usage Assumptions:**
- 40 commits per day (growing team)
- 30 minutes average test execution
- 22 working days per month
- Matrix testing: 3 browsers × 2 OS = 6 combinations

```yaml
# GitHub Actions Cost Calculation
monthly-usage:
  commits-per-month: 40 × 22 = 880
  minutes-per-test-run: 30 × 6 = 180
  total-monthly-minutes: 880 × 180 = 158,400
  free-tier-minutes: 2,000
  billable-minutes: 156,400
  cost-per-minute: $0.008
  monthly-cost: $____

# Jenkins Cost (Self-hosted)
infrastructure-cost: $300/month (servers)
maintenance-cost: $1,500/month (0.5 FTE DevOps)
compliance-setup: $2,000 (one-time)
total-monthly-equivalent: $____

# Azure DevOps Cost
user-licenses: 30 × $6 = $180
parallel-jobs: 10 × $40 = $400
compliance-features: $200
total-monthly: $____

# CircleCI Cost
performance-plan: 30 × $15 = $450
credit-usage: $600 (estimated)
total-monthly: $____
```

### **Task 2.3: Weighted Scoring**

Calculate final weighted scores:

```yaml
# Weighted Score Calculation
scoring-formula: (score × weight) summed across all criteria

github-actions: ____/5.0
jenkins: ____/5.0
azure-devops: ____/5.0
circleci: ____/5.0
```

**💡 Scoring Hints:**
- GitHub Actions: Excellent GitHub integration, easy setup
- Jenkins: Maximum flexibility, high maintenance
- Azure DevOps: Good compliance, higher cost
- CircleCI: Great performance, steeper learning curve

---

## 💰 Part 3: ROI Analysis (10 minutes)

### **Task 3.1: Projected Benefits**

Calculate the potential improvements for your recommended platform:

```yaml
# Projected Improvements (Annual)
time-savings:
  testing-automation: ___% reduction × $____ = $____
  deployment-automation: ___% reduction × $____ = $____
  
quality-improvement:
  reduced-production-bugs: ___% × $____ = $____
  faster-issue-resolution: ___% × $____ = $____
  
productivity-gains:
  faster-release-cycles: ____ additional releases × $____ = $____
  developer-efficiency: ___% improvement × $____ = $____
  
total-annual-benefits: $____
```

### **Task 3.2: Implementation Costs**

```yaml
# Implementation Investment
platform-costs: $____ (annual)
setup-time: ____ hours × $50/hour = $____
training-costs: $____ 
process-changes: $____
contingency: $____ (10% of total)

total-implementation-cost: $____
```

### **Task 3.3: ROI Calculation**

```yaml
# ROI Analysis
net-annual-benefit: benefits - annual-costs = $____
roi-percentage: (net-benefit ÷ investment) × 100 = ____%
payback-period: investment ÷ monthly-savings = ____ months

# Risk-adjusted ROI (conservative estimate)
conservative-benefits: benefits × 0.7 = $____
conservative-roi: ____%
```

**💡 Expected Results:**
- ROI should be 200-500% for well-implemented CI/CD
- Payback period typically 6-12 months
- Conservative estimates help with stakeholder buy-in

---

## 📊 Part 4: Recommendation Report

### **Task 4.1: Executive Summary**

Write a 3-paragraph executive summary:

```markdown
## Executive Summary

**Current State:** [Describe TechCorp's pain points and costs]

**Recommendation:** [State your recommended platform and key reasons]

**Business Impact:** [Quantify ROI, timeline, and strategic benefits]
```

### **Task 4.2: Technical Justification**

```markdown
## Technical Analysis

### Platform Selection: ________________

### Key Decision Factors:
1. **Integration:** [Explain how it fits current stack]
2. **Scalability:** [Address growth requirements]  
3. **Compliance:** [PCI DSS considerations]
4. **Team Adoption:** [Change management factors]

### Implementation Plan:
- **Phase 1 (Month 1):** [Initial setup activities]
- **Phase 2 (Month 2-3):** [Full implementation]
- **Phase 3 (Month 4+):** [Optimization and scaling]
```

### **Task 4.3: Risk Mitigation**

```yaml
# Risk Assessment and Mitigation
identified-risks:
  team-adoption:
    risk-level: [low/medium/high]
    mitigation: ____
    
  technical-complexity:
    risk-level: [low/medium/high]
    mitigation: ____
    
  cost-overrun:
    risk-level: [low/medium/high]
    mitigation: ____
    
  compliance-gaps:
    risk-level: [low/medium/high]
    mitigation: ____
```

---

## ✅ Deliverables Checklist

### **Required Outputs:**
- [ ] Completed current state assessment
- [ ] Platform scoring matrix with justifications
- [ ] ROI calculation with conservative estimates
- [ ] Executive summary (150-200 words)
- [ ] Technical recommendation (300-400 words)
- [ ] Risk mitigation plan

### **Bonus Challenges:**
- [ ] Create a visual comparison chart
- [ ] Develop a 12-month implementation timeline
- [ ] Propose success metrics and KPIs
- [ ] Draft a team communication plan

---

## 🎯 Success Criteria

### **Excellent (90-100%)**
- All calculations are accurate and well-reasoned
- Recommendation clearly aligns with business needs
- Risk assessment is comprehensive and realistic
- Communication is clear and stakeholder-appropriate

### **Good (75-89%)**
- Most calculations are correct with minor errors
- Recommendation is logical but may miss some factors
- Basic risk assessment provided
- Generally clear communication

### **Needs Improvement (<75%)**
- Significant calculation errors or missed steps
- Recommendation doesn't align well with scenario
- Limited risk consideration
- Unclear or inappropriate communication

---

## 💡 Reflection Questions

After completing the exercise, consider:

1. **What surprised you** about the cost differences between platforms?
2. **Which factors** were most challenging to evaluate objectively?
3. **How would you handle** stakeholder disagreement with your recommendation?
4. **What additional information** would you want in a real-world scenario?
5. **How confident are you** in presenting this analysis to executives?

---

## 🚀 Real-World Application

### **Taking This Exercise Further:**
- **Use with your current organization**: Adapt the scenario to your actual context
- **Practice with different constraints**: Try varying budgets, team sizes, or requirements
- **Validate assumptions**: Research actual customer case studies and testimonials
- **Build a decision framework**: Create a reusable template for future evaluations

### **Next Steps:**
- Schedule a team discussion about your findings
- Research the recommended platform's documentation
- Plan a proof-of-concept implementation
- Prepare for potential objections and questions

---

**Time Check**: You should complete this exercise in 45 minutes. If you're taking longer, focus on the core calculations and summary rather than perfect formatting.

**Peer Review**: If possible, have a colleague review your recommendation and provide feedback on clarity and persuasiveness.

**Documentation**: Save your completed exercise - it will be valuable reference material as you implement CI/CD in real projects.