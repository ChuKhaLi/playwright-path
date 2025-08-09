# Lesson 1.1: HTML Document Structure - Hands-On Practice Exercises

## 🎯 Exercise Overview

These hands-on exercises will help you practice creating HTML5 documents with proper semantic structure and testing-friendly attributes. Each exercise builds upon the previous one, gradually increasing in complexity.

### 📋 Prerequisites
- Text editor (VS Code recommended)
- Modern web browser (Chrome, Firefox, or Edge)
- Basic understanding of file creation and saving

---

## 🏃‍♂️ Exercise 1: Basic HTML5 Document Structure

### Objective
Create a basic HTML5 document with proper structure and validate it.

### Instructions

1. **Create a new HTML file** named `my-first-page.html`

2. **Build the basic structure** with the following requirements:
   - Proper HTML5 DOCTYPE declaration
   - HTML element with language attribute
   - Complete head section with meta tags
   - Body section ready for content

3. **Add the following meta information**:
   - Character encoding (UTF-8)
   - Viewport meta tag for responsive design
   - Page title: "My First HTML5 Page"
   - Meta description: "Learning HTML5 document structure for automation testing"

4. **Add basic content** in the body:
   - A main heading (h1) with your name
   - A paragraph introducing yourself
   - A second-level heading (h2) saying "About This Page"
   - Another paragraph explaining this is a learning exercise

### Expected Output Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Your meta tags here -->
    <title><!-- Your title here --></title>
</head>
<body>
    <!-- Your content here -->
</body>
</html>
```

### Validation Steps
1. Save your file and open it in a web browser
2. Go to [W3C Markup Validator](https://validator.w3.org/)
3. Upload your file or paste the code
4. Fix any validation errors
5. Achieve zero errors and warnings

### Success Criteria
- [ ] Valid HTML5 DOCTYPE declaration
- [ ] Proper head section with all required meta tags
- [ ] Content displays correctly in browser
- [ ] Passes W3C validation with zero errors
- [ ] File saves and loads without issues

---

## 🏗️ Exercise 2: Adding Semantic Structure

### Objective
Enhance your basic page with semantic HTML5 elements and testing attributes.

### Instructions

1. **Start with your validated page** from Exercise 1

2. **Add semantic structure** with these elements:
   - `<header>` containing site title and navigation placeholder
   - `<nav>` with a simple unordered list of 4 navigation items
   - `<main>` to wrap your main content
   - `<section>` to group related content
   - `<aside>` for sidebar content
   - `<footer>` with copyright information

3. **Add data-testid attributes** to each semantic element:
   - `data-testid="page-header"` for header
   - `data-testid="main-navigation"` for nav
   - `data-testid="main-content"` for main
   - `data-testid="content-section"` for section
   - `data-testid="sidebar"` for aside
   - `data-testid="page-footer"` for footer

4. **Include proper heading hierarchy**:
   - h1 in header for site title
   - h2 for main content section
   - h3 for sidebar content
   - Maintain logical heading order

5. **Add ARIA labels** where appropriate:
   - `aria-label="Main site navigation"` for nav
   - `aria-label="Sidebar content"` for aside

### Content Requirements
- **Header**: Site title and navigation with Home, About, Services, Contact
- **Main Section**: Welcome message and description of the page purpose
- **Sidebar**: "Quick Links" with 3-4 related links
- **Footer**: Copyright notice and current year

### Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Previous meta tags -->
</head>
<body>
    <header data-testid="page-header">
        <!-- Site title and navigation -->
    </header>
    
    <main data-testid="main-content">
        <section data-testid="content-section">
            <!-- Main content -->
        </section>
    </main>
    
    <aside data-testid="sidebar">
        <!-- Sidebar content -->
    </aside>
    
    <footer data-testid="page-footer">
        <!-- Footer content -->
    </footer>
</body>
</html>
```

### Success Criteria
- [ ] All semantic elements properly implemented
- [ ] All data-testid attributes added correctly
- [ ] Proper heading hierarchy maintained
- [ ] ARIA labels included where specified
- [ ] Content is meaningful and well-organized
- [ ] Page validates with W3C validator
- [ ] Visual structure is clear and logical

---

## 🎨 Exercise 3: Complex Content Structure

### Objective
Create a more complex page structure with multiple articles, proper time elements, and advanced semantic markup.

### Instructions

1. **Create a new file** named `blog-page.html`

2. **Build a blog-style page** with the following structure:
   - Header with site branding and navigation
   - Main content area with multiple blog posts
   - Sidebar with recent posts and categories
   - Footer with additional navigation and contact info

3. **Include these specific elements**:
   - At least 3 `<article>` elements for blog posts
   - `<time>` elements with proper datetime attributes
   - `<figure>` and `<figcaption>` for images
   - `<address>` element in footer for contact information
   - Proper use of `<header>` and `<footer>` within articles

4. **Add comprehensive data-testid attributes**:
   - Each article: `data-testid="blog-post-1"`, `data-testid="blog-post-2"`, etc.
   - Time elements: `data-testid="post-date-1"`, etc.
   - Images: `data-testid="post-image-1"`, etc.
   - Navigation items: `data-testid="nav-home"`, `data-testid="nav-about"`, etc.

5. **Include realistic content**:
   - Blog post titles and content
   - Publication dates (use recent dates)
   - Author information
   - Categories and tags
   - Contact information in footer

### Advanced Requirements

**Article Structure Example**:
```html
<article data-testid="blog-post-1">
    <header>
        <h2 data-testid="post-title-1">Post Title</h2>
        <p>
            By <span data-testid="post-author-1">Author Name</span> on 
            <time datetime="2024-01-15T10:30:00Z" data-testid="post-date-1">
                January 15, 2024
            </time>
        </p>
    </header>
    
    <figure data-testid="post-image-1">
        <img src="placeholder.jpg" alt="Descriptive alt text">
        <figcaption>Image caption</figcaption>
    </figure>
    
    <p data-testid="post-content-1">Article content...</p>
    
    <footer data-testid="post-footer-1">
        <p>Categories: <a href="#tech">Technology</a>, <a href="#web">Web Development</a></p>
    </footer>
</article>
```

**Time Element Requirements**:
- Use ISO 8601 format for datetime attributes
- Display human-readable dates in content
- Include at least 3 different date formats

**Figure Element Requirements**:
- Include meaningful alt text for images
- Use descriptive figcaptions
- Ensure images relate to article content

### Success Criteria
- [ ] Minimum 3 complete article elements
- [ ] All time elements have proper datetime attributes
- [ ] Figure and figcaption elements properly implemented
- [ ] Address element included in footer
- [ ] All data-testid attributes follow consistent naming
- [ ] Content is realistic and engaging
- [ ] Proper semantic hierarchy maintained
- [ ] Page validates without errors
- [ ] Accessible markup with proper ARIA labels

---

## 🛒 Exercise 4: E-commerce Product Page

### Objective
Create a realistic e-commerce product page demonstrating advanced semantic markup and testing-friendly attributes.

### Instructions

1. **Create a new file** named `product-page.html`

2. **Build a complete product page** with:
   - Site header with branding and navigation
   - Breadcrumb navigation
   - Product details section
   - Product specifications
   - Customer reviews section
   - Related products sidebar
   - Site footer

3. **Use advanced semantic elements**:
   - `<nav>` for breadcrumbs with proper structure
   - `<dl>`, `<dt>`, `<dd>` for specifications
   - `<blockquote>` and `<cite>` for customer reviews
   - Multiple `<section>` elements for different content areas
   - `<fieldset>` and `<legend>` for product options

4. **Include comprehensive testing attributes**:
   - Product information: `data-testid="product-title"`, `data-testid="product-price"`
   - Specifications: `data-testid="spec-display"`, `data-testid="spec-storage"`
   - Reviews: `data-testid="review-1"`, `data-testid="review-rating-1"`
   - Actions: `data-testid="add-to-cart"`, `data-testid="buy-now"`

### Required Content Sections

**1. Breadcrumb Navigation**:
```html
<nav data-testid="breadcrumb" aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/electronics">Electronics</a></li>
        <li><a href="/smartphones">Smartphones</a></li>
        <li aria-current="page">Premium Smartphone</li>
    </ol>
</nav>
```

**2. Product Specifications**:
```html
<section data-testid="product-specifications">
    <h2>Technical Specifications</h2>
    <dl>
        <dt>Display</dt>
        <dd data-testid="spec-display">6.1-inch Super Retina XDR</dd>
        
        <dt>Storage</dt>
        <dd data-testid="spec-storage">128GB</dd>
        
        <!-- Add more specifications -->
    </dl>
</section>
```

**3. Customer Reviews**:
```html
<section data-testid="customer-reviews">
    <h2>Customer Reviews</h2>
    
    <article data-testid="review-1">
        <header>
            <h3 data-testid="review-title-1">Great phone!</h3>
            <div data-testid="review-rating-1" aria-label="5 out of 5 stars">
                ★★★★★
            </div>
        </header>
        
        <blockquote data-testid="review-content-1">
            <p>This phone exceeded my expectations...</p>
        </blockquote>
        
        <footer>
            <cite data-testid="review-author-1">— John D.</cite>
            <time datetime="2024-01-10" data-testid="review-date-1">January 10, 2024</time>
        </footer>
    </article>
</section>
```

**4. Product Options**:
```html
<section data-testid="product-options">
    <fieldset data-testid="color-selection">
        <legend>Choose Color:</legend>
        <input type="radio" id="color-black" name="color" value="black" data-testid="color-black">
        <label for="color-black">Space Black</label>
        
        <input type="radio" id="color-white" name="color" value="white" data-testid="color-white">
        <label for="color-white">Silver White</label>
    </fieldset>
</section>
```

### Success Criteria
- [ ] Complete e-commerce page structure
- [ ] Proper breadcrumb navigation implementation
- [ ] Product specifications using definition lists
- [ ] At least 3 customer reviews with proper markup
- [ ] Product options with fieldset and radio buttons
- [ ] All sections have appropriate data-testid attributes
- [ ] Realistic product information and pricing
- [ ] Proper semantic hierarchy throughout
- [ ] Accessible markup with ARIA labels
- [ ] W3C validation passes without errors

---

## 🔍 Exercise 5: Testing and Validation

### Objective
Learn to test and validate your HTML using various tools and techniques.

### Instructions

1. **Use your product page** from Exercise 4

2. **Perform comprehensive validation**:
   - W3C HTML Validator
   - HTML5 Outliner
   - Accessibility checker
   - Browser developer tools inspection

3. **Test data-testid attributes**:
   - Use browser console to select elements
   - Verify all data-testid attributes work correctly
   - Test CSS selectors for automation

4. **Create a testing checklist** documenting:
   - All data-testid attributes and their purposes
   - Semantic element usage and rationale
   - Accessibility features implemented
   - Validation results and any fixes made

### Validation Steps

**1. W3C HTML Validator**:
```
1. Go to https://validator.w3.org/
2. Upload your HTML file
3. Review all errors and warnings
4. Fix issues and re-validate
5. Achieve zero errors
```

**2. HTML5 Outliner**:
```
1. Go to https://gsnedders.html5.org/outliner/
2. Paste your HTML code
3. Review the document outline
4. Ensure proper heading hierarchy
5. Fix any structural issues
```

**3. Browser Console Testing**:
```javascript
// Test data-testid selectors
document.querySelector('[data-testid="product-title"]')
document.querySelector('[data-testid="add-to-cart"]')
document.querySelectorAll('[data-testid^="review-"]')

// Test semantic element selection
document.querySelector('main')
document.querySelectorAll('article')
document.querySelector('nav[aria-label="Breadcrumb"]')
```

**4. Accessibility Testing**:
- Use browser accessibility tools
- Check color contrast
- Verify keyboard navigation
- Test screen reader compatibility

### Testing Checklist Template

Create a document named `testing-checklist.md` with:

```markdown
# HTML5 Semantic Structure Testing Checklist

## Validation Results
- [ ] W3C HTML Validator: PASS/FAIL
- [ ] HTML5 Outliner: PASS/FAIL
- [ ] Browser Console Tests: PASS/FAIL
- [ ] Accessibility Check: PASS/FAIL

## Data-TestID Attributes
- [ ] product-title: ✓ Working
- [ ] product-price: ✓ Working
- [ ] add-to-cart: ✓ Working
- [ ] [Add all your attributes]

## Semantic Elements
- [ ] Header: Properly implemented
- [ ] Navigation: Multiple nav elements with aria-labels
- [ ] Main: Single main element
- [ ] Articles: Multiple articles with proper structure
- [ ] Sections: Logical content grouping
- [ ] Aside: Sidebar content
- [ ] Footer: Site footer information

## Accessibility Features
- [ ] Alt text for all images
- [ ] ARIA labels for navigation
- [ ] Proper heading hierarchy
- [ ] Form labels and fieldsets
- [ ] Keyboard navigation support

## Issues Found and Fixed
1. [List any issues discovered]
2. [Document how they were resolved]
```

### Success Criteria
- [ ] All validation tools pass without errors
- [ ] Complete testing checklist created
- [ ] All data-testid attributes tested and working
- [ ] Accessibility features verified
- [ ] Document outline is logical and complete
- [ ] Browser console tests successful
- [ ] Issues documented and resolved

---

## 🎯 Bonus Challenge: Automation-Ready Page

### Objective
Create a comprehensive page specifically designed for automation testing practice.

### Instructions

1. **Create `automation-practice.html`** with:
   - Login form with various input types
   - Data table with sortable columns
   - Modal dialog elements
   - Dynamic content areas
   - Error message containers
   - Loading states

2. **Include comprehensive test attributes**:
   - Every interactive element has data-testid
   - Form validation states
   - Dynamic content identifiers
   - Error and success message containers

3. **Add JavaScript functionality**:
   - Form submission handling
   - Table sorting
   - Modal open/close
   - Dynamic content updates

### Advanced Features

**Login Form with States**:
```html
<form data-testid="login-form" id="loginForm">
    <div data-testid="form-field-email">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required data-testid="email-input">
        <span data-testid="email-error" class="error-message" style="display: none;">
            Please enter a valid email address
        </span>
    </div>
    
    <div data-testid="form-field-password">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required data-testid="password-input">
        <span data-testid="password-error" class="error-message" style="display: none;">
            Password is required
        </span>
    </div>
    
    <button type="submit" data-testid="login-submit">Login</button>
    <div data-testid="login-loading" style="display: none;">Logging in...</div>
    <div data-testid="login-success" style="display: none;">Login successful!</div>
    <div data-testid="login-error" style="display: none;">Login failed. Please try again.</div>
</form>
```

**Data Table**:
```html
<table data-testid="data-table">
    <thead>
        <tr>
            <th data-testid="header-name" data-sort="name">Name ↕</th>
            <th data-testid="header-email" data-sort="email">Email ↕</th>
            <th data-testid="header-role" data-sort="role">Role ↕</th>
            <th data-testid="header-actions">Actions</th>
        </tr>
    </thead>
    <tbody data-testid="table-body">
        <tr data-testid="row-1">
            <td data-testid="name-1">John Doe</td>
            <td data-testid="email-1">john@example.com</td>
            <td data-testid="role-1">Admin</td>
            <td>
                <button data-testid="edit-1">Edit</button>
                <button data-testid="delete-1">Delete</button>
            </td>
        </tr>
    </tbody>
</table>
```

### Success Criteria
- [ ] Comprehensive automation testing page created
- [ ] All interactive elements have test attributes
- [ ] JavaScript functionality working
- [ ] Form validation states implemented
- [ ] Table sorting functionality
- [ ] Modal dialogs with proper markup
- [ ] Error and success states
- [ ] Loading states for async operations
- [ ] Page ready for automation framework testing

---

## 📚 Exercise Resources

### Validation Tools
- [W3C Markup Validator](https://validator.w3.org/)
- [HTML5 Outliner](https://gsnedders.html5.org/outliner/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)

### Reference Materials
- [MDN HTML Element Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [HTML5 Semantic Elements Guide](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Browser Developer Tools
- Chrome DevTools: F12 or Ctrl+Shift+I
- Firefox Developer Tools: F12 or Ctrl+Shift+I
- Edge DevTools: F12 or Ctrl+Shift+I

---

## 🎯 Next Steps

After completing these exercises:

1. **Review your work** with the provided checklists
2. **Practice selector writing** using your created pages
3. **Experiment with browser DevTools** to inspect your markup
4. **Prepare for Lesson 1.2** - HTML Forms and Input Elements

**Next Lesson**: [Lesson 1.2: HTML Forms and Input Elements](../lesson-02-html-forms-and-inputs/README.md)

---

*These exercises provide hands-on experience with HTML5 semantic elements and testing-friendly markup, preparing you for advanced automation testing concepts.*