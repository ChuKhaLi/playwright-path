# Lesson 1.1: HTML Document Structure - Assessment

## 📋 Assessment Overview

This assessment evaluates your understanding of HTML5 document structure and semantic elements through multiple assessment types. Complete all sections to demonstrate mastery of the lesson objectives.

### 🎯 Assessment Objectives

You will be assessed on your ability to:
- Analyze HTML5 document structure and identify components
- Create well-structured HTML documents with semantic elements
- Apply data-testid attributes for automation testing
- Distinguish between semantic and non-semantic elements
- Validate HTML markup using industry-standard tools

### ⏱️ Time Allocation
- **Knowledge Check**: 15 minutes
- **Practical Assessment**: 45 minutes
- **Code Review**: 15 minutes
- **Total Time**: 75 minutes

---

## 📝 Part 1: Knowledge Check (25 points)

### Question 1: HTML5 Document Structure (5 points)

**Multiple Choice**: Which of the following is the correct HTML5 document structure?

A)
```html
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    Content here
</body>
</html>
```

B)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page Title</title>
</head>
<body>
    Content here
</body>
</html>
```

C)
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    Content here
</body>
</html>
```

D)
```html
<html5>
<head>
    <title>Page Title</title>
</head>
<body>
    Content here
</body>
</html5>
```

**Answer**: _____ 

**Explanation** (required): ________________________________

### Question 2: Semantic Elements (5 points)

**True/False**: Mark each statement as True (T) or False (F):

1. The `<header>` element can only be used once per page. ____
2. The `<main>` element should contain the primary content of the page. ____
3. `<div>` and `<span>` are semantic elements. ____
4. The `<nav>` element should only contain navigation links. ____
5. Multiple `<section>` elements can be used on a single page. ____

### Question 3: Data Attributes (5 points)

**Short Answer**: Explain why `data-testid` attributes are important for automation testing and provide three benefits.

1. ________________________________
2. ________________________________
3. ________________________________

### Question 4: Element Selection (5 points)

**Matching**: Match each HTML element with its primary purpose:

Elements:
A. `<article>`
B. `<aside>`
C. `<nav>`
D. `<section>`
E. `<time>`

Purposes:
1. Represents a specific moment in time ____
2. Contains navigation links ____
3. Groups thematically related content ____
4. Self-contained, independently distributable content ____
5. Tangentially related content ____

### Question 5: Best Practices (5 points)

**Multiple Select**: Which of the following are best practices for HTML5 semantic markup? (Select all that apply)

□ A. Use `<div>` elements instead of semantic elements for styling flexibility
□ B. Include `data-testid` attributes on elements that will be tested
□ C. Maintain proper heading hierarchy (h1, h2, h3, etc.)
□ D. Use multiple `<main>` elements for different content sections
□ E. Include meaningful alt text for images
□ F. Use ARIA labels to enhance accessibility
□ G. Skip heading levels when they don't match your design

**Selected**: ________________________________

---

## 💻 Part 2: Practical Assessment (50 points)

### Task: Create a Complete Blog Article Page

**Scenario**: You are tasked with creating an HTML page for a technology blog article. The page must demonstrate proper semantic structure and be ready for automation testing.

### Requirements

#### 1. Document Structure (10 points)
Create a complete HTML5 document with:
- [ ] Proper DOCTYPE declaration
- [ ] HTML element with language attribute
- [ ] Complete head section with all required meta tags
- [ ] Title: "Understanding Web APIs - TechBlog"
- [ ] Meta description about web APIs

#### 2. Semantic Structure (20 points)
Implement the following semantic elements with proper nesting:

**Header Section** (5 points):
- [ ] `<header>` with site branding
- [ ] `<nav>` with main navigation (Home, Articles, About, Contact)
- [ ] All navigation items as proper links
- [ ] Appropriate data-testid attributes

**Main Content** (10 points):
- [ ] `<main>` element containing primary content
- [ ] `<article>` element for the blog post
- [ ] Article `<header>` with title, author, and publication date
- [ ] At least 3 `<section>` elements within the article
- [ ] Proper heading hierarchy (h1, h2, h3)
- [ ] `<time>` element with proper datetime attribute

**Sidebar** (3 points):
- [ ] `<aside>` element with related content
- [ ] "Recent Articles" section with 3 article links
- [ ] "Categories" section with category links

**Footer** (2 points):
- [ ] `<footer>` with copyright and contact information
- [ ] `<address>` element for contact details

#### 3. Testing Attributes (10 points)
Add comprehensive data-testid attributes:
- [ ] `data-testid="site-header"` for header
- [ ] `data-testid="main-navigation"` for nav
- [ ] `data-testid="main-content"` for main
- [ ] `data-testid="blog-article"` for article
- [ ] `data-testid="article-title"` for article heading
- [ ] `data-testid="article-author"` for author information
- [ ] `data-testid="article-date"` for publication date
- [ ] `data-testid="sidebar"` for aside
- [ ] `data-testid="site-footer"` for footer
- [ ] At least 5 additional meaningful data-testid attributes

#### 4. Content Requirements (10 points)
Include realistic content:
- [ ] Article title: "Understanding Web APIs: A Beginner's Guide"
- [ ] Author: Your name
- [ ] Publication date: Current date in proper format
- [ ] Article content: Minimum 3 paragraphs about web APIs
- [ ] At least one code example in the article
- [ ] 3 recent article links in sidebar
- [ ] 4 category links in sidebar
- [ ] Complete contact information in footer

### Code Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Add your meta tags here -->
    <title>Understanding Web APIs - TechBlog</title>
    <!-- Add meta description -->
</head>
<body>
    <header data-testid="site-header">
        <!-- Add site branding and navigation -->
    </header>

    <main data-testid="main-content">
        <article data-testid="blog-article">
            <header>
                <!-- Add article title, author, and date -->
            </header>

            <!-- Add article sections here -->
        </article>
    </main>

    <aside data-testid="sidebar">
        <!-- Add sidebar content -->
    </aside>

    <footer data-testid="site-footer">
        <!-- Add footer content -->
    </footer>
</body>
</html>
```

---

## 🔍 Part 3: Code Review and Validation (25 points)

### Task 1: Validation (10 points)
1. **Validate your HTML** using the W3C Markup Validator
   - [ ] Zero validation errors (5 points)
   - [ ] Zero validation warnings (3 points)
   - [ ] Provide screenshot or validation URL (2 points)

2. **HTML5 Outline Check**
   - [ ] Use HTML5 Outliner to verify document structure
   - [ ] Provide outline results showing proper hierarchy

### Task 2: Accessibility Review (10 points)
Check your code for accessibility features:
- [ ] All images have meaningful alt text (2 points)
- [ ] Navigation has appropriate ARIA labels (2 points)
- [ ] Proper heading hierarchy maintained (2 points)
- [ ] Form elements (if any) have proper labels (2 points)
- [ ] Color contrast meets basic requirements (2 points)

### Task 3: Testing Readiness (5 points)
Verify automation testing readiness:
- [ ] All interactive elements have data-testid attributes
- [ ] Data-testid naming follows consistent convention
- [ ] Elements can be selected using browser console
- [ ] No duplicate data-testid values
- [ ] Semantic elements provide alternative selection methods

### Browser Console Testing
Test your selectors in browser console and document results:

```javascript
// Test these selectors and record results
document.querySelector('[data-testid="site-header"]')
document.querySelector('[data-testid="blog-article"]')
document.querySelector('[data-testid="article-title"]')
document.querySelectorAll('[data-testid^="nav-"]')
document.querySelector('main article header h1')
```

**Results**: ________________________________

---

## 📊 Assessment Rubric

### Scoring Breakdown
- **Knowledge Check**: 25 points
- **Practical Assessment**: 50 points
- **Code Review & Validation**: 25 points
- **Total**: 100 points

### Grading Scale
- **90-100 points**: Excellent (A) - Mastery demonstrated
- **80-89 points**: Good (B) - Proficient with minor gaps
- **70-79 points**: Satisfactory (C) - Basic competency shown
- **60-69 points**: Needs Improvement (D) - Significant gaps
- **Below 60 points**: Unsatisfactory (F) - Major deficiencies

### Detailed Rubric

#### Knowledge Check (25 points)
- **Excellent (23-25)**: All questions answered correctly with clear explanations
- **Good (20-22)**: Most questions correct with adequate explanations
- **Satisfactory (18-19)**: Basic understanding shown, some errors
- **Needs Improvement (15-17)**: Multiple errors, unclear explanations
- **Unsatisfactory (0-14)**: Major misunderstandings evident

#### Practical Assessment (50 points)
- **Excellent (45-50)**: Complete implementation, all requirements met, clean code
- **Good (40-44)**: Most requirements met, minor issues or omissions
- **Satisfactory (35-39)**: Basic requirements met, some structural issues
- **Needs Improvement (30-34)**: Incomplete implementation, multiple issues
- **Unsatisfactory (0-29)**: Major structural problems, many requirements missing

#### Code Review & Validation (25 points)
- **Excellent (23-25)**: Perfect validation, excellent accessibility, testing-ready
- **Good (20-22)**: Minor validation issues, good accessibility practices
- **Satisfactory (18-19)**: Some validation errors, basic accessibility
- **Needs Improvement (15-17)**: Multiple validation errors, poor accessibility
- **Unsatisfactory (0-14)**: Major validation failures, accessibility ignored

---

## 🎯 Self-Assessment Checklist

Before submitting, verify you have completed:

### Knowledge Check
- [ ] All multiple choice questions answered
- [ ] True/false questions completed with reasoning
- [ ] Short answer questions fully explained
- [ ] Matching exercise completed correctly
- [ ] Best practices identified accurately

### Practical Assessment
- [ ] Complete HTML5 document created
- [ ] All semantic elements properly implemented
- [ ] Comprehensive data-testid attributes added
- [ ] Realistic and meaningful content included
- [ ] Proper nesting and hierarchy maintained

### Code Review
- [ ] HTML validated with zero errors
- [ ] Document outline verified
- [ ] Accessibility features implemented
- [ ] Browser console testing completed
- [ ] All selectors working correctly

### File Submission
- [ ] HTML file saved as `blog-article-assessment.html`
- [ ] Validation screenshots or URLs provided
- [ ] Assessment answers documented
- [ ] Code tested in multiple browsers

---

## 📚 Assessment Resources

### Validation Tools
- [W3C Markup Validator](https://validator.w3.org/)
- [HTML5 Outliner](https://gsnedders.html5.org/outliner/)
- [WAVE Accessibility Evaluator](https://wave.webaim.org/)

### Reference Materials
- [MDN HTML Element Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Browser Testing
- Use F12 Developer Tools in Chrome, Firefox, or Edge
- Test console selectors before submitting
- Verify visual layout and functionality

---

## 🔄 Feedback and Improvement

### Common Issues to Avoid
1. **Missing DOCTYPE**: Always include `<!DOCTYPE html>`
2. **Improper Nesting**: Ensure elements are properly nested
3. **Generic data-testid**: Use descriptive, meaningful names
4. **Skipped Headings**: Maintain proper h1, h2, h3 hierarchy
5. **Missing Alt Text**: Include meaningful alt attributes for images
6. **Validation Errors**: Always validate before submission

### Success Indicators
- Zero HTML validation errors
- Logical document outline
- Consistent data-testid naming convention
- Meaningful semantic structure
- Accessible markup implementation
- Testing-ready element identification

### Next Steps
Upon successful completion:
1. Review feedback and areas for improvement
2. Practice with additional HTML structures
3. Prepare for Lesson 1.2: HTML Forms and Input Elements
4. Begin exploring CSS selectors and styling concepts

---

*This assessment evaluates your foundational understanding of HTML5 semantic structure, preparing you for advanced web automation testing concepts.*