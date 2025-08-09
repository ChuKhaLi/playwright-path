# Assessment: HTML Forms and Inputs

## Overview
This assessment evaluates your understanding of HTML forms and input elements. Complete all sections to demonstrate mastery of the concepts covered in Lesson 02.

**Time Limit**: 45 minutes  
**Passing Score**: 80% (32/40 points)

---

## Section A: Multiple Choice Questions (20 points)
*Choose the best answer for each question. 2 points each.*

### Question 1
Which HTML5 input type automatically validates email addresses?
- A) `<input type="text">`
- B) `<input type="email">`
- C) `<input type="validate">`
- D) `<input type="mail">`

**Answer**: B) `<input type="email">`

### Question 2
What attribute makes a form field required?
- A) `mandatory="true"`
- B) `needed="yes"`
- C) `required`
- D) `validate="required"`

**Answer**: C) `required`

### Question 3
Which input type is best for selecting a single option from a list?
- A) checkbox
- B) radio
- C) select
- D) button

**Answer**: B) radio

### Question 4
What is the purpose of the `for` attribute in a label element?
- A) To style the label
- B) To associate the label with a specific form input
- C) To make the label required
- D) To validate the label text

**Answer**: B) To associate the label with a specific form input

### Question 5
Which attribute restricts the minimum length of text input?
- A) `min-length`
- B) `minlength`
- C) `minimum`
- D) `min`

**Answer**: B) `minlength`

### Question 6
What does the `placeholder` attribute do?
- A) Sets the default value of an input
- B) Provides hint text that appears inside the input field
- C) Makes the input field larger
- D) Validates the input format

**Answer**: B) Provides hint text that appears inside the input field

### Question 7
Which input type allows users to select multiple files?
- A) `<input type="file">`
- B) `<input type="file" multiple>`
- C) `<input type="files">`
- D) `<input type="multiple-file">`

**Answer**: B) `<input type="file" multiple>`

### Question 8
What is the default method for form submission if not specified?
- A) POST
- B) GET
- C) PUT
- D) SUBMIT

**Answer**: B) GET

### Question 9
Which attribute pattern would validate a phone number in XXX-XXX-XXXX format?
- A) `pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"`
- B) `pattern="XXX-XXX-XXXX"`
- C) `pattern="\d{3}-\d{3}-\d{4}"`
- D) `pattern="phone"`

**Answer**: A) `pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"`

### Question 10
Why are data-testid attributes important in form elements?
- A) They improve form styling
- B) They enable automated testing and element identification
- C) They make forms load faster
- D) They provide form validation

**Answer**: B) They enable automated testing and element identification

---

## Section B: Code Analysis (10 points)
*Analyze the following code snippets and answer the questions.*

### Code Snippet 1 (5 points)
```html
<form action="/submit" method="post">
  <label>Email Address
    <input type="text" name="email" required>
  </label>
  <button type="submit">Submit</button>
</form>
```

**Question**: Identify two improvements that should be made to this form for better functionality and accessibility.

**Expected Answers** (2.5 points each):
1. Change `input type="text"` to `input type="email"` for proper email validation
2. Add `id` attribute to input and `for` attribute to label for proper association
3. Add `data-testid` attributes for testing purposes
4. Consider adding `autocomplete="email"` for better user experience

### Code Snippet 2 (5 points)
```html
<form>
  <input type="radio" name="size" value="small" id="small">
  <label for="small">Small</label>
  
  <input type="radio" name="color" value="medium" id="medium">
  <label for="medium">Medium</label>
  
  <input type="radio" name="size" value="large" id="large">
  <label for="large">Large</label>
</form>
```

**Question**: What is wrong with this radio button group, and how would you fix it?

**Expected Answer**:
The middle radio button has `name="color"` instead of `name="size"`, which breaks the radio button group. All radio buttons that should function as a group must have the same `name` attribute. Change the middle input to `name="size"`.

---

## Section C: Practical Implementation (10 points)
*Write HTML code to meet the specified requirements.*

### Task 1: Create a Login Form (10 points)
Write HTML code for a login form with the following requirements:

**Requirements**:
- Form action: "/login", method: "post"
- Username field: text input, required, data-testid="username-input"
- Password field: password input, required, minimum 6 characters, data-testid="password-input"
- "Remember me" checkbox: optional, data-testid="remember-checkbox"
- Submit button: text "Sign In", data-testid="login-button"
- All inputs must have proper labels and IDs
- Include basic styling for readability

**Expected Solution** (10 points):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .checkbox-group label {
            margin-bottom: 0;
            font-weight: normal;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
    </style>
</head>
<body>
    <h1>Sign In</h1>
    <form action="/login" method="post">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required data-testid="username-input">
        </div>
        
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="6" data-testid="password-input">
        </div>
        
        <div class="form-group">
            <div class="checkbox-group">
                <input type="checkbox" id="remember" name="remember" data-testid="remember-checkbox">
                <label for="remember">Remember me</label>
            </div>
        </div>
        
        <button type="submit" data-testid="login-button">Sign In</button>
    </form>
</body>
</html>
```

**Grading Criteria**:
- Form element with correct action and method (2 points)
- Username field with proper attributes (2 points)
- Password field with minlength validation (2 points)
- Checkbox with proper label association (2 points)
- All data-testid attributes present (1 point)
- Submit button correctly configured (1 point)

---

## Answer Key and Scoring

### Section A: Multiple Choice (20 points)
1. B - 2 points
2. C - 2 points
3. B - 2 points
4. B - 2 points
5. B - 2 points
6. B - 2 points
7. B - 2 points
8. B - 2 points
9. A - 2 points
10. B - 2 points

### Section B: Code Analysis (10 points)
**Snippet 1** (5 points):
- Change input type to email (2.5 points)
- Add proper label association (2.5 points)

**Snippet 2** (5 points):
- Identify name attribute inconsistency (2.5 points)
- Provide correct solution (2.5 points)

### Section C: Practical Implementation (10 points)
- Form structure and attributes (4 points)
- Input fields with validation (4 points)
- Data-testid attributes and accessibility (2 points)

### Total: 40 points
**Passing Score**: 32 points (80%)

---

## Common Mistakes and Learning Points

### Form Structure Mistakes
- **Missing form element**: Always wrap form inputs in a `<form>` element
- **Incorrect method**: Use POST for sensitive data, GET for searches
- **Missing action**: Specify where form data should be sent

### Input Validation Errors
- **Wrong input types**: Use semantic types (`email`, `tel`, `url`) for better validation
- **Missing required attributes**: Add `required` to mandatory fields
- **Incorrect pattern syntax**: Use proper regex patterns for format validation

### Accessibility Issues
- **Unlabeled inputs**: Every input needs an associated label
- **Missing IDs**: Labels need matching `for` attributes and input `id` attributes
- **Poor semantic structure**: Use fieldsets for grouped inputs

### Testing and Automation
- **Missing data-testid**: Essential for automated testing frameworks
- **Inconsistent naming**: Use consistent, descriptive data-testid values
- **Inaccessible elements**: Ensure all interactive elements are testable

## Remediation Resources

### Score 24-31 points (60-79%)
Review these topics:
- HTML5 input types and their purposes
- Form validation attributes (`required`, `pattern`, `minlength`)
- Label association techniques

**Recommended Actions**:
- Re-read the lesson content sections on input types
- Complete Exercise 01 again with focus on validation
- Practice creating different input types in isolation

### Score Below 24 points (<60%)
**Required Actions**:
- Review the entire lesson content
- Complete both exercises again
- Schedule additional practice session
- Consider reviewing HTML Document Structure (Lesson 01)

**Focus Areas**:
- Basic HTML form syntax
- Understanding of input types
- Form submission methods
- Accessibility fundamentals

## Next Steps

### Upon Passing (32+ points)
You have demonstrated solid understanding of HTML forms and inputs. You're ready to proceed to:
- **Lesson 03**: CSS Selectors Fundamentals
- Apply form styling techniques
- Learn how to target form elements with CSS

### Areas for Continued Practice
- Complex form validation scenarios
- Accessibility testing with screen readers
- Progressive enhancement with JavaScript
- Server-side form processing concepts

---

## Self-Assessment Questions

After completing this assessment, reflect on:

1. **Confidence Level**: How confident do you feel creating HTML forms from scratch?
2. **Practical Application**: Can you identify when to use different input types in real projects?
3. **Accessibility Awareness**: Do you understand why semantic HTML and proper labeling matter?
4. **Testing Preparation**: Are you comfortable adding attributes needed for automated testing?

Remember: Mastery comes through practice. If you scored below 80%, use the remediation resources and retake the assessment after additional study.