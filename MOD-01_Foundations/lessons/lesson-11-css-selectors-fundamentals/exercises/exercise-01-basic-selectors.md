# Exercise 01: Basic CSS Selectors Practice

## Objective
Master the fundamental CSS selector types by creating a styled webpage that demonstrates element, class, ID, attribute, and universal selectors.

## Time Estimate
20-25 minutes

## Prerequisites
- Completed Lesson 02 (HTML Forms and Inputs)
- Understanding of basic HTML structure
- Text editor or IDE

## Instructions

### Step 1: Create the HTML Structure
Create a new HTML file called `selector-practice.html` with the following base structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Selectors Practice</title>
    <style>
        /* Your CSS will go here */
    </style>
</head>
<body>
    <!-- Your HTML content will go here -->
</body>
</html>
```

### Step 2: Add HTML Content
Inside the `<body>` tag, add the following HTML structure:

```html
<div class="container">
    <header id="main-header">
        <h1 class="page-title">CSS Selectors Practice</h1>
        <p class="subtitle">Learning to target elements with precision</p>
    </header>

    <nav class="navigation">
        <ul>
            <li><a href="#section1">Element Selectors</a></li>
            <li><a href="#section2">Class Selectors</a></li>
            <li><a href="#section3">ID Selectors</a></li>
            <li><a href="#section4">Attribute Selectors</a></li>
        </ul>
    </nav>

    <main>
        <section id="section1" class="content-section">
            <h2>Element Selectors</h2>
            <p>This paragraph should be styled using element selectors.</p>
            <p>All paragraphs in this section will have the same styling.</p>
            <button>Button 1</button>
            <button>Button 2</button>
        </section>

        <section id="section2" class="content-section">
            <h2>Class Selectors</h2>
            <p class="highlight">This paragraph has the 'highlight' class.</p>
            <p class="warning">This paragraph has the 'warning' class.</p>
            <p class="success">This paragraph has the 'success' class.</p>
            <div class="info-box">
                <p>This is inside an info-box div.</p>
            </div>
        </section>

        <section id="section3" class="content-section">
            <h2>ID Selectors</h2>
            <div id="special-content">
                <p>This div has a unique ID and should have special styling.</p>
            </div>
            <button id="primary-button">Primary Action</button>
        </section>

        <section id="section4" class="content-section">
            <h2>Attribute Selectors</h2>
            <form>
                <input type="text" placeholder="Text input" required>
                <input type="email" placeholder="Email input" required>
                <input type="password" placeholder="Password input">
                <input type="tel" placeholder="Phone number">
                <button type="submit">Submit</button>
            </form>
        </section>
    </main>

    <footer class="page-footer">
        <p>&copy; 2024 CSS Practice. All rights reserved.</p>
    </footer>
</div>
```

### Step 3: Universal Selector
Add a universal selector to reset default margins and padding:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### Step 4: Element Selectors
Style the basic HTML elements:

```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

h1 {
    font-size: 2.5em;
    color: #2c3e50;
}

h2 {
    color: #34495e;
    margin-bottom: 15px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
}

p {
    margin-bottom: 15px;
    text-align: justify;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
    font-size: 16px;
}
```

### Step 5: Class Selectors
Create reusable class styles:

```css
.container {
    max-width: 1000px;
    margin: 0 auto;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
}

.page-title {
    margin-bottom: 10px;
}

.subtitle {
    font-style: italic;
    opacity: 0.8;
}

.navigation {
    background-color: #34495e;
    padding: 15px 0;
}

.content-section {
    padding: 30px;
    border-bottom: 1px solid #ecf0f1;
}

.highlight {
    background-color: #fff3cd;
    padding: 15px;
    border-left: 4px solid #ffc107;
    border-radius: 5px;
}

.warning {
    background-color: #f8d7da;
    padding: 15px;
    border-left: 4px solid #dc3545;
    border-radius: 5px;
    color: #721c24;
}

.success {
    background-color: #d4edda;
    padding: 15px;
    border-left: 4px solid #28a745;
    border-radius: 5px;
    color: #155724;
}

.info-box {
    background-color: #d1ecf1;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #bee5eb;
    margin: 20px 0;
}

.page-footer {
    background-color: #2c3e50;
    color: white;
    text-align: center;
    padding: 20px;
}
```

### Step 6: ID Selectors
Style unique elements:

```css
#main-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 40px;
}

#special-content {
    background-color: #e8f4f8;
    padding: 25px;
    border-radius: 10px;
    border: 2px solid #3498db;
    margin: 20px 0;
}

#primary-button {
    background-color: #e74c3c;
    color: white;
    font-weight: bold;
    padding: 15px 30px;
    font-size: 18px;
}
```

### Step 7: Attribute Selectors
Style form elements based on their attributes:

```css
input[type="text"] {
    background-color: #f0f8ff;
    border: 2px solid #3498db;
    padding: 12px;
    border-radius: 5px;
    margin: 5px;
    width: 200px;
}

input[type="email"] {
    background-color: #f0fff0;
    border: 2px solid #27ae60;
    padding: 12px;
    border-radius: 5px;
    margin: 5px;
    width: 200px;
}

input[type="password"] {
    background-color: #fff5ee;
    border: 2px solid #e67e22;
    padding: 12px;
    border-radius: 5px;
    margin: 5px;
    width: 200px;
}

input[type="tel"] {
    background-color: #fdf2f8;
    border: 2px solid #e91e63;
    padding: 12px;
    border-radius: 5px;
    margin: 5px;
    width: 200px;
}

input[required] {
    border-left: 4px solid #e74c3c;
}

button[type="submit"] {
    background-color: #27ae60;
    color: white;
    padding: 12px 25px;
    font-weight: bold;
}
```

### Step 8: Navigation Styling
Complete the navigation menu styling:

```css
.navigation ul {
    list-style: none;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.navigation li {
    margin: 0 15px;
}

.navigation a {
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.navigation a:hover {
    background-color: #2c3e50;
}
```

## Testing Your Work

### Step 1: Validate HTML Structure
1. Open your HTML file in a web browser
2. Verify that all sections are visible and properly laid out
3. Check that the header has a gradient background
4. Confirm that the navigation menu is horizontal and centered

### Step 2: Test Element Selectors
1. Verify that all `<h1>` elements are large and dark blue
2. Check that all `<h2>` elements have underlines
3. Confirm that all paragraphs have consistent spacing
4. Ensure all buttons have rounded corners and padding

### Step 3: Test Class Selectors
1. Check that `.highlight` paragraphs have yellow backgrounds
2. Verify that `.warning` paragraphs have red backgrounds and borders
3. Confirm that `.success` paragraphs have green backgrounds and borders
4. Ensure the `.info-box` has a light blue background

### Step 4: Test ID Selectors
1. Verify that `#main-header` has a gradient background
2. Check that `#special-content` has a blue border and background
3. Confirm that `#primary-button` is red and larger than other buttons

### Step 5: Test Attribute Selectors
1. Check that each input type has a different background color:
   - Text inputs: Light blue
   - Email inputs: Light green
   - Password inputs: Light orange
   - Tel inputs: Light pink
2. Verify that required inputs have red left borders
3. Confirm that the submit button is green

## Common Issues and Solutions

### Issue: Styles Not Applying
**Problem**: CSS rules not taking effect
**Solutions**:
- Check for typos in class names and IDs
- Ensure CSS is inside `<style>` tags in the `<head>`
- Verify that HTML class and ID attributes match CSS selectors exactly

### Issue: Specificity Conflicts
**Problem**: Some styles are overridden by others
**Solutions**:
- Remember that IDs have higher specificity than classes
- Element selectors have the lowest specificity
- Use browser developer tools to inspect which rules are applied

### Issue: Colors Not Showing
**Problem**: Background colors or text colors not visible
**Solutions**:
- Check color contrast (light text on light backgrounds won't show)
- Verify correct color syntax (#hex, rgb(), or color names)
- Ensure elements have content or set dimensions

## Expected Result

Your completed webpage should demonstrate:

### Visual Hierarchy
- ✅ Clear header with gradient background
- ✅ Structured navigation menu
- ✅ Distinct sections with consistent styling
- ✅ Professional footer

### Selector Types in Action
- ✅ **Universal selector**: Reset margins/padding
- ✅ **Element selectors**: Consistent typography and button styling
- ✅ **Class selectors**: Reusable highlight, warning, and success styles
- ✅ **ID selectors**: Unique header, special content, and primary button
- ✅ **Attribute selectors**: Different input types with distinct styling

### Interactive Elements
- ✅ Hover effects on navigation links
- ✅ Form inputs with visual feedback for required fields
- ✅ Consistent button styling with variations

## Validation Checklist

Complete this checklist to ensure you've mastered basic selectors:

### HTML Structure
- [ ] Valid HTML5 document structure
- [ ] All required HTML elements present
- [ ] Proper nesting and semantic markup
- [ ] All class and ID attributes correctly assigned

### Universal Selector
- [ ] CSS reset applied to all elements
- [ ] Box-sizing set to border-box
- [ ] Margins and padding removed from all elements

### Element Selectors
- [ ] Body styling applied (font, color, background)
- [ ] All h1 elements styled consistently
- [ ] All h2 elements have bottom borders
- [ ] All paragraphs have consistent spacing
- [ ] All buttons have consistent base styling

### Class Selectors
- [ ] Container class centers and styles the main content
- [ ] Navigation class styles the menu bar
- [ ] Content-section class provides consistent section padding
- [ ] Highlight, warning, and success classes work properly
- [ ] Info-box class creates distinct content area

### ID Selectors
- [ ] Main-header ID creates unique header styling
- [ ] Special-content ID provides distinct content styling
- [ ] Primary-button ID creates standout button

### Attribute Selectors
- [ ] Different input types have different background colors
- [ ] Required inputs have red left borders
- [ ] Submit button has distinct green styling
- [ ] All form elements properly styled

### Browser Compatibility
- [ ] Page displays correctly in Chrome
- [ ] Page displays correctly in Firefox
- [ ] Page displays correctly in Safari/Edge
- [ ] Responsive design works on different screen sizes

## Extension Challenges (Optional)

### Challenge 1: Hover Effects
Add hover effects to various elements:
```css
.highlight:hover { transform: scale(1.02); }
.success:hover { box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3); }
#primary-button:hover { background-color: #c0392b; }
```

### Challenge 2: Pseudo-Elements
Add decorative elements using CSS:
```css
.page-title::before { content: "🎨 "; }
.warning::after { content: " ⚠️"; }
```

### Challenge 3: Animation
Add subtle animations:
```css
.info-box {
    transition: all 0.3s ease;
}
.info-box:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

## Reflection Questions

After completing this exercise, consider:

1. **Selector Efficiency**: Which selector types are most useful for different scenarios?
2. **Maintainability**: How do semantic class names improve code maintenance?
3. **Specificity Strategy**: When should you use classes vs. IDs vs. attributes?
4. **Reusability**: How can you design CSS classes to be reusable across projects?

## Next Steps

This exercise has given you hands-on experience with:
- All five fundamental CSS selector types
- Practical application of CSS specificity rules
- Creating maintainable and reusable CSS code
- Styling forms and interactive elements

You're now ready to:
- Move on to Exercise 02 for advanced selector combinations
- Explore CSS pseudo-classes and pseudo-elements
- Learn about more complex selector patterns
- Apply these skills to real web development projects

The foundation you've built here will be essential when you start using CSS selectors for automated testing in later lessons.