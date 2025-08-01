# Exercise 02: User Registration Form

## Objective
Build a comprehensive user registration form using advanced HTML form elements, validation attributes, and accessibility features.

## Time Estimate
25-30 minutes

## Prerequisites
- Completed Exercise 01
- Understanding of all input types covered in this lesson
- Familiarity with form validation attributes

## Instructions

### Step 1: Create the HTML Structure
Create a new HTML file called `registration-form.html` with proper HTML5 structure and include basic CSS for better presentation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Form Exercise</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 20px auto;
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
        input, select, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .required {
            color: red;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Create Your Account</h1>
    <!-- Your form will go here -->
</body>
</html>
```

### Step 2: Create the Main Form
Create a form with:
- `action="/api/register"`
- `method="post"`
- `data-testid="registration-form"`

### Step 3: Personal Information Section
Create the following fields wrapped in div elements with `class="form-group"`:

#### A. First Name
- Text input, required
- `id="firstName"`, `name="firstName"`
- Pattern: only letters and spaces, 2-50 characters
- Use `pattern="[A-Za-z\s]{2,50}"`
- Add `data-testid="first-name-input"`

#### B. Last Name
- Text input, required
- `id="lastName"`, `name="lastName"`
- Same pattern as first name
- Add `data-testid="last-name-input"`

#### C. Email Address
- Email input, required
- `id="email"`, `name="email"`
- Add `data-testid="email-input"`

#### D. Phone Number
- Tel input, optional
- `id="phone"`, `name="phone"`
- Pattern for format: XXX-XXX-XXXX
- Use `pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"`
- Placeholder: "123-456-7890"
- Add `data-testid="phone-input"`

#### E. Date of Birth
- Date input, optional
- `id="birthDate"`, `name="birthDate"`
- Set min date to "1900-01-01"
- Set max date to 18 years ago from current date (use "2005-12-31" for this exercise)
- Add `data-testid="birth-date-input"`

### Step 4: Account Information Section
Add these fields:

#### A. Username
- Text input, required
- `id="username"`, `name="username"`
- Pattern: 3-20 characters, letters, numbers, underscore only
- Use `pattern="[a-zA-Z0-9_]{3,20}"`
- Add `data-testid="username-input"`

#### B. Password
- Password input, required
- `id="password"`, `name="password"`
- Minimum length: 8 characters
- Use `minlength="8"`
- Add `data-testid="password-input"`

#### C. Confirm Password
- Password input, required
- `id="confirmPassword"`, `name="confirmPassword"`
- Add `data-testid="confirm-password-input"`

### Step 5: Preferences Section
Add these form elements:

#### A. Country Selection
- Select dropdown, optional
- `id="country"`, `name="country"`
- Include these options:
  - Empty option: "Select your country"
  - "United States"
  - "Canada"
  - "United Kingdom" 
  - "Australia"
  - "Other"
- Add `data-testid="country-select"`

#### B. Account Type (Radio Buttons)
- Radio button group, required
- Name: "accountType"
- Options:
  - Personal (id="personal", value="personal")
  - Business (id="business", value="business")
  - Student (id="student", value="student")
- Add `data-testid="account-type-personal"`, etc.

#### C. Interests (Checkboxes)
- Checkbox group, optional
- Name: "interests"
- Options:
  - Technology (id="tech", value="technology")
  - Sports (id="sports", value="sports")
  - Music (id="music", value="music")
  - Travel (id="travel", value="travel")
- Add appropriate data-testid attributes

#### D. Biography
- Textarea, optional
- `id="bio"`, `name="bio"`
- `rows="4"`
- `maxlength="500"`
- Placeholder: "Tell us about yourself..."
- Add `data-testid="bio-textarea"`

### Step 6: Terms and Conditions
- Checkbox input, required
- `id="terms"`, `name="terms"`
- `value="accepted"`
- Label text: "I agree to the Terms and Conditions"
- Add `data-testid="terms-checkbox"`

### Step 7: Submit Button
- Button with `type="submit"`
- Text: "Create Account"
- Add `data-testid="submit-button"`

### Step 8: Add Form Validation
Ensure your form includes:
- All required fields have `required` attribute
- Proper input types for semantic validation
- Pattern attributes for format validation
- Min/max length attributes where specified
- Proper min/max dates for date input

## Testing Your Form

### Step 1: Basic Functionality Test
1. Open your HTML file in a browser
2. Try submitting the form without filling required fields
3. Verify that validation messages appear

### Step 2: Input Validation Test
1. Test email field with invalid email addresses
2. Test phone number with incorrect format
3. Test username with invalid characters
4. Test password with less than 8 characters

### Step 3: Radio Button and Checkbox Test
1. Verify only one radio button can be selected
2. Verify multiple checkboxes can be selected
3. Test that required radio button prevents submission

### Step 4: Date and Select Test
1. Try entering dates outside the allowed range
2. Test the country dropdown functionality

## Expected Features
Your completed registration form should have:

- ✅ Proper HTML5 semantic structure
- ✅ All required fields marked appropriately
- ✅ Input validation using HTML5 attributes
- ✅ Accessible labels for all form elements
- ✅ Consistent data-testid attributes
- ✅ Radio buttons for exclusive selection
- ✅ Checkboxes for multiple selection
- ✅ Date input with proper constraints
- ✅ Pattern validation for specific formats
- ✅ Length restrictions where appropriate

## Validation Checklist
Complete this checklist to verify your form:

### Structure and Semantics
- [ ] HTML5 DOCTYPE declaration
- [ ] Proper form element with action and method
- [ ] All inputs have associated labels
- [ ] Form groups are properly structured

### Input Types and Validation
- [ ] Text inputs for names with pattern validation
- [ ] Email input for email address
- [ ] Tel input for phone number with pattern
- [ ] Date input with min/max constraints
- [ ] Password inputs with minimum length
- [ ] All required fields have required attribute

### Form Controls
- [ ] Select dropdown with proper options
- [ ] Radio button group with same name attribute
- [ ] Checkbox group for multiple interests
- [ ] Textarea with character limit
- [ ] Required terms checkbox

### Accessibility and Testing
- [ ] All form elements have unique IDs
- [ ] Labels properly associated with inputs
- [ ] Data-testid attributes on all interactive elements
- [ ] Submit button properly configured

## Common Issues and Solutions

### Issue: Labels Not Working
**Problem**: Clicking labels doesn't focus inputs
**Solution**: Ensure label `for` attribute matches input `id`

### Issue: Radio Buttons Allow Multiple Selection
**Problem**: Multiple radio buttons can be selected
**Solution**: All radio buttons in a group must have the same `name` attribute

### Issue: Form Submits with Invalid Data
**Problem**: Validation not working
**Solution**: Check that `required` attributes are present and input types are correct

### Issue: Pattern Validation Not Working
**Problem**: Invalid formats are accepted
**Solution**: Verify pattern syntax and ensure input has the `pattern` attribute

## Extension Challenges (Optional)

### Challenge 1: Enhanced Validation
Add JavaScript to check that password and confirm password fields match.

### Challenge 2: Dynamic Country States
Add a second dropdown that shows states/provinces when US or Canada is selected.

### Challenge 3: Conditional Fields
Show/hide certain fields based on account type selection.

### Challenge 4: Real-time Validation
Add visual feedback (green/red borders) as users type in fields.

## Reflection Questions
After completing this exercise, consider:

1. How do different input types improve user experience?
2. Why is client-side validation important but not sufficient for web applications?
3. How do data-testid attributes facilitate automated testing?
4. What accessibility considerations did you implement?

## Next Steps
This exercise prepares you for working with forms in real web applications. The patterns and validation techniques you've practiced here are fundamental to creating user-friendly, accessible, and testable web forms.

In the next lesson, you'll learn about CSS selectors, which will help you style forms like these more effectively.