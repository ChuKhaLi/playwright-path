# Exercise 01: Basic Contact Form

## Objective
Create a simple contact form using HTML form elements and input types covered in this lesson.

## Time Estimate
15-20 minutes

## Prerequisites
- Completed reading of Lesson 02 content
- Basic understanding of HTML document structure
- Text editor (VS Code, Notepad++, etc.)
- Web browser for testing

## Instructions

### Step 1: Create the HTML Structure
Create a new HTML file called `contact-form.html` and set up the basic HTML5 document structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Exercise</title>
</head>
<body>
    <!-- Your form will go here -->
</body>
</html>
```

### Step 2: Create the Form Element
Inside the `<body>` section, create a form with the following attributes:
- `action`: Set to "#" (placeholder)
- `method`: Set to "post"
- `data-testid`: Set to "contact-form"

### Step 3: Add Form Fields
Add the following form fields inside your form element:

#### A. Name Field
- Use an `<input>` element with `type="text"`
- Set `id="fullName"` and `name="fullName"`
- Make it required
- Add a proper `<label>` element
- Add `data-testid="name-input"`

#### B. Email Field
- Use an `<input>` element with `type="email"`
- Set `id="email"` and `name="email"`
- Make it required
- Add a proper `<label>` element
- Add `data-testid="email-input"`

#### C. Phone Field
- Use an `<input>` element with `type="tel"`
- Set `id="phone"` and `name="phone"`
- Make it optional (not required)
- Add a proper `<label>` element
- Add `data-testid="phone-input"`

#### D. Subject Selection
- Use a `<select>` element
- Set `id="subject"` and `name="subject"`
- Make it required
- Add these options:
  - Empty option with text "Please select"
  - "General Inquiry"
  - "Technical Support"
  - "Billing Question"
- Add a proper `<label>` element
- Add `data-testid="subject-select"`

#### E. Message Field
- Use a `<textarea>` element
- Set `id="message"` and `name="message"`
- Make it required
- Set `rows="5"`
- Add a proper `<label>` element
- Add `data-testid="message-textarea"`

#### F. Newsletter Subscription
- Use an `<input>` element with `type="checkbox"`
- Set `id="newsletter"` and `name="newsletter"`
- Set `value="yes"`
- Make it optional
- Add a proper `<label>` element
- Add `data-testid="newsletter-checkbox"`

### Step 4: Add Submit Button
Add a submit button:
- Use a `<button>` element with `type="submit"`
- Set the button text to "Send Message"
- Add `data-testid="submit-button"`

### Step 5: Test Your Form
1. Save your HTML file
2. Open it in a web browser
3. Test the following:
   - Try submitting without filling required fields
   - Enter an invalid email address
   - Fill out all fields and submit
   - Check that form validation works

## Expected Output
Your completed form should:
- Have all required fields marked as required
- Show appropriate input types for each field
- Include proper labels for accessibility
- Have consistent data-testid attributes for testing
- Display validation messages for invalid inputs

## Validation Checklist
- [ ] HTML file has proper DOCTYPE and structure
- [ ] Form has correct action, method, and data-testid attributes
- [ ] All form fields have proper labels with correct `for` attributes
- [ ] Required fields are marked with `required` attribute
- [ ] Email field uses `type="email"`
- [ ] Phone field uses `type="tel"`
- [ ] Select dropdown has all specified options
- [ ] Textarea has correct rows attribute
- [ ] Checkbox has proper value attribute
- [ ] Submit button has correct type and data-testid
- [ ] All form elements have appropriate data-testid attributes

## Common Mistakes to Avoid
1. **Missing Labels**: Every form input should have an associated label
2. **Incorrect Input Types**: Use semantic input types (email, tel, etc.)
3. **Missing Required Attributes**: Mark mandatory fields as required
4. **Improper Label Association**: Labels should use `for` attribute or wrap the input
5. **Missing data-testid**: These are crucial for automated testing

## Extension Activities (Optional)
If you complete the basic exercise early, try these enhancements:

1. **Add Styling**: Create a CSS file to make your form look more professional
2. **Add More Input Types**: Include a date field for preferred contact date
3. **Add Field Validation**: Use HTML5 validation attributes like `pattern` and `maxlength`
4. **Group Related Fields**: Use `<fieldset>` and `<legend>` to group related form elements

## Solution Reference
If you get stuck, refer to the `basic-contact-form.html` example in the examples directory, but try to complete the exercise on your own first.

## Troubleshooting Tips

### Form Doesn't Submit
- Check that your button has `type="submit"`
- Ensure all required fields are filled
- Verify the form has proper opening and closing tags

### Validation Not Working
- Make sure required fields have the `required` attribute
- Check that email field uses `type="email"`
- Verify input types are correct

### Labels Not Associated
- Ensure label `for` attribute matches input `id` attribute
- Check for typos in id and for values
- Make sure each input has a unique id

## Next Steps
After completing this exercise, you'll be ready to move on to Exercise 02, where you'll create a more complex registration form with additional input types and validation.